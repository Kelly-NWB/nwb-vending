#!/usr/bin/env node
/** Quick buyer diagnostics — no private key needed except optional unlock test. */
import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";

const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const WALLET = process.argv[2] || "0x1144f38838A9aAf15152CB7C5cAFAE8e25EBac0C";
const TEST_URL =
  process.argv[3] ||
  "https://nwb-vending.com/2nd-pages/materials-factory/training/llm-api-bootcamp/full/playbook.json";

const client = createPublicClient({ chain: base, transport: http() });

const bal = await client.readContract({
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
  args: [WALLET],
});

console.log("diag-x402-buyer");
console.log(`  wallet: ${WALLET}`);
console.log(`  usdc:   ${formatUnits(bal, 6)} USDC on Base`);
console.log(`  test:   ${TEST_URL}`);
console.log();

const res = await fetch(TEST_URL);
const text = await res.text();
console.log(`  gate status: ${res.status}`);
if (res.status === 402) {
  try {
    const j = JSON.parse(text);
    console.log(`  network:     ${j.accepts?.[0]?.network}`);
    console.log(`  price:       ${j.accepts?.[0]?.maxAmountRequired} atomic`);
    console.log(`  resource:    ${j.accepts?.[0]?.resource}`);
  } catch {
    console.log(`  body: ${text.slice(0, 200)}`);
  }
} else {
  console.log(`  body: ${text.slice(0, 200)}`);
}