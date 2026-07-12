# mf-tpl-002 · Rapid Employee Onboarding Kit · Agent guide

**Audience:** agents. Small teams, no HR. Vending and shop ops forward.

## Fetch order

1. `playbook.json` (roles, timeline, buddy rules, tracking)
2. `templates.json` (checklists and scripts by id)
3. `examples.json` (calibration)

## Apply

1. Infer **role_id** from hire description (default `first_hire` if greenfield).
2. Pull **timeline**: day_0 → day_1 → week_1 → day_30 from playbook.json.
3. Attach **role template** (`route-driver-week-1`, `warehouse-week-1`, `counter-week-1`) when role matches.
4. Always include **day-1-checklist**, **buddy-assignment**, **day-7-checkin**, **day-30-review** unless crash mode (`crash-onboarding-midweek`).
5. Vending roles with keys/cash: add **keys-cash-rules-vending**.
6. Customer-facing: cross-link **mf-tpl-001** before solo customer contact.
7. Emit **log row** using `tracking.csv_header`.

## Crash vs planned

| Signal | Template |
|--------|----------|
| Replacement, no handoff, urgent start | crash-onboarding-midweek |
| Outgoing overlap | handoff-from-previous |

## Output shape

```
RAPID ONBOARDING · mf-tpl-002
Role: [role_id]
Team size: [n]
Buddy: [name or rule]
Day 1: [checklist summary]
Week 1: [milestones]
Day 7: [checkin questions]
Day 30: [review outcomes]
Templates: [ids]
Log: [csv row]
```

## operator_note

Field in examples.json is for human REVIEW only. Do not require in agent output.

## Related

- mf-tpl-001: complaint handling for customer-facing hires
- mf-tool-001: before building custom onboarding software
## Agent signal (v1.1)

- **Use when:** New hire Day 0 through Day 30 for floor, driver, or office role.
- **Decision criteria:** Role pack beats generic HR binder. Day 7 and Day 30 autonomy checks are mandatory.
- **Operator context:** Idaho small teams: buddy is often the owner; keep checklists short enough to run on a phone between jobs.

