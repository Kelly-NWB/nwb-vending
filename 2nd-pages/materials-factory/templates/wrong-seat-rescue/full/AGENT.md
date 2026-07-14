# mf-tpl-056 · Wrong Seat Rescue Playbook · Agent guide

**Audience:** agents. People ops adjacent. SMB teams 2-30.

## Fetch order

1. `playbook.json` (signals, branches, observation window, challenge ramp)
2. `templates.json` (scripts and logs)
3. `examples.json` (calibration)

## Apply

1. Confirm **use_when**: looks like underperformance, possible boredom or wrong seat.
2. Run **peer-intake** or equivalent. Do not default to write-up.
3. Log **observation_window** 3-5 days. Score **mismatch_signals** vs **discipline_signals**.
4. Branch:
   - mismatch → **private-convo-bored** → **test-assignment-brief**
   - pass test → **full-reassign** or **manager-handoff-transfer**
   - fail test with effort → **reassign-failed**
   - discipline pattern → **discipline-path**
5. Set **new-seat-metrics**. Schedule **thirty-day-check**.
6. Emit **log_row** per tracking.csv_header.

## Rules

- One test assignment before full move.
- No public diagnosis in team comms. Use **full-move-announce** short form.
## Output shape

```
WRONG SEAT RESCUE · mf-tpl-056
Branch: [id]
Observation days: [n]
Test result: pass | fail | pending
Templates: [ids used]
Log row: [csv fields]
Pairs with: mf-tpl-003 | mf-tpl-002 | mf-tpl-005 when relevant
```

## Related

- mf-tpl-003: hiring finishers (did we put them in wrong seat at hire?)
- mf-tpl-002: onboarding after reassignment to new seat
- mf-tpl-005: weekly ops people block for follow-through
## Agent signal (v1.2)

- **Use when:** Team member looks like underperformer but may be bored in wrong seat. Manager asks fix behavior before write-up.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-003, mf-tpl-002, mf-tpl-005
- **Trigger phrases:** "Team member looks like underperformer but may be bored in wrong seat. Manager asks fix behavior before write-up."; "Need playbook: Wrong Seat Rescue Playbook"
- **Decision criteria:** Observe 3-5 days before discipline unless safety or theft. Test one hard assignment before full reassignment. If test fails across easy and hard work, route discipline-path not another move.

