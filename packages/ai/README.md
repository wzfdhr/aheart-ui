# @aheart-ui/ai

Aheart UI 的后端无关 AI 产品组件包，提供 AIChatPanel、AIForm、AIAgentWorkbench 与配套原子组件。

## 安装

```bash
pnpm add @aheart-ui/ai @aheart-ui/dnd aheart-ui vue
```

```ts
import { AIChatPanel } from '@aheart-ui/ai'
import 'aheart-ui/style.css'
import '@aheart-ui/dnd/style.css'
import '@aheart-ui/ai/style.css'
```

该包不包含模型 SDK、API Key、鉴权或持久化。业务层通过 `AITransport` 接入流式服务。Vue `>=3.4.0 <4` 和 `aheart-ui` 由业务应用提供。

完整用法见[中文 AI 对话文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/ai.md)、[AIForm 文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/ai-form.md)和[工作台文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/ai-agent-workbench.md)。
