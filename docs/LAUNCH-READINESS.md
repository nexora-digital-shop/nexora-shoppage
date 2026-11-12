# NEXORA — Launch Readiness

Last updated: 2026-11-12

## Repository-verified and owner-reported project status

The repository contains browser-side prototypes, a partially connected seller portal and product/technical specifications:
- `index.html`: ShopPage prototype
- `marketplace.html`: four-language static marketplace demo
- `seller-portal.html`: initial Supabase Auth signup/login/logout and authenticated store-creation RPC integration; runtime unverified
- `storefront-demo.html`: storefront/cart/WhatsApp handoff demo
- `seller-dashboard-demo.html`: local seller dashboard demo
- `docs/ORDER-CHECKOUT-MVP.md`: order and checkout requirements
- `docs/FREE-PLAN-POLICY.md`: free plan decision

The owner reports that a Supabase project exists and migrations 001–003 were executed successfully; reported SQL checks deny direct client store/profile writes and allow the authenticated store-creation RPC. These results have not been independently inspected through a Supabase connection and do not establish production readiness. The seller portal now contains initial Supabase Auth and store-creation RPC calls, but the live flow has not been independently tested. The wider marketplace remains incomplete and no live public deployment is confirmed.

The `marketplace.html` prototype has a static language switcher for Indonesian (`id`), English (`en`), Korean (`ko`) and Japanese (`ja`), with browser-language detection and a locally saved language preference. Translation-key coverage and JavaScript syntax were checked in the repository update. The seller portal now calls Supabase Auth for signup/login/logout and invokes the authenticated `create_my_store` RPC. Its inline JavaScript passed a static syntax parse; the browser uses a publishable key, has a guard for a missing Supabase CDN library, and handles network exceptions. The unused buyer/seller selector was removed because no server-enforced role model exists yet. These are source-level checks only; visual/browser testing, actual Auth/database transactions, real-device testing and localization of the seller portal/storefront remain outstanding. See [Frontend auth integration](./FRONTEND-AUTH-INTEGRATION.md).

## Release gates (must pass before public commerce launch)

### 1. Hosting and domain
- Choose a hosting provider with a genuinely usable free tier or obtain explicit approval for paid hosting.
- Configure HTTPS, production environment variables, backups and uptime/error monitoring.
- Deploy and verify the exact public URL on desktop, Android and iPhone.
- Confirm terms for free-tier limits, sleep/hibernation, bandwidth and commercial use.

### 2. Device, browser and iOS compatibility — mandatory launch gate
- NEXORA must work as a responsive web platform on iPhone/iOS Safari, Android Chrome and modern desktop browsers (Windows/macOS).
- Core buyer and seller journeys must be usable on a real iPhone: sign-up/sign-in, navigation, product creation/editing, image selection/upload, cart, checkout, order status and seller order management.
- Use mobile-first layouts, readable text, touch-sized controls, responsive forms and tables, and layouts that respect iOS safe areas and the on-screen keyboard.
- Test Safari viewport behavior, orientation changes, back/forward navigation, session persistence, file picker/photo library upload, camera permission where offered, and checkout redirects/return flows.
- Test payment-provider hosted checkout on iOS Safari; confirm redirects, deep links if used, 3-D Secure or bank-app handoffs, and return-to-order status behavior.
- Provide browser access without requiring an app download. Do not claim a native iOS App Store app exists unless one is separately built and published.
- Add-to-Home-Screen/PWA support is a progressive enhancement where supported; document iOS-specific limitations and test install, launch, icons and standalone behavior on supported iOS versions.
- Test on physical iPhones and representative iOS versions, not only desktop browser emulation. Record device, iOS version, Safari version, test result and known limitations.
- No public launch until critical buyer and seller workflows pass on iPhone Safari as well as Android and desktop.

### 3. Backend and database
- Starter schema and migrations 001–003 are committed; the owner reports they have been applied to a Supabase project. Migration 004 adds database-side 500-character store-description validation and explicitly limits the onboarding RPC to authenticated callers; it is committed but not yet applied.
- Reported checks: anonymous store insert denied; authenticated direct store insert/update denied; profile insert denied; authenticated `create_my_store` RPC allowed; 13 policies remain.
- Apply migration 004 only after confirming migrations 001–003 are already present, then test the 500/501-character description boundary and RPC grants as documented in [Store onboarding validation](./STORE-ONBOARDING-VALIDATION.md).\n- Independently verify the live schema, auth trigger, RPC behavior, seller-to-seller isolation, order writes, payment events and subscription tables before calling the backend ready.
- Create/confirm production database schema and migrations for users, seller profiles, stores, products, orders, order items, payment events and subscriptions.
- Enforce tenant isolation: sellers can only access their own stores, products and orders.
- Add server-side validation, rate limits, audit logging and safe file/image upload handling.
- Back up data and test restore.

