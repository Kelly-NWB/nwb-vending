#!/usr/bin/env node
/**
 * agent_signal v1.2 — not_for, pairs_with, trigger_phrases on existing packs.
 * No new SKUs. Live MF + 402 Biz staging sync.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MF = path.join(ROOT, "2nd-pages", "materials-factory");
const STAGING = path.join("D:", "GrokBuild", "Experiments", "402 Biz");

const SLUG_BY_ID = {
  "mf-tpl-001": "complaint-recovery-playbook",
  "mf-tpl-002": "employee-onboarding-kit",
  "mf-tpl-003": "hiring-character-gauge",
  "mf-tpl-004": "client-intake-playbook",
  "mf-tpl-005": "weekly-ops-review",
  "mf-tpl-006": "quote-estimate-gate",
  "mf-tpl-007": "delivery-handoff",
  "mf-tpl-008": "invoice-payment-chase",
  "mf-tpl-009": "vendor-issue",
  "mf-tpl-010": "project-kickoff",
  "mf-tpl-011": "proof-approval-gate",
  "mf-tpl-012": "change-order-mid-job",
  "mf-tpl-013": "client-status-update",
  "mf-tpl-014": "quote-follow-up",
  "mf-tpl-015": "job-close-archive",
  "mf-tpl-016": "deposit-reminder",
  "mf-tpl-017": "production-handoff-internal",
  "mf-tpl-018": "lost-lead-archive",
  "mf-tpl-019": "referral-ask",
  "mf-tpl-020": "warranty-support-touch",
  "mf-tpl-021": "rush-client-comms",
  "mf-tpl-022": "meeting-phone-qualify",
  "mf-tpl-023": "not-a-fit-referral",
  "mf-tpl-024": "reorder-repeat-client",
  "mf-tpl-025": "subcontractor-handoff",
  "mf-tpl-026": "qc-fail-rework",
  "mf-tpl-027": "client-onboarding-first",
  "mf-tpl-028": "estimate-revision",
  "mf-tpl-029": "payment-plan-partial",
  "mf-tpl-030": "job-pause-hold",
  "mf-tpl-031": "post-delivery-survey",
  "mf-tpl-032": "emergency-after-hours",
  "mf-tpl-033": "job-priority-queue",
  "mf-tpl-034": "client-asset-request",
  "mf-tpl-035": "pickup-will-call",
  "mf-tpl-036": "install-on-site-coord",
  "mf-tpl-037": "shipping-tracking-update",
  "mf-tpl-038": "progress-photo-update",
  "mf-tpl-039": "goodwill-credit",
  "mf-tpl-040": "refund-cancellation",
  "mf-tpl-041": "coi-insurance-request",
  "mf-tpl-042": "design-revision-loop",
  "mf-tpl-043": "physical-sample-proof",
  "mf-tpl-044": "damage-transit-claim",
  "mf-tpl-045": "retainer-ongoing",
  "mf-tpl-046": "net-terms-credit-app",
  "mf-tpl-047": "seasonal-capacity-notice",
  "mf-tpl-048": "multi-location-coord",
  "mf-tpl-049": "permit-municipality",
  "mf-tpl-050": "weather-delay-outdoor",
  "mf-tpl-051": "contact-account-transfer",
  "mf-tpl-052": "finished-goods-storage",
  "mf-tpl-053": "event-deadline-crunch",
  "mf-tpl-054": "portfolio-photo-permission",
  "mf-tpl-055": "tax-exempt-cert",
  "mf-tool-001": "should-i-automate",
  "mf-tool-002": "ai-task-fit",
  "mf-tool-003": "scope-creep-say-no",
};

const SPINE_CHAIN = [
  "mf-tpl-004",
  "mf-tpl-006",
  "mf-tpl-014",
  "mf-tpl-010",
  "mf-tpl-011",
  "mf-tpl-012",
  "mf-tpl-013",
  "mf-tpl-009",
  "mf-tpl-007",
  "mf-tpl-008",
  "mf-tpl-015",
];

const NOT_FOR = {
  "mf-train-001":
    "Job spine comms packs or rubrics — use templates/tools after bootcamp if needed.",
  "mf-tool-001":
    "Routing a specific email draft (mf-tool-002) or saying no to scope creep (mf-tool-003).",
  "mf-tool-002":
    "Buy/build automation decision (mf-tool-001) or CO boundary (mf-tool-003).",
  "mf-tool-003":
    "Automation fit (mf-tool-001) or AI draft routing (mf-tool-002).",
  "mf-tpl-001":
    "New lead intake (mf-tpl-004) or light warranty FAQ (mf-tpl-020).",
  "mf-tpl-004":
    "Angry existing customer (mf-tpl-001) or sending a quote (mf-tpl-006).",
  "mf-tpl-006":
    "Following up silent quote (mf-tpl-014) or revising sent quote (mf-tpl-028).",
  "mf-tpl-014":
    "First quote build (mf-tpl-006) or post-accept kickoff (mf-tpl-010).",
  "mf-tpl-010":
    "Pre-accept quote work (mf-tpl-006) or proof round (mf-tpl-011).",
  "mf-tpl-011":
    "Design loop before proof (mf-tpl-042) or physical sample (mf-tpl-043).",
  "mf-tpl-012":
    "Initial quote only — use when scope grows after accept.",
  "mf-tpl-013":
    "Complaint recovery (mf-tpl-001) — status updates assume active job in good faith.",
  "mf-tpl-020":
    "Full complaint recovery (mf-tpl-001) — heated or reputation threat.",
  "mf-tpl-005":
    "Single client thread — use spine packs for one job.",
};

function pairsFor(id, doc) {
  const out = new Set();
  const rel = doc.related_artifacts || [];
  for (const r of rel) out.add(r);
  if (doc.agent_signal?.spine_anchor) out.add(doc.agent_signal.spine_anchor);
  const idx = SPINE_CHAIN.indexOf(id);
  if (idx >= 0) {
    if (idx > 0) out.add(SPINE_CHAIN[idx - 1]);
    if (idx < SPINE_CHAIN.length - 1) out.add(SPINE_CHAIN[idx + 1]);
    out.add("mf-tpl-005");
  }
  if (id === "mf-tpl-001") out.add("mf-tool-003");
  if (id.startsWith("mf-tool")) {
    out.add("mf-tpl-001");
    out.add("mf-tpl-004");
  }
  if (id === "mf-train-001") {
    out.add("mf-tool-002");
    out.add("mf-tool-001");
  }
  out.delete(id);
  return [...out].slice(0, 6);
}

function notFor(id, doc) {
  if (NOT_FOR[id]) return NOT_FOR[id];
  if (doc.agent_signal?.spine_anchor) {
    return `Spine chain step only when ${doc.agent_signal.spine_anchor} context applies — not a substitute for chain order.`;
  }
  return "Generic ops — fetch only when use_when matches; do not replace spine chain packs.";
}

function triggers(doc) {
  const u = doc.agent_signal?.use_when || doc.description || doc.title || "";
  const t = [u];
  if (doc.title) t.push(`Need playbook: ${doc.title}`);
  return [...new Set(t)].slice(0, 3);
}

function agentMdV12(sig) {
  return `\n## Agent signal (v1.2)\n\n- **Use when:** ${sig.use_when}\n- **Not for:** ${sig.not_for}\n- **Pairs with:** ${sig.pairs_with.join(", ")}\n- **Trigger phrases:** ${sig.trigger_phrases.map((p) => `"${p}"`).join("; ")}\n- **Decision criteria:** ${sig.decision_criteria.join(" ")}\n`;
}

function patchJson(jsonPath) {
  const doc = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  if (!doc.agent_signal?.use_when) return false;
  const id = doc.artifact;
  doc.agent_signal = {
    ...doc.agent_signal,
    version: "1.2",
    not_for: notFor(id, doc),
    pairs_with: pairsFor(id, doc),
    trigger_phrases: triggers(doc),
  };
  if (doc.version?.startsWith("1.")) doc.version = "1.2.0";
  fs.writeFileSync(jsonPath, JSON.stringify(doc, null, 2) + "\n");
  return doc;
}

function patchAgentMd(agentPath, sig) {
  if (!fs.existsSync(agentPath)) return;
  let md = fs.readFileSync(agentPath, "utf8");
  md = md.replace(/\n## Agent signal \(v1\.[12]\)[\s\S]*$/, "");
  md = md.trimEnd() + agentMdV12(sig);
  fs.writeFileSync(agentPath, md + "\n");
}

function applyDir(base, section, slug, id) {
  const jsonName = id.startsWith("mf-tool") ? "rules.json" : "playbook.json";
  const jsonPath = path.join(base, section, slug, "full", jsonName);
  if (!fs.existsSync(jsonPath)) return null;
  const doc = patchJson(jsonPath);
  if (!doc) return null;
  patchAgentMd(path.join(base, section, slug, "full", "AGENT.md"), doc.agent_signal);
  return doc;
}

const touched = [];

for (const [id, slug] of Object.entries(SLUG_BY_ID)) {
  const section = id.startsWith("mf-tool") ? "tools" : "templates";
  for (const base of [MF, STAGING]) {
    if (!fs.existsSync(base)) continue;
    const doc = applyDir(base, section, slug, id);
    if (doc && base === MF) touched.push(id);
  }
}

// train
for (const base of [MF, STAGING]) {
  const p = path.join(base, "training", "llm-api-bootcamp", "full", "playbook.json");
  if (!fs.existsSync(p)) continue;
  const doc = JSON.parse(fs.readFileSync(p, "utf8"));
  doc.agent_signal = {
    version: "1.2",
    use_when: "Agent or operator needs LLM API integration patterns for small-business tools.",
    decision_criteria: [
      "Use for API wiring and prompts — not for customer comms templates.",
    ],
    operator_context: "Treasure Valley shops: keep API keys server-side; teasers stay public.",
    not_for: NOT_FOR["mf-train-001"],
    pairs_with: pairsFor("mf-train-001", { related_artifacts: ["mf-tool-002"] }),
    trigger_phrases: [
      "How do I call an LLM API?",
      "Need LLM API bootcamp pack",
    ],
  };
  if (doc.version?.startsWith("1.")) doc.version = "1.2.0";
  fs.writeFileSync(p, JSON.stringify(doc, null, 2) + "\n");
  patchAgentMd(path.join(base, "training", "llm-api-bootcamp", "full", "AGENT.md"), doc.agent_signal);
  if (base === MF) touched.push("mf-train-001");
}

const manifestPath = path.join(MF, "catalog-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.agent_signal_schema = "1.2";

for (const entry of manifest.entries) {
  const section = entry.section;
  const slug =
    entry.id === "mf-train-001"
      ? "llm-api-bootcamp"
      : SLUG_BY_ID[entry.id];
  if (!slug) continue;
  const jsonName = entry.id.startsWith("mf-tool") ? "rules.json" : "playbook.json";
  const jsonPath = path.join(MF, section, slug, "full", jsonName);
  if (!fs.existsSync(jsonPath)) continue;
  const doc = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  if (!doc.agent_signal) continue;
  entry.not_for = doc.agent_signal.not_for;
  entry.pairs_with = doc.agent_signal.pairs_with;
  entry.trigger_phrases = doc.agent_signal.trigger_phrases;
  entry.agent_signal_version = "1.2";
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`tighten v1.2: ${touched.length} artifacts`);
console.log("manifest: agent_signal_schema 1.2, entries enriched");