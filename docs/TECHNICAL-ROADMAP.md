# NEXORA ShopPage — Technical Roadmap

Last updated: 2026-11-10
Status: Planning document. No backend or subscription enforcement is deployed.

## Current verified baseline

- Public GitHub repository: nexora-digital-shop/nexora-shoppage
- Static prototype: index.html
- Interactive storefront demo: storefront-demo.html; sample cart and WhatsApp order handoff only, with no server-side order persistence or integrated payment processing.
- Seller dashboard prototype: seller-dashboard-demo.html; local-only store settings and product CRUD with JSON backup/import, no account or server sync.
- Order and checkout implementation specification: docs/ORDER-CHECKOUT-MVP.md.
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

## Zero-upfront-cost stack candidate

See [docs/FREE-STACK-DECISION.md](./FREE-STACK-DECISION.md) for the current no-cost candidate: GitHub for source, Cloudflare Pages Free for frontend hosting, and Supabase Free for authentication, PostgreSQL and initial image storage. These services are not yet connected or deployed; verify current free-tier terms and avoid any paid upgrade. Replit app creation was blocked by an active-subscription requirement and is no longer the chosen route.

## Recommended implementation sequence

### Phase 0 — Product foundation
1. Keep the current static prototype available as a demo, clearly label it as a prototype. Build the real web frontend mobile-first and deploy via Cloudflare Pages Free only after the free deployment path is verified.
2. Add a product requirements document and acceptance criteria.
3. Define privacy, data retention, account deletion, support, and acceptable-use policies before collecting customer data.

### Phase 1 — Backend and accounts
1. Evaluate the Supabase Free candidate against current free-tier limits, regional availability, data location, authentication options, backups, and migration/export capability. If any paid commitment is required, stop and evaluate another free option.
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
- Mandatory platform coverage: responsive web access on iPhone/iOS Safari, Android Chrome, and modern desktop browsers on Windows/macOS. No app download should be required for core web access.
- Build mobile-first layouts with touch-friendly controls, readable typography, responsive seller dashboards/forms, and iOS safe-area/keyboard handling.
- Test the complete buyer and seller journeys on physical iPhones: authentication, navigation, product editing, photo-library/file uploads, cart, checkout, payment-provider redirects/app handoffs, order status, and seller order management.
- Test iOS Safari viewport/orientation behavior, session persistence, browser navigation, and checkout return flows across representative iOS versions.
- Treat Add to Home Screen/PWA as progressive enhancement; verify supported iOS behavior and document limitations. Do not describe NEXORA as a native App Store app unless separately built and published.
- Record device/iOS/Safari versions and results; critical iPhone Safari failures block launch.
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
- Target payment methods for Indonesia: QRIS; DANA, GoPay, and OVO e-wallets; bank transfers and virtual accounts; and cards where supported by the chosen licensed payment provider. ShopeePay is excluded by product decision.
- International methods and currencies can be added after provider, country, settlement, and compliance support are verified.
- Prefer a licensed payment service provider (PSP) that explicitly supports the intended marketplace/platform model, seller onboarding/KYC, split settlement or direct seller settlement, refunds, disputes, and webhook notifications.
- Decide whether sellers connect their own merchant accounts or whether a compliant marketplace/split-payment arrangement is available. Do not collect buyer funds into an ordinary NEXORA bank account and manually redistribute them.
- NEXORA must not store card numbers, CVV, e-wallet credentials, or payment passwords.
- Store only the minimum transaction metadata needed (provider reference, amount, currency, status, timestamps, seller/page reference) and protect it appropriately.
- Verify payment status on the server using signed webhooks/provider APIs. Never treat a browser redirect or screenshot as proof of payment.
- Handle pending, paid, failed, expired, refunded, and disputed states idempotently.
- Show buyers a clear receipt/order status and give sellers a transaction record.
- Clearly disclose provider fees, settlement timing, refund rules, and supported payment methods.

### A1. International e-wallets and payment-method standards

The payment strategy must cover three geographic markets from the product-design stage: **Indonesia, the wider Asia-Pacific region, and international markets worldwide**. The integration must be country-aware and modular. Do not assume one wallet or payment method works in every country. Display only methods that are enabled for the buyer's country/currency and that the seller's PSP account is eligible to accept.

