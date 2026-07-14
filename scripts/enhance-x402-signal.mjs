import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, '2nd-pages', 'materials-factory');
const STAGING = path.join('D:', 'GrokBuild', 'Experiments', '402 Biz');

const SLUG_BY_ID = {
  'mf-tpl-001': 'complaint-recovery-playbook', 'mf-tpl-002': 'employee-onboarding-kit', 'mf-tpl-003': 'hiring-character-gauge',
  'mf-tpl-004': 'client-intake-playbook', 'mf-tpl-005': 'weekly-ops-review', 'mf-tpl-006': 'quote-estimate-gate',
  'mf-tpl-007': 'delivery-handoff', 'mf-tpl-008': 'invoice-payment-chase', 'mf-tpl-009': 'vendor-issue',
  'mf-tpl-010': 'project-kickoff', 'mf-tpl-011': 'proof-approval-gate', 'mf-tpl-012': 'change-order-mid-job',
  'mf-tpl-013': 'client-status-update', 'mf-tpl-014': 'quote-follow-up', 'mf-tpl-015': 'job-close-archive',
  'mf-tpl-016': 'deposit-reminder', 'mf-tpl-017': 'production-handoff-internal', 'mf-tpl-018': 'lost-lead-archive',
  'mf-tpl-019': 'referral-ask', 'mf-tpl-020': 'warranty-support-touch', 'mf-tpl-021': 'rush-client-comms',
  'mf-tpl-022': 'meeting-phone-qualify', 'mf-tpl-023': 'not-a-fit-referral', 'mf-tpl-024': 'reorder-repeat-client',
  'mf-tpl-025': 'subcontractor-handoff', 'mf-tpl-026': 'qc-fail-rework', 'mf-tpl-027': 'client-onboarding-first',
  'mf-tpl-028': 'estimate-revision', 'mf-tpl-029': 'payment-plan-partial', 'mf-tpl-030': 'job-pause-hold',
  'mf-tpl-031': 'post-delivery-survey', 'mf-tpl-032': 'emergency-after-hours', 'mf-tpl-033': 'job-priority-queue',
  'mf-tpl-034': 'client-asset-request', 'mf-tpl-035': 'pickup-will-call', 'mf-tpl-036': 'install-on-site-coord',
  'mf-tpl-037': 'shipping-tracking-update', 'mf-tpl-038': 'progress-photo-update', 'mf-tpl-039': 'goodwill-credit',
  'mf-tpl-040': 'refund-cancellation', 'mf-tpl-041': 'coi-insurance-request', 'mf-tpl-042': 'design-revision-loop',
  'mf-tpl-043': 'physical-sample-proof', 'mf-tpl-044': 'damage-transit-claim', 'mf-tpl-045': 'retainer-ongoing',
  'mf-tpl-046': 'net-terms-credit-app', 'mf-tpl-047': 'seasonal-capacity-notice', 'mf-tpl-048': 'multi-location-coord',
  'mf-tpl-049': 'permit-municipality', 'mf-tpl-050': 'weather-delay-outdoor', 'mf-tpl-051': 'contact-account-transfer',
  'mf-tpl-052': 'finished-goods-storage', 'mf-tpl-053': 'event-deadline-crunch', 'mf-tpl-054': 'portfolio-photo-permission',
  'mf-tpl-055': 'tax-exempt-cert',
  'mf-tpl-056': 'wrong-seat-rescue',
  'mf-tpl-057': 'workplace-department-map',
  'mf-tpl-058': 'tenured-change-adoption',
  'mf-tpl-059': 'shadow-expert-mining',
  'mf-tpl-060': 'return-verification-signal',
  'mf-tpl-061': 'support-ops-correlation',
  'mf-tpl-062': 'queue-split-design',
  'mf-tpl-063': 'volume-split-tracker',
  'mf-tpl-064': 'understaffing-impact-log',
  'mf-tpl-065': 'support-unit-economics',
  'mf-tpl-066': 'call-forecast-variance',
  'mf-tpl-067': 'rd-support-bridge',
  'mf-tool-001': 'should-i-automate', 'mf-tool-002': 'ai-task-fit', 'mf-tool-003': 'scope-creep-say-no',
};

