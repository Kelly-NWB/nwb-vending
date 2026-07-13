# mf-tpl-026 · QC Fail / Rework (Internal)

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-017, mf-tpl-011, mf-tpl-013, mf-tpl-007.
## Agent signal (v1.2)

- **Use when:** Internal QC fail before ship
- **Not for:** Spine chain step only when mf-tpl-017 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-017, mf-tpl-011, mf-tpl-013, mf-tpl-007
- **Trigger phrases:** "Internal QC fail before ship"; "Need playbook: QC Fail / Rework (Internal)"
- **Decision criteria:** Re-QC before mf-tpl-007 Spine anchor: fetch with or after mf-tpl-017.

