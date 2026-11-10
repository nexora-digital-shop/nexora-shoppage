# NEXORA ShopPage — Order and Checkout MVP Specification

Status: Implementation specification and interactive front-end demo. Not production checkout.

## Product goal
NEXORA is intended to become a multi-seller commerce platform. Buyers should be able to discover products, add items to a cart, submit orders, and pay through country-appropriate payment methods. Sellers should manage products, orders, payment status, and fulfillment.

## Newly committed demonstration
- `storefront-demo.html` is an interactive static storefront demo.
- Buyers can add sample products to a cart, change quantities, enter contact/shipping details, and hand off a formatted order to the seller's WhatsApp.
- The demo cart is stored in the buyer's browser only.
- The seller WhatsApp number and sample products are placeholders that must be replaced before demonstration.
- This demo does not persist orders centrally, calculate shipping/tax, authenticate users, collect payment, verify payment, or provide a seller dashboard.
- Do not present this as a live store or real payment checkout.

## Production order lifecycle
1. Draft cart — buyer selects products and quantities.
2. Checkout validation — server checks product availability, seller, price, currency, quantity, shipping region, and required buyer details.
3. Order created — server assigns an immutable order ID and snapshots item names, unit prices, quantities, seller ID, currency, shipping fee, discount, and final total.
4. Payment initiated — create a provider checkout session for the exact order amount and currency.
5. Payment pending — buyer is redirected to hosted PSP checkout or approved payment component.
6. Payment confirmed — only a verified, signed server-to-server PSP webhook can mark the order paid. Browser redirects and screenshots are not proof.
7. Seller fulfillment — seller sees paid order and updates processing, shipped, completed, or cancelled states.
8. Refund/dispute — tracked separately with provider references and an auditable event log.

## Jastip and preorder checkout requirements

The common cart and order system must also support jastiper listings: ready stock, fixed-price preorder/jastip campaigns, and quote-required requests. Before confirmation, buyers must see the sourcing origin, order deadline, estimated arrival window, remaining slots/quantity, item amount, jastip/service fee, shipping and other disclosed charges, currency, seller identity and cancellation/refund terms. Quote-required requests cannot be paid until the seller issues a final, unexpired quote and the buyer accepts it. The server must atomically reserve slots and prevent overselling; immutable order snapshots must preserve the quote, fee breakdown, arrival estimate and terms accepted by the buyer. Sellers update sourcing and delivery milestones; unavailable items, delays, cancellations and refunds must be auditable. Full product requirements: [docs/JASTIP-MVP.md](./JASTIP-MVP.md).

## Minimum server-side data model
- users: id, email, password_hash/provider_subject, role, created_at, status
- stores: id, owner_user_id, name, slug, country, default_currency, status
- products: id, store_id, title, description, price_minor_units, currency, inventory_policy, stock_quantity, status, image_reference
- orders: id, public_order_number, buyer_contact, shipping_snapshot, currency, subtotal_minor_units, shipping_minor_units, total_minor_units, payment_status, fulfillment_status, created_at
- order_items: order_id, product_id, title_snapshot, unit_price_minor_units, quantity, line_total_minor_units
- payment_attempts: id, order_id, provider, provider_payment_id, amount_minor_units, currency, status, created_at
- payment_events: provider_event_id unique, payment_attempt_id, event_type, verified_at, processed_at
- subscriptions: user_id, plan_id, provider_reference, status, period_start, period_end

## Payment architecture
- Separate buyer-to-seller payments from seller-to-NEXORA subscriptions.
- Start with provider-hosted checkout/payment links; avoid collecting card or wallet credentials.
- Choose a licensed PSP only after verifying business-country onboarding, marketplace/platform permission, seller KYC, settlement model, supported countries/currencies, refunds/disputes, fees, and webhook support.
- Indonesia target methods: QRIS, DANA, GoPay, OVO, bank transfer and virtual accounts. ShopeePay is intentionally excluded by product decision.
- Asia-Pacific and global methods are country-aware targets, not guaranteed launch availability.
- Prefer direct seller settlement or a PSP-approved marketplace/split-settlement product. Do not collect and manually redistribute customer funds through an ordinary NEXORA account.
- NEXORA must not issue stored value, hold an internal wallet balance, or operate escrow in the initial release.
- Store monetary values as integer minor units and always bind an order to one currency.
- Webhook processing must verify signatures, enforce idempotency, validate amount/currency/order references, and record events before changing entitlements or order status.

## Zero-upfront-cost implementation guardrails
- Prefer free/open-source development tools and free tiers with adequate limits.
- Confirm current pricing, regional availability, quotas, data location, and commercial-use terms before selecting any hosted backend or payment provider.
- No paid domain, hosting, platform subscription, or paid integration without explicit user approval.
- PSP transaction fees may still apply after sales begin; disclose them clearly.
- Free tiers are not a promise of permanent free production hosting.

## Release gates
- A real order must persist on the server and appear in the correct seller dashboard.
- A buyer cannot change price, currency, seller, or total by editing browser data.
- A forged client-side success redirect cannot mark an order paid.
- Duplicate webhooks cannot duplicate payment or subscription effects.
- Pending, failed, expired, paid, refunded, and disputed states are tested.
- Seller settlement, refunds, privacy, retention, account deletion, and support processes are documented.
- Only payment methods actually approved for the seller and buyer's countries are shown at checkout.
