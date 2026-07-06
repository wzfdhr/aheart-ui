# aheart-ui

`aheart-ui` 是一个基于 Vue 3 + TypeScript + Vite 的组件库练习项目，采用 pnpm workspace 管理文档演示站、组件包和工具包。

当前项目已经搭好组件库的基础目录、Vite 打包配置和 VitePress 文档演示站。组件演示统一放在 `docs` 中，不再保留单独的 `examples` playground。

## 技术栈

- Vue 3
- TypeScript
- Vite
- vite-plugin-dts
- pnpm workspace

## 项目结构

```text
aheart-ui/
├─ docs/                      # VitePress 文档与组件演示站
│  ├─ components/             # 组件文档与交互示例
│  ├─ guide/                  # 使用指南
│  └─ .vitepress/             # 文档站配置与主题
├─ packages/
│  ├─ components/              # 组件库主包，包名为 aheart-ui
│  │  ├─ src/
│  │  │  ├─ button/            # Button 组件源码
│  │  │  └─ index.ts           # 组件导出入口
│  │  ├─ es/                   # ES Module 构建产物
│  │  ├─ lib/                  # CommonJS 构建产物
│  │  ├─ index.ts              # 当前用于测试 utils 引入的入口文件
│  │  ├─ package.json
│  │  └─ vite.config.ts        # 组件库构建配置
│  └─ utils/                   # 工具函数包，包名为 @aheart-ui/utils
│     ├─ index.ts
│     └─ package.json
├─ pnpm-workspace.yaml         # workspace 配置
├─ tsconfig.json               # TypeScript 基础配置
└─ README.md
```

## 环境要求

建议使用：

- Node.js 18+
- pnpm 8+

如果本机没有 pnpm，可以通过 Corepack 启用：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

也可以使用 npm 全局安装：

```bash
npm install -g pnpm
```

## 安装依赖

在项目根目录执行：

```bash
pnpm install
```

## 本地开发

启动文档演示站：

```bash
pnpm dev
```

如果本机 pnpm 版本或 Corepack 状态异常，也可以直接执行：

```bash
npm run dev
```

启动后访问终端输出的本地地址，通常是：

```text
http://localhost:5173/
```

文档演示站会通过 VitePress 主题全量注册组件库，组件页面和首页预览都可以直接使用 Aheart UI 组件：

```vue
<template>
  <AButton type="primary">主要按钮</AButton>
</template>
```

## 构建组件库

构建 `packages/components`：

```bash
pnpm build
```

构建后会生成：

- `packages/components/es`：ES Module 产物
- `packages/components/lib`：CommonJS 产物
- 类型声明文件：由 `vite-plugin-dts` 根据 `tsconfig.json` 生成

组件库构建时会将 `vue` 标记为外部依赖，不会把 Vue 一起打进组件包。

## 包说明

### aheart-ui

路径：`packages/components`

这是组件库主包，目前导出：

```ts
import { Button } from 'aheart-ui'
```

也可以单独安装组件到 Vue 应用：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Button } from 'aheart-ui'

const app = createApp(App)

app.use(Button)
app.mount('#app')
```

当前还没有提供一次性安装所有组件的默认插件入口。

### @aheart-ui/utils

路径：`packages/utils`

当前导出一个测试函数：

```ts
import { testfun } from '@aheart-ui/utils'

const result = testfun(1, 1)
// result: 2
```

## 当前组件

### Button

源码路径：`packages/components/src/button`

基础用法：

```vue
<template>
  <Button />
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
</script>
```

当前 `Button` 组件的模板内容为固定按钮：

```vue
<button>测试按钮</button>
```

`packages/components/src/button/types.ts` 中已经定义了计划使用的 `type` 和 `size` 类型：

```ts
export const ButtonType = ['default', 'primary', 'success', 'warning', 'danger']
export const ButtonSize = ['large', 'normal', 'small', 'mini']
```

但当前 `button.vue` 尚未接入这些 props，也还没有样式实现。

## 新增组件建议流程

以新增 `Input` 组件为例：

1. 在 `packages/components/src/input` 下创建组件源码。
2. 在组件目录中提供 `index.ts`，复用 `Button` 当前的 `withInstall` 模式，为组件挂载 `install` 方法。
3. 在 `packages/components/src/index.ts` 中导出新组件。
4. 在 `docs/components` 中补充组件文档和演示，并通过 `pnpm dev` 验证渲染。
5. 运行组件库构建命令，确认 `es`、`lib` 和类型声明正常生成。

推荐目录形式：

```text
packages/components/src/input/
├─ input.vue
├─ index.ts
└─ types.ts
```

## 发布前检查

发布组件包前建议检查：

- `packages/components/package.json` 的 `name`、`version`、`main`、`module`、`files` 是否符合发布目标。
- `pnpm build` 是否可以成功执行。
- `packages/components/es` 和 `packages/components/lib` 是否包含最新构建产物。
- 文档演示站是否可以正常引入 workspace 包。

## 当前注意事项

- 根目录 `dev` 启动 `docs` 文档演示站，组件级测试和构建仍由 `packages/components` 负责。
- `packages/components/index.ts` 当前是用于测试 `@aheart-ui/utils` 的入口文件，组件库实际导出入口在 `packages/components/src/index.ts`。

## License

MIT
