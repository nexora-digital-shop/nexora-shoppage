# NEXORA — SECURITY DEFINER search-path hardening

Review date: 2026-11-20

## Finding

The committed definitions of `public.handle_new_auth_user()` and `public.create_my_store(...)` used `SECURITY DEFINER` with `SET search_path = public, pg_temp`.

This is not evidence that the live project was exploited. It is a hardening opportunity: a SECURITY DEFINER function executes with its owner's privileges, so object-name resolution inside the function must not be left open to caller-controlled schemas.

## Source guidance

Supabase's current database-functions guidance says to prefer `SECURITY INVOKER` where possible. When `SECURITY DEFINER` is needed, set the search path; with an empty search path, schema-qualify every relation used by the function:

- [Supabase — Database Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

The two NEXORA functions still need elevated privileges for their narrow jobs:
- `handle_new_auth_user()` is called by the Auth user-insert trigger to create the user's profile.
- `create_my_store(...)` derives ownership from `auth.uid()`, validates the request, and inserts a draft store while direct browser writes to protected profile/store tables remain revoked.

## Change prepared

Migration `202611200005_secure_definer_search_path.sql`:

- Replaces both function definitions without altering or deleting table rows.
- Sets `search_path = ''` on both SECURITY DEFINER functions.
- Schema-qualifies relations as `public.profiles` and `public.stores`.
- Qualifies built-in text functions through `pg_catalog`.
- Keeps the store owner derived from `auth.uid()`.
- Keeps the description limit at 500 characters and initial store status at `draft`.
- Revokes the store-creation RPC from `PUBLIC` and `anon`, then grants it to `authenticated`.

The existing Auth trigger is not dropped or recreated; `CREATE OR REPLACE FUNCTION` retains the function identity used by the trigger.

## Application status and safe order

**Migration 005 is committed to GitHub but has NOT been applied to Supabase.** The owner previously reported migrations 001–003 were applied; migration 004 was still pending in the repository review. Do not assume any migration is active without checking the Supabase migration history.

Before applying:
1. Inspect the Supabase migration history and current function definitions.
2. Confirm migrations 001–003 are present.
3. Apply migration 004 if it is still pending.
4. Apply migration 005 once, after 004.
5. Stop and inspect any SQL error; do not rerun earlier migrations or drop tables.

## Verification after application

Inspect the stored function configuration:

```sql
select
  p.proname,
  p.proconfig
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('handle_new_auth_user', 'create_my_store')
order by p.proname;
```

Both functions should show an empty `search_path` setting.

Verify RPC grants:

```sql
select
  has_function_privilege(
    'anon',
    'public.create_my_store(text,text,text,text,text)',
    'EXECUTE'
  ) as anon_can_execute,
  has_function_privilege(
    'authenticated',
    'public.create_my_store(text,text,text,text,text)',
    'EXECUTE'
  ) as authenticated_can_execute;
```

Expected: `anon_can_execute = false` and `authenticated_can_execute = true`.

Then test signup/profile-trigger behavior, store creation, duplicate-store rejection, 500/501-character description boundaries, and isolation with two separate test accounts. Do not use real customer data.

## Limits

The GitHub static checker validates the migration source and required safeguards. It cannot prove that the migration has been applied, that the live database has the expected function configuration, or that the Auth trigger and RPC work in the owner's Supabase project.
