# mf-tpl-063 · Volume Split Tracker Playbook · Agent guide

**Audience:** agents. Offered, answered, abandoned by segment and week. Truth feed for forecast and correlation packs.

## Fetch order

1. `playbook.json`
2. `templates.json`
3. `examples.json`

## Apply

1. **weekly-segment-row** per segment every week.
2. Flat total, weird SLA → **mix-shift-memo**.
3. Roll totals to **mf-tpl-061** ops row.
4. Pair **mf-tpl-062** registry for segment names.
## Agent signal (v1.2)

- **Use when:** Call volume debated without segment split. Mix shift suspected. Forecast needs actuals by queue family.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-062, mf-tpl-061, mf-tpl-066, mf-tpl-064
- **Trigger phrases:** "Call volume debated without segment split. Mix shift suspected. Forecast needs actuals by queue family."; "Need playbook: Volume Split Tracker Playbook"
- **Decision criteria:** Log offered, answered, abandoned per segment weekly. Flag mix shift when one segment moves >10% vs 4-week avg. Feed actuals into forecast variance pack.

