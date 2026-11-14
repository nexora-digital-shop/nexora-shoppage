# NEXORA — Public Competitive Scan

Research date: 2026-11-14  
Scope: public GitHub repository search results and project READMEs. This is a technical/product landscape scan, not a market-size study, sales analysis, or customer-validation study.

## Executive finding

NEXORA is entering an existing category, not an empty market. Public projects already describe direct jastip/personal-shopper marketplaces and mature open-source multi-vendor commerce platforms. The strongest near-term risk is scope: trying to launch a Shopee-scale marketplace with payments, payouts, disputes, moderation, cross-border compliance and international localization on Rp0 is not realistic as a first release.

A narrower first product is more defensible operationally: a mobile-first multilingual storefront/catalog for independent sellers and jastipers, with structured ready-stock, preorder and quote-request listings. Initially, buyer actions should be limited to inquiries/request submission; do not enable NEXORA-held funds, escrow, seller payouts or payment status claims until a compliant PSP flow and server-side order system are implemented.

This is a product-scope recommendation, not proof of demand or a claim that the niche is underserved.

## Direct jastip / personal-shopper references

### 1. JastipKita

Source: [erzamadana-ui/jastipkita README](https://github.com/erzamadana-ui/jastipkita/blob/main/README.md)

The README describes a P2P jastip marketplace connecting buyers in Indonesia with travelers abroad, initially naming Japan, Singapore, South Korea, Malaysia, Australia and the United States. It emphasizes:
- landed-cost transparency (item price, traveler fee, estimated duties/tax and platform fee);
- traveler verification and a cross-border fulfillment workflow;
- payment funds held through a licensed payment partner (the README names Xendit SafePay);
- a modular TypeScript/PostgreSQL API, web, admin and Flutter mobile applications.

The README explicitly labels the project pre-launch and says integrations are mock/sandbox rather than live. Its listed unit, SQL and API test counts are maintainer-reported, not independently run in this scan.

**Implication for NEXORA:** transparent total-cost disclosure, traveler trust and cross-border order states are already recognized product requirements in this niche. NEXORA should not treat these as unique differentiators.

### 2. NitipCuy

Source: [BurinSn/NitipCuy README](https://github.com/BurinSn/NitipCuy/blob/main/README.md)

The README describes two jastip services:
- “Shop for me”: a jastiper publishes trips, order windows, products/requests, rates, capacity and estimated arrival.
- “Carry my item”: a customer hires a jastiper to collect or carry an item under route/weight terms.

It emphasizes trip discovery, reusable public information, protected orders, capacity reservation, trust/abuse controls and provider-independent payment ports. The README says its first platform stage is in progress, trip discovery uses simulated public data, and no provider/deployment/database/production account is active. DOKU is described only as a conditional payment candidate.

**Implication for NEXORA:** trip windows, capacity and clear order-state rules are important in jastip, but implementing them safely requires backend transactions and operational controls—not only a listing form.

### 3. Titip.in

Source: [titip-in/titip-in-web README](https://github.com/titip-in/titip-in-web/blob/main/README.md)

The repository README describes Titip.in as a jastip and preloved marketplace. It lists a live website/API, Laravel 13, PostgreSQL, Redis, MinIO, Google OAuth, WhatsApp verification and AI/vector search.

The existence of the public repository is verifiable. The README's live-service and feature claims were not independently tested during this scan.

**Implication for NEXORA:** there is already a public project positioning around jastip plus preloved goods and advanced search. NEXORA needs a clearer segment or workflow advantage rather than simply adding more feature labels.

## General multi-vendor commerce alternatives

### 4. Bagisto

Source: [bagisto/bagisto README](https://github.com/bagisto/bagisto/blob/2.5/README.md)

The README describes Bagisto as an open-source Laravel eCommerce and multi-vendor marketplace platform. It is a broad commerce foundation, rather than a jastip-specific product.

### 5. Spree

Source: [spree/spree README](https://github.com/spree/spree/blob/main/README.md)

The README describes an open-source headless commerce platform and lists multi-vendor capabilities including seller onboarding, orders split by seller, commissions, a payout ledger with Stripe Connect and a seller panel. It also describes market-specific currency/language/payment configuration and translations. The README identifies the core license as BSD 3-Clause.

### 6. Mercur

Source: [mercurjs/mercur README](https://github.com/mercurjs/mercur/blob/main/README.md)

The README describes an open-source multi-vendor marketplace platform built on Medusa, with vendor onboarding, multi-vendor catalogs, offers, commissions, payouts, admin/vendor panels and storefronts. It identifies the core license as MIT.

**Implication for NEXORA:** standard seller onboarding, product catalogs, commissions and multi-vendor panels are available in established open-source projects. Rebuilding a general-purpose commerce engine from scratch may create unnecessary technical debt. NEXORA should retain its smaller current stack for a constrained MVP unless a future cost/feature review justifies adopting a larger platform.

## What is verified, inferred and unknown

### Verified from public repository content
- Multiple public projects describe jastip/personal-shopper marketplace workflows.
- At least two direct jastip repositories (JastipKita and NitipCuy) explicitly describe cross-border/trip-based sourcing, capacity or trust controls.
- General open-source platforms describe mature multi-vendor capabilities.
- JastipKita and NitipCuy README status sections describe pre-launch/in-progress or mock/sandbox states; Titip.in README claims a live environment.

### Hypotheses — not validated with customers
- A simpler multilingual storefront/catalog may be easier to launch and operate than a full marketplace with escrow, payouts and disputes.
- A combined independent-seller + jastiper mini-store workflow could appeal to small sellers who do not want a complex marketplace onboarding process.
- Indonesian, English, Korean and Japanese support may help cross-border sellers, but localization alone is unlikely to be a sufficient competitive advantage.

### Unknown / not established by this scan
- Market size, active users, GMV, revenue, retention, conversion, seller acquisition cost or customer satisfaction for any named project.
- Whether the live Titip.in services are currently available and reliable.
- Whether target sellers prefer a standalone mini-store, a marketplace listing, or a social-commerce workflow.
- Payment-provider eligibility, fees, settlement and legal requirements for NEXORA's intended countries.
- Whether any competitor has meaningful adoption in the exact seller segment NEXORA will target.

## Recommended NEXORA first-release scope

1. One seller account can create one simple store.
2. A seller can publish a small catalog with three listing modes: ready stock, jastip/preorder and quote-required request.
3. Jastip listings must show origin, destination/service area, order window, estimated arrival, quantity/slot limit, availability state, currency and disclosed service/shipping charges.
4. Buyers can browse and send an inquiry/request; no NEXORA escrow, stored-value wallet, internal balance, payout or “paid” status.
5. Keep product-page publishing and the agreed Free-plan limits server-enforced before claiming they are active.
6. Start with Indonesian, English, Korean and Japanese for the public storefront; localize seller and buyer workflows before advertising full multilingual coverage.
7. Keep real checkout disabled until server-side order persistence, seller isolation, payment-provider approval, signed webhook verification, refund/dispute handling, backups and iPhone/Android end-to-end tests pass.

## Strategic decision to revisit

The current NEXORA repository mixes a product-page builder, a broad marketplace and jastip workflows. Before implementing more modules, keep the first launch centered on **multilingual mini-stores plus jastip-ready listings and buyer inquiries**. Treat a full transactional marketplace as a later phase funded by actual revenue and explicit owner approval.

No competitor was contacted. No customer interviews, sales or demand tests were performed. No claim of market validation is made.
