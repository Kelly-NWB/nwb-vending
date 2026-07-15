#!/usr/bin/env node
/** mf-tpl-094 Vendor-funded fleet remediation — local, no push */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");
const KNOWN = {
  "mf-tpl-067": "rd-support-bridge",
  "mf-tpl-077": "defect-fix-shotgun-relapse",
  "mf-tpl-079": "failure-cohort-truth",
  "mf-tpl-085": "pie-weekly-bridge",
  "mf-tpl-087": "named-account-support",
  "mf-tpl-094": "vendor-fleet-remediation",
};

const p = {
  id: "mf-tpl-094",
  slug: "vendor-fleet-remediation",
  title: "Vendor Fleet Remediation Playbook",
  mission:
    "Site-wide or fleet-wide bad batch (e.g. memory). Deep test with vendor, prove the population, then force manufacturer to fund on-site labor and parts. Your team runs install and validation; not a quiet absorb-the-cost support heroics week.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "Data center drowning in errors. Support could swap forever. Deep test finds bad memory batch across fleet.",
    branch: "vendor-funded-campaign",
    resolution:
      "Manufacturer sends engineers and crew. Week-long replace-and-test of every server memory at vendor expense. Customer stable.",
    log_row: "fleet-mem,batch-X,vendor-onsite,week,cost-vendor,ok",
  },
  teaserBullets: [
    "Deep joint test before fleet declaration",
    "Commercial ask: vendor funds parts and on-site labor",
    "Your team owns install plan and validation gates",
  ],
  pairs: ["mf-tpl-077", "mf-tpl-079", "mf-tpl-067", "mf-tpl-085"],
  tags: ["field-patterns", "vendor", "fleet", "remediation"],
  playbook: {
    description:
      "Run a vendor-funded fleet remediation: prove a bad population with rigorous testing, engage manufacturer for full remediation scope, require on-site vendor resources and cost ownership, and execute a time-boxed install-and-validate campaign with your support engineers.",
    mindset: {
      principle:
        "Paying through support tickets forever is the expensive path. Prove the batch, then make the vendor carry the fleet fix.",
      mistakes: [
        {
          id: "ticket-forever",
          label: "Keep replacing units one by one under normal support",
          cost: "Customer down time stacks; your cost and brand burn",
        },
        {
          id: "declare-without-proof",
          label: "Demand fleet replace without joint deep test",
          cost: "Vendor walks; you look reckless",
        },
        {
          id: "absorb-labor",
          label: "Your team does the whole campaign on your dime",
          cost: "You funded their quality failure",
        },
        {
          id: "no-validation-gate",
          label: "Swap everything with no test plan",
          cost: "Errors return; blame mud",
        },
      ],
    },
    campaign_phases: [
      {
        id: "signal",
        label: "Persistent site/fleet errors not explained by one-off fails",
      },
      {
        id: "prove",
        label: "Deep test with vendor; isolate batch/population",
      },
      {
        id: "commercial",
        label: "Scope: all affected units; vendor funds parts + on-site labor",
      },
      {
        id: "execute",
        label: "Time-boxed install + validation; your leads + their crew",
      },
      {
        id: "close",
        label: "Error rate gate; written close with vendor",
      },
    ],
    decision_branches: [
      {
        id: "fleet-signal",
        situation: "Constant errors across many systems in one environment",
        action: "joint-deep-test-plan",
      },
      {
        id: "batch-proven",
        situation: "Test isolates bad population/batch",
        action: "vendor-scope-ask",
      },
      {
        id: "vendor-funded-campaign",
        situation: "Vendor agrees to remediate at their cost",
        action: "campaign-runbook",
      },
      {
        id: "close-gate",
        situation: "Install wave done",
        action: "validation-close",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Freeze one-off heroics narrative",
          goal: "Treat as fleet incident",
          minutes: "immediate",
        },
        {
          id: 2,
          name: "Joint deep test with manufacturer",
          goal: "Batch/population proof",
          minutes: "days",
        },
        {
          id: 3,
          name: "Commercial scope and cost ownership",
          goal: "Vendor funds parts and on-site labor",
          minutes: "negotiation",
        },
        {
          id: 4,
          name: "Execute waves: install + test",
          goal: "Every unit validated",
          minutes: "campaign length",
        },
      ],
    },
    tracking: {
      csv_header:
        "campaign_id,site,population,units_total,units_done,error_rate_before,error_rate_after,vendor_cost_y_n,owner",
      sheet_tab_name: "vendor_fleet_remediation",
    },
    related_artifacts: [
      "mf-tpl-077",
      "mf-tpl-079",
      "mf-tpl-067",
      "mf-tpl-085",
    ],
    agent_signal: {
      use_when:
        "Fleet or data-center scale failures. Bad batch suspected. Need deep test with vendor then full remediation at manufacturer expense with on-site joint install and validation.",
      decision_criteria: [
        "Proof before fleet declaration.",
        "Vendor funds parts and on-site labor when batch is theirs.",
        "Your team runs install plan and test gates; not silent ticket soak.",
      ],
      operator_context:
        "Field pattern: DC-wide memory batch, week-long replace-and-test, vendor engineers on site, cost on manufacturer.",
      tags: ["field-patterns", "vendor", "fleet", "remediation"],
    },
  },
  templates: [
    {
      id: "joint-deep-test-plan",
      use_when: "fleet-signal",
      body: "JOINT DEEP TEST PLAN\nSite/fleet: _______________  Symptom: _______________\nUnits in scope sample: ___\nTests (hardware / stress / env): _______________\nVendor participants: _______________\nYour eng/support leads: _______________\nExit: batch isolated Y/N  Date: _______",
    },
    {
      id: "vendor-scope-ask",
      use_when: "batch-proven",
      body: "VENDOR SCOPE ASK\nBatch/population: _______________\nUnits affected (count): ___\nAsk:\n[ ] Full replace of population\n[ ] Manufacturer on-site engineers/crew\n[ ] Parts and labor at vendor expense\n[ ] Timeline not to exceed: _______\nEvidence pack attached: Y/N\nCommercial owner: _______________",
    },
    {
      id: "campaign-runbook",
      use_when: "vendor-funded-campaign",
      body: "FLEET CAMPAIGN RUNBOOK\nCampaign ID: _______________  Dates: _______\nWaves: _______________\nPer unit: remove/replace steps _______________  validate tests _______________\nYour roles: _______________\nVendor roles: _______________\nCustomer change window: _______________\nRollback if: _______________",
    },
    {
      id: "validation-close",
      use_when: "close-gate",
      body: "VALIDATION CLOSE\nUnits complete: ___ / ___\nError rate before: ___  after: ___\nOpen exceptions: _______________\nVendor written close: Y/N\nCustomer acceptance: Y/N\nLessons for PIE / product: _______________",
    },
    {
      id: "cost-ownership-memo",
      use_when: "batch-proven",
      body: "COST OWNERSHIP MEMO (internal)\nWhy not absorb under support: _______________\nVendor obligation basis: batch proof _______________\nOur labor still required for: coordination / validation\nWhat we will not pay: _______________",
    },
  ],
  examples: [
    {
      id: "ex-dc-memory",
      context:
        "Data center constant errors. Deep test with manufacturer found bad memory batch. Entire fleet memory replace required.",
      branch: "vendor-funded-campaign",
      templates_used: [
        "joint-deep-test-plan",
        "vendor-scope-ask",
        "campaign-runbook",
        "validation-close",
      ],
      resolution:
        "Vendor sent engineers and workers. Week-long install and test led by support eng. Cost on manufacturer. Site stabilized.",
      log_row: "DC-mem,batch,vendor-onsite,week,vendor-pay,ok",
    },
    {
      id: "ex-no-ticket-soak",
      context: "Pressure to keep RMA drip instead of campaign.",
      branch: "batch-proven",
      templates_used: ["cost-ownership-memo", "vendor-scope-ask"],
      resolution:
        "Memo blocked absorb path. Campaign authorized.",
      log_row: "no-soak,campaign-auth",
    },
    {
      id: "ex-print-fleet-batch",
      context: "Shop fleet of devices same error; vendor batch on a board.",
      branch: "fleet-signal",
      templates_used: ["joint-deep-test-plan", "campaign-runbook"],
      resolution:
        "Batch proven; vendor funded swap wave with joint validation.",
      log_row: "print-fleet,batch,vendor-fund,ok",
    },
  ],
  agentMd:
    "1. Fleet noise → **joint-deep-test-plan** (not endless single tickets).\n2. Batch proven → **vendor-scope-ask** + **cost-ownership-memo**.\n3. Agreed → **campaign-runbook** (waves, roles, validate).\n4. Done → **validation-close**.\n5. Pair **mf-tpl-079** cohort proof; **mf-tpl-077** line defect; **mf-tpl-085** if eng/support politics mid-campaign.",
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
    not_for: "Single-unit RMA. Not legal contract drafting with vendors.",
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
  not_for: "Single-unit RMA. Not legal contract drafting with vendors.",
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