Product decision for Indonesia: ShopeePay is intentionally excluded from NEXORA's Indonesian payment-method scope. The initial Indonesia target list is QRIS, DANA, GoPay, OVO, bank transfers, and virtual accounts, subject to PSP availability and eligibility.

Geographic coverage to design for:
- Indonesia: QRIS, bank virtual accounts/transfers, and supported e-wallets: DANA, GoPay, and OVO.
- Asia-Pacific: evaluate country-specific methods as relevant to each launch market, including Alipay and WeChat Pay (China), PayPay and convenience-store/bank methods (Japan), Kakao Pay and Naver Pay (South Korea), GrabPay and regional bank-transfer/real-time payment methods (Southeast Asia), UPI (India), and other locally established methods in markets such as Singapore, Malaysia, Thailand, the Philippines, Vietnam, and Hong Kong.
- International: cards and digital wallets such as Visa, Mastercard, American Express, Apple Pay, Google Pay, and PayPal, plus locally preferred bank and account-to-account methods in Europe, the Americas, the Middle East, Africa, and other target regions.
- This is a coverage target and evaluation list, not a claim that every method or country will be supported at launch. Actual availability depends on seller legal entity/country, buyer country, currency, PSP acquiring reach, business category, transaction type, settlement options, and compliance approval.

- Global card rails where supported: Visa, Mastercard, American Express, and other networks supported by the PSP.
- Global device wallets where supported: Apple Pay and Google Pay.
- International digital wallets / regional examples to evaluate with the PSP: PayPal, Alipay, WeChat Pay, Kakao Pay, Naver Pay, and other locally important wallets in target markets.
- Local bank-transfer and account-to-account methods should be considered alongside e-wallets; examples include UPI in India, Pix in Brazil, iDEAL in the Netherlands, and Bancontact in Belgium.
- These are target methods to evaluate, not a promise that every method is available at launch. Availability depends on merchant country, buyer country, currency, PSP contract, transaction type, and compliance approval.
- Use a provider-hosted checkout or tokenized payment components. NEXORA must not collect or store wallet login credentials, one-time passwords, card numbers, or CVV.
- The checkout must show the buyer the actual available methods, final amount/currency, fees (if any), and seller identity before confirmation.
- Normalize provider responses into common NEXORA order states while retaining the provider's transaction reference for reconciliation.
- Build the integration so new PSPs and payment methods can be added without rewriting the product-page or order system.

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


## Free-tier resilience and customer-protection requirements

The free stack is acceptable for development and controlled validation only. Real customer commerce must remain disabled until these requirements pass:

- Persist every order and price/item snapshot in the server database; browser storage is never authoritative.
- Separate frontend hosting, PostgreSQL, object storage and PSP processing to reduce single-provider failure risk.
- Fail closed during database or payment-verification outages: stop new checkout initiation and show a clear message. Never infer payment success from a client redirect or screenshot.
- Monitor quotas (database, storage, bandwidth/egress, API/functions, auth emails), error rates and uptime; alert before limits and pause onboarding/checkout before unsafe capacity is reached.
- Disable automatic paid overages where possible; no card attachment, trial or upgrade without owner approval.
- Keep schema migrations in Git and use portable PostgreSQL/data formats where practical. Document and test export/migration of database rows and uploaded files.
- Maintain independent encrypted backups with restricted access and retention; test restoration before launch. Verify actual Free-plan backup capabilities rather than assuming provider backups.
- Test row-level security and seller tenant isolation; keep privileged database and PSP secrets server-side.
- Define RPO/RTO, incident ownership, customer support and maintenance/status messaging.
- Publish only verified limits; never promise unlimited usage or 100% uptime.
- A public demo may be hosted on free infrastructure, but real orders/payments are blocked until backup/restore, monitoring, security, safe-failure and migration controls have passed.

See [docs/FREE-STACK-DECISION.md](./FREE-STACK-DECISION.md) and [docs/LAUNCH-READINESS.md](./LAUNCH-READINESS.md) for detailed acceptance gates.
