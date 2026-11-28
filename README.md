# NEXORA
**Technology Without Borders.**

NEXORA is being developed as a multilingual commerce platform for independent sellers.

## Current project files

| File | Purpose | Current limitation |
|---|---|---|
| [Marketplace homepage demo](./marketplace.html) | Responsive four-language marketplace demo (Indonesian, English, Korean, Japanese) with browser-language detection, catalog search/filter, and links to the early-test seller portal | Static demo; sample products only, no real accounts/orders/payments or live hosting; other pages are not yet fully localized |
| [Seller portal](./seller-portal.html) | Four-language seller interface (Indonesian, English, Korean, Japanese), initial Supabase Auth signup/login/logout, authenticated `create_my_store` RPC, and read-only store/product/order count queries | Translations are initial drafts without native-speaker review; runtime flow is not yet independently tested; product CRUD and order actions are not implemented; hosted Auth redirects are not configured |
| [Seller portal localization](./docs/SELLER-PORTAL-LOCALIZATION.md) | Four-language seller UI behavior, scope and QA requirements | Static localization checks only; browser and native-speaker QA remain |
| [ShopPage prototype](./shoppage.html) | Product-page builder concept | Browser-only; no account or cloud save |
| [Storefront demo](./storefront-demo.html) | Sample shop, cart and buyer details | Demo only; WhatsApp handoff stays disabled until the owner configures a verified seller number; no server-side orders or payments |
| [Seller Studio demo](./seller-dashboard-demo.html) | Store settings and product management | Browser local storage only; no shared database |
| [Free plan policy](./docs/FREE-PLAN-POLICY.md) | Agreed free-tier limits | Migration 006 contains server-side quota RPCs but is not applied; ShopPage preview/save UI is not connected |
| [Order & checkout MVP](./docs/ORDER-CHECKOUT-MVP.md) | Order and payment requirements | Specification, not a live checkout |
| [Jastip MVP](./docs/JASTIP-MVP.md) | Jastiper, preorder and quote workflows | Requirements, not yet implemented |
| [Database foundation](./docs/DATABASE-FOUNDATION.md) | Initial PostgreSQL schema and RLS plan | Owner reports migrations 001–003 applied; migrations 004–006 remain pending until checked/applied; live database behavior is not independently inspected |
| [Database security source review](./docs/DATABASE-SECURITY-SOURCE-REVIEW-2026-11-18.md) | Source-level review of RLS, seller ownership and server-only order/quote writes | Static review only; live Supabase grants, policies and migrations remain unverified |
| [Account onboarding](./docs/ACCOUNT-ONBOARDING.md) | Signup/profile/store creation flow | Initial Auth/store RPC and read-only dashboard code are present; live runtime and hosted Auth redirects remain untested |
| [Store access hardening](./docs/STORE-ACCESS-HARDENING.md) | Prevents client-side store creation and self-activation | Owner reports migration applied and direct-write checks returned expected denials; broader runtime tests remain |
| [Store onboarding validation](./docs/STORE-ONBOARDING-VALIDATION.md) | Server-side 500-character store-description limit and onboarding test plan | Migrations 004–005 are committed but still must be applied and tested in Supabase |
| [SECURITY DEFINER search-path hardening](./docs/SECURITY-DEFINER-SEARCH-PATH-2026-11-20.md) | Empty search_path and schema-qualified function references | Migration 005 is committed but not yet applied; source checks are not live database verification |
| [Technical roadmap](./docs/TECHNICAL-ROADMAP.md) | Architecture and milestones | Work in progress |
| [Public competitive scan](./docs/COMPETITIVE-SCAN-2026-11-14.md) | Public GitHub research on jastip and multi-vendor alternatives | Technical/product scan only; no customer or market-size validation |
| [Competitive review update](./docs/COMPETITIVE-REVIEW-2026-11-21.md) | Refreshed public-source comparison of Spree, Mercur, Bagisto, JastipKita, NitipCuy and Titip.in | Public documentation only; no customer validation or independent production audit |
| [Cloudflare Pages deployment](./docs/CLOUDFLARE-PAGES-DEPLOYMENT.md) | Step-by-step no-cost static deployment runbook | Prepared; deployment still requires owner Cloudflare authorization and a real Pages URL |
| [Launch readiness](./docs/LAUNCH-READINESS.md) | Production release gates | Checklist; not yet passed |
| [Repository verification — 2026-11-26](./docs/REPOSITORY-VERIFICATION-2026-11-26.md) | Verified GitHub Actions run 31, checked workflow triggers and documented remaining release gates | Static CI only; no live deployment, Supabase runtime, product CRUD, orders or payments verified |
| [Browser smoke tests — 2026-11-27](./docs/BROWSER-SMOKE-TESTS-2026-11-27.md) | Verified Chromium checks at a 390px mobile viewport for marketplace search/filter/language, seller Korean/Japanese switching, and safe storefront cart behavior | Browser simulation only; Supabase mocked; no physical iPhone Safari, live database, orders or payments verified |
| [Free plan enforcement — 2026-11-28](./docs/FREE-PLAN-ENFORCEMENT-2026-11-28.md) | Migration 006 design for one product page and two successful saved edits per account | Source/static checks only; migration not applied and ShopPage UI not connected |

## Try the prototypes

1. Open the repository root `index.html` to be redirected to [marketplace.html](./marketplace.html), the responsive NEXORA marketplace homepage demo. The former ShopPage builder is preserved at [shoppage.html](./shoppage.html).
2. Open [seller-portal.html](./seller-portal.html) to inspect the four-language account and seller interface. Initial Supabase Auth, store creation and read-only dashboard counts are wired, but do not use real credentials until the hosted URL and Auth redirects have been configured and tested. The translations have not yet received native-speaker review. You can also download the project files or clone the repository.
3. Open `seller-dashboard-demo.html` in a modern browser to add sample products.
4. Open `storefront-demo.html` separately to explore the buyer experience.
5. These are independent browser demos. They do not sync automatically. Do not enter real customer or payment data.

The GitHub file view is source code, not the running application. The root entry point now redirects to the marketplace demo for static hosting. A public live URL is not available until a Cloudflare Pages deployment is configured and verified. See [the deployment runbook](./docs/CLOUDFLARE-PAGES-DEPLOYMENT.md).

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

**Not production-ready.** The owner reports that a Supabase project was created and migrations 001–003 were run successfully. The reported permission checks show direct store/profile writes denied and the authenticated store-creation RPC allowed; this has not been independently inspected through a Supabase connection. The seller portal now contains initial Supabase Auth signup/login/logout, a call to the authenticated store-creation RPC, and read-only queries for the signed-in seller's store/product/order counts, but the live flow has not been independently tested. Migrations 004–005 are committed but not yet confirmed active in Supabase; Auth redirect configuration is incomplete; no verified live deployment, live product/order flow, payment integration, or iPhone/Android end-to-end test is confirmed.

Never use the current demos to collect real orders or payments. Payment credentials, card data, OTPs and wallet credentials must not be collected by these prototype pages.

As of 2026-11-10, Supabase Authentication → URL Configuration shows Site URL `http://localhost:3000` and an empty Redirect URLs list, according to the owner. This is not ready for a hosted login flow; add the eventual Cloudflare Pages URL only after it exists. See [Launch readiness](./docs/LAUNCH-READINESS.md) for the remaining release gates.
