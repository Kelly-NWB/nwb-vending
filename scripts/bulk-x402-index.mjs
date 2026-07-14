#!/usr/bin/env node
/**
 * Buy each Materials Factory primary artifact once to seed CDP Bazaar indexing.
 *
 * Needs EVM_PRIVATE_KEY (Phantom test wallet with USDC on Base).
 * Does NOT save downloaded files. Payment settles to PAY_TO (your Coinbase receive).
 *
 *   node scripts/bulk-x402-index.mjs --dry-run
 *   node scripts/bulk-x402-index.mjs --skip mf-tool-001
 *   node scripts/bulk-x402-index.mjs --only mf-train-001 --verbose
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { wrapFetchWithPayment } from "x402-fetch";
import { decodeXPaymentResponse } from "x402/shared";
import { createPublicClient, createWalletClient, formatUnits, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(
  ROOT,
  "2nd-pages/materials-factory/catalog-manifest.json"
);
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const EXPECTED_WALLET = "0x1144f38838A9aAf15152CB7C5cAFAE8e25EBac0C";
const HOST = (process.env.X402_HOST || "https://nwb-vending.com").replace(/\/+$/, "");
const DELAY_MS = Number(process.env.X402_DELAY_MS || "3000");
const MAX_PAY_ATOMIC = 1_000_000n; // $1.00 USDC ceiling per buy
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");
const skipIds = new Set();
let onlyId = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--skip" && args[i + 1]) skipIds.add(args[++i]);
  if (args[i] === "--only" && args[i + 1]) onlyId = args[++i];
}

function normalizePrivateKey(raw) {
  let k = raw.trim().replace(/\s+/g, "");
  if (!k.startsWith("0x")) k = `0x${k}`;
  const hex = k.slice(2);
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error("Key has non-hex characters. Paste only the private key.");
  }
  if (hex.length === 40) {
    throw new Error("That looks like an address (40 hex), not a private key (64 hex).");
  }
  if (hex.length !== 64) {
    throw new Error(`Key length wrong: got ${hex.length} hex chars, need 64.`);
  }
  return `0x${hex}`;
}

function parseUsd(price) {
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function usdcBalance(address) {
  const client = createPublicClient({ chain: base, transport: http() });
  const raw = await client.readContract({
    address: USDC,
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ],
    functionName: "balanceOf",
    args: [address],
  });
  return { raw, formatted: formatUnits(raw, 6) };
}

function formatFailBody(status, body) {
  try {
    const j = JSON.parse(body);
    const bits = [`status ${status}`];
    if (j.error) bits.push(`error: ${j.error}`);
    if (j.payer) bits.push(`payer: ${j.payer}`);
    if (j.accepts?.[0]?.maxAmountRequired) {
      bits.push(`price: ${j.accepts[0].maxAmountRequired} atomic`);
    }
    return bits.join(" | ");
  } catch {
    return `status ${status}: ${body.slice(0, 160)}`;
  }
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const basePath = (manifest.base_path || "/2nd-pages/materials-factory/").replace(
  /^\/?/,
  "/"
);

let targets = manifest.entries
  .filter((e) => !skipIds.has(e.id))
  .map((e) => ({
    id: e.id,
    title: e.title,
    price: e.price,
    url: `${HOST}${basePath}${e.full.replace(/^\/?/, "")}${e.primary}`,
  }));

if (onlyId) {
  targets = targets.filter((t) => t.id === onlyId);
  if (!targets.length) {
    console.error(`No entry for --only ${onlyId}`);
    process.exit(1);
  }
}

const est = targets.reduce((s, t) => s + parseUsd(t.price), 0);

console.log("bulk-x402-index");
console.log(`  host:      ${HOST}`);
console.log(`  targets:   ${targets.length} (skip: ${[...skipIds].join(", ") || "none"})`);
console.log(`  est cost:  ~$${est.toFixed(2)} USDC`);
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

let account;
try {
  account = privateKeyToAccount(normalizePrivateKey(pk));
} catch (e) {
  console.error("Bad EVM_PRIVATE_KEY:", e.message);
  process.exit(1);
}

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});
const fetchWithPay = wrapFetchWithPayment(fetch, walletClient, MAX_PAY_ATOMIC);

const bal = await usdcBalance(account.address);
console.log(`  wallet:    ${account.address}`);
console.log(`  usdc:      ${bal.formatted} on Base`);

if (account.address.toLowerCase() !== EXPECTED_WALLET.toLowerCase()) {
  console.log(`  warn:      wallet is not ${EXPECTED_WALLET} — key may be wrong wallet`);
}

if (bal.raw < BigInt(Math.ceil(est * 1_000_000))) {
  console.error(`FAIL: need ~$${est.toFixed(2)} USDC, have $${bal.formatted}`);
  process.exit(1);
}

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
    const body = await res.text();

    if (res.status === 200) {
      const payHdr =
        res.headers.get("x-payment-response") ||
        res.headers.get("X-PAYMENT-RESPONSE");
      if (VERBOSE && payHdr) {
        try {
          console.log("\n  settled:", JSON.stringify(decodeXPaymentResponse(payHdr)));
        } catch {
          /* ignore */
        }
      }
      console.log(`OK (${t.price})`);
      ok++;
    } else {
      const msg = formatFailBody(res.status, body);
      console.log(`FAIL ${msg}`);
      fail++;
      failed.push({ ...t, err: msg });
      if (VERBOSE) console.log(body.slice(0, 500));
    }
  } catch (e) {
    const msg = String(e.message || e);
    console.log(`FAIL ${msg}`);
    fail++;
    failed.push({ ...t, err: msg });
    if (VERBOSE && e.cause) console.log("  cause:", e.cause);
  }
  if (i < targets.length - 1) await sleep(DELAY_MS);
}

console.log();
console.log(`done: ${ok} ok, ${fail} fail`);
if (failed.length) {
  console.log("failed:");
  for (const f of failed) console.log(`  ${f.id}  ${f.err}`);
  console.log(`
If every buy fails:
  1. Confirm wallet matches Phantom with USDC on Base (not Ethereum mainnet).
  2. Test one: node scripts/test-x402-unlock.mjs
     with X402_URL set to the failing pack URL.
  3. Re-run with --only <id> --verbose and read the error line above.
`);
  process.exit(1);
}

console.log(`
Money went to PAY_TO (Coinbase receive 0x53799D42E72E3d41625006d310A55EC486DA5213).
No purchase copies saved. CDP Bazaar may take up to ~10 min to show new resources.
`);