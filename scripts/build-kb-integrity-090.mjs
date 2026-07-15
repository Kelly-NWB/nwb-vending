#!/usr/bin/env node
/**
 * mf-tpl-090 Support knowledge repo + content integrity (engineers gone bad).
 * Local; no push. openapi + well-known + audit after.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const KNOWN = {
  "mf-tpl-059": "shadow-expert-mining",
  "mf-tpl-067": "rd-support-bridge",
  "mf-tpl-085": "pie-weekly-bridge",
  "mf-tpl-088": "escalation-engineer-ladder",
  "mf-tpl-089": "preventable-ticket-kill",
  "mf-tpl-090": "support-knowledge-repo",
};

const p = {
  id: "mf-tpl-090",
  slug: "support-knowledge-repo",
  title: "Support Knowledge Repo Playbook",
  mission:
    "Task support engineers to build a how-to repo that solves problems before the call. Market it to sales and customers. Then govern it: origin, license, no scrape-and-rebrand. Trust but verify technical heroes.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "Support eng build an unreal how-to repo. Sales loves it. Month later: escalation. Content scraped word-for-word and rebranded as ours.",
    branch: "integrity-breach",
    resolution:
      "Content pulled. Source audit. Contribution rules and review gate. Repo stays; theft does not.",
    log_row: "kb-v1,launch-huge,plagiarism-hit,gate-on,ok",
  },
  teaserBullets: [
    "Engineer-built how-to repo for pre-call solve",
    "Push to sales and customers when quality is real",
    "Integrity gate: origin, no scrape-and-rebrand",
  ],
  pairs: ["mf-tpl-089", "mf-tpl-088", "mf-tpl-059", "mf-tpl-067"],
  tags: ["field-patterns", "knowledge-base", "integrity", "support-ops"],
  playbook: {
    description:
      "Launch a support-engineer-owned knowledge repo (how-tos, help docs, preemptive fixes), distribute via sales when ready, and enforce content integrity so technical contributors cannot scrape third-party work and rebrand it as company IP.",
    mindset: {
      principle:
        "A great repo is a growth engine. One stolen article can torch trust with authors, customers, and your own company. Technical skill is not a character reference.",
      mistakes: [
        {
          id: "launch-no-gate",
          label: "Ship volume of content with no origin or review rule",
          cost: "Plagiarism lands in production marketing",
        },
        {
          id: "trust-only-tech",
          label: "Assume top engineers self-police IP and ethics",
          cost: "Blind spot; discovery via angry original author",
        },
        {
          id: "kill-repo-after-one",
          label: "Burn the whole program because one person stole",
          cost: "Lose the preemptive support win; culture of fear",
        },
        {
          id: "never-market",
          label: "Build gold and hide it from sales/customers",
          cost: "Still take every how-to call",
        },
      ],
    },
    program_phases: [
      {
        id: "charter",
        label: "Challenge: solve problems before they ring; repo is the vehicle",
      },
      {
        id: "build",
        label: "Support engineers own how-tos and help depth",
      },
      {
        id: "distribute",
        label: "When quality holds, push to sales for customer use; market it",
      },
      {
        id: "govern",
        label: "Origin, license, review, takedown path",
      },
    ],
    decision_branches: [
      {
        id: "stand-up-repo",
        situation: "Need preemptive how-to depth owned by support eng",
        action: "repo-charter",
      },
      {
        id: "go-to-market",
        situation: "Repo is strong enough for sales/customers",
        action: "sales-enable-pack",
      },
      {
        id: "integrity-breach",
        situation: "Copied or scraped third-party content found",
        action: "integrity-incident",
      },
      {
        id: "trust-but-verify",
        situation: "High-output technical contributors, low process",
        action: "contribution-gate",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Charter repo and mission",
          goal: "Preemptive solve, not random wiki",
          minutes: "60",
        },
        {
          id: 2,
          name: "Set contribution and origin rules before scale",
          goal: "Gate before marketing",
          minutes: "half-day",
        },
        {
          id: 3,
          name: "Build and sample-review",
          goal: "Quality + integrity",
          minutes: "ongoing",
        },
        {
          id: 4,
          name: "Enable sales only after gate",
          goal: "Huge distribution without legal landmine",
          minutes: "when ready",
        },
      ],
    },
    tracking: {
      csv_header:
        "week,articles_added,reviewed_pct,sales_shares,integrity_flags,takedowns,owner",
      sheet_tab_name: "support_knowledge_repo",
    },
    related_artifacts: [
      "mf-tpl-089",
      "mf-tpl-088",
      "mf-tpl-059",
      "mf-tpl-067",
    ],
    agent_signal: {
      use_when:
        "Support engineers building how-to/knowledge repo. Pushing KB to sales/customers. Need contribution integrity gate after plagiarism risk. Trust but verify technical heroes.",
      decision_criteria: [
        "Charter preemptive solve before dumping docs.",
        "Origin and review rules before external marketing.",
        "Integrity hit: takedown and process fix; do not necessarily kill the program.",
      ],
      operator_context:
        "Field pattern: unreal repo success, then scrape-and-rebrand breach. Govern technical trust.",
      tags: ["field-patterns", "knowledge-base", "integrity", "support-ops"],
    },
  },
  templates: [
    {
      id: "repo-charter",
      use_when: "stand-up-repo",
      body: "SUPPORT KNOWLEDGE REPO CHARTER\nMission: solve problems before the call\nOwners (support eng leads): _______________\nIn scope: how-tos, help docs, known fixes\nOut of scope: scraped third-party copy, secrets, customer PII\nSuccess metric: _______________\nDate: _______",
    },
    {
      id: "contribution-gate",
      use_when: "trust-but-verify",
      body: "CONTRIBUTION GATE\nBefore publish, author attests:\n[ ] Original or properly licensed\n[ ] Source listed if adapted\n[ ] No word-for-word third-party scrape\n[ ] No secrets/PII\nReviewer: _______________  Sample rate: ___%\nBlock merge without attestation: Y",
    },
    {
      id: "sales-enable-pack",
      use_when: "go-to-market",
      body: "SALES ENABLE PACK (KB)\nRepo URL / pack: _______________\nWhen to give customers: _______________\nWhat not to promise: _______________\nIntegrity status (gate passed): Y/N\nMarketing one-liner: _______________",
    },
    {
      id: "integrity-incident",
      use_when: "integrity-breach",
      body: "INTEGRITY INCIDENT\nDate found: _______  Article/IDs: _______________\nOriginal source (if known): _______________\nAction: [ ] takedown  [ ] rewrite original  [ ] notify counsel if needed\nAuthor handling (HR/process): _______________\nGate fix so it cannot repeat: _______________\nRepo program: [ ] continue with gate  [ ] pause  [ ] narrow scope",
    },
    {
      id: "sample-audit-row",
      use_when: "trust-but-verify",
      body: "KB SAMPLE AUDIT ROW\nWeek: _______  Articles sampled: ___\nPass: ___  Flag: ___  Takedown: ___\nNotes: _______________",
    },
  ],
  examples: [
    {
      id: "ex-unreal-repo",
      context:
        "Challenged support engineers to build how-to repo for preemptive solve. They delivered depth. Sales and marketing pushed it. Huge.",
      branch: "stand-up-repo",
      templates_used: ["repo-charter", "sales-enable-pack"],
      resolution:
        "Customers and sales got a real asset. Call deflection up on covered topics.",
      log_row: "repo-launch,sales-push,huge,ok",
    },
    {
      id: "ex-scrape-rebrand",
      context:
        "Escalation: engineer scraped code/docs and rebranded word-for-word as company content. Original author and company both hit.",
      branch: "integrity-breach",
      templates_used: ["integrity-incident", "contribution-gate"],
      resolution:
        "Content removed. Contribution attestation and review required. Program continued under gate.",
      log_row: "plagiarism,takedown,gate-on,program-kept",
    },
    {
      id: "ex-trust-verify",
      context:
        "High-output technical contributors; leadership assumed ethics matched skill.",
      branch: "trust-but-verify",
      templates_used: ["contribution-gate", "sample-audit-row"],
      resolution:
        "Sample audit permanent. Skill no longer substitutes for origin check.",
      log_row: "sample-audit,standing,ok",
    },
  ],
  agentMd:
    "1. Start → **repo-charter** (preemptive solve).\n2. Before any hero scale → **contribution-gate**.\n3. Ready for sales → **sales-enable-pack** only if gate passed.\n4. Theft/scrape found → **integrity-incident** (takedown + fix gate; keep program if possible).\n5. Ongoing → **sample-audit-row**.\n6. Pair **mf-tpl-089** ticket kill; **mf-tpl-088** eng ladder ownership of quality.",
};

function writeJson(f, o) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(o, null, 2) + "\n");
}
function slug(id) {
  return KNOWN[id] || id.replace(/^mf-tpl-/, "");
}

const base = path.join(TPL, p.slug);
const full = path.join(base, "full");
fs.mkdirSync(full, { recursive: true });

const playbook = {
  artifact: p.id,
  title: p.title,
  version: "1.2.0",
  audience: "agent",
  section: "templates",
  lane: p.lane,
  pack_type: "field-pattern",
  ...p.playbook,
  agent_signal: {
    ...p.playbook.agent_signal,
    version: "1.2",
    not_for: "Legal advice on IP disputes. Route serious claims to counsel.",
    pairs_with: p.playbook.related_artifacts,
    trigger_phrases: [
      p.playbook.agent_signal.use_when.slice(0, 80),
      `Need playbook: ${p.title}`,
    ],
  },
};
writeJson(path.join(full, "playbook.json"), playbook);
writeJson(path.join(full, "templates.json"), {
  artifact: p.id,
  version: "1.2.0",
  templates: p.templates,
});
writeJson(path.join(full, "examples.json"), {
  artifact: p.id,
  version: "1.2.0",
  description: p.playbook.description,
  examples: p.examples,
});
fs.writeFileSync(
  path.join(full, "AGENT.md"),
  `# ${p.id} · ${p.title}\n\n**Audience:** agents. ${p.mission}\n\n## Apply\n${p.agentMd}\n`
);
fs.writeFileSync(
  path.join(base, "index.html"),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${p.id} teaser. ${p.mission.slice(0, 120)}">
  <meta name="x402:artifact" content="${p.id}">
  <meta name="x402:teaser" content="true">
  <meta name="x402:audience" content="agent">
  <title>${p.title} (teaser) | Materials Factory</title>
  <link rel="stylesheet" href="../../style.css">
</head>
<body>
  <div class="wrap">
    <header class="hdr">
      <h1>${p.title}</h1>
      <p class="sub">ENTRY: ${p.id} · field-patterns</p>
      <p class="mission">${p.mission}</p>
    </header>
    <section class="block">
      <h2>Free worked example</h2>
      <pre class="meta">${JSON.stringify(p.teaserExample, null, 2)}</pre>
    </section>
    <section class="block">
      <h2>Full pack (x402)</h2>
      <ul class="module-list">
${p.teaserBullets.map((b) => `        <li>${b}</li>`).join("\n")}
      </ul>
      <dl class="kv">
        <dt>FULL</dt><dd><a href="full/">templates/${p.slug}/full/</a></dd>
        <dt>PRICE</dt><dd class="status-ready">$0.08 · USDC on Base</dd>
        <dt>PAIRS</dt>
        <dd>${p.pairs.map((x) => `<a href="../${slug(x)}/">${x}</a>`).join(" · ")}</dd>
      </dl>
    </section>
    <footer class="foot"><a href="../../index.html">← Materials Factory catalog</a></footer>
  </div>
</body>
</html>
`
);
fs.writeFileSync(
  path.join(full, "index.html"),
  `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="robots" content="noindex">
<meta name="x402:artifact" content="${p.id}"><meta name="x402:full" content="true">
<meta name="x402:primary" content="playbook.json">
<title>${p.id} full</title>
<style>body{margin:0;padding:1.25rem;font-family:ui-monospace,Consolas,monospace;background:#0c0c0e;color:#c8c8d0;font-size:13px}a{color:#5eb3ff}</style>
</head><body>
<h1>${p.id} · ${p.title}</h1>
<p><a href="../index.html">← Teaser</a></p>
<ul>
<li><a href="playbook.json">playbook.json</a></li>
<li><a href="templates.json">templates.json</a></li>
<li><a href="examples.json">examples.json</a></li>
<li><a href="AGENT.md">AGENT.md</a></li>
</ul>
</body></html>
`
);

const manifestPath = path.join(MF, "catalog-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const entry = {
  id: p.id,
  section: "templates",
  lane: p.lane,
  pack_type: "field-pattern",
  title: p.title,
  price: "$0.08",
  teaser: `templates/${p.slug}/`,
  full: `templates/${p.slug}/full/`,
  primary: "playbook.json",
  apply: "branch → template → log",
  description: p.mission.slice(0, 140),
  tags: p.tags,
  use_when: p.playbook.agent_signal.use_when,
  not_for: "Legal advice on IP disputes. Route serious claims to counsel.",
  pairs_with: p.playbook.related_artifacts,
  trigger_phrases: [
    p.playbook.agent_signal.use_when.slice(0, 80),
    `Need playbook: ${p.title}`,
  ],
  agent_signal_version: "1.2",
};
const byId = new Map(manifest.entries.map((e) => [e.id, e]));
byId.set(entry.id, entry);
const order = manifest.entries.map((e) => e.id);
if (!order.includes(entry.id)) order.push(entry.id);
manifest.entries = order.map((id) => byId.get(id)).filter(Boolean);
manifest.entry_count = manifest.entries.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

let indexHtml = fs.readFileSync(path.join(MF, "index.html"), "utf8");
if (!indexHtml.includes(`id="${p.id}"`)) {
  const art = `<article class="entry" id="${p.id}"><p class="entry-id">ENTRY: ${p.id} · field-patterns</p><h3>${p.title}</h3><dl class="kv"><dt>TEASER</dt><dd><a href="templates/${p.slug}/">${p.slug}/</a></dd><dt>FULL</dt><dd><a href="templates/${p.slug}/full/">full/</a> · $0.08</dd></dl></article>`;
  if (indexHtml.includes("</main>"))
    indexHtml = indexHtml.replace("</main>", art + "\n</main>");
  else if (indexHtml.includes('<footer class="foot">'))
    indexHtml = indexHtml.replace(
      '<footer class="foot">',
      art + '\n<footer class="foot">'
    );
}
const n = manifest.entry_count;
indexHtml = indexHtml.replace(
  /(\d+)\s+entries\s+·\s+<a href="catalog-manifest\.json">/,
  `${n} entries · <a href="catalog-manifest.json">`
);
indexHtml = indexHtml.replace(
  /x402scan<\/a>\s*\(\d+\s+resources\)/,
  `x402scan</a> (${n} resources)`
);
fs.writeFileSync(path.join(MF, "index.html"), indexHtml);

let worker = fs.readFileSync(path.join(ROOT, "worker", "index.ts"), "utf8");
const needle = `prefix: "/2nd-pages/materials-factory/templates/${p.slug}/full"`;
if (!worker.includes(needle)) {
  worker = worker.replace(
    "];\n\nconst NETWORK_CAIP2",
    `  {
    prefix: "/2nd-pages/materials-factory/templates/${p.slug}/full",
    price: "$0.08",
    description: "${p.title} agent pack (${p.id})",
    artifact: "${p.id}",
  },
];\n\nconst NETWORK_CAIP2`
  );
  fs.writeFileSync(path.join(ROOT, "worker", "index.ts"), worker);
}
console.log("wrote", p.id, "manifest", n);