const EXTENSION_CLUSTERS = [
  { id: 'quote_accept', label: 'Quote accepted, pre-production', anchor: 'mf-tpl-006', artifacts: ['mf-tpl-016', 'mf-tpl-022', 'mf-tpl-028', 'mf-tpl-029', 'mf-tpl-046', 'mf-tpl-047', 'mf-tpl-055'] },
  { id: 'kickoff_production', label: 'Kickoff and floor', anchor: 'mf-tpl-010', artifacts: ['mf-tpl-017', 'mf-tpl-026', 'mf-tpl-033', 'mf-tpl-034', 'mf-tpl-042', 'mf-tpl-043'] },
  { id: 'active_job', label: 'Job in flight', anchor: 'mf-tpl-013', artifacts: ['mf-tpl-021', 'mf-tpl-030', 'mf-tpl-038', 'mf-tpl-025', 'mf-tpl-041', 'mf-tpl-049'] },
  { id: 'delivery_install', label: 'Delivery and install', anchor: 'mf-tpl-007', artifacts: ['mf-tpl-035', 'mf-tpl-036', 'mf-tpl-037', 'mf-tpl-050', 'mf-tpl-052'] },
  { id: 'close_growth', label: 'Close and growth', anchor: 'mf-tpl-015', artifacts: ['mf-tpl-018', 'mf-tpl-019', 'mf-tpl-031', 'mf-tpl-054', 'mf-tpl-024', 'mf-tpl-045'] },
  { id: 'support_escalation', label: 'Support and escalation', anchor: 'mf-tpl-001', artifacts: ['mf-tpl-020', 'mf-tpl-032', 'mf-tpl-044', 'mf-tpl-040', 'mf-tpl-039'] },
  { id: 'client_account', label: 'Client and account', anchor: 'mf-tpl-004', artifacts: ['mf-tpl-023', 'mf-tpl-027', 'mf-tpl-051', 'mf-tpl-048'] },
  { id: 'events_terms', label: 'Events and hard deadlines', anchor: 'mf-tpl-021', artifacts: ['mf-tpl-053'] },
];

