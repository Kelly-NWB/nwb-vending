import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join('D:', 'GrokBuild', 'Experiments', '402 Biz');
const DST = path.join(ROOT, '2nd-pages', 'materials-factory', 'templates');

const MODULES = [
  { slug: 'quote-estimate-gate', artifact: 'mf-tpl-006', title: 'Quote / Estimate Gate', mission: 'Gate before custom price. Chains from mf-tpl-004 intake qualify.', apply: 'gate checklist → branch → quote + terms → log' },
  { slug: 'delivery-handoff', artifact: 'mf-tpl-007', title: 'Delivery + Handoff', mission: 'Notify, handoff, confirm, close. Unpaid hold and issues wired.', apply: 'delivery type → branch → confirm → log' },
  { slug: 'invoice-payment-chase', artifact: 'mf-tpl-008', title: 'Invoice + Payment Chase', mission: 'Invoice and chase day 3/7/14. Pairs with mf-tpl-005 money block.', apply: 'invoice state → branch → log touch' },
  { slug: 'vendor-issue', artifact: 'mf-tpl-009', title: 'Vendor Issue Playbook', mission: 'Late, wrong, short, damaged: vendor chase and honest client plan.', apply: 'issue type → vendor touch → client plan' },
  { slug: 'project-kickoff', artifact: 'mf-tpl-010', title: 'Project Kickoff Checklist', mission: 'Quote accepted: deposit, schedule, proof path, kickoff email.', apply: 'accept → deposit → schedule → kickoff send' },
  { slug: 'proof-approval-gate', artifact: 'mf-tpl-011', title: 'Proof + Client Approval Gate', mission: 'Written APPROVED before production. No silence-as-OK.', apply: 'proof round → approval → release' },
  { slug: 'change-order-mid-job', artifact: 'mf-tpl-012', title: 'Change Order Mid-Job', mission: 'Scope grew: CO scripts paired with mf-tool-003.', apply: 'freeze → document → CO → accept' },
  { slug: 'client-status-update', artifact: 'mf-tpl-013', title: 'Client Status Update', mission: 'Proactive where-we-are. Short, dated, honest.', apply: 'status type → brief update → log' },
  { slug: 'quote-follow-up', artifact: 'mf-tpl-014', title: 'Quote Follow-Up', mission: 'Quote sent no reply: nudge, expire, requote, win.', apply: 'quote status → nudge calendar → log' },
  { slug: 'job-close-archive', artifact: 'mf-tpl-015', title: 'Job Close + Archive', mission: 'Paid and delivered: archive, internal close, optional review.', apply: 'verify paid → archive → close row' },
];

const FILES = ['playbook.json', 'templates.json', 'examples.json', 'AGENT.md'];

function teaserHtml(m, exampleJson) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x402:artifact" content="${m.artifact}">
  <meta name="x402:teaser" content="true">
  <meta name="x402:audience" content="agent">
  <title>${m.title} (teaser) | Materials Factory</title>
  <link rel="stylesheet" href="../../style.css">
</head>
<body>
  <div class="wrap">
    <header class="hdr">
      <h1>${m.title}</h1>
      <p class="sub">ENTRY: ${m.artifact} · SECTION: templates · agent audience</p>
      <p class="mission">${m.mission}</p>
    </header>
    <section class="block">
      <h2>Free worked example</h2>
      <pre class="meta">${exampleJson}</pre>
    </section>
    <section class="block">
      <h2>Full pack (x402)</h2>
      <dl class="kv">
        <dt>FULL (x402)</dt><dd><a href="full/">templates/${m.slug}/full/</a></dd>
        <dt>PRIMARY</dt><dd>full/playbook.json (gated)</dd>
        <dt>PRICE</dt><dd class="status-ready">$0.45 · USDC on Base</dd>
      </dl>
    </section>
    <footer class="foot"><a href="../../index.html">← Materials Factory catalog</a></footer>
  </div>
</body>
</html>`;
}

function fullIndexHtml(m) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="x402:artifact" content="${m.artifact}">
  <meta name="x402:full" content="true">
  <meta name="x402:primary" content="playbook.json">
  <title>${m.artifact} full pack | agent artifacts</title>
  <link rel="alternate" type="application/json" href="playbook.json">
  <style>
    body { margin: 0; padding: 1.25rem; font-family: ui-monospace, Consolas, monospace; background: #0c0c0e; color: #c8c8d0; font-size: 13px; line-height: 1.5; }
    a { color: #5eb3ff; }
    pre { background: #141418; border: 1px solid #2a2a32; padding: 1rem; }
  </style>
</head>
<body>
  <h1>${m.artifact} · ${m.title}</h1>
  <p>FULL PACK · x402 gated</p>
  <p><a href="../index.html">← Teaser</a> · <a href="../../../index.html">Catalog</a></p>
  <ul>
    <li><a href="playbook.json">playbook.json</a></li>
    <li><a href="templates.json">templates.json</a></li>
    <li><a href="examples.json">examples.json</a></li>
    <li><a href="AGENT.md">AGENT.md</a></li>
  </ul>
  <pre id="manifest"></pre>
  <script type="application/json" id="manifest-data">
{"artifact":"${m.artifact}","audience":"agent","version":"1.0.0","files":["playbook.json","templates.json","examples.json","AGENT.md"],"primary":"playbook.json","apply":"${m.apply}","teaser":"../index.html"}
  </script>
  <script>document.getElementById('manifest').textContent=document.getElementById('manifest-data').textContent.trim()</script>
</body>
</html>`;
}

for (const m of MODULES) {
  const srcDir = path.join(SRC, m.slug, 'full');
  const dstDir = path.join(DST, m.slug, 'full');
  fs.mkdirSync(dstDir, { recursive: true });
  for (const f of FILES) {
    fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
  }
  const ex = JSON.parse(fs.readFileSync(path.join(dstDir, 'examples.json'), 'utf8'));
  const first = ex.examples[0];
  const exampleJson = JSON.stringify({
    context: first.context,
    branch: first.branch,
    resolution: first.resolution || undefined,
    log_row: first.log_row,
  }, null, 2).replace(/\n/g, '\n');
  fs.writeFileSync(path.join(DST, m.slug, 'index.html'), teaserHtml(m, exampleJson));
  fs.writeFileSync(path.join(dstDir, 'index.html'), fullIndexHtml(m));
  console.log('deployed', m.artifact, m.slug);
}