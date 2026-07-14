# mf-tpl-062 · Queue Split Design Playbook · Agent guide

**Audience:** agents. Split/skill map: priority, ASA goal, hours, after-hours. The routing backbone before volume or forecast work.

## Fetch order

1. `playbook.json`
2. `templates.json`
3. `examples.json`

## Apply

1. **split-registry-row** for every live split.
2. SLA miss from tier mix → **priority-rebalance-memo**.
3. New product line → **new-split-checklist** before launch.
4. Pair **mf-tpl-063** for volume by split.
## Agent signal (v1.2)

- **Use when:** Call routing is tribal knowledge. Mixed tiers in one queue. ASA goals undocumented or wrong.
- **Not for:** Generic ops :  fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-063, mf-tpl-066, mf-tpl-061, mf-tpl-005
- **Trigger phrases:** "Call routing is tribal knowledge. Mixed tiers in one queue. ASA goals undocumented or wrong."; "Need playbook: Queue Split Design Playbook"
- **Decision criteria:** One registry row per split before forecast work. Priority and ASA goal on every row. After-hours behavior explicit, not implied.

