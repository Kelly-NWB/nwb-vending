/**
 * mf-tool-001 decision engine
 * Source of truth for rule order: rules.json decision_rules
 * Agents: import or fetch rules.json + this file; apply evaluate(inputs)
 */

export function evaluate(inputs, rulesDoc) {
  const rules = rulesDoc.decision_rules.slice().sort((a, b) => b.priority - a.priority);
  for (const rule of rules) {
    if (matches(rule.when, inputs)) return rule.outcome;
  }
  return rulesDoc.default_outcome || 'template';
}

function matches(when, inputs) {
  return Object.entries(when).every(([k, v]) => inputs[k] === v);
}

export function formatSummary(inputs, rulesDoc) {
  const outcomeId = evaluate(inputs, rulesDoc);
  const o = rulesDoc.outcomes[outcomeId];
  const cat = rulesDoc.categories.find(c => c.id === inputs.category);
  const lines = [
    'SHOULD I AUTOMATE THIS? · mf-tool-001',
    '================================',
    `Idea: ${inputs.idea || '(not specified)'}`,
    `Category: ${cat?.label || inputs.category}`,
    `Frequency: ${inputs.freq}`,
    `People/week: ${inputs.people}`,
    `Written process: ${inputs.written}`,
    `Human judgment: ${inputs.judgment}`,
    `If skipped once: ${inputs.stakes}`,
    `90-day data: ${inputs.data}`,
    '',
    `OUTCOME: ${o.label.toUpperCase()}`,
    o.title,
    '',
    'Next steps:',
    ...o.next_steps.map((s, i) => `  ${i + 1}. ${s}`),
    '',
    `Do not: ${o.do_not}`,
    '',
    rulesDoc.vending_lens[inputs.category] ? `Vending lens: ${rulesDoc.vending_lens[inputs.category]}` : ''
  ];
  return { outcomeId, outcome: o, summary: lines.filter(Boolean).join('\n') };
}

if (typeof window !== 'undefined') {
  window.MfAutomateEngine = { evaluate, formatSummary };
}