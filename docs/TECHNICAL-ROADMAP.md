# NEXORA ShopPage — Technical Roadmap

Last updated: 2026-11-10
Status: Planning document. No backend or subscription enforcement is deployed.

## Current verified baseline

- Public GitHub repository: nexora-digital-shop/nexora-shoppage
- Static prototype: index.html
- Prototype supports product details, a live preview, a language selector, currency selection, and standalone HTML export.
- Free-plan policy is recorded in docs/FREE-PLAN-POLICY.md.
- No user authentication, database, server-side quota enforcement, billing, or hosted customer product pages exist yet.
- GitHub Pages (if enabled) can host static files; it cannot securely enforce account-based quotas or subscriptions by itself.
- Replit Agent access previously presented a subscription upgrade gate; do not assume it is available for implementation without a confirmed working app and access.

## Product rules to preserve

Free:
- One product page per account, lifetime.
- Two successful saved edits after initial creation, lifetime.
- Previewing, cancelling, and failed saves do not consume an edit.
- After two saved edits, the page is read-only but remains viewable/shareable.
- NEXORA branding remains visible.
- No custom domain or premium features.

Paid tiers (prices are proposals, not active offers):
- Starter: proposed US$9/month.
- Pro: proposed US$19/month.
- Business: proposed US$39/month.
- Enterprise: custom quote.
Do not advertise or charge these prices until features, billing, terms, support, and refund handling are ready.

## Recommended implementation sequence

### Phase 0 — Product foundation
1. Keep the current static prototype available as a demo, clearly label it as a prototype.
2. Add a product requirements document and acceptance criteria.
3. Define privacy, data retention, account deletion, support, and acceptable-use policies before collecting customer data.

### Phase 1 — Backend and accounts
1. Select a backend only after checking current free-tier limits, regional availability, data location, authentication options, and migration/export capability.
2. Implement verified account registration and sign-in.
3. Create server-side records for users, pages, page revisions, subscriptions, and usage events.
4. Store counters server-side; never trust localStorage, browser JavaScript, or client-submitted edit counts.
5. Add rate limiting and abuse controls. Do not rely on IP-only limits.
6. Provide secure account recovery and deletion.

### Phase 2 — Free-plan quota enforcement
1. On initial page creation, atomically create the user's one Free page.
2. On every save, authenticate the user and verify page ownership and subscription status on the server.
3. For Free accounts, allow a save only while lifetime successful_edit_count is below 2.
4. Increment the counter only after a successful, committed save; use a database transaction or equivalent atomic operation to prevent concurrent requests bypassing the limit.
5. Once the counter reaches 2, reject further Free edits while continuing to serve the published page read-only.
6. Preview and cancelled edits must not increment the counter.
7. Paid entitlement checks must also happen server-side.

### Phase 3 — Public pages and publishing
1. Give each page a stable public URL or slug.
2. Publish only saved, user-approved versions.
3. Sanitize user content and validate image/order URLs.
4. Ensure public pages do not expose private account data.
5. Add basic uptime, backup, and error monitoring.

### Phase 4 — Paid plans
1. Select a payment provider available to the business's legal location and target markets.
2. Implement checkout, subscription webhooks, cancellation, failed-payment handling, invoices/receipts, and entitlement changes.
3. Test webhook signatures and idempotency.
4. Publish transparent pricing, terms, privacy policy, and refund/cancellation policy.
5. Do not unlock paid features based only on a client-side success redirect.

### Phase 5 — Quality and launch
- Test mobile and desktop layouts.
- Test quota boundaries: 0 edits, 1 edit, 2 edits, third edit blocked.
- Test refresh, logout/login, multiple devices, concurrent saves, and account recovery.
- Test upgrade/downgrade/cancellation and payment failure.
- Test export, public links, right-to-left Arabic layout, and all advertised languages.
- Run accessibility, security, and privacy checks.
- Launch only the capabilities that have passed tests.


## Payment and e-wallet services — required product scope

NEXORA must support two separate payment flows:

