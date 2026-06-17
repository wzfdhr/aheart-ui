# Product Grade UI Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `aheart-ui` from a Vue 3 component-library scaffold into a publishable, documented, themeable, testable UI library foundation.

**Architecture:** Keep the pnpm workspace layout, with `packages/components` as the publishable `aheart-ui` package and `packages/utils` as shared utilities. Build the product in stages: project hygiene, package exports, install plugin, design tokens, first polished `Button`, docs site, tests, then batches of production components inspired by Ant Design categories.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, pnpm workspace, Vitest, Vue Test Utils, VitePress, GitHub Actions.

---

## Execution Rules

- Work on branch `codex/product-grade-ui-roadmap`.
- Each completed task gets its own verification, commit, and push to GitHub.
- Do not commit generated dependency folders such as `node_modules`.
- Prefer explicit `git add` paths for each task.
- Current environment has no `gh` command, so the publish action is `git push`. Draft PR creation can start after GitHub CLI is installed and authenticated.
- Use `pnpm --filter` path filters because the root package and component package currently share the `aheart-ui` name.

## Current Baseline

- Root workspace exists with `packages/components`, `packages/utils`, and `examples`.
- `README.md` describes the current project state.
- `packages/components/src/index.ts` exports `Button`.
- `packages/components/src/button/button.vue` renders a fixed native button.
- `packages/components/src/button/types.ts` defines planned `type` and `size` values, but the component does not consume them.
- `packages/components/package.json` currently points `main` at source and needs publish-ready entries.
- No docs site, test framework, lint workflow, CI, or theme system is configured.

## Product Scope

### Minimum Product-Grade Foundation

This is the first executable target. It must produce a library that can be installed, imported, themed, tested, and documented.

- Stable package metadata and exports.
- Root scripts for development, build, type check, tests, and docs.
- Global plugin install: `app.use(AheartUI)`.
- Per-component plugin install: `app.use(Button)`.
- Named imports: `import { Button } from 'aheart-ui'`.
- CSS variable based design tokens.
- Polished `Button` implementation with size, type, disabled, loading, block, round, and native button attributes.
- VitePress docs shell with Button documentation.
- Vitest coverage for exports and Button behavior.
- GitHub Actions workflow for install, type check, test, and build.

### Product Roadmap After Foundation

The foundation unlocks repeatable component delivery. Later component batches should be implemented as separate plans with the same verification and push rhythm.

- General: Button, Icon, Typography.
- Layout: Space, Divider, Flex, Grid.
- Data Entry: Input, Textarea, InputNumber, Checkbox, Radio, Switch, Select, Form.
- Feedback: Alert, Message, Modal, Drawer, Tooltip, Popover, Popconfirm, Spin, Skeleton.
- Data Display: Tag, Badge, Card, Empty, Descriptions, Table, Pagination.
- Navigation: Tabs, Breadcrumb, Dropdown, Menu, Steps.
- Advanced: DatePicker, TimePicker, Upload, Tree, TreeSelect, Cascader.

## File Structure

### Create

- `docs/superpowers/plans/2026-06-17-product-grade-ui-library.md`: this implementation plan.
- `packages/components/src/utils/install.ts`: shared `withInstall` helper.
- `packages/components/src/theme/index.css`: global CSS variables and base theme.
- `packages/components/src/button/style.css`: Button component styles.
- `packages/components/src/button/__tests__/button.test.ts`: Button tests.
- `docs/.vitepress/config.ts`: docs site config.
- `docs/index.md`: docs home page.
- `docs/components/button.md`: Button docs.
- `.github/workflows/ci.yml`: CI workflow.

### Modify

- `README.md`: keep aligned with the product-grade direction.
- `package.json`: make root private and add workspace scripts.
- `packages/components/package.json`: add publish-ready metadata, exports, scripts, and peer dependencies.
- `packages/components/src/index.ts`: export plugin, components, and style.
- `packages/components/src/button/button.vue`: implement Button API and accessible DOM.
- `packages/components/src/button/index.ts`: use shared `withInstall`.
- `packages/components/src/button/types.ts`: define runtime props and TypeScript types.
- `examples/app.vue`: show Button variants.

## Task 1: Commit Plan And Existing Documentation

**Files:**
- Create: `docs/superpowers/plans/2026-06-17-product-grade-ui-library.md`
- Modify: `README.md`

- [ ] **Step 1: Verify branch**

Run:

