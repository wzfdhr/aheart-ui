# aheart-ui

`aheart-ui` 是一个基于 Vue 3 + TypeScript + Vite 的组件库练习项目，采用 pnpm workspace 管理示例工程、组件包和工具包。

当前项目已经搭好组件库的基础目录、Vite 打包配置和本地示例应用；现有可用组件为 `Button`。

## 技术栈

- Vue 3
- TypeScript
- Vite
- vite-plugin-dts
- pnpm workspace

## 项目结构

```text
aheart-ui/
├─ examples/                  # 本地演示应用
│  ├─ app.vue                  # 示例页面，演示 Button 组件
│  ├─ main.ts                  # Vue 应用入口
│  └─ vite.config.ts           # 示例应用 Vite 配置
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

启动示例应用：

```bash
pnpm --filter ./examples dev
```

启动后访问终端输出的本地地址，通常是：

```text
http://localhost:5173/
```

示例应用当前在 `examples/app.vue` 中直接引入组件库：

```vue
<template>
  <div>
    <Button />
  </div>
</template>

<script lang="ts" setup>
import { Button } from 'aheart-ui'
</script>
```

## 构建组件库

构建 `packages/components`：

```bash
pnpm --filter ./packages/components build:prod
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
4. 在 `examples/app.vue` 中引入并验证组件渲染。
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
- `pnpm --filter ./packages/components build:prod` 是否可以成功执行。
- `packages/components/es` 和 `packages/components/lib` 是否包含最新构建产物。
- 示例应用是否可以正常引入构建前源码或 workspace 包。

## 当前注意事项

- 根目录 `package.json` 和 `packages/components/package.json` 当前都使用了 `aheart-ui` 作为包名。开发命令推荐使用路径过滤器，例如 `pnpm --filter ./packages/components build:prod`，避免包名过滤产生歧义。
- 根目录暂未配置统一的 `dev`、`build`、`test` 脚本。
- 项目暂未接入测试框架，`test` 脚本仍是占位命令。
- `Button` 的 props 类型已初步定义，但组件实现还没有使用这些 props。
- `packages/components/index.ts` 当前是用于测试 `@aheart-ui/utils` 的入口文件，组件库实际导出入口在 `packages/components/src/index.ts`。

## License

MIT
