#!/usr/bin/env node
/**
 * Smoke-test x402 pipe: health, public manifest, gated 402 response.
 * Does NOT perform a paid unlock (needs x402 client + wallet).
 */
const HOST = process.env.X402_HOST || "https://NWB-Vending.com";

const tests = [
  {
    name: "health",
    path: "/__x402/health",
    expectStatus: 200,
    check: (body, headers) => {
      const j = JSON.parse(body);
      if (!j.ok) throw new Error("ok !== true");
      if (j.network !== "base") throw new Error(`network=${j.network}, expected base`);
      const n = j.gated_routes?.length ?? 0;
      if (n !== 82) throw new Error(`gated_routes=${n}, expected 82`);
      return `82 routes, network=${j.network}, pay_to_suffix=${j.pay_to_suffix}`;
    },
  },
  {
    name: "manifest (public)",
    path: "/2nd-pages/materials-factory/catalog-manifest.json",
    expectStatus: 200,
    check: (body) => {
      const j = JSON.parse(body);
      if (j.protocol !== "x402") throw new Error("protocol !== x402");
      if (j.entry_count !== 82) throw new Error(`entry_count=${j.entry_count}`);
      return `entry_count=${j.entry_count}, protocol=${j.protocol}`;
    },
  },
  {
    name: "gated playbook (unpaid)",
    path: "/2nd-pages/materials-factory/templates/complaint-recovery-playbook/full/playbook.json",
    expectStatus: 402,
    check: (body, headers) => {
      const hasPayment =
        headers.get("payment-required") ||
        headers.get("x-payment-required") ||
        headers.get("www-authenticate");
      let detail = "";
      try {
        const j = JSON.parse(body);
        detail = j.error || j.message || JSON.stringify(j).slice(0, 120);
      } catch {
        detail = body.slice(0, 120);
      }
      if (!hasPayment && !body.toLowerCase().includes("payment")) {
        throw new Error(`no payment signal in headers/body: ${detail}`);
      }
      return `402 + payment signal · ${detail}`;
    },
  },
  {
    name: "gated tool rules (unpaid)",
    path: "/2nd-pages/materials-factory/tools/should-i-automate/full/rules.json",
    expectStatus: 402,
    check: (body) => {
      if (!body) throw new Error("empty body");
      return "402 on tool full/rules.json";
    },
  },
  {
    name: "teaser (public)",
    path: "/2nd-pages/materials-factory/templates/complaint-recovery-playbook/",
    expectStatus: 200,
    check: (body) => {
      if (!body.includes("x402") && !body.includes("USDC")) {
        throw new Error("teaser missing x402/USDC mention");
      }
      return "teaser reachable";
    },
  },
];

async function runOne(base, t) {
  const url = base + t.path;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const body = await res.text();
  if (res.status !== t.expectStatus) {
    throw new Error(`status ${res.status}, expected ${t.expectStatus} · ${body.slice(0, 200)}`);
  }
  const summary = t.check(body, res.headers);
  return summary;
}

async function main() {
  console.log(`x402 pipe test → ${HOST}\n`);
  const results = [];
  let failed = 0;

  for (const t of tests) {
    try {
      const summary = await runOne(HOST, t);
      console.log(`PASS  ${t.name}: ${summary}`);
      results.push({ name: t.name, status: "PASS", detail: summary });
    } catch (e) {
      console.log(`FAIL  ${t.name}: ${e.message}`);
      results.push({ name: t.name, status: "FAIL", detail: e.message });
      failed++;
    }
  }

  console.log(`\n${failed === 0 ? "ALL PASS" : `${failed} FAILED`} (${tests.length} checks)`);
  return { host: HOST, results, failed };
}

main()
  .then(({ failed }) => process.exit(failed ? 1 : 0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });