<script setup lang="ts">
import { ref } from 'vue'
import type { AIStreamEvent, AITransport } from '@aheart-ui/ai'

const messages = ref([])

async function* stream(): AsyncIterable<AIStreamEvent> {
  yield { type: 'process', item: { id: 'search', label: '整理上下文', status: 'complete' } }
  yield { type: 'text-delta', delta: '我已经收到你的问题。' }
  yield { type: 'sources', sources: [{ id: 'guide', title: '产品指南', url: 'https://example.com/guide' }] }
  yield { type: 'done' }
}

const transport: AITransport = {
  send() {
    return stream()
  }
}
</script>

# AI 智能对话 <span class="aheart-status aheart-status--ready">Ready</span>

`@aheart-ui/ai` 提供模型无关的 AI 对话界面。业务层实现 `AITransport` 并负责鉴权、持久化、模型调用和工具执行；组件包不会保存 API Key，也不绑定任何模型 SDK。

## 安装

```ts
import AheartAI from '@aheart-ui/ai'
import '@aheart-ui/ai/style.css'

app.use(AheartAI)
```

## 流式对话

<AAIChatPanel v-model:messages="messages" :transport="transport" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { AIStreamEvent, AITransport } from '@aheart-ui/ai'

const messages = ref([])
const transport: AITransport = {
  async *send() {
    yield { type: 'text-delta', delta: '正在生成回复。' }
    yield { type: 'done' }
  }
}
</script>

<template>
  <AAIChatPanel v-model:messages="messages" :transport="transport" />
</template>
```

`AIChatPanel` 在发送时创建用户消息和助手占位消息；`text-delta` 逐段追加内容。点击“停止”会中止当前 `AbortSignal`，错误会保留在对应消息中并触发 `error`。

## 原子组件

| 组件 | 说明 |
| --- | --- |
| `AIWelcome` | 欢迎标题与说明区域。 |
| `AIPrompts` | 推荐提示词，选择后触发 `select`。 |
| `AIConversations` | 受控会话列表，使用 `v-model`。 |
| `AIBubble` | 安全展示一条消息、附件、来源与执行进度；支持安全 Markdown 子集和 `contentRenderer` 自定义渲染。 |
| `AISender` | 受控输入与发送/停止操作。 |
| `AIAttachments` | 附件列表，可触发 `remove`。 |
| `AIActions` | 消息操作列表，可触发 `select`。 |
| `AISources` | 来源列表，仅允许 `http:`、`https:`、`mailto:` 链接。 |
| `AIProcess` / `AIThoughtChain` | 业务提供的执行摘要与工具状态；不接收或展示模型隐藏推理。 |

## 类型

```ts
interface AITransport {
  send(request: AIChatRequest, signal: AbortSignal): AsyncIterable<AIStreamEvent>
}
```

`AIStreamEvent` 支持 `text-delta`、`process`、`sources`、`done`、`cancelled` 和 `error`。默认消息渲染支持加粗、强调和安全协议链接；原始 HTML 不会执行或插入 DOM。需要业务专属展示时，可为 `AIBubble` 传入 `contentRenderer` 并自行返回 Vue 节点。
