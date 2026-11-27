# NEXORA — Browser Smoke Test Results (2026-11-27)

## Verified CI result

- Workflow: Validate NEXORA marketplace
- Run: [#33](https://github.com/nexora-digital-shop/nexora-shoppage/actions/runs/46007148926)
- Commit: `88cf3ee74ea5041fa725f4a36b90da20d28e362e`
- Runner: Ubuntu 24.04
- Browser: Chromium via Playwright 1.56.1
- Result: successful

The static source/localization/database guardrail script and the browser smoke test both passed.

## Browser checks executed at a 390 × 844 CSS-pixel viewport

1. Marketplace:
   - Loads the static marketplace page.
   - Switches the visible navigation label to English.
   - Filters the sample catalog to Jastip/preorder.
   - Searches for a non-matching term and displays the empty state.
   - Checks that the document does not overflow horizontally at 390px.
2. Seller portal:
   - Replaces the Supabase CDN script with a local test mock; no live Supabase account or credentials are used.
   - Switches the seller interface to Korean and Japanese.
   - Checks the translated heading in each locale.
   - Checks horizontal overflow at 390px.
3. Storefront demo:
   - Adds one sample item to the local demo cart.
   - Confirms order handoff remains disabled because no verified seller WhatsApp number is configured.
   - Checks horizontal overflow at 390px.
4. All three pages:
   - No uncaught browser JavaScript errors during the tested journeys.

## Runner compatibility correction

The first browser-test attempt used `ubuntu-latest`, which resolved to an Ubuntu 26.04 image. Playwright 1.56.1 did not support installing Chromium dependencies on that image, so the run failed before browser tests began. The workflow was pinned to `ubuntu-24.04`; run #33 then completed successfully.

## Limits — not production or device certification

- The 390px viewport is a Chromium mobile-width simulation, not a physical iPhone.
- This does not certify iOS Safari, Android Chrome, accessibility, or all screen sizes.
- Supabase was mocked in the seller-portal browser test. Signup, email confirmation, login, live RLS, store creation, and database reads/writes remain unverified in this test.
- The storefront uses sample products and local browser storage. It does not create server-side orders or accept payments.
- No live deployment or public Pages URL was tested.

## Next engineering gates

1. Deploy a public demo URL through the owner's Cloudflare account without entering a paid plan or payment method.
2. Configure the exact Supabase Auth Site URL and redirect allowlist using that real URL.
3. Test two dedicated accounts against the live database and verify seller-to-seller isolation.
4. Resolve and enforce the Free plan page/edit quota on the server before enabling product CRUD.
5. Implement durable product and order workflows, then repeat browser and real-device tests.
6. Keep real payments disabled until server-side order integrity, licensed PSP eligibility, webhook verification, refunds, privacy and recovery controls are tested.
