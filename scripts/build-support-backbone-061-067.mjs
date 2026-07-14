#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const TPL = path.join(MF, "templates");

const PACKS = [
  {
    id: "mf-tpl-061",
    slug: "support-ops-correlation",
    title: "Support Ops Correlation Playbook",
    mission:
      "Weekly ops metrics plus CSAT correlations. Written conclusions for fair dings and QBR ops narrative.",
    teaserExample: {
      context: "ASA up, answer survey down. Leadership blames training.",
      branch: "correlation-readout",
      resolution: "Matrix shows ASA-abandon link. Training targets knowledge lane.",
      log_row: "2026-Wk12,32,1980,2.1,0.11,4.71,4.76,4.72,4.89,4.54",
    },
    teaserBullets: [
      "Weekly ops row plus correlation matrix",
      "CSAT driver narratives (speed vs resolution)",
      "QBR ops slide from live correlations",
    ],
    pairs: ["mf-tpl-064", "mf-tpl-005", "mf-tpl-063"],
    tags: ["support-ops", "csat", "metrics-proof"],
    playbook: {
      description:
        "Correlate staff, calls, ASA, abandon, and survey scores weekly. Publish conclusions before metrics bite.",
      mindset: {
        principle:
          "Correlation is not causation, but it beats hallway blame. Write what the matrix says.",
        mistakes: [
          {
            id: "ding-without-matrix",
            label: "Ding a team on one KPI without weekly context",
            cost: "Techs demand proof; trust in metrics dies",
          },
          {
            id: "hide-abandon-asa",
            label: "Track CSAT only, ignore ASA and abandon",
            cost: "Miss the lever that moves answer scores",
          },
          {
            id: "qbr-vibes",
            label: "QBR with slides and no ops correlation",
            cost: "Customer assumes you manage by narrative",
          },
        ],
      },
      metrics_tracked: [
        { id: "staff", label: "Staffed headcount" },
        { id: "calls", label: "Call volume" },
        { id: "asa", label: "Average speed of answer" },
        { id: "aban", label: "Abandon rate" },
        { id: "over", label: "Overall survey" },
        { id: "ans", label: "Answered on time survey" },
        { id: "know", label: "Knowledge survey" },
        { id: "pro", label: "Professionalism survey" },
        { id: "sat", label: "Resolution satisfaction survey" },
      ],
      correlation_insights: [
        {
          id: "staff-calls",
          pattern: "Strong positive staff vs calls",
          meaning: "Staffing tracks volume; validate before cutting heads",
        },
        {
          id: "asa-aban",
          pattern: "Very strong positive ASA vs abandon",
          meaning: "Speed and abandon move together; fix both or neither",
        },
        {
          id: "asa-ans",
          pattern: "Moderate negative ASA vs answer survey",
          meaning: "Slower answer hurts on-time perception even when resolved",
        },
        {
          id: "ans-bundle",
          pattern: "Answer survey pulls other survey scores",
          meaning: "Overall is least dragged by answer alone; train holistically",
        },
      ],
      decision_branches: [
        { id: "start-matrix", situation: "Ops and CSAT tracked separately", action: "enable-weekly-row" },
        { id: "correlation-readout", situation: "Leadership wants cause of CSAT move", action: "publish-matrix-narrative" },
        { id: "staff-cut-review", situation: "Headcount reduction proposed", action: "pull-staff-asa-aban-chain" },
        { id: "enterprise-qbr", situation: "Large account ops review", action: "qbr-ops-correlation-slide" },
        { id: "metric-dispute", situation: "Team disputes ding", action: "week-context-packet" },
      ],
      process: {
        steps: [
          { id: 1, name: "Log weekly ops row", goal: "One row per fiscal week", minutes: "15" },
          { id: 2, name: "Refresh correlation matrix", goal: "Rolling window, not one bad week", minutes: "30" },
          { id: 3, name: "Write conclusions", goal: "Plain language in narrative block", minutes: "20" },
          { id: 4, name: "Share before dings", goal: "Matrix visible to leads", minutes: "ongoing" },
        ],
      },
      tracking: {
        csv_header: "fiscal_week,staff,calls,asa,aban,over,ans,know,pro,sat,narrative_owner",
        sheet_tab_name: "ops_correlation",
      },
      related_artifacts: ["mf-tpl-064", "mf-tpl-063", "mf-tpl-005", "mf-tpl-065"],
      agent_signal: {
        use_when:
          "Support ops and CSAT move together. Leadership dings on one KPI. QBR needs ops proof beyond surveys.",
        decision_criteria: [
          "Log weekly ops row before individual metric dings.",
          "Publish correlation conclusions in plain language.",
          "Pair ASA and abandon in staffing debates.",
        ],
        operator_context:
          "Metric-heavy support orgs: matrix deflects blame wars and anchors QBR ops story.",
        tags: ["support-ops", "csat", "metrics-proof"],
      },
    },
    templates: [
      {
        id: "weekly-ops-row",
        use_when: "start-matrix",
        body: "WEEKLY OPS ROW\nFiscal week: _______  Staff: ___  Calls: ___\nASA: ___  Abandon %: ___\nOverall: ___  Answer: ___  Knowledge: ___  Professional: ___  Resolution: ___\nOwner: _______________",
      },
      {
        id: "correlation-matrix-readout",
        use_when: "correlation-readout",
        body: "CORRELATION READOUT · Period: _______\n\nStrong patterns this window:\n1. _______________ (r≈___)\n2. _______________ (r≈___)\n\nPlain conclusion: _______________\nAction owner: _______________  Due: _______",
      },
      {
        id: "csat-driver-narrative",
        use_when: "correlation-readout",
        body: "CSAT DRIVER NARRATIVE\n\nIf ASA rises: expect abandon to rise; answer survey may fall.\nIf staff falls: watch ASA-abandon chain before blaming training.\nOverall survey: least tied to answer alone; do not over-index one item.",
      },
      {
        id: "staff-cut-review",
        use_when: "staff-cut-review",
        body: "STAFF CUT IMPACT REVIEW\nProposed cut: ___ FTE  Effective: _______\n\nLast 8 weeks: staff vs ASA vs abandon trend attached.\nCSAT at risk lanes: _______________\nDecision: [ ] proceed  [ ] phase  [ ] reject",
      },
      {
        id: "qbr-ops-correlation-slide",
        use_when: "enterprise-qbr",
        body: "QBR OPS SLICE (data-backed)\nAccount: _______________  Period: _______________\n\nOps trend: ASA ___  Abandon ___  CSAT overall ___\nMessage: We manage support with correlated ops metrics, not anecdotes.",
      },
      {
        id: "week-context-packet",
        use_when: "metric-dispute",
        body: "METRIC DISPUTE · WEEK CONTEXT\nEmployee/team: _______________  Metric: _______________\n\nAttach: fiscal week row + matrix excerpt + written conclusion.\nRule: no ding without weekly context on file.",
      },
    ],
    examples: [
      {
        id: "ex-asa-answer-drop",
        context: "ASA climbed two months. Answer survey slipped. Training blamed.",
        branch: "correlation-readout",
        templates_used: ["correlation-matrix-readout", "csat-driver-narrative"],
        resolution: "Matrix showed ASA-abandon bundle. Staffing restored; answer score recovered.",
        log_row: "2026-Wk18,29,2050,2.4,0.12,4.68,4.71,4.75,4.88,4.52",
      },
      {
        id: "ex-staff-cut-blocked",
        context: "Finance proposed 4 FTE cut on support floor.",
        branch: "staff-cut-review",
        templates_used: ["staff-cut-review", "weekly-ops-row"],
        resolution: "Eight-week chain cited. Phased cut instead of cliff.",
        log_row: "2026-Wk22,review,-4FTE,asa-risk,blocked-cliff,owner",
      },
      {
        id: "ex-enterprise-ops-qbr",
        context: "Enterprise customer questioned support capacity claims.",
        branch: "enterprise-qbr",
        templates_used: ["qbr-ops-correlation-slide"],
        resolution: "Ops correlation slide shipped. Renewal stayed on track.",
        log_row: "2026-Q2,QBR-LGE,ops-proof,asa-aban-csat,accepted",
      },
      {
        id: "ex-print-shop-csat",
        context: "Print shop rush season. Callback volume up. CSAT wobble.",
        branch: "start-matrix",
        templates_used: ["weekly-ops-row"],
        resolution: "Weekly row habit started. Rush staffing tied to abandon, not guilt.",
        log_row: "2026-Wk08,6,420,0.8,0.04,4.6,4.7,4.8,4.9,4.5",
      },
    ],
    agentMd:
      "1. Log **weekly-ops-row** every fiscal week.\n2. CSAT move → **correlation-matrix-readout** + **csat-driver-narrative**.\n3. Headcount cut → **staff-cut-review** before approval.\n4. Enterprise review → **qbr-ops-correlation-slide**.\n5. Pair **mf-tpl-064** when understaffing annotations exist.",
  },
  {
    id: "mf-tpl-062",
    slug: "queue-split-design",
    title: "Queue Split Design Playbook",
    mission:
      "Split/skill map: priority, ASA goal, hours, after-hours. The routing backbone before volume or forecast work.",
    teaserExample: {
      context: "One queue for all callers. Enterprise waits behind consumer noise.",
      branch: "split-redesign",
      resolution: "Priority map shipped. Enterprise ASA goal met in two weeks.",
      log_row: "split-8,enterprise-tier,asa-goal-2:00,priority-1,owner",
    },
    teaserBullets: [
      "Split/skill registry template",
      "Priority and ASA goal per queue",
      "Hours and after-hours routing rules",
    ],
    pairs: ["mf-tpl-063", "mf-tpl-066", "mf-tpl-061"],
    tags: ["routing", "queue-design", "support-ops"],
    playbook: {
      description:
        "Document every split/skill: queue name, ASA goal, priority, group, hours. Route before you forecast.",
      mindset: {
        principle: "Backend support is structure. Queues are the skeleton.",
        mistakes: [
          {
            id: "one-queue-all",
            label: "Single queue for mixed customer tiers",
            cost: "High-margin accounts wait with low-priority noise",
          },
          {
            id: "priority-unwritten",
            label: "Priority only in supervisor heads",
            cost: "New hires mis-route; ASA goals become fiction",
          },
          {
            id: "hours-mismatch",
            label: "After-hours promise without split rule",
            cost: "Abandon spikes; CSAT hits answer survey first",
          },
        ],
      },
      split_fields: [
        "split_skill_id",
        "queue_label",
        "primary_did",
        "asa_goal",
        "priority_level",
        "owning_group",
        "hours_of_operation",
        "after_hours_behavior",
      ],
      decision_branches: [
        { id: "inventory-splits", situation: "Splits exist but undocumented", action: "split-registry" },
        { id: "split-redesign", situation: "Tier mixing causes SLA miss", action: "priority-rebalance" },
        { id: "new-product-line", situation: "New SKU or service needs route", action: "add-split-row" },
        { id: "after-hours-gap", situation: "Calls after close with no path", action: "after-hours-rule" },
      ],
      process: {
        steps: [
          { id: 1, name: "Export live splits", goal: "Match telephony reality", minutes: "30" },
          { id: 2, name: "Fill registry", goal: "One row per split", minutes: "60" },
          { id: 3, name: "Validate ASA goals", goal: "Goals match capacity plan", minutes: "30" },
          { id: 4, name: "Publish to floor", goal: "Routing card at desk", minutes: "15" },
        ],
      },
      related_artifacts: ["mf-tpl-063", "mf-tpl-066", "mf-tpl-061", "mf-tpl-005"],
      agent_signal: {
        use_when:
          "Call routing is tribal knowledge. Mixed tiers in one queue. ASA goals undocumented or wrong.",
        decision_criteria: [
          "One registry row per split before forecast work.",
          "Priority and ASA goal on every row.",
          "After-hours behavior explicit, not implied.",
        ],
        operator_context:
          "Queue map is prerequisite for volume tracking and staffing math.",
        tags: ["routing", "queue-design", "support-ops"],
      },
    },
    templates: [
      {
        id: "split-registry-row",
        use_when: "inventory-splits",
        body: "SPLIT REGISTRY ROW\nSplit/Skill ID: ___  Queue: _______________\nPrimary DID: _______________  ASA goal: ___  Priority (1=highest): ___\nGroup: _______________  Hours: _______________\nAfter hours: [ ] closed  [ ] voicemail  [ ] page  [ ] outsource",
      },
      {
        id: "priority-rebalance-memo",
        use_when: "split-redesign",
        body: "PRIORITY REBALANCE\nDate: _______  Owner: _______________\n\nProblem: _______________\nSplits affected: _______________\nNew priority order: _______________\nASA goal changes: _______________\nFloor comms date: _______",
      },
      {
        id: "routing-desk-card",
        use_when: "inventory-splits",
        body: "ROUTING DESK CARD (post at station)\n\nIf caller is: _______________ → Split ___ (Priority ___)\nIf caller is: _______________ → Split ___ (Priority ___)\nEscalation: _______________",
      },
      {
        id: "after-hours-rule",
        use_when: "after-hours-gap",
        body: "AFTER-HOURS RULE\nSplit: _______________\n\nBehavior: _______________\nCustomer message: _______________\nMetric: abandon after-hours tracked separately: Y/N",
      },
      {
        id: "new-split-checklist",
        use_when: "new-product-line",
        body: "NEW SPLIT CHECKLIST\nProduct/service: _______________\n\n[ ] Split ID assigned\n[ ] ASA goal set\n[ ] Priority vs peer splits\n[ ] Hours and overflow\n[ ] Added to forecast model",
      },
    ],
    examples: [
      {
        id: "ex-tier-mix",
        context: "Enterprise accounts queued with consumer calls. SLA misses.",
        branch: "split-redesign",
        templates_used: ["priority-rebalance-memo", "split-registry-row"],
        resolution: "Dedicated enterprise split at priority 1. ASA recovered.",
        log_row: "split-3,enterprise,2:00,1,CS,6-5MF,closed",
      },
      {
        id: "ex-vending-route",
        context: "Vending operator line shared with parts desk.",
        branch: "add-split-row",
        templates_used: ["new-split-checklist", "routing-desk-card"],
        resolution: "New split for field ops. Forecast tab added.",
        log_row: "split-12,field-ops,3:00,2,CS,extended",
      },
      {
        id: "ex-after-hours",
        context: "Abandon spike nights and weekends.",
        branch: "after-hours-gap",
        templates_used: ["after-hours-rule"],
        resolution: "Closed with callback promise. After-hours metric split out.",
        log_row: "split-2,consumer,closed,vm-callback,tracked",
      },
    ],
    agentMd:
      "1. **split-registry-row** for every live split.\n2. SLA miss from tier mix → **priority-rebalance-memo**.\n3. New product line → **new-split-checklist** before launch.\n4. Pair **mf-tpl-063** for volume by split.",
  },
  {
    id: "mf-tpl-063",
    slug: "volume-split-tracker",
    title: "Volume Split Tracker Playbook",
    mission:
      "Offered, answered, abandoned by segment and week. Truth feed for forecast and correlation packs.",
    teaserExample: {
      context: "Leadership says volume flat. Enterprise segment up 18% uncounted.",
      branch: "segment-variance",
      resolution: "Split tracker exposed mix shift. Staffing moved to priority split.",
      log_row: "2026-Wk10,seg-a,1616,1490,126,0.078",
    },
    teaserBullets: [
      "Weekly offered/answered/abandoned by segment",
      "Mix shift detection",
      "Feeds forecast and correlation packs",
    ],
    pairs: ["mf-tpl-062", "mf-tpl-061", "mf-tpl-066"],
    tags: ["volume", "segmentation", "support-ops"],
    playbook: {
      description:
        "Track call offered, answered, abandoned per segment and fiscal week. Surface mix shifts before staffing debates.",
      mindset: {
        principle: "Aggregate volume lies. Segments tell the truth.",
        mistakes: [
          {
            id: "total-only",
            label: "Report company-wide calls only",
            cost: "Miss segment surge that breaks one ASA goal",
          },
          {
            id: "abandon-as-afterthought",
            label: "Track answered, ignore abandoned",
            cost: "Understate load; staffing math wrong",
          },
        ],
      },
      segments: [
        { id: "seg-a", label: "High-priority segment (rename to your tier)" },
        { id: "seg-b", label: "Standard segment" },
        { id: "seg-c", label: "Optional third segment (partner, field, etc.)" },
      ],
      decision_branches: [
        { id: "start-segment-log", situation: "Volume reported as one number", action: "weekly-segment-row" },
        { id: "segment-variance", situation: "Total flat but one segment moves", action: "mix-shift-memo" },
        { id: "abandon-spike", situation: "Abandon up on one segment", action: "segment-abandon-review" },
      ],
      tracking: {
        csv_header: "fiscal_week,segment,offered,answered,abandoned,aban_rate,notes",
        sheet_tab_name: "volume_by_segment",
      },
      related_artifacts: ["mf-tpl-062", "mf-tpl-061", "mf-tpl-066", "mf-tpl-064"],
      agent_signal: {
        use_when:
          "Call volume debated without segment split. Mix shift suspected. Forecast needs actuals by queue family.",
        decision_criteria: [
          "Log offered, answered, abandoned per segment weekly.",
          "Flag mix shift when one segment moves >10% vs 4-week avg.",
          "Feed actuals into forecast variance pack.",
        ],
        operator_context: "Segment truth prevents wrong staffing on the wrong queue.",
        tags: ["volume", "segmentation", "support-ops"],
      },
    },
    templates: [
      {
        id: "weekly-segment-row",
        use_when: "start-segment-log",
        body: "VOLUME BY SEGMENT · Week _______\nSegment: _______________\nOffered: ___  Answered: ___  Abandoned: ___  Abandon %: ___\nNotes: _______________",
      },
      {
        id: "mix-shift-memo",
        use_when: "segment-variance",
        body: "MIX SHIFT MEMO\nWeek: _______  Author: _______________\n\nSegment moving: _______________  Delta vs 4-wk avg: ___%\nLikely cause: _______________\nStaffing action: _______________",
      },
      {
        id: "segment-abandon-review",
        use_when: "abandon-spike",
        body: "SEGMENT ABANDON REVIEW\nSegment: _______________  Week: _______\n\nAbandon %: ___  Prior 4-wk avg: ___\nConcurrent staffing: ___  ASA: ___\nAction: _______________",
      },
      {
        id: "rollup-to-correlation",
        use_when: "start-segment-log",
        body: "ROLLUP TO OPS CORRELATION\nCopy company totals to mf-tpl-061 weekly row after segment rows validated.",
      },
    ],
    examples: [
      {
        id: "ex-mix-shift",
        context: "Total calls flat. High-priority segment up 18%.",
        branch: "segment-variance",
        templates_used: ["mix-shift-memo", "weekly-segment-row"],
        resolution: "Staff moved to priority split. Abandon down.",
        log_row: "2026-Wk14,seg-a,1750,1565,185,0.106",
      },
      {
        id: "ex-print-season",
        context: "Print shop support line seasonal spike on install callbacks.",
        branch: "abandon-spike",
        templates_used: ["segment-abandon-review"],
        resolution: "Temp hours extension on one segment only.",
        log_row: "2026-Wk06,install-cb,880,790,90,0.102",
      },
    ],
    agentMd:
      "1. **weekly-segment-row** per segment every week.\n2. Flat total, weird SLA → **mix-shift-memo**.\n3. Roll totals to **mf-tpl-061** ops row.\n4. Pair **mf-tpl-062** registry for segment names.",
  },
  {
    id: "mf-tpl-064",
    slug: "understaffing-impact-log",
    title: "Understaffing Impact Log Playbook",
    mission:
      "Annotated weekly log when headcount drops: ASA, abandon, answer rate. Proof, not blame.",
    teaserExample: {
      context: "Three techs out one week. ASA doubled. No annotation on report.",
      branch: "headcount-drop",
      resolution: "Impact log attached. Metric ding waived with record.",
      log_row: "2026-Wk21,down-3-ts,asa-2:08,aban-0.14,holiday+staffing",
    },
    teaserBullets: [
      "Weekly ASA/abandon with staffing annotations",
      "Down-N event tags",
      "Metric dispute packet when dings land",
    ],
    pairs: ["mf-tpl-061", "mf-tpl-063", "mf-tpl-066"],
    tags: ["staffing", "asa", "metrics-proof"],
    playbook: {
      description:
        "When headcount drops, log ASA, abandon, and percent answered with plain annotations. Fair metrics demand context.",
      mindset: {
        principle:
          "The minute people get dinged, they want proof the test dinged them fairly. Annotate the week.",
        mistakes: [
          {
            id: "raw-metrics-only",
            label: "Report ASA without staffing context",
            cost: "False dings; floor stops trusting data",
          },
          {
            id: "blame-techs",
            label: "Explain spike as attitude not staffing",
            cost: "Miss fixable capacity issue",
          },
        ],
      },
      annotation_tags: [
        "down-N-staff",
        "holiday-skeleton",
        "training-class",
        "system-outage",
        "volume-surge",
      ],
      decision_branches: [
        { id: "headcount-drop", situation: "Scheduled staffing below plan", action: "understaffing-week-row" },
        { id: "holiday-skeleton", situation: "Holiday or skeleton crew", action: "tag-and-notify" },
        { id: "asa-spike", situation: "ASA crosses goal without obvious cause", action: "annotation-review" },
        { id: "metric-ding-dispute", situation: "Individual ding during known understaff week", action: "impact-proof-packet" },
      ],
      tracking: {
        csv_header: "week_start,asa,acd_calls,abn_calls,pct_answered,annotation,owner",
        sheet_tab_name: "understaffing_log",
      },
      related_artifacts: ["mf-tpl-061", "mf-tpl-063", "mf-tpl-066", "mf-tpl-005"],
      agent_signal: {
        use_when:
          "Headcount dropped and ASA/abandon moved. Someone got dinged without week context. Need fair metric proof.",
        decision_criteria: [
          "Annotate every week staffing is below plan.",
          "Attach impact log before individual dings stand.",
          "Pair with correlation pack for leadership narrative.",
        ],
        operator_context: "Understaffing log is the fairness layer on raw ACD stats.",
        tags: ["staffing", "asa", "metrics-proof"],
      },
    },
    templates: [
      {
        id: "understaffing-week-row",
        use_when: "headcount-drop",
        body: "UNDERSTAFFING WEEK ROW\nWeek starting: _______\nASA: ___  ACD calls: ___  Abandon calls: ___  % Answered: ___\nAnnotation: _______________ (e.g. down-3-staff, holiday)\nOwner: _______________",
      },
      {
        id: "tag-and-notify",
        use_when: "holiday-skeleton",
        body: "SKELETON CREW NOTICE\nWeek: _______  Expected staffing: ___  Actual: ___\n\nMetrics expectation: ASA may exceed goal. Tagged in log.\nLeads notified: Y/N  Date: _______",
      },
      {
        id: "annotation-review",
        use_when: "asa-spike",
        body: "ASA SPIKE REVIEW\nWeek: _______\n\nStaffing vs plan: _______________\nVolume vs plan: _______________\nAnnotation chosen: _______________\nCorrective action: _______________",
      },
      {
        id: "impact-proof-packet",
        use_when: "metric-ding-dispute",
        body: "IMPACT PROOF PACKET\nEmployee: _______________  Metric: _______________  Week: _______\n\nAttach: understaffing week row + annotation tag.\nRecommendation: [ ] adjust ding  [ ] uphold with record",
      },
    ],
    examples: [
      {
        id: "ex-down-three",
        context: "Three staff out. ASA past two minutes. Team lead dinged.",
        branch: "metric-ding-dispute",
        templates_used: ["impact-proof-packet", "understaffing-week-row"],
        resolution: "Ding adjusted. Log now required on down-N weeks.",
        log_row: "2026-06-12,02:08,1957,279,0.875,down-3-ts",
      },
      {
        id: "ex-holiday",
        context: "Holiday week skeleton crew.",
        branch: "holiday-skeleton",
        templates_used: ["tag-and-notify", "understaffing-week-row"],
        resolution: "Metrics tagged upfront. No surprise exec review.",
        log_row: "2026-Wk29,00:54,1689,102,0.943,holiday-skeleton",
      },
    ],
    agentMd:
      "1. Staff below plan → **understaffing-week-row** same week.\n2. Holiday → **tag-and-notify** before metrics review.\n3. Ding dispute → **impact-proof-packet**.\n4. Pair **mf-tpl-061** for correlation narrative.",
  },
  {
    id: "mf-tpl-065",
    slug: "support-unit-economics",
    title: "Support Unit Economics Playbook",
    mission:
      "Cost per call, email, RMA, and event. Backend support as measurable backbone, not a black hole.",
    teaserExample: {
      context: "CFO asks why support headcount grew. No cost per event.",
      branch: "unit-cost-build",
      resolution: "Cost per call and email table shipped. Budget debate grounded.",
      log_row: "2026-Q3,calls-18200,emails-4200,rma-890,labor-$$,cpu-14.2",
    },
    teaserBullets: [
      "Cost per inbound call and email",
      "RMA and event types in denominator",
      "Labor burden roll-up template",
    ],
    pairs: ["mf-tpl-066", "mf-tpl-005", "mf-tpl-061"],
    tags: ["unit-economics", "budget", "support-ops"],
    playbook: {
      description:
        "Roll labor burden into cost per support event: calls, emails, RMAs. Use for budget, QBR, and backbone argument.",
      mindset: {
        principle: "Backend support is structure. Unit cost makes the backbone visible.",
        mistakes: [
          {
            id: "headcount-only",
            label: "Budget debate on FTE only",
            cost: "Miss channel shift from phone to email",
          },
          {
            id: "revenue-ignore",
            label: "Cut support without segment margin context",
            cost: "Save pennies, lose high-margin accounts",
          },
        ],
      },
      event_types: [
        { id: "inbound-call", label: "Inbound phone" },
        { id: "outbound-call", label: "Outbound phone" },
        { id: "email", label: "Email ticket" },
        { id: "rma", label: "RMA or return event" },
        { id: "chat", label: "Chat or async channel" },
      ],
      decision_branches: [
        { id: "unit-cost-build", situation: "No cost per event model", action: "build-unit-table" },
        { id: "channel-shift", situation: "Email volume up, calls flat", action: "channel-mix-review" },
        { id: "budget-defense", situation: "Headcount cut proposed", action: "backbone-brief" },
      ],
      tracking: {
        csv_header: "period,event_type,volume,labor_cost,unit_cost,notes",
        sheet_tab_name: "support_unit_economics",
      },
      related_artifacts: ["mf-tpl-066", "mf-tpl-005", "mf-tpl-061", "mf-tpl-067"],
      agent_signal: {
        use_when:
          "Budget or CFO review on support cost. Channel mix shifting. Need cost per call/email/RMA not FTE vibes.",
        decision_criteria: [
          "Unit cost = labor burden / event volume per period.",
          "Track channels separately.",
          "Pair with forecast variance for volume denominator.",
        ],
        operator_context: "Unit economics wins backbone argument in budget fights.",
        tags: ["unit-economics", "budget", "support-ops"],
      },
    },
    templates: [
      {
        id: "build-unit-table",
        use_when: "unit-cost-build",
        body: "UNIT ECONOMICS TABLE · Period _______\n\nInbound calls: ___  Outbound: ___  Emails: ___  RMAs: ___\nLabor burden ($): _______________\nCost per inbound call: ___  per email: ___  per RMA: ___\nNotes: _______________",
      },
      {
        id: "channel-mix-review",
        use_when: "channel-shift",
        body: "CHANNEL MIX REVIEW\nPeriod: _______\n\nCall volume Δ: ___%  Email volume Δ: ___%\nUnit cost impact: _______________\nAction: _______________",
      },
      {
        id: "backbone-brief",
        use_when: "budget-defense",
        body: "SUPPORT BACKBONE BRIEF (for finance)\n\nUnit costs attached. High-touch segment cost per event: ___\nCut risk: _______________\nAsk: _______________",
      },
      {
        id: "labor-burden-row",
        use_when: "unit-cost-build",
        body: "LABOR BURDEN ROW\nPeriod: _______  Source: payroll + burden rate\nTotal support labor: $_______________\nExcludes: trainers/managers [ ] Y [ ] N",
      },
    ],
    examples: [
      {
        id: "ex-cfo-review",
        context: "CFO challenged support growth without event denominator.",
        branch: "unit-cost-build",
        templates_used: ["build-unit-table", "labor-burden-row"],
        resolution: "Unit table in budget deck. Headcount held.",
        log_row: "2026-Q3,18200,4200,890,319176,17.5",
      },
      {
        id: "ex-email-shift",
        context: "Email volume up 40%. Calls flat. Staff flat.",
        branch: "channel-shift",
        templates_used: ["channel-mix-review"],
        resolution: "Email cost per event lower; shifted hiring to async specialists.",
        log_row: "2026-H1,email+40%,calls-flat,cpu-down",
      },
    ],
    agentMd:
      "1. Build **build-unit-table** quarterly.\n2. Channel mix move → **channel-mix-review**.\n3. Finance fight → **backbone-brief**.\n4. Pair **mf-tpl-066** for volume forecast denominator.",
  },
  {
    id: "mf-tpl-066",
    slug: "call-forecast-variance",
    title: "Call Forecast Variance Playbook",
    mission:
      "Assumptions to forecast to actual variance to staffing schedule by queue. Capacity skeleton, not 31-tab chaos.",
    teaserExample: {
      context: "Forecast missed actual by 22% on server queue. Overtime surprise.",
      branch: "variance-review",
      resolution: "Assumption row updated. Schedule aligned in two weeks.",
      log_row: "2026-Wk24,queue-server,forecast-420,actual-512,var-22%,assumption-ship-rate",
    },
    teaserBullets: [
      "Forecast assumption registry",
      "Weekly forecast vs actual by queue",
      "Staffing schedule tie-in",
    ],
    pairs: ["mf-tpl-062", "mf-tpl-063", "mf-tpl-065"],
    tags: ["forecast", "capacity", "support-ops"],
    playbook: {
      description:
        "Document call assumptions, forecast by queue, compare actuals weekly, adjust staffing schedule. Variance before overtime.",
      mindset: {
        principle: "Forecast is a hypothesis. Variance review is the scientific method.",
        mistakes: [
          {
            id: "forecast-once",
            label: "Annual forecast never reconciled",
            cost: "Overtime surprises; ASA breaks in one queue only",
          },
          {
            id: "assumptions-hidden",
            label: "Calls per ship or install not written",
            cost: "No one knows what to fix when actuals miss",
          },
        ],
      },
      assumption_types: [
        "calls_per_unit_shipped",
        "calls_per_install",
        "seasonality_factor",
        "new_product_ramp",
        "channel_mix",
      ],
      decision_branches: [
        { id: "build-forecast", situation: "No written forecast model", action: "assumption-registry" },
        { id: "variance-review", situation: "Actuals diverge from forecast", action: "variance-memo" },
        { id: "schedule-adjust", situation: "Sustained positive variance", action: "staffing-schedule-patch" },
      ],
      tracking: {
        csv_header: "fiscal_week,queue,forecast_calls,actual_calls,variance_pct,assumption_note",
        sheet_tab_name: "forecast_variance",
      },
      related_artifacts: ["mf-tpl-062", "mf-tpl-063", "mf-tpl-065", "mf-tpl-064"],
      agent_signal: {
        use_when:
          "Call forecast exists but actuals diverge. Overtime or ASA miss tied to one queue. Assumptions not documented.",
        decision_criteria: [
          "Write assumptions before forecast numbers.",
          "Weekly variance by queue, not company total only.",
          "Patch staffing schedule when variance sustains 4+ weeks.",
        ],
        operator_context: "Variance review connects queue map and volume actuals to schedules.",
        tags: ["forecast", "capacity", "support-ops"],
      },
    },
    templates: [
      {
        id: "assumption-registry",
        use_when: "build-forecast",
        body: "FORECAST ASSUMPTION REGISTRY\nQueue: _______________\n\nAssumption: _______________  Value: ___  Source: _______________\nOwner: _______________  Review date: _______",
      },
      {
        id: "variance-memo",
        use_when: "variance-review",
        body: "FORECAST VARIANCE MEMO\nWeek: _______  Queue: _______________\nForecast: ___  Actual: ___  Variance: ___%\n\nLikely assumption broken: _______________\nFix: _______________",
      },
      {
        id: "staffing-schedule-patch",
        use_when: "schedule-adjust",
        body: "STAFFING SCHEDULE PATCH\nQueue: _______________  Effective: _______\n\nChange: _______________\nLinked assumption update: _______________\nASA goal check in 2 weeks: _______",
      },
      {
        id: "forecast-summary-row",
        use_when: "build-forecast",
        body: "FORECAST SUMMARY ROW\nPeriod: _______  Queue: _______________\nForecast calls: ___  Staff hours planned: ___  AHT assumption: ___",
      },
    ],
    examples: [
      {
        id: "ex-server-miss",
        context: "Server queue actuals 22% over forecast. Overtime spike.",
        branch: "variance-review",
        templates_used: ["variance-memo", "assumption-registry"],
        resolution: "Ship-rate assumption updated. Schedule patched.",
        log_row: "2026-Wk24,server,420,512,22%,ship-rate",
      },
      {
        id: "ex-vending-ramp",
        context: "New product ramp. Consumer queue underestimated.",
        branch: "schedule-adjust",
        templates_used: ["staffing-schedule-patch", "forecast-summary-row"],
        resolution: "Temp staff added. Ramp assumption logged.",
        log_row: "2026-Wk08,consumer,1800,2100,17%,new-sku",
      },
    ],
    agentMd:
      "1. **assumption-registry** before numbers.\n2. Weekly **variance-memo** per queue.\n3. Sustained miss → **staffing-schedule-patch**.\n4. Pair **mf-tpl-062** queue names and **mf-tpl-063** actuals.",
  },
  {
    id: "mf-tpl-067",
    slug: "rd-support-bridge",
    title: "R&D Support Bridge Playbook",
    mission:
      "Field signal from support into engineering. Spec, build, verify loop. Bridge role before product drift.",
    teaserExample: {
      context: "Support knew failure mode months before engineering prioritized fix.",
      branch: "signal-escalation",
      resolution: "Bridge log created. Defect fix shipped. QBR cited field signal.",
      log_row: "2026-04,BR-102,fail-mode-thermal,eng-p2,verified-fix",
    },
    teaserBullets: [
      "Field signal intake from support",
      "Engineering handoff with repro steps",
      "Verify loop when fix ships",
    ],
    pairs: ["mf-tpl-059", "mf-tpl-060", "mf-tpl-061"],
    tags: ["cross-functional", "product-quality", "support-ops"],
    playbook: {
      description:
        "Structured loop: support captures field signal, engineering specs fix, verification closes loop. Bridge role connects backend support to product.",
      mindset: {
        principle:
          "Backend support is the backbone. Engineering without field signal builds the wrong thing confidently.",
        mistakes: [
          {
            id: "ticket-black-hole",
            label: "Support tickets never reach engineering taxonomy",
            cost: "Repeat failures; support blamed for smoke",
          },
          {
            id: "throw-over-wall",
            label: "Handoff without repro or frequency",
            cost: "Engineering cannot prioritize; bridge burns out",
          },
          {
            id: "no-verify-close",
            label: "Fix ships without support verification",
            cost: "Regression hits field again; trust dies",
          },
        ],
      },
      bridge_roles: [
        "capture field pattern not one-off anecdote",
        "quantify frequency and customer tier impact",
        "translate support language to engineering spec",
        "verify fix on bench and on representative returns",
      ],
      decision_branches: [
        { id: "pattern-detected", situation: "Repeat field issue not in known defects", action: "bridge-signal-row" },
        { id: "signal-escalation", situation: "High tier customer or safety angle", action: "engineering-handoff" },
        { id: "fix-shipped", situation: "Engineering released fix", action: "verify-close-loop" },
        { id: "volume-consumer-drift", situation: "Org chases volume over margin quality", action: "backbone-risk-memo" },
      ],
      related_artifacts: ["mf-tpl-059", "mf-tpl-060", "mf-tpl-061", "mf-tpl-065"],
      agent_signal: {
        use_when:
          "Support sees field pattern engineering lacks. Bridge role between support and R&D. Verify loop after fix ships.",
        decision_criteria: [
          "Log pattern with frequency before escalation.",
          "Handoff includes repro and customer tier impact.",
          "Close loop with verification, not announcement email.",
        ],
        operator_context:
          "Bridge role prevents product drift when org chases volume over quality backbone.",
        tags: ["cross-functional", "product-quality", "support-ops"],
      },
    },
    templates: [
      {
        id: "bridge-signal-row",
        use_when: "pattern-detected",
        body: "BRIDGE SIGNAL ROW\nID: _______________  Date: _______\nField pattern: _______________\nFrequency (30d): ___  Customer tier impact: _______________\nSupport evidence: _______________",
      },
      {
        id: "engineering-handoff",
        use_when: "signal-escalation",
        body: "ENGINEERING HANDOFF\nSignal ID: _______________\n\nRepro steps: _______________\nLogs/samples: _______________\nSuggested priority: _______________\nSupport bridge owner: _______________",
      },
      {
        id: "verify-close-loop",
        use_when: "fix-shipped",
        body: "VERIFY CLOSE LOOP\nFix ID: _______________  Ship date: _______\n\nBench result: _______________\nReturn sample retest: _______________\nSupport comms ready: Y/N  QBR note: Y/N",
      },
      {
        id: "backbone-risk-memo",
        use_when: "volume-consumer-drift",
        body: "BACKBONE RISK MEMO (internal)\n\nObservation: _______________\nField signal ignored: _______________\nMargin/quality risk: _______________\nAsk leadership: _______________",
      },
      {
        id: "field-to-spec-translate",
        use_when: "signal-escalation",
        body: "FIELD TO SPEC TRANSLATE\nCustomer words: _______________\nEngineering spec line: _______________\nAcceptance test: _______________",
      },
    ],
    examples: [
      {
        id: "ex-thermal-pattern",
        context: "Support saw thermal fail pattern. Engineering backlog ignored it.",
        branch: "signal-escalation",
        templates_used: ["bridge-signal-row", "engineering-handoff"],
        resolution: "Prioritized fix. Verification closed loop.",
        log_row: "2026-04,BR-102,thermal,12-cases,eng-p2,fixed",
      },
      {
        id: "ex-return-verify",
        context: "Fix shipped for storage controller. Returns continued.",
        branch: "fix-shipped",
        templates_used: ["verify-close-loop"],
        resolution: "Retest found incomplete firmware. Second fix verified.",
        log_row: "2026-06,FIX-88,retest-fail,FW-2,verified",
      },
      {
        id: "ex-shadow-bridge",
        context: "Shadow expert held tribal knowledge. No engineering taxonomy.",
        branch: "pattern-detected",
        templates_used: ["bridge-signal-row", "field-to-spec-translate"],
        resolution: "Paired mf-tpl-059 mining with bridge log. KB article shipped.",
        log_row: "2026-05,BR-201,tribal-kb,59+67,shipped",
      },
    ],
    agentMd:
      "1. Repeat field pattern → **bridge-signal-row**.\n2. Escalate with **engineering-handoff** + **field-to-spec-translate**.\n3. Fix shipped → **verify-close-loop**.\n4. Pair **mf-tpl-059** and **mf-tpl-060** for expert and return truth.",
  },
];

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
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
      <p class="sub">ENTRY: ${p.id} · SECTION: templates · agent audience</p>
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

