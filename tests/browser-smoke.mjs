import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.NEXORA_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const pageErrors = [];

try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1
  });
  page.on("pageerror", error => pageErrors.push(error.message));

  // Marketplace: language switching, filtering, search and mobile overflow.
  await page.goto(`${baseUrl}/marketplace.html`, { waitUntil: "load" });
  await page.locator("#language").selectOption("en");
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal((await page.locator('[data-i18n="nav_explore"]').innerText()).trim(), "Explore");

  await page.locator('[data-filter="jastip"]').click();
  assert.equal(await page.locator(".product:not([hidden])").count(), 1);
  await page.locator("#search").fill("nexora-browser-test-no-match");
  assert.equal(await page.locator(".product:not([hidden])").count(), 0);
  assert.equal(await page.locator("#empty").isVisible(), true);

  const marketplaceOverflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  assert.equal(marketplaceOverflows, false, "Marketplace must not overflow horizontally at 390px");

  // Seller portal: exercise locale switching without contacting the live Supabase project.
  const supabaseMock = `
    window.supabase = {
      createClient: () => ({
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
          signInWithPassword: async () => ({ data: {}, error: null }),
          signUp: async () => ({ data: {}, error: null }),
          signOut: async () => ({ error: null })
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null })
            })
          })
        }),
        rpc: async () => ({ data: null, error: null })
      })
    };
  `;
  await page.route(
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js",
    route => route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: supabaseMock
    })
  );
  await page.goto(`${baseUrl}/seller-portal.html`, { waitUntil: "load" });
  await page.locator("#languageSelect").selectOption("ko");
  await page.waitForFunction(() => document.documentElement.lang === "ko");
  assert.equal(
    (await page.locator("h1").innerText()).trim(),
    "스토어를 관리하고 더 많은 고객에게 다가가세요."
  );
  await page.locator("#languageSelect").selectOption("ja");
  await page.waitForFunction(() => document.documentElement.lang === "ja");
  assert.equal(
    (await page.locator("h1").innerText()).trim(),
    "ショップを管理して、より多くのお客様へ。"
  );

  const sellerPortalOverflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  assert.equal(sellerPortalOverflows, false, "Seller portal must not overflow horizontally at 390px");

  // Storefront: a cart can be explored, but order handoff remains disabled without a verified seller number.
  await page.goto(`${baseUrl}/storefront-demo.html`, { waitUntil: "load" });
  assert.equal(await page.locator("#sendOrder").isDisabled(), true);
  await page.locator('[data-add="1"]').click();
  assert.equal((await page.locator("#cartCount").innerText()).trim(), "1");
  await page.locator("#openCart").click();
  assert.equal(await page.locator("#sendOrder").isDisabled(), true);

  const storefrontOverflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  assert.equal(storefrontOverflows, false, "Storefront must not overflow horizontally at 390px");

  assert.deepEqual(pageErrors, [], "No uncaught browser JavaScript errors should occur");
  console.log("NEXORA browser smoke tests passed: marketplace language/search/filter, seller portal Korean/Japanese switching, storefront cart safety, and 390px mobile overflow.");
} finally {
  await browser.close();
}
