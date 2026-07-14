# mf-tpl-066 · Call Forecast Variance Playbook · Agent guide

**Audience:** agents. Assumptions to forecast to actual variance to staffing schedule by queue. Capacity skeleton, not 31-tab chaos.

## Fetch order

1. `playbook.json`
2. `templates.json`
3. `examples.json`

## Apply

1. **assumption-registry** before numbers.
2. Weekly **variance-memo** per queue.
3. Sustained miss → **staffing-schedule-patch**.
4. Pair **mf-tpl-062** queue names and **mf-tpl-063** actuals.
## Agent signal (v1.2)

- **Use when:** Call forecast exists but actuals diverge. Overtime or ASA miss tied to one queue. Assumptions not documented.
- **Not for:** Generic ops :  fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-062, mf-tpl-063, mf-tpl-065, mf-tpl-064
- **Trigger phrases:** "Call forecast exists but actuals diverge. Overtime or ASA miss tied to one queue. Assumptions not documented."; "Need playbook: Call Forecast Variance Playbook"
- **Decision criteria:** Write assumptions before forecast numbers. Weekly variance by queue, not company total only. Patch staffing schedule when variance sustains 4+ weeks.