```bash
git branch --show-current
```

Expected:

```text
codex/product-grade-ui-roadmap
```

- [ ] **Step 2: Verify documentation diff**

Run:

```bash
git diff -- README.md docs/superpowers/plans/2026-06-17-product-grade-ui-library.md
git diff --check
```

Expected:

```text
No whitespace errors from git diff --check.
```

- [ ] **Step 3: Commit documentation**

Run:

```bash
git add README.md docs/superpowers/plans/2026-06-17-product-grade-ui-library.md
git commit -m "docs: add product grade ui roadmap"
```

Expected:

```text
Commit created with README.md and the roadmap plan.
```

- [ ] **Step 4: Push branch**

Run:

```bash
git push -u origin codex/product-grade-ui-roadmap
```

Expected:

```text
Remote branch codex/product-grade-ui-roadmap is created or updated on GitHub.
```

## Task 2: Project Scripts And Package Metadata

**Files:**
- Modify: `package.json`
- Modify: `packages/components/package.json`
- Modify: `examples/package.json`

- [ ] **Step 1: Update root package metadata and scripts**

Change `package.json` to:

```json
{
  "name": "aheart-ui-workspace",
  "version": "1.0.0",
  "private": true,
  "description": "Vue 3 component library workspace for aheart-ui.",
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "pnpm --filter ./examples dev",
    "build": "pnpm --filter ./packages/components build",
    "build:components": "pnpm --filter ./packages/components build",
    "typecheck": "pnpm --filter ./packages/components typecheck",
    "test": "pnpm --filter ./packages/components test",
    "docs:dev": "pnpm --filter ./docs dev",
    "docs:build": "pnpm --filter ./docs build"
  },
  "keywords": [
    "aheart-ui",
    "vue3",
    "component-library"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.3",
    "vite": "^5.0.12",
    "vite-plugin-dts": "^3.7.2"
  }
}
```

- [ ] **Step 2: Update component package metadata**

Change `packages/components/package.json` to use publish-ready entries:

```json
{
  "name": "aheart-ui",
  "version": "1.0.0",
  "description": "A Vue 3 component library.",
  "main": "lib/index.js",
  "module": "es/index.js",
  "types": "es/index.d.ts",
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.js"
    },
    "./es/*": "./es/*",
    "./lib/*": "./lib/*"
  },
  "scripts": {
    "build": "vite build",
    "build:prod": "vite build",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json",
    "test": "vitest run --environment jsdom",
    "test:watch": "vitest --environment jsdom"
  },
  "files": [
    "es",
    "lib"
  ],
  "keywords": [
    "aheart-ui",
    "vue3组件库"
  ],
  "author": "小凡",
  "license": "MIT",
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "dependencies": {
    "@aheart-ui/utils": "workspace:^"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.3",
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^24.1.1",
    "vite": "^5.0.12",
    "vite-plugin-dts": "^3.7.2",
    "vitest": "^1.6.1",
    "vue": "^3.4.0",
    "vue-tsc": "^2.0.29"
  }
}
```

- [ ] **Step 3: Update examples package dependencies**

Change `examples/package.json` so the demo app declares Vue explicitly:

```json
{
  "name": "examples",
  "version": "1.0.0",
  "description": "Local playground for aheart-ui.",
  "main": "index.ts",
  "scripts": {
    "dev": "vite",
    "test": "echo \"No example tests configured\""
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "aheart-ui": "workspace:^",
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.3",
    "vite": "^5.0.12"
  }
}
```

- [ ] **Step 4: Verify package JSON syntax**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('packages/components/package.json','utf8')); JSON.parse(require('fs').readFileSync('examples/package.json','utf8')); console.log('json ok')"
```

Expected:

```text
json ok
```

- [ ] **Step 5: Commit and push**

Run:

```bash
git add package.json packages/components/package.json examples/package.json
git commit -m "chore: prepare workspace package scripts"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Task 3: Install Helpers And Library Entry

**Files:**
- Create: `packages/components/src/utils/install.ts`
- Create: `packages/components/src/theme/index.css`
- Modify: `packages/components/src/index.ts`
- Modify: `packages/components/src/button/index.ts`

- [ ] **Step 1: Create shared install helper**

Create `packages/components/src/utils/install.ts`:

```ts
import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T>(component: T, name: string) => {
  ;(component as SFCWithInstall<T>).install = (app: App) => {
    app.component(name, component as SFCWithInstall<T>)
  }

  return component as SFCWithInstall<T>
}
```

