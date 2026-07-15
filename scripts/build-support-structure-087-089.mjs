#!/usr/bin/env node
/**
 * mf-tpl-087 named-account support (SAM-style)
 * mf-tpl-088 support/escalation engineer ladder
 * mf-tpl-089 preventable ticket kill (welcome pack / solve before ring)
 * Local; no push. openapi + well-known + audit after.
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
  "mf-tpl-062": "queue-split-design",
  "mf-tpl-075": "account-ndf-healthcheck",
  "mf-tpl-081": "metrics-that-matter-qbr",
  "mf-tpl-083": "high-volume-interview-redesign",
  "mf-tpl-085": "pie-weekly-bridge",
  "mf-tpl-086": "support-oncall-design",
  "mf-tpl-087": "named-account-support",
  "mf-tpl-088": "escalation-engineer-ladder",
  "mf-tpl-089": "preventable-ticket-kill",
};

const PACKS = [
  {
    id: "mf-tpl-087",
    slug: "named-account-support",
    title: "Named Account Support Playbook",
    mission:
      "Service-account style: a set of agents wholly tied to a set of accounts. Commercial pods; large segments can be one big named pool. Continuity over random queue.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Commercial accounts bounce across random agents. Context lost every call. Customers and sales scream.",
      branch: "stand-up-pod",
      resolution:
        "Named agents per account set. Gov/large segment as one dedicated pool. Continuity and ownership up.",
      log_row: "SAM-pod,acct-set-12,agents-4,continuity-up",
    },
    teaserBullets: [
      "Agents mapped to account sets",
      "Commercial pods vs large-segment pool",
      "Ownership without isolating knowledge",
    ],
    pairs: ["mf-tpl-062", "mf-tpl-075", "mf-tpl-081", "mf-tpl-020"],
    tags: ["field-patterns", "account-support", "structure", "support-ops"],
    playbook: {
      description:
        "Design named-account support: agents permanently or primarily tied to account sets (service account manager style), with a model for commercial pods and large single-segment pools.",
      mindset: {
        principle:
          "Random queue is fair to the ACD and cruel to the relationship. Named ownership is how commercial accounts stop re-explaining every week.",
        mistakes: [
          {
            id: "pure-random",
            label: "Every call any agent for strategic accounts",
            cost: "No memory; sales loses trust; repeat diagnosis",
          },
          {
            id: "one-hero",
            label: "One person owns everything; no bench",
            cost: "Bus factor; burnout; vacation collapses service",
          },
          {
            id: "silo-forever",
            label: "Pods never share patterns",
            cost: "Same bug fixed five ways; no product signal",
          },
        ],
      },
      models: [
        {
          id: "commercial-pod",
          label: "Small set of agents wholly tied to a set of commercial accounts",
        },
        {
          id: "segment-pool",
          label: "One large segment (e.g. institutional) as one named pool / group",
        },
        {
          id: "hybrid",
          label: "Named primary with overflow rules to trained backup",
        },
      ],
      decision_branches: [
        {
          id: "stand-up-pod",
          situation: "Strategic accounts need continuity",
          action: "account-agent-map",
        },
        {
          id: "segment-pool",
          situation: "One huge segment behaves like one account",
          action: "segment-pool-charter",
        },
        {
          id: "bus-factor",
          situation: "Only one person knows the account",
          action: "bench-and-notes",
        },
        {
          id: "overflow",
          situation: "Pod overloaded or offline",
          action: "overflow-rules",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "List accounts that need named ownership",
            goal: "Not everyone; strategic set",
            minutes: "60",
          },
          {
            id: 2,
            name: "Map agents to sets; publish to sales",
            goal: "Who to call is known",
            minutes: "half-day",
          },
          {
            id: 3,
            name: "Bench + shared notes",
            goal: "No single hero",
            minutes: "ongoing",
          },
          {
            id: 4,
            name: "Pattern share across pods",
            goal: "Product and process signal",
            minutes: "weekly",
          },
        ],
      },
      tracking: {
        csv_header:
          "account_set,primary_agents,backup,open_tickets,repeat_contact_rate,notes,owner",
        sheet_tab_name: "named_account_support",
      },
      related_artifacts: [
        "mf-tpl-062",
        "mf-tpl-075",
        "mf-tpl-081",
        "mf-tpl-020",
      ],
      agent_signal: {
        use_when:
          "Need service-account or named-agent support for commercial or strategic accounts. Random queue failing relationship. Large segment as one dedicated pool.",
        decision_criteria: [
          "Map agents to account sets, not only skills.",
          "Always bench and notes; never one hero.",
          "Share patterns across pods so structure does not silo learning.",
        ],
        operator_context:
          "Field pattern: SAM-style commercial pods; large gov/institutional as one big named group.",
        tags: ["field-patterns", "account-support", "structure", "support-ops"],
      },
    },
    templates: [
      {
        id: "account-agent-map",
        use_when: "stand-up-pod",
        body: "ACCOUNT-AGENT MAP\nAccount set name: _______________\nAccounts in set: _______________\nPrimary agents: _______________\nBackup: _______________\nSales partner: _______________\nPublished: Y/N  Date: _______",
      },
      {
        id: "segment-pool-charter",
        use_when: "segment-pool",
        body: "SEGMENT POOL CHARTER\nSegment: _______________\nWhy one pool: _______________\nAgents in pool: _______________\nIntake path: _______________\nSuccess signal: _______________",
      },
      {
        id: "bench-and-notes",
        use_when: "bus-factor",
        body: "BENCH AND NOTES\nAccount: _______________\nPrimary: _______________  Bench: _______________\nLiving notes location: _______________\nLast cross-train date: _______\nCoverage if primary out: _______________",
      },
      {
        id: "overflow-rules",
        use_when: "overflow",
        body: "OVERFLOW RULES\nPod: _______________\nWhen overflow allowed: _______________\nWho can take: _______________\nWhat must be in handoff: _______________\nReturn to pod when: _______________",
      },
      {
        id: "pod-pattern-share",
        use_when: "stand-up-pod",
        body: "POD PATTERN SHARE (weekly)\nPatterns seen: _______________\nNeeds product/eng: _______________\nNeeds process: _______________\nOwner: _______________",
      },
    ],
    examples: [
      {
        id: "ex-commercial-sam",
        context:
          "Commercial accounts needed continuity. Built agent sets wholly tied to account groups.",
        branch: "stand-up-pod",
        templates_used: ["account-agent-map", "bench-and-notes"],
        resolution:
          "Named ownership. Sales knew who to pull. Repeat context down.",
        log_row: "SAM,commercial-pods,map-live,ok",
      },
      {
        id: "ex-segment-pool",
        context:
          "Large institutional segment behaved like one relationship; dedicated group owned it.",
        branch: "segment-pool",
        templates_used: ["segment-pool-charter"],
        resolution:
          "One pool, clear intake. Treated as named structure not random queue.",
        log_row: "segment-pool,charter,ok",
      },
      {
        id: "ex-hero-risk",
        context: "One agent held all tribal knowledge for top accounts.",
        branch: "bus-factor",
        templates_used: ["bench-and-notes", "overflow-rules"],
        resolution:
          "Bench trained; notes living. Vacation no longer an outage.",
        log_row: "bench,notes,bus-factor-down",
      },
    ],
    agentMd:
      "1. Strategic accounts → **account-agent-map**.\n2. Huge segment → **segment-pool-charter**.\n3. One hero → **bench-and-notes**.\n4. Load spikes → **overflow-rules**.\n5. Weekly → **pod-pattern-share**.\n6. Pair **mf-tpl-062** queues; **mf-tpl-075/081** account health and QBR.",
  },
  {
    id: "mf-tpl-088",
    slug: "escalation-engineer-ladder",
    title: "Escalation Engineer Ladder Playbook",
    mission:
      "Support Engineering path: support engineers into escalation engineers. Same family, feeding each other. Title and structure that counter support stigma and give customers a real next level without the wrong fight.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Customers demand next level. Support stigma. Top reps have no title path. Escalations are chaos.",
      branch: "ladder-design",
      resolution:
        "Support engineer track into escalation engineer. Teach path, not just say no. Customers feel special; team has pride.",
      log_row: "SE-ladder,EE-tier,teach-path,stigma-down",
    },
    teaserBullets: [
      "Support engineer to escalation engineer ladder",
      "Cohesive structure customers can understand",
      "Teach the right next step instead of raw no",
    ],
    pairs: ["mf-tpl-085", "mf-tpl-086", "mf-tpl-083", "mf-tpl-087"],
    tags: ["field-patterns", "career-ladder", "escalation", "support-ops"],
    playbook: {
      description:
        "Build a cohesive support engineering ladder: entry support engineers and escalation engineers as one family. Counter stigma, give customers a credible next level, and teach when they want the wrong thing.",
      mindset: {
        principle:
          "Customers often want the wrong next level. Saying no makes them mad. An engineer who teaches makes them feel special and still steers the path.",
        mistakes: [
          {
            id: "no-ladder",
            label: "Only generic support title forever",
            cost: "Top talent leaves; customers assume all support sucks",
          },
          {
            id: "fake-title",
            label: "Title change with no skill or scope change",
            cost: "Credibility dies; eng laughs; customers not fooled long",
          },
          {
            id: "raw-no",
            label: "Tell customer they want the wrong thing with no teach",
            cost: "Pissed customer; escalates politically",
          },
          {
            id: "silo-tiers",
            label: "Escalation eng never feeds learning back to base support",
            cost: "Same issues escalate forever",
          },
        ],
      },
      ladder_rungs: [
        {
          id: "support-engineer",
          label: "Strong tech support with engineering posture and standards",
        },
        {
          id: "escalation-engineer",
          label: "Top notch; complex, multi-system, customer-critical next level",
        },
        {
          id: "feed-loop",
          label: "Same group culture; escalations teach the line below",
        },
      ],
      decision_branches: [
        {
          id: "ladder-design",
          situation: "Need titles and scope for advanced support",
          action: "rung-definitions",
        },
        {
          id: "customer-next-level",
          situation: "Customer demands engineer / next tier",
          action: "teach-path-script",
        },
        {
          id: "stigma",
          situation: "Support brand is weak internally or externally",
          action: "ladder-comms",
        },
        {
          id: "feed-gap",
          situation: "Same issues always escalate",
          action: "return-learning",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Define rungs and promotion evidence",
            goal: "Real scope, not sticker",
            minutes: "half-day",
          },
          {
            id: 2,
            name: "Publish customer-facing next-level story",
            goal: "What escalation eng means",
            minutes: "60",
          },
          {
            id: 3,
            name: "Teach-path for wrong asks",
            goal: "Special feeling, correct path",
            minutes: "ongoing",
          },
          {
            id: 4,
            name: "Feed learning back to line",
            goal: "Escalation volume healthy",
            minutes: "weekly",
          },
        ],
      },
      tracking: {
        csv_header:
          "period,se_count,ee_count,esc_volume,esc_avoided_by_teach,return_kb_items,notes,owner",
        sheet_tab_name: "escalation_engineer_ladder",
      },
      related_artifacts: [
        "mf-tpl-085",
        "mf-tpl-086",
        "mf-tpl-083",
        "mf-tpl-087",
      ],
      agent_signal: {
        use_when:
          "Need support engineer / escalation engineer career ladder. Customers demand next level. Support stigma. Teach path when they want the wrong thing.",
        decision_criteria: [
          "Titles match real scope and skill.",
          "Escalation eng and support eng feed each other.",
          "Wrong customer ask gets teach, not raw no.",
        ],
        operator_context:
          "Field pattern: cohesive support structure; stigma counter; customer feels special with engineer teach.",
        tags: ["field-patterns", "career-ladder", "escalation", "support-ops"],
      },
    },
    templates: [
      {
        id: "rung-definitions",
        use_when: "ladder-design",
        body: "LADDER RUNG DEFINITIONS\nSupport engineer: scope _______________  evidence to enter _______________\nEscalation engineer: scope _______________  evidence to enter _______________\nDoes not include (still product eng): _______________\nPromotion cadence: _______________",
      },
      {
        id: "teach-path-script",
        use_when: "customer-next-level",
        body: "TEACH-PATH SCRIPT\nCustomer asked for: _______________\nWhat they actually need: _______________\n\nSay: We hear you want depth. Here is how we solve this class of issue and who owns it.\nShow: steps / owner / when true escalation eng engages\nDo not: raw no or fake promise of product eng",
      },
      {
        id: "ladder-comms",
        use_when: "stigma",
        body: "LADDER COMMS (internal + customer-safe)\nInternal: why these titles exist _______________\nCustomer-safe: what next level means _______________\nSales talking points: _______________\nDate published: _______",
      },
      {
        id: "return-learning",
        use_when: "feed-gap",
        body: "RETURN LEARNING\nEscalation theme: _______________\nKB/training item: _______________\nOwner on line support: _______________  Due: _______\nSuccess: esc volume for theme drops",
      },
      {
        id: "promo-evidence-row",
        use_when: "ladder-design",
        body: "PROMO EVIDENCE ROW\nPerson: _______________  Target rung: _______________\nCases / skills shown: _______________\nGaps: _______________\nDecision: Y/N  Date: _______",
      },
    ],
    examples: [
      {
        id: "ex-ee-title",
        context:
          "Top support needed a real next title. Customers wanted next level. Stigma on support.",
        branch: "ladder-design",
        templates_used: ["rung-definitions", "ladder-comms"],
        resolution:
          "Support engineer into escalation engineer track. Same family. Pride and clarity up.",
        log_row: "SE-EE-ladder,live,ok",
      },
      {
        id: "ex-teach-not-no",
        context:
          "Customer demanded wrong escalated path. Raw no would enrage.",
        branch: "customer-next-level",
        templates_used: ["teach-path-script"],
        resolution:
          "Engineer taught correct path. Customer felt handled; issue resolved without politics.",
        log_row: "teach-path,no-politics,ok",
      },
      {
        id: "ex-feed-loop",
        context: "Same class always hit escalation eng.",
        branch: "feed-gap",
        templates_used: ["return-learning"],
        resolution:
          "KB to line. Escalation volume on that theme dropped.",
        log_row: "return-kb,esc-down",
      },
    ],
    agentMd:
      "1. Need structure → **rung-definitions** + **promo-evidence-row**.\n2. Customer wrong next-level → **teach-path-script**.\n3. Stigma → **ladder-comms**.\n4. Repeat esc → **return-learning**.\n5. Pair **mf-tpl-085** PIE; **mf-tpl-086** on-call tiers; **mf-tpl-087** named accounts.",
  },
  {
    id: "mf-tpl-089",
    slug: "preventable-ticket-kill",
    title: "Preventable Ticket Kill Playbook",
    mission:
      "Solve problems before they become tickets. Factory welcome packs, default passwords in the box, human phone openers with location. Design out the obvious call.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Every new server ships; almost every customer calls for the factory admin password.",
      branch: "kill-pattern",
      resolution:
        "Welcome pack in box with password and reset steps. Call class dies.",
      log_row: "welcome-pack,admin-pw,ticket-class-dead",
    },
    teaserBullets: [
      "Find high-volume preventable call classes",
      "Fix in product/docs/box not only on the phone",
      "Human openers that set trust fast",
    ],
    pairs: ["mf-tpl-020", "mf-tpl-027", "mf-tpl-065", "mf-tpl-081"],
    tags: ["field-patterns", "deflection", "onboarding", "support-ops"],
    playbook: {
      description:
        "Kill preventable support demand: identify recurring call classes caused by missing info or process, fix upstream (welcome pack, docs, packaging, defaults), and set simple human contact patterns that reduce friction.",
      mindset: {
        principle:
          "The goal is solving problems before they become them. If almost every customer calls for the same thing, the system is wrong, not the customer.",
        mistakes: [
          {
            id: "train-only",
            label: "Train agents harder on a preventable class",
            cost: "Volume stays; cost stays; pride down",
          },
          {
            id: "hide-defaults",
            label: "Ship systems without obvious access info",
            cost: "Guaranteed day-one calls",
          },
          {
            id: "rando-voice",
            label: "Anonymous phone open with no place or identity",
            cost: "Customer assumes offshore chaos even when not",
          },
        ],
      },
      kill_types: [
        {
          id: "in-box",
          label: "Welcome pack / insert with access and first steps",
        },
        {
          id: "default-access",
          label: "Document factory credentials and reset path",
        },
        {
          id: "voice-trust",
          label: "Phone open: thanks + who/where so not a rando",
        },
        {
          id: "ship-docs",
          label: "First-boot or install sheet for top fail asks",
        },
      ],
      decision_branches: [
        {
          id: "kill-pattern",
          situation: "Same ticket class on nearly every new ship or install",
          action: "volume-class-hunt",
        },
        {
          id: "inbox-fix",
          situation: "Missing info that belongs in the box or welcome",
          action: "welcome-pack-spec",
        },
        {
          id: "voice",
          situation: "Need faster trust on live answer",
          action: "open-line-script",
        },
        {
          id: "measure",
          situation: "Prove the kill worked",
          action: "class-volume-before-after",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Hunt top preventable classes",
            goal: "Volume x obviousness",
            minutes: "60",
          },
          {
            id: 2,
            name: "Design upstream fix",
            goal: "Box, doc, default, not only KB for agents",
            minutes: "half-day",
          },
          {
            id: 3,
            name: "Ship and train",
            goal: "Ops and packaging aligned",
            minutes: "varies",
          },
          {
            id: 4,
            name: "Measure before/after",
            goal: "Kill or iterate",
            minutes: "monthly",
          },
        ],
      },
      tracking: {
        csv_header:
          "class_id,description,volume_before,volume_after,fix_type,ship_date,owner",
        sheet_tab_name: "preventable_ticket_kill",
      },
      related_artifacts: [
        "mf-tpl-020",
        "mf-tpl-027",
        "mf-tpl-065",
        "mf-tpl-081",
      ],
      agent_signal: {
        use_when:
          "High volume of preventable tickets (e.g. every ship calls for password). Need welcome pack or upstream kill. Phone open that signals real location/team.",
        decision_criteria: [
          "If almost everyone calls, fix the system not the script alone.",
          "Prefer in-box and defaults over more agent training.",
          "Measure class volume before and after.",
        ],
        operator_context:
          "Field pattern: factory admin password calls killed by welcome pack; human open with location builds trust.",
        tags: ["field-patterns", "deflection", "onboarding", "support-ops"],
      },
    },
    templates: [
      {
        id: "volume-class-hunt",
        use_when: "kill-pattern",
        body: "PREVENTABLE CLASS HUNT\nPeriod: _______\n\nClass | Volume | Why preventable | Upstream owner\n_____ | | |\nTop pick to kill first: _______________",
      },
      {
        id: "welcome-pack-spec",
        use_when: "inbox-fix",
        body: "WELCOME PACK SPEC\nProduct/line: _______________\nMust include: access defaults _______________  reset steps _______________\nFirst-hour checklist: _______________\nWhere it ships (box / email / both): _______________\nOwner: packaging ___  support ___  Effective ship date: _______",
      },
      {
        id: "open-line-script",
        use_when: "voice",
        body: "OPEN LINE SCRIPT\nThanks for calling _______________\nLocation/team signal: _______________ (so not another rando)\nName: _______________\nThen: how can I help\nTime-box open: under 10 seconds",
      },
      {
        id: "class-volume-before-after",
        use_when: "measure",
        body: "CLASS BEFORE/AFTER\nClass: _______________\nBefore (4 wk): ___  After (4 wk): ___\nFix shipped: _______________\nKeep / iterate / kill project: _______________",
      },
      {
        id: "factory-default-card",
        use_when: "inbox-fix",
        body: "FACTORY DEFAULT ACCESS CARD\nSKU/line: _______________\nDefault user: _______________  Temp secret handling: _______________\nReset instruction summary: _______________\nSecurity note: change on first login Y/N",
      },
    ],
    examples: [
      {
        id: "ex-admin-password",
        context:
          "Almost every new system triggered a call for factory admin password.",
        branch: "kill-pattern",
        templates_used: ["volume-class-hunt", "welcome-pack-spec", "factory-default-card"],
        resolution:
          "Welcome pack in box with password and reset steps. That ticket class collapsed.",
        log_row: "admin-pw,welcome-pack,class-dead",
      },
      {
        id: "ex-location-open",
        context:
          "Customers assumed anonymous random support. Team was real regional.",
        branch: "voice",
        templates_used: ["open-line-script"],
        resolution:
          "Open with thanks and location. Trust and patience up on hard calls.",
        log_row: "open-location,trust-up",
      },
      {
        id: "ex-measure",
        context: "Pack shipped; need proof for leadership.",
        branch: "measure",
        templates_used: ["class-volume-before-after"],
        resolution:
          "Before/after volume shown. Budget for next kill approved.",
        log_row: "before-after,prove,next-kill",
      },
    ],
    agentMd:
      "1. Hunt → **volume-class-hunt**.\n2. In-box / defaults → **welcome-pack-spec** + **factory-default-card**.\n3. Voice trust → **open-line-script**.\n4. Prove → **class-volume-before-after**.\n5. Pair **mf-tpl-027** onboarding; **mf-tpl-065** unit cost of the class you killed.",
  },
];

function writeJson(f, o) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(o, null, 2) + "\n");
}
function slug(id) {
  return KNOWN[id] || id.replace(/^mf-tpl-/, "");
}

function teaserHtml(p) {
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
`;
}

function fullHtml(p) {
  return `<!DOCTYPE html>
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
      not_for: "Generic job spine only. Not HR legal advice on titles/pay.",
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
    `# ${p.id} · ${p.title}\n\n**Audience:** agents. ${p.mission}\n\n## Apply\n${p.agentMd}\n\n## Use when\n${p.playbook.agent_signal.use_when}\n`
  );
  fs.writeFileSync(path.join(base, "index.html"), teaserHtml(p));
  fs.writeFileSync(path.join(full, "index.html"), fullHtml(p));
  console.log("wrote", p.id, p.slug);
}

const manifestPath = path.join(MF, "catalog-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const byId = new Map(manifest.entries.map((e) => [e.id, e]));
for (const p of PACKS) {
  byId.set(p.id, {
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
    not_for: "Generic job spine only. Not HR legal advice on titles/pay.",
    pairs_with: p.playbook.related_artifacts,
    trigger_phrases: [
      p.playbook.agent_signal.use_when.slice(0, 80),
      `Need playbook: ${p.title}`,
    ],
    agent_signal_version: "1.2",
  });
}
const order = manifest.entries.map((e) => e.id);
for (const p of PACKS) if (!order.includes(p.id)) order.push(p.id);
manifest.entries = order.map((id) => byId.get(id)).filter(Boolean);
manifest.entry_count = manifest.entries.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest", manifest.entry_count);

let indexHtml = fs.readFileSync(path.join(MF, "index.html"), "utf8");
for (const p of PACKS) {
  if (indexHtml.includes(`id="${p.id}"`)) continue;
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
for (const p of PACKS) {
  const needle = `prefix: "/2nd-pages/materials-factory/templates/${p.slug}/full"`;
  if (worker.includes(needle)) continue;
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
}
fs.writeFileSync(path.join(ROOT, "worker", "index.ts"), worker);
console.log("done build-support-structure-087-089");
