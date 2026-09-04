import { e2ePolicyFor, qg4EvidenceCoverage, qg4EvidencePath } from './quality-evidence-policy.mjs'

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

const acceptanceByComponent = {
  button: '点击主要与次要按钮后出现对应结果；禁用或加载状态不得重复触发操作。',
  'config-provider': '切换语言、尺寸、主题与禁用配置后子组件同步更新；局部覆盖不污染外层。',
  icon: '常用图标以正确图形和可访问名称渲染；未知名称不输出占位文字。',
  typography: '标题、正文与可复制文本保持清晰层级；溢出或禁用操作提供可理解反馈。',
  space: '调整方向、间距与换行后子项顺序稳定；窄屏下内容不重叠或溢出。',
  divider: '水平与垂直分隔线保持语义和对齐；带标题时文本不遮挡相邻内容。',
  splitter: '拖动或键盘调整面板尺寸后约束生效；取消、卸载和 iframe 场景完整清理。',
  flex: '切换方向、对齐与换行后内容保持可读；窄屏下布局不产生非预期横溢出。',
  grid: '改变列数、间距和响应式断点后网格正确重排；单元内容不互相覆盖。',
  tabs: '点击或键盘切换标签后仅显示当前面板；禁用标签不可进入且焦点可恢复。',
  breadcrumb: '点击层级链接可返回对应路径；分隔符、当前项与长文本保持垂直对齐。',
  dropdown: '打开菜单后定位与边缘避让正确；选择、Escape 和外部点击均关闭并恢复焦点。',
  menu: '横向、纵向和深色菜单正确选中；子菜单动画、方向键与 Escape 路径可完成。',
  steps: '切换当前步骤后标题、图标与连接线同步；横纵布局和小尺寸保持中心对齐。',
  input: '输入、清除和前后缀操作实时更新值；禁用、只读和错误状态不误提交。',
  'date-picker': '输入或面板选择日期后格式化结果正确；非法日期、禁用边界和取消可恢复。',
  'time-picker': '选择时分秒与确认后输出符合步长格式；禁用时间、清除和取消保持一致。',
  upload: '选择文件后可观察进度与成功结果；失败可重试，移除、限量和手动上传有效。',
  tree: '展开、选择和勾选节点后受控 keys 一致；禁用节点与折叠后焦点恢复正确。',
  'tree-select': '搜索并选择树节点后值与标签同步；多选、清除、禁用和键盘操作有效。',
  cascader: '逐级选择路径后值完整可见；搜索、懒加载、禁用节点和清除提供明确反馈。',
  dnd: '指针、触屏或键盘移动项目后顺序一致；取消、回滚和跨容器失败可恢复。',
  textarea: '输入内容后字数统计与自动高度实时更新；超限、清除和禁用状态可辨识。',
  'input-number': '键盘、步进器和格式化输入提交同一数值；范围边界与受控拒绝不漂移。',
  checkbox: '单项与分组选择后值同步；全选、半选、禁用和受控拒绝状态正确。',
  radio: '点击或键盘选择单项后组值唯一；禁用选项不可选且焦点状态清晰。',
  switch: '点击与空格切换后别名值正确；加载、禁用和受控拒绝不产生乐观漂移。',
  select: '搜索并选择选项后标签和值一致；多选移除、清除、加载和键盘关闭可完成。',
  form: '填写并提交表单后同步异步校验正确；失败聚焦首错，成功与重置结果可观察。',
  tag: '标签内容、颜色与可关闭状态正确呈现；关闭失败或禁用时不意外移除。',
  badge: '数值、封顶与状态点正确显示；零值、长文本和无内容场景保持对齐。',
  card: '标题、操作区和内容层级清晰；加载、空内容与窄屏布局不产生嵌套错位。',
  empty: '无数据时显示本地化说明与可选操作；恢复数据后空态完整退出。',
  descriptions: '多列描述项按标签和值对齐；长文本与窄屏下仍可扫描且不截断。',
  table: '排序、筛选、选择、展开和分页后数据一致；加载、空态和移动溢出可处理。',
  pagination: '切换页码、页大小和快速跳转后结果同步；边界页与受控拒绝不漂移。',
  alert: '不同级别提示展示正确标题与说明；关闭或操作后反馈明确且布局不跳动。',
  message: '触发提示后挂载、堆叠和更新可见；销毁、超时与全局配置行为一致。',
  modal: '打开对话框后确认、取消和 Escape 有效；异步失败可恢复并将焦点还给触发器。',
  drawer: '从各方向打开抽屉后内容定位正确；遮罩、Escape 和关闭动画后焦点恢复。',
  tooltip: '悬停或聚焦触发后文字提示定位正确；离开、Escape 和边缘翻转后安全关闭。',
  popover: '点击或聚焦后气泡内容与箭头定位正确；外部点击和关闭中重开保持状态。',
  popconfirm: '触发确认气泡后取消与危险确认均可读；执行结果、关闭和焦点恢复正确。',
  spin: '加载中显示稳定指示与可选文案；结束后内容恢复且减弱动效偏好生效。',
  skeleton: '加载阶段骨架尺寸与目标内容一致；完成后无布局跳变并遵循减弱动效。',
  ai: '发送消息后流式内容、停止和重试可完成；错误恢复、复制与会话切换结果明确。',
  'ai-form': '按 schema 填写并提交后联动与校验正确；非法字段安全降级并可恢复操作。',
  'ai-agent-workbench': '在工作台审批、取消和重试任务后状态同步；移动端切换与产物预览可完成。'
}