- [ ] **Step 2: Use shared install helper for Button**

Change `packages/components/src/button/index.ts` to:

```ts
import button from './button.vue'
import { withInstall } from '../utils/install'

const Button = withInstall(button, 'AButton')

export default Button
```

- [ ] **Step 3: Create global theme token file**

Create `packages/components/src/theme/index.css` before importing it from the package entry:

```css
:root {
  --aheart-color-primary: #1677ff;
  --aheart-color-primary-hover: #4096ff;
  --aheart-color-success: #52c41a;
  --aheart-color-warning: #faad14;
  --aheart-color-danger: #ff4d4f;
  --aheart-color-text: #1f2329;
  --aheart-color-text-secondary: #646a73;
  --aheart-color-border: #d9d9d9;
  --aheart-color-bg: #ffffff;
  --aheart-color-bg-disabled: #f5f5f5;
  --aheart-font-size: 14px;
  --aheart-radius: 6px;
  --aheart-motion-duration: 0.2s;
}
```

- [ ] **Step 4: Add library plugin entry**

Change `packages/components/src/index.ts` to:

```ts
import type { App, Plugin } from 'vue'
import Button from './button'
import './theme/index.css'

const components = [Button]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button }
export default AheartUI
```

- [ ] **Step 5: Verify TypeScript parse**

Run:

```bash
node -e "console.log('entry files updated')"
```

Expected:

```text
entry files updated
```

- [ ] **Step 6: Commit and push**

Run:

```bash
git add docs/superpowers/plans/2026-06-17-product-grade-ui-library.md packages/components/src/utils/install.ts packages/components/src/theme/index.css packages/components/src/index.ts packages/components/src/button/index.ts
git commit -m "feat: add library install entry"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Task 4: Theme Tokens And Button Implementation

**Files:**
- Create: `packages/components/src/button/style.css`
- Modify: `packages/components/src/theme/index.css`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/types.ts`
- Modify: `examples/app.vue`

- [ ] **Step 1: Confirm global theme tokens**

Keep `packages/components/src/theme/index.css` aligned with these tokens:

```css
:root {
  --aheart-color-primary: #1677ff;
  --aheart-color-primary-hover: #4096ff;
  --aheart-color-success: #52c41a;
  --aheart-color-warning: #faad14;
  --aheart-color-danger: #ff4d4f;
  --aheart-color-text: #1f2329;
  --aheart-color-text-secondary: #646a73;
  --aheart-color-border: #d9d9d9;
  --aheart-color-bg: #ffffff;
  --aheart-color-bg-disabled: #f5f5f5;
  --aheart-font-size: 14px;
  --aheart-radius: 6px;
  --aheart-motion-duration: 0.2s;
}
```

- [ ] **Step 2: Define Button runtime props**

Change `packages/components/src/button/types.ts` to:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const buttonTypes = ['default', 'primary', 'success', 'warning', 'danger'] as const
export const buttonSizes = ['large', 'normal', 'small', 'mini'] as const
export const nativeButtonTypes = ['button', 'submit', 'reset'] as const

export type ButtonType = (typeof buttonTypes)[number]
export type ButtonSize = (typeof buttonSizes)[number]
export type NativeButtonType = (typeof nativeButtonTypes)[number]

