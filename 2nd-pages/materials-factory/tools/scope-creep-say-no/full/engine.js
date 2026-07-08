/**
 * mf-tool-003 decision engine
 */

export function evaluate(inputs, rulesDoc) {
  const rules = rulesDoc.decision_rules.slice().sort((a, b) => b.priority - a.priority);
  for (const rule of rules) {
    if (matches(rule.when, inputs)) return rule.outcome;
  }
  return rulesDoc.default_outcome || 'defer_phase_two';
}

function matches(when, inputs) {
  return Object.entries(when).every(([k, v]) => inputs[k] === v);
}

export function formatSummary(inputs, rulesDoc) {
  const outcomeId = evaluate(inputs, rulesDoc);
  const o = rulesDoc.outcomes[outcomeId];
  const script = o.script_id ? rulesDoc.scripts[o.script_id] : '';
  const lens = rulesDoc.operator_lens[inputs.relationship] || '';
  const lines = [
    'SCOPE CREEP / SAY-NO · mf-tool-003',
    '==============================',
    `Request: ${inputs.request || '(not specified)'}`,
    `Relationship: ${inputs.relationship}`,
    `Contract: ${inputs.contract_state}`,
    `Change size: ${inputs.change_size}`,
    `Asked by: ${inputs.who_asked}`,
    `Deadline pressure: ${inputs.deadline_pressure}`,
    `Margin: ${inputs.margin_already}`,
    `Written scope: ${inputs.written_scope}`,
    '',
    `OUTCOME: ${o.label.toUpperCase()}`,
    o.title,
    '',
    o.summary,
    '',
    script ? `Script:\n${script}` : '',
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
  window.MfScopeCreepEngine = { evaluate, formatSummary };
}