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

const languageOptions = [...marketplace.matchAll(/<option value="(id|en|ko|ja)">/g)].map(x => x[1]);
for (const locale of requiredLocales) {
  if (!languageOptions.includes(locale)) errors.push("Language selector missing option: " + locale);
}

if (errors.length) {
  console.error("NEXORA static checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("NEXORA static checks passed: inline JavaScript syntax, four locale dictionaries, all visible translation keys, and language selector options.");
