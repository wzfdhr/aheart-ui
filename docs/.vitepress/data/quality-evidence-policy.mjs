export const qg1ComponentContractPath = 'e2e/qg1-ready-component-contracts.spec.ts'
export const qg4EvidencePath = 'e2e/a11y-visual.spec.ts'
export const qg4EvidenceCoverage = {
  a11y: [
    'input', 'select', 'date-picker', 'time-picker', 'table', 'menu', 'modal', 'drawer', 'splitter',
    'ai-agent-workbench'
  ],
  visual: [
    'input', 'select', 'date-picker', 'time-picker', 'table', 'menu', 'modal', 'splitter',
    'ai-agent-workbench'
  ]
}

const dedicatedE2e = {
  button: 'e2e/q2-navigation-overlays.spec.ts',
  menu: 'e2e/q2-navigation-overlays.spec.ts',
  steps: 'e2e/q2-navigation-overlays.spec.ts',
  dropdown: 'e2e/q2-navigation-overlays.spec.ts',
  modal: 'e2e/q2-navigation-overlays.spec.ts',
  popconfirm: 'e2e/q2-navigation-overlays.spec.ts',
  'input-number': 'e2e/q3-form-controls.spec.ts',
  textarea: 'e2e/q3-form-controls.spec.ts',
  select: 'e2e/q3-form-controls.spec.ts',
  checkbox: 'e2e/q3-form-controls.spec.ts',
  switch: 'e2e/q3-form-controls.spec.ts',
  'time-picker': 'e2e/time-picker-range.spec.ts',
  cascader: 'e2e/q3-form-controls.spec.ts',
  'tree-select': 'e2e/q3-form-controls.spec.ts',
  form: 'e2e/q4-data-forms.spec.ts',
  table: 'e2e/q4-data-forms.spec.ts',
  pagination: 'e2e/q4-data-forms.spec.ts',
  'date-picker': 'e2e/date-picker.spec.ts',
  drawer: 'e2e/overlay-motion.spec.ts',
  popover: 'e2e/overlay-motion.spec.ts',
  splitter: 'e2e/dnd-splitter.spec.ts',
  dnd: 'e2e/dnd-splitter.spec.ts',
  ai: 'e2e/q5-ai-product-suite.spec.ts',
  'ai-form': 'e2e/q5-ai-product-suite.spec.ts',
  'ai-agent-workbench': 'e2e/q5-ai-product-suite.spec.ts'
}

const futureBrowserMilestone = new Map([
  ['config-provider', 'QG3'], ['upload', 'QG3'], ['tree', 'QG3'], ['message', 'QG3'], ['modal', 'QG3']
])

export const e2ePolicyFor = (component, risk) => ({
  files: [risk === 'R1' ? qg1ComponentContractPath : 'e2e/docs-component-smoke.spec.ts', dedicatedE2e[component]].filter(Boolean),
  plannedMilestones: futureBrowserMilestone.has(component) ? [futureBrowserMilestone.get(component)] : []
})
