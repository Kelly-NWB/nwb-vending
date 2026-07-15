#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const DISCLAIMER = {
  scope:
    "Documentation and organizational patterns from field experience. Not legal advice.",
  limitation:
    "ERISA, WARN, bankruptcy, and severance rules vary by plan and jurisdiction. Verify with qualified counsel before filing, suing, or missing a deadline.",
  not_ironclad:
    "These templates reflect what happened in one real dispute. They are not a guarantee of outcome or a substitute for a lawyer.",
  agent_note:
    "Use packs to organize evidence and timelines. Route legal strategy and filings to licensed counsel.",
};

const PACKS = [
  {
    id: "mf-tpl-068",
    slug: "severance-agreement-trail",
    title: "Severance Agreement Trail Playbook",
    mission:
      "Document sign, consideration window, first payment, and cut notice. Chain of record when payments stop.",
    lane: "workplace-exit",
    teaserExample: {
      context: "Signed severance after layoff. First check arrived. Second did not.",
      branch: "payment-stopped",
      resolution: "Trail binder built. Dates and notices organized for counsel review.",
      log_row: "2008-10-17,first-check,Y,2008-11-xx,cut-notice,logged",
    },
    teaserBullets: [
      "Consideration window tracker (plan-specific dates)",
      "First payment and cut-notice log",
      "Disclaimer: not legal advice",
    ],
    pairs: ["mf-tpl-069", "mf-tpl-070", "mf-tpl-057"],
    tags: ["workplace-exit", "field-patterns", "severance"],
    playbook: {
      description:
        "Track severance from offer through consideration period, signature, first payment, and any stop or reduction notice.",
      disclaimer: DISCLAIMER,
      mindset: {
        principle:
          "Severance fights are won on dates and documents, not feelings. Build the trail while memory is fresh.",
        mistakes: [
          {
            id: "sign-without-copy",
            label: "Sign without keeping plan doc and your signed copy",
            cost: "Cannot prove what you agreed to",
          },
          {
            id: "miss-window",
            label: "Miss consideration or return window",
            cost: "Plan may claim forfeiture",
          },
          {
            id: "no-first-check-record",
            label: "No record of first payment date or amount",
            cost: "Harder to prove partial performance then cut",
          },
        ],
      },
      timeline_fields: [
        "layoff_notice_date",
        "offer_date",
        "consideration_start",
        "consideration_end",
        "signed_returned_date",
        "first_payment_date",
        "cut_or_stop_notice_date",
      ],
      decision_branches: [
        { id: "offer-received", situation: "Severance offer after separation", action: "open-trail" },
        { id: "in-consideration", situation: "Inside waiting period before sign", action: "consideration-tracker" },
        { id: "signed-returned", situation: "Agreement signed and returned", action: "lock-trail-row" },
        { id: "payment-stopped", situation: "Payments stop or reduce", action: "cut-notice-log" },
      ],
      related_artifacts: ["mf-tpl-069", "mf-tpl-070", "mf-tpl-057", "mf-tpl-056"],
      agent_signal: {
        use_when:
          "Severance offered then payments stop or reduce. Need dated document chain. Not sure what was promised vs paid.",
        decision_criteria: [
          "Log every date: offer, window, sign, first check, cut notice.",
          "Keep copies of plan language and your signed return.",
          "Organize for counsel; do not treat pack as legal strategy.",
        ],
        operator_context:
          "Workplace Exit lane: field pattern from a real severance cut, scrubbed. Bonus aisle, not support ops.",
        tags: ["workplace-exit", "field-patterns", "severance"],
      },
    },
    templates: [
      {
        id: "open-trail",
        use_when: "offer-received",
        body: "SEVERANCE TRAIL (start)\nEmployee ref: _______________  Plan name: _______________\nLayoff notice date: _______  Offer date: _______\nConsideration window: from _______ to _______\n[ ] Plan doc saved  [ ] Offer letter saved\nDisclaimer: organizational only, not legal advice.",
      },
      {
        id: "consideration-tracker",
        use_when: "in-consideration",
        body: "CONSIDERATION WINDOW\nEarliest return allowed: _______  Deadline: _______\nToday: _______  Action: [ ] still reviewing  [ ] counsel consult  [ ] ready to sign\nNotes (facts only): _______________",
      },
      {
        id: "lock-trail-row",
        use_when: "signed-returned",
        body: "SIGNED AND RETURNED\nDate returned: _______  Method: _______________\n[ ] Copy of signed agreement filed\nPromised schedule (from plan): _______________\nFirst payment due (per plan): _______",
      },
      {
        id: "cut-notice-log",
        use_when: "payment-stopped",
        body: "PAYMENT STOP OR CUT\nFirst payment received: Y/N  Date: _______  Amount: $_______\nStop or cut notice date: _______  Source: _______________\nAttach: notice copy, check images, bank record\nNext: mf-tpl-069 payment log + counsel review",
      },
    ],
    examples: [
      {
        id: "ex-first-then-stop",
        context: "First severance check cleared. Second month nothing.",
        branch: "payment-stopped",
        templates_used: ["cut-notice-log", "lock-trail-row"],
        resolution: "Trail dates locked. Payment log started. Counsel engaged.",
        log_row: "first-check-ok,second-missing,trail-complete",
      },
    ],
    agentMd:
      "1. Offer → **open-trail**.\n2. Waiting period → **consideration-tracker**.\n3. Signed → **lock-trail-row**.\n4. Stop → **cut-notice-log** + mf-tpl-069.\n5. **Disclaimer:** organize facts; counsel decides strategy.",
  },
  {
    id: "mf-tpl-069",
    slug: "severance-payment-log",
    title: "Severance Payment Log Playbook",
    mission:
      "Promised vs paid vs owed. Simple ledger when the plan pays partial then stops.",
    lane: "workplace-exit",
    teaserExample: {
      context: "Plan promised installments. One partial check. Balance disputed.",
      branch: "ledger-gap",
      resolution: "Payment log showed gap. Attached to evidence binder.",
      log_row: "promised-20k,paid-1x-partial,owed-logged",
    },
    teaserBullets: [
      "Promised / paid / owed columns",
      "Check and deposit evidence rows",
      "Pairs with agreement trail and ERISA binder",
    ],
    pairs: ["mf-tpl-068", "mf-tpl-070", "mf-tpl-071"],
    tags: ["workplace-exit", "field-patterns", "severance"],
    playbook: {
      description:
        "Ledger: what the plan promised, each payment received, running balance owed. Evidence row per check.",
      disclaimer: DISCLAIMER,
      decision_branches: [
        { id: "start-ledger", situation: "Any payment received or promised", action: "payment-log-row" },
        { id: "ledger-gap", situation: "Paid less than schedule", action: "gap-memo" },
        { id: "plan-restatement", situation: "Plan sends amended schedule", action: "restatement-row" },
      ],
      tracking: {
        csv_header: "date,type,promised_amt,paid_amt,running_owed,evidence_ref,notes",
        sheet_tab_name: "severance_payment_log",
      },
      related_artifacts: ["mf-tpl-068", "mf-tpl-070", "mf-tpl-071"],
      agent_signal: {
        use_when:
          "Severance installments promised but partial pay or stop. Need owed balance on paper.",
        decision_criteria: [
          "One row per promised installment and per check received.",
          "Attach evidence ref per payment (check image, deposit).",
          "Do not infer legal damages; log facts only.",
        ],
        operator_context: "Field pattern ledger. Counsel calculates claims.",
        tags: ["workplace-exit", "field-patterns", "severance"],
      },
    },
    templates: [
      {
        id: "payment-log-row",
        use_when: "start-ledger",
        body: "SEVERANCE PAYMENT LOG\nPeriod: _______________\nPromised (per plan): $_______  Schedule: _______________\n\nDate | Promised | Paid | Owed | Evidence\n_____|__________|______|______|___________\nDisclaimer: factual ledger only.",
      },
      {
        id: "gap-memo",
        use_when: "ledger-gap",
        body: "PAYMENT GAP MEMO\nAs of date: _______\nPromised to date: $_______  Received to date: $_______  Gap: $_______\nFacts only (no legal conclusion): _______________",
      },
      {
        id: "restatement-row",
        use_when: "plan-restatement",
        body: "PLAN RESTATEMENT ROW\nOld schedule: _______________  New schedule: _______________\nEffective date: _______  [ ] saved copy of restatement\nImpact on owed balance (factual): _______________",
      },
    ],
    examples: [
      {
        id: "ex-partial-installment",
        context: "One check for half of one installment. Silence after.",
        branch: "ledger-gap",
        templates_used: ["payment-log-row", "gap-memo"],
        resolution: "Gap documented. Fed into ERISA binder.",
        log_row: "partial-1x,gap-19k-factual",
      },
    ],
    agentMd:
      "1. **payment-log-row** from first promise.\n2. Short pay → **gap-memo**.\n3. Plan changes → **restatement-row**.\n4. Pair **mf-tpl-070** for counsel packet.",
  },
  {
    id: "mf-tpl-070",
    slug: "erisa-evidence-binder",
    title: "ERISA Evidence Binder Playbook",
    mission:
      "Organize plan docs, notices, checks, and timeline for employee benefits dispute review. Not legal advice.",
    lane: "workplace-exit",
    teaserExample: {
      context: "Multiple ex-employees same severance cut pattern. Counsel needs one binder format.",
      branch: "binder-assembly",
      resolution: "Tabbed evidence set. Facts separated from strategy.",
      log_row: "tabs-plan,notices,payments,timeline,correspondence",
    },
    teaserBullets: [
      "Tab list for ERISA-style evidence set",
      "Facts vs strategy separation",
      "Explicit not-legal-advice disclaimer",
    ],
    pairs: ["mf-tpl-068", "mf-tpl-069", "mf-tpl-071"],
    tags: ["workplace-exit", "field-patterns", "erisa-adjacent"],
    playbook: {
      description:
        "Assemble tabbed evidence: plan, SPD/summary, offer, signed release, payments, cut notices, correspondence. For counsel review.",
      disclaimer: {
        ...DISCLAIMER,
        limitation:
          DISCLAIMER.limitation +
          " ERISA claims have deadlines; this pack does not compute limitations periods.",
      },
      binder_tabs: [
        "plan_and_summary",
        "severance_offer_and_agreement",
        "payment_records",
        "stop_or_cut_notices",
        "warn_or_layoff_notices",
        "correspondence_with_plan_admin",
        "timeline_one_pager",
      ],
      decision_branches: [
        { id: "binder-start", situation: "Considering counsel or plan appeal", action: "binder-checklist" },
        { id: "binder-assembly", situation: "Documents scattered", action: "tab-assembly" },
        { id: "group-pattern", situation: "Multiple employees same cut", action: "pattern-matrix" },
      ],
      related_artifacts: ["mf-tpl-068", "mf-tpl-069", "mf-tpl-071", "mf-tpl-072"],
      agent_signal: {
        use_when:
          "Employee benefits or severance plan dispute. Need organized evidence for lawyer or plan appeal. Not DIY lawsuit pack.",
        decision_criteria: [
          "Separate facts binder from legal strategy notes.",
          "Include timeline one-pager.",
          "Never skip payment and cut-notice tabs.",
        ],
        operator_context: "Field pattern binder structure. Lawyer fills strategy.",
        tags: ["workplace-exit", "field-patterns", "erisa-adjacent"],
      },
    },
    templates: [
      {
        id: "binder-checklist",
        use_when: "binder-start",
        body: "ERISA EVIDENCE BINDER CHECKLIST\n[ ] Plan document / SPD\n[ ] Severance offer\n[ ] Signed agreement copy\n[ ] Payment log (mf-tpl-069)\n[ ] Cut or stop notices\n[ ] WARN or layoff notice if any\n[ ] Admin correspondence\n[ ] Timeline one-pager\nNOT LEGAL ADVICE. For organization only.",
      },
      {
        id: "tab-assembly",
        use_when: "binder-assembly",
        body: "TAB ASSEMBLY LOG\nTab: _______________  Document: _______________  Date: _______\nSource: _______________  Page count: ___  [ ] redacted for sharing",
      },
      {
        id: "timeline-one-pager",
        use_when: "binder-assembly",
        body: "TIMELINE ONE-PAGER (facts only)\nDate | Event | Source doc\n_____|_______|____________\n_____|_______|____________\nPrepared for: counsel review  Not a legal filing.",
      },
      {
        id: "pattern-matrix",
        use_when: "group-pattern",
        body: "GROUP PATTERN MATRIX (scrub names for external use)\nRef | Same cut? | Same plan language? | Payment stop month\n____|___________|_____________________|___________________\nUse for pattern only; each claimant needs own binder.",
      },
    ],
    examples: [
      {
        id: "ex-counsel-handoff",
        context: "Lawyer asked for everything in one place.",
        branch: "binder-assembly",
        templates_used: ["binder-checklist", "timeline-one-pager"],
        resolution: "Binder tabs complete. Strategy left to counsel.",
        log_row: "binder-ready,strategy-external",
      },
    ],
    agentMd:
      "1. **binder-checklist** first.\n2. **tab-assembly** per document.\n3. **timeline-one-pager** before any call with counsel.\n4. Group cases → **pattern-matrix** (scrub PII).\n5. Pack is organization only.",
  },
  {
    id: "mf-tpl-071",
    slug: "bankruptcy-employee-creditor",
    title: "Bankruptcy Employee Creditor Playbook",
    mission:
      "When employer enters bankruptcy: proof of claim, unsecured queue reality, document what you are owed. Not legal advice.",
    lane: "workplace-exit",
    teaserExample: {
      context: "Judgment or severance owed. Company files Chapter 11.",
      branch: "proof-of-claim",
      resolution: "Claim form filed. Claim amount tied to payment log.",
      log_row: "ch11-filed,claim-submitted,amount-from-069",
    },
    teaserBullets: [
      "Proof of claim prep checklist",
      "Unsecured vs admin expense reality (pattern)",
      "Disclaimer: outcomes not guaranteed",
    ],
    pairs: ["mf-tpl-069", "mf-tpl-070", "mf-tpl-072"],
    tags: ["workplace-exit", "field-patterns", "bankruptcy-adjacent"],
    playbook: {
      description:
        "Document unsecured employee claim in bankruptcy: amount, basis, attachments. Understand you may be last in line.",
      disclaimer: DISCLAIMER,
      mindset: {
        principle:
          "Bankruptcy reshuffles who gets paid. Document the claim; expect pennies on the dollar unless counsel says otherwise.",
        mistakes: [
          {
            id: "miss-claim-deadline",
            label: "Miss proof of claim deadline",
            cost: "May lose unsecured recovery entirely",
          },
          {
            id: "no-amount-support",
            label: "Claim amount without payment log",
            cost: "Claim challenged or reduced",
          },
        ],
      },
      decision_branches: [
        { id: "bk-filed", situation: "Employer bankruptcy petition filed", action: "claim-prep-checklist" },
        { id: "proof-of-claim", situation: "Filing claim form", action: "claim-amount-worksheet" },
        { id: "admin-vs-unsecured", situation: "Insiders paid as admin expense", action: "queue-reality-memo" },
      ],
      related_artifacts: ["mf-tpl-069", "mf-tpl-070", "mf-tpl-072"],
      agent_signal: {
        use_when:
          "Dead or bankrupt employer. Severance or judgment owed. Proof of claim deadline approaching.",
        decision_criteria: [
          "Claim amount must tie to mf-tpl-069 log.",
          "Calendar court claim deadline immediately.",
          "Do not assume same treatment as executive admin claims.",
        ],
        operator_context: "Field pattern from company death. Not bankruptcy legal advice.",
        tags: ["workplace-exit", "field-patterns", "bankruptcy-adjacent"],
      },
    },
    templates: [
      {
        id: "claim-prep-checklist",
        use_when: "bk-filed",
        body: "BANKRUPTCY CLAIM PREP\nCase name/number: _______________  Chapter: ___\nClaim deadline: _______  [ ] calendar alert set\nAttach: payment log, severance trail, judgment if any\nNOT LEGAL ADVICE. Counsel reviews before file.",
      },
      {
        id: "claim-amount-worksheet",
        use_when: "proof-of-claim",
        body: "CLAIM AMOUNT WORKSHEET (factual)\nTotal promised per plan: $_______\nTotal paid: $_______  Owed (factual): $_______\nBasis: severance plan / agreement tab ___\nSupporting exhibits: _______________",
      },
      {
        id: "queue-reality-memo",
        use_when: "admin-vs-unsecured",
        body: "QUEUE REALITY MEMO (pattern note)\nYour claim class: unsecured employee / severance\nObserved: admin or insider motions may pay first\nImplication: discuss recovery expectations with counsel only\nFacts to track: _______________",
      },
    ],
    examples: [
      {
        id: "ex-ch11-claim",
        context: "Chapter 11 filed after severance stop.",
        branch: "proof-of-claim",
        templates_used: ["claim-prep-checklist", "claim-amount-worksheet"],
        resolution: "Claim filed with log attached. Recovery uncertain.",
        log_row: "claim-filed,unsecured,expectations-counsel",
      },
    ],
    agentMd:
      "1. BK filed → **claim-prep-checklist** + deadline.\n2. **claim-amount-worksheet** from mf-tpl-069.\n3. Insider pay news → **queue-reality-memo** (pattern, not vendetta).\n4. Pair **mf-tpl-072** if judgment already entered.",
  },
  {
    id: "mf-tpl-072",
    slug: "post-judgment-dead-debtor",
    title: "Post-Judgment Dead Debtor Playbook",
    mission:
      "Won on paper, company dead or broke: writ, costs taxation, fee docs. Organize collection attempts without promising payment.",
    lane: "workplace-exit",
    teaserExample: {
      context: "Judgment entered. Employer insolvent. Collection motions filed.",
      branch: "writ-execution",
      resolution: "Costs and writ docs organized. Recovery still zero. Trail complete.",
      log_row: "judgment-yes,paid-no,writ-filed",
    },
    teaserBullets: [
      "Post-judgment document chain",
      "Writ and taxation of costs checklist",
      "Won but unpaid pattern (not ironclad)",
    ],
    pairs: ["mf-tpl-071", "mf-tpl-070", "mf-tpl-069"],
    tags: ["workplace-exit", "field-patterns", "collections-adjacent"],
    playbook: {
      description:
        "After judgment: track writ of execution, taxation of costs, fee petitions. Honest pattern when debtor has no assets.",
      disclaimer: DISCLAIMER,
      mindset: {
        principle:
          "Judgment is a piece of paper until someone collectible exists. Document the try anyway.",
        mistakes: [
          {
            id: "assume-judgment-cash",
            label: "Assume judgment equals payment",
            cost: "No collection trail when assets appear later",
          },
          {
            id: "skip-costs-tax",
            label: "Skip taxation of costs documentation",
            cost: "Leave recoverable costs on table if estate pays",
          },
        ],
      },
      decision_branches: [
        { id: "judgment-entered", situation: "Court enters judgment", action: "post-judgment-log" },
        { id: "writ-execution", situation: "Seeking writ or levy", action: "writ-checklist" },
        { id: "costs-and-fees", situation: "Taxable costs or fee petitions", action: "costs-petition-row" },
        { id: "dead-debtor", situation: "No assets, BK, or pennies", action: "closure-memo" },
      ],
      related_artifacts: ["mf-tpl-071", "mf-tpl-070", "mf-tpl-069"],
      agent_signal: {
        use_when:
          "Judgment won but employer bankrupt or insolvent. Writ or costs docs in play. Need organized trail.",
        decision_criteria: [
          "Log every post-judgment filing with date.",
          "Separate taxable costs from fantasy recovery.",
          "Closure memo when debtor truly dead.",
        ],
        operator_context: "Field pattern: won, never paid. Documentation closure.",
        tags: ["workplace-exit", "field-patterns", "collections-adjacent"],
      },
    },
    templates: [
      {
        id: "post-judgment-log",
        use_when: "judgment-entered",
        body: "POST-JUDGMENT LOG\nJudgment date: _______  Amount: $_______  Court: _______________\nDebtor status: [ ] operating [ ] BK [ ] dead\nNext step owner: counsel  Not legal advice.",
      },
      {
        id: "writ-checklist",
        use_when: "writ-execution",
        body: "WRIT / EXECUTION CHECKLIST\n[ ] Writ application prepared by counsel\n[ ] Service dates logged\n[ ] Asset search results (if any): _______________\nResult to date: _______________",
      },
      {
        id: "costs-petition-row",
        use_when: "costs-and-fees",
        body: "COSTS / FEES ROW\nFiling: _______________  Date: _______\nTaxable costs claimed: $_______  Status: _______________\nAttach: certificate of counsel, fee schedule",
      },
      {
        id: "closure-memo",
        use_when: "dead-debtor",
        body: "CLOSURE MEMO (facts)\nJudgment: Y/N  Collected: $_______\nBK discharge or dead debtor: _______________\nTrail complete: Y/N  Archive location: _______________\nNo outcome guarantee implied.",
      },
    ],
    examples: [
      {
        id: "ex-won-never-paid",
        context: "ERISA judgment. Company in BK. Writ filed. Zero distribution.",
        branch: "dead-debtor",
        templates_used: ["post-judgment-log", "writ-checklist", "closure-memo"],
        resolution: "Trail documented. Recovery none. Binder closed.",
        log_row: "judgment-ok,paid-0,trail-closed",
      },
    ],
    agentMd:
      "1. Judgment → **post-judgment-log**.\n2. Collection → **writ-checklist**.\n3. Costs → **costs-petition-row**.\n4. No assets → **closure-memo**.\n5. Won on paper, unpaid in bank: common pattern, not promise.",
  },
];

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

