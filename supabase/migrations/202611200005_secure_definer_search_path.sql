-- NEXORA migration 005: pin SECURITY DEFINER function search_path
-- Prepared 2026-11-20 after reviewing Supabase's current database-function security guidance.
-- This replaces function bodies only; it does not modify or delete existing rows.
-- Apply after confirming migrations 001-004 are present. Do not rerun older migrations blindly.

begin;

-- Trigger function: keep every relation schema-qualified with an empty search_path.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    coalesce(nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'display_name'), ''), ''),
    coalesce(nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'preferred_language'), ''), 'id')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Store onboarding RPC: derive the owner from the verified auth session.
create or replace function public.create_my_store(
  p_name text,
  p_slug text,
  p_country_code text,
  p_default_currency text,
  p_description text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_store_id uuid;
  v_name text := pg_catalog.btrim(coalesce(p_name, ''));
  v_slug text := pg_catalog.lower(pg_catalog.btrim(coalesce(p_slug, '')));
  v_country text := pg_catalog.upper(pg_catalog.btrim(coalesce(p_country_code, '')));
  v_currency text := pg_catalog.upper(pg_catalog.btrim(coalesce(p_default_currency, '')));
  v_description text := pg_catalog.btrim(coalesce(p_description, ''));
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if pg_catalog.char_length(v_name) < 2 or pg_catalog.char_length(v_name) > 100 then
    raise exception 'Store name must be between 2 and 100 characters' using errcode = '22023';
  end if;

  if v_slug !~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$' then
    raise exception 'Store slug must be 3-50 characters using lowercase letters, numbers and hyphens' using errcode = '22023';
  end if;

  if v_country !~ '^[A-Z]{2}$' or v_currency !~ '^[A-Z]{3}$' then
    raise exception 'Use a two-letter country code and three-letter currency code' using errcode = '22023';
  end if;

  if pg_catalog.char_length(v_description) > 500 then
    raise exception 'Store description must be 500 characters or fewer' using errcode = '22023';
  end if;

  if exists (select 1 from public.stores where owner_user_id = v_user_id) then
    raise exception 'This account already has a store' using errcode = '23505';
  end if;

  insert into public.stores (
    owner_user_id, name, slug, country_code, default_currency, description, status
  )
  values (
    v_user_id, v_name, v_slug, v_country, v_currency, v_description, 'draft'
  )
  returning id into v_store_id;

  return v_store_id;
end;
$$;

-- Keep the RPC callable only by authenticated users.
revoke all on function public.create_my_store(text,text,text,text,text) from public, anon;
grant execute on function public.create_my_store(text,text,text,text,text) to authenticated;

commit;