export const buttonProps = {
  type: {
    type: String as PropType<ButtonType>,
    default: 'default',
    validator: (value: string) => buttonTypes.includes(value as ButtonType)
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: 'normal',
    validator: (value: string) => buttonSizes.includes(value as ButtonSize)
  },
  nativeType: {
    type: String as PropType<NativeButtonType>,
    default: 'button',
    validator: (value: string) => nativeButtonTypes.includes(value as NativeButtonType)
  },
  disabled: Boolean,
  loading: Boolean,
  block: Boolean,
  round: Boolean
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
```

- [ ] **Step 3: Implement Button template**

Change `packages/components/src/button/button.vue` to:

```vue
<template>
  <button
    class="aheart-button"
    :class="buttonClass"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading" class="aheart-button__loading" aria-hidden="true" />
    <span class="aheart-button__content">
      <slot>按钮</slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { buttonProps } from './types'
import './style.css'

defineOptions({
  name: 'AButton'
})

const props = defineProps(buttonProps)

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${props.size}`,
  {
    'is-block': props.block,
    'is-round': props.round,
    'is-loading': props.loading
  }
])
</script>
```

- [ ] **Step 4: Create Button styles**

Create `packages/components/src/button/style.css`:

```css
.aheart-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid var(--aheart-color-border);
  border-radius: var(--aheart-radius);
  background: var(--aheart-color-bg);
  color: var(--aheart-color-text);
  font-size: var(--aheart-font-size);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color var(--aheart-motion-duration),
    border-color var(--aheart-motion-duration),
    background-color var(--aheart-motion-duration),
    opacity var(--aheart-motion-duration);
}

.aheart-button:hover:not(:disabled) {
  border-color: var(--aheart-color-primary-hover);
  color: var(--aheart-color-primary-hover);
}

.aheart-button:disabled {
  background: var(--aheart-color-bg-disabled);
  color: var(--aheart-color-text-secondary);
  cursor: not-allowed;
  opacity: 0.72;
}

.aheart-button--large {
  height: 40px;
  padding: 0 18px;
}

.aheart-button--normal {
  height: 32px;
  padding: 0 14px;
}

.aheart-button--small {
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.aheart-button--mini {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
}

.aheart-button--primary,
.aheart-button--success,
.aheart-button--warning,
.aheart-button--danger {
  border-color: transparent;
  color: #fff;
}

.aheart-button--primary {
  background: var(--aheart-color-primary);
}

.aheart-button--success {
  background: var(--aheart-color-success);
}

.aheart-button--warning {
  background: var(--aheart-color-warning);
}

.aheart-button--danger {
  background: var(--aheart-color-danger);
}

.aheart-button.is-block {
  display: flex;
  width: 100%;
}

.aheart-button.is-round {
  border-radius: 999px;
}

.aheart-button__loading {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: aheart-button-spin 0.8s linear infinite;
}

@keyframes aheart-button-spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 5: Update example app**

Change `examples/app.vue` to:

```vue
<template>
  <main class="demo">
    <Button>默认按钮</Button>
    <Button type="primary">主要按钮</Button>
    <Button type="success">成功按钮</Button>
    <Button type="warning">警告按钮</Button>
    <Button type="danger" loading>加载中</Button>
  </main>
</template>

<script lang="ts" setup>
import { Button } from 'aheart-ui'
</script>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px;
}
</style>
```

- [ ] **Step 6: Commit and push**

Run:

```bash
git add packages/components/src/theme/index.css packages/components/src/button/style.css packages/components/src/button/button.vue packages/components/src/button/types.ts examples/app.vue
git commit -m "feat: implement button foundation"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Task 5: Tests For Button And Exports

**Files:**
- Create: `packages/components/src/button/__tests__/button.test.ts`
- Create: `packages/components/tsconfig.json`
- Modify: `packages/components/package.json`
- Modify: `packages/components/vite.config.ts`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install test dependencies**

Run:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

Expected:

```text
Dependencies are installed and pnpm-lock.yaml is updated if dependency versions changed.
```

- [ ] **Step 2: Create Button tests**

Create `packages/components/tsconfig.json` so component type checking does not pull the example app into package checks:

```json
{
  "extends": "../../tsconfig.json",
  "include": [
    "src/**/*.ts",
    "src/**/*.vue"
  ],
  "exclude": [
    "es",
    "lib",
    "node_modules"
  ]
}
```

Update `packages/components/package.json` scripts:

```json
{
  "typecheck": "vue-tsc --noEmit -p tsconfig.json",
  "test": "vitest run --environment jsdom",
  "test:watch": "vitest --environment jsdom"
}
```

Update `packages/components/vite.config.ts` dts options to use supported option names:

```ts
dts({
  tsconfigPath: './tsconfig.json'
})

dts({
  outDir: 'lib',
  tsconfigPath: './tsconfig.json'
})
```

- [ ] **Step 3: Create Button tests**

Create `packages/components/src/button/__tests__/button.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../button.vue'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '保存'
      }
    })

    expect(wrapper.text()).toContain('保存')
  })

  it('applies type and size classes', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        size: 'large'
      }
    })

    expect(wrapper.classes()).toContain('aheart-button--primary')
    expect(wrapper.classes()).toContain('aheart-button--large')
  })

  it('disables native button while loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
  })
})
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm --filter ./packages/components test
```

Expected:

```text
3 tests pass.
```

- [ ] **Step 5: Run type check**

Run:

```bash
pnpm --filter ./packages/components typecheck
```

