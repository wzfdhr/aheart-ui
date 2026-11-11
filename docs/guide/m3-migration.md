# M3 按需迁移

M3 候选把 AI 的 Chat、Agent、Workbench 和 DND Sortable 拆成独立入口。下文的导入路径已在安装候选 tarball 的独立 Vite 应用中验证。公开版本的安装方式见[安装](./installation)。

```sh
pnpm build
pnpm release:pack --pack-destination test-results/release-tarballs
```

将 tarball 放到独立 Vue 应用目录中安装，再选择下文的导入路径。

```sh
npm install ./aheart-ui-1.2.0.tgz ./aheart-ui-ai-1.1.0.tgz ./aheart-ui-dnd-1.1.0.tgz vue@3.5.44
```

## AI

Chat 场景从 `/chat` 导入聊天面板、发送框、消息气泡、附件和来源。单独使用一个组件时可选择 `/sender`、`/bubble` 等子入口。运行时 JS 和 CSS 分别导入。

```ts
import { AIChatPanel } from '@aheart-ui/ai/chat'
import '@aheart-ui/ai/chat/style.css'
```

[运行 Chat 示例](../components/ai)。发送消息后可以停止、重试、检查来源与附件。示例使用本地模拟传输。

Agent 场景从 `/agent` 导入过程、思考链与受控表单。只使用过程或表单时可从 `/process` 或 `/form` 导入。使用 AIForm 时一并引入基础表单样式。

```ts
import { AIForm, AIProcess, AIThoughtChain } from '@aheart-ui/ai/agent'
import 'aheart-ui/full.css'
import '@aheart-ui/ai/agent/style.css'
```

[运行 Agent 受控表单示例](../components/ai-form)。填写业务字段、验证失败后更正并提交，检查表单状态与结果。

Workbench 从 `/workbench` 或 `/agent-workbench` 导入，包含基础布局控件、任务排序与审批。应用提供基础组件、AI 工作台和 DND Sortable 的样式。

```ts
import { AIAgentWorkbench } from '@aheart-ui/ai/workbench'
import 'aheart-ui/full.css'
import '@aheart-ui/ai/workbench/style.css'
import '@aheart-ui/dnd/sortable/style.css'
```

[运行 Workbench 示例](../components/ai-agent-workbench)。使用任务恢复、人工审批和产物预览，并在窄视口检查执行面板。Chat 和 Agent 的子入口模块图与 Workbench 分开。v1 的 AI 包仍声明 DND 安装依赖，供继续使用旧根入口的项目使用。

## DND

Sortable 子入口提供 `SortableList`、`SortableItem` 和 `useSortable`。独立拖放组件使用 `/draggable`、`/droppable` 或 `/drag-overlay`。

```ts
import { SortableList } from '@aheart-ui/dnd/sortable'
import '@aheart-ui/dnd/sortable/style.css'
```

[运行排序示例](../components/dnd)。通过键盘进入拖动、移动、确认和取消，检查焦点和屏幕阅读器公告。iframe 内的实例在子文档加载相应样式。

## Resolver

使用 Vite 与 `unplugin-vue-components` 时可选择自动导入。Resolver 根据与包导出共用的清单解析已有子入口。默认只解析基础组件，AI 和 DND 需要在 `domains` 启用。

```ts
import Components from 'unplugin-vue-components/vite'
import { AheartUIResolver } from 'aheart-ui/resolver'

Components({
  resolvers: [AheartUIResolver({ domains: ['base', 'ai', 'dnd'], importStyle: 'css' })]
})
```

应用入口显式导入 `aheart-ui/theme.css`。当组件需要额外的基础样式时，按上文对应场景导入。使用 `importStyle: false` 时在应用入口手动导入组件样式。

## 迁移与回退

先替换一个场景的导入，再检查键盘、样式和业务事件。需要整套插件时使用 `@aheart-ui/ai/full` 或 `@aheart-ui/dnd/full`，并加载各自的 `full.css`。既有根入口和 `style.css` 仍可用于逐步迁移。

SSR 使用相同的公共入口，服务端和客户端锁定同一组 tarball。回退时恢复此前精确版本、锁文件和原来的根入口及样式。运行 `pnpm check:m3-consumer` 可复现独立安装、模块图和真实 Vite Resolver 验证。
