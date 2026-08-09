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
  'form', 'select', 'date-picker', 'time-picker', 'upload', 'table', 'tree', 'tree-select', 'cascader',
  'dropdown', 'message', 'modal', 'drawer', 'tooltip', 'popover', 'popconfirm', 'splitter', 'dnd',
  'ai', 'ai-form', 'ai-agent-workbench'
])
const r2 = new Set([
  'button', 'input', 'textarea', 'input-number', 'checkbox', 'radio', 'switch', 'menu', 'tabs', 'steps',
  'pagination', 'config-provider'
])

const taskGroups = [
  ['全局规范', ['config-provider', 'typography', 'icon']],
  ['布局与操作', ['button', 'space', 'flex', 'grid', 'divider']],
  ['路径与进度', ['menu', 'tabs', 'breadcrumb', 'steps', 'dropdown']],
  ['采集与选择', [
    'input', 'textarea', 'input-number', 'select', 'checkbox', 'radio', 'switch', 'date-picker', 'time-picker',
    'cascader', 'tree-select', 'upload', 'form'
  ]],
  ['呈现与状态', ['table', 'pagination', 'tree', 'descriptions', 'card', 'tag', 'badge', 'empty', 'spin', 'skeleton', 'alert']],
  ['上下文反馈', ['message', 'modal', 'drawer', 'tooltip', 'popover', 'popconfirm']],
  ['空间与编排', ['splitter', 'dnd']],
  ['对话与协作', ['ai', 'ai-form', 'ai-agent-workbench']]
]
const taskGroupFor = new Map(taskGroups.flatMap(([taskGroup, components]) => components.map((component) => [component, taskGroup])))
const qg2Depth = new Set(['dropdown', 'message', 'modal', 'drawer', 'tooltip', 'popover', 'popconfirm', 'splitter', 'dnd'])

const packageFor = (component) => component === 'dnd'
  ? '@aheart-ui/dnd'
  : ['ai', 'ai-form', 'ai-agent-workbench'].includes(component) ? '@aheart-ui/ai' : 'aheart-ui'

const aiUnit = {
  ai: 'packages/ai/src/__tests__/chat-panel.test.ts',
  'ai-form': 'packages/ai/src/__tests__/form.test.ts',
  'ai-agent-workbench': 'packages/ai/src/__tests__/agent-workbench.test.ts'
}
const e2eFor = () => 'e2e/docs-component-smoke.spec.ts'
const ssrFor = (component) => ({
  'date-picker': 'packages/components/src/date-picker/__tests__/date-picker.ssr.test.ts',
  'time-picker': 'packages/components/src/time-picker/__tests__/time-picker.ssr.test.ts'
}[component])
const file = (path) => ({ kind: 'file', path })
const notApplicable = (reason) => ({ kind: 'notApplicable', reason })
const planned = (milestone, reason) => ({ kind: 'planned', milestone, reason })
const deferred = (milestone, reason) => ({ kind: 'planned', milestone, status: 'deferred', reason })

const evidenceFor = (component) => ({
  component,
  package: packageFor(component),
  risk: r1.has(component) ? 'R1' : r2.has(component) ? 'R2' : 'R3',
  productTasks: [{
    id: `product-task:${packageFor(component)}:${component}`,
    taskGroup: taskGroupFor.get(component),
    acceptance: `验收 ${component} 在真实产品任务中的核心入口可用。`
  }],
  unit: [file(component === 'dnd' ? 'packages/dnd/src/__tests__/dnd.test.ts' : aiUnit[component] ?? `packages/components/src/${component}/__tests__/${component}.test.ts`)],
  e2e: r1.has(component)
    ? [
        file('e2e/qg1-ready-component-contracts.spec.ts'),
        planned(qg2Depth.has(component) ? 'QG2' : 'QG3', '后续质量门补充组件深度交互验收；QG1 仅登记真实路由与组件入口契约。')
      ]
    : [file(e2eFor(component))],
  ssr: [ssrFor(component) ? file(ssrFor(component)) : deferred('QG6', 'QG6 建立消费端 SSR 契约；当前明确记录为延期，不将 SSR 覆盖误标为不适用。')],
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
  for (const record of qualityMatrix) {
    const task = record.productTasks?.[0]
    if (record.productTasks?.length !== 1 || !task?.id || !task.taskGroup || !task.acceptance) {
      throw new Error(`Invalid quality matrix product task: ${record.component}`)
    }
  }
}
