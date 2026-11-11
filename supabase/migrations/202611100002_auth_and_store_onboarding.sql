-- NEXORA migration 002: auth profile bootstrap and safe seller onboarding
-- Status: owner reports this migration was applied to Supabase on 2026-11-10; not independently verified. Do not rerun blindly.
begin;

-- Automatically provision a minimal profile whenever Supabase Auth creates a user.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'preferred_language'), ''), 'id')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Store creation derives ownership from the authenticated session.
-- A new store is always draft; publishing requires a separate reviewed workflow.
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
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_store_id uuid;
  v_name text := trim(coalesce(p_name, ''));
  v_slug text := lower(trim(coalesce(p_slug, '')));
  v_country text := upper(trim(coalesce(p_country_code, '')));
  v_currency text := upper(trim(coalesce(p_default_currency, '')));
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if char_length(v_name) < 2 or char_length(v_name) > 100 then
    raise exception 'Store name must be between 2 and 100 characters' using errcode = '22023';
  end if;

  if v_slug !~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$' then
    raise exception 'Store slug must be 3-50 characters using lowercase letters, numbers and hyphens' using errcode = '22023';
  end if;

  if v_country !~ '^[A-Z]{2}$' or v_currency !~ '^[A-Z]{3}$' then
    raise exception 'Use a two-letter country code and three-letter currency code' using errcode = '22023';
  end if;

  if exists (select 1 from public.stores where owner_user_id = v_user_id) then
    raise exception 'This account already has a store' using errcode = '23505';
  end if;

  insert into public.stores (
    owner_user_id, name, slug, country_code, default_currency, description, status
  )
  values (
    v_user_id, v_name, v_slug, v_country, v_currency,
    coalesce(p_description, ''), 'draft'
  )
  returning id into v_store_id;

  return v_store_id;
end;
$$;

revoke all on function public.create_my_store(text,text,text,text,text) from public;
grant execute on function public.create_my_store(text,text,text,text,text) to authenticated;

commit;
