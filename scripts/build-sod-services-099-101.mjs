#!/usr/bin/env node
/**
 * mf-tpl-099 SOD (service ops execution arm)
 * mf-tpl-100 Support/Services revenue center path
 * mf-tpl-101 Parts recovery program
 * Target catalog 101. Local; no push.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const KNOWN = {
  "mf-tpl-020": "warranty-support-touch",
  "mf-tpl-065": "support-unit-economics",
  "mf-tpl-074": "rma-test-credibility",
  "mf-tpl-081": "metrics-that-matter-qbr",
  "mf-tpl-087": "named-account-support",
  "mf-tpl-088": "escalation-engineer-ladder",
  "mf-tpl-089": "preventable-ticket-kill",
  "mf-tpl-092": "customer-learning-program",
  "mf-tpl-093": "control-panel-cabinet",
  "mf-tpl-099": "service-operations-desk",
  "mf-tpl-100": "services-revenue-center",
  "mf-tpl-101": "parts-recovery-program",
};

const PACKS = [
  {
    id: "mf-tpl-099",
    slug: "service-operations-desk",
    title: "Service Operations Desk Playbook",
    mission:
      "SOD: execution arm of post-sales. Traditional RMA/shipping/returns group so support engineers stop shipping parts and chase paperwork. Support solves; SOD closes, returns, collects, templates.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Best tech support people packing boxes and chasing RMAs. Problem-solving time dies. Returns and parts a mess.",
      branch: "stand-up-sod",
      resolution:
        "Service operations desk owns logistics and closure. Support stays on diagnosis. Response and recovery both improve.",
      log_row: "SOD-v1,split-roles,support-solve,sod-execute,ok",
    },
    teaserBullets: [
      "Split solve vs execute (support vs SOD)",
      "RMA, returns, evals, ticket closure ops",
      "Liaison to sales/ops without burning engineers",
    ],
    pairs: ["mf-tpl-074", "mf-tpl-088", "mf-tpl-101", "mf-tpl-065"],
    tags: ["field-patterns", "rma", "operations", "support-ops"],
    playbook: {
      description:
        "Create a Service Operations Desk (SOD): the post-sales execution arm for RMAs, shipping, returns, evals, ticket closure templates, and part collection so support engineers can focus on problem solving and customer resolution.",
      mindset: {
        principle:
          "If your best solvers are also your shipping clerks, you chose wrong. SOD is traditional RMA done as a real department with a charter.",
        mistakes: [
          {
            id: "eng-ships",
            label: "Support engineers own packing, labels, and return chase",
            cost: "Slow fixes; burnout; lost parts dollars",
          },
          {
            id: "sod-as-dump",
            label: "SOD becomes the new dump for every undefined task",
            cost: "Same chaos, new name",
          },
          {
            id: "no-handoff",
            label: "No clear handoff packet from support to SOD",
            cost: "Wrong parts ship; customer pain doubles",
          },
          {
            id: "status-war",
            label: "SOD treated as lower caste with no metrics",
            cost: "Quality dies; support blames logistics forever",
          },
        ],
      },
      role_split: [
        {
          id: "support",
          label: "Diagnose, troubleshoot, decide disposition, customer technical truth",
        },
        {
          id: "sod",
          label: "Execute RMA/ship/return/eval/closure templates, part collection, logistics liaison",
        },
      ],
      decision_branches: [
        {
          id: "stand-up-sod",
          situation: "Support owns logistics and problem-solve both",
          action: "sod-charter",
        },
        {
          id: "handoff-breaks",
          situation: "Wrong ship or incomplete return packets",
          action: "support-to-sod-handoff",
        },
        {
          id: "scope-creep",
          situation: "Everything random lands on SOD",
          action: "scope-lock",
        },
        {
          id: "measure",
          situation: "Need proof SOD works",
          action: "sod-scorecard",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Charter SOD vs support",
            goal: "Solve vs execute written",
            minutes: "half-day",
          },
          {
            id: 2,
            name: "Define handoff packet",
            goal: "Part, reason, customer, disposition",
            minutes: "60",
          },
          {
            id: 3,
            name: "Templates for closure and returns",
            goal: "Repeatable execution",
            minutes: "ongoing",
          },
          {
            id: 4,
            name: "Score logistics and support free capacity",
            goal: "Both improve",
            minutes: "weekly",
          },
        ],
      },
      tracking: {
        csv_header:
          "week,rmas_opened,rmas_closed,avg_ship_hours,return_rate,support_hours_on_logistics,owner",
        sheet_tab_name: "service_operations_desk",
      },
      related_artifacts: [
        "mf-tpl-074",
        "mf-tpl-088",
        "mf-tpl-101",
        "mf-tpl-065",
      ],
      agent_signal: {
        use_when:
          "Support engineers shipping parts and handling returns instead of solving. Need SOD / RMA execution arm so support focuses on resolution.",
        decision_criteria: [
          "Write solve vs execute split.",
          "Handoff packet required before SOD ships.",
          "SOD has metrics; not a silent dump lane.",
        ],
        operator_context:
          "Field pattern: Service Operations Department built so support stops being the ship desk. Traditional RMA group with a real charter.",
        tags: ["field-patterns", "rma", "operations", "support-ops"],
      },
    },
    templates: [
      {
        id: "sod-charter",
        use_when: "stand-up-sod",
        body: "SOD CHARTER\nName: Service Operations Desk (or local name)\nOwns: RMA ship, returns, evals, closure templates, part collection chase\nDoes not own: technical diagnosis, customer engineering decisions\nSupport owns: problem solve, disposition decision\nLead SOD: _______________  Lead Support: _______________\nStart date: _______",
      },
      {
        id: "support-to-sod-handoff",
        use_when: "handoff-breaks",
        body: "SUPPORT TO SOD HANDOFF\nTicket: _______________  Customer: _______________\nDisposition: ship / return / eval / collect\nPart SKU/qty: _______________\nWhy (one line): _______________\nAddress / RMA auth: _______________\nSupport owner: _______________  SOD owner: _______________\nIncomplete = no ship",
      },
      {
        id: "scope-lock",
        use_when: "scope-creep",
        body: "SOD SCOPE LOCK\nIn: _______________\nOut (send to): _______________\nNew ask process: _______________\nReviewed: weekly with support lead",
      },
      {
        id: "sod-scorecard",
        use_when: "measure",
        body: "SOD SCORECARD\nPeriod: _______\nShip SLA hit %: ___\nReturn close %: ___\nHandoff reject % (incomplete): ___\nSupport hours still on logistics: ___\nNotes: _______________",
      },
      {
        id: "closure-template-index",
        use_when: "stand-up-sod",
        body: "CLOSURE TEMPLATE INDEX\nTemplate | Use when | Owner\nReturn received | | SOD\nEval complete | | SOD\nPart collected | | SOD\nCustomer ship notify | | SOD\n",
      },
    ],
    examples: [
      {
        id: "ex-split-ship",
        context:
          "Support guys shipping parts and handling returns. Needed a group for that work.",
        branch: "stand-up-sod",
        templates_used: ["sod-charter", "support-to-sod-handoff"],
        resolution:
          "SOD as traditional RMA/execution arm. Support back on problems. Both lanes clearer.",
        log_row: "SOD-stand,split,ok",
      },
      {
        id: "ex-handoff",
        context: "Wrong parts shipped; packet incomplete.",
        branch: "handoff-breaks",
        templates_used: ["support-to-sod-handoff", "sod-scorecard"],
        resolution:
          "No ship without complete handoff. Reject rate visible then dropped.",
        log_row: "handoff-required,rejects-down",
      },
      {
        id: "ex-dump",
        context: "Org started tossing random tasks at SOD.",
        branch: "scope-creep",
        templates_used: ["scope-lock"],
        resolution:
          "Scope lock republished. SOD stayed logistics-focused.",
        log_row: "scope-lock,held",
      },
    ],
    agentMd:
      "1. Eng shipping → **sod-charter**.\n2. Always **support-to-sod-handoff** before ship.\n3. Dump risk → **scope-lock**.\n4. Weekly **sod-scorecard**.\n5. Pair **mf-tpl-101** parts recovery; **mf-tpl-088** so engineers stay engineers.",
  },
  {
    id: "mf-tpl-100",
    slug: "services-revenue-center",
    title: "Services Revenue Center Playbook",
    mission:
      "Graduate support from pure cost center to services revenue path: warranty and license renewals, billable work, enforcement, portal value. Foundation of process and metrics first; then charge for real value.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Support only absorbs cost. Renewals ad-hoc. No billable path. Leadership sees a black hole.",
      branch: "revenue-path",
      resolution:
        "Renewal role, billable menu, warranty enforcement, metrics. Services treated as a unit that can earn.",
      log_row: "rev-center-v1,renewals,billable,enforce,ok",
    },
    teaserBullets: [
      "Cost-center foundation then revenue levers",
      "Warranty/license renewals as a program",
      "Billable services menu without breaking trust",
    ],
    pairs: ["mf-tpl-065", "mf-tpl-092", "mf-tpl-087", "mf-tpl-099"],
    tags: ["field-patterns", "revenue", "warranty", "services"],
    playbook: {
      description:
        "Move post-sales support toward a services revenue center: after documentation, process, and metrics exist, add warranty/license renewal programs, billable services, and clear enforcement so value is not only absorbed as cost of doing business.",
      mindset: {
        principle:
          "You cannot price chaos. Build the foundation, then graduate to revenue without turning every call into a shakedown.",
        mistakes: [
          {
            id: "charge-before-process",
            label: "Bill before tickets close and quality exists",
            cost: "Customers pay for pain; churn",
          },
          {
            id: "forever-cost",
            label: "Never productize renewals or billable work",
            cost: "Support stays a black hole in finance eyes",
          },
          {
            id: "ad-hoc-extend",
            label: "Warranty extensions only as favors",
            cost: "No forecast; unfairness; lost revenue",
          },
          {
            id: "all-stick",
            label: "Enforcement without education or value",
            cost: "Brand damage",
          },
        ],
      },
      stages: [
        {
          id: "foundation",
          label: "Docs, process, metrics, closure, portal basics",
        },
        {
          id: "renewals",
          label: "Consistent warranty/license renewal program and owner",
        },
        {
          id: "billable",
          label: "Menu of out-of-warranty and consult services",
        },
        {
          id: "unit",
          label: "Services recognized as a business unit path",
        },
      ],
      decision_branches: [
        {
          id: "readiness",
          situation: "Want revenue but ops still chaotic",
          action: "foundation-gate",
        },
        {
          id: "revenue-path",
          situation: "Foundation solid; need earn path",
          action: "renewal-and-billable-design",
        },
        {
          id: "enforcement",
          situation: "Giveaways killing margin",
          action: "warranty-enforcement-rules",
        },
        {
          id: "finance-story",
          situation: "CFO sees only cost",
          action: "services-unit-brief",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Pass foundation gate",
            goal: "Process and metrics real",
            minutes: "audit",
          },
          {
            id: 2,
            name: "Name renewal owner and pipeline",
            goal: "Not ad-hoc favors",
            minutes: "half-day",
          },
          {
            id: 3,
            name: "Publish billable menu",
            goal: "Clear SKUs and when free vs paid",
            minutes: "half-day",
          },
          {
            id: 4,
            name: "Report services P&L slice monthly",
            goal: "Visible earn + cost",
            minutes: "monthly",
          },
        ],
      },
      tracking: {
        csv_header:
          "period,renewal_revenue,billable_revenue,giveaway_count,support_cost,notes,owner",
        sheet_tab_name: "services_revenue_center",
      },
      related_artifacts: [
        "mf-tpl-065",
        "mf-tpl-092",
        "mf-tpl-087",
        "mf-tpl-099",
      ],
      agent_signal: {
        use_when:
          "Support is only a cost center. Need path to services revenue: renewals, billable work, warranty enforcement after process foundation exists.",
        decision_criteria: [
          "Foundation before aggressive charging.",
          "Renewals are a program with an owner.",
          "Billable menu explicit; free vs paid rules written.",
        ],
        operator_context:
          "Field pattern: graduate service/support from cost center foundation to revenue center (renewals, billable, enforcement). Generic naming only.",
        tags: ["field-patterns", "revenue", "warranty", "services"],
      },
    },
    templates: [
      {
        id: "foundation-gate",
        use_when: "readiness",
        body: "FOUNDATION GATE (before revenue push)\n[ ] Ticket closure discipline\n[ ] RMA/SOD path clear\n[ ] Core metrics monthly\n[ ] Basic portal or KB for self-serve\nFail any = fix ops first\nSigner: _______________  Date: _______",
      },
      {
        id: "renewal-and-billable-design",
        use_when: "revenue-path",
        body: "RENEWAL + BILLABLE DESIGN\nRenewal owner role: _______________\nWarranty/license pipeline source: _______________\nBillable menu items: 1 ___ 2 ___ 3 ___\nWhen still free (goodwill rules): _______________\nSales handoff: _______________",
      },
      {
        id: "warranty-enforcement-rules",
        use_when: "enforcement",
        body: "WARRANTY ENFORCEMENT RULES\nCovered: _______________\nNot covered / billable: _______________\nWho may grant exception: _______________\nLog every exception: Y\nCustomer-safe wording: _______________",
      },
      {
        id: "services-unit-brief",
        use_when: "finance-story",
        body: "SERVICES UNIT BRIEF (finance)\nPeriod: _______\nCost of support: ___\nRenewal revenue: ___\nBillable revenue: ___\nParts recovered (see mf-tpl-101): ___\nAsk: treat as services path not pure cost sink\nNarrative: _______________",
      },
      {
        id: "renewal-pipeline-row",
        use_when: "revenue-path",
        body: "RENEWAL PIPELINE ROW\nAccount: _______________  Expire: _______\nProduct/ entitlement: _______________\nOwner: _______________  Stage: _______________\n$ : ___  Outcome: _______________",
      },
    ],
    examples: [
      {
        id: "ex-renewal-role",
        context:
          "Ad-hoc warranty extensions. Built consistent renewal ownership and tracking.",
        branch: "revenue-path",
        templates_used: ["renewal-and-billable-design", "renewal-pipeline-row"],
        resolution:
          "Renewals predictable. Support still solves; commercial path clear.",
        log_row: "renewal-role,pipeline,ok",
      },
      {
        id: "ex-gate",
        context: "Push to bill before process existed.",
        branch: "readiness",
        templates_used: ["foundation-gate"],
        resolution:
          "Gate failed. Fixed SOD and closure first, then revenue design.",
        log_row: "gate-fail,fix-ops,then-rev",
      },
      {
        id: "ex-finance",
        context: "Finance saw only headcount cost.",
        branch: "finance-story",
        templates_used: ["services-unit-brief"],
        resolution:
          "Renewal and billable slice shown. Conversation shifted to services unit.",
        log_row: "brief,cfo,path",
      },
    ],
    agentMd:
      "1. **foundation-gate** before charging hard.\n2. **renewal-and-billable-design** + **renewal-pipeline-row**.\n3. Giveaways → **warranty-enforcement-rules**.\n4. Finance → **services-unit-brief**.\n5. Pair **mf-tpl-065** unit economics; **mf-tpl-099** SOD; **mf-tpl-092** education.",
  },
  {
    id: "mf-tpl-101",
    slug: "parts-recovery-program",
    title: "Parts Recovery Program Playbook",
    mission:
      "Stop writing off unreturned parts as cost of doing business. Program for collection, return discipline, and recovered value that can fund ops (including SOD growth).",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Parts ship; many never return. Finance expenses them. Six figures of recoverable hardware ignored.",
      branch: "stand-up-recovery",
      resolution:
        "Chase process, aging buckets, owner. Recovered value tracked; funds ops capacity.",
      log_row: "recovery-v1,aging,chase,recovered-up",
    },
    teaserBullets: [
      "Aging buckets for open returns",
      "Chase roles SOD + support disposition",
      "Recovered value metric not tribal shrug",
    ],
    pairs: ["mf-tpl-099", "mf-tpl-074", "mf-tpl-065", "mf-tpl-100"],
    tags: ["field-patterns", "rma", "parts", "recovery"],
    playbook: {
      description:
        "Run a parts recovery program: track shipped-not-returned material, age it, chase with clear owners, and report recovered value instead of silent write-off.",
      mindset: {
        principle:
          "Unreturned parts are not weather. They are a process with dollars attached.",
        mistakes: [
          {
            id: "expense-default",
            label: "Auto-expense everything not returned",
            cost: "No incentive to chase; cash left on table",
          },
          {
            id: "no-aging",
            label: "No age buckets on open returns",
            cost: "Forever-open ghosts",
          },
          {
            id: "support-only-chase",
            label: "Only engineers chase logistics",
            cost: "Wrong role; weak recovery",
          },
          {
            id: "no-report",
            label: "Never show recovered dollars",
            cost: "Program dies; finance unconvinced",
          },
        ],
      },
      decision_branches: [
        {
          id: "stand-up-recovery",
          situation: "Parts not returned routinely written off",
          action: "recovery-charter",
        },
        {
          id: "aging-hot",
          situation: "Open returns aging past threshold",
          action: "chase-ladder",
        },
        {
          id: "customer-block",
          situation: "Customer will not return",
          action: "escalation-or-bill",
        },
        {
          id: "report",
          situation: "Need program proof",
          action: "recovered-value-report",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Inventory open shipped-not-returned",
            goal: "See the hole",
            minutes: "half-day",
          },
          {
            id: 2,
            name: "Age and assign chase owner",
            goal: "Usually SOD",
            minutes: "weekly",
          },
          {
            id: 3,
            name: "Ladder: remind, escalate, bill/write-off rules",
            goal: "Consistent",
            minutes: "ongoing",
          },
          {
            id: 4,
            name: "Report recovered value",
            goal: "Fund narrative",
            minutes: "monthly",
          },
        ],
      },
      tracking: {
        csv_header:
          "period,open_returns_value,recovered_value,writeoff_value,avg_days_open,owner",
        sheet_tab_name: "parts_recovery_program",
      },
      related_artifacts: [
        "mf-tpl-099",
        "mf-tpl-074",
        "mf-tpl-065",
        "mf-tpl-100",
      ],
      agent_signal: {
        use_when:
          "Shipped parts not returned and written off. Need recovery program with aging, chase ladder, and recovered value reporting. Often pairs with SOD.",
        decision_criteria: [
          "Age every open return.",
          "SOD (or logistics) owns chase; support owns disposition truth.",
          "Report recovered dollars monthly.",
        ],
        operator_context:
          "Field pattern: parts previously written off recovered at scale; funds ops growth. Program not a shrug.",
        tags: ["field-patterns", "rma", "parts", "recovery"],
      },
    },
    templates: [
      {
        id: "recovery-charter",
        use_when: "stand-up-recovery",
        body: "PARTS RECOVERY CHARTER\nOwner (usually SOD): _______________\nSupport role: confirm disposition / exceptions\nAge buckets: 0-15 / 16-30 / 31-60 / 60+\nWrite-off only after: _______________\nReport cadence: monthly",
      },
      {
        id: "chase-ladder",
        use_when: "aging-hot",
        body: "CHASE LADDER\nReturn ID: _______________  Age days: ___\nDay 7: remind _______________\nDay 15: escalate customer contact _______________\nDay 30: sales/account assist _______________\nDay 45+: bill or formal write-off path _______________\nStatus: _______________",
      },
      {
        id: "escalation-or-bill",
        use_when: "customer-block",
        body: "ESCALATION OR BILL\nAccount: _______________  Part value: ___\nBlock reason: _______________\nOptions: [ ] onsite collect  [ ] bill  [ ] trade  [ ] write-off with approver\nApprover: _______________  Date: _______",
      },
      {
        id: "recovered-value-report",
        use_when: "report",
        body: "RECOVERED VALUE REPORT\nPeriod: _______\nRecovered $: ___\nStill open $: ___\nWrite-off $: ___\nTop delay accounts: _______________\nFunds applied to: _______________",
      },
      {
        id: "open-returns-aging",
        use_when: "stand-up-recovery",
        body: "OPEN RETURNS AGING\nBucket | Count | Value\n0-15 | | \n16-30 | | \n31-60 | | \n60+ | | \nOwner actions this week: _______________",
      },
    ],
    examples: [
      {
        id: "ex-writeoff-stop",
        context:
          "Parts not returned were expensed. Program recovered large value previously written off.",
        branch: "stand-up-recovery",
        templates_used: ["recovery-charter", "open-returns-aging", "recovered-value-report"],
        resolution:
          "Chase owned by ops desk. Recovered dollars visible; funded capacity.",
        log_row: "recovery-on,aging,recovered,ok",
      },
      {
        id: "ex-ladder",
        context: "Open returns sat 90 days with one email.",
        branch: "aging-hot",
        templates_used: ["chase-ladder"],
        resolution:
          "Ladder forced next steps. Aging down.",
        log_row: "ladder,aging-down",
      },
      {
        id: "ex-bill",
        context: "Customer refused return of high-value part.",
        branch: "customer-block",
        templates_used: ["escalation-or-bill"],
        resolution:
          "Billed per policy. Precedent set.",
        log_row: "bill-path,policy,ok",
      },
    ],
    agentMd:
      "1. Write-offs by default → **recovery-charter** + **open-returns-aging**.\n2. Hot age → **chase-ladder**.\n3. Refuse return → **escalation-or-bill**.\n4. Monthly **recovered-value-report**.\n5. Pair **mf-tpl-099** SOD; **mf-tpl-100** if recovered funds support services narrative.",
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
</div></body></html>`;
}
function fullHtml(p) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex">
<meta name="x402:artifact" content="${p.id}"><meta name="x402:full" content="true">
<meta name="x402:primary" content="playbook.json"><title>${p.id}</title>
<style>body{margin:0;padding:1.25rem;font-family:ui-monospace,monospace;background:#0c0c0e;color:#c8c8d0;font-size:13px}a{color:#5eb3ff}</style>
</head><body><h1>${p.id} · ${p.title}</h1>
<ul><li><a href="playbook.json">playbook.json</a></li><li><a href="templates.json">templates.json</a></li>
<li><a href="examples.json">examples.json</a></li><li><a href="AGENT.md">AGENT.md</a></li></ul>
</body></html>`;
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
      not_for: "Generic job spine. Not legal tax advice on write-offs.",
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
  fs.writeFileSync(path.join(base, "index.html"), teaserHtml(p));
  fs.writeFileSync(path.join(full, "index.html"), fullHtml(p));
  console.log("wrote", p.id);
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
    not_for: "Generic job spine. Not legal tax advice on write-offs.",
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
if (!indexHtml.includes("mf-tpl-099")) {
  indexHtml = indexHtml.replace(
    /(<p><strong>Field batch 073-092:<\/strong>[^<]+<\/p>)/,
    `$1\n      <p><strong>101 set:</strong> mf-tpl-099 SOD · 100 services revenue center · 101 parts recovery.</p>`
  );
}
fs.writeFileSync(path.join(MF, "index.html"), indexHtml);

let worker = fs.readFileSync(path.join(ROOT, "worker", "index.ts"), "utf8");
for (const p of PACKS) {
  if (worker.includes(`/templates/${p.slug}/full`)) continue;
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
console.log("done 099-101");
