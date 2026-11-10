# NEXORA — Jastiper / Personal Shopper MVP

Status: Product requirement approved for design. Not implemented or live.

## Product intent

NEXORA must support both ordinary online sellers and jastipers (personal shoppers / proxy buyers) in the same seller platform. A jastiper can publish items they already hold in stock, or offer a limited-time preorder / purchase-on-request service for goods sourced from another city or country.

Jastip is a selling/fulfillment mode, not a separate marketplace or payment wallet.

## Listing types

Each seller listing must declare one of these modes:

1. **Ready stock** — the seller already owns or holds the item. Show verified stock quantity or a clear made-to-order status.
2. **Jastip / preorder** — the seller plans to buy or collect the item after receiving customer requests. Show origin location, trip or order window, order closing time, estimated arrival window, available quantity/slots, and whether the item is confirmed or still subject to availability.
3. **Request item** — buyer submits a product request for the jastiper to quote. No order is confirmed until the seller accepts the quote and the buyer confirms the final total.

Do not label an item as available/confirmed if the jastiper has not secured it.

## Required jastip listing information

- Item title, description, photos, options/variant, quantity limit and condition.
- Seller/jastiper identity and store contact/support route.
- Sourcing origin (city/country) and destination/service area.
- Order opening and closing timestamps with timezone.
- Estimated purchase/trip date and estimated delivery/arrival window.
- Item price and a transparent breakdown of jastip/service fee, estimated or confirmed shipping, and any other disclosed charges.
- Currency for each amount; final checkout total must use one supported checkout currency and clearly explain any conversion/estimate.
- Availability status: accepting requests, request pending confirmation, confirmed to buy, purchased, in transit, arrived, delivered, cancelled, or refunded as applicable.
- Cancellation, substitution, unavailable-item, delay, refund and return terms shown before buyer confirmation.

## Buyer journey

1. Buyer opens a jastip listing and sees its origin, deadline, estimated arrival, stock/slot availability, seller identity and all disclosed charges.
2. Buyer selects variant and quantity, then submits a request or places an order according to the listing's configured confirmation mode.
3. For quote-required requests, seller sends a final item price, service fee, shipping/other charges, delivery estimate and expiry time. Buyer must accept the quote before payment.
4. For fixed-price jastip orders, server validates remaining slots and the listing's terms, then creates a durable order snapshot.
5. Buyer pays through a licensed PSP flow when available. An order is not marked paid until server-side provider verification succeeds.
6. Seller updates purchase and fulfillment milestones. Buyer can see status and receive notifications.
7. If the item cannot be sourced, seller follows the disclosed cancellation/refund process; no silent substitution or undisclosed extra charge.

## Seller / jastiper tools

- Create and manage jastip campaigns and listings.
- Set order window, destination, slot/quantity limit and estimated arrival.
- Review requests, issue and expire quotes, confirm purchase status, and update delivery milestones.
- Track buyer orders, paid/unpaid state, cancellations and refunds.
- Record actual item cost and logistics privately for seller-side margin tracking; never expose private cost data to buyers.
- Pause a campaign or mark it sold out without deleting existing order history.

## Data model additions

Extend the common product/order model rather than building a separate checkout:

- products: listing_mode (ready_stock | jastip_preorder | request_quote), origin_country, origin_city, destination_regions, order_opens_at, order_closes_at, estimated_purchase_at, estimated_arrival_start, estimated_arrival_end, slot_limit, slots_reserved, confirmation_mode, availability_status, terms_version.
- jastip_quotes: id, order/request_id, seller_id, item_amount, service_fee, shipping_amount, other_disclosed_amount, currency, total_amount, expires_at, status, terms_snapshot, created_at.
- orders: add listing_mode_snapshot, origin_snapshot, estimated_arrival_snapshot, terms_snapshot, quote_id where relevant.
- order status events: append-only event history for request, quote, seller confirmation, purchased, in_transit, arrived, delivered, cancelled and refunded milestones.
- Reserve slots atomically when an order/request is accepted; release them safely on expiry/cancellation according to the published rules. Prevent overselling under concurrent requests.

## Trust, safety and compliance

- Seller identity verification and risk controls should be introduced before higher-value or cross-border jastip transactions.
- Require sellers to disclose prohibited/restricted goods policy, customs/import duties, taxes, shipping responsibility, delivery estimates, and who bears risk at each stage.
- Do not imply customs clearance, legal import eligibility, guaranteed delivery dates or insurance unless verified.
- Provide evidence/notes for purchase and shipment milestones while minimizing exposure of personal data.
- Keep buyer-to-seller payment separate from NEXORA subscription billing. Use a PSP-approved marketplace/direct-settlement structure; NEXORA must not hold buyer funds in an internal wallet or manually redistribute them.
- Payment, refund and dispute handling must be consistent with the PSP rules and applicable laws in each seller/buyer market.
- Do not allow hidden post-payment price increases. Any material change requires buyer consent or cancellation/refund under the disclosed terms.

## Acceptance tests

- Seller can publish both ready-stock and jastip listings from one account.
- Buyer can distinguish fixed-price preorder from quote-required request before submitting.
- Closing time and remaining slots are enforced server-side with timezone-safe logic.
- Two buyers cannot reserve the final slot simultaneously.
- Quote totals and expiry are server-validated; expired or changed quotes cannot be paid.
- Item price, service fee, shipping, currency, delivery estimate and terms are snapshotted into the order.
- Seller cannot mark an order paid from the dashboard; payment requires verified PSP confirmation.
- Unavailable item, delay, cancellation, substitution, refund and dispute states are visible and auditable.
- iPhone Safari and Android flows are tested end-to-end before launch.
