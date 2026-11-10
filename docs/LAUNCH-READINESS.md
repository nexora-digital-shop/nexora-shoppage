# NEXORA — Launch Readiness

Last updated: 2026-11-10

## Verified project status

The repository contains three browser-side prototypes and product/technical specifications:
- `index.html`: ShopPage prototype
- `storefront-demo.html`: storefront/cart/WhatsApp handoff demo
- `seller-dashboard-demo.html`: local seller dashboard demo
- `docs/ORDER-CHECKOUT-MVP.md`: order and checkout requirements
- `docs/FREE-PLAN-POLICY.md`: free plan decision

These are development artifacts. Their existence in GitHub does not mean the service is deployed or safe for real customers.

## Release gates (must pass before public commerce launch)

### 1. Hosting and domain
- Choose a hosting provider with a genuinely usable free tier or obtain explicit approval for paid hosting.
- Configure HTTPS, production environment variables, backups and uptime/error monitoring.
- Deploy and verify the exact public URL on desktop and Android mobile.
- Confirm terms for free-tier limits, sleep/hibernation, bandwidth and commercial use.

### 2. Backend and database
- Create production database schema and migrations for users, seller profiles, stores, products, orders, order items, payment events and subscriptions.
- Enforce tenant isolation: sellers can only access their own stores, products and orders.
- Add server-side validation, rate limits, audit logging and safe file/image upload handling.
- Back up data and test restore.

### 3. Authentication and account security
- Email/password or supported sign-in with verified email.
- Secure password hashing/session handling, password reset and account deletion.
- Role-based access for buyer, seller and platform admin.
- Protect against CSRF, XSS, injection, IDOR and brute-force attempts.
- Never put service-role secrets or payment secrets in browser code.

### 4. Orders and checkout
- Persist orders server-side; calculate prices and totals on the server.
- Use unique order references and idempotency for repeated requests.
- Track pending, paid, failed, cancelled, fulfilled, refunded and disputed states.
- Verify payment status only from signed provider webhooks or provider-side API checks.
- Do not trust a buyer's browser redirect as proof of payment.

### 5. Payments and marketplace compliance
- Select licensed PSP(s) that explicitly support the platform's seller/marketplace model and target countries.
- Verify merchant eligibility, KYC, settlement, split payments, refunds, disputes, currencies and all fees.
- Keep buyer-to-seller checkout distinct from seller-to-NEXORA subscription billing.
- Do not collect card numbers, CVV, OTP, wallet passwords or bank credentials.
- Do not receive and manually redistribute customer funds through an ordinary platform account.
- Initially do not provide an internal stored-value wallet, escrow or money-transfer service.
- Enable only payment methods actually approved for the seller's country and account.

### 6. Plans and billing
- Enforce the agreed Free plan on the server: one product page per account for account lifetime, with at most two successful saved edits after initial creation; preview/cancel/failed saves do not consume edits; locked pages remain viewable/shareable.
- Keep NEXORA branding on Free; no custom domain or premium features.
- Implement paid-plan billing, invoices, cancellations, failed-payment handling and refunds only after terms and provider setup are ready.
- Proposed paid prices are not active offers until product capabilities, billing and support are ready.

### 7. Operations and legal
- Publish accurate Terms, Privacy Policy, refund/cancellation rules and seller prohibited-items policy.
- Establish support contact, incident response, moderation and account suspension process.
- Review applicable Indonesian and target-market privacy, consumer, tax and marketplace/payment obligations with qualified professionals.
- Test accessibility, responsive layouts, localization, currency formatting and time zones.

## Launch rule

Do not announce NEXORA as a live marketplace or accept real customer payments until every critical release gate above is implemented and tested. A static hosting URL alone is not a functioning marketplace.
