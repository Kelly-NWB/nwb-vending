import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, '2nd-pages', 'materials-factory');
const SRC = path.join('D:', 'GrokBuild', 'Experiments', '402 Biz', 'templates');
const MIN_ID = 16;

function discover() {
  return fs.readdirSync(SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pbPath = path.join(SRC, d.name, 'full', 'playbook.json');
      if (!fs.existsSync(pbPath)) return null;
      const pb = JSON.parse(fs.readFileSync(pbPath, 'utf8'));
      const num = parseInt(String(pb.artifact).split('-').pop(), 10);
      if (num < MIN_ID) return null;
      return { slug: d.name, artifact: pb.artifact, title: pb.title };
    })
    .filter(Boolean)
    .sort((a, b) => parseInt(a.artifact.split('-').pop(), 10) - parseInt(b.artifact.split('-').pop(), 10));
}

const staged = discover();
const manifestPath = path.join(MF, 'catalog-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const newEntries = staged.map((m) => ({
  id: m.artifact,
  section: 'templates',
  title: m.title,
  price: '$0.45',
  teaser: `templates/${m.slug}/`,
  full: `templates/${m.slug}/full/`,
  primary: 'playbook.json',
  apply: 'branch → template → log row',
}));

manifest.entry_count = manifest.entries.length + newEntries.length;
manifest.job_spine.extensions = staged.map((m) => m.artifact);
manifest.entries.push(...newEntries);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('manifest entries:', manifest.entry_count);

const compact = (m) =>
  `<article class="entry" id="${m.artifact}"><p class="entry-id">ENTRY: ${m.artifact}</p><h3>${m.title}</h3><dl class="kv"><dt>TEASER</dt><dd><a href="templates/${m.slug}/">${m.slug}/</a></dd><dt>FULL</dt><dd><a href="templates/${m.slug}/full/">full/</a> · $0.45</dd></dl></article>`;

const extensionsHtml = `
      <p class="entry-id">SECTION: templates · spine extensions · ${staged.length} entries (mf-tpl-016..055)</p>
      <p class="mission">Branch packs cross-linked in playbook.json related_artifacts. Fetch via catalog-manifest job_spine.extensions.</p>
${staged.map(compact).join('\n')}`;

const indexPath = path.join(MF, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/19 entries/g, '59 entries');
html = html.replace(/SECTION: templates · 15 entries/g, 'SECTION: templates · 55 entries');
html = html.replace(
  /(<article class="entry" id="mf-tpl-015">[\s\S]*?<\/article>)\s*(<\/section>)/,
  `$1\n${extensionsHtml}\n    $2`
);
html = html.replace(
  /<p><strong>Overlay:<\/strong> mf-tpl-005 weekly ops · mf-tpl-001 complaints · mf-tool-001\/002\/003 decision rubrics\.<\/p>/,
  '<p><strong>Overlay:</strong> mf-tpl-005 weekly ops · mf-tpl-001 complaints · mf-tool-001/002/003 decision rubrics.</p>\n      <p><strong>Extensions:</strong> mf-tpl-016..055 branch packs (deposit, install, rush, referral, and more). See <code>job_spine.extensions</code> in manifest.</p>'
);
fs.writeFileSync(indexPath, html);
console.log('updated index.html');

const workerPath = path.join(ROOT, 'worker', 'index.ts');
let worker = fs.readFileSync(workerPath, 'utf8');
const gateBlock = staged.map((m) => `  {
    prefix: "/2nd-pages/materials-factory/templates/${m.slug}/full",
    price: "$0.45",
    description: "${m.title.replace(/"/g, '\\"')} agent pack (${m.artifact})",
    artifact: "${m.artifact}",
  },`).join('\n');

if (!worker.includes('deposit-reminder/full')) {
  worker = worker.replace(
    /(\s+artifact: "mf-tpl-015",\s+\},\n)(];)/,
    `$1${gateBlock}\n$2`
  );
  fs.writeFileSync(workerPath, worker);
  console.log('worker gates:', staged.length, 'added');
} else {
  console.log('worker gates already present, skip');
}