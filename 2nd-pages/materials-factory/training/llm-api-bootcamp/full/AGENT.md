# mf-train-001 · LLM API Bootcamp · Agent guide

**Audience:** agents and developer automation. Not a human click-through UI.

## Fetch order

1. `playbook.json` (curriculum map, products, pricing rules, completion criteria)
2. `modules.json` (6 modules, 25 cards, plain-text lesson bodies)
3. `templates.json` (PowerShell first call, one-pager, checklists, cost estimator schema)
4. `examples.json` (worked picks: first call, Discord, TTS, voice warning)

## Apply (teach or wire, do not render a wizard)

1. Read `playbook.json` → `one_sentence` and `browser_vs_api` before module detail.
2. Walk `modules_order` in `playbook.json`. For each module id, load cards from `modules.json`.
3. After Module 3, offer `templates.powershell-first-call` for hands-on proof.
4. Use `examples.json` when the user names a project (bot, narration, images, phone agent).
5. Close with `completion_criteria` from playbook and `templates.one-pager` summary.

## Product picker (quick)

| Job | Product |
|-----|---------|
| Text bot / Discord | Grok 4.3 Chat API |
| IDE / code agent | Grok Build 0.1 |
| Narration / voice clone playback | Voice TTS |
| Live phone conversation | Voice Agents realtime |
| Images / video | Imagine API |

## Security

- API key = billing password. Never commit or paste in public channels.
- Learning on local PowerShell is fine. Production uses env vars on the host.

## Cross-artifacts

- **mf-tool-001** when learner asks "should I automate this API project?"
- **mf-tpl-001** when bot handles customer complaints

## Teaser vs full

Teaser (`../index.html`) has Module 1 opener only. Full pack is this folder after x402 unlock.

## Version

`playbook.json` `version` field. v2.0.0 = agent-pack JSON (replaces interactive HTML app).
## Agent signal (v1.2)

- **Use when:** Agent or operator needs LLM API integration patterns for small-business tools.
- **Not for:** Job spine comms packs or rubrics — use templates/tools after bootcamp if needed.
- **Pairs with:** mf-tool-002, mf-tool-001
- **Trigger phrases:** "How do I call an LLM API?"; "Need LLM API bootcamp pack"
- **Decision criteria:** Use for API wiring and prompts — not for customer comms templates.

