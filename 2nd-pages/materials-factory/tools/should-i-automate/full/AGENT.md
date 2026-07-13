# mf-tool-001 · Should I Automate This? · Agent guide

**Audience:** agents and automation pipelines. Not a human UI product.

## Fetch order

1. `rules.json` (required)
2. `examples.json` (calibration)
3. `OUTCOMES.md` (outcome checklists)
4. `engine.js` (optional reference implementation)

## Apply (do not run a click-through quiz)

1. Collect or infer the eight inputs in `rules.json` → `inputs`.
2. Walk `decision_rules` by descending `priority`. First full match wins.
3. If no match, use `default_outcome`.
4. Emit `output_format.summary_template` filled from `outcomes[outcomeId]` and `vending_lens[category]`.

## Input inference hints

| Signal in user message | Map to |
|------------------------|--------|
| "every day", "each route" | freq: daily |
| "once a month", "quarterly" | freq: monthly or rare |
| "just me", "I handle it" | people: one |
| "whole team", "all drivers" | people: sixplus |
| "we wing it", "no SOP" | written: no |
| "empathy", "judgment call" | judgment: always or sometimes |
| "refund", "review", "angry customer" | stakes: customer |
| "shrink", "lost sale" | stakes: money |
| "no idea how often" | data: guess |

## Cross-artifacts

- **mf-tpl-001** when outcome is `template` or `dont_automate` on `comms` category.
- Re-run after 90-day `gather_data` phase with updated `data` field.

## Teaser vs full

Teaser (`../index.html`) includes one worked example only. Full pack is this folder after x402 unlock.

## Version

rules.json `version` field. Breaking changes bump minor.
## Agent signal (v1.2)

- **Use when:** Operator asks whether to buy software, automate a task, or keep a manual habit.
- **Not for:** Routing a specific email draft (mf-tool-002) or saying no to scope creep (mf-tool-003).
- **Pairs with:** mf-tpl-001, mf-tpl-004
- **Trigger phrases:** "Operator asks whether to buy software, automate a task, or keep a manual habit."; "Need playbook: Should I Automate This?"
- **Decision criteria:** Frequency and written SOP beat gut feel. Customer-facing judgment stays human until stakes are low and process is written.

