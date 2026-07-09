#!/usr/bin/env node
/** After push28: both URLs must match. No PowerShell execution policy needed. */
const path = process.argv[2] || '/2nd-pages/materials-factory/';
const mustContain = process.argv[3] || '';

const preview = `https://kelly-nwb.github.io/nwb-vending${path}`;
const live = `https://NWB-Vending.com${path}`;

async function body(url) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(25000) });
    return await r.text();
  } catch {
    return null;
  }
}

const p = await body(preview);
const l = await body(live);

if (!p) {
  console.error('FAIL: preview not reachable:', preview);
  process.exit(1);
}
if (!l) {
  console.error('FAIL: live not reachable:', live);
  process.exit(1);
}

console.log('OK  preview:', preview);
console.log('OK  live:   ', live);

if (mustContain) {
  const pHas = p.includes(mustContain);
  const lHas = l.includes(mustContain);
  console.log(`preview contains "${mustContain}":`, pHas);
  console.log(`live contains "${mustContain}":   `, lHas);
  if (!pHas) {
    console.error('FAIL: preview missing expected text');
    process.exit(1);
  }
  if (!lHas) {
    console.error('FAIL: NWB-Vending.com stale. Cloudflare deploy may need dashboard check or wrangler deploy.');
    process.exit(1);
  }
}

console.log('PASS: both URLs reachable' + (mustContain ? ' and in sync' : ''));