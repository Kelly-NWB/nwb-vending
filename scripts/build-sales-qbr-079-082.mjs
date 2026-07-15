#!/usr/bin/env node
/**
 * Build sales/support + QBR field packs mf-tpl-079..082.
 * Sources: failure cohort truth, solution-fit handoff, Metrics That Matter QBR, sales-support bridge.
 * Complements 060/073-078 NDF cluster. Local only; no push.
 * After: node scripts/generate-openapi.mjs ; node scripts/generate-well-known-x402.mjs ; audit
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const KNOWN_SLUGS = {
  "mf-tpl-001": "complaint-recovery-playbook",
  "mf-tpl-005": "weekly-ops-review",
  "mf-tpl-020": "warranty-support-touch",
  "mf-tpl-060": "return-verification-signal",
  "mf-tpl-061": "support-ops-correlation",
  "mf-tpl-065": "support-unit-economics",
  "mf-tpl-067": "rd-support-bridge",
  "mf-tpl-073": "ndf-metric-gaming",
  "mf-tpl-074": "rma-test-credibility",
  "mf-tpl-075": "account-ndf-healthcheck",
  "mf-tpl-076": "site-process-discovery",
  "mf-tpl-077": "defect-fix-shotgun-relapse",
  "mf-tpl-078": "support-incentive-steering",
  "mf-tpl-079": "failure-cohort-truth",
  "mf-tpl-080": "solution-fit-handoff",
  "mf-tpl-081": "metrics-that-matter-qbr",
  "mf-tpl-082": "sales-support-incident-bridge",
};

const PACKS = [
  {
    id: "mf-tpl-079",
    slug: "failure-cohort-truth",
    title: "Failure Cohort Truth Playbook",
    mission:
      "When sales panics on high fail rates, cut the data by age, ship date, and warranty left before the room explodes. Real fails on EOL gear are not the same story as new product failure.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Sales and SE in support office. Customer says drives fail too often. Aggregate rate looks terrible.",
      branch: "cohort-cut",
      resolution:
        "Fails concentrated on aged in-fleet units near end of warranty. New shippers clean. Firmware path with manufacturer. Narrative corrected.",
      log_row: "2026-W40,ACCT-E,fail-high,EOL-cohort,new-ok,fw-fix",
    },
    teaserBullets: [
      "Cohort cut: age, ship/manuf date, warranty remaining",
      "Cherry-pick detection when sales calms the customer with incomplete data",
      "Vendor fix path without false product panic",
    ],
    pairs: ["mf-tpl-075", "mf-tpl-067", "mf-tpl-060", "mf-tpl-082"],
    tags: ["field-patterns", "sales-support", "failure-analysis", "qbr-data"],
    playbook: {
      description:
        "Cut failure and NDF data into honest cohorts before enterprise panic: population age, ship date, warranty window, new vs installed base. Stop cherry-picked aggregates from driving the wrong fix and dumping cost on support.",
      mindset: {
        principle:
          "A single failure rate is a weapon. Cohort truth is the defense. Real fails on old gear and clean new gear can live in the same account.",
        mistakes: [
          {
            id: "aggregate-panic",
            label: "Quote one fail % for the whole account with no age cut",
            cost: "Product line blamed; wrong escalation; support owns chaos",
          },
          {
            id: "sales-cherry",
            label: "Sales shows only the slice that eases the customer today",
            cost: "Short-term calm, long-term support cost and bad vendor fights",
          },
          {
            id: "ignore-real-fails",
            label: "Dismiss all fails as NDF politics when silicon is actually dying",
            cost: "EOL fleet burns; customer trust dies for real",
          },
        ],
      },
      cohort_dimensions: [
        "ship_or_install_date_band",
        "manufacture_date_band",
        "warranty_days_remaining",
        "firmware_or_rev",
        "site_or_rack_population",
        "new_ship_vs_installed_base",
      ],
      decision_branches: [
        {
          id: "panic-room",
          situation: "Sales/SE/customer claim abnormal fail rate",
          action: "cohort-cut",
        },
        {
          id: "eol-vs-new",
          situation: "Need to separate aged fleet from current shippers",
          action: "population-split-table",
        },
        {
          id: "vendor-engage",
          situation: "Real fail signature on a defined population",
          action: "manufacturer-evidence-brief",
        },
        {
          id: "narrative-correct",
          situation: "Cherry-picked story already in market with customer",
          action: "truth-narrative-one-pager",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Freeze the claim",
            goal: "Write the exact fail % and window sales is using",
            minutes: "15",
          },
          {
            id: 2,
            name: "Cut cohorts",
            goal: "Age, ship, warranty, rev",
            minutes: "60-120",
          },
          {
            id: 3,
            name: "Classify",
            goal: "EOL wear vs new-product defect vs process",
            minutes: "30",
          },
          {
            id: 4,
            name: "Path",
            goal: "Vendor fix, replace plan, or process; correct narrative",
            minutes: "ongoing",
          },
        ],
      },
      tracking: {
        csv_header:
          "account,period,cohort,units,fails,fail_pct,ndf_pct,warranty_band,notes,owner",
        sheet_tab_name: "failure_cohort_truth",
      },
      related_artifacts: [
        "mf-tpl-075",
        "mf-tpl-067",
        "mf-tpl-060",
        "mf-tpl-082",
      ],
      agent_signal: {
        use_when:
          "Sales or customer claims high hardware fail rate. Need cohort cuts by age/ship/warranty before product panic. Suspect cherry-picked data easing the customer.",
        decision_criteria: [
          "Never brief execs on a single uncut fail rate.",
          "Split installed-base EOL from new shippers.",
          "Real fails get vendor path; incomplete sales narratives get corrected in writing.",
        ],
        operator_context:
          "Field pattern: enterprise server/storage (and any HW) panic rooms. Same pattern decades apart. Support owns the dig.",
        tags: ["field-patterns", "sales-support", "failure-analysis", "qbr-data"],
      },
    },
    templates: [
      {
        id: "cohort-cut",
        use_when: "panic-room",
        body: "FAILURE COHORT CUT\nAccount: _______________  Period: _______\nClaimed fail % (from sales/customer): ___\n\nCohort | Units | Fails | Fail% | NDF% | Warranty band\nNew shippers | | | | |\nMid-life | | | | |\nNear EOL / OOW edge | | | | |\n\nClassification: [ ] EOL wear  [ ] new defect  [ ] mixed  [ ] process\nOwner: _______________",
      },
      {
        id: "population-split-table",
        use_when: "eol-vs-new",
        body: "POPULATION SPLIT\nSKU/family: _______________\n\nIn fleet (installed): count ___  fail% ___\nShipped last 90d: count ___  fail% ___\nManuf date bands: _______________\nConclusion: _______________",
      },
      {
        id: "manufacturer-evidence-brief",
        use_when: "vendor-engage",
        body: "MANUFACTURER EVIDENCE BRIEF\nFamily/rev: _______________  Cohort: _______________\n\nFail signature: _______________\nSamples/logs: _______________\nAsk: firmware / replace / RMA special\nSupport owner: _______________  Sales informed: Y/N",
      },
      {
        id: "truth-narrative-one-pager",
        use_when: "narrative-correct",
        body: "TRUTH NARRATIVE (internal then customer-ready)\n\nWhat was claimed: _______________\nWhat the cohorts show: _______________\nWhat we are doing: _______________\nWhat we are not claiming: _______________\nWho presents: support / sales / joint",
      },
      {
        id: "panic-room-intake",
        use_when: "panic-room",
        body: "PANIC ROOM INTAKE\nDate: _______  Attendees (roles only): sales, SE, support\nCustomer claim: _______________\nData source used so far: _______________\nSupport dig owner: _______________  Due: _______",
      },
    ],
    examples: [
      {
        id: "ex-eol-drives",
        context:
          "Customer felt drives failed too often. Aggregate high. Dig showed aged in-DC units near end of warranty; new drives clean.",
        branch: "cohort-cut",
        templates_used: ["panic-room-intake", "cohort-cut", "population-split-table"],
        resolution:
          "Manufacturer firmware for affected population. Narrative fixed. Sales still wanted it faster; data held.",
        log_row: "2026-W40,EOL-cohort,new-ok,fw,narrative-ok",
      },
      {
        id: "ex-cherry-sales",
        context:
          "Sales deck used worst site only to justify emergency replace tone.",
        branch: "narrative-correct",
        templates_used: ["truth-narrative-one-pager", "cohort-cut"],
        resolution:
          "Full-account cohort table replaced deck slide. Cost and support load re-estimated honestly.",
        log_row: "2026-W41,cherry-caught,full-cut,ok",
      },
      {
        id: "ex-print-fleet",
        context:
          "Print shop claimed all printers failing. Old generation in field; new installs fine.",
        branch: "eol-vs-new",
        templates_used: ["population-split-table"],
        resolution:
          "Lifecycle replace plan for old gen only. Stopped blanket panic.",
        log_row: "2026-W12,print-genA,eol,plan",
      },
    ],
    agentMd:
      "1. Panic room → **panic-room-intake** then **cohort-cut**.\n2. Split fleet → **population-split-table**.\n3. Real signature → **manufacturer-evidence-brief**.\n4. Bad story already out → **truth-narrative-one-pager**.\n5. Pair **mf-tpl-082** for sales/support politics; **mf-tpl-075** for account health.",
  },
  {
    id: "mf-tpl-080",
    slug: "solution-fit-handoff",
    title: "Solution Fit Handoff Playbook",
    mission:
      "Sales and SE closed a solution that does not match the real use case. Oversold or undersold, marked fine. Support inherits the gap. Gate the handoff before go-live heroics.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Deal closed. Production use case differs from SE design. Support runs weekly vendor bridges to keep the logo alive.",
      branch: "fit-gap-found",
      resolution:
        "Use-case gap log, assumption rewrite, capacity/path change. Support stops being silent cleanup.",
      log_row: "2026-Q3,ACCT-L,oversell-capacity,gap-log,path-fix",
    },
    teaserBullets: [
      "Use-case fit checklist before support owns production",
      "Oversell and undersell detection",
      "Written assumptions SE + support",
    ],
    pairs: ["mf-tpl-082", "mf-tpl-067", "mf-tpl-075", "mf-tpl-001"],
    tags: ["field-patterns", "sales-support", "handoff", "enterprise"],
    playbook: {
      description:
        "Catch and repair solution fit gaps when sales/SE design does not match actual customer use: oversell, undersell, or fine when it is not. Structure handoff so support is not the unpaid redesign team.",
      mindset: {
        principle:
          "If the use case was wrong at sale, support cannot hero the architecture forever. Write the gap and re-fit, or the logo burns everyone.",
        mistakes: [
          {
            id: "fine-in-the-room",
            label: "SE says it is fine without production use-case proof",
            cost: "Day-2 tickets become the design review",
          },
          {
            id: "silent-support",
            label: "Support absorbs misfit without a written gap",
            cost: "No leverage to change scope, SKU, or vendor path",
          },
          {
            id: "logo-exception",
            label: "Big name skips fit gate",
            cost: "Worst gaps on highest-visibility accounts",
          },
        ],
      },
      fit_checks: [
        "stated_use_case_vs_observed_use",
        "capacity_headroom",
        "feature_promised_vs_shipped",
        "ops_staffing_customer_side",
        "vendor_dependency_known",
        "support_skill_match",
      ],
      decision_branches: [
        {
          id: "pre-golive",
          situation: "Deal closed; production not live",
          action: "fit-gate-checklist",
        },
        {
          id: "fit-gap-found",
          situation: "Production pain shows design miss",
          action: "use-case-gap-log",
        },
        {
          id: "oversell",
          situation: "Promises exceed product/path",
          action: "scope-truth-memo",
        },
        {
          id: "undersell",
          situation: "Sold thin; customer needs more",
          action: "upsell-or-redesign-path",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Capture sold use case in writing",
            goal: "What SE believed",
            minutes: "30",
          },
          {
            id: 2,
            name: "Capture actual use case",
            goal: "What customer does",
            minutes: "60",
          },
          {
            id: 3,
            name: "Gap log and owners",
            goal: "Sales/SE/support/vendor",
            minutes: "45",
          },
          {
            id: 4,
            name: "Path: redesign, add, or exit risk",
            goal: "Stop silent heroics",
            minutes: "ongoing",
          },
        ],
      },
      tracking: {
        csv_header:
          "account,sold_use_case,actual_use_case,gap_type,severity,owner,status",
        sheet_tab_name: "solution_fit_handoff",
      },
      related_artifacts: [
        "mf-tpl-082",
        "mf-tpl-067",
        "mf-tpl-075",
        "mf-tpl-001",
      ],
      agent_signal: {
        use_when:
          "Closed deal does not match real use case. Oversold or undersold. Support stuck fixing sales design. Need handoff fit gate and gap log.",
        decision_criteria: [
          "No production ownership without written use-case assumptions.",
          "Gaps are logged with sales/SE owners, not only support tickets.",
          "Logo accounts get the same fit gate, not less.",
        ],
        operator_context:
          "Field pattern: sales vs support amplified on large institutional accounts. Weekly vendor bridges are a symptom of fit failure.",
        tags: ["field-patterns", "sales-support", "handoff", "enterprise"],
      },
    },
    templates: [
      {
        id: "fit-gate-checklist",
        use_when: "pre-golive",
        body: "SOLUTION FIT GATE\nAccount: _______________  Close date: _______\n\nSold use case: _______________\nExpected load/capacity: _______________\nFeatures promised: _______________\nCustomer ops model: _______________\nSupport skill match: Y/N\nVendor deps: _______________\nSE sign: _______  Support sign: _______  Date: _______",
      },
      {
        id: "use-case-gap-log",
        use_when: "fit-gap-found",
        body: "USE-CASE GAP LOG\nAccount: _______________  Found: _______\n\nSold: _______________\nActual: _______________\nGap type: [ ] oversell  [ ] undersell  [ ] wrong path  [ ] unknown\nImpact (tickets/outage/cost): _______________\nOwners: sales ___ SE ___ support ___ vendor ___\nNext action: _______________",
      },
      {
        id: "scope-truth-memo",
        use_when: "oversell",
        body: "SCOPE TRUTH MEMO (internal)\nWhat was promised: _______________\nWhat product can do: _______________\nCustomer-safe wording: _______________\nRemediation options: _______________\nWho tells the customer: _______________",
      },
      {
        id: "upsell-or-redesign-path",
        use_when: "undersell",
        body: "UNDERSELL PATH\nMissing capacity/feature: _______________\nOptions: [ ] commercial add  [ ] redesign  [ ] vendor feature  [ ] accept risk\nSupport interim controls: _______________\nDecision date: _______",
      },
      {
        id: "assumption-register",
        use_when: "pre-golive",
        body: "ASSUMPTION REGISTER\n# | Assumption | Source (SE/sales/customer) | Validated Y/N | Risk if wrong\n1 | | | |\n2 | | | |",
      },
    ],
    examples: [
      {
        id: "ex-oversell-capacity",
        context:
          "Solution sold for light use. Production load much higher. Support held weekly vendor calls to keep service up.",
        branch: "fit-gap-found",
        templates_used: ["use-case-gap-log", "scope-truth-memo"],
        resolution:
          "Capacity path corrected commercially. Vendor bridge became time-boxed with exit criteria.",
        log_row: "2026-Q3,oversell,capacity,path-fix",
      },
      {
        id: "ex-undersell",
        context:
          "Account bought thin SKU. SE said fine. Missing features hit day two.",
        branch: "undersell",
        templates_used: ["upsell-or-redesign-path", "assumption-register"],
        resolution:
          "Documented gap. Commercial add approved. Support stopped custom hacks.",
        log_row: "2026-Q1,undersell,add-on,ok",
      },
      {
        id: "ex-fit-gate-saved",
        context: "Pre-go-live fit gate found wrong auth model for customer ops.",
        branch: "pre-golive",
        templates_used: ["fit-gate-checklist", "assumption-register"],
        resolution:
          "Design changed before cutover. No war room.",
        log_row: "2026-W08,fit-gate,caught,pre-prod",
      },
    ],
    agentMd:
      "1. Pre-go-live → **fit-gate-checklist** + **assumption-register**.\n2. Production pain → **use-case-gap-log**.\n3. Oversell → **scope-truth-memo**.\n4. Undersell → **upsell-or-redesign-path**.\n5. Pair **mf-tpl-082** for sales/support room; **mf-tpl-067** for vendor bridge.",
  },
  {
    id: "mf-tpl-081",
    slug: "metrics-that-matter-qbr",
    title: "Metrics That Matter QBR Playbook",
    mission:
      "Customer QBR on back-end truth: did we answer, on time, did we fix (not shotgun parts), CSAT. Treat every account like a big fish. No sales fluff deck.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Quarterly review. Sales wants logo slides. Customer cares if phone was answered and problems actually closed.",
      branch: "mtm-qbr",
      resolution:
        "Four metrics + fix-vs-shotgun readout. Same standard for mid-size and logo.",
      log_row: "2026-Q2,ACCT,answer,ASA,FCR-fix,CSAT,mtm",
    },
    teaserBullets: [
      "Answered / on time / fixed / satisfied",
      "Fix vs parts shotgun as a first-class slide",
      "Same care standard for every account size",
    ],
    pairs: ["mf-tpl-061", "mf-tpl-075", "mf-tpl-060", "mf-tpl-005"],
    tags: ["field-patterns", "qbr", "csat", "support-ops"],
    playbook: {
      description:
        "Run Metrics That Matter QBRs: the few back-end measures customers feel. Answer access, timeliness, true fix rate versus parts shotgun, and satisfaction. Position every account as important, not only logos.",
      mindset: {
        principle:
          "Customers care about the phone and the fix. Ship-rate theater and sales fluff do not survive a real QBR.",
        mistakes: [
          {
            id: "fluff-deck",
            label: "QBR is logos, roadmap, and no ops numbers",
            cost: "Customer assumes you hide performance",
          },
          {
            id: "hide-shotgun",
            label: "Show ticket close rate but not parts-without-fix",
            cost: "They feel churn even when SLA is green",
          },
          {
            id: "only-big-fish",
            label: "Real metrics only for top logos",
            cost: "Everyone else gets neglect; brand dies in the middle",
          },
        ],
      },
      metrics_that_matter: [
        {
          id: "answered",
          label: "When you called, did we answer?",
          notes: "Offer rate / abandon context",
        },
        {
          id: "on_time",
          label: "Did we answer on time?",
          notes: "ASA or service-level vs goal",
        },
        {
          id: "fixed",
          label: "Did we fix the problem?",
          notes: "True resolution vs parts shotgun / reopen",
        },
        {
          id: "satisfied",
          label: "Customer sat survey",
          notes: "Overall + resolution item if available",
        },
      ],
      decision_branches: [
        {
          id: "mtm-qbr",
          situation: "Scheduled customer or segment QBR",
          action: "mtm-scorecard",
        },
        {
          id: "shotgun-readout",
          situation: "Parts volume high relative to confirmed fixes",
          action: "fix-vs-shotgun-slide",
        },
        {
          id: "mid-market-care",
          situation: "Non-logo account still strategic or vocal",
          action: "same-care-standard",
        },
        {
          id: "metric-dispute",
          situation: "Customer challenges a number",
          action: "definition-footnote",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Pull MTM four for the period",
            goal: "Answer, time, fix, sat",
            minutes: "45",
          },
          {
            id: 2,
            name: "Add fix-vs-shotgun cut",
            goal: "Honesty on parts",
            minutes: "30",
          },
          {
            id: 3,
            name: "Plain-language narrative",
            goal: "What improved, what we own",
            minutes: "30",
          },
          {
            id: 4,
            name: "Actions both sides",
            goal: "Not a monologue",
            minutes: "15",
          },
        ],
      },
      tracking: {
        csv_header:
          "period,account_or_segment,answered_pct,on_time_pct,fix_rate,shotgun_index,csat,owner",
        sheet_tab_name: "metrics_that_matter_qbr",
      },
      related_artifacts: [
        "mf-tpl-061",
        "mf-tpl-075",
        "mf-tpl-060",
        "mf-tpl-005",
      ],
      agent_signal: {
        use_when:
          "Customer QBR needs back-end metrics not sales fluff. Need answered/on-time/fixed/CSAT and fix-vs-shotgun. Same standard for non-logo accounts.",
        decision_criteria: [
          "Lead with four metrics that matter.",
          "Show fix quality, not only close volume.",
          "Apply the same scorecard pattern beyond top logos.",
        ],
        operator_context:
          "Field pattern: Metrics That Matter preso for QBRs. Big fish in a little pond standard for every account.",
        tags: ["field-patterns", "qbr", "csat", "support-ops"],
      },
    },
    templates: [
      {
        id: "mtm-scorecard",
        use_when: "mtm-qbr",
        body: "METRICS THAT MATTER SCORECARD\nAccount/segment: _______________  Period: _______\n\n1) Answered (access): ___  Goal: ___\n2) On time (ASA/SL): ___  Goal: ___\n3) Fixed (true resolution): ___  Goal: ___\n4) Satisfied (CSAT): ___  Goal: ___\n\nNarrative (3 lines): _______________\nActions us / them: _______________",
      },
      {
        id: "fix-vs-shotgun-slide",
        use_when: "shotgun-readout",
        body: "FIX VS SHOTGUN\nPeriod: _______\n\nTickets closed: ___\nConfirmed fix (no reopen / verified): ___\nParts-heavy closes: ___\nShotgun index (parts events / true fixes): ___\nWhat we changed: _______________",
      },
      {
        id: "same-care-standard",
        use_when: "mid-market-care",
        body: "SAME CARE STANDARD\nAccount: _______________  Tier label (internal): _______\n\nMTM pack delivered: Y/N\nCadence: quarterly / semiannual\nEscalation path published: Y/N\nNote: big-fish treatment is process, not only logo size",
      },
      {
        id: "definition-footnote",
        use_when: "metric-dispute",
        body: "METRIC DEFINITION FOOTNOTE\nMetric: _______________\nNumerator: _______________\nDenominator: _______________\nExclusions: _______________\nSource system: _______________",
      },
      {
        id: "qbr-agenda-mtm",
        use_when: "mtm-qbr",
        body: "QBR AGENDA (MTM)\n1. Scorecard four\n2. Fix vs shotgun\n3. Top drivers / incidents\n4. Joint actions\n5. Next period goals\nAvoid: pure roadmap fluff without ops",
      },
    ],
    examples: [
      {
        id: "ex-customer-qbr",
        context:
          "Customer wanted proof support was real. Sales brought fluff. Support brought MTM.",
        branch: "mtm-qbr",
        templates_used: ["qbr-agenda-mtm", "mtm-scorecard"],
        resolution:
          "Meeting stayed on access and fix quality. Renewal conversation grounded.",
        log_row: "2026-Q2,mtm,4-metrics,renewal-ok",
      },
      {
        id: "ex-shotgun-exposed",
        context: "Close rate green. Customer still angry. Parts volume high.",
        branch: "shotgun-readout",
        templates_used: ["fix-vs-shotgun-slide", "mtm-scorecard"],
        resolution:
          "Shotgun index added to QBR. Coaching and kit rules followed.",
        log_row: "2026-Q3,shotgun-index,coaching,ok",
      },
      {
        id: "ex-mid-fish",
        context: "Mid-size account never got a real ops review.",
        branch: "mid-market-care",
        templates_used: ["same-care-standard", "mtm-scorecard"],
        resolution:
          "Semiannual MTM. Felt heard; escalations dropped.",
        log_row: "2026-H1,mid,mtm-semi,esc-down",
      },
    ],
    agentMd:
      "1. QBR → **qbr-agenda-mtm** + **mtm-scorecard**.\n2. Parts-heavy closes → **fix-vs-shotgun-slide**.\n3. Non-logo strategic → **same-care-standard**.\n4. Number fight → **definition-footnote**.\n5. Pair **mf-tpl-061** ops correlation; **mf-tpl-075** if return/NDF health is the customer pain.",
  },
  {
    id: "mf-tpl-082",
    slug: "sales-support-incident-bridge",
    title: "Sales Support Incident Bridge Playbook",
    mission:
      "Sales vs support under fire: panic rooms, blame after the save, weekly vendor bridges on logo pain. Roles, evidence, time-boxed bridges, no permanent heroics.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Issue fixed with vendor. Sales still blames support for speed. Weekly con call with upstream vendor has no end date.",
      branch: "post-fix-blame",
      resolution:
        "Roles charter, evidence pack, bridge exit criteria. Blame cycle interrupted.",
      log_row: "2026-W44,bridge-exit,roles,blame-stop",
    },
    teaserBullets: [
      "Incident room roles: sales, SE, support",
      "Evidence before narrative",
      "Vendor bridge with exit criteria",
    ],
    pairs: ["mf-tpl-079", "mf-tpl-080", "mf-tpl-067", "mf-tpl-001"],
    tags: ["field-patterns", "sales-support", "escalation", "vendor"],
    playbook: {
      description:
        "Run sales-support incident bridges without endless politics: who owns customer narrative, who owns dig, when vendor joins, how blame is handled after a fix, and how weekly bridges end.",
      mindset: {
        principle:
          "Sales vs support is old. Under logo heat it gets loud. Process beats personality: evidence, roles, exit criteria.",
        mistakes: [
          {
            id: "endless-bridge",
            label: "Weekly vendor call with no exit criteria",
            cost: "Support becomes permanent glue for a bad sale or bad cohort story",
          },
          {
            id: "blame-after-save",
            label: "After fix, score-settle on who was slow",
            cost: "Next incident starts with distrust",
          },
          {
            id: "narrative-without-dig",
            label: "Sales commits a story before support finishes cohort or fit dig",
            cost: "Company pays twice: wrong promise and cleanup",
          },
        ],
      },
      roles: [
        {
          id: "sales",
          label: "Customer relationship and commercial path",
        },
        {
          id: "se",
          label: "Sold design and technical promises",
        },
        {
          id: "support",
          label: "Evidence dig, ops metrics, incident execution",
        },
        {
          id: "vendor-bridge",
          label: "Upstream fix only with samples and asks",
        },
      ],
      decision_branches: [
        {
          id: "incident-open",
          situation: "Cross-functional fire on an account",
          action: "incident-room-charter",
        },
        {
          id: "vendor-weekly",
          situation: "Standing call with upstream vendor",
          action: "bridge-cadence-exit",
        },
        {
          id: "post-fix-blame",
          situation: "Fixed but sales blames support speed or vice versa",
          action: "after-action-no-blood",
        },
        {
          id: "narrative-risk",
          situation: "Someone will tell the customer today",
          action: "joint-narrative-lock",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Charter the room",
            goal: "Roles and decision rights",
            minutes: "20",
          },
          {
            id: 2,
            name: "Evidence before customer story",
            goal: "Cohort or fit dig linked",
            minutes: "varies",
          },
          {
            id: 3,
            name: "Vendor bridge only with ask",
            goal: "Samples, not venting",
            minutes: "standing",
          },
          {
            id: 4,
            name: "Close with after-action",
            goal: "No blood; system fixes",
            minutes: "30",
          },
        ],
      },
      tracking: {
        csv_header:
          "incident_id,account,opened,owners,vendor_bridge_y_n,exit_criteria,closed,notes",
        sheet_tab_name: "sales_support_incident_bridge",
      },
      related_artifacts: [
        "mf-tpl-079",
        "mf-tpl-080",
        "mf-tpl-067",
        "mf-tpl-001",
      ],
      agent_signal: {
        use_when:
          "Sales and support in conflict on a hot account. Weekly vendor bridges with no end. Blame after a save. Need roles, evidence order, exit criteria.",
        decision_criteria: [
          "Charter roles before the shout.",
          "No customer narrative without dig pointer (cohort or fit).",
          "Every standing bridge has exit criteria.",
        ],
        operator_context:
          "Field pattern: sales vs support beast. Amplified on large accounts. Time-box heroics.",
        tags: ["field-patterns", "sales-support", "escalation", "vendor"],
      },
    },
    templates: [
      {
        id: "incident-room-charter",
        use_when: "incident-open",
        body: "INCIDENT ROOM CHARTER\nAccount: _______________  ID: _______\n\nSales owns: _______________\nSE owns: _______________\nSupport owns: _______________\nDecision maker: _______________\nCustomer comms approver: _______________\nNext checkpoint: _______",
      },
      {
        id: "bridge-cadence-exit",
        use_when: "vendor-weekly",
        body: "VENDOR BRIDGE CADENCE\nVendor: _______________  Cadence: weekly / biweekly\n\nPurpose (one line): _______________\nExit criteria: _______________\nSamples/asks this week: _______________\nKill date if unmet: _______\nSupport owner: _______________",
      },
      {
        id: "after-action-no-blood",
        use_when: "post-fix-blame",
        body: "AFTER ACTION (NO BLOOD)\nIncident: _______________\n\nWhat worked: _______________\nSystem gap (not person): _______________\nChange to process/metric/handoff: _______________\nExplicit: no score-settling on speed theater",
      },
      {
        id: "joint-narrative-lock",
        use_when: "narrative-risk",
        body: "JOINT NARRATIVE LOCK\nWhat we will say: _______________\nWhat we will not say: _______________\nData pointer (cohort/fit/MTM): _______________\nSpeaker: _______________  Backup: _______________",
      },
      {
        id: "evidence-before-story",
        use_when: "incident-open",
        body: "EVIDENCE BEFORE STORY\nClaim: _______________\nDig required: [ ] cohort truth  [ ] fit gap  [ ] MTM  [ ] other\nPack link/ID: _______________\nEarliest honest customer update: _______",
      },
    ],
    examples: [
      {
        id: "ex-blame-after-fw",
        context:
          "Manufacturer firmware fixed the population. Sales blamed support for not being faster.",
        branch: "post-fix-blame",
        templates_used: ["after-action-no-blood", "joint-narrative-lock"],
        resolution:
          "After-action on system speed gates. No public blood. Next incident cleaner.",
        log_row: "2026-W44,fw-done,no-blood,ok",
      },
      {
        id: "ex-endless-vendor-call",
        context:
          "Weekly upstream vendor call for months on logo account with no exit.",
        branch: "vendor-weekly",
        templates_used: ["bridge-cadence-exit", "incident-room-charter"],
        resolution:
          "Exit criteria set. Bridge ended when criteria met. Residual owned as fit gap.",
        log_row: "2026-Q4,bridge-exit,criteria-met",
      },
      {
        id: "ex-story-before-dig",
        context: "Sales ready to email customer a fail theory same day.",
        branch: "narrative-risk",
        templates_used: ["evidence-before-story", "joint-narrative-lock"],
        resolution:
          "24h dig window. Cohort pack attached. Email accurate.",
        log_row: "2026-W12,hold-24h,cohort,ok",
      },
    ],
    agentMd:
      "1. Hot cross-functional → **incident-room-charter** + **evidence-before-story**.\n2. Standing vendor call → **bridge-cadence-exit**.\n3. Blame after save → **after-action-no-blood**.\n4. Customer email risk → **joint-narrative-lock**.\n5. Pair **mf-tpl-079** / **mf-tpl-080** for dig content; **mf-tpl-067** for engineering/vendor technical bridge.",
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

field_patterns · Sales/support and QBR patterns. Complements NDF cluster 060/073-078.
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
        "Generic job spine. Not NDF program design (see 073-078). Not legal advice.",
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

manifest.pack_lanes = {
  ...(manifest.pack_lanes || {}),
  field_patterns:
    "Field patterns: people ops, returns, NDF incentives, sales/support, QBR metrics, workplace exit. Not legal advice.",
  sales_support_qbr:
    "Sales/support bridge and Metrics That Matter QBR (079-082).",
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
  apply: "branch → template → log",
  description: p.mission.slice(0, 140),
  tags: p.tags,
  use_when: p.playbook.agent_signal.use_when,
  not_for:
    "Generic job spine. Not NDF program design (see 073-078). Not legal advice.",
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
if (!indexHtml.includes('id="mf-tpl-079"')) {
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
  fs.writeFileSync(indexPath, indexHtml);
  console.log("index.html articles appended");
}

// keep human header count in sync with manifest
{
  let idx = fs.readFileSync(indexPath, "utf8");
  const n = manifest.entry_count;
  idx = idx.replace(
    /(\d+)\s+entries\s+·\s+<a href="catalog-manifest\.json">/,
    `${n} entries · <a href="catalog-manifest.json">`
  );
  idx = idx.replace(
    /x402scan<\/a>\s*\(\d+\s+resources\)/,
    `x402scan</a> (${n} resources)`
  );
  fs.writeFileSync(indexPath, idx);
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
  if (!worker.includes("];\n\nconst NETWORK_CAIP2")) {
    throw new Error("worker inject marker missing");
  }
  worker = worker.replace(
    "];\n\nconst NETWORK_CAIP2",
    block + "];\n\nconst NETWORK_CAIP2"
  );
}
fs.writeFileSync(workerPath, worker);
console.log("worker gates updated");
console.log("done build-sales-qbr-079-082 (no push)");
