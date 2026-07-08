import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join('D:', 'GrokBuild', 'Experiments', '402 Biz', 'templates');
const DST = path.join(ROOT, '2nd-pages', 'materials-factory', 'templates');
const MIN_ID = parseInt(process.argv[2] || '16', 10);

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
{"artifact":"${m.artifact}","audience":"agent","version":"1.0.0","files":["playbook.json","templates.json","examples.json","AGENT.md"],"primary":"playbook.json","apply":"branch → template → log row","teaser":"../index.html"}
  </script>
  <script>document.getElementById('manifest').textContent=document.getElementById('manifest-data').textContent.trim()</script>
</body>
</html>`;
}

function discover() {
  return fs.readdirSync(SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pbPath = path.join(SRC, d.name, 'full', 'playbook.json');
      if (!fs.existsSync(pbPath)) return null;
      const pb = JSON.parse(fs.readFileSync(pbPath, 'utf8'));
      const num = parseInt(String(pb.artifact).split('-').pop(), 10);
      if (Number.isNaN(num) || num < MIN_ID) return null;
      return {
        slug: d.name,
        artifact: pb.artifact,
        title: pb.title,
        mission: pb.description || `${pb.title} for job spine.`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => parseInt(a.artifact.split('-').pop(), 10) - parseInt(b.artifact.split('-').pop(), 10));
}

const modules = discover();
if (!modules.length) {
  console.error('No modules found with id >=', MIN_ID);
  process.exit(1);
}

for (const m of modules) {
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
  }, null, 2);
  fs.writeFileSync(path.join(DST, m.slug, 'index.html'), teaserHtml(m, exampleJson));
  fs.writeFileSync(path.join(dstDir, 'index.html'), fullIndexHtml(m));
  console.log('deployed', m.artifact, m.slug);
}

console.log('total:', modules.length);