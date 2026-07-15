#!/usr/bin/env node
/**
 * mf-tpl-092 Customer learning program + warranty education (generic name).
 * NOT "Expert Included" or any vendor brand. Local; no push.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");
const KNOWN = {
  "mf-tpl-020": "warranty-support-touch",
  "mf-tpl-027": "client-onboarding-first",
  "mf-tpl-075": "account-ndf-healthcheck",
  "mf-tpl-081": "metrics-that-matter-qbr",
  "mf-tpl-089": "preventable-ticket-kill",
  "mf-tpl-090": "support-knowledge-repo",
  "mf-tpl-092": "customer-learning-program",
};

const p = {
  id: "mf-tpl-092",
  slug: "customer-learning-program",
  title: "Customer Learning Program Playbook",
  mission:
    "Stand up a light customer university: teach product care and warranty path so problems die early. Pair with a warranty revamp customers understand. Sales can hand it over. No third-party brand names.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "Warranty is fine print. Customers call confused. Support teaches the same basics forever.",
    branch: "stand-up-u",
    resolution:
      "Short learning tracks + clear warranty promise card. Sales distributes. Basics deflection up; trust up on real issues.",
    log_row: "cust-u-v1,warranty-card,sales-hand,deflect-up",
  },
  teaserBullets: [
    "Customer learning tracks (university-style, light)",
    "Warranty language humans can use",
    "Sales-ready handoff pack",
  ],
  pairs: ["mf-tpl-020", "mf-tpl-089", "mf-tpl-090", "mf-tpl-027"],
  tags: ["field-patterns", "warranty", "education", "support-ops"],
  playbook: {
    description:
      "Design a customer learning program (short tracks, not a real school) tied to a clear warranty experience: what is covered, how to get help, how to self-serve basics. Enable sales to distribute. Measure deflection and satisfaction on real issues.",
    mindset: {
      principle:
        "Produce-aisle universities work because they teach without shame. Same for hardware and support: educate so the phone is for hard problems, and warranty feels like a promise not a trap.",
      mistakes: [
        {
          id: "fine-print-only",
          label: "Warranty lives only in legal PDF",
          cost: "Support re-explains; customers feel tricked",
        },
        {
          id: "course-bloat",
          label: "Build a huge LMS nobody finishes",
          cost: "Launch theater; zero behavior change",
        },
        {
          id: "support-only-secret",
          label: "Great material never reaches sales or customers",
          cost: "Still every how-to call",
        },
        {
          id: "brand-collision",
          label: "Copy another company's expert slogan",
          cost: "IP/brand mess; not your asset",
        },
      ],
    },
    program_parts: [
      {
        id: "tracks",
        label: "Short learning tracks: first boot, care, when to call, warranty path",
      },
      {
        id: "warranty_card",
        label: "Human warranty summary: covered, not covered, how to open a case",
      },
      {
        id: "sales_hand",
        label: "One pack sales can send or leave with customer",
      },
      {
        id: "measure",
        label: "Basics volume down; CSAT on complex up",
      },
    ],
    decision_branches: [
      {
        id: "stand-up-u",
        situation: "Need customer education program + clearer warranty story",
        action: "program-charter",
      },
      {
        id: "warranty-revamp",
        situation: "Warranty confuses customers and support",
        action: "warranty-human-card",
      },
      {
        id: "sales-distro",
        situation: "Material ready for field",
        action: "sales-hand-pack",
      },
      {
        id: "prove",
        situation: "Leadership wants ROI",
        action: "deflection-readout",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Charter 3-5 short tracks max",
          goal: "Light university, not LMS empire",
          minutes: "half-day",
        },
        {
          id: 2,
          name: "Rewrite warranty into human card",
          goal: "Aligned with legal, readable",
          minutes: "with counsel/ops",
        },
        {
          id: 3,
          name: "Build hand pack for sales",
          goal: "One link or PDF set",
          minutes: "half-day",
        },
        {
          id: 4,
          name: "Measure basics vs complex",
          goal: "Deflection + trust",
          minutes: "monthly",
        },
      ],
    },
    tracking: {
      csv_header:
        "period,track_views,sales_sends,basics_ticket_volume,complex_csat,warranty_confusion_tickets,owner",
      sheet_tab_name: "customer_learning_program",
    },
    related_artifacts: [
      "mf-tpl-020",
      "mf-tpl-089",
      "mf-tpl-090",
      "mf-tpl-027",
    ],
    agent_signal: {
      use_when:
        "Need customer education university-style program and clearer warranty experience. Sales should hand materials. Basics still flooding support. No third-party brand slogans.",
      decision_criteria: [
        "Keep tracks short; avoid LMS bloat.",
        "Warranty human card aligned with real policy.",
        "Sales distribution is part of launch, not afterthought.",
      ],
      operator_context:
        "Field pattern: warranty revamp plus customer U concept (generic naming). Full circle with preventable tickets and knowledge repo.",
      tags: ["field-patterns", "warranty", "education", "support-ops"],
    },
  },
  templates: [
    {
      id: "program-charter",
      use_when: "stand-up-u",
      body: "CUSTOMER LEARNING PROGRAM CHARTER\nName (internal, original): _______________\nTracks (max 5): 1 ___ 2 ___ 3 ___\nOwner support: _______________  Owner sales enable: _______________\nOut of scope: huge LMS, copied brand slogans\nLaunch date: _______",
    },
    {
      id: "warranty-human-card",
      use_when: "warranty-revamp",
      body: "WARRANTY HUMAN CARD\nCovered (plain): _______________\nNot covered (plain): _______________\nHow to open a case: _______________\nWhat to have ready: _______________\nLegal PDF link (authority): _______________\nReviewed by: ops ___  counsel/policy ___  Date: _______",
    },
    {
      id: "track-outline",
      use_when: "stand-up-u",
      body: "TRACK OUTLINE\nTrack: _______________  Minutes to complete: ___\nOutcomes: _______________\nWhen to call support instead: _______________\nLink/asset: _______________",
    },
    {
      id: "sales-hand-pack",
      use_when: "sales-distro",
      body: "SALES HAND PACK\nWhat to send/leave: _______________\nWhen in cycle (ship / QBR / new logo): _______________\nTalk track (3 lines): _______________\nDo not promise: _______________\nFeedback channel to support: _______________",
    },
    {
      id: "deflection-readout",
      use_when: "prove",
      body: "DEFLECTION READOUT\nPeriod: _______\nBasics ticket class volume before/after: ___ / ___\nWarranty confusion tickets: ___\nComplex CSAT: ___\nSales sends: ___\nKeep / cut / expand tracks: _______________",
    },
  ],
  examples: [
    {
      id: "ex-u-plus-warranty",
      context:
        "Org revamped warranty story and stood up light customer learning tracks. Sales handed materials. Support saw fewer basics.",
      branch: "stand-up-u",
      templates_used: ["program-charter", "warranty-human-card", "sales-hand-pack"],
      resolution:
        "Customers self-served common care steps. Phone time shifted to real issues.",
      log_row: "cust-u,warranty-card,sales,basics-down",
    },
    {
      id: "ex-no-bloat",
      context: "Proposal for 40-hour LMS. Team would never finish.",
      branch: "stand-up-u",
      templates_used: ["program-charter", "track-outline"],
      resolution:
        "Three short tracks only. Completion and use higher.",
      log_row: "3-tracks,no-lms-bloat,ok",
    },
    {
      id: "ex-measure",
      context: "Leadership asked if education spend mattered.",
      branch: "prove",
      templates_used: ["deflection-readout"],
      resolution:
        "Before/after basics volume plus complex CSAT. Program kept.",
      log_row: "readout,prove,kept",
    },
  ],
  agentMd:
    "1. **program-charter** with short tracks only.\n2. **warranty-human-card** with policy review.\n3. **track-outline** per track.\n4. **sales-hand-pack** before claiming launch.\n5. **deflection-readout** monthly.\n6. Pair **mf-tpl-089** / **mf-tpl-090** for content; **mf-tpl-020** first warranty touch.",
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
    not_for: "Legal warranty drafting without counsel. Not another company's brand program.",
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
  not_for:
    "Legal warranty drafting without counsel. Not another company's brand program.",
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
// ensure cluster blurb covers 073-092 field batch
if (!indexHtml.includes("mf-tpl-092")) {
  indexHtml = indexHtml.replace(
    /(<p><strong>PIE bridge:<\/strong>[^<]+<\/p>)/,
    `$1\n      <p><strong>Field batch 073-092:</strong> NDF, sales/QBR, people ops, PIE, on-call, structure, KB integrity, showcase, customer learning.</p>`
  );
}
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
