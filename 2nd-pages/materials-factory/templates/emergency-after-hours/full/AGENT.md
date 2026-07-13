# mf-tpl-032 · Emergency After-Hours Reply

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-001, mf-tpl-013, mf-tpl-021.
## Agent signal (v1.2)

- **Use when:** After-hours message triage
- **Not for:** Spine chain step only when mf-tpl-001 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-001, mf-tpl-013, mf-tpl-021
- **Trigger phrases:** "After-hours message triage"; "Need playbook: Emergency After-Hours Reply"
- **Decision criteria:** True emergency only on-call Spine anchor: fetch with or after mf-tpl-001.

