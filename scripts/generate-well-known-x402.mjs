#!/usr/bin/env node
/**
 * Build /.well-known/x402 from catalog-manifest.json (x402scan fan-out discovery).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(
  ROOT,
  "2nd-pages/materials-factory/catalog-manifest.json"
);
const OUT_DIR = join(ROOT, ".well-known");
const OUT_FILE = join(OUT_DIR, "x402");
const PAY_TO = "0x53799D42E72E3d41625006d310A55EC486DA5213";

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const host = (manifest.host || "https://NWB-Vending.com").replace(/\/+$/, "");
const base = (manifest.base_path || "/2nd-pages/materials-factory/").replace(
  /^\/?/,
  "/"
);

const resources = manifest.entries.map((e) => {
  const full = e.full.replace(/^\/?/, "");
  const primary = e.primary;
  return `${host}${base}${full}${primary}`;
});

const payload = {
  version: 1,
  resources,
  ownershipProofs: [PAY_TO],
  instructions:
    "Materials Factory agent packs. Manifest: /2nd-pages/materials-factory/catalog-manifest.json",
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + "\n");

console.log(`Wrote ${OUT_FILE}`);
console.log(`  resources: ${resources.length}`);
console.log(`  payTo:     ${PAY_TO}`);