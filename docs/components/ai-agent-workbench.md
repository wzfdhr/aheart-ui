<script setup lang="ts">
import { ref } from 'vue'

const panelSizes = ref([220, 520, 320])
const activeConversation = ref('product')
const tasks = ref([
  { id: 'research', label: '整理产品资料', status: 'running' as const, detail: '正在检索来源' },
  { id: 'publish', label: '发布方案', status: 'waiting-approval' as const, approval: { id: 'publish-approval', title: '确认发布方案', description: '该操作会向业务层提交产物。' } }
])
const artifacts = [{ id: 'brief', title: '产品方案.md', description: '可由业务层提供预览链接。' }]
</script>

# AI Agent 工作台 <span class="aheart-status aheart-status--ready">Ready</span>

`AIAgentWorkbench` 负责展示和编排 Agent 工作流，不保存任务、不执行工具调用，也不绑定模型、鉴权或持久化服务。业务层通过受控 props 和事件对接自己的会话、传输、审批和产物系统。

## 基础使用

<AAIAgentWorkbench
  v-model:panel-sizes="panelSizes"
  v-model:active-conversation="activeConversation"
  v-model:tasks="tasks"
  :conversations="[{ key: 'product', label: '产品方案' }]"
  :artifacts="artifacts"
  @approve="task => console.log('approve', task)"
  @reject="task => console.log('reject', task)"
/>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { AIAgentTask } from '@aheart-ui/ai'

const sizes = ref([220, 520, 320])
const tasks = ref<AIAgentTask[]>([])
</script>

<template>
  <AAIAgentWorkbench
    v-model:panel-sizes="sizes"
    v-model:tasks="tasks"
    :conversations="conversations"
    :messages="messages"
    :transport="transport"
    :context-items="contextItems"
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

桌面端由 Splitter 组成会话、主对话、执行与产物三栏；移动端使用 Tabs 切换区域，并通过 Drawer 查看执行面板。任务和上下文支持 DnD 排序，同时始终保留“上移”“下移”按钮作为键盘和非拖拽操作路径。

## API

| 属性 | 说明 |
| --- | --- |
| `panelSizes` / `v-model:panelSizes` | 三栏尺寸，复用 Splitter 的像素、百分比和 `auto` 语义。 |
| `conversations` / `activeConversation` | 受控会话列表与当前会话。 |
| `messages` / `transport` | 传给 `AIChatPanel` 的消息和可选 `AITransport`；未传 transport 时展示业务层未接入提示。 |
| `tasks` | 受控任务列表，包含状态、错误和可选人工审批项。 |
| `contextItems` | 可排序的受控上下文列表。 |
| `sources` | 当前会话的受控来源列表，默认以安全链接展示。 |
| `attachments` | 当前会话的受控附件列表，默认以安全链接展示。 |
| `artifacts` | 受控产物列表；可提供安全的 `http:`、`https:` 或 `mailto:` 链接。 |
| `disabled` | 禁用审批、取消、重试和排序操作。 |

| 事件 | 说明 |
| --- | --- |
| `update:panelSizes`、`update:activeConversation`、`update:messages`、`update:tasks`、`update:contextItems` | 对应受控数据更新。 |
| `approve` / `reject` | 用户对待审批任务作出的决定。 |
| `cancel` / `retry` | 用户请求业务层取消或重试任务。 |
| `move-task` / `move-context` | 用户通过非拖拽操作调整顺序，携带 id 和方向。 |
| `error` | 对话 transport 返回错误。 |

`AIAgentTask` 支持 `pending`、`running`、`waiting-approval`、`complete`、`error`、`cancelled` 状态。工作台只渲染业务提供的执行摘要、工具状态、来源与产物，不会推导或显示模型隐藏推理。

## 插槽

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `task` | `{ task, index }` | 自定义单个任务区域；未提供时使用内置状态、审批、排序和操作按钮。 |
| `sources` | `{ sources }` | 自定义来源区域；未提供时使用 `AISources` 的安全链接展示。 |
| `attachments` | `{ attachments }` | 自定义附件区域；未提供时使用 `AIAttachments` 的安全链接展示。 |
| `artifact` | `{ artifact }` | 自定义单个产物的预览或链接；未提供时展示安全链接、标题与说明。 |