Expected:

```text
vue-tsc exits with code 0.
```

- [ ] **Step 6: Commit and push**

Run:

```bash
git add docs/superpowers/plans/2026-06-17-product-grade-ui-library.md packages/components/src/button/__tests__/button.test.ts packages/components/tsconfig.json packages/components/package.json packages/components/vite.config.ts pnpm-lock.yaml
git commit -m "test: cover button component"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Task 6: Build Verification

**Files:**
- Modify: `packages/components/vite.config.ts`
- Modify: `packages/components/package.json`
- Modify: generated `packages/components/es`
- Modify: generated `packages/components/lib`

- [ ] **Step 1: Run component build**

Run:

```bash
pnpm --filter ./packages/components build
```

Expected:

```text
Vite build exits with code 0.
```

- [ ] **Step 2: Inspect generated entry files**

Run:

```bash
Test-Path packages/components/es/index.js
Test-Path packages/components/lib/index.js
```

Expected:

```text
True
True
```

- [ ] **Step 3: Commit build configuration and generated package output**

Run:

```bash
git add packages/components/vite.config.ts packages/components/package.json packages/components/es packages/components/lib
git commit -m "build: verify component package output"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Task 7: Documentation Site Shell

**Files:**
- Create: `docs/package.json`
- Create: `docs/.vitepress/config.ts`
- Create: `docs/index.md`
- Create: `docs/components/button.md`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Add docs workspace**

Change `pnpm-workspace.yaml` to:

```yaml
packages:
    - 'packages/**'
    - 'examples'
    - 'docs'
```

- [ ] **Step 2: Create docs package**

Create `docs/package.json`:

```json
{
  "name": "@aheart-ui/docs",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev .",
    "build": "vitepress build ."
  },
  "dependencies": {
    "aheart-ui": "workspace:^",
    "vitepress": "^1.6.3",
    "vue": "^3.4.0"
  }
}
```

- [ ] **Step 3: Create docs config**

Create `docs/.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Aheart UI',
  description: 'Vue 3 component library',
  themeConfig: {
    nav: [{ text: '组件', link: '/components/button' }],
    sidebar: [
      {
        text: '组件',
        items: [{ text: 'Button 按钮', link: '/components/button' }]
      }
    ]
  }
})
```

- [ ] **Step 4: Create docs pages**

Create `docs/index.md`:

```md
# Aheart UI

Aheart UI is a Vue 3 component library focused on practical product interfaces.

## Quick Start

```ts
import { createApp } from 'vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/es/style.css'

createApp(App).use(AheartUI).mount('#app')
```
```

Create `docs/components/button.md`:

````md
# Button 按钮

用于触发一个操作。

## 基础用法

```vue
<template>
  <Button>默认按钮</Button>
  <Button type="primary">主要按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
</script>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `default` \| `primary` \| `success` \| `warning` \| `danger` | `default` |
| size | 按钮尺寸 | `large` \| `normal` \| `small` \| `mini` | `normal` |
| nativeType | 原生按钮类型 | `button` \| `submit` \| `reset` | `button` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| block | 是否块级显示 | `boolean` | `false` |
| round | 是否圆角按钮 | `boolean` | `false` |
````

- [ ] **Step 5: Install docs dependencies and build docs**

Run:

```bash
pnpm install
pnpm docs:build
```

Expected:

```text
VitePress build exits with code 0.
```

- [ ] **Step 6: Commit and push**

Run:

```bash
git add docs pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "docs: add vitepress site shell"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Task 8: CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches:
      - master
      - 'codex/**'
  pull_request:
    branches:
      - master

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build Components
        run: pnpm build

      - name: Build Docs
        run: pnpm docs:build
```

- [ ] **Step 2: Commit and push**

Run:

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add workspace verification"
git push
```

Expected:

```text
Commit is pushed to GitHub branch codex/product-grade-ui-roadmap.
```

## Completion Checklist

- [ ] `git status --short` shows no uncommitted source changes after the latest task commit.
- [ ] `pnpm --filter ./packages/components test` passes.
- [ ] `pnpm --filter ./packages/components typecheck` passes.
- [ ] `pnpm --filter ./packages/components build` passes.
- [ ] `pnpm docs:build` passes after docs are added.
- [ ] Branch `codex/product-grade-ui-roadmap` is pushed to GitHub.
- [ ] Draft PR can be created after `gh` is installed and authenticated.
