#!/usr/bin/env node
/**
 * Pre-push Materials Factory audit. Run before push28.
 * Exit 0 = AUDIT PASS, 1 = FAIL (do not push).
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MF = join(ROOT, "2nd-pages", "materials-factory");
const MANIFEST = join(MF, "catalog-manifest.json");
const WORKER = join(ROOT, "worker", "index.ts");

const FAIL_PATTERNS = [
  /\boperator story\b/i,
  /\bfrom operator\b/i,
  /\bKelly\b/i,
  /\bdumb-seat\b/i,
  /\bgov-tech\b/i,
  /\bTODO\b/,
  /\b\[Insert\b/i,
  /\bfax.?modem\b/i,
  /\bgranny\b/i,
  /\bIDPR\b/i,
  /\bWho Moved/i,
  /\bold hag/i,
  /\bTroy\b/i,
  /\bask troy/i,
];

const WARN_PATTERNS = [/—/];

let fails = [];
let warns = [];

function fail(msg) {
  fails.push(msg);
}
function warn(msg) {
  warns.push(msg);
}

function walkFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(p, acc);
    else if (/\.(json|md|html)$/i.test(name)) acc.push(p);
  }
  return acc;
}

function scanContent(rel, text) {
  for (const re of FAIL_PATTERNS) {
    if (re.test(text)) fail(`${rel}: blocked pattern ${re}`);
  }
  for (const re of WARN_PATTERNS) {
    if (re.test(text)) warn(`${rel}: em dash (legacy ok, avoid in new packs) ${re}`);
  }
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const entries = manifest.entries || [];

if (manifest.entry_count !== entries.length) {
  fail(
    `catalog-manifest: entry_count=${manifest.entry_count} but entries.length=${entries.length}`
  );
}

const indexHtml = readFileSync(join(MF, "index.html"), "utf8");
const indexCountMatch = indexHtml.match(
  /(\d+)\s+entries\s+·\s+<a href="catalog-manifest\.json">/
);
if (!indexCountMatch) {
  fail("index.html: could not parse header entry count");
} else if (Number(indexCountMatch[1]) !== manifest.entry_count) {
  fail(
    `index.html: header says ${indexCountMatch[1]} entries but manifest entry_count=${manifest.entry_count}`
  );
}

const workerSrc = readFileSync(WORKER, "utf8");

for (const e of entries) {
  if (!e.id || !e.title || !e.price || !e.teaser || !e.full || !e.primary) {
    fail(`manifest ${e.id || "?"}: missing core fields`);
  }
  if (!e.use_when && !(e.trigger_phrases && e.trigger_phrases.length)) {
    fail(`manifest ${e.id}: need use_when or trigger_phrases`);
  }

  const teaserDir = join(MF, e.teaser.replace(/^\//, "").replace(/\/$/, ""));
  const fullDir = join(MF, e.full.replace(/^\//, "").replace(/\/$/, ""));
  const primary = join(fullDir, e.primary);

  if (!existsSync(teaserDir)) fail(`${e.id}: missing teaser dir ${e.teaser}`);
  if (!existsSync(fullDir)) fail(`${e.id}: missing full dir ${e.full}`);
  if (!existsSync(primary)) fail(`${e.id}: missing primary ${e.primary}`);

  const gateNeedle = `/2nd-pages/materials-factory/${e.full.replace(/^\//, "").replace(/\/$/, "")}`;
  if (!workerSrc.includes(gateNeedle)) {
    fail(`${e.id}: no worker gated route for ${gateNeedle}`);
  }

  try {
    const doc = JSON.parse(readFileSync(primary, "utf8"));
    if (doc.origin_story != null) {
      fail(`${e.id}: origin_story must not ship in paid primary JSON`);
    }
  } catch (err) {
    fail(`${e.id}: invalid JSON in ${e.primary}: ${err.message}`);
  }
}

const mfFiles = walkFiles(MF);
for (const abs of mfFiles) {
  const rel = abs.replace(ROOT + "\\", "").replace(ROOT + "/", "");
  scanContent(rel, readFileSync(abs, "utf8"));
}

const openapiPath = join(ROOT, "openapi.json");
if (!existsSync(openapiPath)) {
  fail("openapi.json missing (run generate-openapi.mjs)");
} else {
  const openapi = JSON.parse(readFileSync(openapiPath, "utf8"));
  const pathCount = Object.keys(openapi.paths || {}).length;
  if (pathCount !== entries.length) {
    fail(`openapi paths=${pathCount} manifest entries=${entries.length}`);
  }
}

const wellKnown = join(ROOT, ".well-known", "x402");
if (!existsSync(wellKnown)) {
  fail(".well-known/x402 missing (run generate-well-known-x402.mjs)");
} else {
  const wk = JSON.parse(readFileSync(wellKnown, "utf8"));
  if ((wk.resources || []).length !== entries.length) {
    fail(
      `.well-known resources=${wk.resources?.length ?? 0} manifest entries=${entries.length}`
    );
  }
}

console.log("MATERIALS FACTORY PRE-PUSH AUDIT");
console.log(`Entries: ${entries.length}`);
console.log(`Files scanned: ${mfFiles.length}`);
if (warns.length) {
  console.log(`\nWARNINGS: ${warns.length} (legacy em dashes, not blocking)`);
  for (const w of warns.slice(0, 5)) console.log(`  - ${w}`);
  if (warns.length > 5) console.log(`  - ... and ${warns.length - 5} more`);
}
if (fails.length) {
  console.log("\nFAIL:");
  for (const f of fails) console.log(`  - ${f}`);
  console.log("\nAUDIT: FAIL — do not push28");
  process.exit(1);
}
console.log("\nAUDIT: PASS — ok to push28");