# mf-tpl-008 · Invoice + Payment Chase · Agent guide

1. Fetch playbook.json, templates.json, examples.json
2. Match invoice_state → branch. Chase on calendar (3/7/14), not mood.
3. Disputes → clarify with quote ref. Paid → close + release mf-tpl-007 holds.
4. Log every touch.

Output: `INVOICE · mf-tpl-008 · [state] · [branch] · Log: [row]`
## Agent signal (v1.2)

- **Use when:** Invoice sent: chase calendar day 3, 7, 14 and partial payment states.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-006, mf-tpl-007, mf-tpl-005, mf-tpl-001, mf-tpl-015
- **Trigger phrases:** "Invoice sent: chase calendar day 3, 7, 14 and partial payment states."; "Need playbook: Invoice + Payment Chase"
- **Decision criteria:** Tone escalates on calendar, not mood. Net terms accounts use mf-tpl-046 branch before harsh chase.

