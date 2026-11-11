-- NEXORA initial PostgreSQL schema (Supabase-compatible)
-- Status: owner reports this migration was applied to Supabase on 2026-11-10; not independently verified. Do not rerun blindly.
-- Apply only after creating a project and reviewing the security checklist.
begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  preferred_language text not null default 'id',
  country_code char(2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
  description text not null default '',
  country_code char(2) not null,
  default_currency char(3) not null,
  status text not null default 'draft' check (status in ('draft','active','paused','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_user_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  description text not null default '',
  listing_mode text not null default 'ready_stock'
    check (listing_mode in ('ready_stock','jastip_preorder','request_quote')),
  price_minor_units bigint check (price_minor_units is null or price_minor_units >= 0),
  currency char(3) not null,
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  slot_limit integer check (slot_limit is null or slot_limit >= 0),
  slots_reserved integer not null default 0 check (slots_reserved >= 0),
  origin_city text,
  origin_country char(2),
  destination_regions text[] not null default '{}',
  order_opens_at timestamptz,
  order_closes_at timestamptz,
  estimated_arrival_start timestamptz,
  estimated_arrival_end timestamptz,
  availability_status text not null default 'accepting'
    check (availability_status in ('accepting','pending_confirmation','confirmed_to_buy','purchased','in_transit','arrived','sold_out','unavailable','cancelled')),
  status text not null default 'draft' check (status in ('draft','published','paused','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slots_reserved <= coalesce(slot_limit, slots_reserved)),
  check (order_closes_at is null or order_opens_at is null or order_closes_at > order_opens_at),
  check (estimated_arrival_end is null or estimated_arrival_start is null or estimated_arrival_end >= estimated_arrival_start),
  check (listing_mode <> 'ready_stock' or price_minor_units is not null),
  check (listing_mode <> 'jastip_preorder' or (price_minor_units is not null and origin_country is not null))
);

create index if not exists products_store_status_idx on public.products(store_id,status);
create index if not exists products_listing_mode_idx on public.products(listing_mode,status);

create table if not exists public.jastip_quotes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  buyer_user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'requested'
    check (status in ('requested','quoted','accepted','rejected','expired','cancelled')),
  item_amount_minor bigint check (item_amount_minor is null or item_amount_minor >= 0),
  service_fee_minor bigint check (service_fee_minor is null or service_fee_minor >= 0),
  shipping_amount_minor bigint check (shipping_amount_minor is null or shipping_amount_minor >= 0),
  other_amount_minor bigint check (other_amount_minor is null or other_amount_minor >= 0),
  total_amount_minor bigint check (total_amount_minor is null or total_amount_minor >= 0),
  currency char(3) not null,
  quote_expires_at timestamptz,
  seller_message text not null default '',
  terms_snapshot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status not in ('quoted','accepted')
    or (item_amount_minor is not null and service_fee_minor is not null
        and shipping_amount_minor is not null and other_amount_minor is not null
        and total_amount_minor is not null and quote_expires_at is not null)
  )
);

create index if not exists jastip_quotes_buyer_idx on public.jastip_quotes(buyer_user_id,created_at desc);
create index if not exists jastip_quotes_store_idx on public.jastip_quotes(store_id,created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_order_number text not null unique,
  store_id uuid not null references public.stores(id) on delete restrict,
  buyer_user_id uuid not null references auth.users(id) on delete restrict,
  quote_id uuid unique references public.jastip_quotes(id) on delete restrict,
  listing_mode_snapshot text not null
    check (listing_mode_snapshot in ('ready_stock','jastip_preorder','request_quote')),
  buyer_name text not null,
  buyer_phone text not null,
  shipping_snapshot jsonb not null default '{}'::jsonb,
  currency char(3) not null,
  subtotal_minor_units bigint not null check (subtotal_minor_units >= 0),
  shipping_minor_units bigint not null default 0 check (shipping_minor_units >= 0),
  service_fee_minor_units bigint not null default 0 check (service_fee_minor_units >= 0),
  discount_minor_units bigint not null default 0 check (discount_minor_units >= 0),
  total_minor_units bigint not null check (total_minor_units >= 0),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','pending','paid','failed','expired','refunded','disputed')),
  fulfillment_status text not null default 'pending'
    check (fulfillment_status in ('pending','confirmed','purchasing','in_transit','arrived','processing','shipped','completed','cancelled')),
  origin_snapshot jsonb not null default '{}'::jsonb,
  estimated_arrival_snapshot jsonb not null default '{}'::jsonb,
  terms_snapshot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_buyer_idx on public.orders(buyer_user_id,created_at desc);
create index if not exists orders_store_idx on public.orders(store_id,created_at desc);
create index if not exists orders_status_idx on public.orders(payment_status,fulfillment_status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  title_snapshot text not null,
  variant_snapshot jsonb not null default '{}'::jsonb,
  unit_price_minor_units bigint not null check (unit_price_minor_units >= 0),
  quantity integer not null check (quantity > 0),
  line_total_minor_units bigint not null check (line_total_minor_units >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_events_order_idx on public.order_events(order_id,created_at);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists stores_set_updated_at on public.stores;
create trigger stores_set_updated_at before update on public.stores
for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
drop trigger if exists jastip_quotes_set_updated_at on public.jastip_quotes;
create trigger jastip_quotes_set_updated_at before update on public.jastip_quotes
for each row execute function public.set_updated_at();
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

-- Enable RLS everywhere. Sensitive order/payment writes are server-only in this starter.
alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.jastip_quotes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;

create policy "profile owner reads own profile" on public.profiles
for select to authenticated using (id = auth.uid());
create policy "profile owner inserts own profile" on public.profiles
for insert to authenticated with check (id = auth.uid());
create policy "profile owner updates own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "public reads active stores" on public.stores
for select to anon, authenticated using (status = 'active');
create policy "owner reads own stores" on public.stores
for select to authenticated using (owner_user_id = auth.uid());
create policy "owner creates own store" on public.stores
for insert to authenticated with check (owner_user_id = auth.uid());
create policy "owner updates own store" on public.stores
for update to authenticated using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "public reads published products in active stores" on public.products
for select to anon, authenticated using (
  status = 'published' and exists (
    select 1 from public.stores s where s.id = store_id and s.status = 'active'
  )
);
create policy "seller reads own products" on public.products
for select to authenticated using (
  exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid())
);
create policy "seller creates own products" on public.products
for insert to authenticated with check (
  exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid())
);
create policy "seller updates own products" on public.products
for update to authenticated using (
  exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid())
) with check (
  exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid())
);
create policy "seller deletes own products" on public.products
for delete to authenticated using (
  exists (select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid())
);

create policy "buyer or seller reads own jastip quotes" on public.jastip_quotes
for select to authenticated using (
  buyer_user_id = auth.uid() or exists (
    select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid()
  )
);
-- Quote writes intentionally server-only until validated RPC/API endpoints exist.

create policy "buyer or seller reads own orders" on public.orders
for select to authenticated using (
  buyer_user_id = auth.uid() or exists (
    select 1 from public.stores s where s.id = store_id and s.owner_user_id = auth.uid()
  )
);
-- Order writes intentionally server-only: backend must calculate totals and verify payment events.

create policy "buyer or seller reads order items" on public.order_items
for select to authenticated using (
  exists (
    select 1 from public.orders o
    join public.stores s on s.id = o.store_id
    where o.id = order_id and (o.buyer_user_id = auth.uid() or s.owner_user_id = auth.uid())
  )
);
-- Order-item writes intentionally server-only.

create policy "buyer or seller reads order events" on public.order_events
for select to authenticated using (
  exists (
    select 1 from public.orders o
    join public.stores s on s.id = o.store_id
    where o.id = order_id and (o.buyer_user_id = auth.uid() or s.owner_user_id = auth.uid())
  )
);
-- Event writes intentionally server-only; preserve append-only audit history.

commit;