### A. Buyer pays the seller for a product
- Product pages should be able to show a secure checkout option, not only an external WhatsApp/contact link.
- Target payment methods for Indonesia: QRIS and supported e-wallets such as GoPay, OVO, DANA, and ShopeePay, plus virtual-account/bank transfer and cards where supported by the chosen licensed payment provider.
- International methods and currencies can be added after provider, country, settlement, and compliance support are verified.
- Prefer a licensed payment service provider (PSP) that explicitly supports the intended marketplace/platform model, seller onboarding/KYC, split settlement or direct seller settlement, refunds, disputes, and webhook notifications.
- Decide whether sellers connect their own merchant accounts or whether a compliant marketplace/split-payment arrangement is available. Do not collect buyer funds into an ordinary NEXORA bank account and manually redistribute them.
- NEXORA must not store card numbers, CVV, e-wallet credentials, or payment passwords.
- Store only the minimum transaction metadata needed (provider reference, amount, currency, status, timestamps, seller/page reference) and protect it appropriately.
- Verify payment status on the server using signed webhooks/provider APIs. Never treat a browser redirect or screenshot as proof of payment.
- Handle pending, paid, failed, expired, refunded, and disputed states idempotently.
- Show buyers a clear receipt/order status and give sellers a transaction record.
- Clearly disclose provider fees, settlement timing, refund rules, and supported payment methods.

### B. Seller pays NEXORA subscription
- Separate subscription checkout from buyer-to-seller product checkout.
- Support appropriate recurring billing where the selected provider offers it; otherwise provide a transparent manual renewal option initially.
- Activate or change plan entitlements only after server-verified payment confirmation.
- Handle renewal, failed renewal, cancellation, refunds, and grace periods.

### C. E-wallet boundary and regulatory guardrail
- Initial scope is accepting payments through licensed PSP integrations; NEXORA does not issue or hold a stored-value wallet balance.
- Do not build an internal NEXORA wallet, escrow, stored-value balance, or money-transfer feature in the initial release. These may trigger additional licensing, safeguarding, KYC/AML, and regulatory obligations.
- Before launch in Indonesia or any other market, verify the PSP's current licensing/authorization, merchant eligibility, marketplace capabilities, terms, fees, settlement flows, and applicable local requirements with qualified counsel/compliance support.

### Payment rollout order
1. Phase A: add a safe external payment-link option for sellers, clearly labelled as external checkout.
2. Phase B: integrate one verified PSP for Indonesia after confirming seller onboarding and settlement model.
3. Phase C: add additional local e-wallets/payment methods supported by that PSP.
4. Phase D: add international methods and subscription billing after commercial and legal eligibility checks.

Payment acceptance criteria:
- Buyer checkout status is confirmed server-to-server.
- A forged client-side success event cannot mark an order as paid.
- Duplicate webhooks do not create duplicate orders or entitlements.
- Failed, expired, pending, refunded, and disputed transactions display correct states.
- Seller settlement and refund responsibilities are explicit and tested.
- Subscription payments cannot accidentally mark a buyer's product order as paid, or vice versa.

## Acceptance criteria for Free edit limit

| Scenario | Expected result |
|---|---|
| New Free account creates first page | Allowed |
| Same Free account attempts second page | Blocked with upgrade explanation |
| Preview an edit | Allowed; counter unchanged |
| Cancel an edit | Allowed; counter unchanged |
| Successful first save | Allowed; counter becomes 1 |
| Successful second save | Allowed; counter becomes 2 |
| Failed save | Counter unchanged |
| Third saved edit | Blocked; page remains publicly viewable |
| Reload or sign in on another device | Same server-side counter remains |
| Concurrent third-save attempts | No request bypasses the limit |
| Eligible paid account edits | Allowed according to paid plan limits |

## Cost and safety guardrails

- Do not buy a domain, subscribe to a paid platform, or activate paid infrastructure without the user's explicit approval.
- Before choosing a backend or payment provider, verify current pricing and free-tier limits; free tiers can change and may have usage caps.
- Do not store payment card details directly.
- Collect the minimum personal data necessary.
- Never describe the product as secure, production-ready, multilingual in full, or monetized until those properties have been implemented and tested.
