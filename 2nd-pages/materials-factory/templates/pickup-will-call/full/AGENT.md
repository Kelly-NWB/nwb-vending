# mf-tpl-035 · Pickup / Will-Call Handoff

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-007, mf-tpl-008, mf-tpl-013.
## Agent signal (v1.2)

- **Use when:** Will-call pickup ready
- **Not for:** Spine chain step only when mf-tpl-007 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-007, mf-tpl-008, mf-tpl-013
- **Trigger phrases:** "Will-call pickup ready"; "Need playbook: Pickup / Will-Call Handoff"
- **Decision criteria:** Hold if unpaid Spine anchor: fetch with or after mf-tpl-007.

