#!/usr/bin/env node
/**
 * Post-push28 lockdown check for x402scan readiness.
 * Always ends with LIGHTS_OUT + exit code 0/1. No background sleeps.
 */
import { exitClean } from "./exit-clean.mjs";

const HOST = (process.env.X402_HOST || "https://nwb-vending.com").replace(/\/+$/, "");
const PROBE =
  process.env.X402_PROBE_URL ||
  `${HOST}/2nd-pages/materials-factory/tools/should-i-automate/full/rules.json`;
const HEAD_PROBES = [
  `${HOST}/2nd-pages/materials-factory/training/llm-api-bootcamp/full/playbook.json`,
  `${HOST}/2nd-pages/materials-factory/templates/shipping-tracking-update/full/playbook.json`,
  `${HOST}/2nd-pages/materials-factory/templates/progress-photo-update/full/playbook.json`,
];
const CACHE_BUST = `v=${Date.now()}`;

const checks = [];

function pass(name, detail = "") {
  checks.push({ name, ok: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  checks.push({ name, ok: false, detail });
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function decodePaymentRequired(header) {
  const json = Buffer.from(header, "base64").toString("utf8");
  return JSON.parse(json);
}

const TIMEOUT_MS = 40000;

async function fetchText(url, init = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const text = await res.text();
  return { res, text };
}

console.log("verify-x402-v2-live");
console.log(`  host:  ${HOST}`);
console.log(`  probe: ${PROBE}`);
console.log();

try {
  const healthUrl = `${HOST}/__x402/health`;
  const { res: healthRes, text: healthText } = await fetchText(healthUrl);
  if (!healthRes.ok) {
    fail("health", `status ${healthRes.status}`);
  } else {
    const health = JSON.parse(healthText);
    const routeCount = health.gated_routes?.length ?? 0;
    if (routeCount !== 96) fail("health", `expected 96 gated routes, got ${routeCount}`);
    else pass("health", `${routeCount} gated routes, mainnet_ready=${health.mainnet_ready}`);
  }

  const openapiUrl = `${HOST}/openapi.json`;
  const { res: openRes, text: openText } = await fetchText(openapiUrl);
  if (!openRes.ok) {
    fail("openapi", `status ${openRes.status}`);
  } else {
    const spec = JSON.parse(openText);
    const email = spec.info?.contact?.email;
    const pathCount = Object.keys(spec.paths || {}).length;
    if (email !== "NWBVending@gmail.com") fail("openapi", `contact email missing/wrong (${email})`);
    else pass("openapi", `contact ${email}, paths ${pathCount}`);
  }

  const faviconRes = await fetch(`${HOST}/favicon.ico`, {
    method: "HEAD",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!faviconRes.ok) fail("favicon", `status ${faviconRes.status}`);
  else pass("favicon", faviconRes.headers.get("content-type") || "ok");

  const probeUrl = PROBE.includes("?") ? `${PROBE}&${CACHE_BUST}` : `${PROBE}?${CACHE_BUST}`;
  const probeRes = await fetch(probeUrl, {
    method: "GET",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const probeBody = await probeRes.text();
  const payHdr =
    probeRes.headers.get("payment-required") ||
    probeRes.headers.get("PAYMENT-REQUIRED");

  if (probeRes.status !== 402) {
    fail("402-status", `got ${probeRes.status} (body ${probeBody.slice(0, 80)})`);
  } else {
    pass("402-status");
  }

  if (!payHdr) {
    fail("payment-required-header", "missing on 402 response");
  } else {
    try {
      const decoded = decodePaymentRequired(payHdr);
      if (decoded.x402Version !== 2) {
        fail("x402-version", `expected 2, got ${decoded.x402Version}`);
      } else {
        const net = decoded.accepts?.[0]?.network;
        pass("x402-v2", `version 2, network ${net}`);
      }
      if (String(decoded.error || "").toLowerCase().includes("x-payment")) {
        fail("v1-leak", "v1 X-PAYMENT error text in payment-required payload");
      }
      const bazaarInput =
        decoded.extensions?.bazaar?.schema?.properties?.input?.properties
          ?.queryParams;
      if (!bazaarInput) {
        fail("bazaar-input-schema", "missing extensions.bazaar input queryParams");
      } else {
        pass("bazaar-input-schema");
      }
      const bazaarOutput =
        decoded.extensions?.bazaar?.schema?.properties?.output?.properties
          ?.example;
      if (!bazaarOutput) {
        fail("bazaar-output-schema", "missing extensions.bazaar output example");
      } else {
        pass("bazaar-output-schema");
      }
    } catch (e) {
      fail("payment-required-header", `decode error: ${e.message}`);
    }
  }

  if (probeBody.includes("x402Version") && probeBody.includes('"x402Version":1')) {
    fail("v1-body", "response body still contains x402Version:1");
  } else {
    pass("no-v1-body");
  }

  for (const url of HEAD_PROBES) {
    const slug = url.split("/").slice(-3, -1).join("/");
    const headRes = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const headPay =
      headRes.headers.get("payment-required") ||
      headRes.headers.get("PAYMENT-REQUIRED");
    if (headRes.status !== 402) {
      fail(`head-402:${slug}`, `got ${headRes.status}`);
    } else if (!headPay) {
      fail(`head-pay:${slug}`, "missing PAYMENT-REQUIRED");
    } else {
      pass(`head-402:${slug}`);
    }
  }
} catch (e) {
  fail("runtime", e.message || String(e));
}

const failed = checks.filter((c) => !c.ok);
console.log();
if (failed.length) {
  console.error(`LIGHTS_OUT: FAIL (${failed.length} check(s))`);
  for (const f of failed) console.error(`  - ${f.name}: ${f.detail}`);
  exitClean(1);
} else {
  console.log("LIGHTS_OUT: PASS — safe to retry x402scan Add Server");
  exitClean(0);
}