import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { HTTPFacilitatorClient, type RoutesConfig } from "@x402/core/server";
import type { Network } from "@x402/core/types";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { Hono, type MiddlewareHandler } from "hono";

export interface Env {
  ASSETS: Fetcher;
  PAY_TO: string;
  CDP_API_KEY_ID?: string;
  CDP_API_KEY_SECRET?: string;
  NETWORK:
    | "base-sepolia"
    | "base"
    | "abstract"
    | "abstract-testnet"
    | "avalanche-fuji"
    | "avalanche"
    | "iotex"
    | "solana-devnet"
    | "solana"
    | "sei"
    | "sei-testnet"
    | "polygon"
    | "polygon-amoy"
    | "peaq"
    | "story"
    | "educhain"
    | "skale-base-sepolia";
  FACILITATOR_URL?: string;
}

type GatedRoute = {
  prefix: string;
  price: string;
  description: string;
  artifact: string;
};

const GATED_ROUTES: GatedRoute[] = [
  {
    prefix: "/2nd-pages/materials-factory/training/llm-api-bootcamp/full",
    price: "$0.08",
    description: "LLM API Bootcamp agent pack v2: playbook + modules + templates (mf-train-001)",
    artifact: "mf-train-001",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/complaint-recovery-playbook/full",
    price: "$0.08",
    description: "Complaint Recovery Playbook agent pack (mf-tpl-001)",
    artifact: "mf-tpl-001",
  },
  {
    prefix: "/2nd-pages/materials-factory/tools/should-i-automate/full",
    price: "$0.05",
    description: "Should I Automate This decision rubric (mf-tool-001)",
    artifact: "mf-tool-001",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/employee-onboarding-kit/full",
    price: "$0.08",
    description: "Rapid Employee Onboarding Kit agent pack (mf-tpl-002)",
    artifact: "mf-tpl-002",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/hiring-character-gauge/full",
    price: "$0.08",
    description: "Hiring Character Gauge interview pack (mf-tpl-003)",
    artifact: "mf-tpl-003",
  },
  {
    prefix: "/2nd-pages/materials-factory/tools/ai-task-fit/full",
    price: "$0.05",
    description: "AI Task Fit routing rubric (mf-tool-002)",
    artifact: "mf-tool-002",
  },
  {
    prefix: "/2nd-pages/materials-factory/tools/scope-creep-say-no/full",
    price: "$0.05",
    description: "Scope Creep / Say-No boundary rubric (mf-tool-003)",
    artifact: "mf-tool-003",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-intake-playbook/full",
    price: "$0.08",
    description: "Client Intake Playbook agent pack (mf-tpl-004)",
    artifact: "mf-tpl-004",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/weekly-ops-review/full",
    price: "$0.08",
    description: "Weekly 15-Min Ops Review agent pack (mf-tpl-005)",
    artifact: "mf-tpl-005",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/quote-estimate-gate/full",
    price: "$0.08",
    description: "Quote / Estimate Gate agent pack (mf-tpl-006)",
    artifact: "mf-tpl-006",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/delivery-handoff/full",
    price: "$0.08",
    description: "Delivery + Handoff agent pack (mf-tpl-007)",
    artifact: "mf-tpl-007",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/invoice-payment-chase/full",
    price: "$0.08",
    description: "Invoice + Payment Chase agent pack (mf-tpl-008)",
    artifact: "mf-tpl-008",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/vendor-issue/full",
    price: "$0.08",
    description: "Vendor Issue Playbook agent pack (mf-tpl-009)",
    artifact: "mf-tpl-009",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/project-kickoff/full",
    price: "$0.08",
    description: "Project Kickoff Checklist agent pack (mf-tpl-010)",
    artifact: "mf-tpl-010",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/proof-approval-gate/full",
    price: "$0.08",
    description: "Proof + Client Approval Gate agent pack (mf-tpl-011)",
    artifact: "mf-tpl-011",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/change-order-mid-job/full",
    price: "$0.08",
    description: "Change Order Mid-Job agent pack (mf-tpl-012)",
    artifact: "mf-tpl-012",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-status-update/full",
    price: "$0.08",
    description: "Client Status Update agent pack (mf-tpl-013)",
    artifact: "mf-tpl-013",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/quote-follow-up/full",
    price: "$0.08",
    description: "Quote Follow-Up agent pack (mf-tpl-014)",
    artifact: "mf-tpl-014",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/job-close-archive/full",
    price: "$0.08",
    description: "Job Close + Archive agent pack (mf-tpl-015)",
    artifact: "mf-tpl-015",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/deposit-reminder/full",
    price: "$0.08",
    description: "Deposit Reminder agent pack (mf-tpl-016)",
    artifact: "mf-tpl-016",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/production-handoff-internal/full",
    price: "$0.08",
    description: "Production Handoff (Internal) agent pack (mf-tpl-017)",
    artifact: "mf-tpl-017",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/lost-lead-archive/full",
    price: "$0.08",
    description: "Lost Lead Archive agent pack (mf-tpl-018)",
    artifact: "mf-tpl-018",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/referral-ask/full",
    price: "$0.08",
    description: "Referral Ask agent pack (mf-tpl-019)",
    artifact: "mf-tpl-019",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/warranty-support-touch/full",
    price: "$0.08",
    description: "Warranty + Support First Touch agent pack (mf-tpl-020)",
    artifact: "mf-tpl-020",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/rush-client-comms/full",
    price: "$0.08",
    description: "Rush Client Comms agent pack (mf-tpl-021)",
    artifact: "mf-tpl-021",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/meeting-phone-qualify/full",
    price: "$0.08",
    description: "Meeting / Phone Qualify agent pack (mf-tpl-022)",
    artifact: "mf-tpl-022",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/not-a-fit-referral/full",
    price: "$0.08",
    description: "Not-a-Fit Referral agent pack (mf-tpl-023)",
    artifact: "mf-tpl-023",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/reorder-repeat-client/full",
    price: "$0.08",
    description: "Reorder Repeat Client agent pack (mf-tpl-024)",
    artifact: "mf-tpl-024",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/subcontractor-handoff/full",
    price: "$0.08",
    description: "Subcontractor Handoff agent pack (mf-tpl-025)",
    artifact: "mf-tpl-025",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/qc-fail-rework/full",
    price: "$0.08",
    description: "QC Fail / Rework (Internal) agent pack (mf-tpl-026)",
    artifact: "mf-tpl-026",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-onboarding-first/full",
    price: "$0.08",
    description: "Client Onboarding (First Job) agent pack (mf-tpl-027)",
    artifact: "mf-tpl-027",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/estimate-revision/full",
    price: "$0.08",
    description: "Estimate Revision / Change Quote agent pack (mf-tpl-028)",
    artifact: "mf-tpl-028",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/payment-plan-partial/full",
    price: "$0.08",
    description: "Payment Plan / Partial Terms agent pack (mf-tpl-029)",
    artifact: "mf-tpl-029",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/job-pause-hold/full",
    price: "$0.08",
    description: "Job Pause / Client Hold agent pack (mf-tpl-030)",
    artifact: "mf-tpl-030",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/post-delivery-survey/full",
    price: "$0.08",
    description: "Post-Delivery Survey (Light) agent pack (mf-tpl-031)",
    artifact: "mf-tpl-031",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/emergency-after-hours/full",
    price: "$0.08",
    description: "Emergency After-Hours Reply agent pack (mf-tpl-032)",
    artifact: "mf-tpl-032",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/job-priority-queue/full",
    price: "$0.08",
    description: "Multi-Job Priority Queue (Internal) agent pack (mf-tpl-033)",
    artifact: "mf-tpl-033",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-asset-request/full",
    price: "$0.08",
    description: "Client Asset / File Request agent pack (mf-tpl-034)",
    artifact: "mf-tpl-034",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/pickup-will-call/full",
    price: "$0.08",
    description: "Pickup / Will-Call Handoff agent pack (mf-tpl-035)",
    artifact: "mf-tpl-035",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/install-on-site-coord/full",
    price: "$0.08",
    description: "Install / On-Site Coordination agent pack (mf-tpl-036)",
    artifact: "mf-tpl-036",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/shipping-tracking-update/full",
    price: "$0.08",
    description: "Shipping / Tracking Client Update agent pack (mf-tpl-037)",
    artifact: "mf-tpl-037",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/progress-photo-update/full",
    price: "$0.08",
    description: "Progress Photo Update (Mid-Job) agent pack (mf-tpl-038)",
    artifact: "mf-tpl-038",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/goodwill-credit/full",
    price: "$0.08",
    description: "Goodwill Credit / Courtesy Discount agent pack (mf-tpl-039)",
    artifact: "mf-tpl-039",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/refund-cancellation/full",
    price: "$0.08",
    description: "Refund / Cancellation Policy agent pack (mf-tpl-040)",
    artifact: "mf-tpl-040",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/coi-insurance-request/full",
    price: "$0.08",
    description: "COI / Insurance Certificate Request agent pack (mf-tpl-041)",
    artifact: "mf-tpl-041",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/design-revision-loop/full",
    price: "$0.08",
    description: "Design Revision Loop (Pre-Proof) agent pack (mf-tpl-042)",
    artifact: "mf-tpl-042",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/physical-sample-proof/full",
    price: "$0.08",
    description: "Physical Sample / Color Proof Approval agent pack (mf-tpl-043)",
    artifact: "mf-tpl-043",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/damage-transit-claim/full",
    price: "$0.08",
    description: "Damage in Transit Claim agent pack (mf-tpl-044)",
    artifact: "mf-tpl-044",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/retainer-ongoing/full",
    price: "$0.08",
    description: "Retainer / Ongoing Service Client agent pack (mf-tpl-045)",
    artifact: "mf-tpl-045",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/net-terms-credit-app/full",
    price: "$0.08",
    description: "Net Terms / Credit Application agent pack (mf-tpl-046)",
    artifact: "mf-tpl-046",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/seasonal-capacity-notice/full",
    price: "$0.08",
    description: "Seasonal Capacity / Lead Time Notice agent pack (mf-tpl-047)",
    artifact: "mf-tpl-047",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/multi-location-coord/full",
    price: "$0.08",
    description: "Multi-Location Client Coordination agent pack (mf-tpl-048)",
    artifact: "mf-tpl-048",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/permit-municipality/full",
    price: "$0.08",
    description: "Permit / Municipality Coordination agent pack (mf-tpl-049)",
    artifact: "mf-tpl-049",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/weather-delay-outdoor/full",
    price: "$0.08",
    description: "Weather Delay (Outdoor Work) agent pack (mf-tpl-050)",
    artifact: "mf-tpl-050",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/contact-account-transfer/full",
    price: "$0.08",
    description: "Client Contact / Account Transfer agent pack (mf-tpl-051)",
    artifact: "mf-tpl-051",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/finished-goods-storage/full",
    price: "$0.08",
    description: "Finished Goods Storage Hold agent pack (mf-tpl-052)",
    artifact: "mf-tpl-052",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/event-deadline-crunch/full",
    price: "$0.08",
    description: "Event / Trade Show Deadline agent pack (mf-tpl-053)",
    artifact: "mf-tpl-053",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/portfolio-photo-permission/full",
    price: "$0.08",
    description: "Portfolio / Photo Permission Ask agent pack (mf-tpl-054)",
    artifact: "mf-tpl-054",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/tax-exempt-cert/full",
    price: "$0.08",
    description: "Tax Exempt Certificate Request agent pack (mf-tpl-055)",
    artifact: "mf-tpl-055",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/wrong-seat-rescue/full",
    price: "$0.08",
    description: "Wrong Seat Rescue Playbook agent pack (mf-tpl-056)",
    artifact: "mf-tpl-056",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/workplace-department-map/full",
    price: "$0.08",
    description: "Workplace Department Map agent pack (mf-tpl-057)",
    artifact: "mf-tpl-057",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/tenured-change-adoption/full",
    price: "$0.08",
    description: "Tenured Change Adoption Playbook agent pack (mf-tpl-058)",
    artifact: "mf-tpl-058",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/shadow-expert-mining/full",
    price: "$0.08",
    description: "Shadow Expert Mining Playbook agent pack (mf-tpl-059)",
    artifact: "mf-tpl-059",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/return-verification-signal/full",
    price: "$0.08",
    description: "Return Verification Signal Playbook agent pack (mf-tpl-060)",
    artifact: "mf-tpl-060",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/support-ops-correlation/full",
    price: "$0.08",
    description: "Support Ops Correlation Playbook agent pack (mf-tpl-061)",
    artifact: "mf-tpl-061",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/queue-split-design/full",
    price: "$0.08",
    description: "Queue Split Design Playbook agent pack (mf-tpl-062)",
    artifact: "mf-tpl-062",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/volume-split-tracker/full",
    price: "$0.08",
    description: "Volume Split Tracker Playbook agent pack (mf-tpl-063)",
    artifact: "mf-tpl-063",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/understaffing-impact-log/full",
    price: "$0.08",
    description: "Understaffing Impact Log Playbook agent pack (mf-tpl-064)",
    artifact: "mf-tpl-064",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/support-unit-economics/full",
    price: "$0.08",
    description: "Support Unit Economics Playbook agent pack (mf-tpl-065)",
    artifact: "mf-tpl-065",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/call-forecast-variance/full",
    price: "$0.08",
    description: "Call Forecast Variance Playbook agent pack (mf-tpl-066)",
    artifact: "mf-tpl-066",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/rd-support-bridge/full",
    price: "$0.08",
    description: "R&D Support Bridge Playbook agent pack (mf-tpl-067)",
    artifact: "mf-tpl-067",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/severance-agreement-trail/full",
    price: "$0.08",
    description: "Severance Agreement Trail Playbook agent pack (mf-tpl-068)",
    artifact: "mf-tpl-068",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/severance-payment-log/full",
    price: "$0.08",
    description: "Severance Payment Log Playbook agent pack (mf-tpl-069)",
    artifact: "mf-tpl-069",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/erisa-evidence-binder/full",
    price: "$0.08",
    description: "ERISA Evidence Binder Playbook agent pack (mf-tpl-070)",
    artifact: "mf-tpl-070",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/bankruptcy-employee-creditor/full",
    price: "$0.08",
    description: "Bankruptcy Employee Creditor Playbook agent pack (mf-tpl-071)",
    artifact: "mf-tpl-071",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/post-judgment-dead-debtor/full",
    price: "$0.08",
    description: "Post-Judgment Dead Debtor Playbook agent pack (mf-tpl-072)",
    artifact: "mf-tpl-072",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/ndf-metric-gaming/full",
    price: "$0.08",
    description: "NDF Metric Gaming Playbook agent pack (mf-tpl-073)",
    artifact: "mf-tpl-073",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/rma-test-credibility/full",
    price: "$0.08",
    description: "RMA Test Credibility Playbook agent pack (mf-tpl-074)",
    artifact: "mf-tpl-074",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/account-ndf-healthcheck/full",
    price: "$0.08",
    description: "Account NDF Healthcheck Playbook agent pack (mf-tpl-075)",
    artifact: "mf-tpl-075",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/site-process-discovery/full",
    price: "$0.08",
    description: "Site Process Discovery Playbook agent pack (mf-tpl-076)",
    artifact: "mf-tpl-076",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/defect-fix-shotgun-relapse/full",
    price: "$0.08",
    description: "Defect Fix Shotgun Relapse Playbook agent pack (mf-tpl-077)",
    artifact: "mf-tpl-077",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/support-incentive-steering/full",
    price: "$0.08",
    description: "Support Incentive Steering Playbook agent pack (mf-tpl-078)",
    artifact: "mf-tpl-078",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/failure-cohort-truth/full",
    price: "$0.08",
    description: "Failure Cohort Truth Playbook agent pack (mf-tpl-079)",
    artifact: "mf-tpl-079",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/solution-fit-handoff/full",
    price: "$0.08",
    description: "Solution Fit Handoff Playbook agent pack (mf-tpl-080)",
    artifact: "mf-tpl-080",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/metrics-that-matter-qbr/full",
    price: "$0.08",
    description: "Metrics That Matter QBR Playbook agent pack (mf-tpl-081)",
    artifact: "mf-tpl-081",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/sales-support-incident-bridge/full",
    price: "$0.08",
    description: "Sales Support Incident Bridge Playbook agent pack (mf-tpl-082)",
    artifact: "mf-tpl-082",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/high-volume-interview-redesign/full",
    price: "$0.08",
    description: "High-Volume Interview Redesign Playbook agent pack (mf-tpl-083)",
    artifact: "mf-tpl-083",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/floor-morale-task-force/full",
    price: "$0.08",
    description: "Floor Morale Task Force Playbook agent pack (mf-tpl-084)",
    artifact: "mf-tpl-084",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/pie-weekly-bridge/full",
    price: "$0.08",
    description: "PIE Weekly Bridge Playbook agent pack (mf-tpl-085)",
    artifact: "mf-tpl-085",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/support-oncall-design/full",
    price: "$0.08",
    description: "Support On-Call Design Playbook agent pack (mf-tpl-086)",
    artifact: "mf-tpl-086",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/named-account-support/full",
    price: "$0.08",
    description: "Named Account Support Playbook agent pack (mf-tpl-087)",
    artifact: "mf-tpl-087",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/escalation-engineer-ladder/full",
    price: "$0.08",
    description: "Escalation Engineer Ladder Playbook agent pack (mf-tpl-088)",
    artifact: "mf-tpl-088",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/preventable-ticket-kill/full",
    price: "$0.08",
    description: "Preventable Ticket Kill Playbook agent pack (mf-tpl-089)",
    artifact: "mf-tpl-089",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/support-knowledge-repo/full",
    price: "$0.08",
    description: "Support Knowledge Repo Playbook agent pack (mf-tpl-090)",
    artifact: "mf-tpl-090",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/team-showcase-speaking/full",
    price: "$0.08",
    description: "Team Showcase Speaking Playbook agent pack (mf-tpl-091)",
    artifact: "mf-tpl-091",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/customer-learning-program/full",
    price: "$0.08",
    description: "Customer Learning Program Playbook agent pack (mf-tpl-092)",
    artifact: "mf-tpl-092",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/control-panel-cabinet/full",
    price: "$0.08",
    description: "Control Panel Cabinet Playbook agent pack (mf-tpl-093)",
    artifact: "mf-tpl-093",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/vendor-fleet-remediation/full",
    price: "$0.08",
    description: "Vendor Fleet Remediation Playbook agent pack (mf-tpl-094)",
    artifact: "mf-tpl-094",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/service-operations-desk/full",
    price: "$0.08",
    description: "Service Operations Desk Playbook agent pack (mf-tpl-099)",
    artifact: "mf-tpl-099",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/services-revenue-center/full",
    price: "$0.08",
    description: "Services Revenue Center Playbook agent pack (mf-tpl-100)",
    artifact: "mf-tpl-100",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/parts-recovery-program/full",
    price: "$0.08",
    description: "Parts Recovery Program Playbook agent pack (mf-tpl-101)",
    artifact: "mf-tpl-101",
  },
];

