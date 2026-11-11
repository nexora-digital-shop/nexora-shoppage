# NEXORA account and seller onboarding

Status: Requirements, starter database functions and the first Supabase-connected seller portal are committed. The portal now wires signup, login, logout and the authenticated `create_my_store` RPC using the project's publishable key. The owner reports migrations 001–003 were executed successfully, but live runtime behavior has not been independently tested and Auth URL configuration is not yet ready for a hosted frontend. See [seller-portal.html](../seller-portal.html) and [Frontend auth integration](./FRONTEND-AUTH-INTEGRATION.md).

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

The owner reports that these migrations have already been run in Supabase. Before any rerun, inspect the project's migration history and schema; do not apply them a second time blindly:

1. `supabase/migrations/202611100001_initial_marketplace.sql`
2. `supabase/migrations/202611100002_auth_and_store_onboarding.sql`
3. `supabase/migrations/202611100003_store_write_hardening.sql`

See [Store access hardening](./STORE-ACCESS-HARDENING.md) for required security tests.

The owner reports successful migration execution. Runtime tests are still required for signup trigger behavior, duplicate store creation, unauthenticated calls, invalid slugs and cross-account ownership before production. The assistant has not independently inspected the Supabase project.
\n## Seller portal UI prototype\n\nThe `seller-portal.html` file now calls Supabase Auth for signup/login/logout and calls `create_my_store` for authenticated store creation. The seller dashboard remains a placeholder and does not yet load live products or orders. Browser-side validation is for user feedback only; the database function remains responsible for validating input and deriving ownership from the authenticated session. Do not collect real customer data until hosted Auth redirects and the end-to-end flow have been tested.\n