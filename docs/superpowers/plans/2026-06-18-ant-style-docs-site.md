# Ant Style Docs Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Ant Design-inspired official documentation website for Aheart UI using the existing VitePress docs app and the current Aheart UI component package.

**Architecture:** Keep `docs` as the VitePress site and customize it with a small data model, custom theme CSS, and Markdown pages. Use `aheart-ui` through the existing workspace package, register it in the VitePress theme, and keep planned components clearly marked as roadmap items.

**Tech Stack:** Vue 3, VitePress, TypeScript, Aheart UI, pnpm workspace.

---

## File Structure

- Modify: `docs/.vitepress/config.ts` - site nav, sidebar, metadata, and source exclusions.
- Create: `docs/.vitepress/theme/index.ts` - VitePress default theme wrapper plus Aheart UI registration.
- Create: `docs/.vitepress/theme/style.css` - Ant Design-inspired documentation styling.
- Create: `docs/.vitepress/data/components.ts` - component category and status data.
- Modify: `docs/index.md` - official documentation homepage.
- Create: `docs/components/overview.md` - component category matrix.
- Modify: `docs/components/button.md` - upgraded Button documentation.
- Create: `docs/guide/introduction.md` - what Aheart UI is.
- Create: `docs/guide/installation.md` - install and import instructions.
- Create: `docs/guide/usage.md` - global and named import usage.
- Create: `docs/guide/theme.md` - current CSS token guide.

## Task 1: Configure VitePress Shell And Theme

**Files:**
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/style.css`

- [ ] **Step 1: Update VitePress config**

Replace `docs/.vitepress/config.ts` with:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Aheart UI',
  description: 'A Vue 3 component library for product interfaces',
  srcExclude: ['superpowers/**'],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1677ff' }],
    ['meta', { property: 'og:title', content: 'Aheart UI' }],
    ['meta', { property: 'og:description', content: 'A Vue 3 component library for product interfaces' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/overview' },
      { text: 'GitHub', link: 'https://github.com/wzfdhr/aheart-ui' },
      { text: 'v1.0.0', link: '/guide/installation' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '安装', link: '/guide/installation' },
            { text: '使用', link: '/guide/usage' },
            { text: '主题 Token', link: '/guide/theme' }
          ]
        }
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '组件总览', link: '/components/overview' },
            { text: 'Button 按钮', link: '/components/button' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wzfdhr/aheart-ui' }
    ],
    search: {
      provider: 'local'
    }
  }
})
```

- [ ] **Step 2: Add VitePress theme entry**

Create `docs/.vitepress/theme/index.ts`:

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AheartUI from 'aheart-ui'
import 'aheart-ui/es/style.css'
import './style.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(AheartUI)
  }
}

export default theme
```

- [ ] **Step 3: Add custom docs CSS**

Create `docs/.vitepress/theme/style.css`:

```css
:root {
  --vp-c-brand-1: #1677ff;
  --vp-c-brand-2: #4096ff;
  --vp-c-brand-3: #0958d9;
  --aheart-site-border: #e6e8ef;
  --aheart-site-muted: #667085;
  --aheart-site-soft: #f7f9fc;
}

.VPHome {
  padding-bottom: 48px;
}

.aheart-home {
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 24px 24px;
}

.aheart-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--aheart-site-border);
  background:
    linear-gradient(#eef3ff 1px, transparent 1px),
    linear-gradient(90deg, #eef3ff 1px, transparent 1px),
    #fff;
  background-size: 28px 28px;
}

.aheart-hero__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 72px 24px 44px;
}

