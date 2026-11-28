# NEXORA ShopPage — Free Plan Policy

Status: Approved product policy. Migration 006 now contains database-side quota enforcement, but it is not applied to Supabase and the UI is not connected.

## Free plan limits

- One product page per account for the lifetime of the account.
- Two successful edits to that page per account for the lifetime of the account, counted after the initial page creation.
- Before an edit is committed, the user must be able to preview the proposed changes.
- Once both edits have been used, the page becomes read-only on the Free plan.
- The published page remains viewable and shareable after the edit allowance is exhausted.
- Further edits require an upgrade to a paid plan.
- NEXORA branding remains visible on Free pages.
- Custom domains and premium features are not included.

## Product and engineering requirements

1. Enforce limits on the server, not only in browser JavaScript or local storage.
2. Associate usage counters with a verified account and store them persistently.
3. Count an edit only after the user confirms and successfully saves the change.
4. Do not consume an edit when previewing, cancelling, or when a save fails.
5. Make the page read-only after the second successful edit while preserving public access.
6. Check subscription status on the server before allowing edits beyond the Free allowance.
7. Add reasonable abuse prevention for duplicate accounts, without blocking legitimate users.
8. Explain the remaining edit count clearly in the interface.

## Current implementation status

The repository now contains `supabase/migrations/202611280006_free_product_page_quota.sql`. If applied after verified migrations 001–005, it creates one product-page row per account, permits at most two successful update-RPC calls, revokes direct browser writes/deletes, and exposes a limited public-page RPC. This is source code only: the migration has not been applied or tested against the live Supabase project, and the ShopPage UI is not connected to these RPCs. Preview-before-save, account deletion/retention, duplicate-account abuse controls, paid-plan entitlements, and real public-page rendering remain unimplemented. Do not describe the Free limits as active until the migration and two-account runtime tests pass.
