---
aside: false
---

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import type {
  AIAgentArtifact,
  AIAgentContextItem,
  AIAgentTask,
  AIStreamEvent,
  AITransport,
  AIMessage,
  AIAgentOperationResult
} from '@aheart-ui/ai'
import { AIAgentWorkbench, AIBubble, AIChatPanel, AIForm } from '@aheart-ui/ai'

const d8Mode = ref<string | null>(null)
const d8ClientReady = ref(false)
const isD8 = computed(() => d8ClientReady.value && (d8Mode.value === 'd8' || d8Mode.value === 'd8-iframe'))
const isD8Iframe = computed(() => d8Mode.value === 'd8-iframe')
const d8Fixture = ref<HTMLElement>()
const d8Narrow = ref(false)
const measureD8 = () => { const element = d8Fixture.value; if (element) d8Narrow.value = element.scrollWidth <= element.clientWidth }
onMounted(() => { d8Mode.value = new URLSearchParams(window.location.search).get('fixture'); d8ClientReady.value = true; measureD8(); window.addEventListener('resize', measureD8); nextTick(measureD8) })

type D8Queue = { push: (value: any) => void; fail: (error: Error) => void; iterable: (signal: AbortSignal) => AsyncIterable<any> }
const makeQueue = (): D8Queue => {
  const values: any[] = []; const waiters: Array<{ resolve: (value: IteratorResult<any>) => void; reject: (error: Error) => void }> = []
  return { push(value) { const waiter = waiters.shift(); waiter ? waiter.resolve({ value, done: false }) : values.push(value) }, fail(error) { const waiter = waiters.shift(); waiter ? waiter.reject(error) : values.push({ __error: error }) }, async *iterable(signal) { while (!signal.aborted) { if (values.length) { const value = values.shift(); if (value?.__error) throw value.__error; yield value; continue } const result = await new Promise<IteratorResult<any>>((resolve, reject) => { waiters.push({ resolve, reject }); signal.addEventListener('abort', () => resolve({ value: undefined, done: true }), { once: true }) }); if (result.done) return; yield result.value } } }
}
const d8ActiveConversation = ref('one'); const d8StreamStatus = ref('idle'); const d8UpdateLog = ref<string[]>([]); const d8ResumeCalls = ref(0)
const d8Messages = ref<AIMessage[]>([])
let d8SendQueue: D8Queue | undefined; let d8ResumeQueue: D8Queue | undefined; let d8Request: any
const d8V2Transport = { version: '2' as const, send(request: any, signal: AbortSignal) { d8Request = request; d8SendQueue = makeQueue(); d8SendQueue.push(d8V2Event('text-delta', 1, { delta: '' })); return d8SendQueue.iterable(signal) }, resume(request: any, signal: AbortSignal) { d8ResumeCalls.value += 1; d8Request = request; d8ResumeQueue = makeQueue(); return d8ResumeQueue.iterable(signal) } }
const d8V2Event = (type: string, sequence: number, fields: Record<string, unknown> = {}) => ({ version: '2', requestId: d8Request?.requestId, messageId: d8Request?.messageId, sequence, revision: 0, type, ...fields })
const d8StreamUpdate = (messages: AIMessage[]) => { d8Messages.value = messages; d8UpdateLog.value.push(messages.at(-1)?.content ?? '') }
const d8StreamStatusUpdate = (status: string) => { d8StreamStatus.value = status }
const d8ConversationUpdate = async (value: string) => { const oldRequest = d8Request; const oldQueue = d8SendQueue; d8ActiveConversation.value = value; await nextTick(); if (oldRequest) oldQueue?.push({ version: '2', requestId: oldRequest.requestId, messageId: oldRequest.messageId, sequence: 99, revision: 0, type: 'text-delta', delta: 'late-event' }) }
const d8OutOfOrder = () => { d8SendQueue?.push(d8V2Event('text-delta', 3, { delta: '后到的片段' })); d8SendQueue?.push(d8V2Event('text-delta', 2, { delta: '先到的片段' })) }
const d8Duplicate = () => d8SendQueue?.push(d8V2Event('text-delta', 3, { delta: '后到的片段' }))
const d8Reconnect = () => d8SendQueue?.fail(new Error('连接中断'))
const d8Resume = () => d8ResumeQueue?.push(d8V2Event('final', 4, { revision: 1, message: { id: d8Request?.messageId, role: 'assistant', content: '先到的片段后到的片段服务端最终版本', status: 'complete' } }))

