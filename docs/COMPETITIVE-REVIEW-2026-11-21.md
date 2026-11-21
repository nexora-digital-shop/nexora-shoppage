# NEXORA — Competitive review update

Research date: 2026-11-21  
Method: review of public GitHub repository metadata and current default-branch README files. This is a public-source product/technical scan only. It is not customer validation, a market-size estimate, or an independent audit of any competitor's live service.

## Executive decision

Keep NEXORA's first release narrow: **multilingual mini-stores for independent sellers and jastipers, structured listings, and buyer inquiries**. Do not attempt to match the full feature surface of a mature multi-vendor commerce engine in the first release.

This decision is based on implementation scope and the public feature claims below—not evidence that customers have chosen NEXORA or that this segment is underserved.

## Competitor findings checked on 2026-11-21

### Spree — broadest documented cross-border and marketplace feature overlap

Source: [spree/spree README](https://github.com/spree/spree/blob/main/README.md)

The current README describes an open-source headless commerce platform with:
- seller onboarding, split orders, commissions, payout ledger with Stripe Connect, and a seller panel in its multi-vendor core;
- market-specific currency, language, payment and shipping configuration;
- product translations and a Next.js storefront;
- REST APIs, TypeScript SDKs, a React admin dashboard and an MCP server.

The README identifies the core as BSD 3-Clause and provides a free hosted sandbox. Its local installation instructions require Node.js 24+, Git and Docker. A hosted sandbox is useful for product inspection, but it does not mean NEXORA can host its own production system at zero infrastructure cost.

**Implication:** multi-vendor and cross-border capabilities are already well served by general commerce platforms. NEXORA should differentiate through a simpler workflow and lower seller setup burden, not by claiming these features are unique.

### Mercur — direct open-source multi-vendor alternative

Source: [mercurjs/mercur README](https://github.com/mercurjs/mercur/blob/main/README.md)

The current README describes an MIT-licensed, headless marketplace layer built on Medusa, including vendor onboarding, multi-vendor catalogs, offers, commissions, automated payouts, admin/vendor panels and storefronts. Its stated local prerequisites include Node.js 20+, PostgreSQL 13+ and Redis. Stripe Connect and other integrations may require additional credentials.

**Implication:** a self-hostable open-source license does not remove the cost and operational work of running PostgreSQL, Redis, application servers, backups, email, payment and monitoring. NEXORA should not adopt this larger stack without a concrete feature or total-cost reason.

### Bagisto — established general Laravel commerce foundation

Source: [bagisto/bagisto README, branch 2.5](https://github.com/bagisto/bagisto/blob/2.5/README.md)

The current README describes Bagisto as an open-source Laravel eCommerce and multi-vendor marketplace platform, with documentation, installation guidance, Docker installation and a broad language/translation footprint.

**Implication:** general catalog, storefront and seller features are not a defensible differentiator by themselves. Bagisto is a possible future build-vs-adopt comparison, not a recommended migration for the current small static/Supabase MVP.

### JastipKita — direct cross-border jastip competitor concept

Source: [erzamadana-ui/jastipkita README](https://github.com/erzamadana-ui/jastipkita/blob/main/README.md)

The current README describes a P2P service connecting Indonesian buyers with overseas travelers, landed-cost disclosure, traveler verification, trust/fraud controls, order state machines and a TypeScript/PostgreSQL web/API/admin/mobile stack. It explicitly says the project is pre-launch and its integrations are mock/sandbox; production requires owner approval.

**Implication:** transparent total cost, traveler trust, capacity, and cross-border order controls are known requirements in the category, not NEXORA-only ideas. NEXORA should initially avoid holding funds or promising escrow.

### NitipCuy — detailed jastip workflow and risk controls

Source: [BurinSn/NitipCuy README](https://github.com/BurinSn/NitipCuy/blob/main/README.md)

The current README describes two services: “Shop for me” (trip-based shopping) and “Carry my item” (collection/carrying). It reports Stage 1 foundation work in progress, a discovery shell using simulated public data, and no active provider, deployment, database or production account. It describes DOKU only as a conditional payment candidate.

**Implication:** route, order window, capacity, item evidence and lifecycle rules matter. These require server-side enforcement and operational controls; a static listing form is not enough for transactions.

### Titip.in — repository claims a live environment; not independently verified here

Source: [titip-in/titip-in-web README](https://github.com/titip-in/titip-in-web/blob/main/README.md)

The current README claims a public website, API and Swagger endpoint, and describes jastip/preloved listings, Laravel, PostgreSQL, Redis, MinIO, authentication, WhatsApp verification and AI/vector search. This review verified the README content only; it did not call the claimed production health endpoint, test registration, or verify transaction availability.

**Implication:** NEXORA should not assume the local jastip/preloved category is uncontested. The claimed live status needs a separate availability and product-flow check before making stronger competitor comparisons.

## Verified facts vs. hypotheses vs. unknowns

### Verified from current public repository content
- Spree and Mercur document broad multi-vendor marketplace functionality.
- Spree documents region-specific currency/language/payment/shipping concepts.
- JastipKita documents a detailed cross-border jastip workflow but labels itself pre-launch with mock/sandbox integrations.
- NitipCuy documents a detailed trip/carry workflow but labels its current stage in progress and describes simulated discovery data.
- Titip.in's README claims a live environment; that claim has not been independently checked.
- These findings come from public project documentation, not from contacting project owners or customers.

### Product hypotheses — not validated
- A seller may prefer a simple mini-store and inquiry workflow over onboarding to a full marketplace.
- Structured jastip fields may reduce repetitive questions and improve buyer clarity.
- Four initial interface languages (Indonesian, English, Korean, Japanese) may help sellers serve cross-border audiences.
- A zero-cost static frontend plus free-tier backend may be enough for a controlled demo, but may not be enough for reliable production operations.

### Still unknown
- Active users, GMV, revenue, retention, conversion and satisfaction for the competitors.
- Whether the Titip.in endpoints and transactions are currently operational.
- Whether independent sellers or jastipers will adopt NEXORA's proposed mini-store workflow.
- Country-specific PSP eligibility, fees, settlement, tax, customs and consumer-protection requirements.
- The practical free-tier capacity and reliability required for a public launch.

## NEXORA product scope decision

### First release
1. One account creates one mini-store.
2. Store owner can create and manage a limited catalog.
3. Listing types: ready stock, jastip/preorder, and quote-required request.
4. Jastip listings disclose origin, destination/service area, order window, expected arrival, available quantity/slots, currency and item/service/shipping charges.
5. Buyers browse and send an inquiry/request. Keep checkout, payment collection, escrow, wallet balances, payouts and “paid” statuses disabled.
6. Indonesian, English, Korean and Japanese interface strings are initial locales; each requires native-speaker review before claiming production-quality localization.

### Release gates before real transactions
- Live Supabase migrations and grants verified.
- Two-account seller-isolation tests pass against the actual database.
- Product CRUD and public visibility rules pass runtime tests.
- Server-side order persistence, validation, abuse controls and audit trail exist.
- Payment-provider eligibility and legal obligations are reviewed before enabling payments.
- Backup/restore, support, refund/dispute, privacy and incident processes are defined.
- Desktop and real iOS/Android browser end-to-end tests pass.

## Research limits and next review

No competitor was contacted. No user/customer interviews, waitlist, sales, or demand tests were performed. Public repository descriptions may be incomplete or promotional and do not prove production quality or commercial traction.

Next useful research step: independently check whether Titip.in's published website/API are reachable and compare only observable public flows. Next NEXORA engineering step remains deployment and live Supabase verification; no production readiness claim is justified before those gates pass.
