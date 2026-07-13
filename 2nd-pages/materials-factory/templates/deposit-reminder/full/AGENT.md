# mf-tpl-016 · Deposit Reminder

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-006, mf-tpl-014, mf-tpl-010, mf-tpl-008.
## Agent signal (v1.2)

- **Use when:** Deposit missing after accept
- **Not for:** Spine chain step only when mf-tpl-010 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-006, mf-tpl-014, mf-tpl-010, mf-tpl-008
- **Trigger phrases:** "Deposit missing after accept"; "Need playbook: Deposit Reminder"
- **Decision criteria:** Hold slot with calendar, release if unpaid Spine anchor: fetch with or after mf-tpl-010.

