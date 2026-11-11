# NEXORA database foundation

Status: Migrations 001–003 are committed to GitHub. The owner reports that all three were executed in a Supabase project and returned success. The owner also reports that the verification query returned `anon_can_insert_store=false`, `user_can_insert_store=false`, `user_can_update_store=false`, `user_can_insert_profile=false`, `user_can_create_store=true`, and `remaining_policies=13`. These are user-reported results; this assistant has no direct Supabase connection to independently inspect the project.

Migrations (apply in order):
1. `supabase/migrations/202611100001_initial_marketplace.sql` — marketplace schema and RLS.
2. `supabase/migrations/202611100002_auth_and_store_onboarding.sql` — auth profile trigger and secure store creation function.
3. `supabase/migrations/202611100003_store_write_hardening.sql` — removes direct client store writes so sellers cannot self-activate.

See also [Account onboarding](./ACCOUNT-ONBOARDING.md) and [Store access hardening](./STORE-ACCESS-HARDENING.md).

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

This is still a starter schema, not a production-ready backend. Although the owner reports successful execution in Supabase, the schema has not been independently inspected, fully tested with real authenticated and anonymous sessions, or penetration-tested. The seller portal now has an initial Auth connection and calls the store-creation RPC, but product, storefront, order and payment workflows are not connected. Do not rerun migrations blindly; first inspect the Supabase migration history and current schema.

Before accepting real orders:
1. Add server-side endpoints or carefully reviewed database functions for quote creation/acceptance, atomic slot reservation, order creation and cancellation.
2. Complete runtime tests for the auth profile trigger and store-creation function with separate test accounts, including unauthenticated calls, duplicate store creation, and cross-account ownership.
3. Extend migration 003 validation using actual anonymous and authenticated sessions, including attempts to self-activate a store and access another seller's data. The owner-reported SQL checks are an initial permission check, not a full tenant-isolation test. See [Store access hardening](./STORE-ACCESS-HARDENING.md).
4. Recalculate all prices, fees, discounts and totals on the server; never trust browser totals.
5. Add PSP payment-attempt/event tables and signed webhook verification with idempotency. Do not let browser clients set paid status.
6. Add seller verification, moderation/admin access, rate limits, notifications and secure image storage policies.
7. Add tests for cross-seller isolation, buyer privacy, concurrent last-slot reservations, expired quotes and payment replay.
8. Verify backup/restore, monitoring, export and iPhone/Android end-to-end flows before launch.

No credentials, service-role keys, payment secrets or customer data belong in this repository. Never expose a Supabase service-role key in browser code.
