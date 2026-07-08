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