const NETWORK_CAIP2: Partial<Record<Env["NETWORK"], string>> = {
  base: "eip155:8453",
  "base-sepolia": "eip155:84532",
};

function toCaip2Network(network: Env["NETWORK"]): Network {
  return (NETWORK_CAIP2[network] ?? "eip155:8453") as Network;
}

function normalizePath(path: string): string {
  if (path.length > 1) return path.replace(/\/+$/, "");
  return path;
}

function isGatedPath(path: string): boolean {
  const p = normalizePath(path);
  return GATED_ROUTES.some(
    (r) => p === r.prefix || p.startsWith(r.prefix + "/")
  );
}

function withNoStore(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
  headers.set("CDN-Cache-Control", "no-store");
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function buildRoutesConfig(
  payTo: string,
  network: Env["NETWORK"]
): RoutesConfig {
  const caip2 = toCaip2Network(network);
  const routes: RoutesConfig = {};

  for (const route of GATED_ROUTES) {
    // All methods (GET, HEAD, etc.) — HEAD was bypassing paywall and serving cached 200.
    const pattern = `* ${route.prefix}/*`;
    routes[pattern] = {
      accepts: {
        scheme: "exact",
        price: route.price,
        network: caip2,
        payTo: payTo as `0x${string}`,
        maxTimeoutSeconds: 300,
      },
      description: route.description,
      mimeType: "application/json",
      extensions: declareDiscoveryExtension({
        input: { pack_id: route.artifact },
        inputSchema: {
          properties: {
            pack_id: {
              type: "string",
              const: route.artifact,
              description: "Materials Factory catalog pack id",
            },
          },
        },
        output: {
          example: {
            artifact: route.artifact,
            audience: "agent",
            version: "2.0.0",
          },
        },
      }),
    };
  }

  return routes;
}

const CDP_FACILITATOR_URL = "https://api.cdp.coinbase.com/platform/v2/x402";
const CDP_FACILITATOR_HOST = "api.cdp.coinbase.com";
const CDP_FACILITATOR_PATH = "/platform/v2/x402";
const TESTNET_FACILITATOR_URL = "https://x402.org/facilitator";

function facilitatorDiagnostics(env: Env) {
  const hasCdpAuth = !!(env.CDP_API_KEY_ID && env.CDP_API_KEY_SECRET);
  const configuredUrl = env.FACILITATOR_URL ?? TESTNET_FACILITATOR_URL;
  const effectiveUrl = hasCdpAuth ? CDP_FACILITATOR_URL : configuredUrl;
  return {
    cdp_auth: hasCdpAuth,
    facilitator_url: effectiveUrl,
    mainnet_ready:
      hasCdpAuth &&
      env.NETWORK === "base" &&
      effectiveUrl.includes("api.cdp.coinbase.com"),
  };
}

function buildFacilitatorClient(env: Env): HTTPFacilitatorClient {
  const hasCdpAuth = !!(env.CDP_API_KEY_ID && env.CDP_API_KEY_SECRET);
  const url = (
    hasCdpAuth
      ? CDP_FACILITATOR_URL
      : (env.FACILITATOR_URL ?? TESTNET_FACILITATOR_URL)
  ) as `${string}://${string}`;

  if (!hasCdpAuth) {
    return new HTTPFacilitatorClient({ url });
  }

  const auth = async (method: "GET" | "POST", path: string) => {
    const token = await generateJwt({
      apiKeyId: env.CDP_API_KEY_ID!,
      apiKeySecret: env.CDP_API_KEY_SECRET!,
      requestMethod: method,
      requestHost: CDP_FACILITATOR_HOST,
      requestPath: `${CDP_FACILITATOR_PATH}${path}`,
    });
    return { Authorization: `Bearer ${token}` };
  };

  return new HTTPFacilitatorClient({
    url,
    createAuthHeaders: async () => ({
      verify: await auth("POST", "/verify"),
      settle: await auth("POST", "/settle"),
      supported: await auth("GET", "/supported"),
    }),
  });
}

let cachedPaymentMw: MiddlewareHandler | null = null;
let cachedPaymentKey: string | null = null;

function getPaymentMiddleware(env: Env): MiddlewareHandler {
  const key = `${env.PAY_TO}:${env.NETWORK}:${env.CDP_API_KEY_ID ? "cdp" : "test"}`;
  if (cachedPaymentMw && cachedPaymentKey === key) {
    return cachedPaymentMw;
  }

  const caip2 = toCaip2Network(env.NETWORK);
  const facilitator = buildFacilitatorClient(env);
  const resourceServer = new x402ResourceServer(facilitator).register(
    caip2,
    new ExactEvmScheme()
  );
  const routes = buildRoutesConfig(env.PAY_TO, env.NETWORK);

  cachedPaymentMw = paymentMiddleware(routes, resourceServer);
  cachedPaymentKey = key;
  return cachedPaymentMw;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/__x402/health", (c) => {
  const fac = facilitatorDiagnostics(c.env);
  return c.json({
    ok: true,
    service: "nwb-vending",
    network: c.env.NETWORK,
    ...fac,
    gated_routes: GATED_ROUTES.map((r) => ({
      prefix: r.prefix,
      price: r.price,
      artifact: r.artifact,
    })),
    pay_to_suffix: c.env.PAY_TO?.slice(-6) ?? null,
  });
});

