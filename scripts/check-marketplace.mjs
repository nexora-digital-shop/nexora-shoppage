import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredLocales = ["id", "en", "ko", "ja"];
const files = ["marketplace.html", "seller-portal.html", "storefront-demo.html"];
const errors = [];

for (const file of files) {
  const html = readFileSync(resolve(root, file), "utf8");
  const blocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  if (blocks.length === 0) errors.push(file + ": no inline script block found");
  blocks.forEach((block, index) => {
    try {
      new vm.Script(block[1], { filename: file + "#inline-" + (index + 1) });
    } catch (error) {
      errors.push(file + ": inline script " + (index + 1) + " syntax error: " + error.message);
    }
  });
}


const localizationPath = resolve(root, "seller-portal-i18n.js");
let sellerLocalization = "";
try {
  sellerLocalization = readFileSync(localizationPath, "utf8");
  new vm.Script(sellerLocalization, { filename: "seller-portal-i18n.js" });
} catch (error) {
  errors.push("seller-portal-i18n.js: missing file or JavaScript syntax error: " + error.message);
}
const sellerPortalMarkup = readFileSync(resolve(root, "seller-portal.html"), "utf8");
if (!sellerPortalMarkup.includes('id="languageSelect"') || !sellerPortalMarkup.includes('src="seller-portal-i18n.js"')) {
  errors.push("seller-portal.html: four-language selector or localization script is missing");
}
for (const locale of requiredLocales) {
  if (!new RegExp("\\b" + locale + ":\\s*\\{").test(sellerLocalization)) {
    errors.push("seller-portal-i18n.js: missing locale dictionary " + locale);
  }
}
const sellerTranslationPairs = [...sellerLocalization.matchAll(/"[^"]+":\s*"/g)].length;
if (sellerTranslationPairs < 250) {
  errors.push("seller-portal-i18n.js: translation coverage is unexpectedly low (" + sellerTranslationPairs + " entries)");
}