const SIGNAL = {
  'mf-tool-001': {
    use_when: 'Operator asks whether to buy software, automate a task, or keep a manual habit.',
    decision_criteria: ['Frequency and written SOP beat gut feel.', 'Customer-facing judgment stays human until stakes are low and process is written.'],
    operator_context: 'Treasure Valley: one-location shops often automate reporting before empathy-heavy comms.',
    tags: ['automation', 'decision-rubric', 'small-business', 'vending'],
    manifest_description: 'Deterministic rubric: should this task stay manual, use a template, gather data, or automate? Built for ops-heavy small business.',
  },
  'mf-tool-002': {
    use_when: 'Deciding if AI should draft, classify, or stay out of a task entirely.',
    decision_criteria: ['AI drafts only when a human approves before send or spend.', 'Route heated or high-stakes threads to human plus mf-tpl-001.'],
    operator_context: 'Idaho shops: AI OK for first-draft status emails; not for pricing promises or install dates without owner review.',
    tags: ['ai-routing', 'task-fit', 'human-in-loop'],
    manifest_description: 'Route tasks to AI draft, human-only, or template path. Pairs with job spine comms packs.',
  },
  'mf-tool-003': {
    use_when: 'Client asks for free extra scope, rush without fee, or work outside signed quote.',
    decision_criteria: ['No silent yes: every add-on needs documented CO or new quote.', 'Pair with mf-tpl-012 when scope grows mid-job.'],
    operator_context: 'Treasure Valley contractors: weather and supply slips are common; scope creep fees still apply.',
    tags: ['scope', 'boundaries', 'change-order'],
    manifest_description: 'Say-no and CO routing rubric for scope creep. Cross-links mf-tpl-012 and quote gate.',
  },
  'mf-tpl-001': {
    use_when: 'Existing customer is angry, threatening reviews, or reporting a failure on delivered work.',
    decision_criteria: ['Acknowledge before explain. Written reply same day when possible.', 'Severity sets refund vs fix vs route; log every touch.'],
    operator_context: 'Local reputation spreads fast in Treasure Valley; one public review can outrank years of word-of-mouth.',
    tags: ['complaint', 'recovery', 'reputation'],
    spine_role: 'complaint_route',
    manifest_description: 'Complaint recovery spine route: severity branches, templates, log rows. Use before treating anger as new intake.',
  },
  'mf-tpl-002': {
    use_when: 'New hire Day 0 through Day 30 for floor, driver, or office role.',
    decision_criteria: ['Role pack beats generic HR binder.', 'Day 7 and Day 30 autonomy checks are mandatory.'],
    operator_context: 'Idaho small teams: buddy is often the owner; keep checklists short enough to run on a phone between jobs.',
    tags: ['hiring', 'onboarding', 'hr'],
    manifest_description: 'Rapid onboarding by role: templates, buddy, Day 7/30 checkpoints. HR adjacent to job spine.',
  },
  'mf-tpl-003': {
    use_when: 'Interview finishers and hire/pass decision on character, not just skills.',
    decision_criteria: ['Three finisher questions never skipped.', 'Weak finishers on high-trust roles default pass.'],
    operator_context: 'Treasure Valley hires often via referral; finishers still filter culture fit before mf-tpl-002.',
    tags: ['hiring', 'interview', 'character'],
    manifest_description: 'Three-question character gauge with scored examples. Routes hires to mf-tpl-002 onboarding.',
  },
  'mf-tpl-056': {
    use_when: 'Team member looks like underperformer but may be bored in wrong seat. Manager asks fix behavior before write-up.',
    decision_criteria: ['Observe 3-5 days before discipline unless safety or theft.', 'Test one hard assignment before full reassignment.', 'If test fails across easy and hard work, route discipline-path not another move.'],
    operator_context: 'Treasure Valley shops: one sharp person stuck on dumb work costs you twice. Cross-pool handoff beats public demotion.',
    tags: ['people-ops', 'team-management', 'hr-adjacent'],
    manifest_description: 'Wrong seat rescue: observe, test hard work, reassign bored performers. Pairs with mf-tpl-003, mf-tpl-002, mf-tpl-005.',
  },
  'mf-tpl-057': {
    use_when: 'Operator or agent must route a workplace issue to finance, HR, or shipping/receiving without stepping on landmines.',
    decision_criteria: ['Classify lane before customer/exec reply.', 'HR and finance get written minimum_inputs.', 'Shipping truth before customer ship promise.'],
    operator_context: 'Treasure Valley shops: titles blur on small teams; route by function not org chart fantasy.',
    tags: ['people-ops', 'department-routing', 'frontline'],
    manifest_description: 'Finance, HR, shipping lanes plus manager-speak decode. Combined department map for frontline routing.',
  },
  'mf-tpl-058': {
    use_when: 'Longtime staff resist new process or system. Know old way cold. Complain without engaging.',
    decision_criteria: ['Do not shame veterans in group settings.', 'Reflection report plus presentation before bad faith assumption.', 'Document refusal before escalation.'],
    operator_context: 'Registration and counter desks: veterans hold process memory. Engage before escalate.',
    tags: ['people-ops', 'change-management', 'tenured-staff'],
    manifest_description: 'Structured change engagement for tenured staff: reflection, report, presentation, refusal path.',
  },
  'mf-tpl-059': {
    use_when: 'Support metrics show low availability but high quality. Peers queue for one expert. Repeat questions not captured in training.',
    decision_criteria: ['Observe informal hub before performance write-up.', 'Mine repeat questions into tools/training backlog.', 'Adjust role or exempt metric before burnout.'],
    operator_context: 'Metric-heavy support floors: unpaid help shows as bad availability.',
    tags: ['people-ops', 'support-metrics', 'sme-mining'],
    manifest_description: 'Shadow expert mining: metric mismatch, question sprint, tools backlog, role adjustment.',
  },
  'mf-tpl-060': {
    use_when: 'Returned parts or jobs need verification. NDF rate matters. Support and test blame each other. Enterprise customer wants health proof.',
    decision_criteria: ['Log outcome on every return before metric ding.', 'Cross-train when NDF spikes.', 'QBR uses verification stats not narrative only.'],
    operator_context: 'Returns separate real failure from no-fault-found. Data wins QBR trust.',
    tags: ['quality', 'returns', 'enterprise-trust'],
    manifest_description: 'Return verification: NDF tracking, cross-train support and test, metric proof, QBR health check.',
  },
  'mf-tpl-061': {
    use_when: 'Support ops and CSAT move together. Leadership dings on one KPI. QBR needs ops proof beyond surveys.',
    decision_criteria: ['Log weekly ops row before individual metric dings.', 'Publish correlation conclusions in plain language.', 'Pair ASA and abandon in staffing debates.'],
    operator_context: 'Metric-heavy support orgs: matrix deflects blame wars and anchors QBR ops story.',
    tags: ['support-ops', 'csat', 'metrics-proof'],
    manifest_description: 'Weekly ops plus CSAT correlations with written conclusions for fair metrics and QBR.',
  },
  'mf-tpl-062': {
    use_when: 'Call routing is tribal knowledge. Mixed tiers in one queue. ASA goals undocumented or wrong.',
    decision_criteria: ['One registry row per split before forecast work.', 'Priority and ASA goal on every row.', 'After-hours behavior explicit, not implied.'],
    operator_context: 'Queue map is prerequisite for volume tracking and staffing math.',
    tags: ['routing', 'queue-design', 'support-ops'],
    manifest_description: 'Split/skill registry: priority, ASA goal, hours. Routing backbone before forecast.',
  },
  'mf-tpl-063': {
    use_when: 'Call volume debated without segment split. Mix shift suspected. Forecast needs actuals by queue family.',
    decision_criteria: ['Log offered, answered, abandoned per segment weekly.', 'Flag mix shift when one segment moves >10% vs 4-week avg.', 'Feed actuals into forecast variance pack.'],
    operator_context: 'Segment truth prevents wrong staffing on the wrong queue.',
    tags: ['volume', 'segmentation', 'support-ops'],
    manifest_description: 'Volume by segment weekly: offered, answered, abandoned. Mix shift detection.',
  },
  'mf-tpl-064': {
    use_when: 'Headcount dropped and ASA/abandon moved. Someone got dinged without week context. Need fair metric proof.',
    decision_criteria: ['Annotate every week staffing is below plan.', 'Attach impact log before individual dings stand.', 'Pair with correlation pack for leadership narrative.'],
    operator_context: 'Understaffing log is the fairness layer on raw ACD stats.',
    tags: ['staffing', 'asa', 'metrics-proof'],
    manifest_description: 'Annotated understaffing log: ASA, abandon, down-N tags, metric dispute packets.',
  },
  'mf-tpl-065': {
    use_when: 'Budget or CFO review on support cost. Channel mix shifting. Need cost per call/email/RMA not FTE vibes.',
    decision_criteria: ['Unit cost = labor burden / event volume per period.', 'Track channels separately.', 'Pair with forecast variance for volume denominator.'],
    operator_context: 'Unit economics wins backbone argument in budget fights.',
    tags: ['unit-economics', 'budget', 'support-ops'],
    manifest_description: 'Support unit economics: cost per call, email, RMA. Labor burden roll-up.',
  },
  'mf-tpl-066': {
    use_when: 'Call forecast exists but actuals diverge. Overtime or ASA miss tied to one queue. Assumptions not documented.',
    decision_criteria: ['Write assumptions before forecast numbers.', 'Weekly variance by queue, not company total only.', 'Patch staffing schedule when variance sustains 4+ weeks.'],
    operator_context: 'Variance review connects queue map and volume actuals to schedules.',
    tags: ['forecast', 'capacity', 'support-ops'],
    manifest_description: 'Forecast assumptions, weekly variance by queue, staffing schedule patches.',
  },
  'mf-tpl-067': {
    use_when: 'Support sees field pattern engineering lacks. Bridge role between support and R&D. Verify loop after fix ships.',
    decision_criteria: ['Log pattern with frequency before escalation.', 'Handoff includes repro and customer tier impact.', 'Close loop with verification, not announcement email.'],
    operator_context: 'Bridge role prevents product drift when org chases volume over quality backbone.',
    tags: ['cross-functional', 'product-quality', 'support-ops'],
    manifest_description: 'R&D support bridge: field signal, engineering handoff, verify close loop.',
  },
  'mf-tpl-004': {
    use_when: 'First contact from unknown lead: form, email, DM, or call. Not complaint recovery.',
    decision_criteria: ['Classify before quote; ready_to_buy still gets qualify.', 'Complaint_mask routes mf-tpl-001.'],
    operator_context: 'Treasure Valley leads often mix Facebook DM and phone; same SLA, same log row.',
    tags: ['intake', 'lead', 'qualify'],
    spine_role: 'chain_start',
    manifest_description: 'Job spine entry: classify intake, first touch within SLA, qualify before mf-tpl-006 quote.',
  },
  'mf-tpl-005': {
    use_when: 'Weekly owner or lead ops ritual: money, queue, people, one improvement.',
    decision_criteria: ['Hard 15-minute stop; variants for solo vs small team.', 'Money block pairs with mf-tpl-008 chase status.'],
    operator_context: 'Idaho seasonal swings: use capacity variant when spring install backlog hits.',
    tags: ['ops', 'weekly-review', 'overlay'],
    spine_role: 'ops_overlay',
    manifest_description: '15-minute ops overlay for spine. Five blocks, variants, cross-links payment and queue packs.',
  },
  'mf-tpl-006': {
    use_when: 'Scope is clear enough to price: custom quote or estimate gate before send.',
    decision_criteria: ['No blind pricing on fab/install without qty and deliverable.', 'Deposit terms stated on same send as quote.'],
    operator_context: 'Treasure Valley GCs often need COI and permit notes on quote; flag install add-ons early.',
    tags: ['quote', 'estimate', 'pricing'],
    spine_role: 'chain',
    manifest_description: 'Quote gate: branches for rush, repeat, partial scope. Chains from mf-tpl-004 intake.',
  },
  'mf-tpl-007': {
    use_when: 'Job ready to leave shop: notify, handoff, confirm receipt, unpaid hold.',
    decision_criteria: ['Unpaid balance blocks release unless written exception.', 'Issue same day gets honest plan, not silence.'],
    operator_context: 'Idaho winter: note freeze handling on vinyl and pickup hours on short winter days.',
    tags: ['delivery', 'handoff', 'fulfillment'],
    spine_role: 'chain',
    manifest_description: 'Delivery and handoff templates with unpaid hold and issue branches. Precedes mf-tpl-015 close.',
  },
  'mf-tpl-008': {
    use_when: 'Invoice sent: chase calendar day 3, 7, 14 and partial payment states.',
    decision_criteria: ['Tone escalates on calendar, not mood.', 'Net terms accounts use mf-tpl-046 branch before harsh chase.'],
    operator_context: 'Treasure Valley mix of Stripe and check; log payment method on every touch.',
    tags: ['invoice', 'payment', 'collections'],
    spine_role: 'chain',
    manifest_description: 'Invoice and payment chase sequence. Pairs mf-tpl-005 money block and mf-tpl-029 plans.',
  },
  'mf-tpl-009': {
    use_when: 'Vendor late, wrong, short, or damaged: internal chase plus honest client plan.',
    decision_criteria: ['Vendor touch logged before client promise.', 'Client delay uses mf-tpl-013 status language.'],
    operator_context: 'Regional suppliers: Boise run common; build vendor slip into honest dates for install jobs.',
    tags: ['vendor', 'supply', 'delay'],
    spine_role: 'chain',
    manifest_description: 'Vendor issue playbook with client delay scripts. Mid-spine between production and delivery.',
  },
  'mf-tpl-010': {
    use_when: 'Quote accepted: deposit, schedule, proof path, kickoff email.',
    decision_criteria: ['Deposit in or plan on file before production scheduling.', 'Kickoff email names proof gate mf-tpl-011.'],
    operator_context: 'Treasure Valley fair season: confirm event hard dates on kickoff when job ties to booth or parade.',
    tags: ['kickoff', 'deposit', 'schedule'],
    spine_role: 'chain',
    manifest_description: 'Post-accept kickoff checklist. Bridges quote win to proof and production handoffs.',
  },
  'mf-tpl-011': {
    use_when: 'Proof round sent: require written APPROVED before production release.',
    decision_criteria: ['Silence is not approval.', 'Color critical jobs may require mf-tpl-043 sample branch.'],
    operator_context: 'Idaho sun and laminate: call out exterior fade risk on proof for south-facing signage.',
    tags: ['proof', 'approval', 'production-gate'],
    spine_role: 'chain',
    manifest_description: 'Proof approval gate with written approval rule. Release trigger for floor and mf-tpl-017.',
  },
  'mf-tpl-012': {
    use_when: 'Scope grows after quote: freeze, document, CO, client accept.',
    decision_criteria: ['Pair mf-tool-003 for say-no on unpaid extras.', 'No floor change without signed CO or email accept.'],
    operator_context: 'Small shops: CO can be short email plus price line; still log row.',
    tags: ['change-order', 'scope', 'mid-job'],
    spine_role: 'chain',
    manifest_description: 'Change order mid-job scripts. Works with mf-tool-003 and mf-tpl-013 updates.',
  },
  'mf-tpl-013': {
    use_when: 'Proactive where-we-are update: on track, slip, waiting on client, waiting on vendor.',
    decision_criteria: ['Short, dated, honest; no essay.', 'Slip links mf-tpl-009 or mf-tpl-021 as needed.'],
    operator_context: 'Treasure Valley clients appreciate plain dates over vague soon.',
    tags: ['status', 'update', 'comms'],
    spine_role: 'chain',
    manifest_description: 'Client status update templates. Spine glue during active jobs.',
  },
  'mf-tpl-014': {
    use_when: 'Quote sent, no reply: nudge, expire, requote, win/loss.',
    decision_criteria: ['Calendar nudges, not guilt.', 'Expire date stated on original quote.'],
    operator_context: 'Idaho spring backlog: honest requote if capacity changed since first send.',
    tags: ['quote-follow-up', 'nudge', 'pipeline'],
    spine_role: 'chain',
    manifest_description: 'Quote follow-up sequence between mf-tpl-006 send and mf-tpl-010 accept.',
  },
  'mf-tpl-015': {
    use_when: 'Paid and delivered: archive, internal close, optional review ask.',
    decision_criteria: ['Verify paid before archive.', 'Skip hard referral ask on complaint jobs; use mf-tpl-019 lightly.'],
    operator_context: 'Local repeat business: log close row for reorder path mf-tpl-024.',
    tags: ['close', 'archive', 'job-end'],
    spine_role: 'chain_end',
    manifest_description: 'Job close and archive checklist. Spine terminal node before growth extensions.',
  },
};

