#!/usr/bin/env node
/**
 * Buy each Materials Factory primary artifact once to seed CDP Bazaar indexing.
 *
 * Needs EVM_PRIVATE_KEY (Phantom test wallet with USDC on Base).
 * Does NOT save downloaded files. Payment settles to PAY_TO (your Coinbase receive).
 *
 *   node scripts/bulk-x402-index.mjs --dry-run
 *   node scripts/bulk-x402-index.mjs
 *   node scripts/bulk-x402-index.mjs --skip mf-tool-001
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { wrapFetchWithPayment } from "x402-fetch";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(
  ROOT,
  "2nd-pages/materials-factory/catalog-manifest.json"
);
const HOST = process.env.X402_HOST || "https://NWB-Vending.com";
const NETWORK = process.env.X402_NETWORK || "base";
const DELAY_MS = Number(process.env.X402_DELAY_MS || "2500");
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const skipIds = new Set();
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--skip" && args[i + 1]) skipIds.add(args[++i]);
}

function normalizePrivateKey(raw) {
  let k = raw.trim().replace(/\s+/g, "");
  if (!k.startsWith("0x")) k = `0x${k}`;
  const hex = k.slice(2);
  if (hex.length !== 64) throw new Error("Need 64-char hex private key.");
  return `0x${hex}`;
}

function parseUsd(price) {
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const host = HOST.replace(/\/+$/, "");
const basePath = (manifest.base_path || "/2nd-pages/materials-factory/").replace(
  /^\/?/,
  "/"
);

const targets = manifest.entries
  .filter((e) => !skipIds.has(e.id))
  .map((e) => ({
    id: e.id,
    title: e.title,
    price: e.price,
    url: `${host}${basePath}${e.full.replace(/^\/?/, "")}${e.primary}`,
  }));

const est = targets.reduce((s, t) => s + parseUsd(t.price), 0);

console.log("bulk-x402-index");
console.log(`  host:      ${host}`);
console.log(`  targets:   ${targets.length} (skip: ${[...skipIds].join(", ") || "none"})`);
console.log(`  est cost:  ~$${est.toFixed(2)} USDC (+ tiny gas if any)`);
console.log(`  delay:     ${DELAY_MS}ms between buys`);
console.log(`  dry-run:   ${DRY_RUN}`);
console.log();

if (DRY_RUN) {
  for (const t of targets) {
    console.log(`  ${t.id}  ${t.price}  ${t.url}`);
  }
  process.exit(0);
}

const pk = process.env.EVM_PRIVATE_KEY;
if (!pk) {
  console.error(`
Missing EVM_PRIVATE_KEY. Set in terminal only (never in chat):

  $env:EVM_PRIVATE_KEY="0x..."
  node scripts/bulk-x402-index.mjs --skip mf-tool-001
`);
  process.exit(1);
}

const account = privateKeyToAccount(normalizePrivateKey(pk));
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});
const fetchWithPay = wrapFetchWithPayment(fetch, walletClient, 500_000n);

console.log(`  wallet:    ${account.address}`);
console.log();

let ok = 0;
let fail = 0;
const failed = [];

for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  const label = `[${i + 1}/${targets.length}] ${t.id}`;
  process.stdout.write(`${label} ... `);
  try {
    const res = await fetchWithPay(t.url, { method: "GET" });
    if (res.status === 200) {
      await res.arrayBuffer();
      console.log(`OK (${t.price})`);
      ok++;
    } else {
      const body = (await res.text()).slice(0, 120);
      console.log(`FAIL status ${res.status}: ${body}`);
      fail++;
      failed.push({ ...t, err: `status ${res.status}` });
    }
  } catch (e) {
    console.log(`FAIL ${e.message || e}`);
    fail++;
    failed.push({ ...t, err: String(e.message || e) });
  }
  if (i < targets.length - 1) await sleep(DELAY_MS);
}

console.log();
console.log(`done: ${ok} ok, ${fail} fail`);
if (failed.length) {
  console.log("failed:");
  for (const f of failed) console.log(`  ${f.id}  ${f.url}  ${f.err}`);
  process.exit(1);
}

console.log(`
Money went to PAY_TO (Coinbase receive 0x53799D42E72E3d41625006d310A55EC486DA5213).
No purchase copies saved. CDP Bazaar may take up to ~10 min to show new resources.
`);