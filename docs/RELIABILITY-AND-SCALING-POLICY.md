# NEXORA — Reliability, Capacity and Scaling Policy

Last updated: 2026-11-10

## Product decision

NEXORA must not impose infrastructure-quota interruptions on ordinary customer use. Customers should not see "free quota exhausted", forced downtime caused by a sleeping free-tier service, or failed orders because the platform selected an undersized development plan.

This is a product requirement, not a claim that infrastructure is literally unlimited or can never fail.

## Important distinction

- **Rp0 development:** use free tools to build and validate prototypes without paid commitments.
- **Production commerce:** do not expose real customer transactions on infrastructure whose free-tier caps, suspension, hibernation, or lack of recovery guarantees can predictably interrupt service.
- **Customer pricing:** infrastructure costs are NEXORA's operating costs, not a surprise quota wall shown to customers. The business must fund capacity through revenue, investment, or an explicitly approved budget.
- **No unauthorized spending:** never enable paid upgrades, paid overages, trials, domains, or payment methods without the owner's explicit approval.

## Production architecture requirements

1. Use production-grade hosting and database services with documented availability, capacity, backup, support and commercial-use terms appropriate to expected traffic.
2. Avoid single points of failure for critical services. Design independent backups, tested restoration and a documented recovery/migration path.
3. Keep the frontend, database, object storage, queues/background jobs and payment provider loosely coupled.
4. Store orders and immutable item/price snapshots durably on the server before initiating payment. Browser storage is never authoritative.
5. Use queue/retry patterns for non-instant work such as email, image processing and webhook retries. Make payment/order operations idempotent.
6. Monitor uptime, latency, errors, database/storage capacity, bandwidth, queue depth and provider quotas with alerts before thresholds become critical.
7. Capacity-plan and load-test for launch, expected growth and traffic spikes. Scale vertically/horizontally before customers experience resource exhaustion.
8. Use a safe degradation mode: if order persistence or payment verification is unavailable, stop initiating new payments, preserve existing orders and communicate status clearly. Never claim payment success without server-side verification.
9. Maintain encrypted independent backups, access controls, retention, periodic restore drills, incident ownership and defined RPO/RTO.
10. Maintain portability: versioned database migrations, documented exports, portable data formats and tested migration procedures.

## Customer experience requirements

- Do not display infrastructure plan names, raw quota errors or provider billing messages to customers.
- Do not impose arbitrary product/order limits merely because the development platform is free.
- Publish fair-use, file-size and abuse limits only when technically and commercially necessary; explain them transparently.
- Never promise unlimited uptime or zero failures. Provide accurate status communication and support.
- Do not accept real orders or payments until the production stack has enough verified headroom and recovery controls.

## Rollout policy

### Development
Free services may be used for local development, demos and controlled testing. Clearly label demos and keep real payments disabled.

### Private beta
Use only after the owner approves the necessary infrastructure and operating budget, and after security, backup, monitoring and restore tests pass. Limit the beta audience by invitation for operational testing, not by exposing provider quotas to customers.

### Public production
Launch only after:
- capacity and load tests pass;
- provider terms, commercial use and service limits are verified;
- no predictable free-tier sleep/quota stop can interrupt core customer journeys;
- database backup/restore and migration have been tested;
- order/payment integrity and iPhone Safari/Android/desktop compatibility pass;
- an incident and support process is ready.

## Honest constraint

A marketplace comparable in reliability and scale to Shopee cannot responsibly be promised on a permanently Rp0 infrastructure budget. The sensible path is to build and test at Rp0, then fund production capacity before public commerce through approved spending and/or business revenue. If that funding is not yet available, keep the product in demo/private testing mode rather than putting customer orders at risk.


## Revenue-funded growth strategy

NEXORA will grow infrastructure in stages and reinvest business revenue rather than buying enterprise-scale capacity before demand exists.

1. **Build at Rp0:** use free services for development, demos and controlled tests. No real customer payment processing on an unverified free-tier setup.
2. **Minimum viable production:** before accepting real customers, establish a baseline production setup with durable orders, verified payment handling, independent backups, monitoring, and enough tested capacity. Obtain explicit owner approval for any cost.
3. **Revenue reserve:** once revenue is earned, first deduct payment-provider fees, refunds/chargebacks, taxes and other legally required liabilities. From the remaining operating contribution, allocate a planned portion to infrastructure, backups, security and support before discretionary spending.
4. **Scale from evidence:** review actual active sellers, traffic, database growth, storage, bandwidth, order volume, checkout latency, error rate and provider limits. Upgrade before safe capacity is exhausted, not after customers encounter failures.
5. **Keep a safety reserve:** maintain a cash buffer for essential hosting/database costs and incident recovery. Do not spend all revenue on marketing or owner withdrawals while critical services are underfunded.
6. **No automatic spend:** no provider upgrade, paid overage, or recurring commitment without the owner's explicit approval and a clear cost/benefit review.

### Suggested initial revenue allocation (planning guideline, not a promise)

After payment fees, refunds, taxes and required liabilities are accounted for, consider allocating the remaining operating contribution approximately as follows:
- 30% — infrastructure, database, backups and monitoring;
- 20% — security, maintenance and reliability improvements;
- 30% — customer acquisition, support and operations;
- 20% — retained business reserve / reinvestment flexibility.

Review these percentages monthly against actual costs and growth. If baseline infrastructure and security costs are not covered, prioritize those before marketing expansion or owner withdrawals. These are internal planning targets, not customer fees or guaranteed profit distributions.

### Growth trigger

Do not upgrade solely because a certain number of users has joined. Upgrade when measured usage, forecast demand, latency/error trends, backup requirements or provider limits show that current safe headroom is insufficient. The target is to complete an upgrade before customers feel the limitation.
