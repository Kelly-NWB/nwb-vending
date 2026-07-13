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
import { createSigner } from "x402/types";
import { wrapFetchWithPayment } from "x402-fetch";
import { decodeXPaymentResponse } from "x402/shared";

const HOST = process.env.X402_HOST || "https://NWB-Vending.com";
const NETWORK = process.env.X402_NETWORK || "base";
const DEFAULT_URL =
  `${HOST}/2nd-pages/materials-factory/tools/should-i-automate/full/rules.json`;
const TARGET = process.env.X402_URL || DEFAULT_URL;

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
  process.exit(1);
}

const signer = createSigner(NETWORK, pk);
const fetchWithPay = wrapFetchWithPayment(fetch, signer, 100_000n); // max $0.10

console.log(`x402 unlock test`);
console.log(`  network: ${NETWORK}`);
console.log(`  url:     ${TARGET}`);
console.log(`  wallet:  ${signer.account.address}\n`);

try {
  const res = await fetchWithPay(TARGET, { method: "GET" });
  const body = await res.text();

  console.log(`status: ${res.status}`);

  const paymentHdr =
    res.headers.get("x-payment-response") ||
    res.headers.get("X-PAYMENT-RESPONSE");
  if (paymentHdr) {
    try {
      const settled = decodeXPaymentResponse(paymentHdr);
      console.log("payment settled:", JSON.stringify(settled, null, 2));
    } catch {
      console.log("x-payment-response:", paymentHdr.slice(0, 200));
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
    process.exit(0);
  }

  console.log("\nbody:", body.slice(0, 500));
  console.error("\nFAIL: expected 200 after payment.");
  process.exit(1);
} catch (e) {
  console.error("\nFAIL:", e.message || e);
  if (String(e.message).includes("settlement") || String(e.message).includes("facilitator")) {
    console.error(`
Likely cause: worker facilitator cannot settle on ${NETWORK}.
x402.org facilitator is TESTNET ONLY. For Base mainnet you need:
  1. CDP API keys from https://portal.cdp.coinbase.com
  2. Cloudflare worker secrets: CDP_API_KEY_ID, CDP_API_KEY_SECRET
  3. FACILITATOR_URL=https://api.cdp.coinbase.com/platform/v2/x402
  4. wrangler deploy

See 402 Biz/X402-UNLOCK-HOWTO.txt`);
  }
  process.exit(1);
}