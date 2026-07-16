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

const evidenceFor = (component) => ({
  component,
  package: packageFor(component),
  risk: r1.has(component) ? 'R1' : 'R2',
  unit: [`packages/${packageFor(component) === 'aheart-ui' ? 'components' : packageFor(component).endsWith('dnd') ? 'dnd' : 'ai'}/src/**/__tests__`],
  e2e: [`e2e/${component === 'ai' || component.startsWith('ai-') ? 'q5-ai-product-suite' : component === 'dnd' || component === 'splitter' ? 'agent-workbench' : 'docs-component-smoke'}.spec.ts`],
  ssr: ['packages/components/src/**/__tests__/*.ssr.test.ts'],
  a11y: ['键盘路径、可见焦点与语义角色'],
  visual: ['1440×900、390×844 中文文档站截图基线'],
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
