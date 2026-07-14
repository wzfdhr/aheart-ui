---
aside: false
---

<script setup lang="ts">
import { ref } from 'vue'
import type {
  AIAgentArtifact,
  AIAgentContextItem,
  AIAgentTask,
  AIMessage,
  AIStreamEvent,
  AITransport
} from '@aheart-ui/ai'

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
    detail: '上次执行失败',
    error: '模拟上游服务超时'
  },
  {
    id: 'publish',
    label: '发布产品方案',
    status: 'waiting-approval',
    approval: {
      id: 'publish-approval',
      title: '确认发布到团队知识库',
      description: '该操作由业务层执行，组件只收集人工决定。'
    }
  }
])
const contextItems = ref<AIAgentContextItem[]>([
  { id: 'brief', label: '产品需求简报', description: '目标、范围和验收标准' },
  { id: 'research', label: '用户研究记录', description: '近期访谈摘要' }
])
const artifacts: AIAgentArtifact[] = [
  { id: 'brief', title: '产品方案.md', description: '可评审版本', type: 'markdown', status: 'ready', updatedAt: '10:08' },
  { id: 'source-data', title: '来源数据.csv', description: '结构化来源清单', type: 'table', status: 'ready', updatedAt: '10:06' }
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

# AI Agent 工作台 <span class="aheart-status aheart-status--ready">Ready</span>

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

| 属性 | 说明 |
| --- | --- |
| `title` / `description` | 工作台任务标题与上下文说明。 |
| `panelSizes` / `v-model:panelSizes` | 三栏尺寸，复用 Splitter 语义。 |
| `conversations` / `activeConversation` | 受控会话列表与当前会话。 |
| `messages` / `transport` / `prompts` | 传给 `AIChatPanel` 的对话能力；省略 `messages` 时由工作台维护本地消息。 |
| `tasks` | 受控任务时间线，包含状态、工具、进度、错误和审批。 |
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
