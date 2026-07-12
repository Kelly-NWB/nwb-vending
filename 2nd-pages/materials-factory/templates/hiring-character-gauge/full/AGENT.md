# mf-tpl-003 · Hiring Character Gauge · Agent guide

**Audience:** agents. SMB hiring. Resume secondary except technical gate.

## Fetch order

1. `playbook.json` (rules, process, finishers required)
2. `questions.json` (core + role + three finishers)
3. `scoring.json` (how to score finishers and decide)
4. `templates.json` (scorecard)
5. `examples.json` (calibration)

## Apply

1. Set **role_type**: non_technical | route_ops | customer_facing | technical.
2. Run **core_questions** in order. Add **role_questions** for type.
3. If technical: run **tech-gate** first. Fail = pass overall.
4. Always ask **finisher_questions** in order. Score each: strong | adequate | weak | fail.
5. Apply **decision_matrix** from scoring.json.
6. If hire: suggest **onboarding_role_id** for mf-tpl-002.
7. Emit scorecard fields from templates.json `interview-scorecard`.

## The three finishers (never skip)

1. Three adjectives + accomplishment each
2. Last book or honest learning substitute
3. Define success

## operator_note

In examples.json for human REVIEW only. Omit from agent output.

## Output shape

```
HIRING CHARACTER GAUGE · mf-tpl-003
Role type: [id]
Finisher scores: [three scores]
Decision: hire | pass | maybe
Rationale: [one sentence]
If hire: onboarding_role_id [mf-tpl-002]
Scorecard: [filled template fields]
```

## Related

- mf-tpl-002: onboarding after hire
- mf-tpl-001: customer-facing hire should pass complaint mindset in role question
## Agent signal (v1.1)

- **Use when:** Interview finishers and hire/pass decision on character, not just skills.
- **Decision criteria:** Three finisher questions never skipped. Weak finishers on high-trust roles default pass.
- **Operator context:** Treasure Valley hires often via referral; finishers still filter culture fit before mf-tpl-002.