// Extension signals: compact generator from cluster anchor
const EXT_META = {
  'mf-tpl-016': ['Deposit missing after accept', 'Hold slot with calendar, release if unpaid', 'mf-tpl-010'],
  'mf-tpl-017': ['Proof approved, hand to floor', 'Traveler owner named before run', 'mf-tpl-011'],
  'mf-tpl-018': ['Lead dead: ghost, price, timing', 'Log loss reason for ops review', 'mf-tpl-014'],
  'mf-tpl-019': ['Happy close, light referral ask', 'Skip on complaint jobs', 'mf-tpl-015'],
  'mf-tpl-020': ['Support question, not full complaint', 'Route heated to mf-tpl-001', 'mf-tpl-001'],
  'mf-tpl-021': ['Rush fee and hard proof windows', 'Honest slip beats silent miss', 'mf-tpl-013'],
  'mf-tpl-022': ['Vague lead needs phone qualify', 'Book or summary before mf-tpl-006', 'mf-tpl-004'],
  'mf-tpl-023': ['Wrong fit: refer out polite', 'Archive after refer', 'mf-tpl-004'],
  'mf-tpl-024': ['Repeat client reorder path', 'Fast quote branch to mf-tpl-006', 'mf-tpl-006'],
  'mf-tpl-025': ['Sub late or QC fail', 'Client sees our PM only', 'mf-tpl-009'],
  'mf-tpl-026': ['Internal QC fail before ship', 'Re-QC before mf-tpl-007', 'mf-tpl-017'],
  'mf-tpl-027': ['First job, not repeat', 'Set expectations before mf-tpl-010', 'mf-tpl-010'],
  'mf-tpl-028': ['Revise quote scope or price', 'Void prior quote on send', 'mf-tpl-006'],
  'mf-tpl-029': ['Partial payment plan', 'Default pauses job', 'mf-tpl-008'],
  'mf-tpl-030': ['Client or internal pause', 'Resume or cancel explicit', 'mf-tpl-013'],
  'mf-tpl-031': ['Light NPS after delivery', 'Low score triggers call', 'mf-tpl-007'],
  'mf-tpl-032': ['After-hours message triage', 'True emergency only on-call', 'mf-tpl-001'],
  'mf-tpl-033': ['Reprioritize queue internal', 'Honest capacity date to client via mf-tpl-013', 'mf-tpl-005'],
  'mf-tpl-034': ['Missing logo or file', 'Late assets move ship date', 'mf-tpl-011'],
  'mf-tpl-035': ['Will-call pickup ready', 'Hold if unpaid', 'mf-tpl-007'],
  'mf-tpl-036': ['Install schedule and access', 'Weather slip uses mf-tpl-050', 'mf-tpl-007'],
  'mf-tpl-037': ['Tracking and carrier delay', 'Proactive when ETA moves', 'mf-tpl-007'],
  'mf-tpl-038': ['Mid-job photo for anxious client', 'Do not leak other jobs', 'mf-tpl-013'],
  'mf-tpl-039': ['Courtesy credit, not full refund fight', 'Owner approval over threshold', 'mf-tpl-001'],
  'mf-tpl-040': ['Cancel or refund policy branch', 'Chargeback threat to mf-tpl-001', 'mf-tpl-008'],
  'mf-tpl-041': ['COI before install', 'GC and venue naming', 'mf-tpl-010'],
  'mf-tpl-042': ['Design rev before proof', 'Cap rounds with fee', 'mf-tpl-011'],
  'mf-tpl-043': ['Physical sample approve', 'Match sample on press', 'mf-tpl-011'],
  'mf-tpl-044': ['Damage in transit', 'Photo within 24h', 'mf-tpl-007'],
  'mf-tpl-045': ['Retainer client monthly touch', 'Scope creep to mf-tpl-012', 'mf-tpl-006'],
  'mf-tpl-046': ['Net terms application', 'Hold new work if overdue', 'mf-tpl-008'],
  'mf-tpl-047': ['Honest lead time on quote', 'Waitlist when at capacity', 'mf-tpl-006'],
  'mf-tpl-048': ['Multi-site one brand', 'Split ship contacts per location', 'mf-tpl-007'],
  'mf-tpl-049': ['Permit hold before install', 'City sign rules Idaho vary by municipality', 'mf-tpl-036'],
  'mf-tpl-050': ['Outdoor install weather delay', 'Safety over client push', 'mf-tpl-036'],
  'mf-tpl-051': ['Contact left company', 'Confirm approver before proof', 'mf-tpl-004'],
  'mf-tpl-052': ['Finished goods storage hold', 'Fee after free window', 'mf-tpl-007'],
  'mf-tpl-053': ['Hard event or trade show date', 'Partial ship option', 'mf-tpl-021'],
  'mf-tpl-054': ['Portfolio photo permission', 'Skip on complaint jobs', 'mf-tpl-015'],
  'mf-tpl-055': ['Tax exempt cert on file', 'No cert, tax on invoice', 'mf-tpl-006'],
};

