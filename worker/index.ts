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

const GATED_PREFIX =
  "/2nd-pages/materials-factory/training/llm-api-bootcamp/full";

const GATED_PRICE = "$0.40";
const GATED_DESCRIPTION =
  "LLM API Bootcamp — full 6-module interactive training (mf-train-001)";

function normalizePath(path: string): string {
  if (path.length > 1) return path.replace(/\/+$/, "");
  return path;
}

function isGatedPath(path: string): boolean {
  const p = normalizePath(path);
  return p === GATED_PREFIX || p.startsWith(GATED_PREFIX + "/");
}

function paymentRoutes(path: string, network: Env["NETWORK"]): RoutesConfig {
  const normalized = normalizePath(path);
  const routes: RoutesConfig = {};

  for (const key of [normalized, normalized + "/", path]) {
    routes[key] = {
      price: GATED_PRICE,
      network,
      config: { description: GATED_DESCRIPTION },
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
    gated_prefix: GATED_PREFIX,
    price: GATED_PRICE,
    pay_to_suffix: c.env.PAY_TO?.slice(-6) ?? null,
  })
);

app.all("*", async (c) => {
  const path = c.req.path;

  if (!isGatedPath(path)) {
    return c.env.ASSETS.fetch(c.req.raw);
  }

  const facilitatorUrl = (c.env.FACILITATOR_URL ??
    "https://x402.org/facilitator") as `${string}://${string}`;
  const facilitator = { url: facilitatorUrl };

  const routePath = normalizePath(path);
  const payMw = paymentMiddleware(
    c.env.PAY_TO as `0x${string}`,
    paymentRoutes(routePath, c.env.NETWORK),
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