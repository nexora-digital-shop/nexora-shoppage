# NEXORA — Repository verification note

Verification date: 2026-11-26

## What was checked

Repository: `nexora-digital-shop/nexora-shoppage`  
Default branch: `main`  
Visibility: public

The current README and deployment runbook were read from the repository. The latest GitHub Actions runs were queried from GitHub, and the latest run's job steps were inspected.

## Verified facts

- The latest workflow run at the time of this check is run **31**, ID `45622953749`.
- Run 31 was triggered by push to `main` for commit `99bba3f4e89c97ffba5bc0ebdafc5eaf175b1926` ("Validate storefront JavaScript and CI coverage").
- GitHub reports run 31 as `completed` with conclusion `success`.
- Its `static-validation` job completed successfully. The checkout, Node.js setup, and `node scripts/check-marketplace.mjs` steps all report success.
- Run 30, ID `45622950089`, for the preceding storefront CI-trigger change also completed successfully.
- The current workflow includes `storefront-demo.html` and `supabase/migrations/**` in both push and pull-request path filters.
- The current checker statically parses inline JavaScript in `marketplace.html`, `seller-portal.html`, and `storefront-demo.html`; it also performs source-level localization, storefront handoff, and migration guardrail checks.
- The deployment runbook specifies a static Cloudflare Pages setup from the repository root, with no build command and output directory `.`.

## What this does not prove

A green static-validation workflow is not a browser end-to-end test and does not prove that:
- a Cloudflare Pages project or public deployment URL exists;
- Supabase Auth redirects or signup/login work on a hosted domain;
- migrations 004 and 005 have been applied to the live Supabase database;
- live Row Level Security, grants, trigger behavior, or seller-to-seller isolation work;
- product create/edit/delete, persisted orders, checkout, or payments are implemented;
- the app has passed physical iPhone Safari or Android device testing.

The repository README and deployment runbook continue to describe NEXORA as a demo/early-test build and not production-ready. Do not accept real customer orders or payments from these prototypes.

## Next release gates

1. The owner must authorize the Cloudflare Pages Git connection and create the free Pages project in their account. Stop if the dashboard requires a payment method, paid plan, or paid trial.
2. Capture the exact generated `pages.dev` URL and configure Supabase Auth Site URL and Redirect URLs to that real URL.
3. Inspect the live migration history/schema before applying anything. If 001–003 are confirmed and 004–005 are absent, review and apply 004 then 005; never rerun earlier migrations blindly.
4. Test Auth, store creation, 500/501-character description boundary, RPC grants, and isolation with dedicated test accounts.
5. Implement and test persisted product CRUD, public storefront data, server-side order creation, and only later a compliant payment-provider integration.
6. Complete physical iPhone Safari and Android testing, plus backup/restore and free-tier quota/overage checks, before enabling real commerce.

## Evidence

- [Run 31 — latest successful static validation](https://github.com/nexora-digital-shop/nexora-shoppage/actions/runs/45622953749)
- [Run 30 — storefront CI trigger validation](https://github.com/nexora-digital-shop/nexora-shoppage/actions/runs/45622950089)
- [Workflow source](https://github.com/nexora-digital-shop/nexora-shoppage/blob/main/.github/workflows/validate-marketplace.yml)
- [Static checker source](https://github.com/nexora-digital-shop/nexora-shoppage/blob/main/scripts/check-marketplace.mjs)
- [Cloudflare Pages deployment runbook](https://github.com/nexora-digital-shop/nexora-shoppage/blob/main/docs/CLOUDFLARE-PAGES-DEPLOYMENT.md)
- [Launch readiness gates](https://github.com/nexora-digital-shop/nexora-shoppage/blob/main/docs/LAUNCH-READINESS.md)
