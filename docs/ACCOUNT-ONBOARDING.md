# NEXORA account and seller onboarding

Status: Requirements, starter database functions and static portal UI prototype committed; no auth provider or live database is connected. See [seller-portal.html](../seller-portal.html).

## Account onboarding flow

1. Buyer or seller creates an account using the configured authentication provider.
2. Email confirmation / provider verification is completed before privileged seller actions.
3. A profile row is provisioned by the database auth trigger.
4. A seller creates one store through the authenticated `create_my_store` database function.
5. Store starts in `draft` state. Public visibility requires a separate publish/review workflow.
6. Seller can then add ready-stock, jastip/preorder, or quote-request listings.

## Security rules

- Store ownership is derived from `auth.uid()`; browser input cannot choose another owner.
- The store-creation function validates store name, URL slug, country code and currency code.
- One-store-per-account is currently enforced by the database unique constraint. Revisit this only if multi-store accounts become an approved product requirement.
- The function is executable by authenticated users only.
- Migration 003 removes direct client insert/update access to stores. Sellers cannot self-activate or change store status; only a future trusted admin workflow may do that.
- Profile rows are created by the Auth trigger; clients cannot insert arbitrary profile rows through the public API.
- Do not expose Supabase service-role keys to the browser.
- Add email verification, rate limiting, abuse detection, account recovery, deletion and seller review before public onboarding.

## Migration

Apply migrations in order after creating a disposable Supabase project:

1. `supabase/migrations/202611100001_initial_marketplace.sql`
2. `supabase/migrations/202611100002_auth_and_store_onboarding.sql`
3. `supabase/migrations/202611100003_store_write_hardening.sql`

See [Store access hardening](./STORE-ACCESS-HARDENING.md) for required security tests.

This migration is committed but has not been run against a Supabase instance. Test signup trigger behavior, duplicate store creation, unauthenticated calls, invalid slugs and cross-account ownership before production.
\n## Seller portal UI prototype\n\nThe static `seller-portal.html` file contains login/register screens, a store onboarding form and a sample seller dashboard. These screens deliberately do not create accounts, authenticate users, or persist store data. Browser-side validation is for user feedback only; the database function remains responsible for validating and deriving ownership from the authenticated server session. Do not collect real credentials or personal data with this prototype.\n