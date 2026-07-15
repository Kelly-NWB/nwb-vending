#!/usr/bin/env node
/** mf-tpl-091 Team showcase speaking lab — local, no push */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");
const KNOWN = {
  "mf-tpl-003": "hiring-character-gauge",
  "mf-tpl-083": "high-volume-interview-redesign",
  "mf-tpl-084": "floor-morale-task-force",
  "mf-tpl-088": "escalation-engineer-ladder",
  "mf-tpl-091": "team-showcase-speaking",
};

const p = {
  id: "mf-tpl-091",
  slug: "team-showcase-speaking",
  title: "Team Showcase Speaking Playbook",
  mission:
    "Team builds short slide talks on a personal interest for the class. Dual win: know each other, and give introvert phone-nerds safe reps at presenting for sales, customers, and peers.",
  lane: "field-patterns",
  teaserExample: {
    context:
      "Strong on phone, freeze in person with sales or customers. Team is strangers outside tickets.",
    branch: "run-series",
    resolution:
      "Rotating short interest talks with slides. Bonding plus speaking muscle. Transfer to customer rooms.",
    log_row: "showcase-series,8-weeks,talks-8,speaking-up,ok",
  },
  teaserBullets: [
    "Interest showcase, not performance review theater",
    "Short decks + live talk reps",
    "Built for phone-strong, room-shy support talent",
  ],
  pairs: ["mf-tpl-084", "mf-tpl-088", "mf-tpl-083", "mf-tpl-003"],
  tags: ["field-patterns", "leadership", "speaking", "team"],
  playbook: {
    description:
      "Run a team showcase series: each person presents a short interest topic with slides to the team. Primary goals are connection and low-stakes public speaking practice for support staff who are strong on phone and weak in rooms.",
    mindset: {
      principle:
        "Most tech support nerds will talk on the phone all day and freeze in person. Safe stage time on something they care about builds the muscle for sales and customers without a fake corporate toastmasters vibe.",
      mistakes: [
        {
          id: "only-work-topics",
          label: "Force only job metrics presentations",
          cost: "Anxiety up; no real knowing each other; feels like a review",
        },
        {
          id: "grade-harsh",
          label: "Score like a contest or roast bad talks",
          cost: "Introverts shut down; series dies",
        },
        {
          id: "no-transfer",
          label: "Never connect practice to sales/customer rooms",
          cost: "Fun club only; leadership value unclear",
        },
        {
          id: "optional-forever",
          label: "Always optional so only extroverts go",
          cost: "People who need reps never get them",
        },
      ],
    },
    dual_goals: [
      {
        id: "know",
        label: "Learn people beyond tickets (hobbies, life texture, not trauma dump required)",
      },
      {
        id: "speak",
        label: "Reps: slides, voice in a room, time-box, Q&A",
      },
      {
        id: "transfer",
        label: "Same skills used with sales, customers, cross-team",
      },
    ],
    decision_branches: [
      {
        id: "run-series",
        situation: "Team needs bond + speaking practice",
        action: "series-charter",
      },
      {
        id: "topic-help",
        situation: "Someone stuck on what to present",
        action: "topic-menu",
      },
      {
        id: "anxiety",
        situation: "Phone-strong person dreads the room",
        action: "safety-rails",
      },
      {
        id: "transfer",
        situation: "Need proof it helps the business",
        action: "transfer-checklist",
      },
    ],
    process: {
      steps: [
        {
          id: 1,
          name: "Charter series and time-box",
          goal: "Cadence, length, audience = team",
          minutes: "30",
        },
        {
          id: 2,
          name: "Schedule rotation",
          goal: "Everyone gets a slot",
          minutes: "30",
        },
        {
          id: 3,
          name: "Light coach before talk",
          goal: "Deck basics, not perfection",
          minutes: "15/person",
        },
        {
          id: 4,
          name: "Run + thank + optional one tip",
          goal: "Safety then growth",
          minutes: "per session",
        },
      ],
    },
    tracking: {
      csv_header:
        "date,speaker,topic_type,minutes,completed_y_n,follow_up_tip,notes,owner",
      sheet_tab_name: "team_showcase_speaking",
    },
    related_artifacts: [
      "mf-tpl-084",
      "mf-tpl-088",
      "mf-tpl-083",
      "mf-tpl-003",
    ],
    agent_signal: {
      use_when:
        "Support team strong on phone, weak in person. Need bond plus public speaking/slide reps. Leadership program not a roast or performance review.",
      decision_criteria: [
        "Interest topics allowed; not only work metrics.",
        "Psychological safety over scoring.",
        "Explicit transfer to sales/customer speaking later.",
      ],
      operator_context:
        "Field pattern: class presentations on interests (conductor, everyday life, life stories). Dual purpose: know each other + speaking muscle.",
      tags: ["field-patterns", "leadership", "speaking", "team"],
    },
  },
  templates: [
    {
      id: "series-charter",
      use_when: "run-series",
      body: "TEAM SHOWCASE SERIES CHARTER\nAudience: our team (not customers yet)\nCadence: _______________  Slot length: ___ min + Q&A ___\nFormat: short slides + talk\nTopic rule: interest or skill you care about (work OK, not required)\nNot a performance review: Y\nRotation owner: _______________",
    },
    {
      id: "topic-menu",
      use_when: "topic-help",
      body: "TOPIC MENU (pick one)\n[ ] Hobby or craft\n[ ] Something you teach others\n[ ] A day-in-the-life quirk (keep light)\n[ ] A skill adjacent to work\n[ ] A story of how you got good at X\nAvoid: forced trauma, HR landmines, roasting teammates\nWorking title: _______________",
    },
    {
      id: "safety-rails",
      use_when: "anxiety",
      body: "SAFETY RAILS\nSpeaker: _______________\n[ ] Notes OK  [ ] Sit or stand OK  [ ] Friend asks first question\n[ ] Time-box hard so it ends\n[ ] One praise + optional one tip only after\n[ ] No grades\nPractice once with lead if wanted: Y/N",
    },
    {
      id: "talk-run-sheet",
      use_when: "run-series",
      body: "TALK RUN SHEET\nSpeaker: _______________  Date: _______\nTopic: _______________\nMinutes: ___  Slides: ___\nWhat the team learned about them: _______________\nSpeaking muscle note (private, kind): _______________",
    },
    {
      id: "transfer-checklist",
      use_when: "transfer",
      body: "TRANSFER CHECKLIST\nAfter N talks, person can:\n[ ] Open a room with sales without freeze\n[ ] Walk a customer through a short deck\n[ ] Explain a process to another team live\nNext stretch assignment: _______________\nDate: _______",
    },
  ],
  examples: [
    {
      id: "ex-interest-series",
      context:
        "Leadership ran class-style talks. People presented interests. Some light, some life stories, some hobby depth.",
      branch: "run-series",
      templates_used: ["series-charter", "talk-run-sheet"],
      resolution:
        "Team knew each other. Speaking reps landed. Ready for harder rooms later.",
      log_row: "series,interests,bond+speak,ok",
    },
    {
      id: "ex-phone-introvert",
      context:
        "Rep excellent on phone; in-person with sales was teeth-pulling.",
      branch: "anxiety",
      templates_used: ["safety-rails", "topic-menu"],
      resolution:
        "Safe first talk on a personal interest. Later transferred to customer explanation.",
      log_row: "safety,first-talk,transfer-later",
    },
    {
      id: "ex-not-review",
      context: "Team feared it was a secret performance review.",
      branch: "run-series",
      templates_used: ["series-charter", "transfer-checklist"],
      resolution:
        "Charter said no grades. Focus stay on bond + skill. Participation held.",
      log_row: "no-grade,charter,held",
    },
  ],
  agentMd:
    "1. Start → **series-charter**.\n2. Stuck topics → **topic-menu**.\n3. Room fear → **safety-rails**.\n4. Each slot → **talk-run-sheet**.\n5. Business proof → **transfer-checklist**.\n6. Pair **mf-tpl-084** morale; **mf-tpl-088** if ladder needs presence skills.",
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
    not_for: "Performance review system or mandatory toastmasters clone.",
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
  not_for: "Performance review system or mandatory toastmasters clone.",
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
