# NEXORA
**Technology Without Borders.**

NEXORA is being developed as a multilingual commerce platform for independent sellers.

## Current project files

| File | Purpose | Current limitation |
|---|---|---|
| [Marketplace homepage demo](./marketplace.html) | Responsive marketplace homepage with Indonesian, English, Korean and Japanese language switching, browser-language detection, catalog search/filter and listing-type showcase | Static demo; sample products only, no real accounts/orders/payments or live hosting; other pages are not yet fully localized |
| [Seller portal](./seller-portal.html) | Initial Supabase Auth signup/login/logout and authenticated `create_my_store` RPC call, plus seller dashboard preview | Runtime flow is not yet independently tested; dashboard/product/order data are still placeholders; hosted Auth redirects are not configured |
| [ShopPage prototype](./index.html) | Product-page builder concept | Browser-only; no account or cloud save |
| [Storefront demo](./storefront-demo.html) | Sample shop, cart and buyer details | Demo only; WhatsApp handoff, no server-side orders or payments |
| [Seller Studio demo](./seller-dashboard-demo.html) | Store settings and product management | Browser local storage only; no shared database |
| [Free plan policy](./docs/FREE-PLAN-POLICY.md) | Agreed free-tier limits | Policy is documented, not yet enforced by a server |
| [Order & checkout MVP](./docs/ORDER-CHECKOUT-MVP.md) | Order and payment requirements | Specification, not a live checkout |
| [Jastip MVP](./docs/JASTIP-MVP.md) | Jastiper, preorder and quote workflows | Requirements, not yet implemented |
| [Database foundation](./docs/DATABASE-FOUNDATION.md) | Initial PostgreSQL schema and RLS plan | Owner reports all three migrations applied to Supabase; frontend is not connected and the live database has not been independently inspected |
| [Account onboarding](./docs/ACCOUNT-ONBOARDING.md) | Signup/profile/store creation flow | Supabase project exists per owner report; Auth redirect configuration and frontend connection are still incomplete |
| [Store access hardening](./docs/STORE-ACCESS-HARDENING.md) | Prevents client-side store creation and self-activation | Owner reports migration applied and direct-write checks returned expected denials; broader runtime tests remain |
| [Technical roadmap](./docs/TECHNICAL-ROADMAP.md) | Architecture and milestones | Work in progress |
| [Launch readiness](./docs/LAUNCH-READINESS.md) | Production release gates | Checklist; not yet passed |

## Try the prototypes

1. Open [marketplace.html](./marketplace.html) for the responsive NEXORA marketplace homepage demo.
2. Open [seller-portal.html](./seller-portal.html) to inspect the account and seller interface. The first Supabase Auth and store-creation calls are wired, but do not use real credentials until the hosted URL and Auth redirects have been configured and tested. You can also download the project files or clone the repository.
3. Open `seller-dashboard-demo.html` in a modern browser to add sample products.
4. Open `storefront-demo.html` separately to explore the buyer experience.
5. These are independent browser demos. They do not sync automatically. Do not enter real customer or payment data.

The GitHub file view is source code, not the running application. A public live URL is not available until a hosting deployment is configured and verified.

## Product direction

NEXORA is intended to become a responsive, mobile-first, multilingual marketplace accessible through iPhone/iOS Safari, Android browsers, and desktop browsers without requiring an app download, with:
- Seller registration and secure authentication
- Storefronts and product/catalog management for ordinary sellers and jastipers
- Ready-stock sales, fixed-price jastip/preorders, and quote-based item requests with order windows and delivery estimates
- Buyer cart, checkout and order tracking
- Seller order management
- Country- and currency-aware payment methods through eligible licensed payment providers
- Seller subscription plans and plan enforcement
- Admin operations, audit logs, support and abuse controls

## Launch and safety status

**Not production-ready.** The owner reports that a Supabase project was created and migrations 001–003 were run successfully. The reported permission checks show direct store/profile writes denied and the authenticated store-creation RPC allowed; this has not been independently inspected through a Supabase connection. The seller portal now contains initial Supabase Auth signup/login/logout and a call to the authenticated store-creation RPC, but the live flow has not been independently tested. Auth redirect configuration is incomplete; no verified live deployment, live product/order flow, payment integration, or iPhone/Android end-to-end test is confirmed.

Never use the current demos to collect real orders or payments. Payment credentials, card data, OTPs and wallet credentials must not be collected by these prototype pages.

As of 2026-11-10, Supabase Authentication → URL Configuration shows Site URL `http://localhost:3000` and an empty Redirect URLs list, according to the owner. This is not ready for a hosted login flow; add the eventual Cloudflare Pages URL only after it exists. See [Launch readiness](./docs/LAUNCH-READINESS.md) for the remaining release gates.
