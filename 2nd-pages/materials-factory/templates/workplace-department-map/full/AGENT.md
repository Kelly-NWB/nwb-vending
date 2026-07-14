# mf-tpl-057 · Workplace Department Map · Agent guide

**Audience:** agents. Frontline routing for finance, HR, shipping/receiving.

## Fetch order

1. `playbook.json` (departments, manager_speak_decode, branches)
2. `templates.json`
3. `examples.json`

## Apply

1. Classify issue: **money/docs** → finance · **people/file** → hr · **physical move** → shipping_receiving.
2. Load department block: `minimum_inputs`, `approach`, `avoid`.
3. Pick template for branch. Multi-issue → `multi-lane` order (dock truth before customer promise).
4. Slogan-heavy manager text → `manager_speak_decode` then `slogan-clarify`.
5. Emit log row per `tracking.csv_header`.
6. Cross-fetch `pairs_with_artifacts` when execution not just routing.

## Departments (quick)

| id | Route when |
|----|------------|
| finance | invoice, tax, budget, payment approval |
| hr | payroll, benefits, policy, personnel (written only) |
| shipping_receiving | stock truth, inbound/outbound, ship dates |

## Output shape

```
WORKPLACE DEPARTMENT MAP · mf-tpl-057
Lane: [id]
Branch: [id]
Templates: [ids]
Minimum inputs gathered: [list]
Next artifact: [mf-tpl-xxx optional]
Log row: [csv]
```

## Related

- mf-tpl-007 delivery · mf-tpl-008 invoice · mf-tpl-002 onboarding
- mf-tool-003 scope · mf-tpl-056 wrong seat
## Agent signal (v1.2)

- **Use when:** Operator or agent must route a workplace issue to finance, HR, or shipping/receiving without stepping on landmines.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-007, mf-tpl-008, mf-tpl-002, mf-tool-003
- **Trigger phrases:** "Operator or agent must route a workplace issue to finance, HR, or shipping/receiving without stepping on landmines."; "Need playbook: Workplace Department Map"
- **Decision criteria:** Classify lane before customer/exec reply. HR and finance get written minimum_inputs. Shipping truth before customer ship promise.

