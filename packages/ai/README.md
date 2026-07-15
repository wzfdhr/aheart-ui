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

AIForm 的日期时间字段包含 `date`、`time`、`date-range` 与 `time-range`，所有值均为字符串或完整双端字符串范围，不向业务 schema 暴露 Dayjs。运行时会拒绝不可解析的日期时间默认值；必填范围不允许单端为空。

完整用法见[中文 AI 对话文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/ai.md)、[AIForm 文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/ai-form.md)和[工作台文档](https://github.com/wzfdhr/aheart-ui/blob/master/docs/components/ai-agent-workbench.md)。