const sellerMarkupForLocalization = sellerPortalMarkup
  .replace(/<script\b[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[\s\S]*?<\/style>/gi, "")
  .replace(/<a\b[^>]*class=["'][^"']*\blogo\b[^"']*["'][^>]*>[\s\S]*?<\/a>/i, "")
  .replace(/<select\b[^>]*id=["']languageSelect["'][^>]*>[\s\S]*?<\/select>/i, "")
  .replace(/<select\b[^>]*id=["']currency["'][^>]*>[\s\S]*?<\/select>/i, "");
const sellerLocaleKeys = new Set(
  [...sellerLocalization.matchAll(/"([^"]+)"\s*:/g)].map(item => item[1])
);
const sellerIntentionalText = new Set(["—", "📦", "🧾", "🏪", "⚙️"]);
const sellerVisibleText = [...sellerMarkupForLocalization.matchAll(/>([^<>]+)</g)]
  .map(item => item[1].trim())
  .filter(Boolean);
for (const locale of requiredLocales.filter(item => item !== "id")) {
  for (const visibleText of new Set(sellerVisibleText)) {
    if (!sellerIntentionalText.has(visibleText) && !sellerLocaleKeys.has(visibleText)) {
      errors.push("seller-portal-i18n.js: " + locale + " is missing a translation for visible seller portal text: " + visibleText);
    }
  }
}

try {
  const localizationSandbox = {
    window: {},
    document: {
      readyState: "complete",
      documentElement: {},
      body: {},
      title: "",
      getElementById: () => null,
      createTreeWalker: () => ({ nextNode: () => false }),
      querySelectorAll: () => []
    },
    NodeFilter: { SHOW_TEXT: 4 },
    localStorage: { getItem: () => null, setItem: () => {} },
    navigator: { language: "id" }
  };
  new vm.Script(sellerLocalization, { filename: "seller-portal-i18n.js" }).runInNewContext(localizationSandbox);
  const i18n = localizationSandbox.window.NEXORA_I18N;
  const expectedLogin = { en: "Log in", ko: "로그인", ja: "ログイン" };
  for (const [locale, expected] of Object.entries(expectedLogin)) {
    i18n.applyLocale(locale);
    if (i18n.translate("Masuk") !== expected) {
      errors.push("seller-portal-i18n.js: basic " + locale + " translation did not match");
    }
  }
  const expectedSellerCopy = {
    en: {
      "Buat satu toko untuk akun yang sedang login. Toko baru otomatis berstatus draft.": "Create one store for the signed-in account. New stores automatically start in draft status.",
      "Kelola produk": "Manage products",
      "Pesanan": "Orders",
      "Profil toko": "Store profile",
      "Pengaturan": "Settings"
    },
    ko: {
      "Buat satu toko untuk akun yang sedang login. Toko baru otomatis berstatus draft.": "현재 로그인한 계정으로 스토어 하나를 만드세요. 새 스토어는 자동으로 임시 저장 상태가 됩니다.",
      "Kelola produk": "상품 관리",
      "Pesanan": "주문",
      "Profil toko": "스토어 프로필",
      "Pengaturan": "설정"
    },
    ja: {
      "Buat satu toko untuk akun yang sedang login. Toko baru otomatis berstatus draft.": "現在ログイン中のアカウントでショップを1つ作成します。新しいショップは自動的に下書き状態になります。",
      "Kelola produk": "商品管理",
      "Pesanan": "注文",
      "Profil toko": "ショッププロフィール",
      "Pengaturan": "設定"
    }
  };
  for (const [locale, translations] of Object.entries(expectedSellerCopy)) {
    i18n.applyLocale(locale);
    for (const [source, expected] of Object.entries(translations)) {
      if (i18n.translate(source) !== expected) {
        errors.push("seller-portal-i18n.js: " + locale + " translation mismatch for " + source);
      }
    }
  }
} catch (error) {
  errors.push("seller-portal-i18n.js: locale runtime smoke test failed: " + error.message);
}

const rootEntry = readFileSync(resolve(root, "index.html"), "utf8");
if (!/marketplace\.html/.test(rootEntry) || !/location\.replace|http-equiv=["']refresh/i.test(rootEntry)) {
  errors.push("index.html: root entry must redirect visitors to marketplace.html");
}
try {
  readFileSync(resolve(root, "shoppage.html"), "utf8");
} catch {
  errors.push("shoppage.html: preserved ShopPage builder prototype is missing");
}

const marketplace = readFileSync(resolve(root, "marketplace.html"), "utf8");
const match = marketplace.match(/const translations=(\{[\s\S]*?\});\s*const cards=/);
if (!match) {
  errors.push("marketplace.html: translation object could not be located");
} else {
  let translations;
  try {
    translations = JSON.parse(match[1]);
  } catch (error) {
    errors.push("marketplace.html: translation object is not valid JSON-compatible data: " + error.message);
  }
  if (translations) {
    for (const locale of requiredLocales) {
      if (!translations[locale]) {
        errors.push("Missing required locale: " + locale);
        continue;
      }
    }
    const markupKeys = new Set(
      [...marketplace.matchAll(/\bdata-i18n(?:-html|-placeholder|-aria)?="([^"]+)"/g)]
        .map(item => item[1])
    );
    for (const locale of requiredLocales) {
      const dictionary = translations[locale];
      if (!dictionary) continue;
      for (const key of markupKeys) {
        if (typeof dictionary[key] !== "string" || dictionary[key].trim() === "") {
          errors.push(locale + ": missing or empty translation for " + key);
        }
      }
    }
    for (const key of markupKeys) {
      if (!Object.prototype.hasOwnProperty.call(translations.id, key)) {
        errors.push("Indonesian source dictionary missing markup key: " + key);
      }
    }
  }
}

const sellerPortal = readFileSync(resolve(root, "seller-portal.html"), "utf8");
for (const required of [
  'id="dashboardNotice"',
  'id="productCount"',
  'id="orderCount"',
  'id="storeStatus"',
  "client.from('stores')",
  "client.from('products')",
  "client.from('orders')",
  "client.auth.onAuthStateChange"
]) {
  if (!sellerPortal.includes(required)) errors.push("seller-portal.html: missing database-backed dashboard requirement: " + required);
}
if (/<strong>0<\/strong>/.test(sellerPortal)) {
  errors.push("seller-portal.html: hard-coded zero dashboard statistic found; use database-backed values.");
}

// The storefront demo must never route buyer contact/address details to a hard-coded sample number.
const storefrontDemo = readFileSync(resolve(root, "storefront-demo.html"), "utf8");
const sellerContactMarker = 'sellerWhatsApp:"';
const sellerContactStart = storefrontDemo.indexOf(sellerContactMarker);
const sellerContactEnd = sellerContactStart < 0 ? -1 : storefrontDemo.indexOf('"', sellerContactStart + sellerContactMarker.length);
const demoSellerContact = sellerContactStart < 0 || sellerContactEnd < 0
  ? null
  : storefrontDemo.slice(sellerContactStart + sellerContactMarker.length, sellerContactEnd);
if (demoSellerContact !== "") {
  errors.push("storefront-demo.html: seller WhatsApp destination must remain blank until the owner configures a verified number");
}
if (!storefrontDemo.includes('$("sendOrder").disabled=!entries.length||!/^[0-9]{9,15}$/.test(STORE.sellerWhatsApp);')) {
  errors.push("storefront-demo.html: order handoff must remain disabled until a valid seller WhatsApp number is configured");
}
const sendOrderHandlerStart = storefrontDemo.indexOf('$("sendOrder").onclick=');
const sellerContactGuard = storefrontDemo.indexOf('if(!/^[0-9]{9,15}$/.test(STORE.sellerWhatsApp))', sendOrderHandlerStart);
const buyerDetailsRead = storefrontDemo.indexOf('const name=$("customer").value.trim()', sendOrderHandlerStart);
if (sendOrderHandlerStart < 0 || sellerContactGuard < 0 || buyerDetailsRead < 0 || sellerContactGuard > buyerDetailsRead) {
  errors.push("storefront-demo.html: seller contact must be validated before reading buyer contact/address fields");
}
if (!storefrontDemo.includes("nomor WhatsApp penjual belum dikonfigurasi")) {
  errors.push("storefront-demo.html: demo must clearly disclose that seller WhatsApp is not configured");
}

const languageOptions = [...marketplace.matchAll(/<option value="(id|en|ko|ja)">/g)].map(x => x[1]);
for (const locale of requiredLocales) {
  if (!languageOptions.includes(locale)) errors.push("Language selector missing option: " + locale);
}


// Database migration guardrails: these are source checks, not proof of live Supabase state.
const migrationFiles = {
  schema: "supabase/migrations/202611100001_initial_marketplace.sql",
  hardening: "supabase/migrations/202611100003_store_write_hardening.sql",
  onboarding: "supabase/migrations/202611120004_store_onboarding_validation.sql",
  searchPathHardening: "supabase/migrations/202611200005_secure_definer_search_path.sql",
  freePlan: "supabase/migrations/202611280006_free_product_page_quota.sql"
};
const migrationSql = {};
for (const [name, path] of Object.entries(migrationFiles)) {
  try {
    migrationSql[name] = readFileSync(resolve(root, path), "utf8").toLowerCase();
  } catch (error) {
    errors.push(path + ": required migration missing or unreadable");
  }
}
if (migrationSql.schema) {
  const schema = migrationSql.schema;
  for (const table of ["profiles", "stores", "products", "jastip_quotes", "orders", "order_items", "order_events"]) {
    if (!schema.includes("alter table public." + table + " enable row level security")) {
      errors.push("initial migration: RLS is not explicitly enabled for " + table);
    }
  }
  if (!/create policy "public reads active stores" on public\.stores\s+for select to anon, authenticated using \(status = 'active'\)/.test(schema)) {
    errors.push("initial migration: public store reads must be limited to active stores");
  }
  if (!/create policy "public reads published products in active stores" on public\.products[\s\S]*?status = 'published'[\s\S]*?s\.status = 'active'/.test(schema)) {
    errors.push("initial migration: public product reads must require published products in active stores");
  }
  for (const policy of ["seller creates own products", "seller updates own products", "seller deletes own products"]) {
    const escaped = policy; // Policy names contain no regular-expression metacharacters.
    const match = schema.match(new RegExp('create policy "' + escaped + '" on public\\.products[\\s\\S]*?(?=create policy|-- quote writes|-- order writes|-- order-item writes|-- event writes|commit;)', "i"));
    if (!match || !/owner_user_id\s*=\s*auth\.uid\(\)/.test(match[0])) {
      errors.push("initial migration: " + policy + " must scope writes to the authenticated store owner");
    }
  }
  const writeSensitiveTables = ["jastip_quotes", "orders", "order_items", "order_events"];
  const policies = [...schema.matchAll(/create policy "([^"]+)" on public\.(\w+)\s+for\s+(select|insert|update|delete)/g)];
  for (const table of writeSensitiveTables) {
    if (policies.some(item => item[2] === table && item[3] !== "select")) {
      errors.push("initial migration: client write policy found on server-controlled table " + table);
    }
  }
}
if (migrationSql.hardening) {
  const hardening = migrationSql.hardening;
  if (!hardening.includes('drop policy if exists "owner creates own store" on public.stores') ||
      !hardening.includes('drop policy if exists "owner updates own store" on public.stores') ||
      !/revoke insert, update on table public\.stores from anon, authenticated/.test(hardening)) {
    errors.push("migration 003: direct client store insert/update must remain revoked");
  }
  if (!hardening.includes('drop policy if exists "profile owner inserts own profile" on public.profiles') ||
      !/revoke insert on table public\.profiles from anon, authenticated/.test(hardening)) {
    errors.push("migration 003: direct client profile insertion must remain revoked");
  }
}
if (migrationSql.onboarding) {
  const onboarding = migrationSql.onboarding;
  if (!onboarding.includes("auth.uid()") ||
      !onboarding.includes("if v_user_id is null") ||
      !onboarding.includes("char_length(v_description) > 500") ||
      !onboarding.includes("'draft'") ||
      !/revoke all on function public\.create_my_store\(text,text,text,text,text\) from public, anon/.test(onboarding) ||
      !/grant execute on function public\.create_my_store\(text,text,text,text,text\) to authenticated/.test(onboarding)) {
    errors.push("migration 004: authenticated owner, 500-character limit, draft status and RPC grants must be enforced");
  }
}
if (migrationSql.searchPathHardening) {
  const hardening = migrationSql.searchPathHardening;
  const emptySearchPathCount = (hardening.match(/set search_path = ''/g) || []).length;
  if (!hardening.includes("create or replace function public.handle_new_auth_user()") ||
      !hardening.includes("create or replace function public.create_my_store(") ||
      emptySearchPathCount < 2 ||
      !hardening.includes("insert into public.profiles") ||
      !hardening.includes("insert into public.stores") ||
      !hardening.includes("from public.stores") ||
      !hardening.includes("auth.uid()") ||
      !hardening.includes("revoke all on function public.create_my_store(text,text,text,text,text) from public, anon") ||
      !hardening.includes("grant execute on function public.create_my_store(text,text,text,text,text) to authenticated") ||
      /set search_path = public|set search_path = pg_temp/i.test(hardening)) {
    errors.push("migration 005: SECURITY DEFINER functions must use an empty search_path, schema-qualified relations, auth.uid() ownership, and authenticated-only store RPC grants");
  }
}

if (migrationSql.freePlan) {
  const freePlan = migrationSql.freePlan;
  const updateFunction = freePlan.split("create or replace function public.update_my_product_page(")[1]?.split("$;")[0] || "";
  const publicGetter = freePlan.split("create or replace function public.get_public_product_page(")[1]?.split("$;")[0] || "";
  const emptySearchPathCount = (freePlan.match(/set search_path = ''/g) || []).length;
  if (!freePlan.includes("create table public.product_pages") ||
      !freePlan.includes("unique (owner_user_id)") ||
      !freePlan.includes("check (edit_count between 0 and 2)") ||
      !freePlan.includes("alter table public.product_pages enable row level security") ||
      !freePlan.includes("revoke all on table public.product_pages from public, anon, authenticated") ||
      !freePlan.includes('create policy "owner reads own product page" on public.product_pages') ||
      emptySearchPathCount < 3) {
    errors.push("migration 006: product-page quota table, owner uniqueness, RLS, write revocation and empty SECURITY DEFINER search_path must be present");
  }
  if (!freePlan.includes("create or replace function public.create_my_product_page(") ||
      !freePlan.includes("grant execute on function public.create_my_product_page(uuid,text,text,text,numeric,text,text,text,text,text) to authenticated") ||
      !freePlan.includes("create or replace function public.update_my_product_page(") ||
      !freePlan.includes("grant execute on function public.update_my_product_page(uuid,text,text,numeric,text,text,text,text,text) to authenticated") ||
      !freePlan.includes("where p.id = p_page_id") ||
      !freePlan.includes("and p.owner_user_id = v_user_id") ||
      !freePlan.includes("and p.edit_count < 2") ||
      !/edit_count = p\.edit_count \+ 1/.test(updateFunction)) {
    errors.push("migration 006: authenticated owner RPCs must create one page and atomically consume no more than two successful edits");
  }
  if (/\\bslug\\s*=/.test(updateFunction) ||
      !publicGetter.includes("returns table") ||
      publicGetter.includes("owner_user_id") ||
      publicGetter.includes("edit_count") ||
      !freePlan.includes("grant execute on function public.get_public_product_page(text) to anon, authenticated")) {
    errors.push("migration 006: page slug must remain stable and the public getter must expose only storefront fields");
  }
}

if (/service_role|sb_secret_/i.test(sellerPortal)) {
  errors.push("seller-portal.html: privileged Supabase secret detected in browser code");
}
if (!/sb_publishable_/.test(sellerPortal)) {
  errors.push("seller-portal.html: expected a Supabase publishable key for browser access");
}


// Additional regression checks: auth bootstrap, seller tenant scoping, and CI migration triggers.
const authMigrationPath = "supabase/migrations/202611100002_auth_and_store_onboarding.sql";
let authSql = "";
try {
  authSql = readFileSync(resolve(root, authMigrationPath), "utf8").toLowerCase();
} catch {
  errors.push(authMigrationPath + ": required migration missing or unreadable");
}
if (authSql) {
  if (!authSql.includes("create or replace function public.handle_new_auth_user()") ||
      !authSql.includes("security definer") ||
      !authSql.includes("set search_path = public, pg_temp") ||
      !authSql.includes("insert into public.profiles")) {
    errors.push("migration 002: auth profile bootstrap must use a fixed search_path and insert the new user's profile");
  }
  if (!authSql.includes("after insert on auth.users") ||
      !authSql.includes("execute function public.handle_new_auth_user()")) {
    errors.push("migration 002: auth.users profile bootstrap trigger is missing");
  }
}

if (migrationSql.schema) {
  const schema = migrationSql.schema;
  for (const policy of ["seller creates own products", "seller updates own products", "seller deletes own products"]) {
    const start = schema.indexOf('create policy "' + policy + '" on public.products');
    const next = schema.indexOf("create policy", start + 1);
    const section = start >= 0 ? schema.slice(start, next >= 0 ? next : schema.length) : "";
    if (!section.includes("owner_user_id = auth.uid()") || !section.includes("exists")) {
      errors.push("initial migration: " + policy + " must be restricted to the authenticated owner of the product's store");
    }
  }
}

const sellerPortalSource = readFileSync(resolve(root, "seller-portal.html"), "utf8");
if (!sellerPortalSource.includes("client.from('stores')") ||
    !sellerPortalSource.includes(".eq('owner_user_id',userId).maybeSingle()")) {
  errors.push("seller-portal.html: store dashboard query must be scoped to the signed-in owner");
}
for (const table of ["products", "orders"]) {
  if (!sellerPortalSource.includes("client.from('" + table + "')") ||
      !sellerPortalSource.includes(".eq('store_id',storeData.id)")) {
    errors.push("seller-portal.html: " + table + " dashboard query must be scoped to the authenticated seller's store");
  }
}
if (!sellerPortalSource.includes("currentUser?.id!==userId")) {
  errors.push("seller-portal.html: dashboard must discard results after the active account changes");
}

const workflowPath = resolve(root, ".github/workflows/validate-marketplace.yml");
try {
  const workflow = readFileSync(workflowPath, "utf8");
  if (!workflow.includes('"supabase/migrations/**"') ||
      !workflow.includes('"storefront-demo.html"') ||
      !workflow.includes("pull_request:") ||
      !workflow.includes("push:")) {
    errors.push("workflow: storefront demo and database migration changes must trigger validation on push and pull requests");
  }
} catch {
  errors.push(".github/workflows/validate-marketplace.yml: workflow file is missing or unreadable");
}

if (errors.length) {
  console.error("NEXORA static checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("NEXORA static checks passed: marketplace, seller portal and storefront inline JavaScript syntax; storefront CI trigger and safe WhatsApp handoff; root entry point; four locale dictionaries; visible translation keys; database-backed dashboard assertions; language selector options; migrations 001-006 guardrails; Free product-page quota RPC checks; and SECURITY DEFINER search-path hardening.");