for (const [id, [use, crit, anchor]] of Object.entries(EXT_META)) {
  const cluster = EXTENSION_CLUSTERS.find((c) => c.artifacts.includes(id));
  SIGNAL[id] = {
    use_when: use,
    decision_criteria: [crit, `Spine anchor: fetch with or after ${anchor}.`],
    operator_context: 'Treasure Valley small shop: keep scripts short; log every branch.',
    tags: ['job-spine-extension', cluster?.id || 'extension'],
    spine_anchor: anchor,
    cluster: cluster?.id,
    manifest_description: `${use}. Extension on ${anchor}. Deterministic branches and templates.`,
  };
}

const modified = [];

function clusterFor(id) {
  return EXTENSION_CLUSTERS.find((c) => c.artifacts.includes(id));
}

function agentMdBlock(sig) {
  return `\n## Agent signal (v1.1)\n\n- **Use when:** ${sig.use_when}\n- **Decision criteria:** ${sig.decision_criteria.join(' ')}\n- **Operator context:** ${sig.operator_context}\n`;
}

function patchJsonFile(filePath, sig, isRules) {
  const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  doc.agent_signal = {
    use_when: sig.use_when,
    decision_criteria: sig.decision_criteria,
    operator_context: sig.operator_context,
  };
  if (sig.spine_anchor) doc.agent_signal.spine_anchor = sig.spine_anchor;
  if (sig.cluster) doc.agent_signal.cluster = sig.cluster;
  if (sig.spine_role) doc.agent_signal.spine_role = sig.spine_role;
  if (doc.version && doc.version === '1.0.0') doc.version = '1.1.0';
  if (sig.spine_anchor && doc.related_artifacts && !doc.related_artifacts.includes(sig.spine_anchor)) {
    doc.related_artifacts = [sig.spine_anchor, ...doc.related_artifacts];
  }
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + '\n');
}

