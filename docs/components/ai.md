<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AIAttachment, AIMessage, AIStreamEvent, AITransport } from '@aheart-ui/ai'

const messages = ref<AIMessage[]>([])
const activeConversation = ref('one')
const attachments = ref<AIAttachment[]>([{ id: 'brief', name: '产品简报.md', type: 'text/markdown' }])
const conversations = [
  { key: 'one', label: '会话一' },
  { key: 'two', label: '会话二' }
]
const prompts = [
  { key: 'launch', label: '生成产品发布摘要', description: '展示流式输出和停止能力' },
  { key: 'failure', label: '模拟失败并重试', description: '体验错误恢复流程' }
]
const activeConversationLabel = computed(
  () => conversations.find((item) => item.key === activeConversation.value)?.label ?? '未选择'
)

const wait = (duration: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    let timer: ReturnType<typeof setTimeout>
    const done = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', done)
      resolve()
    }
    timer = setTimeout(done, duration)
    signal.addEventListener('abort', done, { once: true })
  })

const transport: AITransport = {
  async *send(request, signal): AsyncIterable<AIStreamEvent> {
    const prompt = request.messages.at(-1)?.content ?? ''
    yield { type: 'process', item: { id: 'context', label: '整理上下文', status: 'running' } }
    await wait(140, signal)
    if (signal.aborted) {
      yield { type: 'cancelled' }
      return
    }

    if (prompt.includes('模拟失败') && request.action !== 'retry') {
      yield { type: 'error', error: '模拟服务暂不可用' }
      return
    }

    yield { type: 'process', item: { id: 'context', label: '整理上下文', status: 'complete' } }
    if (request.action === 'retry') {
      yield { type: 'text-delta', delta: '连接已恢复，已继续生成可靠的处理建议。' }
      yield { type: 'done' }
      return
    }

    if (request.action === 'edit') {
      yield { type: 'text-delta', delta: `已根据“${prompt}”重新整理回答。` }
      yield { type: 'done' }
      return
    }

    yield { type: 'text-delta', delta: '正在分析产品目标。' }
    await wait(500, signal)
    if (signal.aborted) {
      yield { type: 'cancelled' }
      return
    }
    yield { type: 'text-delta', delta: '建议先明确核心用户、发布渠道和成功指标。' }
    await wait(500, signal)
    if (signal.aborted) {
      yield { type: 'cancelled' }
      return
    }
    yield { type: 'text-delta', delta: '这段内容不应在停止后出现' }
    yield {
      type: 'sources',
      sources: [{ id: 'guide', title: 'Aheart UI 产品指南', url: 'https://example.com/guide' }]
    }
    yield { type: 'done' }
  }
}

const resetChat = () => {
  messages.value = []
  attachments.value = [{ id: 'brief', name: '产品简报.md', type: 'text/markdown' }]
}
</script>

# AI 智能对话 <span class="aheart-status aheart-status--ready">已完成</span>

`@aheart-ui/ai` 提供模型无关的完整对话流程。业务层实现 `AITransport` 并负责鉴权、持久化、模型调用和工具执行；组件包不会保存 API Key，也不绑定任何模型 SDK。

## 产品级对话面板

<div class="aheart-ai-demo-toolbar">
  <span>当前会话：<strong data-demo-active-conversation>{{ activeConversationLabel }}</strong></span>
  <AButton @click="resetChat">重置会话</AButton>
</div>

<AAIChatPanel
  v-model:messages="messages"
  v-model:active-conversation="activeConversation"
  v-model:attachments="attachments"
  :transport="transport"
  :conversations="conversations"
  :prompts="prompts"
/>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { AIMessage, AIStreamEvent, AITransport } from '@aheart-ui/ai'

const messages = ref<AIMessage[]>([])
const transport: AITransport = {
  async *send(request, signal): AsyncIterable<AIStreamEvent> {
    yield { type: 'process', item: { id: 'search', label: '检索资料', status: 'running' } }
    yield { type: 'text-delta', delta: '正在生成回复。' }
    if (signal.aborted) yield { type: 'cancelled' }
    else yield { type: 'done' }
  }
}
</script>

<template>
  <AAIChatPanel v-model:messages="messages" :transport="transport" :prompts="prompts" />
