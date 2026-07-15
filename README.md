# Aheart UI

Aheart UI 是面向专业产品界面的 Vue 3 组件体系，覆盖基础组件、布局导航、数据录入、数据展示、浮层反馈、可访问拖拽能力，以及后端无关的 AI 产品组件。

当前仓库采用 pnpm workspace 管理，包含核心组件包、拖拽包、AI 组件包和 VitePress 中文文档站。中文文档站包含 48 个 Ready 条目；英文站当前按产品决策暂停，不参与发布验收。

## 特性

- Vue 3 + TypeScript：组件源码、类型声明和构建产物围绕 Vue 3 组织。
- 产品界面优先：覆盖表单、表格、单值与范围日期时间、树、上传、反馈、浮层和布局等常见后台场景。
- 拖拽能力：提供 Draggable、DropZone、SortableList、DragOverlay 和组合式 API。
- AI 产品组件：提供 AIChatPanel、AIForm、AIAgentWorkbench 与配套原子组件，不绑定具体模型 SDK。
- 发布前验证：通过测试、类型检查、构建、文档构建、E2E 和 npm tarball 合约检查。

## 包结构

| 包 | 作用 |
| --- | --- |
| `aheart-ui` | 设计基础、布局、导航、表单、数据展示、Date/Time RangePicker、浮层反馈、树和 Splitter |
| `@aheart-ui/dnd` | Draggable、DropZone、SortableList、DragOverlay 与组合式 API |
| `@aheart-ui/ai` | AIChatPanel、AIForm、AIAgentWorkbench 和 AI 原子组件 |

仓库主要目录：

| 目录 | 说明 |
| --- | --- |
| `packages/components` | 核心组件包 `aheart-ui` |
| `packages/dnd` | 拖拽包 `@aheart-ui/dnd` |
| `packages/ai` | AI 产品组件包 `@aheart-ui/ai` |
| `docs` | 中文文档站与交互演示 |
| `e2e` | Playwright 端到端用例 |
| `scripts` | 发布合约、生成产物检查等脚本 |

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

按需使用组件：

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

## 文档

- [组件总览](docs/components/overview.md)
- [安装指南](docs/guide/installation.md)
- [使用指南](docs/guide/usage.md)
- [主题 Token](docs/guide/theme.md)
- [发布指南](docs/guide/releasing.md)

本地启动文档站：

```bash
corepack pnpm install
corepack pnpm dev
```

默认会启动 VitePress 文档站。若 5173 端口被占用，请以终端输出的实际地址为准。

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

常用命令说明：

| 命令 | 作用 |
| --- | --- |
| `corepack pnpm dev` | 启动中文文档演示站 |
| `corepack pnpm test` | 运行组件、拖拽包、AI 包和脚本测试 |
| `corepack pnpm typecheck` | 运行全部包的类型检查 |
| `corepack pnpm build` | 构建全部发布包 |
| `corepack pnpm docs:build` | 构建 VitePress 文档站 |
| `corepack pnpm test:e2e` | 运行 Playwright E2E |
| `corepack pnpm release:check` | 执行发布前完整检查 |

## 发布边界

`release:check` 只验证发布就绪状态，不执行 `npm publish`、创建 Git tag 或 GitHub Release。正式发布步骤见 [中文发布指南](docs/guide/releasing.md)。

发布前需要确保生成产物、文档、E2E 和 npm tarball 合约都通过检查；`scripts/release-contract.mjs` 会验证发布包的入口、样式和私有运行时边界。

## License

MIT