function patchAgentMd(agentPath, sig) {
  let md = fs.readFileSync(agentPath, 'utf8');
  if (md.includes('## Agent signal (v1.1)')) {
    md = md.replace(/\n## Agent signal \(v1\.1\)[\s\S]*$/, '');
  }
  md = md.trimEnd() + agentMdBlock(sig);
  fs.writeFileSync(agentPath, md + '\n');
}

function applyToBase(base, section, slug, id) {
  const sig = SIGNAL[id];
  if (!sig) return;
  const full = path.join(base, section, slug, 'full');
  const jsonName = id.startsWith('mf-tool') ? 'rules.json' : 'playbook.json';
  const jsonPath = path.join(full, jsonName);
  const agentPath = path.join(full, 'AGENT.md');
  if (!fs.existsSync(jsonPath)) return;
  patchJsonFile(jsonPath, sig);
  if (fs.existsSync(agentPath)) patchAgentMd(agentPath, sig);
  modified.push(path.relative(ROOT, jsonPath).replace(/\\/g, '/'));
  if (fs.existsSync(agentPath)) modified.push(path.relative(ROOT, agentPath).replace(/\\/g, '/'));
}

function applyStaging(slug, id) {
  const sig = SIGNAL[id];
  if (!sig) return;
  const section = id.startsWith('mf-tool') ? 'tools' : 'templates';
  const full = path.join(STAGING, section, slug, 'full');
  const jsonName = id.startsWith('mf-tool') ? 'rules.json' : 'playbook.json';
  const jsonPath = path.join(full, jsonName);
  const agentPath = path.join(full, 'AGENT.md');
  if (!fs.existsSync(jsonPath)) return;
  patchJsonFile(jsonPath, sig);
  if (fs.existsSync(agentPath)) patchAgentMd(agentPath, sig);
  const rel = path.relative(STAGING, jsonPath).replace(/\\/g, '/');
  modified.push(`402 Biz/${rel}`);
  if (fs.existsSync(agentPath)) modified.push(`402 Biz/${path.relative(STAGING, agentPath).replace(/\\/g, '/')}`);
}

for (const [id, slug] of Object.entries(SLUG_BY_ID)) {
  const section = id.startsWith('mf-tool') ? 'tools' : 'templates';
  applyToBase(MF, section, slug, id);
  applyStaging(slug, id);
}

const manifestPath = path.join(MF, 'catalog-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.job_spine.description = 'Small-business job lifecycle for Treasure Valley-style ops. Fetch chain in order; attach extensions by anchor.';
manifest.job_spine.extension_clusters = EXTENSION_CLUSTERS;
manifest.job_spine.extension_index = Object.keys(EXT_META).map((id) => ({
  id,
  anchor: SIGNAL[id].spine_anchor,
  cluster: SIGNAL[id].cluster,
  fetch_when: SIGNAL[id].use_when,
}));

for (const entry of manifest.entries) {
  const sig = SIGNAL[entry.id];
  if (!sig) continue;
  entry.description = sig.manifest_description;
  entry.tags = sig.tags;
  entry.use_when = sig.use_when;
  if (sig.spine_anchor) entry.spine_anchor = sig.spine_anchor;
  if (sig.cluster) entry.cluster = sig.cluster;
  if (sig.spine_role) entry.spine_role = sig.spine_role;
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
modified.push('2nd-pages/materials-factory/catalog-manifest.json');

const summaryPath = path.join(ROOT, 'X402-SIGNAL-ENHANCEMENT.txt');
const summary = `X402 agent signal enhancement ${new Date().toISOString().slice(0, 10)}
Artifacts touched: ${Object.keys(SLUG_BY_ID).length} tools+templates (mf-train-001 excluded)
Live: nwb-vending/2nd-pages/materials-factory
Staging sync: 402 Biz/templates + tools

Schema added per pack:
  agent_signal { use_when, decision_criteria, operator_context, spine_anchor?, cluster? }
  version bump 1.0.0 -> 1.1.0 where applicable
  related_artifacts: spine_anchor prepended when missing
  AGENT.md: Agent signal (v1.1) section

Manifest:
  job_spine.extension_clusters (8 groups)
  job_spine.extension_index (40 extension rows)
  entries[]: description, tags, use_when, spine_anchor, cluster, spine_role

Unchanged: teasers, examples.json, templates.json, x402 gates, prices

Modified file count: ${modified.length}
`;
fs.writeFileSync(summaryPath, summary + '\n' + modified.map((f) => `- ${f}`).join('\n') + '\n');

console.log(summary);
console.log('Modified files:', modified.length);