const d8Tasks = ref<AIAgentTask[]>([
  { id: 'prepare', label: '准备资料', status: 'pending', revision: 'r1' },
  { id: 'run', label: '运行分析', status: 'running', revision: 'r1', lockedReason: '任务当前不可排序', dependsOn: ['prepare'] },
  { id: 'publish', label: '发布结果', status: 'waiting-approval', revision: 'r1', approval: { id: 'approval-r1', title: '确认发布', status: 'pending', artifactId: 'd8-artifact' } }
])
const d8OperationState = ref('idle')
const d8OperationKey = ref('')
let d8PendingResolve: ((result: AIAgentOperationResult) => void) | undefined
let d8CurrentRequest: any
const d8ShowWorkbench = ref(true)
const d8CleanupCount = ref(0)
const d8ActionHandler = async (request: any) => {
  d8CurrentRequest = request
  d8OperationState.value = 'pending'; d8OperationKey.value = request.idempotencyKey
  return await new Promise<AIAgentOperationResult>((resolve) => { d8PendingResolve = resolve })
}
const d8Settle = (outcome: 'unknown' | 'not-applied' | 'success') => {
  if (!d8PendingResolve) return
  const operationId = d8CurrentRequest?.operationId ?? ''
  const result = outcome === 'success' ? { status: 'success', operationId: operationId ?? '' } : { status: 'error', operationId: operationId ?? '', error: outcome === 'unknown' ? '结果未知' : '版本已变化', outcome }
  d8PendingResolve(result as AIAgentOperationResult); d8PendingResolve = undefined; d8OperationState.value = outcome === 'success' ? 'success' : `error:${outcome}`
}
const d8TaskRejection = ref('')
const d8UpdateRevision = () => { d8Tasks.value = d8Tasks.value.map((task) => ({ ...task, revision: `${task.revision}-next` })) }

const d8FormValue = ref({ number: 5, email: '', confirm: '', asyncValue: '' })
const d8FormRef = ref<any>()
const d8FormSchema = { version: '1' as const, fields: [
  { key: 'number', label: '数量', type: 'number' as const, required: true, rules: [{ kind: 'range' as const, valueType: 'number' as const, min: 1, max: 100, message: '范围错误' }] },
  { key: 'email', label: '邮箱', type: 'input' as const, required: true, rules: [{ kind: 'format' as const, format: 'email' as const, message: '邮箱格式错误' }] },
  { key: 'confirm', label: '确认值', type: 'input' as const, rules: [{ kind: 'compare' as const, field: 'email', operator: 'equals' as const, message: '两项不一致' }] },
  { key: 'asyncValue', label: '异步值', type: 'input' as const, rules: [{ kind: 'async' as const, validator: 'unique', message: '已存在' }] }
] }
const d8AsyncValidators = { unique: async (value: unknown) => value === 'already-taken' ? '已存在' : undefined }
const d8FormServerError = () => d8FormRef.value?.setFieldsErrors?.([{ name: 'email', errors: ['服务端错误'] }])
const d8FormReset = () => d8FormRef.value?.resetFields?.()

