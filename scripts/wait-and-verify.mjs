#!/usr/bin/env node
/** Poll verify-x402-v2-live until PASS or attempts exhausted. Synchronous, explicit finish. */
import { spawnSync } from "node:child_process";
import { exitClean } from "./exit-clean.mjs";

const ATTEMPTS = Number(process.env.VERIFY_ATTEMPTS || "5");
const DELAY_MS = Number(process.env.VERIFY_DELAY_MS || "20000");
const script = new URL("./verify-x402-v2-live.mjs", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

console.log(`wait-and-verify: up to ${ATTEMPTS} tries, ${DELAY_MS}ms apart`);
console.log();

for (let i = 1; i <= ATTEMPTS; i++) {
  if (i > 1) {
    console.log(`--- wait ${DELAY_MS}ms (attempt ${i}/${ATTEMPTS}) ---`);
    await sleep(DELAY_MS);
  } else {
    console.log(`--- attempt ${i}/${ATTEMPTS} ---`);
  }
  const run = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  process.stdout.write(run.stdout || "");
  process.stderr.write(run.stderr || "");
  if (run.status === 0) {
    console.log();
    console.log(`DEPLOY_VERIFY: PASS on attempt ${i}`);
    exitClean(0);
  }
}

console.error();
console.error(`DEPLOY_VERIFY: FAIL after ${ATTEMPTS} attempts`);
exitClean(1);