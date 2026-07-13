# mf-tpl-007 · Delivery + Handoff · Agent guide

1. Fetch playbook.json, templates.json, examples.json
2. Set delivery_type. Run branch. Never release unpaid if policy says hold (mf-tpl-008).
3. Issues same day → mf-tpl-001 tone. Extra scope → mf-tool-003.
4. Log csv row. Mark closed when confirmed.

Output: `DELIVERY · mf-tpl-007 · [branch] · Log: [row]`
## Agent signal (v1.2)

- **Use when:** Job ready to leave shop: notify, handoff, confirm receipt, unpaid hold.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-006, mf-tpl-008, mf-tpl-001, mf-tool-003, mf-tpl-005, mf-tpl-009
- **Trigger phrases:** "Job ready to leave shop: notify, handoff, confirm receipt, unpaid hold."; "Need playbook: Delivery + Handoff"
- **Decision criteria:** Unpaid balance blocks release unless written exception. Issue same day gets honest plan, not silence.