.aheart-eyebrow {
  margin: 0 0 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.aheart-title {
  margin: 0;
  color: #101828;
  font-size: 56px;
  line-height: 1.05;
  font-weight: 760;
}

.aheart-subtitle {
  max-width: 680px;
  margin: 18px 0 0;
  color: var(--aheart-site-muted);
  font-size: 18px;
  line-height: 1.7;
}

.aheart-actions,
.aheart-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.aheart-actions {
  margin-top: 28px;
}

.aheart-command {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--aheart-site-border);
  border-radius: 8px;
  background: #fff;
  color: #344054;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

.aheart-preview {
  margin-top: 34px;
  padding: 18px;
  border: 1px solid var(--aheart-site-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.aheart-section {
  max-width: 1180px;
  margin: 0 auto;
  padding: 44px 24px 0;
}

.aheart-section h2 {
  margin: 0 0 12px;
  color: #101828;
  font-size: 28px;
  line-height: 1.25;
}

.aheart-section__intro {
  margin: 0 0 20px;
  color: var(--aheart-site-muted);
  line-height: 1.7;
}

.aheart-feature-grid,
.aheart-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.aheart-card,
.aheart-component-card {
  border: 1px solid var(--aheart-site-border);
  border-radius: 8px;
  background: #fff;
}

.aheart-card {
  padding: 18px;
}

.aheart-card h3,
.aheart-component-card h3 {
  margin: 0 0 8px;
  color: #101828;
  font-size: 16px;
}

.aheart-card p,
.aheart-component-card p {
  margin: 0;
  color: var(--aheart-site-muted);
  font-size: 14px;
  line-height: 1.65;
}

.aheart-component-card {
  padding: 16px;
}

.aheart-component-list {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.aheart-component-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid #eef0f5;
  border-radius: 8px;
  color: #344054;
  text-decoration: none;
}

.aheart-component-item:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

.aheart-status {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
}

.aheart-status--ready {
  background: #e6f4ff;
  color: #0958d9;
}

.aheart-status--planned {
  background: #f2f4f7;
  color: #667085;
}

.aheart-doc-callout {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #f8fbff;
  color: #344054;
}

.aheart-demo-panel {
  margin: 18px 0;
  padding: 18px;
  border: 1px solid var(--aheart-site-border);
  border-radius: 8px;
  background: #fff;
}

@media (max-width: 720px) {
  .aheart-title {
    font-size: 40px;
  }

  .aheart-hero__inner {
    padding-top: 48px;
  }
}
```

- [ ] **Step 4: Build docs**

Run:

```bash
pnpm docs:build
```

Expected:

```text
vitepress build completes successfully.
```

- [ ] **Step 5: Commit**

Run:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/theme/index.ts docs/.vitepress/theme/style.css
git commit -m "docs: configure ant style site shell"
```

Expected:

```text
Commit is created for the VitePress shell and theme.
```

## Task 2: Add Component Data And Overview Page

**Files:**
- Create: `docs/.vitepress/data/components.ts`
- Create: `docs/components/overview.md`

- [ ] **Step 1: Create component metadata**

Create `docs/.vitepress/data/components.ts`:

```ts
export type ComponentStatus = 'Ready' | 'Planned'

export interface ComponentMeta {
  name: string
  description: string
  status: ComponentStatus
  link?: string
}

export interface ComponentCategory {
  name: string
  description: string
  components: ComponentMeta[]
}

export const componentCategories: ComponentCategory[] = [
  {
    name: 'General',
    description: 'Basic building blocks used across product interfaces.',
    components: [
      { name: 'Button', description: 'Trigger an action.', status: 'Ready', link: '/components/button' },
      { name: 'Icon', description: 'Display semantic symbols.', status: 'Planned' },
      { name: 'Typography', description: 'Text, title, and link styles.', status: 'Planned' }
    ]
  },
  {
    name: 'Layout',
    description: 'Tools for spacing and page structure.',
    components: [
      { name: 'Space', description: 'Set consistent inline spacing.', status: 'Planned' },
      { name: 'Divider', description: 'Separate content groups.', status: 'Planned' },
      { name: 'Flex', description: 'Compose flexible layouts.', status: 'Planned' },
      { name: 'Grid', description: 'Build responsive grids.', status: 'Planned' }
    ]
  },
  {
    name: 'Navigation',
    description: 'Move between pages, views, and steps.',
    components: [
      { name: 'Tabs', description: 'Switch related panels.', status: 'Planned' },
      { name: 'Breadcrumb', description: 'Show page hierarchy.', status: 'Planned' },
      { name: 'Dropdown', description: 'Expose actions in a menu.', status: 'Planned' },
      { name: 'Menu', description: 'Navigate application sections.', status: 'Planned' },
      { name: 'Steps', description: 'Show workflow progress.', status: 'Planned' }
    ]
  },
  {
    name: 'Data Entry',
    description: 'Collect and validate user input.',
    components: [
      { name: 'Input', description: 'Enter single-line text.', status: 'Planned' },
      { name: 'Textarea', description: 'Enter multi-line text.', status: 'Planned' },
      { name: 'InputNumber', description: 'Enter numeric values.', status: 'Planned' },
      { name: 'Checkbox', description: 'Choose multiple options.', status: 'Planned' },
      { name: 'Radio', description: 'Choose one option.', status: 'Planned' },
      { name: 'Switch', description: 'Toggle a setting.', status: 'Planned' },
      { name: 'Select', description: 'Select from options.', status: 'Planned' },
      { name: 'Form', description: 'Manage form layout and validation.', status: 'Planned' }
    ]
  },
  {
    name: 'Data Display',
    description: 'Present structured information.',
    components: [
      { name: 'Tag', description: 'Label content with status.', status: 'Planned' },
      { name: 'Badge', description: 'Show counts and states.', status: 'Planned' },
      { name: 'Card', description: 'Group related content.', status: 'Planned' },
      { name: 'Empty', description: 'Show empty states.', status: 'Planned' },
      { name: 'Descriptions', description: 'Display record details.', status: 'Planned' },
      { name: 'Table', description: 'Display tabular data.', status: 'Planned' },
      { name: 'Pagination', description: 'Navigate paged data.', status: 'Planned' }
    ]
  },
  {
    name: 'Feedback',
    description: 'Communicate system state and user feedback.',
    components: [
      { name: 'Alert', description: 'Show contextual information.', status: 'Planned' },
      { name: 'Message', description: 'Show global lightweight feedback.', status: 'Planned' },
      { name: 'Modal', description: 'Focus attention in a dialog.', status: 'Planned' },
      { name: 'Drawer', description: 'Show a side panel.', status: 'Planned' },
      { name: 'Tooltip', description: 'Explain compact controls.', status: 'Planned' },
      { name: 'Popover', description: 'Show floating content.', status: 'Planned' },
      { name: 'Popconfirm', description: 'Confirm risky actions.', status: 'Planned' },
      { name: 'Spin', description: 'Show loading state.', status: 'Planned' },
      { name: 'Skeleton', description: 'Reserve loading layout.', status: 'Planned' }
    ]
  }
]
```

- [ ] **Step 2: Create component overview page**

Create `docs/components/overview.md`:

```md
---
outline: false
---

<script setup lang="ts">
import { componentCategories } from '../.vitepress/data/components'
</script>

# 组件总览

Aheart UI follows a practical component roadmap. Components marked `Ready` are available in the current package. Components marked `Planned` are part of the product direction and will be implemented gradually.

<div class="aheart-section" style="padding: 18px 0 0">
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.name" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components"
          :key="component.name"
          class="aheart-component-item"
          :href="component.link || '#'"
          :aria-disabled="!component.link"
        >
          <span>
            <strong>{{ component.name }}</strong>
            <small style="display:block;color:#667085">{{ component.description }}</small>
          </span>
          <span
            class="aheart-status"
            :class="component.status === 'Ready' ? 'aheart-status--ready' : 'aheart-status--planned'"
          >
            {{ component.status }}
          </span>
        </a>
      </div>
    </section>
  </div>
</div>
```

- [ ] **Step 3: Build docs**

Run:

```bash
pnpm docs:build
```

Expected:

```text
vitepress build completes successfully and renders /components/overview.
```

- [ ] **Step 4: Commit**

Run:

```bash
git add docs/.vitepress/data/components.ts docs/components/overview.md
git commit -m "docs: add component overview matrix"
```

Expected:

```text
Commit is created for the component data and overview page.
```

## Task 3: Build The Official Homepage

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: Replace homepage content**

Replace `docs/index.md` with:

```md
---
layout: home
outline: false
---

<script setup lang="ts">
import { componentCategories } from './.vitepress/data/components'

const readyCount = componentCategories
  .flatMap((category) => category.components)
  .filter((component) => component.status === 'Ready').length

const plannedCount = componentCategories
  .flatMap((category) => category.components)
  .filter((component) => component.status === 'Planned').length
</script>

<section class="aheart-hero">
  <div class="aheart-hero__inner">
    <p class="aheart-eyebrow">Vue 3 Component Library</p>
    <h1 class="aheart-title">Aheart UI</h1>
    <p class="aheart-subtitle">
      Aheart UI is a Vue 3 component library for calm, consistent product interfaces. It starts with a tested Button foundation, theme tokens, plugin installation, and a clear component roadmap.
    </p>
    <div class="aheart-actions">
      <AButton type="primary" size="large" onclick="location.href='/guide/installation'">开始使用</AButton>
      <AButton size="large" onclick="location.href='/components/overview'">组件总览</AButton>
      <code class="aheart-command">pnpm add aheart-ui</code>
    </div>
    <div class="aheart-preview" aria-label="Aheart UI preview">
      <div class="aheart-demo-row">
        <AButton>Default</AButton>
        <AButton type="primary">Primary</AButton>
        <AButton type="success">Success</AButton>
        <AButton type="danger" loading>Loading</AButton>
      </div>
    </div>
  </div>
</section>

<section class="aheart-section">
  <h2>为产品界面而生</h2>
  <p class="aheart-section__intro">
    文档结构参考成熟组件库的信息组织方式，同时保持 Aheart UI 当前能力边界清晰可见。
  </p>
  <div class="aheart-feature-grid">
    <article class="aheart-card">
      <h3>Vue 3 + TypeScript</h3>
      <p>组件源码、props 类型和构建产物都围绕 Vue 3 与 TypeScript 组织。</p>
    </article>
    <article class="aheart-card">
      <h3>Theme Tokens</h3>
      <p>使用 CSS Variables 管理颜色、字号、圆角和动效时长。</p>
    </article>
    <article class="aheart-card">
      <h3>Plugin Install</h3>
      <p>支持全量安装、命名导入和单组件注册的基础模式。</p>
    </article>
    <article class="aheart-card">
      <h3>Verified Foundation</h3>
      <p>Button 已接入样式、状态、测试、类型检查和构建验证。</p>
    </article>
  </div>
</section>

<section class="aheart-section">
  <h2>组件路线图</h2>
  <p class="aheart-section__intro">
    当前有 {{ readyCount }} 个 Ready 组件，{{ plannedCount }} 个 Planned 组件。Planned 表示路线图方向，不代表当前已经发布。
  </p>
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.name" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components.slice(0, 4)"
          :key="component.name"
          class="aheart-component-item"
          :href="component.link || '/components/overview'"
        >
          <span>{{ component.name }}</span>
          <span
            class="aheart-status"
            :class="component.status === 'Ready' ? 'aheart-status--ready' : 'aheart-status--planned'"
          >
            {{ component.status }}
          </span>
        </a>
      </div>
    </section>
  </div>
</section>
```

- [ ] **Step 2: Build docs**

Run:

```bash
pnpm docs:build
```

Expected:

```text
vitepress build completes successfully and renders the custom homepage.
```

- [ ] **Step 3: Commit**

Run:

```bash
git add docs/index.md
git commit -m "docs: build official homepage"
```

Expected:

```text
Commit is created for the homepage.
```

## Task 4: Add Guide Pages

**Files:**
- Create: `docs/guide/introduction.md`
- Create: `docs/guide/installation.md`
- Create: `docs/guide/usage.md`
- Create: `docs/guide/theme.md`

- [ ] **Step 1: Create introduction guide**

Create `docs/guide/introduction.md`:

```md
# 介绍

Aheart UI is a Vue 3 component library for product interfaces.

The current package focuses on a stable foundation:

- Vue 3 and TypeScript source.
- CSS variable theme tokens.
- Global plugin installation.
- Named component imports.
- A tested Button component.
- ES Module and CommonJS build outputs.

The roadmap follows practical product UI categories such as General, Layout, Navigation, Data Entry, Data Display, and Feedback.
```

- [ ] **Step 2: Create installation guide**

Create `docs/guide/installation.md`:

````md
# 安装

Use pnpm, npm, or yarn to install Aheart UI.

```bash
pnpm add aheart-ui
```

```bash
npm install aheart-ui
```

```bash
yarn add aheart-ui
```

Aheart UI requires Vue 3:

```bash
pnpm add vue
```
````

- [ ] **Step 3: Create usage guide**

Create `docs/guide/usage.md`:

````md
# 使用

## 全量安装

```ts
import { createApp } from 'vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/es/style.css'
import App from './App.vue'

createApp(App).use(AheartUI).mount('#app')
```

## 命名导入

```vue
<template>
  <Button type="primary">保存</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## 单组件注册

```ts
import { createApp } from 'vue'
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
import App from './App.vue'

createApp(App).use(Button).mount('#app')
```
````

- [ ] **Step 4: Create theme guide**

Create `docs/guide/theme.md`:

````md
# 主题 Token

Aheart UI uses CSS variables for its current theme layer.

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

Override variables in your app after importing Aheart UI styles:

```css
:root {
  --aheart-color-primary: #0958d9;
  --aheart-radius: 4px;
}
```
````

- [ ] **Step 5: Build docs**

Run:

```bash
pnpm docs:build
```

Expected:

```text
vitepress build completes successfully and guide pages are included.
```

- [ ] **Step 6: Commit**

Run:

```bash
git add docs/guide/introduction.md docs/guide/installation.md docs/guide/usage.md docs/guide/theme.md
git commit -m "docs: add getting started guides"
```

Expected:

```text
Commit is created for the guide pages.
```

## Task 5: Upgrade Button Documentation

**Files:**
- Modify: `docs/components/button.md`

- [ ] **Step 1: Replace Button documentation**

Replace `docs/components/button.md` with:

````md
# Button 按钮 <span class="aheart-status aheart-status--ready">Ready</span>

Button is used to trigger an action. It supports visual type, size, loading, disabled, block, round, and native button type.

## 基础用法

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton>默认按钮</AButton>
    <AButton type="primary">主要按钮</AButton>
    <AButton type="success">成功按钮</AButton>
    <AButton type="warning">警告按钮</AButton>
    <AButton type="danger">危险按钮</AButton>
  </div>
</div>

```vue
<template>
  <Button>默认按钮</Button>
  <Button type="primary">主要按钮</Button>
  <Button type="success">成功按钮</Button>
  <Button type="warning">警告按钮</Button>
  <Button type="danger">危险按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## 尺寸

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton size="large">Large</AButton>
    <AButton>Normal</AButton>
    <AButton size="small">Small</AButton>
    <AButton size="mini">Mini</AButton>
  </div>
</div>

```vue
<template>
  <Button size="large">Large</Button>
  <Button>Normal</Button>
  <Button size="small">Small</Button>
  <Button size="mini">Mini</Button>
</template>
```

## 状态

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton disabled>Disabled</AButton>
    <AButton type="primary" loading>Loading</AButton>
    <AButton round>Round</AButton>
  </div>
</div>

```vue
<template>
  <Button disabled>Disabled</Button>
  <Button type="primary" loading>Loading</Button>
  <Button round>Round</Button>
</template>
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

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |

## Theme Tokens

Button uses the global Aheart UI CSS variables, including:

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-radius`
- `--aheart-motion-duration`
````

- [ ] **Step 2: Build docs**

Run:

```bash
pnpm docs:build
```

Expected:

```text
vitepress build completes successfully and Button live examples render.
```

- [ ] **Step 3: Commit**

Run:

```bash
git add docs/components/button.md
git commit -m "docs: upgrade button documentation"
```

Expected:

```text
Commit is created for the Button documentation.
```

## Task 6: Final Verification And Push

**Files:**
- Verify all docs and package files changed in previous tasks.

- [ ] **Step 1: Run full verification**

Run:

```bash
pnpm docs:build
pnpm typecheck
pnpm test
pnpm build
```

Expected:

```text
All commands exit with code 0.
```

- [ ] **Step 2: Confirm internal plan pages are excluded**

Run:

```powershell
Test-Path docs/.vitepress/dist/superpowers
```

Expected:

```text
False
```

- [ ] **Step 3: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected:

```text
On branch codex/ant-style-docs-site with no unstaged source changes except ignored build output.
```

- [ ] **Step 4: Push branch**

Run:

```bash
git push -u origin codex/ant-style-docs-site
```

Expected:

```text
Branch codex/ant-style-docs-site is pushed to GitHub.
```

## Self-Review Notes

- The plan covers every page and file named in the approved design spec.
- The component status model uses exactly `Ready` and `Planned`.
- The plan does not create fake docs for planned components.
- The plan keeps `docs/superpowers/**` excluded from the published VitePress site.
- Server deployment is excluded because server host, user, auth method, target directory, and web server type have not been provided.
