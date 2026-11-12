# NEXORA — Store onboarding validation checkpoint

Last updated: 2026-11-12

## Why this migration exists

The seller portal limits the store description field to 500 characters, but the original database RPC did not enforce that limit. Browser validation is not a security boundary: a caller can invoke Supabase RPC directly without using the form.

Migration `202611120004_store_onboarding_validation.sql` replaces the RPC with the same authenticated ownership checks and adds a server-side 500-character description limit. It also explicitly revokes execution from `PUBLIC` and `anon`, then grants it to `authenticated`.

## Important status

- Migration 001–003: the owner previously reported successful application; this has not been independently verified through a Supabase connection.
- Migration 004: committed to GitHub on 2026-11-12; **not yet applied** to Supabase.
- No live signup, email confirmation, or store-creation transaction has been run by this repository review.
- Do not claim this protection is active in the live database until migration 004 is applied and tested.

## Safe application sequence

1. Open the NEXORA Supabase project.
2. Open **SQL Editor**.
3. Before changing anything, confirm the three earlier migrations have already been applied. Do not rerun them.
4. Open the new migration file in GitHub and copy its complete SQL.
5. Paste it into a new SQL Editor query and review it.
6. Run it once. It uses a transaction; if it fails, stop and inspect the error rather than making partial manual edits.
7. Verify the function definition and grants in Supabase before testing the portal.

Migration source: [202611120004_store_onboarding_validation.sql](../supabase/migrations/202611120004_store_onboarding_validation.sql).

## Required tests after applying

Use a dedicated test account and no real customer information.

- Authenticated store creation with a valid name, unique slug, country and currency should create exactly one row with `status='draft'`.
- A 500-character description should be accepted.
- A 501-character description should be rejected by the database RPC, even when called outside the browser form.
- A second store creation for the same account should be rejected.
- An anonymous caller must not be able to execute `create_my_store`.
- The created row's `owner_user_id` must match the authenticated user's ID.
- Direct client insert/update of `stores` and direct client insert of `profiles` must remain denied.
- A second test account must not read or modify the first account's private store data.

## Rollback and safety

Do not drop or recreate tables to roll back this validation change. If a problem occurs, stop new onboarding and inspect the migration/function state first. Any corrective migration must preserve existing store records and the owner-derived authorization rule.
