# NEXORA — database security source review (2026-11-18)

## Scope and evidence

This review examined the committed SQL source files in the default branch:

- `supabase/migrations/202611100001_initial_marketplace.sql`
- `supabase/migrations/202611100002_auth_and_store_onboarding.sql`
- `supabase/migrations/202611100003_store_write_hardening.sql`
- `supabase/migrations/202611120004_store_onboarding_validation.sql`

This is a source-code review only. It is **not** a connection to the owner's Supabase project, a live schema inspection, a penetration test, or proof that every migration is active in the deployed database.

## Controls visible in the committed SQL

1. Row Level Security is enabled for profiles, stores, products, jastip quotes, orders, order items, and order events.
2. Public store reads are restricted to active stores.
3. Public product reads require a published product whose parent store is active.
4. Seller product insert/update/delete policies scope the product's store to a store owned by `auth.uid()`.
5. The initial schema contains read policies, but no client write policies, for jastip quotes, orders, order items, or order events. The SQL comments reserve those writes for trusted server-side operations.
6. Migration 003 removes direct client insert/update policies and table privileges for stores, and removes direct client profile insertion.
7. Migration 004 requires an authenticated user, derives ownership from `auth.uid()`, enforces a 500-character store-description limit, creates the store in `draft` status, revokes the onboarding RPC from `PUBLIC` and `anon`, and grants execution to `authenticated`.

## Remaining risks and gaps

- The owner previously reported migrations 001–003 were applied. That report has not been independently verified. Migration 004 is committed but still marked pending application.
- Static source checks cannot prove the live project's schema, grants, RLS policies, Auth trigger, or RPC match these files.
- Seller product CRUD is permitted by the intended owner-scoped RLS policies in the starter schema, but the live permissions have not been tested and the seller portal does not yet implement product CRUD.
- Product status values include `published`. Public visibility still also depends on the parent store being `active`; a trusted store-review/activation workflow is not implemented. Do not treat a seller-controlled product status as store approval.
- Quote, order, order-item, and order-event writes have no browser-client workflow. Trusted server-side validation, atomic stock/slot reservation, total calculation, payment verification, and idempotent webhook handling are still required.
- Cross-seller isolation, anonymous access, duplicate-store handling, and the 500/501-character boundary still require live tests using separate dedicated test accounts.
- Explicit table grants/default privileges, storage policies, rate limits, audit monitoring, backup/restore, and operational recovery have not been independently verified.

## Required next validation

After the real HTTPS hosting URL exists and migration history is checked:

1. Apply migration 004 once, only after confirming migrations 001–003 are already applied.
2. Test signup, email confirmation redirect, login, session restoration, logout, and store creation.
3. Test authenticated and anonymous RPC calls, duplicate-store rejection, and 500/501-character descriptions.
4. Use two dedicated test accounts to verify seller-to-seller isolation for stores and products.
5. Verify actual table privileges and RLS behavior in the live Supabase project before enabling product CRUD in the public portal.
6. Keep orders, quote acceptance, checkout, and payments disabled until trusted server-side workflows exist.

## Automated source checks added

The repository's Node-based static checker now inspects the migration source for the controls above and rejects obvious regressions. GitHub Actions is configured to run when SQL migrations change, as well as when marketplace/seller frontend code changes.

These automated checks are guardrails for committed source files; they do not replace live database tests.