const D8Fixture = defineComponent({
  name: 'D8Fixture',
  setup() {
    const button = (testid: string, label: string, onClick: () => void) => h('button', { 'data-testid': testid, type: 'button', onClick }, label)
    return () => {
      if (!isD8.value) return null
      if (isD8Iframe.value) return h('div', { ref: d8Fixture, class: 'd8-ai-fixture', 'data-testid': 'd8-ai-fixture' }, [
        d8ShowWorkbench.value ? h(AIAgentWorkbench, { 'data-testid': 'd8-iframe-workbench', scopeKey: 'd8-iframe', title: 'D8 iframe', tasks: d8Tasks.value, transport }) : null,
        h('span', { 'data-testid': 'd8-iframe-chat' }, 'iframe ready'),
        h('button', { 'data-testid': 'd8-iframe-unmount', type: 'button', onClick: () => { d8ShowWorkbench.value = false; d8CleanupCount.value = 1 } }, '卸载'),
        h('output', { 'data-testid': 'd8-iframe-cleanup-count' }, d8CleanupCount.value)
      ])
      return h('div', { ref: d8Fixture, class: 'd8-ai-fixture', 'data-testid': 'd8-ai-fixture', 'data-overflow-x': d8Narrow.value ? 'false' : 'true' }, [
      h('section', { class: 'd8-fixture-card', 'data-testid': 'd8-v2-stream', 'aria-label': 'D8 V2 stream' }, [
        h('div', { class: 'd8-fixture-controls' }, [button('d8-v2-dispatch-out-of-order', '乱序', d8OutOfOrder), button('d8-v2-dispatch-duplicate', '重复', d8Duplicate), button('d8-v2-trigger-reconnect', '恢复', d8Reconnect), button('d8-v2-resume', '完成', d8Resume)]),
        h(AIChatPanel, { transport: d8V2Transport, messages: d8Messages.value, activeConversation: d8ActiveConversation.value, conversations: [{ key: 'one', label: '会话一' }, { key: 'two', label: '会话二' }], 'onUpdate:messages': d8StreamUpdate, 'onUpdate:activeConversation': d8ConversationUpdate, onStreamStatus: d8StreamStatusUpdate }),
        h('output', { 'data-testid': 'd8-stream-status' }, d8StreamStatus.value), h('output', { 'data-testid': 'd8-resume-call-count' }, d8ResumeCalls.value), h('output', { 'data-testid': 'd8-update-log' }, d8UpdateLog.value.join('|'))
      ]),
      h('section', { 'data-testid': 'd8-workbench', class: 'd8-fixture-card', 'aria-label': 'D8 工作台' }, [
        h(AIAgentWorkbench, { scopeKey: 'd8', tasks: d8Tasks.value, artifacts: [{ id: 'd8-artifact', title: 'D8 产物', revision: 'a1' }], actionHandler: d8ActionHandler, tasksRevision: 'd8-r1', title: 'D8 工作台', transport, onTaskMoveReject: (value: string) => { d8TaskRejection.value = value } }),
        h('div', { class: 'd8-fixture-card' }, [h('output', { 'data-testid': 'd8-operation-state' }, d8OperationState.value), h('output', { 'data-testid': 'd8-operation-idempotency', 'data-key': d8OperationKey.value }, d8OperationKey.value), h('output', { 'data-testid': 'd8-task-rejection' }, d8TaskRejection.value), button('d8-operation-settle-unknown', '未知', () => d8Settle('unknown')), button('d8-operation-settle-not-applied', '未应用', () => d8Settle('not-applied')), button('d8-operation-settle-success', '成功', () => d8Settle('success')), button('d8-task-update-revision', '更新版本', d8UpdateRevision)])
      ]),
      h('section', { 'data-testid': 'd8-ai-form', class: 'd8-fixture-card' }, [h(AIForm, { ref: (value: any) => { d8FormRef.value = value }, modelValue: d8FormValue.value, 'onUpdate:modelValue': (value: Record<string, unknown>) => { d8FormValue.value = value as typeof d8FormValue.value }, schema: d8FormSchema, validators: d8AsyncValidators }), button('d8-form-server-error', '服务端错误', d8FormServerError), button('d8-form-reset', '重置', d8FormReset)]),
      h('section', { class: 'd8-fixture-card' }, [h(AIBubble, { message: { id: 'd8-tool', role: 'assistant', content: 'legacy detail must stay hidden', status: 'complete', toolCall: { id: 'call', name: 'search', summary: '查找资料', inputSummary: '安全输入', resultSummary: '完成', reasoning: 'reasoning', raw: 'raw-arguments', secret: 'secret-payload' } } })]),
      h('iframe', { 'data-testid': 'd8-owner-document-iframe', title: 'D8 owner document', src: withBase('/components/ai-agent-workbench?fixture=d8-iframe') })
    ])
    }
  }
})

