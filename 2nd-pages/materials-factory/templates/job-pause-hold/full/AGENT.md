# mf-tpl-030 · Job Pause / Client Hold

Fetch playbook, templates, examples. Log csv row. Cross: mf-tpl-013, mf-tpl-012, mf-tpl-010.
## Agent signal (v1.2)

- **Use when:** Client or internal pause
- **Not for:** Spine chain step only when mf-tpl-013 context applies — not a substitute for chain order.
- **Pairs with:** mf-tpl-013, mf-tpl-012, mf-tpl-010
- **Trigger phrases:** "Client or internal pause"; "Need playbook: Job Pause / Client Hold"
- **Decision criteria:** Resume or cancel explicit Spine anchor: fetch with or after mf-tpl-013.