const SLUG_LOOKUP = Object.fromEntries(PACKS.map((p) => [p.id, p.slug]));
function slugFromPair(id) {
  return SLUG_LOOKUP[id] || id;
}

function teaserHtml(p) {
  const ex = JSON.stringify(p.teaserExample, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${p.id} teaser. ${p.mission.slice(0, 100)} Not legal advice.">
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
      <p class="sub">ENTRY: ${p.id} · LANE: ${p.lane} · field patterns · not legal advice</p>
      <p class="mission">${p.mission}</p>
    </header>
    <section class="block">
      <p class="meta"><strong>Disclaimer:</strong> Documentation patterns from field experience. Not legal advice. Not a guarantee of outcome. Verify with qualified counsel.</p>
    </section>
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
        <dt>LANE</dt>
        <dd>workplace-exit · bonus patterns</dd>
        <dt>PAIRS</dt>
        <dd>${p.pairs.map((x) => `<a href="../${slugFromPair(x)}/">${x}</a>`).join(" · ")}</dd>
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
  <p>Lane: workplace-exit · Not legal advice</p>
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
  const d = p.playbook.disclaimer;
  return `# ${p.id} · ${p.title} · Agent guide

**Lane:** workplace-exit (field patterns, bonus aisle)

**Audience:** agents. ${p.mission}

## Disclaimer

- **Scope:** ${d.scope}
- **Limitation:** ${d.limitation}
- **Not ironclad:** ${d.not_ironclad}

## Fetch order

1. \`playbook.json\`
2. \`templates.json\`
3. \`examples.json\`

## Apply

${p.agentMd}

## Agent signal (v1.2)

- **Use when:** ${sig.use_when}
- **Pairs with:** ${p.playbook.related_artifacts.slice(0, 4).join(", ")}
- **Trigger phrases:** "Need playbook: ${p.title}"; severance documentation pattern
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
      not_for:
        "Legal advice, filing strategy, or substitute for counsel. Not support-ops backbone packs.",
      pairs_with: p.playbook.related_artifacts.slice(0, 4),
      trigger_phrases: [
        `Need playbook: ${p.title}`,
        p.playbook.agent_signal.use_when.slice(0, 70),
      ],
    },
  };

  writeJson(path.join(full, "playbook.json"), playbook);
  writeJson(path.join(full, "templates.json"), {
    artifact: p.id,
    version: "1.2.0",
    disclaimer: DISCLAIMER.scope,
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

manifest.pack_lanes = {
  job_spine: "Small-business job lifecycle templates and tools",
  support_backbone: "Support ops metrics, queues, forecast (061-067)",
  field_patterns:
    "Field patterns from real work: people ops, returns, bridge, workplace exit. Not legal advice.",
  workplace_exit: "Severance and benefits documentation patterns (068-072). Bonus aisle.",
};

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
  apply: "document → log → binder (not legal advice)",
  description: p.playbook.agent_signal.use_when.slice(0, 120),
  tags: p.tags,
  use_when: p.playbook.agent_signal.use_when,
  not_for:
    "Legal advice, filing strategy, or substitute for counsel. Not support-ops backbone packs.",
  pairs_with: p.playbook.related_artifacts.slice(0, 4),
  trigger_phrases: [
    `Need playbook: ${p.title}`,
    p.playbook.agent_signal.use_when.slice(0, 80),
  ],
  agent_signal_version: "1.2",
  disclaimer: DISCLAIMER.scope,
}));

const existingIds = new Set(manifest.entries.map((e) => e.id));
for (const e of newEntries) {
  if (!existingIds.has(e.id)) manifest.entries.push(e);
}
manifest.entry_count = manifest.entries.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

const indexPath = path.join(MF, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");
if (!indexHtml.includes('id="mf-tpl-068"')) {
  const articles = PACKS.map(
    (p) =>
      `<article class="entry" id="${p.id}"><p class="entry-id">ENTRY: ${p.id} · workplace-exit</p><h3>${p.title}</h3><dl class="kv"><dt>TEASER</dt><dd><a href="templates/${p.slug}/">${p.slug}/</a></dd><dt>FULL</dt><dd><a href="templates/${p.slug}/full/">full/</a> · $0.08</dd></dl></article>`
  ).join("\n");
  indexHtml = indexHtml.replace(
    "    </section>\n    <footer class=\"foot\">",
    articles + "\n    </section>\n    <footer class=\"foot\">"
  );
  fs.writeFileSync(indexPath, indexHtml);
}

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

console.log("manifest entry_count:", manifest.entry_count);