#!/usr/bin/env node
/**
 * Build NDF field-pattern packs mf-tpl-073..078 from support ops field patterns.
 * Complements mf-tpl-060 (return verification signal) — does not replace it.
 * Local only: updates pack dirs, manifest, index articles, worker gates.
 * After run: node scripts/generate-openapi.mjs ; node scripts/generate-well-known-x402.mjs
 * No push.
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
  "mf-tpl-059": "shadow-expert-mining",
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
};

const PACKS = [
  {
    id: "mf-tpl-073",
    slug: "ndf-metric-gaming",
    title: "NDF Metric Gaming Playbook",
    mission:
      "When NDF tracking starts, support routes around the scoreboard. Find untested or auto-credit SKUs and close the game.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "NDF program live. One power-supply SKU spikes outbound while NDF looks fine on tested commodities.",
      branch: "untested-sku-route",
      resolution:
        "SKU marked must-test. Auto-credit path closed. Shotgun volume dropped in two weeks.",
      log_row: "2026-W12,SKU-PWS-X,untested-path,closed,must-test,owner",
    },
    teaserBullets: [
      "Map which returns hit the bench vs auto-credit",
      "Spot scoreboard workarounds (parts that never test)",
      "Close the game without killing legitimate replace",
    ],
    pairs: ["mf-tpl-060", "mf-tpl-074", "mf-tpl-078", "mf-tpl-065"],
    tags: ["field-patterns", "ndf", "incentives", "support-ops"],
    playbook: {
      description:
        "Detect and close metric gaming after NDF (no-defect-found) tracking: techs route replacements through SKUs that skip test or auto-credit.",
      mindset: {
        principle:
          "The minute a metric scores people, rational techs find the hole. Design the scoreboard or they will design the workaround.",
        mistakes: [
          {
            id: "score-without-coverage",
            label: "Publish NDF by tech without mapping which SKUs are tested",
            cost: "Volume shifts to untested parts; metric looks better while waste rises",
          },
          {
            id: "blame-only",
            label: "Punish techs for gaming without fixing the hole",
            cost: "New hole appears next week; trust dies",
          },
          {
            id: "all-parts-free",
            label: "Leave auto-credit or no-test paths open on notorious SKUs",
            cost: "When in doubt, throw the free part becomes culture",
          },
        ],
      },
      gaming_signals: [
        {
          id: "sku-mix-shift",
          label: "Outbound mix shifts to SKUs known not to hit NDF bench",
        },
        {
          id: "ndf-down-waste-up",
          label: "NDF rate improves while parts cost or RMA volume climbs",
        },
        {
          id: "floor-lore",
          label: "Floor talk names a SKU as safe to send",
        },
        {
          id: "back-end-skip",
          label: "RMA or depot skips test and ships to vendor for credit",
        },
      ],
      decision_branches: [
        {
          id: "start-coverage-map",
          situation: "NDF tracking exists but test coverage by SKU is unknown",
          action: "sku-test-coverage-map",
        },
        {
          id: "untested-sku-route",
          situation: "One SKU volume spikes after NDF scoring starts",
          action: "close-untested-path",
        },
        {
          id: "auto-credit-hole",
          situation: "Back end auto-credits a commodity without test",
          action: "must-test-policy",
        },
        {
          id: "floor-lore-confirm",
          situation: "Techs describe a safe part to throw",
          action: "lore-to-data-check",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Map test coverage by SKU family",
            goal: "Know what hits the bench vs skips",
            minutes: "60",
          },
          {
            id: 2,
            name: "Compare outbound mix pre/post NDF score",
            goal: "Find shift to untested paths",
            minutes: "45",
          },
          {
            id: 3,
            name: "Close holes (must-test or remove auto-credit)",
            goal: "Same rules for all high-volume FRUs",
            minutes: "ongoing",
          },
          {
            id: 4,
            name: "Re-measure NDF and parts cost together",
            goal: "Metric and waste move in the open",
            minutes: "weekly",
          },
        ],
      },
      tracking: {
        csv_header:
          "week,sku_family,outbound_qty,tested_qty,skip_or_auto_credit_qty,ndf_pct,notes,owner",
        sheet_tab_name: "ndf_metric_gaming",
      },
      related_artifacts: [
        "mf-tpl-060",
        "mf-tpl-074",
        "mf-tpl-078",
        "mf-tpl-065",
      ],
      agent_signal: {
        use_when:
          "NDF scoring started and outbound mix shifted to certain SKUs. Suspect untested or auto-credit paths. Need to close gaming without pure blame.",
        decision_criteria: [
          "Map test coverage before scoring individuals hard.",
          "Treat untested/auto-credit SKUs as scoreboard holes.",
          "Pair NDF % with parts cost so green metrics cannot hide waste.",
        ],
        operator_context:
          "Field pattern: support always follows incentives. Measure creates the next game unless coverage is designed.",
        tags: ["field-patterns", "ndf", "incentives", "support-ops"],
      },
    },
    templates: [
      {
        id: "sku-test-coverage-map",
        use_when: "start-coverage-map",
        body: "SKU TEST COVERAGE MAP\nPeriod: _______\n\nSKU family | Hits bench Y/N | Auto-credit Y/N | Owner path\n___________ | ___ | ___ | _______________\n___________ | ___ | ___ | _______________\n\nHoles (skip test or free credit): _______________\nOwner: _______________",
      },
      {
        id: "close-untested-path",
        use_when: "untested-sku-route",
        body: "CLOSE UNTESTED PATH\nSKU: _______________  Date: _______\n\nSignal: volume shift / lore / cost\nCurrent path: [ ] bench  [ ] skip  [ ] auto-credit vendor\nChange: _______________\nEffective: _______  Comms to floor: Y/N\nSuccess metric (2 wk): NDF ___  Parts cost ___  Outbound mix ___",
      },
      {
        id: "must-test-policy",
        use_when: "auto-credit-hole",
        body: "MUST-TEST POLICY ROW\nCommodity: _______________\n\nOld rule: _______________\nNew rule: all returns in family hit protocol ___ before credit/restock\nExceptions (written): _______________\nRMA owner sign-off: _______________",
      },
      {
        id: "lore-to-data-check",
        use_when: "floor-lore-confirm",
        body: "FLOOR LORE TO DATA\nLore heard: _______________\nSKU named: _______________\n\nLast 8 weeks outbound: ___  Tested: ___  NDF if tested: ___\nConclusion: [ ] hole real  [ ] lore only  [ ] real defect (see mf-tpl-077)\nAction: _______________",
      },
      {
        id: "gaming-week-row",
        use_when: "untested-sku-route",
        body: "GAMING WATCH ROW\nWeek: _______  SKU: _______________\nOutbound: ___  Tested: ___  Skip/auto: ___  NDF%: ___\nNotes: _______________",
      },
    ],
    examples: [
      {
        id: "ex-pws-untested",
        context:
          "After NDF scoring, power-supply outbound climbed. Bench rarely saw them; vendor credit path was open.",
        branch: "untested-sku-route",
        templates_used: ["close-untested-path", "must-test-policy"],
        resolution:
          "Must-test on that family. Shotgun slowed. NDF and cost read together in weekly ops.",
        log_row: "2026-W12,PWS-fam,must-test,closed-auto-credit,ok",
      },
      {
        id: "ex-coverage-map-first",
        context: "Leadership wanted NDF leaderboard by tech. Coverage map did not exist.",
        branch: "start-coverage-map",
        templates_used: ["sku-test-coverage-map"],
        resolution:
          "Map first. Three commodity holes found. Leaderboard delayed until holes closed.",
        log_row: "2026-W08,coverage-map,3-holes,leaderboard-held",
      },
      {
        id: "ex-print-redo-skip",
        context:
          "Print shop tracked redo NDF. One finish type never re-inspected; techs always re-ran that finish.",
        branch: "floor-lore-confirm",
        templates_used: ["lore-to-data-check", "close-untested-path"],
        resolution:
          "Mandatory re-inspect on that finish. Redo rate honest again.",
        log_row: "2026-W15,finish-X,reinspect-on,redo-down",
      },
      {
        id: "ex-vending-board",
        context:
          "Vending control boards returned without bench test when depot was busy.",
        branch: "auto-credit-hole",
        templates_used: ["must-test-policy", "gaming-week-row"],
        resolution:
          "Busy is not a skip reason. Sample audit weekly.",
        log_row: "2026-W20,MDB,must-test,audit-weekly",
      },
    ],
    agentMd:
      "1. Before hard NDF dings → **sku-test-coverage-map**.\n2. SKU volume spike post-metric → **close-untested-path** + **must-test-policy**.\n3. Floor lore → **lore-to-data-check** (if real defect, hand to **mf-tpl-077**).\n4. Pair **mf-tpl-060** for outcome log; **mf-tpl-078** for incentive design.",
  },
  {
    id: "mf-tpl-074",
    slug: "rma-test-credibility",
    title: "RMA Test Credibility Playbook",
    mission:
      "Support will not trust NDF scores if the back-end test is weak or run by a lower-status lane. Standardize the bench so the metric can stand.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Phone techs dispute every NDF. Bench process varies by shift. Shipping owns RMA.",
      branch: "standardize-protocol",
      resolution:
        "Written protocol, sample audit, joint review. NDF disputes drop.",
      log_row: "2026-W10,protocol-v2,audit-12,joint-review,ok",
    },
    teaserBullets: [
      "Standard RMA / verification protocol",
      "Status bridge: support vs depot/shipping test",
      "Fair metric proof when scores ding support",
    ],
    pairs: ["mf-tpl-060", "mf-tpl-073", "mf-tpl-067", "mf-tpl-061"],
    tags: ["field-patterns", "ndf", "rma", "support-ops"],
    playbook: {
      description:
        "Make return verification credible enough that support accepts NDF scores: standard protocol, audit, and joint ownership between phone and bench.",
      mindset: {
        principle:
          "A metric owned by a lane support does not respect will be gamed or ignored. Credibility is process, not rank.",
        mistakes: [
          {
            id: "ad-hoc-bench",
            label: "Each tester runs a different path",
            cost: "Support correctly rejects the score",
          },
          {
            id: "status-warfare",
            label: "Phone engineers scored by lowest-tier shipping only",
            cost: "Political fight replaces root cause work",
          },
          {
            id: "no-sample-audit",
            label: "Never re-check the checker",
            cost: "Bad tests hide real defects and fake NDFs",
          },
        ],
      },
      credibility_pillars: [
        "Written test protocol per commodity family",
        "Same protocol across shifts and sites",
        "Sample audit of tester decisions",
        "Joint review forum support + RMA/verification",
        "Proof packet when a person is dinged",
      ],
      decision_branches: [
        {
          id: "dispute-wave",
          situation: "Support rejects NDF results en masse",
          action: "credibility-gap-review",
        },
        {
          id: "standardize-protocol",
          situation: "Protocols differ by shift or person",
          action: "protocol-lock",
        },
        {
          id: "status-conflict",
          situation: "Phone lane resents depot/shipping ownership of score",
          action: "joint-ownership-charter",
        },
        {
          id: "ding-with-proof",
          situation: "Individual or team dinged on NDF",
          action: "metric-proof-packet",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Inventory current test paths",
            goal: "See variance",
            minutes: "90",
          },
          {
            id: 2,
            name: "Lock protocol per family",
            goal: "One written path",
            minutes: "half-day",
          },
          {
            id: 3,
            name: "Stand up sample audit",
            goal: "Check the checker",
            minutes: "weekly",
          },
          {
            id: 4,
            name: "Joint review cadence",
            goal: "Support + bench share cases",
            minutes: "biweekly",
          },
        ],
      },
      tracking: {
        csv_header:
          "week,protocol_id,tests_run,sample_audits,audit_disagree_pct,joint_reviews,owner",
        sheet_tab_name: "rma_test_credibility",
      },
      related_artifacts: [
        "mf-tpl-060",
        "mf-tpl-073",
        "mf-tpl-067",
        "mf-tpl-061",
      ],
      agent_signal: {
        use_when:
          "Support disputes NDF or return scores. Bench process is inconsistent. Phone vs shipping/RMA status fight. Need standard protocol and proof.",
        decision_criteria: [
          "No hard NDF ding without cited protocol version.",
          "Sample-audit the bench; do not assume perfection.",
          "Joint ownership reduces status warfare.",
        ],
        operator_context:
          "Field pattern: NDF programs fail when verification is not credible to the people scored.",
        tags: ["field-patterns", "ndf", "rma", "support-ops"],
      },
    },
    templates: [
      {
        id: "credibility-gap-review",
        use_when: "dispute-wave",
        body: "CREDIBILITY GAP REVIEW\nDate: _______\n\nTop dispute themes: _______________\nProtocol variance found: _______________\nStatus issue (who scores whom): _______________\nActions: _______________\nOwner: _______________",
      },
      {
        id: "protocol-lock",
        use_when: "standardize-protocol",
        body: "PROTOCOL LOCK\nFamily: _______________  Protocol ID: _______  Rev: ___\n\nSteps (ordered): _______________\nPass/fail criteria: _______________\nEquipment required: _______________\nEffective date: _______  Train-by date: _______",
      },
      {
        id: "joint-ownership-charter",
        use_when: "status-conflict",
        body: "JOINT OWNERSHIP CHARTER\nSupport lead: _______________  Bench/RMA lead: _______________\n\nShared forum: cadence ___  Attendees: _______________\nWho can change protocol: _______________\nHow dings are appealed: _______________",
      },
      {
        id: "metric-proof-packet",
        use_when: "ding-with-proof",
        body: "METRIC PROOF PACKET\nPerson/team: _______________  Period: _______\n\nReturn IDs: _______________\nProtocol ID/rev: _______________\nTester: _______________  Outcome: _______________\nSample audit on these? Y/N\nDecision: [ ] uphold  [ ] adjust  [ ] retest",
      },
      {
        id: "sample-audit-row",
        use_when: "standardize-protocol",
        body: "SAMPLE AUDIT ROW\nWeek: _______  Original tester: _______________  Auditor: _______________\nReturn ID: _______  Agree Y/N  Notes: _______________",
      },
    ],
    examples: [
      {
        id: "ex-shipping-owned-ndf",
        context:
          "RMA sat under shipping. Phone techs rejected every NDF. Protocols differed by shift.",
        branch: "standardize-protocol",
        templates_used: ["protocol-lock", "joint-ownership-charter"],
        resolution:
          "Locked protocols and biweekly joint review. Dispute rate fell.",
        log_row: "2026-W10,prot-v2,joint-biweekly,disputes-down",
      },
      {
        id: "ex-ding-proof",
        context: "Tech dinged on high NDF. No protocol citation on file.",
        branch: "ding-with-proof",
        templates_used: ["metric-proof-packet", "sample-audit-row"],
        resolution:
          "Ding held only on audited cases. Process fixed for rest.",
        log_row: "2026-W14,ding-partial,audit-3,adjust-2",
      },
      {
        id: "ex-vending-bench",
        context: "Field techs and depot argued over control board fails.",
        branch: "dispute-wave",
        templates_used: ["credibility-gap-review", "protocol-lock"],
        resolution: "Shared protocol photo steps. Argument moved to data.",
        log_row: "2026-W18,MDB-prot,photos,ok",
      },
    ],
    agentMd:
      "1. Dispute wave → **credibility-gap-review**.\n2. Variance → **protocol-lock** + **sample-audit-row**.\n3. Status fight → **joint-ownership-charter**.\n4. Any ding → **metric-proof-packet** with protocol rev.\n5. Pair **mf-tpl-060** return log; **mf-tpl-073** if gaming after scores stick.",
  },
  {
    id: "mf-tpl-075",
    slug: "account-ndf-healthcheck",
    title: "Account NDF Healthcheck Playbook",
    mission:
      "Turn internal NDF into customer-facing account health: share their return pattern, push back on part-swap theater, productize monthly reports with sales.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Large account burns parts. Their IT swaps hardware instead of troubleshooting. Internal team afraid to push back.",
      branch: "account-data-pushback",
      resolution:
        "Account NDF pack shared. Process coaching agreed. False fail volume down.",
      log_row: "2026-Q2,ACCT-LGE,ndf-42pct,pushback,coaching,ok",
    },
    teaserBullets: [
      "Account-level NDF and fail mix",
      "Pushback script for VIP / self-serve geniuses",
      "Monthly healthcheck with sales ownership",
    ],
    pairs: ["mf-tpl-060", "mf-tpl-067", "mf-tpl-001", "mf-tpl-020"],
    tags: ["field-patterns", "ndf", "enterprise", "support-ops"],
    playbook: {
      description:
        "Build account-level NDF healthchecks for large customers: data pack, careful pushback when they part-swap, and proactive monthly reports via sales.",
      mindset: {
        principle:
          "VIP silence is expensive. Their own return data is the adult conversation, not a blame slide.",
        mistakes: [
          {
            id: "open-spigot",
            label: "Always ship parts for important accounts with no pattern review",
            cost: "Problem shifts (HW vs SW vs vendor); nobody fixed",
          },
          {
            id: "gotcha-meeting",
            label: "Surprise the customer with NDF shaming",
            cost: "Relationship damage; data ignored",
          },
          {
            id: "support-only-silo",
            label: "Keep NDF internal; sales never carries health story",
            cost: "Renewal narrative stays vibe-based",
          },
        ],
      },
      healthcheck_slices: [
        "confirmed_fail_vs_ndf_rate",
        "top_sku_families",
        "repeat_site_or_user_patterns",
        "time_to_troubleshoot_vs_immediate_replace",
        "open_actions_both_sides",
      ],
      decision_branches: [
        {
          id: "vip-part-swap",
          situation: "Important account high volume, high NDF, low real fix rate",
          action: "account-data-pushback",
        },
        {
          id: "build-monthly",
          situation: "Large accounts get no proactive return health story",
          action: "monthly-healthcheck-template",
        },
        {
          id: "sales-carry",
          situation: "Support has data; sales owns relationship",
          action: "sales-enable-brief",
        },
        {
          id: "customer-genius",
          situation: "Customer IT insists diagnosis is always hardware",
          action: "evidence-first-script",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Roll account return outcomes",
            goal: "Fail vs NDF vs inconclusive",
            minutes: "45",
          },
          {
            id: 2,
            name: "Draft health one-pager",
            goal: "Facts + joint actions",
            minutes: "30",
          },
          {
            id: 3,
            name: "Align sales before send",
            goal: "No surprise attack",
            minutes: "20",
          },
          {
            id: 4,
            name: "Review actions next cycle",
            goal: "Close loop",
            minutes: "monthly",
          },
        ],
      },
      tracking: {
        csv_header:
          "period,account_id,returns,confirmed_fail,ndf,ndf_pct,top_family,actions_open,owner",
        sheet_tab_name: "account_ndf_health",
      },
      related_artifacts: [
        "mf-tpl-060",
        "mf-tpl-067",
        "mf-tpl-001",
        "mf-tpl-020",
      ],
      agent_signal: {
        use_when:
          "Large or VIP account burns parts with high NDF. Need pushback with their data. Want monthly healthcheck sales can carry.",
        decision_criteria: [
          "Account rollup before confrontation.",
          "Sales aligned before customer sees the pack.",
          "Actions are joint (their process + your support rules).",
        ],
        operator_context:
          "Field pattern: enterprise part-swap theater ends when account NDF is shared calmly and repeatedly.",
        tags: ["field-patterns", "ndf", "enterprise", "support-ops"],
      },
    },
    templates: [
      {
        id: "account-data-pushback",
        use_when: "vip-part-swap",
        body: "ACCOUNT NDF PUSHBACK PREP\nAccount: _______________  Period: _______\n\nReturns: ___  Confirmed fail: ___  NDF: ___  NDF%: ___\nPattern (sites/users/SKUs): _______________\nAsk of customer: _______________\nOffer from us: _______________\nSales ally: _______________  Meeting date: _______",
      },
      {
        id: "monthly-healthcheck-template",
        use_when: "build-monthly",
        body: "MONTHLY NDF HEALTHCHECK\nAccount: _______________  Month: _______\n\n1) Outcome mix (fail / NDF / other): ___\n2) Top families: _______________\n3) What improved vs last month: _______________\n4) Open joint actions: _______________\n5) Next review: _______\n\nTone: health, not gotcha.",
      },
      {
        id: "sales-enable-brief",
        use_when: "sales-carry",
        body: "SALES ENABLE BRIEF (NDF HEALTH)\nAccount: _______________\n\nOne sentence: _______________\nChart to show: _______________\nDo not say: _______________\nAsk for: _______________\nSupport backup on call: Y/N",
      },
      {
        id: "evidence-first-script",
        use_when: "customer-genius",
        body: "EVIDENCE-FIRST SCRIPT\n\nWe tested returned units under protocol ___. Outcome mix: ___.\nWe are not saying your team is wrong on every case.\nWe are saying pattern X points to process/environment/SW as often as HW.\nProposed next step: _______________",
      },
      {
        id: "account-health-row",
        use_when: "build-monthly",
        body: "ACCOUNT HEALTH ROW\nPeriod: _______  Account: _______________\nReturns: ___  Fail: ___  NDF: ___  NDF%: ___\nOwner: _______________  Report sent: Y/N",
      },
    ],
    examples: [
      {
        id: "ex-large-it-swap",
        context:
          "Large commercial IT swapped parts on sight. Support volume high. Confirmed fail rate low on returns.",
        branch: "account-data-pushback",
        templates_used: ["account-data-pushback", "evidence-first-script"],
        resolution:
          "Joint troubleshooting standard agreed. Parts volume down; real fails clearer.",
        log_row: "2026-Q2,ACCT-A,ndf-high,joint-std,ok",
      },
      {
        id: "ex-monthly-productized",
        context: "Support had NDF; sales only heard complaints at renewal.",
        branch: "sales-carry",
        templates_used: ["sales-enable-brief", "monthly-healthcheck-template"],
        resolution:
          "Monthly healthcheck on top accounts. Renewal narrative included ops proof.",
        log_row: "2026-Q3,top-12,monthly-hc,sales-owned",
      },
      {
        id: "ex-gov-adjacent-scrubbed",
        context:
          "Institutional account with strong on-site techs. High HDD replace claims. Lab mostly NDF.",
        branch: "customer-genius",
        templates_used: ["evidence-first-script", "account-data-pushback"],
        resolution:
          "Data meeting after site process review (see mf-tpl-076). Customer process changes landed.",
        log_row: "2026-W22,INST-1,site+data,process-fix",
      },
    ],
    agentMd:
      "1. VIP burn → **account-data-pushback** with rollup.\n2. Standing program → **monthly-healthcheck-template** + **account-health-row**.\n3. Sales owns relationship → **sales-enable-brief** before send.\n4. Customer IT certainty → **evidence-first-script**.\n5. Pair **mf-tpl-060** for raw outcomes; **mf-tpl-076** if site process is the real fail.",
  },
  {
    id: "mf-tpl-076",
    slug: "site-process-discovery",
    title: "Site Process Discovery Playbook",
    mission:
      "Before the big data meeting, watch their process. Customer-caused failures often look like hardware until you see the floor.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Account claims mass drive failure. Vendor blamed. Visit finds forced mass update and hard power-offs at end of day.",
      branch: "site-observation",
      resolution:
        "Process root cause presented with bench-good evidence. Replace policy and shutdown practice changed.",
      log_row: "2026-W22,site-visit,update-push+hard-power,hdd-ndf,exec-brief",
    },
    teaserBullets: [
      "Observe before the slide deck",
      "Separate HW fail from process/OS damage",
      "Exec-ready root cause without theater",
    ],
    pairs: ["mf-tpl-075", "mf-tpl-060", "mf-tpl-067", "mf-tpl-001"],
    tags: ["field-patterns", "ndf", "site-visit", "root-cause"],
    playbook: {
      description:
        "Run a site process discovery before blaming hardware or support: observe, earn trust, match bench results to local process, present root cause to decision makers.",
      mindset: {
        principle:
          "Data without floor context loses. Floor without data is anecdote. Do both, in that order when politics are hot.",
        mistakes: [
          {
            id: "slides-first",
            label: "Present NDF charts before watching their process",
            cost: "They reject the data; you miss the real cause",
          },
          {
            id: "hw-default",
            label: "Treat every field failure as parts failure",
            cost: "Replace loops, vendor fights, customer still broken",
          },
          {
            id: "shame-room",
            label: "Publicly embarrass local techs without a fix path",
            cost: "You win the room and lose the account",
          },
        ],
      },
      common_false_hw_patterns: [
        {
          id: "forced-mass-update",
          label: "Mass software push reboots fleets; OS corruption looks like disk fail",
        },
        {
          id: "hard-power-cut",
          label: "Power strip or breaker used as shutdown; write damage / boot failure",
        },
        {
          id: "wrong-part-swap",
          label: "Identical units on bench; wrong unit returned",
        },
        {
          id: "env-power",
          label: "Power quality, heat, dust misread as intermittent HW",
        },
      ],
      decision_branches: [
        {
          id: "hot-account",
          situation: "High-visibility fail claims; blame on vendor or support",
          action: "site-observation",
        },
        {
          id: "bench-good-field-bad",
          situation: "Returns test good; field still replaces",
          action: "process-match-worksheet",
        },
        {
          id: "exec-brief",
          situation: "Need leadership decision on process change",
          action: "exec-root-cause-brief",
        },
        {
          id: "local-ally",
          situation: "Local IT cooperative but central IT hostile process",
          action: "trust-day-plan",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Prep: pull account NDF and top SKUs",
            goal: "Know what to look for",
            minutes: "60",
          },
          {
            id: 2,
            name: "Observe a full work cycle",
            goal: "Shutdown, update, replace habits",
            minutes: "half-day+",
          },
          {
            id: 3,
            name: "Match observations to bench results",
            goal: "HW vs process/OS",
            minutes: "60",
          },
          {
            id: 4,
            name: "Brief decision makers with fix path",
            goal: "Change process, not just parts policy",
            minutes: "45",
          },
        ],
      },
      tracking: {
        csv_header:
          "visit_date,account,observations,bench_summary,root_cause_class,actions,owner",
        sheet_tab_name: "site_process_discovery",
      },
      related_artifacts: [
        "mf-tpl-075",
        "mf-tpl-060",
        "mf-tpl-067",
        "mf-tpl-001",
      ],
      agent_signal: {
        use_when:
          "Account blames hardware at scale. Returns often NDF. Need site visit pattern: observe process before exec data meeting.",
        decision_criteria: [
          "Observe before the confrontation deck.",
          "Classify root cause: HW vs process vs OS/env.",
          "Present fix path, not only blame.",
        ],
        operator_context:
          "Field pattern: many institutional false HW storms are local process (updates, power, swaps) plus good bench data.",
        tags: ["field-patterns", "ndf", "site-visit", "root-cause"],
      },
    },
    templates: [
      {
        id: "site-observation",
        use_when: "hot-account",
        body: "SITE OBSERVATION LOG\nAccount/site: _______________  Date: _______\n\nWatch blocks: boot / work / update / EOD shutdown / replace path\nWhat they do: _______________\nWhat they say the failure is: _______________\nArtifacts (screens, tickets): _______________\nAllies on site: _______________",
      },
      {
        id: "process-match-worksheet",
        use_when: "bench-good-field-bad",
        body: "PROCESS MATCH WORKSHEET\n\nBench outcome on returns: _______________\nField replace trigger: _______________\nProcess that can create same symptom without bad silicon: _______________\nEvidence link: _______________\nClass: [ ] HW  [ ] process  [ ] OS/update  [ ] env  [ ] mixed",
      },
      {
        id: "exec-root-cause-brief",
        use_when: "exec-brief",
        body: "EXEC ROOT CAUSE BRIEF\nAccount: _______________  Date: _______\n\nClaimed problem: _______________\nWhat we measured (bench): _______________\nWhat we saw (site): _______________\nRoot cause class: _______________\nAsk of leadership: _______________\nWhat we will change on our side: _______________",
      },
      {
        id: "trust-day-plan",
        use_when: "local-ally",
        body: "TRUST DAY PLAN\nSite: _______________\n\nMorning: observe with local team (no slides)\nMid: shared lunch / informal debrief\nAfter: confirm facts before exec room\nDo not: surprise local staff in front of their boss without a path",
      },
      {
        id: "hw-vs-sw-checklist",
        use_when: "bench-good-field-bad",
        body: "HW VS PROCESS/OS CHECK\n[ ] Unit passes hardware protocol\n[ ] Failure appears after update/reboot storm\n[ ] Failure appears after hard power loss\n[ ] Imaging/reimage clears without new silicon\n[ ] Same SKU fails only at this site/process\nNotes: _______________",
      },
    ],
    examples: [
      {
        id: "ex-update-storm",
        context:
          "Mass client update pushed mid-day. Reboots, crashes, drives declared dead. Replacements spiked.",
        branch: "site-observation",
        templates_used: ["site-observation", "process-match-worksheet", "hw-vs-sw-checklist"],
        resolution:
          "Bench-good drives. Root cause: update + write damage path. Change update window and replace criteria.",
        log_row: "2026-W22,update-storm,bench-good,process,ok",
      },
      {
        id: "ex-hard-power",
        context:
          "EOD habit: kill power strip instead of clean shutdown. Boot failures blamed on disks.",
        branch: "bench-good-field-bad",
        templates_used: ["process-match-worksheet", "exec-root-cause-brief"],
        resolution:
          "Shutdown standard rewritten. False disk RMA rate fell.",
        log_row: "2026-W23,hard-power,policy,ndf-down",
      },
      {
        id: "ex-exec-room",
        context: "Leadership wanted vendor pound-the-table meeting.",
        branch: "exec-brief",
        templates_used: ["exec-root-cause-brief", "trust-day-plan"],
        resolution:
          "Presented process root cause with bench data. Joint fix plan; relationship held.",
        log_row: "2026-W24,exec-brief,joint-plan,held",
      },
    ],
    agentMd:
      "1. Hot false-HW storm → **trust-day-plan** then **site-observation**.\n2. Bench good / field bad → **process-match-worksheet** + **hw-vs-sw-checklist**.\n3. Decision makers → **exec-root-cause-brief**.\n4. Pair **mf-tpl-075** for ongoing account health; **mf-tpl-060** for return truth.",
  },
  {
    id: "mf-tpl-077",
    slug: "defect-fix-shotgun-relapse",
    title: "Defect Fix Shotgun Relapse Playbook",
    mission:
      "When NDF was right to scream: real bad commodity, weak test, vendor pressure. Fix the line, then stop the free-parts shotgun that follows.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Memory NDF sky-high. Techs correct. Vendor contested. Line replaced. Then every ticket got free memory again.",
      branch: "post-fix-relapse",
      resolution:
        "FRU kit policy: memory not orphaned. Shotgun slowed; customer install pain down.",
      log_row: "2026-W30,MEM-line,vendor-ack,kit-policy,relapse-down",
    },
    teaserBullets: [
      "Investigate when techs are right about a bad line",
      "Vendor acknowledge and replace path",
      "Post-fix shotgun control via kits and rules",
    ],
    pairs: ["mf-tpl-073", "mf-tpl-074", "mf-tpl-078", "mf-tpl-067"],
    tags: ["field-patterns", "ndf", "vendor", "fru-kits"],
    playbook: {
      description:
        "Handle real defects that drive high NDF complaints: investigate, force vendor truth, replace the line, then govern the free-parts relapse and customer install pain.",
      mindset: {
        principle:
          "Sometimes the floor is right and the scoreboard is lying because the part and the test are bad. Fix that first. Then redesign incentives so victory does not become shotgun season.",
        mistakes: [
          {
            id: "coach-over-investigate",
            label: "Train techs harder while vendor line is defective",
            cost: "Trust destroyed; real failures continue",
          },
          {
            id: "ignore-test-gap",
            label: "Leave a weak test that cannot catch the real fail",
            cost: "NDF and confirmed-fail both wrong",
          },
          {
            id: "open-bar-after-fix",
            label: "After line replace, leave unlimited free that SKU",
            cost: "Shotgun returns; customers hurt on awkward swaps",
          },
        ],
      },
      phases: [
        {
          id: "listen",
          label: "Floor complaint + NDF spike on one family",
        },
        {
          id: "investigate",
          label: "Test method, sample, vendor data, field repro",
        },
        {
          id: "force-truth",
          label: "Vendor acknowledge; replace or rework population",
        },
        {
          id: "govern-relapse",
          label: "Kit rules, not unlimited orphan FRUs",
        },
      ],
      decision_branches: [
        {
          id: "techs-right",
          situation: "High NDF complaints but field evidence of real intermittents",
          action: "real-defect-investigation",
        },
        {
          id: "vendor-fight",
          situation: "Vendor denies; your test weak or disputed",
          action: "vendor-evidence-pack",
        },
        {
          id: "post-fix-relapse",
          situation: "After line fix, outbound of that part explodes",
          action: "shotgun-control-rules",
        },
        {
          id: "awkward-swap",
          situation: "Part is free but painful for end users to install",
          action: "fru-kit-design",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Treat floor signal as hypothesis",
            goal: "Do not coach-first",
            minutes: "immediate",
          },
          {
            id: 2,
            name: "Stress test method and samples",
            goal: "Catch flighty fails",
            minutes: "days",
          },
          {
            id: 3,
            name: "Vendor close with evidence",
            goal: "Acknowledge + replace path",
            minutes: "ongoing",
          },
          {
            id: 4,
            name: "Install post-fix outbound rules/kits",
            goal: "Block shotgun relapse",
            minutes: "before announce free",
          },
        ],
      },
      tracking: {
        csv_header:
          "week,family,ndf_pct,field_fail_signal,vendor_status,outbound_qty,kit_required_y_n,owner",
        sheet_tab_name: "defect_fix_shotgun",
      },
      related_artifacts: [
        "mf-tpl-073",
        "mf-tpl-074",
        "mf-tpl-078",
        "mf-tpl-067",
      ],
      agent_signal: {
        use_when:
          "High NDF or floor revolt on one commodity. Suspect real defect and weak test. After a line fix, free-parts shotgun returns. Need kit or rules.",
        decision_criteria: [
          "Investigate before pure coaching when one family dominates complaints.",
          "Close vendor with evidence; improve test if needed.",
          "Before declaring free replace, set kit/rules to block relapse.",
        ],
        operator_context:
          "Field pattern: win the real defect war, then immediately redesign incentives or shotgun season starts.",
        tags: ["field-patterns", "ndf", "vendor", "fru-kits"],
      },
    },
    templates: [
      {
        id: "real-defect-investigation",
        use_when: "techs-right",
        body: "REAL DEFECT INVESTIGATION\nFamily: _______________  Date: _______\n\nFloor signal: _______________\nNDF vs field fail notes: _______________\nTest method gaps: _______________\nSample plan: _______________\nOwner: _______________",
      },
      {
        id: "vendor-evidence-pack",
        use_when: "vendor-fight",
        body: "VENDOR EVIDENCE PACK\nVendor: _______________  Family: _______________\n\nFail signatures: _______________\nYour protocol ID: _______________\nUnits/lots: _______________\nAsk: acknowledge / replace / rework\nDeadline: _______",
      },
      {
        id: "shotgun-control-rules",
        use_when: "post-fix-relapse",
        body: "SHOTGUN CONTROL RULES\nFamily: _______________  Effective: _______\n\nWhen free replace is allowed: _______________\nWhen kit required: _______________\nWhen troubleshooting gate required: _______________\nMetric watch (2 wk): outbound ___  NDF ___  callbacks ___",
      },
      {
        id: "fru-kit-design",
        use_when: "awkward-swap",
        body: "FRU KIT DESIGN\nProblem swap: _______________ (e.g. orphan memory)\n\nKit name: _______________\nContents: _______________\nWhen to ship kit vs single: _______________\nOnsite notes for customer: _______________\nOwner: _______________",
      },
      {
        id: "line-replace-comms",
        use_when: "vendor-fight",
        body: "LINE REPLACE COMMS (INTERNAL)\nFamily: _______________\nWhat was wrong: _______________\nWhat we fixed: _______________\nWhat NOT to do now: unlimited shotgun without gate\nNew rule ref: _______________",
      },
    ],
    examples: [
      {
        id: "ex-flighty-memory",
        context:
          "Memory intermittent in field. Back-end test weak. Vendor contested. NDF looked like tech failure; was not.",
        branch: "techs-right",
        templates_used: ["real-defect-investigation", "vendor-evidence-pack"],
        resolution:
          "Vendor acknowledged. Population replaced. Test method upgraded.",
        log_row: "2026-W28,MEM,vendor-ack,line-replace,test-up",
      },
      {
        id: "ex-shotgun-after-win",
        context:
          "After memory line fix, techs sent memory on nearly every ticket because it was free and trusted.",
        branch: "post-fix-relapse",
        templates_used: ["shotgun-control-rules", "fru-kit-design"],
        resolution:
          "CPU/memory/fan kit for onsite path. Orphan sticks restricted. Callbacks from bad swaps down.",
        log_row: "2026-W32,MEM-kit,orphan-off,callbacks-down",
      },
      {
        id: "ex-print-consumable",
        context:
          "Bad batch of media. Shop blamed operators. Then free media became default on every complaint.",
        branch: "post-fix-relapse",
        templates_used: ["real-defect-investigation", "shotgun-control-rules"],
        resolution:
          "Batch replaced. Free media required photo gate after week two.",
        log_row: "2026-W40,media-batch,replace,gate-on",
      },
    ],
    agentMd:
      "1. Floor right / one family → **real-defect-investigation** (do not coach-first).\n2. Vendor deny → **vendor-evidence-pack**.\n3. After fix → **shotgun-control-rules** before open bar.\n4. Painful install → **fru-kit-design**.\n5. Pair **mf-tpl-073** gaming; **mf-tpl-078** incentive design.",
  },
  {
    id: "mf-tpl-078",
    slug: "support-incentive-steering",
    title: "Support Incentive Steering Playbook",
    mission:
      "Support follows incentives. Design measures, free parts, kits, and scoreboards so the crowd moves toward real fixes, not games.",
    lane: "field-patterns",
    teaserExample: {
      context:
        "Every new metric yanked the floor a new direction. Leadership surprised by workarounds.",
      branch: "incentive-design",
      resolution:
        "Pre-mortem on metric holes. Paired scoreboard. Behavior stabilized.",
      log_row: "2026-W35,metric-X,pre-mortem,paired-cost,stable",
    },
    teaserBullets: [
      "Incentive map for any support metric",
      "Pre-mortem: how will the floor game this?",
      "Steer with kits, coverage, and paired measures",
    ],
    pairs: ["mf-tpl-073", "mf-tpl-077", "mf-tpl-060", "mf-tpl-061"],
    tags: ["field-patterns", "incentives", "support-ops", "ndf"],
    playbook: {
      description:
        "Design and audit support incentives: what gets measured, what is free, what is kitted, and how the floor will move. Steering model for NDF and related ops metrics.",
      mindset: {
        principle:
          "Tech support will go in any direction the incentives point. If you can drive a crowd one way, you are responsible for where the road goes.",
        mistakes: [
          {
            id: "single-metric-cult",
            label: "One score to rule the floor",
            cost: "Everything else is sacrificed to the number",
          },
          {
            id: "surprise-workaround",
            label: "Ship a metric with no game pre-mortem",
            cost: "You learn the hole from production waste",
          },
          {
            id: "punish-rationality",
            label: "Call people unethical for following the scoreboard you built",
            cost: "Culture war; no system learning",
          },
        ],
      },
      lever_types: [
        {
          id: "measure",
          label: "What is scored (NDF, AHT, CSAT, cost)",
        },
        {
          id: "free_parts",
          label: "What can be shipped without friction",
        },
        {
          id: "kits",
          label: "What ships as a designed bundle",
        },
        {
          id: "proof",
          label: "What evidence is required before ding or credit",
        },
        {
          id: "status",
          label: "Who owns the score and who is scored",
        },
      ],
      decision_branches: [
        {
          id: "new-metric",
          situation: "About to launch or tighten a support metric",
          action: "incentive-design",
        },
        {
          id: "unexpected-behavior",
          situation: "Floor behavior shifted after a policy or metric change",
          action: "behavior-shift-review",
        },
        {
          id: "steer-fix",
          situation: "Need the crowd to stop shotgun or start real troubleshoot",
          action: "lever-change-plan",
        },
        {
          id: "pre-mortem",
          situation: "Design review before go-live",
          action: "game-premortem",
        },
      ],
      process: {
        steps: [
          {
            id: 1,
            name: "Name the behavior you want",
            goal: "Real fix, not vanity number",
            minutes: "30",
          },
          {
            id: 2,
            name: "Map levers (measure, free, kit, proof, status)",
            goal: "See the steering wheel",
            minutes: "45",
          },
          {
            id: 3,
            name: "Pre-mortem the games",
            goal: "Close holes on paper first",
            minutes: "45",
          },
          {
            id: 4,
            name: "Pair metrics and review in 2 weeks",
            goal: "Catch relapse early",
            minutes: "ongoing",
          },
        ],
      },
      tracking: {
        csv_header:
          "date,change_type,intended_behavior,predicted_game,paired_metric,review_date,owner",
        sheet_tab_name: "support_incentive_steering",
      },
      related_artifacts: [
        "mf-tpl-073",
        "mf-tpl-077",
        "mf-tpl-060",
        "mf-tpl-061",
      ],
      agent_signal: {
        use_when:
          "Launching or fixing support metrics (including NDF). Floor behavior keeps sliding. Need incentive design and game pre-mortem, not only more training.",
        decision_criteria: [
          "Every metric change gets a game pre-mortem.",
          "Pair outcome metrics with cost or quality so one number cannot be gamed alone.",
          "Treat workarounds as system feedback, not moral failure.",
        ],
        operator_context:
          "Field pattern thesis pack: incentives steer support. Use with NDF gaming, kits, and credibility packs.",
        tags: ["field-patterns", "incentives", "support-ops", "ndf"],
      },
    },
    templates: [
      {
        id: "incentive-design",
        use_when: "new-metric",
        body: "INCENTIVE DESIGN SHEET\nChange: _______________  Effective: _______\n\nIntended behavior: _______________\nLevers used: measure / free parts / kits / proof / status\nPaired metric (anti-game): _______________\nOwner: _______________",
      },
      {
        id: "game-premortem",
        use_when: "pre-mortem",
        body: "GAME PRE-MORTEM\nMetric/policy: _______________\n\nHow will a smart tech hit the number without the outcome we want?\n1. _______________\n2. _______________\n3. _______________\nHole closes: _______________\nGo-live gate: all holes have an owner",
      },
      {
        id: "behavior-shift-review",
        use_when: "unexpected-behavior",
        body: "BEHAVIOR SHIFT REVIEW\nWeek: _______\nWhat changed in policy/metric: _______________\nWhat the floor did: _______________\nIncentive read: _______________\nSystem fix (not pep talk): _______________",
      },
      {
        id: "lever-change-plan",
        use_when: "steer-fix",
        body: "LEVER CHANGE PLAN\nDesired crowd move: _______________\n\nIncrease friction on: _______________\nDecrease friction on: _______________\nKit or bundle: _______________\nScoreboard change: _______________\nReview in 14 days: _______________",
      },
      {
        id: "paired-scoreboard-row",
        use_when: "new-metric",
        body: "PAIRED SCOREBOARD ROW\nPeriod: _______\nPrimary metric: _______________  Value: ___\nPaired metric (cost/quality/callback): _______________  Value: ___\nNarrative: _______________",
      },
    ],
    examples: [
      {
        id: "ex-ndf-only",
        context: "Org scored NDF only. Parts cost climbed via untested SKUs.",
        branch: "pre-mortem",
        templates_used: ["game-premortem", "paired-scoreboard-row"],
        resolution:
          "Paired NDF with parts cost and coverage map. Game shrank.",
        log_row: "2026-W12,ndf+cost,coverage,ok",
      },
      {
        id: "ex-cult-steering",
        context:
          "Lead could move the floor with one policy email. No pre-mortem; chaos each quarter.",
        branch: "incentive-design",
        templates_used: ["incentive-design", "game-premortem"],
        resolution:
          "Design sheet required before metric changes. Fewer thrash cycles.",
        log_row: "2026-Q3,design-gate,thrash-down",
      },
      {
        id: "ex-kit-steer",
        context: "Wanted less orphan memory shotgun after line fix.",
        branch: "steer-fix",
        templates_used: ["lever-change-plan", "behavior-shift-review"],
        resolution:
          "Kit required for that path. Behavior followed the kit rule.",
        log_row: "2026-W32,kit-lever,shotgun-down",
      },
      {
        id: "ex-small-shop",
        context: "Five-person shop. Owner yelled about redo rate; staff avoided logging redos.",
        branch: "unexpected-behavior",
        templates_used: ["behavior-shift-review", "paired-scoreboard-row"],
        resolution:
          "Logged redos without blame week; paired with cause codes. Data returned.",
        log_row: "2026-W05,no-blame-log,data-back",
      },
    ],
    agentMd:
      "1. New metric/policy → **incentive-design** + **game-premortem** before go-live.\n2. Weird floor move → **behavior-shift-review** (system fix, not pep talk).\n3. Need a turn → **lever-change-plan**.\n4. Always **paired-scoreboard-row** when a single number rules.\n5. Pair **mf-tpl-073** / **mf-tpl-077** for NDF-specific games and kits.",
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

field_patterns · Complements mf-tpl-060 return verification; does not replace it.
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
        "Generic job spine comms. Not a substitute for mf-tpl-060 return log basics. Not legal advice.",
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
  job_spine: "Small-business job lifecycle templates and tools",
  support_backbone: "Support ops metrics, queues, forecast (061-067)",
  field_patterns:
    "Field patterns from real work: people ops, returns, NDF incentives, site process, workplace exit. Not legal advice.",
  workplace_exit:
    "Severance and benefits documentation patterns (068-072). Bonus aisle.",
  ndf_cluster: "NDF and support incentive patterns (073-078). Complements 060.",
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
    "Generic job spine comms. Not a substitute for mf-tpl-060 return log basics. Not legal advice.",
  pairs_with: p.playbook.related_artifacts.slice(0, 4),
  trigger_phrases: [
    p.playbook.agent_signal.use_when.slice(0, 80),
    `Need playbook: ${p.title}`,
  ],
  agent_signal_version: "1.2",
}));

const byId = new Map(manifest.entries.map((e) => [e.id, e]));
for (const e of newEntries) {
  byId.set(e.id, e);
}
// keep stable order: existing order, append new ids at end if missing from original sequence
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
if (!indexHtml.includes('id="mf-tpl-073"')) {
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
} else {
  console.log("index.html already has mf-tpl-073");
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
    throw new Error("worker inject marker missing: ];\\n\\nconst NETWORK_CAIP2");
  }
  worker = worker.replace(
    "];\n\nconst NETWORK_CAIP2",
    block + "];\n\nconst NETWORK_CAIP2"
  );
}
fs.writeFileSync(workerPath, worker);
console.log("worker gates updated");

console.log("done build-ndf-field-073-078 (no push)");
