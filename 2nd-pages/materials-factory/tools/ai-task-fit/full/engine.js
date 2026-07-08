/**
 * mf-tool-002 decision engine
 * Source of truth for rule order: rules.json decision_rules
 */

export function evaluate(inputs, rulesDoc) {
  const rules = rulesDoc.decision_rules.slice().sort((a, b) => b.priority - a.priority);
  for (const rule of rules) {
    if (matches(rule.when, inputs)) return rule.outcome;
  }
  return rulesDoc.default_outcome || 'llm_assist';
}

function matches(when, inputs) {
  return Object.entries(when).every(([k, v]) => inputs[k] === v);
}

export function formatSummary(inputs, rulesDoc) {
  const outcomeId = evaluate(inputs, rulesDoc);
  const o = rulesDoc.outcomes[outcomeId];
  const lens = rulesDoc.operator_lens[inputs.stakes] || '';
  const lines = [
    'AI TASK FIT · mf-tool-002',
    '=======================',
    `Task: ${inputs.task || '(not specified)'}`,
    `Repeatability: ${inputs.repeatability}`,
    `Judgment: ${inputs.judgment}`,
    `Stakes: ${inputs.stakes}`,
    `Input shape: ${inputs.input_shape}`,
    `Output needed: ${inputs.output_type}`,
    `Volume: ${inputs.volume}`,
    `Data known: ${inputs.data_known}`,
    '',
    `OUTCOME: ${o.label.toUpperCase()}`,
    o.title,
    '',
    o.summary,
    '',
    'Next steps:',
    ...o.next_steps.map((s, i) => `  ${i + 1}. ${s}`),
    '',
    `Do not: ${o.do_not}`,
    lens ? `Operator lens: ${lens}` : ''
  ];
  return { outcomeId, outcome: o, summary: lines.filter(Boolean).join('\n') };
}

if (typeof window !== 'undefined') {
  window.MfAiTaskFitEngine = { evaluate, formatSummary };
}