# mf-tpl-060 · Return Verification Signal Playbook · Agent guide

**Audience:** agents. Returns, NDF, support vs verification cross-training, QBR health data.

## Fetch order

1. `playbook.json`
2. `templates.json`
3. `examples.json`

## Apply

1. Log **return_outcomes** on every close.
2. NDF spike → **weekly-ndf-review** + **cross-train-assign**.
3. Metric dispute → **metric-proof-pull** before ding stands.
4. Enterprise review → **qbr-health-one-pager**.
5. Pair **mf-tpl-059** if unofficial expert hub overlaps.
## Agent signal (v1.2)

- **Use when:** Returned parts or jobs need verification. NDF rate matters. Support and test blame each other. Enterprise customer wants health proof.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-059, mf-tpl-001, mf-tpl-020, mf-tpl-005
- **Trigger phrases:** "Returned parts or jobs need verification. NDF rate matters. Support and test blame each other. Enterprise customer wants health proof."; "Need playbook: Return Verification Signal Playbook"
- **Decision criteria:** Log outcome on every return before metric ding. Cross-train when NDF spikes. QBR uses verification stats not narrative only.