### 4. Authentication and account security
- Owner-reported Supabase Auth URL Configuration currently has Site URL `http://localhost:3000` and an empty Redirect URLs list (2026-11-10); configure the real hosted URL and exact allowed callback paths after Cloudflare Pages is deployed.
- The seller portal now sends email confirmations back to `/seller-portal.html` on the current host. After deployment, add the exact `https://<host>/seller-portal.html` URL to the Supabase Redirect URLs allowlist; do not guess the host before deployment.
- Email/password or supported sign-in with verified email.
- Secure password hashing/session handling, password reset and account deletion.
- Role-based access for buyer, seller and platform admin.
- Protect against CSRF, XSS, injection, IDOR and brute-force attempts.
- Never put service-role secrets or payment secrets in browser code.

### 5. Orders and checkout
- Persist orders server-side; calculate prices and totals on the server.
- Use unique order references and idempotency for repeated requests.
- Track pending, paid, failed, cancelled, fulfilled, refunded and disputed states.
- Verify payment status only from signed provider webhooks or provider-side API checks.
- Do not trust a buyer's browser redirect as proof of payment.

### 6. Payments and marketplace compliance
- Select licensed PSP(s) that explicitly support the platform's seller/marketplace model and target countries.
- Verify merchant eligibility, KYC, settlement, split payments, refunds, disputes, currencies and all fees.
- Keep buyer-to-seller checkout distinct from seller-to-NEXORA subscription billing.
- Do not collect card numbers, CVV, OTP, wallet passwords or bank credentials.
- Do not receive and manually redistribute customer funds through an ordinary platform account.
- Initially do not provide an internal stored-value wallet, escrow or money-transfer service.
- Enable only payment methods actually approved for the seller's country and account.

### 7. Plans and billing
- Enforce the agreed Free plan on the server: one product page per account for account lifetime, with at most two successful saved edits after initial creation; preview/cancel/failed saves do not consume edits; locked pages remain viewable/shareable.
- Keep NEXORA branding on Free; no custom domain or premium features.
- Implement paid-plan billing, invoices, cancellations, failed-payment handling and refunds only after terms and provider setup are ready.
- Proposed paid prices are not active offers until product capabilities, billing and support are ready.

### 8. Operations and legal
- Publish accurate Terms, Privacy Policy, refund/cancellation rules and seller prohibited-items policy.
- Establish support contact, incident response, moderation and account suspension process.
- Review applicable Indonesian and target-market privacy, consumer, tax and marketplace/payment obligations with qualified professionals.
- Test accessibility, responsive layouts, localization, currency formatting and time zones.

## Launch rule

Do not announce NEXORA as a live marketplace or accept real customer payments until every critical release gate above is implemented and tested. iPhone/iOS Safari compatibility is mandatory, not an optional future enhancement. A static hosting URL alone is not a functioning marketplace.


### 9. Free-tier resilience and customer protection — mandatory launch gate
- Treat free plans as infrastructure constraints, never as a reason to risk customer data or money.
- Separate frontend hosting, database, file storage and PSP payment processing so one provider outage does not corrupt all business records.
- Persist orders and immutable item/price snapshots server-side; browser localStorage is never the source of truth.
- If database writes or payment verification are unavailable, fail closed: pause new checkout/payment initiation and display a clear status message. Never claim paid status from a browser redirect, screenshot or client-side event.
- Configure monitoring and warning thresholds for database/storage quotas, bandwidth/egress, API/function limits, authentication email limits, errors and uptime. Act before provider caps are reached.
- Disable automatic paid overages/upgrades where possible. No payment method, paid trial or paid upgrade without explicit owner approval. If a free provider cannot prevent surprise charges, do not use it for customer-critical workloads until risk is resolved.
- Keep database schema migrations and deployment configuration in Git. Maintain exportable copies of database records and uploaded files; document a provider migration procedure.
- Back up data independently of the primary database provider, restrict and encrypt backup access, define retention, and perform a successful restore drill before launch and periodically thereafter. Verify what the chosen Free plan actually includes; do not assume point-in-time recovery or automated backups.
- Test row-level security and seller-to-seller isolation; keep privileged keys and PSP secrets on the server; validate uploads; apply rate limits and audit logging.
- Define internal recovery point and recovery time objectives (RPO/RTO), incident ownership, support process and customer-facing maintenance/status messaging.
- Set conservative launch capacity based on load tests and actual free-tier quotas. Pause onboarding or checkout before reaching unsafe limits; never silently drop an order.
- Do not promise 100% uptime, unlimited usage, or zero data loss. Publish only verified limits and service expectations.
- A free-tier public demo may launch before these controls, but real customer orders and payments remain disabled until every control above is implemented and tested.
