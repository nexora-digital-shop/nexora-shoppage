# NEXORA ShopPage — Free Plan Policy

Status: Approved product policy; implementation pending.

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

The current GitHub Pages prototype is a static, browser-only HTML application. It has no authentication, database, server-side usage counter, subscription billing, or public page publishing service. Therefore, this policy must not be represented as technically enforced until a backend and account system are implemented and tested.
