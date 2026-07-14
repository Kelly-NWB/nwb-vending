#!/usr/bin/env node
/**
 * Real x402 paid unlock test (buyer side).
 *
 * Needs:
 *   EVM_PRIVATE_KEY  — wallet with USDC on Base (or Base Sepolia if testing testnet)
 * Optional:
 *   X402_HOST        — default https://NWB-Vending.com
 *   X402_URL         — full gated file URL (default: cheapest tool, $0.05)
 *   X402_NETWORK     — default base (use base-sepolia for testnet)
 *
 * Flow: GET → 402 → sign USDC auth → retry with X-PAYMENT → 200 + file
 */
import {
  wrapFetchWithPaymentFromConfig,
  decodePaymentResponseHeader,
} from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { createWalletClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { exitClean } from "./exit-clean.mjs";

const HOST = process.env.X402_HOST || "https://NWB-Vending.com";
const NETWORK = process.env.X402_NETWORK || "base";
const DEFAULT_URL =
  `${HOST}/2nd-pages/materials-factory/tools/should-i-automate/full/rules.json`;
const TARGET = process.env.X402_URL || DEFAULT_URL;

function normalizePrivateKey(raw) {
  let k = raw.trim().replace(/\s+/g, "");
  if (!k.startsWith("0x")) k = `0x${k}`;
  const hex = k.slice(2);
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error("Key has non-hex characters — paste only the private key from MetaMask.");
  }
  if (hex.length === 40) {
    throw new Error(
      "That looks like your wallet ADDRESS (40 hex chars), not the private key (64 hex chars)."
    );
  }
  if (hex.length !== 64) {
    throw new Error(`Key length wrong: got ${hex.length} hex chars, need 64.`);
  }
  return `0x${hex}`;
}

const pk = process.env.EVM_PRIVATE_KEY;
if (!pk) {
  console.error(`
Missing EVM_PRIVATE_KEY.

This must be the private key for a wallet that holds USDC on ${NETWORK}.
Do NOT paste it in chat — set it only in your local terminal:

  PowerShell:
    $env:EVM_PRIVATE_KEY="0xYourKeyHere"
    node scripts/test-x402-unlock.mjs

  cmd:
    set EVM_PRIVATE_KEY=0xYourKeyHere
    node scripts/test-x402-unlock.mjs

Cheapest test pack: Should I Automate tool — $0.05 USDC on Base.
`);
  exitClean(1);
}

let normalizedPk;
let walletClient;
try {
  normalizedPk = normalizePrivateKey(pk);
  const account = privateKeyToAccount(normalizedPk);
  const chain = NETWORK === "base-sepolia" ? baseSepolia : base;
  walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
  });
} catch (e) {
  console.error("Bad EVM_PRIVATE_KEY:", e.message);
  exitClean(1);
}
const buyerAddress = walletClient.account.address;
const caip2 = NETWORK === "base-sepolia" ? "eip155:84532" : "eip155:8453";
const fetchWithPay = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [
    {
      network: caip2,
      client: new ExactEvmScheme(walletClient.account),
    },
  ],
});

console.log(`x402 unlock test`);
console.log(`  network: ${NETWORK}`);
console.log(`  url:     ${TARGET}`);
console.log(`  wallet:  ${buyerAddress}`);
console.log();

try {
  const res = await fetchWithPay(TARGET, { method: "GET" });
  const body = await res.text();

  console.log(`status: ${res.status}`);

  const paymentHdr =
    res.headers.get("payment-response") ||
    res.headers.get("PAYMENT-RESPONSE");
  if (paymentHdr) {
    try {
      const settled = decodePaymentResponseHeader(paymentHdr);
      console.log("payment settled:", JSON.stringify(settled, null, 2));
    } catch {
      console.log("payment-response:", paymentHdr.slice(0, 200));
    }
  }

  if (res.status === 200) {
    let preview = body;
    try {
      const j = JSON.parse(body);
      preview = JSON.stringify(j, null, 2).slice(0, 600);
    } catch {
      preview = body.slice(0, 600);
    }
    console.log("\nUNLOCKED — file preview:\n", preview);
    console.log("\nPASS: full pay-to-unlock flow worked.");
    exitClean(0);
    return;
  }

  console.log("\nbody:", body.slice(0, 500));
  console.error("\nFAIL: expected 200 after payment.");
  exitClean(1);
  return;
} catch (e) {
  console.error("\nFAIL:", e.message || e);
  if (String(e.message).includes("settlement") || String(e.message).includes("facilitator")) {
    console.error(`
Likely cause: worker facilitator cannot settle on ${NETWORK}.
x402.org facilitator is TESTNET ONLY. For Base mainnet you need:
  1. CDP API keys from https://portal.cdp.coinbase.com
  2. Cloudflare worker secrets: CDP_API_KEY_ID, CDP_API_KEY_SECRET
  3. FACILITATOR_URL=https://api.cdp.coinbase.com/platform/v2/x402
  4. wrangler deploy`);
  }
  exitClean(1);
}