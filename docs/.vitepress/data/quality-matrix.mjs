/** @typedef {'aheart-ui' | '@aheart-ui/dnd' | '@aheart-ui/ai'} QualityPackage */
/** @typedef {'R1' | 'R2' | 'R3'} QualityRisk */

/**
 * Machine-readable release coverage. Keep every Ready component here: the
 * validation test intentionally fails when the component catalogue grows.
 */
const componentKeys = [
  'button', 'config-provider', 'icon', 'typography', 'space', 'divider', 'splitter', 'flex', 'grid',
  'tabs', 'breadcrumb', 'dropdown', 'menu', 'steps', 'input', 'date-picker', 'time-picker', 'upload',
  'tree', 'tree-select', 'cascader', 'dnd', 'textarea', 'input-number', 'checkbox', 'radio', 'switch',
  'select', 'form', 'tag', 'badge', 'card', 'empty', 'descriptions', 'table', 'pagination', 'alert',
  'message', 'modal', 'drawer', 'tooltip', 'popover', 'popconfirm', 'spin', 'skeleton', 'ai', 'ai-form',
  'ai-agent-workbench'
]

const r1 = new Set([
  'config-provider', 'splitter', 'dropdown', 'menu', 'date-picker', 'time-picker', 'upload', 'tree',
  'tree-select', 'cascader', 'dnd', 'input-number', 'select', 'form', 'table', 'pagination', 'message',
  'modal', 'drawer', 'popover', 'popconfirm', 'ai', 'ai-form', 'ai-agent-workbench'
])

const packageFor = (component) => component === 'dnd'
  ? '@aheart-ui/dnd'
  : ['ai', 'ai-form', 'ai-agent-workbench'].includes(component) ? '@aheart-ui/ai' : 'aheart-ui'

const aiUnit = {
  ai: 'packages/ai/src/__tests__/chat-panel.test.ts',
  'ai-form': 'packages/ai/src/__tests__/form.test.ts',
  'ai-agent-workbench': 'packages/ai/src/__tests__/agent-workbench.test.ts'
}
const e2eFor = (component) => component === 'ai' || component.startsWith('ai-')
  ? 'e2e/q5-ai-product-suite.spec.ts'
  : component === 'dnd' || component === 'splitter' ? 'e2e/agent-workbench.spec.ts'
    : ['date-picker', 'time-picker'].includes(component) ? 'e2e/date-picker.spec.ts'
      : 'e2e/docs-component-smoke.spec.ts'
const ssrFor = (component) => ({
  'date-picker': 'packages/components/src/date-picker/__tests__/date-picker.ssr.test.ts',
  'time-picker': 'packages/components/src/time-picker/__tests__/time-picker.ssr.test.ts'
}[component])
const file = (path) => ({ kind: 'file', path })
const notApplicable = (reason) => ({ kind: 'notApplicable', reason })
const planned = (milestone, reason) => ({ kind: 'planned', milestone, reason })

const evidenceFor = (component) => ({
  component,
  package: packageFor(component),
  risk: r1.has(component) ? 'R1' : 'R2',
  unit: [file(component === 'dnd' ? 'packages/dnd/src/__tests__/dnd.test.ts' : aiUnit[component] ?? `packages/components/src/${component}/__tests__/${component}.test.ts`)],
  e2e: [file(e2eFor(component))],
  ssr: [ssrFor(component) ? file(ssrFor(component)) : notApplicable('QG6 统一消费端 SSR 契约将覆盖该组件；当前阶段不把其他包的测试冒充为本组件证据。')],
  a11y: [planned('QG4', 'QG4 建立组件级 axe、键盘与焦点验收；QG1 不将现有冒烟测试误标为无障碍覆盖。')],
  visual: [planned('QG4', 'QG4 建立桌面、移动、暗色与 reduced-motion 截图基线；QG1 不将普通 E2E 文件误标为视觉基线。')],
  owner: '质量工程组'
})

export const qualityMatrix = componentKeys.map(evidenceFor)

export function validateQualityMatrix(readyKeys) {
  const registered = qualityMatrix.map((record) => record.component)
  const duplicate = registered.find((key, index) => registered.indexOf(key) !== index)
  const missing = readyKeys.filter((key) => !registered.includes(key))
  const unknown = registered.filter((key) => !readyKeys.includes(key))
  if (duplicate || missing.length || unknown.length || registered.length !== readyKeys.length) {
    throw new Error(`Invalid quality matrix: duplicate=${duplicate ?? 'none'}, missing=${missing.join(',') || 'none'}, unknown=${unknown.join(',') || 'none'}`)
  }
}
