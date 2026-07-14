# PUSH28 — agent only (Kelly never reads this)

Kelly says **push28** / **go live** = permission to `git push origin main`.

## After every push28, agent MUST:

1. `git push origin main`
2. Wait ~60s
3. `node scripts/verify-both-urls.mjs /2nd-pages/materials-factory/ mf-tpl-055` (or snippet from the edit)
4. `node scripts/verify-x402-v2-live.mjs` — must end with `LIGHTS_OUT: PASS` (x402scan v2 gate)
5. `node scripts/check-github-actions.mjs` — if FAIL, tell Kelly immediately (do not say "it's live")
5. If verify FAILS → Cloudflare dashboard deploy or `npx.cmd wrangler login` + `npx.cmd wrangler deploy`

**Never tell Kelly "it's live" after push alone.** Two URLs:

| URL | Pipe |
|-----|------|
| kelly-nwb.github.io/nwb-vending | GitHub Pages — auto on push |
| NWB-Vending.com | Cloudflare Workers — dashboard Git integration or wrangler |

## What broke (July 2026)

`Deploy NWB-Vending.com` GitHub Action ran on every push since June 15 with **no Cloudflare secrets** → 12 failure emails per push. Site still updated via Cloudflare's repo connection. Action removed to stop spam.

## If .com goes stale again

Cloudflare dashboard → Workers → nwb-vending → Deployments, or one-time `wrangler login` + `wrangler deploy` on this machine.