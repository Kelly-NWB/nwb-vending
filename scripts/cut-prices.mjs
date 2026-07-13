#!/usr/bin/env node
/**
 * Cut MF x402 prices to pennies: tools $0.05, training + templates $0.08
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MF = path.join(ROOT, "2nd-pages", "materials-factory");

const PRICE_TOOLS = "$0.05";
const PRICE_PACKS = "$0.08";

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name === "index.html") acc.push(p);
  }
  return acc;
}

// worker/index.ts — by URL prefix (price precedes artifact in each block)
const workerPath = path.join(ROOT, "worker", "index.ts");
let worker = fs.readFileSync(workerPath, "utf8");
worker = worker.replace(
  /(prefix: "\/2nd-pages\/materials-factory\/tools\/[^"]+",\s*price: )"\$[\d.]+"/g,
  `$1"${PRICE_TOOLS}"`
);
worker = worker.replace(
  /(prefix: "\/2nd-pages\/materials-factory\/(training|templates)\/[^"]+",\s*price: )"\$[\d.]+"/g,
  `$1"${PRICE_PACKS}"`
);
fs.writeFileSync(workerPath, worker);

// catalog-manifest.json — by section
const manifestPath = path.join(MF, "catalog-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const e of manifest.entries) {
  if (e.section === "tools") e.price = PRICE_TOOLS;
  else e.price = PRICE_PACKS;
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

// All index.html under MF
const htmlFiles = walk(MF);
let htmlCount = 0;
for (const f of htmlFiles) {
  let html = fs.readFileSync(f, "utf8");
  const rel = path.relative(MF, f);
  const isTool = rel.startsWith("tools" + path.sep);
  const newPrice = isTool ? PRICE_TOOLS : PRICE_PACKS;
  const next = html
    .replace(/\$0\.35/g, newPrice)
    .replace(/\$0\.40/g, newPrice)
    .replace(/\$0\.45/g, newPrice);
  if (next !== html) {
    fs.writeFileSync(f, next);
    htmlCount++;
  }
}

console.log("Prices cut:");
console.log(`  tools:  ${PRICE_TOOLS}`);
console.log(`  packs:  ${PRICE_PACKS} (train + templates)`);
console.log(`  worker: ${workerPath}`);
console.log(`  manifest: ${manifestPath}`);
console.log(`  html:   ${htmlCount} index.html files updated`);