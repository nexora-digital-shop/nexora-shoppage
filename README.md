# NEXORA
**Technology Without Borders.**

NEXORA is being developed as a multilingual commerce platform for independent sellers.

## Current project files

| File | Purpose | Current limitation |
|---|---|---|
| [ShopPage prototype](./index.html) | Product-page builder concept | Browser-only; no account or cloud save |
| [Storefront demo](./storefront-demo.html) | Sample shop, cart and buyer details | Demo only; WhatsApp handoff, no server-side orders or payments |
| [Seller Studio demo](./seller-dashboard-demo.html) | Store settings and product management | Browser local storage only; no shared database |
| [Free plan policy](./docs/FREE-PLAN-POLICY.md) | Agreed free-tier limits | Policy is documented, not yet enforced by a server |
| [Order & checkout MVP](./docs/ORDER-CHECKOUT-MVP.md) | Order and payment requirements | Specification, not a live checkout |
| [Technical roadmap](./docs/TECHNICAL-ROADMAP.md) | Architecture and milestones | Work in progress |
| [Launch readiness](./docs/LAUNCH-READINESS.md) | Production release gates | Checklist; not yet passed |

## Try the prototypes

1. Open the repository on GitHub and download the project files, or clone the repository.
2. Open `seller-dashboard-demo.html` in a modern browser to add sample products.
3. Open `storefront-demo.html` separately to explore the buyer experience.
4. These are independent browser demos. They do not sync automatically. Do not enter real customer or payment data.

The GitHub file view is source code, not the running application. A public live URL is not available until a hosting deployment is configured and verified.

## Product direction

NEXORA is intended to become a responsive, mobile-first, multilingual marketplace accessible through iPhone/iOS Safari, Android browsers, and desktop browsers without requiring an app download, with:
- Seller registration and secure authentication
- Seller storefronts and product/catalog management
- Seller storefronts and product/catalog management for ordinary sellers and jastipers
- Ready-stock sales, fixed-price jastip/preorders, and quote-based item requests with order windows and delivery estimates
- Buyer cart, checkout and order tracking
- Seller order management
- Country- and currency-aware payment methods through eligible licensed payment providers
- Seller subscription plans and plan enforcement
- Admin operations, audit logs, support and abuse controls

## Launch and safety status

**Not production-ready.** iPhone/iOS Safari compatibility is a mandatory launch requirement and has not yet been implemented or tested on a live platform. No production database, authentication, server-side order processing, payment integration, seller verification, or live deployment is currently confirmed.

Never use the current demos to collect real orders or payments. Payment credentials, card data, OTPs and wallet credentials must not be collected by these prototype pages.

See [Launch readiness](./docs/LAUNCH-READINESS.md) for the remaining release gates.
