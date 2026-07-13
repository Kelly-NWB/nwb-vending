# mf-tpl-055 · Tax Exempt Certificate Request

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-006, mf-tpl-008, mf-tpl-004.
## Agent signal (v1.2)

- **Use when:** Tax exempt cert on file
- **Not for:** Spine chain step only when mf-tpl-006 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-006, mf-tpl-008, mf-tpl-004
- **Trigger phrases:** "Tax exempt cert on file"; "Need playbook: Tax Exempt Certificate Request"
- **Decision criteria:** No cert, tax on invoice Spine anchor: fetch with or after mf-tpl-006.

