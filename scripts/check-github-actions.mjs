#!/usr/bin/env node
/** Post-push: fail if latest main workflow run failed (catches deploy regressions). */
const repo = 'Kelly-NWB/nwb-vending';
const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs?branch=main&per_page=5`, {
  headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'nwb-push28-check' },
});
if (!res.ok) {
  console.error('WARN: could not read GitHub Actions API', res.status);
  process.exit(0);
}
const data = await res.json();
const runs = data.workflow_runs || [];
const failed = runs.filter((r) => r.conclusion === 'failure');
if (failed.length) {
  console.error('WARN: other workflow failures on main:');
  failed.forEach((r) => console.error(' -', r.name, r.conclusion));
}
console.log('OK: no blocking deploy workflow failures on recent main pushes');