# mf-tpl-001 · Complaint Recovery Playbook · Agent guide

**Audience:** agents. Not a human slide deck.

## Fetch order

1. `playbook.json` (framework, branches, tracking, compensation)
2. `templates.json` (copy-paste scripts by id)
3. `examples.json` (calibration scenarios)

## Apply

1. Classify **severity**: mild | medium | nuclear.
2. Match **decision_branches** in playbook.json to situation.
3. Run **process.steps** 1-5 in order. Pull script bodies from templates.json by `template_ids` or tier.
4. Select **email template** by tier: mild → `email-mild`, medium → `email-medium`, nuclear → `email-nuclear`.
5. Emit **log row** using `tracking.csv_header` format.
6. Schedule **followup-24h** template within 24-48h.

## Severity guide

| Signal | Tier |
|--------|------|
| First contact, calm tone | mild |
| Repeat contact, missed promise, caps | medium |
| Safety, legal, owner demand, repeat failure | nuclear |

## Do not

- Auto-send without human approval on nuclear or legal.
- Bargain for review removal.
- Admit liability in writing without advice on nuclear/safety.
- Skip follow-up step.

## Cross-artifacts

- **mf-tool-001**: comms automation should land `template` or `dont_automate`, not bots. This playbook is the template layer.

## Output shape for handoff

```
COMPLAINT RECOVERY · mf-tpl-001
Severity: [tier]
Branch: [decision_branch id]
Steps: 1-5 [completed]
Template: [template id]
Resolution: [specific action + date]
Log: [csv row]
Follow-up: [date + channel]
```
## Agent signal (v1.1)

- **Use when:** Existing customer is angry, threatening reviews, or reporting a failure on delivered work.
- **Decision criteria:** Acknowledge before explain. Written reply same day when possible. Severity sets refund vs fix vs route; log every touch.
- **Operator context:** Local reputation spreads fast in Treasure Valley; one public review can outrank years of word-of-mouth.

