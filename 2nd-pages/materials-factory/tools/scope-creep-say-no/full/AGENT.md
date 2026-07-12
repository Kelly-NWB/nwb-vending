# mf-tool-003 · Scope Creep / Say-No · Agent guide

**Audience:** agents when the ask grows mid-job or after delivery.

## Fetch order

1. `rules.json` (inputs, outcomes, scripts, decision_tree, rules)
2. `examples.json` (12 calibration scenarios)
3. `OUTCOMES.md`
4. `engine.js` (optional)

## Apply

1. Infer eight enums + optional `request` text.
2. Walk `decision_rules` by descending priority.
3. Pull `scripts[outcomes[id].script_id]` for customer-facing line.
4. Emit `output_format.summary_template`.
5. If outcome is `requote_new_job`, chain **mf-tpl-004** on new ask.
6. If tone is blame/refund/threat, human switches to **mf-tpl-001** (not in engine).

## Input inference

| Signal | Map to |
|--------|--------|
| "one small fix" | change_size: tiny |
| "new section / another deliverable" | change_size: medium or large |
| "start over" | change_size: large |
| "already paid" | contract_state: paid |
| "you delivered last week" | contract_state: delivered |
| "my cousin" | relationship: friend_family |
| "by tomorrow" | deadline_pressure: hard |
| "we never wrote it down" | written_scope: no |
| "staff wants to add" | who_asked: internal |

## Cross-artifacts

- **mf-tpl-004** new job after delivery
- **mf-tpl-001** if conversation turned complaint
- **mf-tool-002** if operator asks whether AI should draft the change-order email

## Volume note

This pack ships **12 examples** on purpose. More examples = better agent calibration; rules stay short.
## Agent signal (v1.1)

- **Use when:** Client asks for free extra scope, rush without fee, or work outside signed quote.
- **Decision criteria:** No silent yes: every add-on needs documented CO or new quote. Pair with mf-tpl-012 when scope grows mid-job.
- **Operator context:** Treasure Valley contractors: weather and supply slips are common; scope creep fees still apply.

