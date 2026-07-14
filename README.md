# Aheart UI

Aheart UI 是面向专业产品界面的 Vue 3 组件体系，提供基础组件、可访问拖拽能力和后端无关的 AI 产品组件。

## 包结构

| 包 | 作用 |
| --- | --- |
| `aheart-ui` | 设计基础、布局、导航、表单、数据展示、浮层反馈和 Splitter |
| `@aheart-ui/dnd` | Draggable、DropZone、SortableList、DragOverlay 与组合式 API |
| `@aheart-ui/ai` | AIChatPanel、AIForm、AIAgentWorkbench 和 AI 原子组件 |

中文文档站包含 48 个 Ready 条目。英文站当前按产品决策暂停，不参与发布验收。

## 安装

```bash
pnpm add aheart-ui vue
```

```ts
import { createApp } from 'vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/style.css'
import App from './App.vue'

createApp(App).use(AheartUI).mount('#app')
```

按需安装组件：

```ts
import { createApp } from 'vue'
import { Button } from 'aheart-ui'
import 'aheart-ui/style.css'
import App from './App.vue'

createApp(App).use(Button).mount('#app')
```

使用拖拽或 AI 包时，分别加载对应样式：

```ts
import '@aheart-ui/dnd/style.css'
import '@aheart-ui/ai/style.css'
```

## 开发

```bash
corepack pnpm install
corepack pnpm dev
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm docs:build
corepack pnpm test:e2e
corepack pnpm release:check
```

仓库只保留一套 VitePress 演示站：

- `packages/components`：`aheart-ui`
- `packages/dnd`：`@aheart-ui/dnd`
- `packages/ai`：`@aheart-ui/ai`
- `docs`：中文文档与交互演示
- `scripts/release-contract.mjs`：npm tarball 合约验证

## 发布边界

`release:check` 只验证发布就绪状态，不执行 `npm publish`、创建 Git tag 或 GitHub Release。正式发布步骤见 [中文发布指南](docs/guide/releasing.md)。

## License

MIT
