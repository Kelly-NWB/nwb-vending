# mf-tpl-006 · Quote / Estimate Gate · Agent guide

**Audience:** agents sending price after mf-tpl-004 qualify. Not complaint recovery.

## Fetch order

1. `playbook.json` (gate checklist, branches, quote fields, tracking)
2. `templates.json` (quote bodies by branch)
3. `examples.json` (8 calibration scenarios)

## Apply

1. Confirm upstream: mf-tpl-004 qualify complete or ready-to-quote.
2. Run **gate_checklist**. Any fail → matching branch (usually hold, no number).
3. If complaint signals → **mf-tpl-001**, stop.
4. Pick **quote_type** and **decision_branch**.
5. Compose from templates. Always state assumptions, valid_until, deposit.
6. If scope changed after prior quote → void old, requote-scope-changed.
7. Emit **log row** from `tracking.csv_header`.

## Branch quick map

| Situation | Branch |
|-----------|--------|
| Checklist all pass | gate-pass-send |
| Missing specs/qty | hold-specs |
| Package fit | tier-not-custom |
| Tight deadline + fee | rush-surcharge |
| Bad margin / fit | decline-polite |
| Same as last job | repeat-shortcut |
| Scope drift | scope-changed |
| Anger on thread | complaint-route → mf-tpl-001 |

## Cross-artifacts

- **mf-tpl-004** upstream qualify
- **mf-tool-003** after acceptance scope creep
- **mf-tpl-005** weekly: quotes sent, no reply
- **mf-tool-001** before quoting SaaS buy

## Output shape

```
QUOTE GATE · mf-tpl-006
Type: [quote_type]
Branch: [branch id]
Gate: [pass/fail ids]
Templates: [ids]
Amount: [if sent]
Log: [csv row]
```
## Agent signal (v1.1)

- **Use when:** Scope is clear enough to price: custom quote or estimate gate before send.
- **Decision criteria:** No blind pricing on fab/install without qty and deliverable. Deposit terms stated on same send as quote.
- **Operator context:** Treasure Valley GCs often need COI and permit notes on quote; flag install add-ons early.