const panelSizes = ref<Array<number | 'auto'>>([190, 'auto', 260])
const activeConversation = ref('product')
const activeArtifact = ref('brief')
const messages = ref<AIMessage[]>([
  { id: 'welcome', role: 'assistant', content: '资料已就绪，可以继续补充要求。', status: 'complete' }
])
const tasks = ref<AIAgentTask[]>([
  {
    id: 'research',
    label: '整理产品资料',
    status: 'complete',
    revision: 'r1',
    kind: 'tool',
    toolName: 'knowledge-search',
    detail: '已整理 8 个来源',
    startedAt: '10:01',
    completedAt: '10:02'
  },
  {
    id: 'summary',
    label: '生成执行摘要',
    status: 'error',
    revision: 'r1',
    detail: '上次执行失败',
    error: '模拟上游服务超时'
  },
  {
    id: 'publish',
    label: '发布产品方案',
    status: 'waiting-approval',
    revision: 'r1',
    approval: {
      id: 'publish-approval',
      title: '确认发布到团队知识库',
      description: '该操作由业务层执行，组件只收集人工决定。',
      artifactId: 'brief'
    }
  }
])
const contextItems = ref<AIAgentContextItem[]>([
  { id: 'brief', label: '产品需求简报', description: '目标、范围和验收标准' },
  { id: 'research', label: '用户研究记录', description: '近期访谈摘要' }
])
const artifacts: AIAgentArtifact[] = [
  { id: 'brief', title: '产品方案.md', description: '可评审版本', type: 'markdown', status: 'ready', updatedAt: '10:08', revision: 'a1' },
  { id: 'source-data', title: '来源数据.csv', description: '结构化来源清单', type: 'table', status: 'ready', updatedAt: '10:06', revision: 'a1' }
]
const sources = [{ id: 'guide', title: 'Aheart UI 产品指南', url: 'https://example.com/guide' }]
const attachments = [{ id: 'requirements', name: '需求说明.pdf' }]
const prompts = [{ key: 'continue', label: '继续完善发布方案', description: '结合现有上下文生成下一版' }]

const transport: AITransport = {
  async *send(_request, signal): AsyncIterable<AIStreamEvent> {
    yield { type: 'process', item: { id: 'draft', label: '更新方案', status: 'running' } }
    await new Promise((resolve) => setTimeout(resolve, 180))
    if (signal.aborted) {
      yield { type: 'cancelled' }
      return
    }
    yield { type: 'text-delta', delta: '已结合工作台上下文更新产品方案。' }
    yield { type: 'done' }
  }
}

const updateTask = (task: AIAgentTask, update: Partial<AIAgentTask>) => {
  tasks.value = tasks.value.map((item) => (item.id === task.id ? { ...item, ...update } : item))
}
const approveTask = (task: AIAgentTask) => {
  updateTask(task, {
    status: 'complete',
    approval: task.approval ? { ...task.approval, status: 'approved' } : undefined
  })
}
const rejectTask = (task: AIAgentTask) => {
  updateTask(task, {
    status: 'cancelled',
    approval: task.approval ? { ...task.approval, status: 'rejected' } : undefined
  })
}
const retryTask = (task: AIAgentTask) => {
  updateTask(task, { status: 'complete', detail: '重试成功', error: undefined, completedAt: '刚刚' })
}
const cancelTask = (task: AIAgentTask) => updateTask(task, { status: 'cancelled', detail: '已请求取消' })
</script>

<D8Fixture />
# AI Agent 工作台 <span class="aheart-status aheart-status--ready">已完成</span>

`AIAgentWorkbench` 负责展示和编排 Agent 工作流，不保存任务、不执行工具调用，也不绑定模型、鉴权或持久化服务。业务层通过受控 props 和事件对接会话、传输、审批和产物系统。

## 完整工作台

<AAIAgentWorkbench
  v-model:panel-sizes="panelSizes"
  v-model:active-conversation="activeConversation"
  v-model:active-artifact="activeArtifact"
  v-model:messages="messages"
  v-model:tasks="tasks"
  v-model:context-items="contextItems"
  title="产品方案 Agent"
  description="从资料整理、方案生成到人工发布审批。"
  :conversations="[{ key: 'product', label: '产品方案' }, { key: 'archive', label: '历史记录' }]"
  :transport="transport"
  :prompts="prompts"
  :sources="sources"
  :attachments="attachments"
  :artifacts="artifacts"
  @approve="approveTask"
  @reject="rejectTask"
  @cancel="cancelTask"
  @retry="retryTask"
>
  <template #artifact-preview="{ artifact }">
    <div class="aheart-ai-demo-artifact-preview">
      <span>{{ artifact.type }}</span>
      <strong>{{ artifact.title }}</strong>
      <p>{{ artifact.description }}</p>
    </div>
  </template>
</AAIAgentWorkbench>

```vue
<template>
  <AAIAgentWorkbench
    v-model:panel-sizes="sizes"
    v-model:tasks="tasks"
    v-model:active-artifact="activeArtifact"
    v-model:messages="messages"
    :transport="transport"
    v-model:context-items="contextItems"
    :sources="sources"
    :attachments="attachments"
    :artifacts="artifacts"
    @approve="approveTask"
    @reject="rejectTask"
    @cancel="cancelTask"
    @retry="retryTask"
  />
 </template>
```

