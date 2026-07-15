#!/usr/bin/env node
/**
 * Build people-ops field packs mf-tpl-083..084.
 * 083 high-volume interview redesign · 084 floor morale task force (phone-rep owned).
 * Local only; no push. After: generate-openapi, generate-well-known, audit.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const KNOWN_SLUGS = {
  "mf-tpl-002": "employee-onboarding-kit",
  "mf-tpl-003": "hiring-character-gauge",
  "mf-tpl-005": "weekly-ops-review",
  "mf-tpl-057": "workplace-department-map",
  "mf-tpl-058": "tenured-change-adoption",
  "mf-tpl-061": "support-ops-correlation",
  "mf-tpl-078": "support-incentive-steering",
  "mf-tpl-081": "metrics-that-matter-qbr",
  "mf-tpl-083": "high-volume-interview-redesign",
  "mf-tpl-084": "floor-morale-task-force",
};

const PACKS = [
  {
    id: "mf-tpl-083",
    slug: "high-volume-interview-redesign",
    title: "High-Volume Interview Redesign Playbook",
    mission:
      "Hundreds of seats to fill. Roundtables stuck on call-center trivia. Flip to personality and learning signals first when the job can be taught. Fix the process or you are still interviewing years later.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "New support center needs ~300 hires. Roundtables run long on process tech. Pipeline frozen.",
      branch: "redesign-screen",
      resolution:
        "Personality and learning screen first. Tech taught on the job. Throughput recovered.",
      log_row: "2016-wave,300-target,screen-first,tech-train,throughput-ok",
    },
    teaserBullets: [
      "Time-box roundtables; kill endless tech grill when trainable",
      "Learning and personality signals (e.g. last book, adjectives)",
      "Process redesign when hiring is the bottleneck",
    ],
    pairs: ["mf-tpl-003", "mf-tpl-002", "mf-tpl-057", "mf-tpl-058"],
    tags: ["field-patterns", "hiring", "call-center", "people-ops"],
    playbook: {
      description:
        "Redesign high-volume support hiring interviews: roundtable flow, time-box, screen for learning and personality when domain tech is trainable, stop process theater that freezes the pipeline.",
      mindset: {
        principle:
          "Critical thinking applies to the interview process itself. If the screen is too long and points at teachable trivia, the process is the bug.",
        mistakes: [
          {
            id: "tech-first-always",
            label: "Grill call-center systems for hours when the role is trainable",
            cost: "Pipeline dies; still hiring months later",
          },
          {
            id: "no-time-box",
            label: "Roundtables with no clock or decision rule",
            cost: "Interviewer fatigue; inconsistent hire bar",
          },
          {
            id: "ignore-learning-signal",
            label: "Never probe curiosity or learning habit",
            cost: "Hire static people into a changing floor",
          },
        ],
      },
      screen_layers: [
        {
          id: "learning",
          label: "Interest in learning (e.g. last book, recent skill)",
        },
        {
          id: "personality",
          label: "Self-description and fit for phone energy (adjectives, examples)",
        },
        {
          id: "judgment",
          label: "Light scenario: calm under pressure, not product trivia",
        },
        {
          id: "teachable_tech",
          label: "Only after pass: tools and process can be trained",
        },
      ],
      decision_branches: [
        {
          id: "pipeline-stuck",
          situation: "Need many hires; interviews too slow",
          action: "throughput-diagnosis",
        },
        {
          id: "redesign-screen",
          situation: "Role is trainable; tech grill dominates time",
          action: "screen-first-script",
        },
        {
          id: "roundtable-chaos",
          situation: "Panel inconsistent or endless",
          action: "roundtable-timebox",
        },
        {
          id: "bar-drift",
          situation: "Yes rates wild by interviewer",
          action: "scorecard-lock",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Measure minutes per candidate and pass rate",
            goal: "Prove the process is the bottleneck",
            minutes: "30",
          },
          {
            id: 2,
            name: "Separate trainable tech from must-have traits",
            goal: "What only hire can bring",
            minutes: "60",
          },
          {
            id: 3,
            name: "Rewrite screen order and time-box",
            goal: "Learning/personality first when appropriate",
            minutes: "half-day",
          },
          {
            id: 4,
            name: "Train panel and audit first week",
            goal: "Bar holds at speed",
            minutes: "ongoing",
          },
        ],
      },
      tracking: {
        csv_header:
          "week,candidates,avg_minutes,pass_rate,offer_accept,notes,owner",
        sheet_tab_name: "high_volume_interview",
      },
      related_artifacts: [
        "mf-tpl-003",
        "mf-tpl-002",
        "mf-tpl-057",
        "mf-tpl-058",
      ],
      agent_signal: {
        use_when:
          "High-volume support or call-center hiring stuck. Roundtables too long on teachable tech. Need personality/learning-first redesign and time-box.",
        decision_criteria: [
          "If tech is trainable, do not spend the interview proving tool trivia first.",
          "Time-box every roundtable stage.",
          "Track minutes per hire and pass rate after redesign.",
        ],
        operator_context:
          "Field pattern: insurance/support floor scale-up. Critical thinking on the hiring process itself.",
        tags: ["field-patterns", "hiring", "call-center", "people-ops"],
      },
    },
    templates: [
      {
        id: "throughput-diagnosis",
        use_when: "pipeline-stuck",
        body: "HIRING THROUGHPUT DIAGNOSIS\nTarget seats: ___  Open reqs: ___  Week: _______\n\nAvg minutes per candidate: ___\nStages: _______________\nWhere time dies: _______________\nTrainable vs must-have split: _______________\nOwner: _______________",
      },
      {
        id: "screen-first-script",
        use_when: "redesign-screen",
        body: "SCREEN-FIRST SCRIPT (trainable role)\nTime-box: ___ min\n\n1) Learning signal (e.g. last book / last skill learned): _______________\n2) Three adjectives + example of one under pressure: _______________\n3) Light judgment scenario (not product): _______________\n4) Only if pass: tech/process intro (teach later): _______________\nAdvance Y/N rule: _______________",
      },
      {
        id: "roundtable-timebox",
        use_when: "roundtable-chaos",
        body: "ROUNDTABLE TIME-BOX\nRoles on panel: _______________\nTotal minutes: ___\nPer stage: intro __ / screen __ / scenario __ / debrief __\nDecision rule same day: Y/N\nScribe: _______________",
      },
      {
        id: "scorecard-lock",
        use_when: "bar-drift",
        body: "SCORECARD LOCK\nMust-have traits (3 max): _______________\nNice-to-have: _______________\nAutomatic no: _______________\nPanel calibration note: _______________",
      },
      {
        id: "week-one-audit",
        use_when: "redesign-screen",
        body: "WEEK-ONE AUDIT\nCandidates: ___  Avg minutes: ___  Pass%: ___\nFalse pass signals: _______________\nAdjust script: _______________",
      },
    ],
    examples: [
      {
        id: "ex-300-seats",
        context:
          "Company building call center. ~300 reps. Roundtables stuck on call-center process detail. Insurance support: tech teachable.",
        branch: "redesign-screen",
        templates_used: ["throughput-diagnosis", "screen-first-script", "roundtable-timebox"],
        resolution:
          "Personality and learning first. Throughput recovered. Without redesign, hiring would still be running years later.",
        log_row: "wave-1,300,screen-first,minutes-down,ok",
      },
      {
        id: "ex-book-signal",
        context:
          "Panel argued book question was soft. Pass group showed stronger ramp curiosity in training.",
        branch: "redesign-screen",
        templates_used: ["screen-first-script", "week-one-audit"],
        resolution:
          "Kept learning signal. Soft does not mean useless.",
        log_row: "wave-2,learning-signal,kept,ramp-ok",
      },
      {
        id: "ex-bar-drift",
        context: "Two interviewers yes almost everyone; one yes almost none.",
        branch: "bar-drift",
        templates_used: ["scorecard-lock", "roundtable-timebox"],
        resolution:
          "Three must-haves locked. Calibration meeting. Variance down.",
        log_row: "wave-3,scorecard,variance-down",
      },
    ],
    agentMd:
      "1. Stuck pipeline → **throughput-diagnosis**.\n2. Trainable role → **screen-first-script** + **roundtable-timebox**.\n3. Wild yes rates → **scorecard-lock**.\n4. After change → **week-one-audit**.\n5. Pair **mf-tpl-003** character gauge; **mf-tpl-002** onboarding after offer.",
  },
  {
    id: "mf-tpl-084",
    slug: "floor-morale-task-force",
    title: "Floor Morale Task Force Playbook",
    mission:
      "Call center air is dead. Build a rep-owned morale task force: phone people from multiple teams, not leads. They invent the energy. Management funds and shows up for the stunts.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Walk the floor; energy gone. Everyday blues. Supervisors already overloaded.",
      branch: "stand-up-force",
      resolution:
        "Weekly rep council. Potlucks, goal dares, open-floor games. Other departments send reps. Morale owned by the people on the phones.",
      log_row: "wave-eat,6-depts,weekly,rep-owned,spread",
    },
    teaserBullets: [
      "Reps from multiple departments, not supervisors",
      "Weekly ideation; management as sponsor not boss of fun",
      "Cross-org spread when it works",
    ],
    pairs: ["mf-tpl-005", "mf-tpl-061", "mf-tpl-078", "mf-tpl-057"],
    tags: ["field-patterns", "morale", "call-center", "people-ops"],
    playbook: {
      description:
        "Stand up a floor morale task force owned by individual contributors on the phones: multi-department reps, weekly meet, idea funnel, leadership sponsorship (budget and willingness to look silly), expansion when other groups want in.",
      mindset: {
        principle:
          "For the people, by the people. Leads do not brainstorm fun for the floor. The floor does. Leadership pays and participates.",
        mistakes: [
          {
            id: "lead-owned-fun",
            label: "Supervisors or HR own the fun calendar alone",
            cost: "Feels mandatory and fake; energy stays flat",
          },
          {
            id: "no-sponsor",
            label: "Ideas with zero budget or leadership skin in the game",
            cost: "Dies after one potluck",
          },
          {
            id: "metrics-only-culture",
            label: "Only scoreboards, never release valve",
            cost: "Burnout; quality and attendance drift",
          },
        ],
      },
      design_rules: [
        "Members are phone or queue ICs, not the lead layer",
        "At least several departments or queues represented",
        "Weekly short meeting with a simple idea log",
        "Leadership sponsor: budget + public participation",
        "Optional link to goals (dare, chair prize) without turning into only a KPI club",
        "Invite other groups when they ask in",
      ],
      idea_catalog_examples: [
        "Potluck or shared meal days",
        "Fundraisers for simple floor treats",
        "Leader dare if a public goal hits (skin in the game)",
        "Best-stats temporary perk (e.g. symbolic chair or parking)",
        "Open-floor games (e.g. email or call bingo in a fishbowl center)",
        "Whatever the reps invent next",
      ],
      decision_branches: [
        {
          id: "dead-air",
          situation: "Floor energy visibly gone",
          action: "stand-up-force",
        },
        {
          id: "idea-drought",
          situation: "Force exists but no fresh ideas",
          action: "idea-funnel-week",
        },
        {
          id: "sponsor-needed",
          situation: "Ideas need money or leader dare",
          action: "sponsor-brief",
        },
        {
          id: "spread",
          situation: "Other departments want in",
          action: "expansion-charter",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Name the problem out loud",
            goal: "Dead air is real",
            minutes: "15",
          },
          {
            id: 2,
            name: "Pick IC reps across teams",
            goal: "Not the usual lead meeting",
            minutes: "half-day",
          },
          {
            id: 3,
            name: "Weekly meet + idea log",
            goal: "They invent; you unblock",
            minutes: "30/week",
          },
          {
            id: 4,
            name: "Sponsor stunts and invite spread",
            goal: "Skin in the game; open the circle",
            minutes: "ongoing",
          },
        ],
      },
      tracking: {
        csv_header:
          "week,members,ideas_new,events_run,sponsor_actions,other_depts,notes,owner",
        sheet_tab_name: "floor_morale_task_force",
      },
      related_artifacts: [
        "mf-tpl-005",
        "mf-tpl-061",
        "mf-tpl-078",
        "mf-tpl-057",
      ],
      agent_signal: {
        use_when:
          "Support or call-center floor morale is dead. Need rep-owned task force not HR theater. Multi-department ICs, weekly ideas, leadership sponsor.",
        decision_criteria: [
          "Members are phone people, not supervisors.",
          "Leadership sponsors budget and public participation.",
          "Allow expansion when other groups send reps.",
        ],
        operator_context:
          "Field pattern: employee activities style task force. For the people, by the people. Metrics still matter; dead air kills them over time.",
        tags: ["field-patterns", "morale", "call-center", "people-ops"],
      },
    },
    templates: [
      {
        id: "stand-up-force",
        use_when: "dead-air",
        body: "FLOOR MORALE TASK FORCE STAND-UP\nSponsor (leader): _______________\n\nIC members (name queues/depts, not titles of power):\n1 ___  2 ___  3 ___  4 ___  5 ___  6 ___\nMeeting: day/time ___  length ___\nCharter one-liner: energy and morale ideas owned by the floor\nFirst meeting date: _______",
      },
      {
        id: "idea-funnel-week",
        use_when: "idea-drought",
        body: "IDEA FUNNEL WEEK\nWeek: _______\n\nIdeas proposed: _______________\nFeasible this month: _______________\nNeeds budget: _______________\nNeeds leader dare/skin: _______________\nKill list (not now): _______________",
      },
      {
        id: "sponsor-brief",
        use_when: "sponsor-needed",
        body: "SPONSOR BRIEF\nAsk: $___ or in-kind _______________\nPublic stunt if goal hits: _______________\nWhy floor-owned matters: _______________\nDecision by: _______\nLeader response: [ ] yes  [ ] change  [ ] no",
      },
      {
        id: "expansion-charter",
        use_when: "spread",
        body: "EXPANSION CHARTER\nRequesting group: _______________\nNew IC seat(s): _______________\nSame rules: ICs only, weekly, idea log\nWhat does not change: not a lead meeting\nStart date: _______",
      },
      {
        id: "event-run-sheet",
        use_when: "idea-drought",
        body: "EVENT RUN SHEET\nEvent: _______________  Date: _______\nOwner (rep): _______________\nBudget: ___  Sponsor role: _______________\nSuccess signal (energy, not only KPI): _______________\nRetro one line: _______________",
      },
    ],
    examples: [
      {
        id: "ex-dead-air-force",
        context:
          "Walked the center; air sucked out. Everyday blues. Built multi-dept phone-rep task force.",
        branch: "stand-up-force",
        templates_used: ["stand-up-force", "idea-funnel-week"],
        resolution:
          "Potlucks, treat days, open-floor games. Other groups asked in. Owned by the phones.",
        log_row: "stand-up,6-queues,weekly,spread",
      },
      {
        id: "ex-leader-dare",
        context:
          "Reps proposed public goal dare for a leader (appearance stunt) if target hit. They hit it.",
        branch: "sponsor-needed",
        templates_used: ["sponsor-brief", "event-run-sheet"],
        resolution:
          "Leader followed through. Credibility of the force jumped. Worth it.",
        log_row: "dare-hit,sponsor-did,trust-up",
      },
      {
        id: "ex-cross-dept",
        context: "Service and support started; other departments sent reps.",
        branch: "spread",
        templates_used: ["expansion-charter"],
        resolution:
          "Same IC rule. Stayed for the people, by the people.",
        log_row: "expand,ic-only,ok",
      },
    ],
    agentMd:
      "1. Dead floor energy → **stand-up-force** (ICs, multi-queue).\n2. Weekly → **idea-funnel-week** + **event-run-sheet**.\n3. Money or dare → **sponsor-brief** (leader skin in the game).\n4. Other depts want in → **expansion-charter** (still no lead takeover).\n5. Pair **mf-tpl-005** ops rhythm; **mf-tpl-078** if incentives are crushing morale.",
  },
];

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function SLUG_FROM_PAIR(id) {
  return KNOWN_SLUGS[id] || id.replace(/^mf-tpl-/, "").replace(/^mf-tool-/, "");
}

function teaserHtml(p) {
  const ex = JSON.stringify(p.teaserExample, null, 2);
  return `<!DOCTYPE html>
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
      <pre class="meta">${ex}</pre>
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
}

function fullIndexHtml(p) {
  return `<!DOCTYPE html>
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
`;
}

function agentMd(p) {
  const sig = p.playbook.agent_signal;
  return `# ${p.id} · ${p.title}

**Audience:** agents. ${p.mission}

## Fetch order

1. \`playbook.json\`
2. \`templates.json\`
3. \`examples.json\`

## Apply

${p.agentMd}

## Agent signal (v1.2)

- **Use when:** ${sig.use_when}
- **Pairs with:** ${p.playbook.related_artifacts.slice(0, 4).join(", ")}
- **Trigger phrases:** "${sig.use_when.slice(0, 60)}..."; "Need playbook: ${p.title}"

## Lane

field_patterns · People ops on the support floor.
`;
}

for (const p of PACKS) {
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
      not_for: "Generic job spine. Not legal/HR compliance advice.",
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
  fs.writeFileSync(path.join(full, "AGENT.md"), agentMd(p) + "\n");
  fs.writeFileSync(path.join(full, "index.html"), fullIndexHtml(p));
  fs.writeFileSync(path.join(base, "index.html"), teaserHtml(p));
  console.log("wrote", p.id, p.slug);
}

const manifestPath = path.join(MF, "catalog-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const newEntries = PACKS.map((p) => ({
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
  not_for: "Generic job spine. Not legal/HR compliance advice.",
  pairs_with: p.playbook.related_artifacts.slice(0, 4),
  trigger_phrases: [
    p.playbook.agent_signal.use_when.slice(0, 80),
    `Need playbook: ${p.title}`,
  ],
  agent_signal_version: "1.2",
}));

const byId = new Map(manifest.entries.map((e) => [e.id, e]));
for (const e of newEntries) byId.set(e.id, e);
const existingOrder = manifest.entries.map((e) => e.id);
for (const id of newEntries.map((e) => e.id)) {
  if (!existingOrder.includes(id)) existingOrder.push(id);
}
manifest.entries = existingOrder.map((id) => byId.get(id)).filter(Boolean);
manifest.entry_count = manifest.entries.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest entry_count:", manifest.entry_count);

const indexPath = path.join(MF, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");
if (!indexHtml.includes('id="mf-tpl-083"')) {
  const articles = PACKS.map(
    (p) =>
      `<article class="entry" id="${p.id}"><p class="entry-id">ENTRY: ${p.id} · field-patterns</p><h3>${p.title}</h3><dl class="kv"><dt>TEASER</dt><dd><a href="templates/${p.slug}/">${p.slug}/</a></dd><dt>FULL</dt><dd><a href="templates/${p.slug}/full/">full/</a> · $0.08</dd></dl></article>`
  ).join("\n");
  if (indexHtml.includes("</main>")) {
    indexHtml = indexHtml.replace("</main>", articles + "\n</main>");
  } else if (indexHtml.includes('<footer class="foot">')) {
    indexHtml = indexHtml.replace(
      '<footer class="foot">',
      articles + '\n<footer class="foot">'
    );
  } else {
    indexHtml += "\n" + articles + "\n";
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
if (!indexHtml.includes("mf-tpl-083 high-volume")) {
  indexHtml = indexHtml.replace(
    /(<p><strong>Sales \/ QBR cluster:<\/strong>[^<]+<\/p>)/,
    `$1\n      <p><strong>People ops:</strong> mf-tpl-083 high-volume interview redesign · 084 floor morale task force.</p>`
  );
}
fs.writeFileSync(indexPath, indexHtml);

const workerPath = path.join(ROOT, "worker", "index.ts");
let worker = fs.readFileSync(workerPath, "utf8");
for (const p of PACKS) {
  const needle = `prefix: "/2nd-pages/materials-factory/templates/${p.slug}/full"`;
  if (worker.includes(needle)) continue;
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
}
fs.writeFileSync(workerPath, worker);
console.log("worker gates updated");
console.log("done build-people-ops-083-084 (no push)");
