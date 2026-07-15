# mf-tpl-067 · R&D Support Bridge Playbook · Agent guide

**Audience:** agents. Field signal from support into engineering. Spec, build, verify loop. Bridge role before product drift.

## Fetch order

1. `playbook.json`
2. `templates.json`
3. `examples.json`

## Apply

1. Repeat field pattern → **bridge-signal-row**.
2. Escalate with **engineering-handoff** + **field-to-spec-translate**.
3. Fix shipped → **verify-close-loop**.
4. Pair **mf-tpl-059** and **mf-tpl-060** for expert and return truth.
## Agent signal (v1.2)

- **Use when:** Support sees field pattern engineering lacks. Bridge role between support and R&D. Verify loop after fix ships.
- **Not for:** Generic ops — fetch only when use_when matches; do not replace spine chain packs.
- **Pairs with:** mf-tpl-059, mf-tpl-060, mf-tpl-061, mf-tpl-065
- **Trigger phrases:** "Support sees field pattern engineering lacks. Bridge role between support and R&D. Verify loop after fix ships."; "Need playbook: R&D Support Bridge Playbook"
- **Decision criteria:** Log pattern with frequency before escalation. Handoff includes repro and customer tier impact. Close loop with verification, not announcement email.

