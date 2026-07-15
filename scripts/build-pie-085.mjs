#!/usr/bin/env node
/**
 * mf-tpl-085 PIE — Problems, Incidents, Escalations weekly eng+support bridge.
 * Local only; no push. After: generate-openapi, generate-well-known, audit.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const KNOWN_SLUGS = {
  "mf-tpl-001": "complaint-recovery-playbook",
  "mf-tpl-067": "rd-support-bridge",
  "mf-tpl-075": "account-ndf-healthcheck",
  "mf-tpl-079": "failure-cohort-truth",
  "mf-tpl-080": "solution-fit-handoff",
  "mf-tpl-082": "sales-support-incident-bridge",
  "mf-tpl-085": "pie-weekly-bridge",
};

const p = {
  id: "mf-tpl-085",
  slug: "pie-weekly-bridge",
  title: "PIE Weekly Bridge Playbook",
  mission:
    "Problems, Incidents, Escalations. Weekly one-hour eng + support leadership forum. Kill toxic punt culture, real-time scenarios, prioritize escalations, expose sales-driven fake escalations.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "Support treated as dump zone. Engineers dodge basics. Sales escalates everything. Both sides hate the process.",
    branch: "stand-up-pie",
    resolution:
      "Weekly PIE with eng director and support lead. Relationship solid in weeks. Root cause: a few sales paths hiding their own misses.",
    log_row: "PIE-W1,standup,1hr,eng+sup,esc-queue,ok",
  },
  teaserBullets: [
    "PIE agenda: problems, incidents, escalations",
    "Co-owned by eng + support leadership",
    "Surface fake escalations and fix the path",
  ],
  pairs: ["mf-tpl-067", "mf-tpl-082", "mf-tpl-080", "mf-tpl-001"],
  tags: ["field-patterns", "escalation", "engineering", "support-ops"],
  playbook: {
    description:
      "Stand up a weekly PIE (Problems, Incidents, Escalations) bridge between engineering and support leadership: shared hour, live scenarios, prioritization, relationship repair, and detection of escalation abuse from sales or other groups.",
    mindset: {
      principle:
        "If everything is escalated, nothing is. A standing room with eng and support kills the punt culture faster than another ticket field.",
      mistakes: [
        {
          id: "punt-and-nail",
          label: "Throw work over the wall then ding support for the outcome",
          cost: "Support hated; engineers avoid; customers wait",
        },
        {
          id: "lazy-eng-gate",
          label: "Engineers refuse basics with no training path for support",
          cost: "Eternal escalations on known answers",
        },
        {
          id: "sales-esc-hide",
          label: "Sales escalates to cover bad sale, fit miss, or silence",
          cost: "Eng and support fight each other while root cause sits in sales",
        },
        {
          id: "no-standing-forum",
          label: "Only ad-hoc war rooms when on fire",
          cost: "No relationship equity when the fire starts",
        },
      ],
    },
    pie_blocks: [
      {
        id: "problems",
        label: "Open problems both teams are working (not only tickets)",
      },
      {
        id: "incidents",
        label: "Live or recent scenarios: what worked, what failed",
      },
      {
        id: "escalations",
        label: "Deep dive and prioritize the escalation queue",
      },
    ],
    decision_branches: [
      {
        id: "toxic-punt",
        situation: "Support is the dump zone; eng and support hate each other",
        action: "stand-up-pie",
      },
      {
        id: "esc-flood",
        situation: "Everything escalates; queue meaningless",
        action: "escalation-definition-lock",
      },
      {
        id: "sales-abuse",
        situation: "Escalations trace to sales/SE covering their own issues",
        action: "escalation-source-audit",
      },
      {
        id: "basics-loop",
        situation: "Engineers tired of the same basic questions",
        action: "knowledge-return-path",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Charter PIE with eng + support leads",
          goal: "One hour weekly, both rooms equal",
          minutes: "30",
        },
        {
          id: 2,
          name: "Run three-block agenda",
          goal: "Problems, incidents, escalations",
          minutes: "60/week",
        },
        {
          id: 3,
          name: "Tag escalation source",
          goal: "Real tech vs sales cover vs training gap",
          minutes: "in meeting",
        },
        {
          id: 4,
          name: "Publish decisions and owners",
          goal: "No theater minutes",
          minutes: "15",
        },
      ],
    },
    tracking: {
      csv_header:
        "week,problems_open,incidents_reviewed,esc_prioritized,esc_source_sales_pct,actions_closed,owners,notes",
      sheet_tab_name: "pie_weekly_bridge",
    },
    related_artifacts: [
      "mf-tpl-067",
      "mf-tpl-082",
      "mf-tpl-080",
      "mf-tpl-001",
    ],
    agent_signal: {
      use_when:
        "Support and engineering in conflict. Escalations everywhere. Sales punts. Need weekly PIE-style problems/incidents/escalations forum with shared ownership.",
      decision_criteria: [
        "Co-own the hour: eng director-level + support lead.",
        "Define what may escalate; audit sources weekly.",
        "Return basics to training/KB so eng is not the FAQ.",
      ],
      operator_context:
        "Field pattern: smaller server/storage scale-up. PIE fixed relationship in weeks and exposed escalation abuse.",
      tags: ["field-patterns", "escalation", "engineering", "support-ops"],
    },
  },
  templates: [
    {
      id: "stand-up-pie",
      use_when: "toxic-punt",
      body: "PIE STAND-UP CHARTER\nPIE = Problems, Incidents, Escalations\n\nEng lead: _______________  Support lead: _______________\nCadence: weekly  Length: 60 min\nEqual airtime rule: Y\nOut of scope this hour: _______________\nFirst date: _______",
    },
    {
      id: "pie-agenda",
      use_when: "toxic-punt",
      body: "PIE AGENDA (60)\n0-5: parking lot / wins\n5-20: PROBLEMS (active work both sides)\n20-35: INCIDENTS (what worked / what failed this week)\n35-55: ESCALATIONS (prioritize, assign, deep dive 1-2)\n55-60: decisions + owners\nScribe: _______________",
    },
    {
      id: "escalation-definition-lock",
      use_when: "esc-flood",
      body: "ESCALATION DEFINITION LOCK\nMay escalate when: _______________\nMust not escalate when: _______________\nRequired packet before eng: repro / impact / what support tried\nBypass only if: safety / data loss / logo down\nEffective: _______",
    },
    {
      id: "escalation-source-audit",
      use_when: "sales-abuse",
      body: "ESCALATION SOURCE AUDIT\nPeriod: _______\n\nEsc ID | True tech gap | Training gap | Sales/SE cover | Other\n_______ | | | |\n\n% sales-cover: ___\nAction on people/process (system first): _______________\nDirector path if founder/sales leadership is the source: _______________",
    },
    {
      id: "knowledge-return-path",
      use_when: "basics-loop",
      body: "KNOWLEDGE RETURN PATH\nRepeat question: _______________\nEng time spent: ___\nNew KB / training item: _______________\nSupport owner: _______________  Due: _______\nEscalation of this topic blocked after: _______",
    },
    {
      id: "pie-decision-log",
      use_when: "toxic-punt",
      body: "PIE DECISION LOG\nWeek: _______\nDecision: _______________\nOwner: _______________  Due: _______\nRelated esc/problem IDs: _______________",
    },
  ],
  examples: [
    {
      id: "ex-stepchild-support",
      context:
        "New smaller server/storage org. Support hammered. Eng lazy on basics. Sales escalated constantly. Mutual hate.",
      branch: "stand-up-pie",
      templates_used: ["stand-up-pie", "pie-agenda", "pie-decision-log"],
      resolution:
        "Weekly PIE eng director + support. Relationship solid in weeks. Work prioritized in the open.",
      log_row: "PIE-stand,1hr,eng+sup,rel-up",
    },
    {
      id: "ex-sales-hide",
      context:
        "Escalation audit showed a few sales/SE paths and their leadership using escalate to hide their own issues.",
      branch: "sales-abuse",
      templates_used: ["escalation-source-audit", "escalation-definition-lock"],
      resolution:
        "Definitions locked. Abuse path called out with data. Escalation volume became meaningful.",
      log_row: "src-audit,sales-cover,def-lock,ok",
    },
    {
      id: "ex-basics-kb",
      context: "Engineers exhausted by the same basic questions.",
      branch: "basics-loop",
      templates_used: ["knowledge-return-path", "pie-agenda"],
      resolution:
        "KB and training owned by support. Eng time freed for real problems.",
      log_row: "kb-return,basics-off-esc,ok",
    },
  ],
  agentMd:
    "1. Toxic punt culture → **stand-up-pie** + **pie-agenda** weekly.\n2. Everything escalates → **escalation-definition-lock**.\n3. Suspect sales cover → **escalation-source-audit**.\n4. Eng FAQ fatigue → **knowledge-return-path**.\n5. Every meeting → **pie-decision-log**.\n6. Pair **mf-tpl-067** technical bridge; **mf-tpl-082** sales-support incident politics; **mf-tpl-080** if root is bad solution fit.",
};

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n");
}

function SLUG_FROM_PAIR(id) {
  return KNOWN_SLUGS[id] || id.replace(/^mf-tpl-/, "");
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
    not_for: "Generic job spine. Not a substitute for incident command tooling alone.",
    pairs_with: p.playbook.related_artifacts.slice(0, 4),
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

const agentMd = `# ${p.id} · ${p.title}

**Audience:** agents. ${p.mission}

## Fetch order

1. \`playbook.json\`
2. \`templates.json\`
3. \`examples.json\`

## Apply

${p.agentMd}

## Agent signal (v1.2)

- **Use when:** ${p.playbook.agent_signal.use_when}
- **Pairs with:** ${p.playbook.related_artifacts.slice(0, 4).join(", ")}

## Lane

field_patterns · PIE = Problems, Incidents, Escalations.
`;
fs.writeFileSync(path.join(full, "AGENT.md"), agentMd + "\n");

const teaser = `<!DOCTYPE html>
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
      <p class="sub">ENTRY: ${p.id} · SECTION: templates · lane: field-patterns · agent audience</p>
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
        <dt>FULL (x402)</dt>
        <dd><a href="full/">templates/${p.slug}/full/</a></dd>
        <dt>PRICE</dt>
        <dd class="status-ready">$0.08 · USDC on Base</dd>
        <dt>PAIRS</dt>
        <dd>${p.pairs.map((x) => `<a href="../${SLUG_FROM_PAIR(x)}/">${x}</a>`).join(" · ")}</dd>
      </dl>
    </section>
    <footer class="foot"><a href="../../index.html">← Materials Factory catalog</a></footer>
  </div>
</body>
</html>
`;
fs.writeFileSync(path.join(base, "index.html"), teaser);
fs.writeFileSync(
  path.join(full, "index.html"),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="x402:artifact" content="${p.id}">
  <meta name="x402:full" content="true">
  <meta name="x402:primary" content="playbook.json">
  <title>${p.id} full pack | agent artifacts</title>
  <link rel="alternate" type="application/json" href="playbook.json">
  <style>
    body { margin: 0; padding: 1.25rem; font-family: ui-monospace, Consolas, monospace; background: #0c0c0e; color: #c8c8d0; font-size: 13px; line-height: 1.5; }
    a { color: #5eb3ff; }
  </style>
</head>
<body>
  <h1>${p.id} · ${p.title}</h1>
  <p><a href="../index.html">← Teaser</a> · <a href="../../../index.html">Catalog</a></p>
  <ul>
    <li><a href="playbook.json">playbook.json</a></li>
    <li><a href="templates.json">templates.json</a></li>
    <li><a href="examples.json">examples.json</a></li>
    <li><a href="AGENT.md">AGENT.md</a></li>
  </ul>
</body>
</html>
`
);
console.log("wrote", p.id, p.slug);

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
  not_for: "Generic job spine. Not a substitute for incident command tooling alone.",
  pairs_with: p.playbook.related_artifacts.slice(0, 4),
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
console.log("manifest entry_count:", manifest.entry_count);

const indexPath = path.join(MF, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");
if (!indexHtml.includes(`id="${p.id}"`)) {
  const article = `<article class="entry" id="${p.id}"><p class="entry-id">ENTRY: ${p.id} · field-patterns</p><h3>${p.title}</h3><dl class="kv"><dt>TEASER</dt><dd><a href="templates/${p.slug}/">${p.slug}/</a></dd><dt>FULL</dt><dd><a href="templates/${p.slug}/full/">full/</a> · $0.08</dd></dl></article>`;
  if (indexHtml.includes("</main>")) {
    indexHtml = indexHtml.replace("</main>", article + "\n</main>");
  } else if (indexHtml.includes('<footer class="foot">')) {
    indexHtml = indexHtml.replace(
      '<footer class="foot">',
      article + '\n<footer class="foot">'
    );
  }
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
if (!indexHtml.includes("mf-tpl-085")) {
  indexHtml = indexHtml.replace(
    /(<p><strong>People ops:<\/strong>[^<]+<\/p>)/,
    `$1\n      <p><strong>PIE bridge:</strong> mf-tpl-085 problems/incidents/escalations weekly eng+support.</p>`
  );
}
fs.writeFileSync(indexPath, indexHtml);

let worker = fs.readFileSync(path.join(ROOT, "worker", "index.ts"), "utf8");
const needle = `prefix: "/2nd-pages/materials-factory/templates/${p.slug}/full"`;
if (!worker.includes(needle)) {
  const block = `  {
    prefix: "/2nd-pages/materials-factory/templates/${p.slug}/full",
    price: "$0.08",
    description: "${p.title} agent pack (${p.id})",
    artifact: "${p.id}",
  },
`;
  worker = worker.replace(
    "];\n\nconst NETWORK_CAIP2",
    block + "];\n\nconst NETWORK_CAIP2"
  );
  fs.writeFileSync(path.join(ROOT, "worker", "index.ts"), worker);
}
console.log("done build-pie-085 (no push)");
