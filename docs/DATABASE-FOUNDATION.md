# NEXORA database foundation

Status: Starter migration committed to GitHub; it has **not** been applied to a Supabase project or any live database.

Migrations (apply in order):
1. `supabase/migrations/202611100001_initial_marketplace.sql` — marketplace schema and RLS.
2. `supabase/migrations/202611100002_auth_and_store_onboarding.sql` — auth profile trigger and secure store creation function.

See also [Account onboarding](./ACCOUNT-ONBOARDING.md).

## Included foundations

- Profiles linked to Supabase Auth users.
- One initial store per account, with ownership and public status.
- Shared product catalog supporting ready stock, jastip preorder and quote-request listings.
- Jastip quotes with disclosed fee components, expiry and buyer/seller visibility.
- Durable orders with immutable product, price, currency, shipping, origin, arrival and terms snapshots.
- Order items and append-only order event records.
- Row Level Security (RLS) enabled on every table.
- Public read access limited to published products in active stores.
- Seller access scoped to their own store and products.
- Buyer/seller order reads scoped to participants.
- Order, quote, order-item and event writes intentionally withheld from browser clients until trusted server endpoints/RPCs validate ownership, inventory/slots, totals and payment state.

## Important limitations and next implementation work

This is a starter schema, not a production-ready backend. It has not been executed against PostgreSQL, tested with Supabase Auth, penetration-tested, or deployed. Review and run it in a disposable development project first.

Before accepting real orders:
1. Add server-side endpoints or carefully reviewed database functions for quote creation/acceptance, atomic slot reservation, order creation and cancellation.
2. Test the auth profile trigger and store creation function against a disposable Supabase project before connecting any customer-facing UI.
2. Recalculate all prices, fees, discounts and totals on the server; never trust browser totals.
3. Add PSP payment-attempt/event tables and signed webhook verification with idempotency. Do not let browser clients set paid status.
4. Add seller verification, moderation/admin access, rate limits, notifications and secure image storage policies.
5. Add tests for cross-seller isolation, buyer privacy, concurrent last-slot reservations, expired quotes and payment replay.
6. Verify backup/restore, monitoring, export and iPhone/Android end-to-end flows before launch.

No credentials, service-role keys, payment secrets or customer data belong in this repository. Never expose a Supabase service-role key in browser code.
