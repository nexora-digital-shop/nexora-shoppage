# NEXORA account and seller onboarding

Last updated: 2026-11-17

## Current implementation status

The repository contains the first Supabase-connected, four-language seller portal at [`seller-portal.html`](../seller-portal.html). The interface has Indonesian, English, Korean and Japanese draft translations through [`seller-portal-i18n.js`](../seller-portal-i18n.js). Browser-language detection and a manually selectable, browser-persisted preference are implemented:

- Email/password signup, login, session restoration and logout are wired to Supabase Auth.
- Authenticated store creation calls `public.create_my_store` through the Supabase RPC.
- The database function derives ownership from `auth.uid()` and creates a `draft` store.
- After store creation, the portal queries the signed-in user's store and reads product/order counts. This dashboard is read-only; product CRUD and order management are not implemented.
- The portal uses the project's publishable key, not a service-role key.
- Seller portal language selection is independent of the marketplace selector. The translations are initial drafts, not native-speaker-reviewed copy; see [Seller portal localization](./SELLER-PORTAL-LOCALIZATION.md).
- These are repository-verified source-code facts. Live signup, email confirmation, database writes, RLS behavior and dashboard reads have not been independently tested.

The owner previously reported migrations 001–003 were applied successfully. Migration 004 is committed but remains pending application and verification. The assistant has no direct connection to the owner's Supabase project.

## Account onboarding flow

1. A buyer or seller creates one account through Supabase Auth.
2. Email confirmation is completed if required by the project's Auth settings.
3. A database Auth trigger provisions the profile row.
4. The authenticated user creates one store through `create_my_store`.
5. The database assigns the owner from `auth.uid()`; the client cannot choose another owner.
6. The store is created with `status='draft'`. Public visibility requires a separate trusted publish/review workflow, which is not implemented.
7. Product creation and order management remain future implementation work.

## Security rules

- Store ownership must always be derived from the authenticated session, never from a user-supplied owner ID.
- The store-creation function validates the store name, URL slug, country code and currency code.
- Migration 004 adds database-side validation limiting the store description to 500 characters and explicitly grants RPC execution to authenticated users only. It is committed but not yet confirmed active in Supabase.
- One-store-per-account is enforced by the current database design.
- Direct client insert/update access to stores and direct client profile insertion are intended to remain denied.
- Sellers must not be able to activate, pause or suspend their own stores.
- Never expose a Supabase service-role/secret key in browser code.
- Add and test account recovery, account deletion, abuse controls, rate limits, moderation and support before public onboarding.

## Migration status

The owner reports successful execution of:

1. `supabase/migrations/202611100001_initial_marketplace.sql`
2. `supabase/migrations/202611100002_auth_and_store_onboarding.sql`
3. `supabase/migrations/202611100003_store_write_hardening.sql`

Migration 004 is pending:

- `supabase/migrations/202611120004_store_onboarding_validation.sql`

Before applying or rerunning anything, inspect Supabase migration history and current schema. Do not rerun migrations 001–003 blindly. See [Store onboarding validation](./STORE-ONBOARDING-VALIDATION.md) and [Store access hardening](./STORE-ACCESS-HARDENING.md).

## Required live tests before real users

Use dedicated test accounts and no real customer information:

1. Confirm the deployed HTTPS host is configured in Supabase Authentication → URL Configuration.
2. Test signup and email confirmation redirect to `/seller-portal.html`.
3. Test login, session restoration and logout.
4. Create one store and verify its `owner_user_id` matches the authenticated user's ID and its status is `draft`.
5. Confirm duplicate store creation is rejected.
6. After migration 004 is applied, verify 500-character descriptions are accepted and 501-character descriptions are rejected by the database.
7. Use a second account to test that one seller cannot read or modify another seller's private store data.
8. Confirm anonymous users cannot call the onboarding RPC or directly write protected store/profile records.

Do not enter real customer data or accept real orders/payments until these tests and the broader release gates pass.
