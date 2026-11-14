# NEXORA frontend authentication integration checkpoint

Last updated: 2026-11-11

## Repository-verified implementation

The seller portal at [`seller-portal.html`](../seller-portal.html) now contains the first frontend-to-Supabase integration:

- Supabase Auth signup, password login, session restoration and logout.
- An authenticated call to `public.create_my_store` using the named arguments `p_name`, `p_slug`, `p_country_code`, `p_default_currency` and `p_description`.
- The frontend argument names match the function signature in migration `202611100002_auth_and_store_onboarding.sql`. Signup sets `emailRedirectTo` to the current host's `/seller-portal.html` path so the email-confirmation link returns to the portal.
- The database function derives ownership from `auth.uid()`, validates the store name/slug/country/currency and always inserts a `draft` store. Browser validation is only a usability aid.
- The browser uses the Supabase publishable key. No service-role key or secret key is present in the seller portal source.
- A missing Supabase JavaScript CDN library and network exceptions now produce visible error messages instead of leaving the page in an unhandled failure state.
- The seller dashboard now queries the signed-in user's store through the `stores` table and reads exact product/order counts from `products` and `orders`; the dashboard no longer displays hard-coded zero counts. Store creation navigates to this database-backed summary after the RPC succeeds.
- The registration form uses one account for shopping and selling; the unused buyer/seller selector was removed because no server-enforced account-role model exists yet.

Relevant implementation commits:
- Initial connection: https://github.com/nexora-digital-shop/nexora-shoppage/commit/ce3ce7794ecbee3085d7dd2538c5df45d632c6a2
- Error handling and registration UI correction: https://github.com/nexora-digital-shop/nexora-shoppage/commit/dae29470226cf3fea5cafc265eb46c3c303b180d
- Email confirmation redirect: https://github.com/nexora-digital-shop/nexora-shoppage/commit/39eb4b71e67cd560cf2013102cdb8d2f12877b02

## Checks completed in this repository review

- The current inline JavaScript parses successfully with a JavaScript syntax parser.
- The publishable-key prefix is present; no service-role/secret-key marker was found in the seller portal source.
- The missing-CDN guard is present.
- The frontend RPC argument names match the SQL function signature.

These are static source checks only. They do not prove that Supabase accepts a signup, sends a confirmation email, creates a session, writes a store row, or returns dashboard counts under the live RLS policies.

## Required before live account testing

The owner reported on 2026-11-10 that Supabase Authentication → URL Configuration still had Site URL `http://localhost:3000` and an empty Redirect URLs list. That configuration must be revisited only after a real HTTPS hosting URL exists.

1. Deploy the repository to the chosen free HTTPS host and verify the actual public URL.
2. In Supabase Authentication → URL Configuration, set the Site URL to the exact public host URL and add the exact allowed redirect URL `https://<your-host>/seller-portal.html` (replace the placeholder with the real deployed host). This must match the frontend's `emailRedirectTo` value.
3. Verify the email-confirmation link returns to the hosted seller portal.
4. Test signup, confirmation, login, session persistence, logout and one authenticated store creation with a dedicated test account.
5. Verify the created database row has the authenticated user's ID as owner and `status='draft'`; verify a second store attempt is rejected.
6. Test a second account to confirm it cannot read or modify the first seller's private data.

Do not share passwords, access tokens, service-role keys or payment credentials. Do not enter real customer data during these tests.

## Still incomplete

- The seller dashboard reads the user's store and product/order counts, but is read-only: product CRUD, order details/actions, and profile editing are not implemented.
- Product creation/editing, image storage, public storefront publication, buyer cart, server-side order creation and payment verification are not implemented as live workflows.
- Password reset, account deletion, abuse/rate controls and support operations are not complete.
- The seller portal is currently Indonesian-only; the four-language selector is implemented on the marketplace homepage, not yet throughout the seller portal.
- The seller portal currently depends on the Supabase JavaScript v2 CDN from jsDelivr; the page now shows an error if the library is unavailable, but CDN availability has not been tested across target networks.
- Visual and end-to-end tests on iPhone/iOS Safari, Android Chrome and desktop are outstanding.

A connected login screen is not a production marketplace. Keep real orders and payments disabled until the release gates in [Launch readiness](./LAUNCH-READINESS.md) pass.
