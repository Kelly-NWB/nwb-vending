#!/usr/bin/env node
/**
 * mf-tpl-086 Support On-Call Design — pay, tiers, after-hours escalation lock.
 * No war-story color. Local; no push. Then openapi + well-known + audit.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const KNOWN = {
  "mf-tpl-032": "emergency-after-hours",
  "mf-tpl-062": "queue-split-design",
  "mf-tpl-078": "support-incentive-steering",
  "mf-tpl-082": "sales-support-incident-bridge",
  "mf-tpl-085": "pie-weekly-bridge",
  "mf-tpl-086": "support-oncall-design",
};

const p = {
  id: "mf-tpl-086",
  slug: "support-oncall-design",
  title: "Support On-Call Design Playbook",
  mission:
    "On-call that does not destroy the floor: pay that feels different, tiers that keep specialists off how-tos, locked path from after-hours intake to the right brain.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "Tier-3 on rotation answering password how-tos at 1 a.m. No extra pay. Everyone bitter. Real Sev waits behind trivia.",
    branch: "tier-lock",
    resolution:
      "Pay differential published. After-hours path: L1 filter then L2/L3 by skill. How-tos blocked off specialist pages.",
    log_row: "oncall-v2,diff-pay,L1-filter,T3-protected,ok",
  },
  teaserBullets: [
    "Compensation that marks on-call as different",
    "Tier design so specialists are not the FAQ",
    "Locked after-hours escalation path",
  ],
  pairs: ["mf-tpl-032", "mf-tpl-062", "mf-tpl-085", "mf-tpl-078"],
  tags: ["field-patterns", "on-call", "support-ops", "tiers"],
  playbook: {
    description:
      "Design support on-call around three levers: compensation that feels distinct, tiering so specialized staff are not wasted on basics, and a locked escalation path from after-hours contact to the correct tier.",
    mindset: {
      principle:
        "On-call war stories are endless and mostly not the product. The product is pay, tiers, and path. If those are wrong, the nights will always be stupid.",
      mistakes: [
        {
          id: "same-pay",
          label: "On-call with no pay or recognition difference",
          cost: "People feel used; quality and coverage rot",
        },
        {
          id: "tier3-howto",
          label: "Highly specialized tier answers basic how-tos after hours",
          cost: "Burnout and rage; real incidents queue behind trivia",
        },
        {
          id: "open-dial",
          label: "Anyone can page anyone with no filter",
          cost: "Chaos; sales and customers train on the wrong number",
        },
        {
          id: "path-unwritten",
          label: "After-hours rules live in one person's head",
          cost: "Breaks when that person is the one down",
        },
      ],
    },
    design_levers: [
      {
        id: "comp",
        label: "Pay or equivalent differential so on-call feels treated differently",
      },
      {
        id: "tiers",
        label: "Clear L1/L2/L3 (or equivalent) skills and what each may take",
      },
      {
        id: "path",
        label: "Written after-hours path: intake filter before specialist page",
      },
    ],
    decision_branches: [
      {
        id: "bitter-rotation",
        situation: "People hate on-call; feel used",
        action: "comp-differential",
      },
      {
        id: "tier-lock",
        situation: "Specialists buried in basics after hours",
        action: "tier-responsibility-matrix",
      },
      {
        id: "path-chaos",
        situation: "Unclear who to call and when",
        action: "after-hours-path-lock",
      },
      {
        id: "sales-bypass",
        situation: "Sales or VIPs skip the path and page random experts",
        action: "bypass-policy",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Publish what on-call pays or grants",
          goal: "Different treatment is visible",
          minutes: "half-day",
        },
        {
          id: 2,
          name: "Write tier matrix for nights/weekends",
          goal: "Who owns how-to vs break/fix",
          minutes: "half-day",
        },
        {
          id: 3,
          name: "Lock after-hours path",
          goal: "Intake then escalate by rule",
          minutes: "60",
        },
        {
          id: 4,
          name: "Review pages monthly",
          goal: "Wrong-tier hits get process fix",
          minutes: "monthly",
        },
      ],
    },
    tracking: {
      csv_header:
        "period,pages_total,wrong_tier_pct,howto_on_specialist_pct,avg_ack_min,comp_policy_ver,notes,owner",
      sheet_tab_name: "support_oncall_design",
    },
    related_artifacts: [
      "mf-tpl-032",
      "mf-tpl-062",
      "mf-tpl-085",
      "mf-tpl-078",
    ],
    agent_signal: {
      use_when:
        "Support on-call is broken or bitter. Need pay differential, tier protection for specialists, and locked after-hours escalation path. Not a collection of night war stories.",
      decision_criteria: [
        "On-call compensation or recognition must feel different.",
        "Specialist tiers are not the how-to desk after hours.",
        "Written path from after-hours contact to correct tier.",
      ],
      operator_context:
        "Field pattern: validity is structure (comp, tiers, path), not endless on-call anecdotes.",
      tags: ["field-patterns", "on-call", "support-ops", "tiers"],
    },
  },
  templates: [
    {
      id: "comp-differential",
      use_when: "bitter-rotation",
      body: "ON-CALL COMP DIFFERENTIAL\nRole/tier: _______________\n\nWhat they get that off-rotation does not: _______________\n(pay / time / other visible treatment)\nHow it is paid/credited: _______________\nPublished where: _______________\nEffective: _______  Owner: _______________",
    },
    {
      id: "tier-responsibility-matrix",
      use_when: "tier-lock",
      body: "AFTER-HOURS TIER MATRIX\nTier | Owns | Does not own | Page only if\nL1 / intake | filter, how-to, known scripts | deep eng | _______________\nL2 | product break/fix mid | pure FAQ | _______________\nL3 / specialist | rare / complex | how-tos | _______________\n\nWrong-tier hit = process bug, not hero night",
    },
    {
      id: "after-hours-path-lock",
      use_when: "path-chaos",
      body: "AFTER-HOURS PATH LOCK\nCustomer/sales contacts: _______________\nStep 1 intake: _______________\nStep 2 if X then page: _______________\nStep 3 specialist only if: _______________\nAck SLA: ___ min  Update cadence: ___\nWritten doc link/owner: _______________",
    },
    {
      id: "bypass-policy",
      use_when: "sales-bypass",
      body: "BYPASS POLICY\nWho may not direct-page specialists: _______________\nException (true Sev1 only): _______________\nWhat happens if bypassed: _______________\nComms to sales: date _______  Owner: _______________",
    },
    {
      id: "monthly-page-review",
      use_when: "tier-lock",
      body: "MONTHLY PAGE REVIEW\nPeriod: _______\nPages: ___  Wrong tier: ___  How-to on specialist: ___\nFix: _______________\nComp policy still fair? Y/N",
    },
  ],
  examples: [
    {
      id: "ex-t3-howto",
      context:
        "Specialized tier-3 on rotation buried in basic how-tos. Near mutiny.",
      branch: "tier-lock",
      templates_used: ["tier-responsibility-matrix", "after-hours-path-lock"],
      resolution:
        "L1 filter mandatory. T3 only for defined break/fix classes. Rage down.",
      log_row: "T3-protect,L1-filter,howto-off,ok",
    },
    {
      id: "ex-comp-diff",
      context: "On-call unpaid relative to day staff. Felt like punishment.",
      branch: "bitter-rotation",
      templates_used: ["comp-differential"],
      resolution:
        "Published differential. Coverage volunteers stabilized.",
      log_row: "comp-diff,published,coverage-ok",
    },
    {
      id: "ex-sales-bypass",
      context: "Sales direct-dialed specialists and skipped intake.",
      branch: "sales-bypass",
      templates_used: ["bypass-policy", "after-hours-path-lock"],
      resolution:
        "Bypass policy + path. True Sev1 exception only.",
      log_row: "bypass-off,path-lock,ok",
    },
  ],
  agentMd:
    "1. Bitter rotation → **comp-differential** (must feel different).\n2. Specialists on how-tos → **tier-responsibility-matrix**.\n3. Chaos dialing → **after-hours-path-lock**.\n4. Sales/VIP skip path → **bypass-policy**.\n5. Monthly → **monthly-page-review**.\n6. Pair **mf-tpl-032** customer after-hours reply; **mf-tpl-085** if eng/support escalation politics; **mf-tpl-062** for daytime queue tiers.",
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
    not_for: "War-story anthology. Not legal wage advice; set pay with your counsel/HR.",
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
  `# ${p.id} · ${p.title}

**Audience:** agents. ${p.mission}

## Fetch order
1. playbook.json  2. templates.json  3. examples.json

## Apply
${p.agentMd}

## Agent signal
- **Use when:** ${p.playbook.agent_signal.use_when}
- **Pairs:** ${p.playbook.related_artifacts.join(", ")}
`
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
      <p class="sub">ENTRY: ${p.id} · field-patterns · agent audience</p>
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
<p><a href="../index.html">← Teaser</a> · <a href="../../../index.html">Catalog</a></p>
<ul>
<li><a href="playbook.json">playbook.json</a></li>
<li><a href="templates.json">templates.json</a></li>
<li><a href="examples.json">examples.json</a></li>
<li><a href="AGENT.md">AGENT.md</a></li>
</ul>
</body></html>
`
);
console.log("wrote", p.id);

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
  not_for: "War-story anthology. Not legal wage advice; set pay with your counsel/HR.",
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
console.log("manifest", n, "done build-oncall-086");
