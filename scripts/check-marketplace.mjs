import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredLocales = ["id", "en", "ko", "ja"];
const files = ["marketplace.html", "seller-portal.html"];
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

const languageOptions = [...marketplace.matchAll(/<option value="(id|en|ko|ja)">/g)].map(x => x[1]);
for (const locale of requiredLocales) {
  if (!languageOptions.includes(locale)) errors.push("Language selector missing option: " + locale);
}

if (errors.length) {
  console.error("NEXORA static checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("NEXORA static checks passed: inline JavaScript syntax, root marketplace entry point, preserved ShopPage prototype, four locale dictionaries, visible translation keys, database-backed dashboard assertions, and language selector options.");
