# mf-tpl-033 · Multi-Job Priority Queue (Internal)

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-005, mf-tpl-017, mf-tpl-021.
## Agent signal (v1.2)

- **Use when:** Reprioritize queue internal
- **Not for:** Spine chain step only when mf-tpl-005 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-005, mf-tpl-017, mf-tpl-021
- **Trigger phrases:** "Reprioritize queue internal"; "Need playbook: Multi-Job Priority Queue (Internal)"
- **Decision criteria:** Honest capacity date to client via mf-tpl-013 Spine anchor: fetch with or after mf-tpl-005.

