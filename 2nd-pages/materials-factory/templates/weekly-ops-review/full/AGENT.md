# mf-tpl-005 · Weekly 15-Min Ops Review · Agent guide

**Audience:** agents coaching small-business owners through a weekly ritual.

## Fetch order

1. `playbook.json` (blocks, timer, variants, log fields)
2. `templates.json` (checklist bodies by block)
3. `examples.json` (10 worked weeks)

## Apply

1. Pick **variant**: solo | small_team | bad_week.
2. Emit templates in block order (skip people if solo).
3. Enforce **15 min hard stop**. Overflow → `next-week-capture`.
4. For each block, fill scan items from context; name one action max.
5. Cross-route: complaint → mf-tpl-001, creep → mf-tool-003, intake SLA → mf-tpl-004.
6. Write **log row** from `tracking.csv_header`.

## Block order (small_team)

inbox_leads (3) → money (3) → jobs (4) → people (3) → close (2) = 15

## Solo

Use `solo-short` template. Jobs 5 min, close 4 min. No people block.

## Bad week

Use `bad-week-short` only. Resume full ritual when stable.

## Output shape

```
WEEKLY OPS REVIEW · mf-tpl-005
Week: [week_of]
Variant: [variant]
Blocks completed: [ids]
Log: [csv row]
One fix: [sentence]
Cross-artifacts used: [ids if any]
```

## Not a substitute for

Daily production management, month-end books, or HRIS.