import { Hono } from "hono";
import { paymentMiddleware, type RoutesConfig } from "x402-hono";

export interface Env {
  ASSETS: Fetcher;
  PAY_TO: string;
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
    price: "$0.40",
    description: "LLM API Bootcamp agent pack v2: playbook + modules + templates (mf-train-001)",
    artifact: "mf-train-001",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/complaint-recovery-playbook/full",
    price: "$0.45",
    description: "Complaint Recovery Playbook agent pack (mf-tpl-001)",
    artifact: "mf-tpl-001",
  },
  {
    prefix: "/2nd-pages/materials-factory/tools/should-i-automate/full",
    price: "$0.35",
    description: "Should I Automate This decision rubric (mf-tool-001)",
    artifact: "mf-tool-001",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/employee-onboarding-kit/full",
    price: "$0.45",
    description: "Rapid Employee Onboarding Kit agent pack (mf-tpl-002)",
    artifact: "mf-tpl-002",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/hiring-character-gauge/full",
    price: "$0.45",
    description: "Hiring Character Gauge interview pack (mf-tpl-003)",
    artifact: "mf-tpl-003",
  },
  {
    prefix: "/2nd-pages/materials-factory/tools/ai-task-fit/full",
    price: "$0.35",
    description: "AI Task Fit routing rubric (mf-tool-002)",
    artifact: "mf-tool-002",
  },
  {
    prefix: "/2nd-pages/materials-factory/tools/scope-creep-say-no/full",
    price: "$0.35",
    description: "Scope Creep / Say-No boundary rubric (mf-tool-003)",
    artifact: "mf-tool-003",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-intake-playbook/full",
    price: "$0.45",
    description: "Client Intake Playbook agent pack (mf-tpl-004)",
    artifact: "mf-tpl-004",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/weekly-ops-review/full",
    price: "$0.45",
    description: "Weekly 15-Min Ops Review agent pack (mf-tpl-005)",
    artifact: "mf-tpl-005",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/quote-estimate-gate/full",
    price: "$0.45",
    description: "Quote / Estimate Gate agent pack (mf-tpl-006)",
    artifact: "mf-tpl-006",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/delivery-handoff/full",
    price: "$0.45",
    description: "Delivery + Handoff agent pack (mf-tpl-007)",
    artifact: "mf-tpl-007",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/invoice-payment-chase/full",
    price: "$0.45",
    description: "Invoice + Payment Chase agent pack (mf-tpl-008)",
    artifact: "mf-tpl-008",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/vendor-issue/full",
    price: "$0.45",
    description: "Vendor Issue Playbook agent pack (mf-tpl-009)",
    artifact: "mf-tpl-009",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/project-kickoff/full",
    price: "$0.45",
    description: "Project Kickoff Checklist agent pack (mf-tpl-010)",
    artifact: "mf-tpl-010",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/proof-approval-gate/full",
    price: "$0.45",
    description: "Proof + Client Approval Gate agent pack (mf-tpl-011)",
    artifact: "mf-tpl-011",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/change-order-mid-job/full",
    price: "$0.45",
    description: "Change Order Mid-Job agent pack (mf-tpl-012)",
    artifact: "mf-tpl-012",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-status-update/full",
    price: "$0.45",
    description: "Client Status Update agent pack (mf-tpl-013)",
    artifact: "mf-tpl-013",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/quote-follow-up/full",
    price: "$0.45",
    description: "Quote Follow-Up agent pack (mf-tpl-014)",
    artifact: "mf-tpl-014",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/job-close-archive/full",
    price: "$0.45",
    description: "Job Close + Archive agent pack (mf-tpl-015)",
    artifact: "mf-tpl-015",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/deposit-reminder/full",
    price: "$0.45",
    description: "Deposit Reminder agent pack (mf-tpl-016)",
    artifact: "mf-tpl-016",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/production-handoff-internal/full",
    price: "$0.45",
    description: "Production Handoff (Internal) agent pack (mf-tpl-017)",
    artifact: "mf-tpl-017",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/lost-lead-archive/full",
    price: "$0.45",
    description: "Lost Lead Archive agent pack (mf-tpl-018)",
    artifact: "mf-tpl-018",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/referral-ask/full",
    price: "$0.45",
    description: "Referral Ask agent pack (mf-tpl-019)",
    artifact: "mf-tpl-019",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/warranty-support-touch/full",
    price: "$0.45",
    description: "Warranty + Support First Touch agent pack (mf-tpl-020)",
    artifact: "mf-tpl-020",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/rush-client-comms/full",
    price: "$0.45",
    description: "Rush Client Comms agent pack (mf-tpl-021)",
    artifact: "mf-tpl-021",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/meeting-phone-qualify/full",
    price: "$0.45",
    description: "Meeting / Phone Qualify agent pack (mf-tpl-022)",
    artifact: "mf-tpl-022",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/not-a-fit-referral/full",
    price: "$0.45",
    description: "Not-a-Fit Referral agent pack (mf-tpl-023)",
    artifact: "mf-tpl-023",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/reorder-repeat-client/full",
    price: "$0.45",
    description: "Reorder Repeat Client agent pack (mf-tpl-024)",
    artifact: "mf-tpl-024",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/subcontractor-handoff/full",
    price: "$0.45",
    description: "Subcontractor Handoff agent pack (mf-tpl-025)",
    artifact: "mf-tpl-025",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/qc-fail-rework/full",
    price: "$0.45",
    description: "QC Fail / Rework (Internal) agent pack (mf-tpl-026)",
    artifact: "mf-tpl-026",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-onboarding-first/full",
    price: "$0.45",
    description: "Client Onboarding (First Job) agent pack (mf-tpl-027)",
    artifact: "mf-tpl-027",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/estimate-revision/full",
    price: "$0.45",
    description: "Estimate Revision / Change Quote agent pack (mf-tpl-028)",
    artifact: "mf-tpl-028",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/payment-plan-partial/full",
    price: "$0.45",
    description: "Payment Plan / Partial Terms agent pack (mf-tpl-029)",
    artifact: "mf-tpl-029",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/job-pause-hold/full",
    price: "$0.45",
    description: "Job Pause / Client Hold agent pack (mf-tpl-030)",
    artifact: "mf-tpl-030",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/post-delivery-survey/full",
    price: "$0.45",
    description: "Post-Delivery Survey (Light) agent pack (mf-tpl-031)",
    artifact: "mf-tpl-031",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/emergency-after-hours/full",
    price: "$0.45",
    description: "Emergency After-Hours Reply agent pack (mf-tpl-032)",
    artifact: "mf-tpl-032",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/job-priority-queue/full",
    price: "$0.45",
    description: "Multi-Job Priority Queue (Internal) agent pack (mf-tpl-033)",
    artifact: "mf-tpl-033",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/client-asset-request/full",
    price: "$0.45",
    description: "Client Asset / File Request agent pack (mf-tpl-034)",
    artifact: "mf-tpl-034",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/pickup-will-call/full",
    price: "$0.45",
    description: "Pickup / Will-Call Handoff agent pack (mf-tpl-035)",
    artifact: "mf-tpl-035",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/install-on-site-coord/full",
    price: "$0.45",
    description: "Install / On-Site Coordination agent pack (mf-tpl-036)",
    artifact: "mf-tpl-036",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/shipping-tracking-update/full",
    price: "$0.45",
    description: "Shipping / Tracking Client Update agent pack (mf-tpl-037)",
    artifact: "mf-tpl-037",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/progress-photo-update/full",
    price: "$0.45",
    description: "Progress Photo Update (Mid-Job) agent pack (mf-tpl-038)",
    artifact: "mf-tpl-038",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/goodwill-credit/full",
    price: "$0.45",
    description: "Goodwill Credit / Courtesy Discount agent pack (mf-tpl-039)",
    artifact: "mf-tpl-039",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/refund-cancellation/full",
    price: "$0.45",
    description: "Refund / Cancellation Policy agent pack (mf-tpl-040)",
    artifact: "mf-tpl-040",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/coi-insurance-request/full",
    price: "$0.45",
    description: "COI / Insurance Certificate Request agent pack (mf-tpl-041)",
    artifact: "mf-tpl-041",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/design-revision-loop/full",
    price: "$0.45",
    description: "Design Revision Loop (Pre-Proof) agent pack (mf-tpl-042)",
    artifact: "mf-tpl-042",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/physical-sample-proof/full",
    price: "$0.45",
    description: "Physical Sample / Color Proof Approval agent pack (mf-tpl-043)",
    artifact: "mf-tpl-043",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/damage-transit-claim/full",
    price: "$0.45",
    description: "Damage in Transit Claim agent pack (mf-tpl-044)",
    artifact: "mf-tpl-044",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/retainer-ongoing/full",
    price: "$0.45",
    description: "Retainer / Ongoing Service Client agent pack (mf-tpl-045)",
    artifact: "mf-tpl-045",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/net-terms-credit-app/full",
    price: "$0.45",
    description: "Net Terms / Credit Application agent pack (mf-tpl-046)",
    artifact: "mf-tpl-046",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/seasonal-capacity-notice/full",
    price: "$0.45",
    description: "Seasonal Capacity / Lead Time Notice agent pack (mf-tpl-047)",
    artifact: "mf-tpl-047",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/multi-location-coord/full",
    price: "$0.45",
    description: "Multi-Location Client Coordination agent pack (mf-tpl-048)",
    artifact: "mf-tpl-048",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/permit-municipality/full",
    price: "$0.45",
    description: "Permit / Municipality Coordination agent pack (mf-tpl-049)",
    artifact: "mf-tpl-049",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/weather-delay-outdoor/full",
    price: "$0.45",
    description: "Weather Delay (Outdoor Work) agent pack (mf-tpl-050)",
    artifact: "mf-tpl-050",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/contact-account-transfer/full",
    price: "$0.45",
    description: "Client Contact / Account Transfer agent pack (mf-tpl-051)",
    artifact: "mf-tpl-051",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/finished-goods-storage/full",
    price: "$0.45",
    description: "Finished Goods Storage Hold agent pack (mf-tpl-052)",
    artifact: "mf-tpl-052",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/event-deadline-crunch/full",
    price: "$0.45",
    description: "Event / Trade Show Deadline agent pack (mf-tpl-053)",
    artifact: "mf-tpl-053",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/portfolio-photo-permission/full",
    price: "$0.45",
    description: "Portfolio / Photo Permission Ask agent pack (mf-tpl-054)",
    artifact: "mf-tpl-054",
  },
  {
    prefix: "/2nd-pages/materials-factory/templates/tax-exempt-cert/full",
    price: "$0.45",
    description: "Tax Exempt Certificate Request agent pack (mf-tpl-055)",
    artifact: "mf-tpl-055",
  },
];

