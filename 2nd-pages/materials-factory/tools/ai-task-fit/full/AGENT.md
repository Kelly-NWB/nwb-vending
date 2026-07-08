# mf-tool-002 · AI Task Fit · Agent guide

**Audience:** agents routing small-business work to human, template, LLM assist, API, or multi-step workflow.

## Fetch order

1. `rules.json` (required: inputs, outcomes, decision_rules, decision_tree)
2. `examples.json` (calibration)
3. `OUTCOMES.md` (outcome checklists)
4. `engine.js` (optional reference)

## Apply (not a click-through quiz)

1. Collect or infer all eight enums in `rules.json` → `inputs` (+ optional `task` string).
2. Walk `decision_rules` by descending `priority`. First full match wins.
3. If no match, use `default_outcome` (`llm_assist`).
4. Emit `output_format.summary_template` with outcome fields and `operator_lens[stakes]`.

## When to use this vs mf-tool-001

| Question | Tool |
|----------|------|
| Should AI touch this task? | **mf-tool-002** (this pack) |
| Should I buy/build software or automate infra? | **mf-tool-001** |

Chain: `not_ai` or `template_first` here may send operator to mf-tool-001 next.

## Input inference hints

| Signal | Map to |
|--------|--------|
| "every time we talk to them" | judgment: every_time |
| "I'll read before it goes out" | judgment: review |
| "same columns every night" | input_shape: structured, repeatability: daily |
| "ranty email thread" | input_shape: messy |
| "form fields we already have" | input_shape: semi |
| "refund / quote / fire someone" | stakes: money or legal |
| "angry customer / applicant" | stakes: customer |
| "don't know how many per month" | data_known: no |
| "brainstorm / post ideas" | output_type: creative |
| "pick a price" | output_type: decision |

## Cross-artifacts

- **mf-tpl-001** after `llm_assist` or `template_first` on customer comms
- **mf-train-001** before building `llm_api` pipelines
- **mf-tool-001** when outcome is `not_ai` or operator wants SaaS/custom build

## Teaser vs full

Teaser (`../index.html`) = one worked example. Full pack = this folder after x402 unlock.