桌面端由 Splitter 组成会话、主对话、执行与产物三栏；移动端使用 Tabs 切换区域，并通过 Drawer 查看执行面板。任务和上下文支持 DnD 排序，同时始终保留“上移”“下移”作为键盘和非拖拽路径。

## 任务时间线

`AIAgentTask` 可声明 `kind`、`toolName`、`progress`、`startedAt` 和 `completedAt`。运行、完成、待审批和错误使用不同状态线；错误详情默认收起，用户可主动展开。审批完成后继续保留“已批准”或“已拒绝”结果，形成可追溯记录。

## 产物预览

`activeArtifact` 完全受控。内置预览仅展示安全标题、说明和允许协议的链接；复杂 Markdown、表格、代码或业务文件应通过 `artifact-preview` 插槽渲染，并由业务层负责权限校验。

## API

### D8 操作、排序与响应式所有权

当提供 `actionHandler` 时，批准、拒绝、取消和重试都走同一事务入口；每次网络尝试有新的 `operationId`，同一逻辑重试复用 `idempotencyKey`。`pending`、`success`、`error` 都是可见且可访问的状态；未知结果只允许重放原 action，`not-applied` 才允许开启新的业务意图。任务或 artifact revision、approval identity、conversation 或 handler 改变时，旧 operation 会 abort 并失效。

```ts
type AIAgentActionHandler = (
  request: {
    operationId: string
    idempotencyKey: string
    taskId: string
    taskRevision: string | number
    action: 'approve' | 'reject' | 'cancel' | 'retry'
    approvalId?: string
    artifactId?: string
    artifactRevision?: string | number
  },
  signal: AbortSignal
) => Promise<{ status: 'success'; operationId: string } | {
  status: 'error'
  operationId: string
  error: string
  outcome?: 'not-applied' | 'unknown'
}>
```

任务排序使用同一 validator 处理按钮、DnD 和候选更新：任务集合必须相同，依赖必须存在且无环，依赖项先于后继；`running`、`waiting-approval`、`reorderable: false`、非空 `lockedReason` 或 pending operation 的任务保持原索引。`tasksRevision` 用于拒绝拖拽期间的陈旧候选。每个工作台拥有独立 DnD scope，`scopeKey` 可供路由层进一步隔离。

Workbench 在桌面和移动 Tabs/Drawer 之间移动同一个 ChatPanel 与 Execution 实例；draft、conversation、operation 和 active artifact 不因布局切换丢失。SSR 首树与客户端 hydration 保持一致，移动端仍使用真实组件 DOM，而不是副本或占位面板。

| 属性 | 说明 |
| --- | --- |
| `title` / `description` | 工作台任务标题与上下文说明。 |
| `panelSizes` / `v-model:panelSizes` | 三栏尺寸，复用 Splitter 语义。 |
| `conversations` / `activeConversation` | 受控会话列表与当前会话。 |
| `messages` / `transport` / `prompts` | 传给 `AIChatPanel` 的对话能力；省略 `messages` 时由工作台维护本地消息。 |
| `tasks` | 受控任务时间线，包含状态、工具、进度、错误和审批；审批可通过 `approval.artifactId` 显式关联待处理产物。 |
| `contextItems` | 可排序的受控上下文列表。 |
| `sources` / `attachments` | 当前会话的来源和附件。 |
| `artifacts` / `activeArtifact` | 产物列表与当前预览项。 |
| `disabled` | 禁用审批、取消、重试和排序操作。 |

| 事件 | 说明 |
| --- | --- |
| `update:*` | 面板尺寸、会话、消息、任务、上下文和产物选择的受控更新。 |
| `approve` / `reject` | 用户对待审批任务作出的决定。 |
| `cancel` / `retry` | 用户请求业务层取消或重试任务。 |
| `move-task` / `move-context` | 非拖拽排序，携带 id 和方向。 |
| `stop` / `chat-*` / `error` | 对话停止、恢复操作和传输错误。 |

工作台只渲染业务提供的执行摘要、工具状态、来源与产物，不会推导或显示模型隐藏推理。

## 插槽

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `task` | `{ task, index }` | 自定义单个任务区域。 |
| `sources` | `{ sources }` | 自定义来源区域。 |
| `attachments` | `{ attachments }` | 自定义附件区域。 |
| `artifact` | `{ artifact }` | 自定义产物列表项。 |
| `artifact-preview` | `{ artifact }` | 自定义当前产物预览。 |
