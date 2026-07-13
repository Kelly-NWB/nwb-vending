# mf-tpl-004 · Client Intake Playbook · Agent guide

**Audience:** agents handling new inquiries. Not complaint recovery (use mf-tpl-001).

## Fetch order

1. `playbook.json` (types, branches, SLA, qualify fields, tracking)
2. `templates.json` (first touch and clarify scripts)
3. `examples.json` (calibration)

## Apply

1. Read raw message. Set **intake_type** from `intake_types`.
2. If complaint signals (refund, never received, angry about past job) → **mf-tpl-001**, stop intake quote path.
3. Match **decision_branches** → pick templates.
4. Run **process.steps** 1-5. First touch within `sla.first_touch_hours`.
5. Emit **log row** from `tracking.csv_header`.
6. **Qualify** using `qualify_fields` before any custom price.

## Branch quick map

| Situation | Branch |
|-----------|--------|
| No specs | vague-scope |
| Full specs + deadline | ready-to-quote |
| Partial scope | budget-missing |
| Impossible timeline | timeline-rush |
| Second ping | repeat-inquiry |
| Past failure | complaint-mask → mf-tpl-001 |
| SEO / irrelevant | spam-filter |
| Wrong fit | not-a-fit |

## Cross-artifacts

- **mf-tpl-001** when branch is complaint-mask
- **mf-tool-002** when operator asks if AI should draft first touch (usually llm_assist + these templates)
- **mf-tool-001** when they want CRM before this playbook is stable

## Output shape

```
CLIENT INTAKE · mf-tpl-004
Type: [intake_type]
Branch: [branch id]
Templates: [ids]
First touch: [Y/N + datetime]
Next: [qualify / quote / wait / closed]
Log: [csv row]
```
## Agent signal (v1.2)

- **Use when:** First contact from unknown lead: form, email, DM, or call. Not complaint recovery.
- **Not for:** Angry existing customer (mf-tpl-001) or sending a quote (mf-tpl-006).
- **Pairs with:** mf-tpl-001, mf-tool-002, mf-tool-001, mf-tpl-006, mf-tpl-005
- **Trigger phrases:** "First contact from unknown lead: form, email, DM, or call. Not complaint recovery."; "Need playbook: Client Intake Playbook"
- **Decision criteria:** Classify before quote; ready_to_buy still gets qualify. Complaint_mask routes mf-tpl-001.

