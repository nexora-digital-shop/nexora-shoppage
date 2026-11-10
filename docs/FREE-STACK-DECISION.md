# NEXORA — Zero-Upfront-Cost Technology Decision

Last updated: 2026-11-10

## Decision

Stop using Replit for this project because creating the app was blocked by an active-subscription requirement. Do not pay to bypass that gate.

Preferred no-upfront-cost candidate architecture:

| Layer | Candidate | Why it fits | Important limits |
|---|---|---|---|
| Source control | Existing GitHub repository | Already connected and holds the prototypes/specifications | GitHub is not the production database or commerce backend |
| Web hosting | Cloudflare Pages Free | Can serve a static, responsive web frontend from GitHub | Free-tier quotas and commercial terms must be checked at setup; it does not provide the whole marketplace backend |
| Authentication + database | Supabase Free | Managed authentication and PostgreSQL; relational data and row-level security suit stores, products and orders | Free-tier quotas, project pausing/availability, backups and storage limits must be checked; not a production SLA |
| Image storage | Supabase Storage Free initially | Keeps product images separate from relational records | Storage and bandwidth quotas apply; enforce file type/size limits and public/private access rules |
| Payments | No integration until PSP eligibility is verified | Avoids collecting funds incorrectly or exposing the project to unapproved fees | Payment providers may charge transaction fees and require business/KYC approval |

This is a candidate stack, not an assertion that accounts, services, deployments, or integrations are already active.

## Cost rules

- Target setup spend: Rp0.
- Do not enter payment details, start a trial, upgrade, buy a domain, or activate any paid service without the owner's explicit approval.
- Use free subdomains initially; a custom domain is not required for the first technical prototype.
- Free plans have quotas and can change. Monitor usage and stop before a paid overage or upgrade is triggered.
- PSP transaction fees, legal/compliance costs, and future scale costs cannot be assumed to be zero.

## Implementation plan

1. Build a mobile-first web frontend in the existing GitHub repository; preserve a web experience that works without installing an app.
2. Deploy the frontend to Cloudflare Pages from GitHub only after a free account/deployment path is confirmed.
3. Create a Supabase project on the Free plan only if the user can do so without payment details or a paid commitment; obtain project URL and public anon key from the user through the dashboard. Never ask for or expose the service-role key in frontend code.
4. Add SQL migrations for profiles, seller stores, products, orders and order items. Enable row-level security and write policies before using real data.
5. Implement authentication and seller/buyer flows against the backend.
6. Enforce the Free plan quota on the server/database, not localStorage.
7. Add file uploads with strict validation and storage policies.
8. Keep checkout in test/demo mode until a PSP confirms Indonesia marketplace support, seller onboarding/KYC, settlement, fees and legal eligibility.
9. Test on physical iPhone Safari, Android Chrome and desktop browsers. iPhone/iOS support is a mandatory launch gate.
10. Launch only after security, privacy, backup/restore, payment and operational release gates pass.

## Required user action

A one-time user action may be needed to create/authorize free Cloudflare and Supabase accounts and provide non-secret project configuration (Supabase project URL and public anon key). The user must never share passwords, OTPs, recovery codes, service-role keys, or payment credentials in chat.

## Status

- Replit creation attempt: blocked by `requires_active_subscription`; no app was created.
- GitHub source repository: available.
- Cloudflare Pages project: not created or deployed.
- Supabase project: not created or connected.
- Live NEXORA URL: not available yet.
- iPhone Safari testing: not performed yet.

## Launch warning

A free hosting URL or working prototype is not automatically a secure production marketplace. Never accept real orders or payments until backend authorization, data protection, order integrity, PSP compliance and all launch tests are complete.


## Customer-protection architecture — mandatory design rules

The Free tier is a development and early-validation constraint, not permission to expose customers to silent failures. Before real customer commerce is enabled, implement these controls:

1. **Separate failure domains.** Keep source control, frontend hosting, application/database, file storage, and payment processing logically separate. Do not make GitHub the production database or route customer funds through NEXORA's ordinary bank account.
2. **Durable server-side orders.** Persist order records and immutable order-item/price snapshots in PostgreSQL. Browser storage may improve convenience but must never be the authoritative order record.
3. **Safe checkout degradation.** If order persistence, PSP status verification, or webhook processing is unavailable, disable new payment initiation or show a clear temporary-unavailable state. Never tell a buyer an order is paid based only on a redirect, screenshot, or client event.
4. **Independent backups and restore drills.** Export database backups to a separate location/account where possible, encrypt them, restrict access, define retention, and test restoration before launch and regularly thereafter. A provider's included backup feature must not be assumed on a Free tier.
5. **Quota and health monitoring.** Monitor database size, egress/bandwidth, storage, function invocations, API limits, auth email limits, errors and uptime. Configure warning thresholds below provider limits. If a free plan offers no reliable alerting, add an independent check or reduce launch scope.
6. **No surprise charges.** Disable paid overages/automatic upgrades where the provider permits; do not attach a payment method or start a paid trial without explicit owner approval. If a provider cannot guarantee a no-charge stop, treat that as a launch risk and do not expose customer-critical workloads there.
7. **Exportability and migration.** Keep schema migrations in Git, use standard PostgreSQL where practical, document storage object export, and avoid provider-specific dependencies for core order logic. Maintain a tested migration runbook and an owner-controlled copy of critical data.
8. **Security boundaries.** Enable row-level security and test seller-to-seller isolation; keep service-role and PSP secrets server-side; use least-privilege access, rate limits, audit events and validated uploads.
9. **Incident communication.** Provide a customer-facing status/maintenance message and a support route. Never silently discard an order. Show a clear order reference only after the order has been durably committed.
10. **Launch by proven capacity.** Set conservative initial traffic/order limits based on tested free-tier capacity. If usage approaches safe thresholds, pause new seller onboarding or checkout before the system becomes unreliable; notify affected users and plan a controlled upgrade/migration.

### Required recovery objectives

Before accepting real orders, the team must choose and publish internal recovery targets (RPO: maximum acceptable data loss; RTO: maximum acceptable recovery time), test backup restoration, and document who responds to an incident. Do not claim zero data loss or uninterrupted uptime unless independently demonstrated.

### Customer-facing service promise

Do not promise 100% uptime, instant support, unlimited storage, or unlimited orders on a Free infrastructure stack. State only verified service limits. A planned maintenance mode must preserve existing published order records and avoid starting unverifiable payments.

### Launch gate

A free-tier deployment may serve a public informational/demo site. It must not process real customer orders/payments until durable order persistence, independent backup/restore, monitoring, security rules, safe checkout degradation, provider terms/quotas, and migration/recovery procedures have been implemented and tested.