app.get("/.well-known/x402", async (c) => {
  const asset = await c.env.ASSETS.fetch(
    new Request(new URL("/.well-known/x402", c.req.url), c.req.raw)
  );
  if (!asset.ok) return c.text("not found", 404);
  const body = await asset.text();
  return c.body(body, 200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=300",
  });
});

app.get("/openapi.json", async (c) => {
  const asset = await c.env.ASSETS.fetch(
    new Request(new URL("/openapi.json", c.req.url), c.req.raw)
  );
  if (!asset.ok) return c.text("not found", 404);
  const body = await asset.text();
  return c.body(body, 200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=300",
  });
});

async function serveNwbFavicon(c: {
  env: Env;
  req: { url: string; raw: Request };
  body: (body: ArrayBuffer, status: number, headers: Record<string, string>) => Response;
  text: (body: string, status: number) => Response;
}) {
  for (const path of [
    "/favicon-32.png",
    "/favicon-16.png",
    "/favicon.png",
    "/favicon.ico",
    "/assets/nwb-logo.png",
  ]) {
    const asset = await c.env.ASSETS.fetch(
      new Request(new URL(path, c.req.url), c.req.raw)
    );
    if (asset.ok) {
      const body = await asset.arrayBuffer();
      return c.body(body, 200, {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      });
    }
  }
  return c.text("not found", 404);
}

app.get("/favicon.ico", async (c) => serveNwbFavicon(c));
app.get("/favicon.png", async (c) => serveNwbFavicon(c));

app.all("*", async (c) => {
  const gated = isGatedPath(c.req.path);
  const payMw = getPaymentMiddleware(c.env);
  const out = await payMw(c, async () => {
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    c.res = gated ? withNoStore(asset) : asset;
  });
  if (gated && c.res) {
    c.res = withNoStore(c.res);
  }
  return out;
});

export default app;