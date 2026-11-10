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