const packageFor = (component) => component === 'dnd'
  ? '@aheart-ui/dnd'
  : ['ai', 'ai-form', 'ai-agent-workbench'].includes(component) ? '@aheart-ui/ai' : 'aheart-ui'

const aiUnit = {
  ai: 'packages/ai/src/__tests__/chat-panel.test.ts',
  'ai-form': 'packages/ai/src/__tests__/form.test.ts',
  'ai-agent-workbench': 'packages/ai/src/__tests__/agent-workbench.test.ts'
}
const ssrFor = (component) => ({
  'date-picker': 'packages/components/src/date-picker/__tests__/date-picker.ssr.test.ts',
  'time-picker': 'packages/components/src/time-picker/__tests__/time-picker.ssr.test.ts'
}[component])
const file = (path) => ({ kind: 'file', path })
const planned = (milestone, reason) => ({ kind: 'planned', milestone, reason })
const deferred = (milestone, reason) => ({ kind: 'planned', milestone, status: 'deferred', reason })
const qg4EvidenceFor = (component, category) => qg4EvidenceCoverage[category].includes(component)
  ? [file(qg4EvidencePath)]
  : [planned('QG4', category === 'a11y'
      ? '尚无组件级 axe、键盘与焦点验收；不得用代表页面的结果替代该组件证据。'
      : '尚无组件级桌面、移动与动效视觉基线；不得用代表页面的截图替代该组件证据。')]

const e2eEvidenceFor = (component) => {
  const policy = e2ePolicyFor(component, r1.has(component) ? 'R1' : r2.has(component) ? 'R2' : 'R3')
  const evidence = policy.files.map(file)
  for (const milestone of policy.plannedMilestones) evidence.push(planned(milestone, `${milestone} 补充组件深度交互验收；QG1 当前证据只登记真实路由与组件入口契约。`))
  return evidence
}

const evidenceFor = (component) => ({
  component,
  package: packageFor(component),
  risk: r1.has(component) ? 'R1' : r2.has(component) ? 'R2' : 'R3',
  productTasks: [{
    id: `product-task:${packageFor(component)}:${component}`,
    taskGroup: taskGroupFor.get(component),
    acceptance: acceptanceByComponent[component]
  }],
  unit: [file(component === 'dnd' ? 'packages/dnd/src/__tests__/dnd.test.ts' : aiUnit[component] ?? `packages/components/src/${component}/__tests__/${component}.test.ts`)],
  e2e: e2eEvidenceFor(component),
  ssr: [ssrFor(component) ? file(ssrFor(component)) : deferred('QG6', 'QG6 建立消费端 SSR 契约；当前明确记录为延期，不将 SSR 覆盖误标为不适用。')],
  a11y: qg4EvidenceFor(component, 'a11y'),
  visual: qg4EvidenceFor(component, 'visual'),
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