function normalizePath(path: string): string {
  if (path.length > 1) return path.replace(/\/+$/, "");
  return path;
}

function findGatedRoute(path: string): GatedRoute | undefined {
  const p = normalizePath(path);
  return GATED_ROUTES.find(
    (r) => p === r.prefix || p.startsWith(r.prefix + "/")
  );
}

function paymentRoutes(path: string, route: GatedRoute, network: Env["NETWORK"]): RoutesConfig {
  const normalized = normalizePath(path);
  const routes: RoutesConfig = {};

  for (const key of [normalized, normalized + "/", path]) {
    routes[key] = {
      price: route.price,
      network,
      config: { description: route.description },
    };
  }

  return routes;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/__x402/health", (c) =>
  c.json({
    ok: true,
    service: "nwb-vending",
    network: c.env.NETWORK,
    gated_routes: GATED_ROUTES.map((r) => ({
      prefix: r.prefix,
      price: r.price,
      artifact: r.artifact,
    })),
    pay_to_suffix: c.env.PAY_TO?.slice(-6) ?? null,
  })
);

app.all("*", async (c) => {
  const path = c.req.path;
  const gated = findGatedRoute(path);

  if (!gated) {
    return c.env.ASSETS.fetch(c.req.raw);
  }

  const facilitatorUrl = (c.env.FACILITATOR_URL ??
    "https://x402.org/facilitator") as `${string}://${string}`;
  const facilitator = { url: facilitatorUrl };

  const routePath = normalizePath(path);
  const payMw = paymentMiddleware(
    c.env.PAY_TO as `0x${string}`,
    paymentRoutes(routePath, gated, c.env.NETWORK),
    facilitator
  );

  const result = await payMw(c, async () => {
    /* payment verified — serve static asset below */
  });

  if (result) return result;
  if (c.res && c.res.status >= 400) return c.res;

  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;