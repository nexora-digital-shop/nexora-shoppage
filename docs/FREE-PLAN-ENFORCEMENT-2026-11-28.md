# NEXORA — Free product-page enforcement checkpoint (2026-11-28)

## Work completed in the repository

Added migration `supabase/migrations/202611280006_free_product_page_quota.sql`.

The migration prepares a dedicated `public.product_pages` table rather than treating the existing marketplace product catalog or seller store as the ShopPage itself.

If safely applied after confirming migrations 001–005, it will:

- Enforce one product-page row per authenticated account with a unique `owner_user_id`.
- Start the page at `edit_count = 0` after the initial confirmed save.
- Allow at most two successful update RPC calls. The update is conditional on `edit_count < 2` and increments the counter in the same database statement, so concurrent saves cannot exceed the limit.
- Leave the page published after the second edit; the update function does not change its slug, owner, store or publication status.
- Revoke direct browser insert, update and delete privileges. Authenticated owners can read only their own row through RLS.
- Provide a narrow public read RPC that returns storefront fields but omits owner ID, store ID and edit counter.
- Require HTTPS for optional image and order/contact URLs.
- Accept the 18 page-content language codes already offered by the ShopPage prototype: Indonesian, English, Korean, Japanese, Chinese, Spanish, French, German, Portuguese, Arabic, Hindi, Thai, Vietnamese, Malay, Italian, Dutch, Russian and Turkish.

The database stores a display price and currency code only. It does not create an order, calculate checkout totals, or process a payment.

## Static regression checks

Updated `scripts/check-marketplace.mjs` to inspect migration 006 for:
- One-page-per-owner uniqueness and the 0–2 edit counter constraint.
- RLS and direct-write revocation.
- Authenticated-only create/update RPC grants.
- Empty `search_path` on SECURITY DEFINER functions.
- Atomic edit-count increment and the `edit_count < 2` guard.
- Stable page slug and a public RPC that does not expose private ownership or quota fields.

The workflow already watches `supabase/migrations/**` and the checker file on pushes and pull requests, so these changes should trigger CI. The latest run for these new commits has not yet been verified in this checkpoint.

## Not completed / release blockers

- Migration 006 is committed to GitHub but has **not** been applied to Supabase.
- Migrations 004 and 005 also remain pending unless the live Supabase migration history proves otherwise.
- No live database test has been run for RPC permissions, two-account isolation, duplicate page creation, concurrent edits, or the third-edit rejection.
- `shoppage.html` is still a browser-only builder and is not connected to Supabase Auth or these RPCs.
- The preview-before-save interaction is a required frontend behavior; the migration cannot prove a user saw the preview. The UI must call the create/update RPC only after explicit confirmation.
- The 18 page-content language choices are not a claim that all interface translations are professionally reviewed. The seller portal and marketplace UI currently have four draft interface locales; native-speaker review is outstanding.
- The existing `stores.owner_user_id` foreign key uses `ON DELETE RESTRICT`; account deletion is not currently implemented. A privacy-safe deletion/retention workflow must be designed before production.
- Public image/contact links need safe rendering, external-link protections, and content moderation before public launch.
- No live product CRUD, checkout, order processing, payment integration, public hosting or customer transactions are enabled by this migration.

## Safe application order

1. Open the Supabase project's migration history and inspect the live schema first.
2. Confirm exactly which migrations 001–005 have already run. Do not rerun migrations blindly.
3. Review 004, 005 and 006 as a sequence; apply only missing migrations in order.
4. Use two dedicated test accounts to verify one-page-per-account, owner isolation, edit counts 0 → 1 → 2, rejection of a third edit, failed-save behavior, and public-page field minimization.
5. Only after those tests pass, connect the ShopPage UI and run browser tests with mocked RPC responses plus a controlled live staging test.

## Evidence

- [Migration 006](../supabase/migrations/202611280006_free_product_page_quota.sql)
- [Static checker](../scripts/check-marketplace.mjs)
- [Free plan policy](./FREE-PLAN-POLICY.md)
- [Database foundation](./DATABASE-FOUNDATION.md)