</template>
```

点击“生成产品发布摘要”可在首段输出后停止；点击“模拟失败并重试”可验证错误保留和恢复请求。用户消息支持编辑重发，助手消息支持复制、重试和重新生成；附件会随用户消息进入 `AIChatRequest`。

## 受控与默认消息

`messages` 存在时，面板完全由父组件控制；父组件拒绝更新时不会出现乐观 UI。未传 `messages` 时可通过 `defaultMessages` 初始化非受控会话，后续仍会发出 `update:messages` 供业务层持久化。

## 原子组件

| 组件 | 说明 |
| --- | --- |
| `AIWelcome` | 欢迎标题与说明区域。 |
| `AIPrompts` | 推荐提示词，选择后触发 `select`。 |
| `AIConversations` | 受控会话列表，使用 `v-model`。 |
| `AIBubble` | 安全展示消息、附件、来源与执行进度；支持安全 Markdown 子集和自定义渲染。 |
| `AISender` | 受控输入与发送/停止操作。 |
| `AIAttachments` | 附件列表，可触发 `remove`。 |
| `AIActions` | 消息操作列表，可触发 `select`。 |
| `AISources` | 来源列表，仅允许 `http:`、`https:`、`mailto:` 链接。 |
| `AIProcess` / `AIThoughtChain` | 业务提供的执行摘要与工具状态；不接收或展示模型隐藏推理。 |

## 类型

```ts
interface AIChatRequest {
  conversationId?: string
  messages: AIMessage[]
  action?: 'send' | 'retry' | 'regenerate' | 'edit'
  messageId?: string
}

interface AITransport {
  send(request: AIChatRequest, signal: AbortSignal): AsyncIterable<AIStreamEvent>
}
```

`AIStreamEvent` 支持 `text-delta`、`process`、`sources`、`done`、`cancelled` 和 `error`。默认消息渲染支持安全 Markdown 子集，原始 HTML 不会执行或插入 DOM。

## API

### D8 V2 stream protocol

V1 `AITransport` 保持到达顺序和 EOF 完成语义。需要恢复、重放和 revision 保护时使用显式 `AITransportV2`；组件不会混用两种协议，也不会通过异常猜测协议。

```ts
interface AIChatRequestV2 extends Omit<AIChatRequest, 'messageId'> {
  version: '2'
  requestId: string
  messageId: string // 本次输出消息
  targetMessageId?: string // retry/regenerate/edit 的旧目标
  idempotencyKey: string
  resume?: { afterSequence: number; revision: number }
}

interface AITransportV2 {
  version: '2'
  send(request: AIChatRequestV2, signal: AbortSignal): AsyncIterable<AIStreamEventV2>
  resume?(request: AIChatRequestV2, signal: AbortSignal): AsyncIterable<AIStreamEventV2>
}
```

V2 envelope 使用非空 `requestId`/`messageId`、安全整数 `sequence` 和非负 `revision`。乱序事件会在有限 buffer 中等待，重复事件幂等，冲突事件进入协议错误；`snapshot`/`final` 是权威 checkpoint。错误、取消和恢复均受当前 epoch 约束，旧 iterator 不能污染新会话。

受控 `messages` 模式下，每个 accepted candidate 都通过 `update:messages` 交给父层；父层拒绝时不会乐观显示。非受控模式由组件维护 accepted history。`stream-status` 可观察 `idle`、`streaming`、`reconnecting`、`completed`、`cancelled` 和 `error`。

工具调用默认只投影 `AIToolCallDisplay` 白名单字段；原始 arguments、result、reasoning、trace 和 token 不会进入默认 DOM。

| 属性 | 说明 |
| --- | --- |
| `messages` / `v-model:messages` | 受控消息历史。 |
| `defaultMessages` | 非受控模式的初始消息，仅在挂载时读取。 |
| `transport` | 必填，模型无关的流式传输适配器。 |
| `conversationId` | 当前请求使用的业务会话标识。 |
| `conversations` / `activeConversation` | 可选会话列表与受控当前会话。 |
| `prompts` | 空状态下的建议任务。 |
| `attachments` / `v-model:attachments` | 发送区的受控附件列表。 |
| `disabled` | 禁止发送、编辑和恢复操作。 |

| 事件 | 说明 |
| --- | --- |
| `send` / `stop` / `error` | 发送、停止和传输错误。 |
| `retry` / `regenerate` | 重试失败回复或重新生成已完成回复。 |
| `edit` | 编辑并重发用户消息，参数为原消息与新内容。 |
| `copy` | 用户触发复制，参数为对应消息。 |
