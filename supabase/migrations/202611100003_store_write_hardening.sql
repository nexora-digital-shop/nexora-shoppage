-- NEXORA migration 003: prevent seller-controlled store activation
-- Status: committed hardening migration; NOT applied to a live Supabase project.
-- Store creation must go through create_my_store(); activation is reserved for
-- a trusted admin workflow that has not yet been implemented.

begin;

-- Remove direct owner writes that could let a seller create or promote a store
-- by setting status='active' from an untrusted client.
drop policy if exists "owner creates own store" on public.stores;
drop policy if exists "owner updates own store" on public.stores;

revoke insert, update on table public.stores from anon, authenticated;

-- Profile rows are provisioned by the SECURITY DEFINER auth trigger.
-- Clients may read/update their own non-privileged profile fields, but cannot
-- create arbitrary profile rows through the public API.
drop policy if exists "profile owner inserts own profile" on public.profiles;
revoke insert on table public.profiles from anon, authenticated;

-- Keep the onboarding RPC callable only by signed-in users. Its function body
-- derives owner_user_id from auth.uid() and always inserts status='draft'.
revoke all on function public.create_my_store(text,text,text,text,text) from public;
grant execute on function public.create_my_store(text,text,text,text,text) to authenticated;

commit;
