-- NEXORA migration 006: enforce the Free product-page allowance in PostgreSQL
-- Prepared 2026-11-28. This migration is committed for review; it is NOT applied to Supabase.
-- Apply only after verifying migrations 001-005 in the live migration history.
--
-- The initial product-page save creates the one lifetime page (edit_count = 0).
-- Each successful update RPC consumes exactly one of two saved edits.
-- Direct browser writes and deletes are revoked. Preview/cancel/failed saves do not
-- call the update RPC and therefore do not consume an edit.
-- The existing stores.owner_user_id foreign key uses ON DELETE RESTRICT, so
-- account deletion is not currently supported. Design and test an explicit
-- account-deletion/retention workflow before production launch.

begin;

create table public.product_pages (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete restrict,
  slug text not null unique
    check (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
  title text not null
    check (char_length(title) between 1 and 100),
  description text not null default ''
    check (char_length(description) <= 3000),
  price_amount numeric(20,6) not null
    check (price_amount >= 0),
  currency char(3) not null
    check (currency ~ '^[A-Z]{3}$'),
  locale text not null
    check (locale in ('id','en','ko','ja')),
  image_url text,
  order_url text,
  button_label text not null
    check (char_length(button_label) between 1 and 40),
  edit_count smallint not null default 0
    check (edit_count between 0 and 2),
  status text not null default 'published'
    check (status in ('published','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_user_id)
);

create index product_pages_store_status_idx
  on public.product_pages(store_id, status);

alter table public.product_pages enable row level security;

-- The browser may read only the signed-in owner's row. Public visitors use the
-- narrow get_public_product_page RPC so owner IDs and edit counters stay private.
revoke all on table public.product_pages from public, anon, authenticated;
grant select on table public.product_pages to authenticated;

create policy "owner reads own product page" on public.product_pages
for select to authenticated
using (owner_user_id = (select auth.uid()));

-- Return only storefront fields; never expose owner_user_id, store_id or edit_count.
create or replace function public.get_public_product_page(p_slug text)
returns table (
  slug text,
  title text,
  description text,
  price_amount numeric,
  currency text,
  locale text,
  image_url text,
  order_url text,
  button_label text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.slug,
    p.title,
    p.description,
    p.price_amount,
    p.currency::text,
    p.locale,
    p.image_url,
    p.order_url,
    p.button_label
  from public.product_pages as p
  where p.slug = pg_catalog.lower(pg_catalog.btrim(coalesce(p_slug, '')))
    and p.status = 'published'
  limit 1;
$$;

revoke all on function public.get_public_product_page(text) from public, anon, authenticated;
grant execute on function public.get_public_product_page(text) to anon, authenticated;

-- Create the single Free product page for the authenticated account.
-- The page is published only after the caller has completed its client-side
-- preview and explicitly confirms the initial save.
create or replace function public.create_my_product_page(
  p_store_id uuid,
  p_slug text,
  p_title text,
  p_description text,
  p_price_amount numeric,
  p_currency text,
  p_locale text,
  p_image_url text default null,
  p_order_url text default null,
  p_button_label text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_store_owner uuid;
  v_page_id uuid;
  v_slug text := pg_catalog.lower(pg_catalog.btrim(coalesce(p_slug, '')));
  v_title text := pg_catalog.btrim(coalesce(p_title, ''));
  v_description text := pg_catalog.btrim(coalesce(p_description, ''));
  v_currency text := pg_catalog.upper(pg_catalog.btrim(coalesce(p_currency, '')));
  v_locale text := pg_catalog.lower(pg_catalog.btrim(coalesce(p_locale, '')));
  v_image_url text := nullif(pg_catalog.btrim(coalesce(p_image_url, '')), '');
  v_order_url text := nullif(pg_catalog.btrim(coalesce(p_order_url, '')), '');
  v_button_label text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if p_store_id is null then
    raise exception 'Create your store before creating a product page' using errcode = '22023';
  end if;

  select s.owner_user_id into v_store_owner
  from public.stores as s
  where s.id = p_store_id;

  if not found or v_store_owner <> v_user_id then
    raise exception 'Store not found or not owned by the signed-in account' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.product_pages as p
    where p.owner_user_id = v_user_id
  ) then
    raise exception 'The Free plan allows one product page per account' using errcode = '23505';
  end if;

  if v_slug !~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$' then
    raise exception 'Page slug must be 3-50 lowercase letters, numbers or hyphens' using errcode = '22023';
  end if;

  if pg_catalog.char_length(v_title) < 1 or pg_catalog.char_length(v_title) > 100 then
    raise exception 'Product title must be between 1 and 100 characters' using errcode = '22023';
  end if;

  if pg_catalog.char_length(v_description) > 3000 then
    raise exception 'Product description must be 3000 characters or fewer' using errcode = '22023';
  end if;

  if p_price_amount is null or p_price_amount < 0 then
    raise exception 'Product price must be zero or greater' using errcode = '22023';
  end if;

  if v_currency !~ '^[A-Z]{3}$' then
    raise exception 'Use a three-letter ISO currency code' using errcode = '22023';
  end if;

  if v_locale not in ('id','en','ko','ja') then
    raise exception 'Supported page languages are id, en, ko and ja' using errcode = '22023';
  end if;

  if v_image_url is not null and v_image_url !~ '^https://[^[:space:]]+$' then
    raise exception 'Product image URL must use HTTPS' using errcode = '22023';
  end if;

  if v_order_url is not null and v_order_url !~ '^https://[^[:space:]]+$' then
    raise exception 'Order/contact URL must use HTTPS' using errcode = '22023';
  end if;

  v_button_label := coalesce(
    nullif(pg_catalog.btrim(coalesce(p_button_label, '')), ''),
    case v_locale
      when 'id' then 'Pesan sekarang'
      when 'ko' then '지금 주문'
      when 'ja' then '今すぐ注文'
      else 'Order now'
    end
  );

  if pg_catalog.char_length(v_button_label) > 40 then
    raise exception 'Button label must be 40 characters or fewer' using errcode = '22023';
  end if;

  insert into public.product_pages (
    owner_user_id, store_id, slug, title, description, price_amount,
    currency, locale, image_url, order_url, button_label, edit_count, status
  )
  values (
    v_user_id, p_store_id, v_slug, v_title, v_description, p_price_amount,
    v_currency, v_locale, v_image_url, v_order_url, v_button_label, 0, 'published'
  )
  returning id into v_page_id;

  return v_page_id;
end;
$$;

revoke all on function public.create_my_product_page(uuid,text,text,text,numeric,text,text,text,text,text)
  from public, anon, authenticated;
grant execute on function public.create_my_product_page(uuid,text,text,text,numeric,text,text,text,text,text)
  to authenticated;

-- Each successful call consumes one edit. The slug, owner, store and status are
-- immutable through this RPC, preserving the public share URL and ownership.
create or replace function public.update_my_product_page(
  p_page_id uuid,
  p_title text,
  p_description text,
  p_price_amount numeric,
  p_currency text,
  p_locale text,
  p_image_url text default null,
  p_order_url text default null,
  p_button_label text default null
)
returns smallint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_edit_count smallint;
  v_title text := pg_catalog.btrim(coalesce(p_title, ''));
  v_description text := pg_catalog.btrim(coalesce(p_description, ''));
  v_currency text := pg_catalog.upper(pg_catalog.btrim(coalesce(p_currency, '')));
  v_locale text := pg_catalog.lower(pg_catalog.btrim(coalesce(p_locale, '')));
  v_image_url text := nullif(pg_catalog.btrim(coalesce(p_image_url, '')), '');
  v_order_url text := nullif(pg_catalog.btrim(coalesce(p_order_url, '')), '');
  v_button_label text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if p_page_id is null then
    raise exception 'Product page ID is required' using errcode = '22023';
  end if;

  if pg_catalog.char_length(v_title) < 1 or pg_catalog.char_length(v_title) > 100 then
    raise exception 'Product title must be between 1 and 100 characters' using errcode = '22023';
  end if;

  if pg_catalog.char_length(v_description) > 3000 then
    raise exception 'Product description must be 3000 characters or fewer' using errcode = '22023';
  end if;

  if p_price_amount is null or p_price_amount < 0 then
    raise exception 'Product price must be zero or greater' using errcode = '22023';
  end if;

  if v_currency !~ '^[A-Z]{3}$' then
    raise exception 'Use a three-letter ISO currency code' using errcode = '22023';
  end if;

  if v_locale not in ('id','en','ko','ja') then
    raise exception 'Supported page languages are id, en, ko and ja' using errcode = '22023';
  end if;

  if v_image_url is not null and v_image_url !~ '^https://[^[:space:]]+$' then
    raise exception 'Product image URL must use HTTPS' using errcode = '22023';
  end if;

  if v_order_url is not null and v_order_url !~ '^https://[^[:space:]]+$' then
    raise exception 'Order/contact URL must use HTTPS' using errcode = '22023';
  end if;

  v_button_label := coalesce(
    nullif(pg_catalog.btrim(coalesce(p_button_label, '')), ''),
    case v_locale
      when 'id' then 'Pesan sekarang'
      when 'ko' then '지금 주문'
      when 'ja' then '今すぐ注文'
      else 'Order now'
    end
  );

  if pg_catalog.char_length(v_button_label) > 40 then
    raise exception 'Button label must be 40 characters or fewer' using errcode = '22023';
  end if;

  update public.product_pages as p
  set
    title = v_title,
    description = v_description,
    price_amount = p_price_amount,
    currency = v_currency,
    locale = v_locale,
    image_url = v_image_url,
    order_url = v_order_url,
    button_label = v_button_label,
    edit_count = p.edit_count + 1,
    updated_at = pg_catalog.now()
  where p.id = p_page_id
    and p.owner_user_id = v_user_id
    and p.edit_count < 2
  returning p.edit_count into v_edit_count;

  if not found then
    if not exists (
      select 1 from public.product_pages as p
      where p.id = p_page_id and p.owner_user_id = v_user_id
    ) then
      raise exception 'Product page not found for this account' using errcode = '42501';
    end if;
    raise exception 'The two Free plan edits have been used; this page is read-only' using errcode = '55000';
  end if;

  return v_edit_count;
end;
$$;

revoke all on function public.update_my_product_page(uuid,text,text,numeric,text,text,text,text,text)
  from public, anon, authenticated;
grant execute on function public.update_my_product_page(uuid,text,text,numeric,text,text,text,text,text)
  to authenticated;

commit;
