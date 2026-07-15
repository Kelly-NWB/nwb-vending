#!/usr/bin/env node
/** mf-tpl-093 Control panel / cabinet weekly with VP directs — local, no push */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");
const KNOWN = {
  "mf-tpl-005": "weekly-ops-review",
  "mf-tpl-061": "support-ops-correlation",
  "mf-tpl-081": "metrics-that-matter-qbr",
  "mf-tpl-085": "pie-weekly-bridge",
  "mf-tpl-084": "floor-morale-task-force",
  "mf-tpl-093": "control-panel-cabinet",
};

const p = {
  id: "mf-tpl-093",
  slug: "control-panel-cabinet",
  title: "Control Panel Cabinet Playbook",
  mission:
    "Weekly cabinet with the VP and their directs. Each owner covers their slice of the control panel. Shared picture, no silo theater. Sibling to PIE and floor task forces; this one is leadership operating rhythm.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "VP directs only meet when something is on fire. No shared panel. Everyone surprised in exec reviews.",
    branch: "stand-up-cabinet",
    resolution:
      "Weekly control panel hour. Each direct owns a section. Decisions and risks visible same week.",
    log_row: "cabinet-w1,vp+directs,panel-sections,decisions-logged",
  },
  teaserBullets: [
    "VP + directs, weekly, fixed agenda from the panel",
    "Each leader owns a slice; no drive-by monologues",
    "Decisions and risks logged like a cabinet",
  ],
  pairs: ["mf-tpl-005", "mf-tpl-085", "mf-tpl-061", "mf-tpl-081"],
  tags: ["field-patterns", "leadership", "ops-rhythm", "exec"],
  playbook: {
    description:
      "Run a control panel cabinet meeting: VP brings direct reports weekly; each covers their specific domain from a shared control panel of metrics and risks; decisions and cross-team asks are logged. Leadership operating rhythm, not a status dump.",
    mindset: {
      principle:
        "A cabinet works when every seat brings their portfolio and the room sees one board. Fire drills are not a rhythm.",
      mistakes: [
        {
          id: "fire-only",
          label: "Only meet when something is broken",
          cost: "No equity; surprises in every exec review",
        },
        {
          id: "vp-monologue",
          label: "VP talks entire hour",
          cost: "Directs check out; panel is theater",
        },
        {
          id: "no-owner-slices",
          label: "Nobody owns a section of the panel",
          cost: "Vague updates; no accountability",
        },
        {
          id: "metrics-no-decisions",
          label: "Read numbers with no asks or decisions",
          cost: "Hour burned; nothing moves",
        },
      ],
    },
    cabinet_roles: [
      {
        id: "chair",
        label: "VP or equivalent holds time and decision rights",
      },
      {
        id: "directs",
        label: "Each direct owns a control panel slice",
      },
      {
        id: "scribe",
        label: "Decisions, risks, cross-asks logged same day",
      },
    ],
    decision_branches: [
      {
        id: "stand-up-cabinet",
        situation: "Need weekly leadership rhythm under a VP",
        action: "cabinet-charter",
      },
      {
        id: "panel-design",
        situation: "No shared control panel yet",
        action: "panel-section-map",
      },
      {
        id: "stale-meeting",
        situation: "Meeting became status theater",
        action: "decision-first-agenda",
      },
      {
        id: "cross-silo",
        situation: "Issues span directs",
        action: "cross-ask-log",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Charter cabinet and cadence",
          goal: "Weekly, fixed length, required seats",
          minutes: "30",
        },
        {
          id: 2,
          name: "Map panel sections to directs",
          goal: "Every row has an owner",
          minutes: "60",
        },
        {
          id: 3,
          name: "Run decision-first hour",
          goal: "Slice updates + asks + decisions",
          minutes: "60/week",
        },
        {
          id: 4,
          name: "Publish decision log same day",
          goal: "Cabinet memory",
          minutes: "15",
        },
      ],
    },
    tracking: {
      csv_header:
        "week,attendees,sections_covered,decisions,open_risks,cross_asks,owner",
      sheet_tab_name: "control_panel_cabinet",
    },
    related_artifacts: [
      "mf-tpl-005",
      "mf-tpl-085",
      "mf-tpl-061",
      "mf-tpl-081",
    ],
    agent_signal: {
      use_when:
        "VP and directs need a weekly control panel / cabinet operating rhythm. Metrics and risks per owner. Not only fire drills. Sibling pattern to PIE for leadership layer.",
      decision_criteria: [
        "Each direct owns a panel slice.",
        "Decision and risk log every week.",
        "Chair enforces time; no single monologue hour.",
      ],
      operator_context:
        "Field pattern: control panel meetings with VP and directs, cabinet-style. Pair with PIE (eng+support) and floor task forces (IC layer).",
      tags: ["field-patterns", "leadership", "ops-rhythm", "exec"],
    },
  },
  templates: [
    {
      id: "cabinet-charter",
      use_when: "stand-up-cabinet",
      body: "CONTROL PANEL CABINET CHARTER\nChair (VP): _______________\nDirects (seats): _______________\nCadence: weekly  Length: ___ min\nPurpose: shared control panel + decisions\nOut of scope this hour: _______________\nScribe: _______________  First date: _______",
    },
    {
      id: "panel-section-map",
      use_when: "panel-design",
      body: "PANEL SECTION MAP\nSection | Owner direct | Metrics/risks in slice | Update minutes\nSupport ops | | | 5-8\n_____________ | | | \n_____________ | | | \nRule: no section without an owner",
    },
    {
      id: "decision-first-agenda",
      use_when: "stale-meeting",
      body: "CABINET AGENDA (60)\n0-5: open risks from last week\n5-40: each direct 5-8 min on THEIR panel slice (what moved, what is red, one ask)\n40-55: cross-silo decisions\n55-60: log owners and due dates\nBan: long monologue with no ask",
    },
    {
      id: "cross-ask-log",
      use_when: "cross-silo",
      body: "CROSS-ASK LOG\nWeek: _______\nFrom seat: _______________  To seat: _______________\nAsk: _______________\nDecision: _______________  Due: _______\nBlocks customer/revenue/risk: Y/N",
    },
    {
      id: "cabinet-decision-log",
      use_when: "stand-up-cabinet",
      body: "CABINET DECISION LOG\nWeek: _______\nDecision: _______________\nOwner: _______________  Due: _______\nPanel section affected: _______________",
    },
  ],
  examples: [
    {
      id: "ex-vp-cabinet",
      context:
        "VP brought directs weekly. Each covered their control panel slice. Cabinet rhythm, not only fires.",
      branch: "stand-up-cabinet",
      templates_used: ["cabinet-charter", "panel-section-map", "decision-first-agenda"],
      resolution:
        "Shared picture. Cross-team issues surfaced early. Exec surprises down.",
      log_row: "cabinet,weekly,slices,ok",
    },
    {
      id: "ex-theater-fix",
      context: "Meeting became status read with no decisions.",
      branch: "stale-meeting",
      templates_used: ["decision-first-agenda", "cabinet-decision-log"],
      resolution:
        "Every slice required one ask or one risk. Hour useful again.",
      log_row: "decision-first,asks-required,ok",
    },
    {
      id: "ex-cross-silo",
      context: "Support red on panel depended on another direct's staffing.",
      branch: "cross-silo",
      templates_used: ["cross-ask-log", "cabinet-decision-log"],
      resolution:
        "Cross-ask logged with due date. Fixed in two weeks without hallway war.",
      log_row: "cross-ask,due,closed",
    },
  ],
  agentMd:
    "1. **cabinet-charter** with VP + directs.\n2. **panel-section-map** so every slice has an owner.\n3. Weekly **decision-first-agenda**.\n4. Cross issues → **cross-ask-log**.\n5. Always **cabinet-decision-log** same day.\n6. Pair **mf-tpl-085** PIE (eng+support working layer); **mf-tpl-005** / **061** for metric fuel.",
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
    not_for: "Generic all-hands. Not a substitute for board governance.",
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
  `# ${p.id} · ${p.title}\n\n${p.mission}\n\n## Apply\n${p.agentMd}\n`
);
fs.writeFileSync(
  path.join(base, "index.html"),
  `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x402:artifact" content="${p.id}"><meta name="x402:teaser" content="true">
<title>${p.title} (teaser)</title>
<link rel="stylesheet" href="../../style.css">
</head><body><div class="wrap">
<header class="hdr"><h1>${p.title}</h1>
<p class="sub">ENTRY: ${p.id} · field-patterns</p>
<p class="mission">${p.mission}</p></header>
<section class="block"><h2>Free worked example</h2>
<pre class="meta">${JSON.stringify(p.teaserExample, null, 2)}</pre></section>
<section class="block"><h2>Full pack (x402)</h2>
<ul class="module-list">${p.teaserBullets.map((b) => `<li>${b}</li>`).join("")}</ul>
<dl class="kv"><dt>FULL</dt><dd><a href="full/">full/</a></dd>
<dt>PRICE</dt><dd class="status-ready">$0.08 · USDC on Base</dd>
<dt>PAIRS</dt><dd>${p.pairs.map((x) => `<a href="../${slug(x)}/">${x}</a>`).join(" · ")}</dd></dl>
</section>
<footer class="foot"><a href="../../index.html">← Catalog</a></footer>
</div></body></html>`
);
fs.writeFileSync(
  path.join(full, "index.html"),
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex">
<meta name="x402:artifact" content="${p.id}"><meta name="x402:full" content="true">
<meta name="x402:primary" content="playbook.json"><title>${p.id}</title>
<style>body{margin:0;padding:1.25rem;font-family:ui-monospace,monospace;background:#0c0c0e;color:#c8c8d0;font-size:13px}a{color:#5eb3ff}</style>
</head><body><h1>${p.id} · ${p.title}</h1>
<ul><li><a href="playbook.json">playbook.json</a></li><li><a href="templates.json">templates.json</a></li>
<li><a href="examples.json">examples.json</a></li><li><a href="AGENT.md">AGENT.md</a></li></ul>
</body></html>`
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
  not_for: "Generic all-hands. Not a substitute for board governance.",
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
if (!worker.includes(`/templates/${p.slug}/full`)) {
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
console.log("wrote", p.id, "count", n);
