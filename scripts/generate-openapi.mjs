#!/usr/bin/env node
/**
 * Build /openapi.json for x402scan / AgentCash discovery.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(
  ROOT,
  "2nd-pages/materials-factory/catalog-manifest.json"
);
const OUT_FILE = join(ROOT, "openapi.json");
const PAY_TO = "0x53799D42E72E3d41625006d310A55EC486DA5213";
const HOST = "https://nwb-vending.com";

function parseAmount(price) {
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n.toFixed(2) : "0.08";
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const basePath = (manifest.base_path || "/2nd-pages/materials-factory/").replace(
  /^\/?/,
  "/"
);

const paths = {};
for (const e of manifest.entries) {
  const routePath =
    `${basePath}${e.full.replace(/^\/?/, "")}${e.primary}`.replace(/\/+/g, "/");
  const summary = e.title || e.id;
  const description =
    e.description ||
    `Materials Factory ${e.section} pack ${e.id}. Paid JSON for agents.`;

  paths[routePath] = {
    get: {
      operationId: e.id,
      summary,
      description,
      tags: [e.section || "materials-factory"],
      "x-payment-info": {
        price: {
          mode: "fixed",
          currency: "USD",
          amount: parseAmount(e.price),
        },
        protocols: [{ x402: {} }],
      },
      parameters: [
        {
          name: "pack_id",
          in: "query",
          required: false,
          description:
            "Catalog pack id (informational). Primary artifact is returned from the path after x402 payment.",
          schema: {
            type: "string",
            enum: [e.id],
            default: e.id,
          },
          example: e.id,
        },
      ],
      responses: {
        "200": {
          description: "Paid agent pack JSON",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  artifact: { type: "string" },
                  title: { type: "string" },
                  version: { type: "string" },
                  audience: { type: "string", enum: ["agent"] },
                },
                required: ["artifact", "title", "audience"],
                additionalProperties: true,
              },
            },
          },
        },
        "402": { description: "Payment Required" },
      },
    },
  };
}

const spec = {
  openapi: "3.1.0",
  info: {
    title: "NWB Vending Materials Factory",
    version: "1.3.0",
    description:
      "x402 agent inventory: training, tools, and template packs for small-business ops.",
    contact: {
      name: "NWB Vending",
      email: "NWBVending@gmail.com",
    },
    "x-guidance":
      "Discover packs via catalog-manifest.json. Each GET path returns a paid JSON artifact after x402 USDC payment on Base. Start with catalog-manifest.json (public) for routing; fetch primary JSON files listed here when use_when matches.",
  },
  servers: [{ url: HOST }],
  "x-discovery": {
    ownershipProofs: [PAY_TO],
  },
  paths,
};

writeFileSync(OUT_FILE, JSON.stringify(spec, null, 2) + "\n");
console.log(`Wrote ${OUT_FILE}`);
console.log(`  paths: ${Object.keys(paths).length}`);
console.log(`  payTo: ${PAY_TO}`);