const SLUG_LOOKUP = Object.fromEntries(PACKS.map((p) => [p.id, p.slug]));
function SLUG_FROM_PAIR(id) {
  return SLUG_LOOKUP[id] || id.replace("mf-tpl-", "").replace("mf-tool-", "");
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
  return `# ${p.id} · ${p.title} · Agent guide

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
    ...p.playbook,
    agent_signal: {
      ...p.playbook.agent_signal,
      version: "1.2",
      not_for: "Generic job spine comms unless support ops backbone is the blocker.",
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

// manifest entries
const manifestPath = path.join(MF, "catalog-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const newEntries = PACKS.map((p) => ({
  id: p.id,
  section: "templates",
  title: p.title,
  price: "$0.08",
  teaser: `templates/${p.slug}/`,
  full: `templates/${p.slug}/full/`,
  primary: "playbook.json",
  apply: p.playbook.process
    ? p.playbook.process.steps.map((s) => s.name).slice(0, 3).join(" → ")
    : "branch → template → log",
  description: p.playbook.agent_signal.use_when.slice(0, 100),
  tags: p.tags,
  use_when: p.playbook.agent_signal.use_when,
  not_for: "Generic job spine comms unless support ops backbone is the blocker.",
  pairs_with: p.playbook.related_artifacts.slice(0, 4),
  trigger_phrases: [
    p.playbook.agent_signal.use_when.slice(0, 80),
    `Need playbook: ${p.title}`,
  ],
  agent_signal_version: "1.2",
}));

const existingIds = new Set(manifest.entries.map((e) => e.id));
for (const e of newEntries) {
  if (!existingIds.has(e.id)) manifest.entries.push(e);
}
manifest.entry_count = manifest.entries.length;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest entry_count:", manifest.entry_count);

// index.html articles
const indexPath = path.join(MF, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");
const marker = "</main>";
const articles = PACKS.map(
  (p) =>
    `<article class="entry" id="${p.id}"><p class="entry-id">ENTRY: ${p.id}</p><h3>${p.title}</h3><dl class="kv"><dt>TEASER</dt><dd><a href="templates/${p.slug}/">${p.slug}/</a></dd><dt>FULL</dt><dd><a href="templates/${p.slug}/full/">full/</a> · $0.08</dd></dl></article>`
).join("\n");
if (!indexHtml.includes('id="mf-tpl-061"')) {
  indexHtml = indexHtml.replace(marker, articles + "\n" + marker);
  fs.writeFileSync(indexPath, indexHtml);
}

// worker routes
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

console.log("done build-support-backbone-061-067");