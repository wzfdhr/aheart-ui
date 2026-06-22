# Phase 1 I18n and Ready Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Aheart UI default to Chinese documentation, add an English `/en/` mirror, and promote `Icon`, `Space`, `Divider`, `Tag`, and `Alert` to fully ready components.

**Architecture:** Keep VitePress as the documentation engine and use locale config for Chinese root plus English `/en/`. Keep component status data in one language-aware metadata module. Add each new component as an isolated folder under `packages/components/src`, following the current `Button` and `withInstall` pattern.

**Tech Stack:** Vue 3, TypeScript, Vite, VitePress, Vitest, Vue Test Utils, CSS variables, pnpm workspace.

---

## File Structure

- `docs/.vitepress/config.ts`: VitePress locale, nav, sidebar, and search configuration.
- `docs/.vitepress/data/components.ts`: Shared component categories, localized labels, status, and localized links.
- `docs/index.md`: Chinese homepage that reads Chinese metadata.
- `docs/en/index.md`: English homepage that reads English metadata.
- `docs/components/*.md`: Chinese component pages.
- `docs/en/components/*.md`: English component pages.
- `docs/guide/*.md`: Chinese guide pages.
- `docs/en/guide/*.md`: English guide pages.
- `packages/components/src/index.ts`: Root package export and plugin installer list.
- `packages/components/src/icon/*`: `Icon` source, types, style, tests, installer entry.
- `packages/components/src/space/*`: `Space` source, types, style, tests, installer entry.
- `packages/components/src/divider/*`: `Divider` source, types, style, tests, installer entry.
- `packages/components/src/tag/*`: `Tag` source, types, style, tests, installer entry.
- `packages/components/src/alert/*`: `Alert` source, types, style, tests, installer entry.
- `packages/components/es/**` and `packages/components/lib/**`: Generated build output after `pnpm build`.

## Guardrails

- Do not mark a component as `Ready` until its source, type exports, test, docs, and root export are present.
- Do not add third-party icon packages in Phase 1. Use a small internal SVG path map for `Icon`.
- Do not edit `docs/.vitepress/cache/`.
- Do not manually edit generated `es` or `lib` files. Refresh them only by running `pnpm build`.
- Keep commits small and in the task order below.

---

### Task 1: Documentation I18n Foundation

**Files:**
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/index.md`
- Modify: `docs/components/overview.md`
- Modify: `docs/components/button.md`
- Modify: `docs/guide/introduction.md`
- Modify: `docs/guide/installation.md`
- Modify: `docs/guide/usage.md`
- Modify: `docs/guide/theme.md`
- Create: `docs/en/index.md`
- Create: `docs/en/components/overview.md`
- Create: `docs/en/components/button.md`
- Create: `docs/en/guide/introduction.md`
- Create: `docs/en/guide/installation.md`
- Create: `docs/en/guide/usage.md`
- Create: `docs/en/guide/theme.md`

- [ ] **Step 1: Replace the VitePress config with locale-aware navigation**

Replace `docs/.vitepress/config.ts` with:

```ts
import { defineConfig } from 'vitepress'

const githubLink = 'https://github.com/wzfdhr/aheart-ui'

export default defineConfig({
  title: 'Aheart UI',
  description: '面向产品界面的 Vue 3 组件库',
  srcExclude: ['superpowers/**'],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1677ff' }],
    ['meta', { property: 'og:title', content: 'Aheart UI' }],
    ['meta', { property: 'og:description', content: '面向产品界面的 Vue 3 组件库' }]
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Aheart UI',
      description: '面向产品界面的 Vue 3 组件库',
      themeConfig: {
        logo: '/logo.svg',
        nav: [
          { text: '指南', link: '/guide/introduction' },
          { text: '组件', link: '/components/overview' },
          { text: 'English', link: '/en/' },
          { text: 'GitHub', link: githubLink },
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
        socialLinks: [{ icon: 'github', link: githubLink }],
        search: { provider: 'local' }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Aheart UI',
      description: 'A Vue 3 component library for product interfaces',
      themeConfig: {
        logo: '/logo.svg',
        nav: [
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'Components', link: '/en/components/overview' },
          { text: '简体中文', link: '/' },
          { text: 'GitHub', link: githubLink },
          { text: 'v1.0.0', link: '/en/guide/installation' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Introduction', link: '/en/guide/introduction' },
                { text: 'Installation', link: '/en/guide/installation' },
                { text: 'Usage', link: '/en/guide/usage' },
                { text: 'Theme Tokens', link: '/en/guide/theme' }
              ]
            }
          ],
          '/en/components/': [
            {
              text: 'Components',
              items: [
                { text: 'Overview', link: '/en/components/overview' },
                { text: 'Button', link: '/en/components/button' }
              ]
            }
          ]
        },
        socialLinks: [{ icon: 'github', link: githubLink }],
        search: { provider: 'local' }
      }
    }
  }
})
```

- [ ] **Step 2: Replace the component metadata module**

Replace `docs/.vitepress/data/components.ts` with:

```ts
export type Locale = 'zh' | 'en'
export type ComponentStatus = 'Ready' | 'Planned'

export interface ComponentMetaSource {
  key: string
  name: string
  zhName?: string
  description: Record<Locale, string>
  status: ComponentStatus
  link?: Record<Locale, string>
}

export interface ComponentCategorySource {
  key: string
  name: Record<Locale, string>
  description: Record<Locale, string>
  components: ComponentMetaSource[]
}

export interface ComponentMeta {
  key: string
  name: string
  zhName?: string
  description: string
  status: ComponentStatus
  link?: string
}

export interface ComponentCategory {
  key: string
  name: string
  description: string
  components: ComponentMeta[]
}

export const statusText: Record<Locale, Record<ComponentStatus, string>> = {
  zh: {
    Ready: '已完成',
    Planned: '规划中'
  },
  en: {
    Ready: 'Ready',
    Planned: 'Planned'
  }
}

const componentCategorySources: ComponentCategorySource[] = [
  {
    key: 'general',
    name: { zh: '通用', en: 'General' },
    description: {
      zh: '产品界面里的基础构件。',
      en: 'Basic building blocks used across product interfaces.'
    },
    components: [
      {
        key: 'button',
        name: 'Button',
        zhName: '按钮',
        description: { zh: '触发操作。', en: 'Trigger an action.' },
        status: 'Ready',
        link: { zh: '/components/button', en: '/en/components/button' }
      },
      {
        key: 'icon',
        name: 'Icon',
        zhName: '图标',
        description: { zh: '展示语义化符号。', en: 'Display semantic symbols.' },
        status: 'Planned'
      },
      {
        key: 'typography',
        name: 'Typography',
        zhName: '排版',
        description: { zh: '文本、标题和链接样式。', en: 'Text, title, and link styles.' },
        status: 'Planned'
      }
    ]
  },
  {
    key: 'layout',
    name: { zh: '布局', en: 'Layout' },
    description: {
      zh: '控制间距和页面结构。',
      en: 'Tools for spacing and page structure.'
    },
    components: [
      {
        key: 'space',
        name: 'Space',
        zhName: '间距',
        description: { zh: '设置稳定的元素间距。', en: 'Set consistent inline spacing.' },
        status: 'Planned'
      },
      {
        key: 'divider',
        name: 'Divider',
        zhName: '分割线',
        description: { zh: '分隔内容区域。', en: 'Separate content groups.' },
        status: 'Planned'
      },
      {
        key: 'flex',
        name: 'Flex',
        zhName: '弹性布局',
        description: { zh: '组合弹性布局。', en: 'Compose flexible layouts.' },
        status: 'Planned'
      },
      {
        key: 'grid',
        name: 'Grid',
        zhName: '栅格',
        description: { zh: '构建响应式栅格。', en: 'Build responsive grids.' },
        status: 'Planned'
      }
    ]
  },
  {
    key: 'navigation',
    name: { zh: '导航', en: 'Navigation' },
    description: {
      zh: '在页面、视图和步骤之间移动。',
      en: 'Move between pages, views, and steps.'
    },
    components: [
      { key: 'tabs', name: 'Tabs', zhName: '标签页', description: { zh: '切换关联面板。', en: 'Switch related panels.' }, status: 'Planned' },
      { key: 'breadcrumb', name: 'Breadcrumb', zhName: '面包屑', description: { zh: '展示页面层级。', en: 'Show page hierarchy.' }, status: 'Planned' },
      { key: 'dropdown', name: 'Dropdown', zhName: '下拉菜单', description: { zh: '承载折叠操作。', en: 'Expose actions in a menu.' }, status: 'Planned' },
      { key: 'menu', name: 'Menu', zhName: '菜单', description: { zh: '导航应用模块。', en: 'Navigate application sections.' }, status: 'Planned' },
      { key: 'steps', name: 'Steps', zhName: '步骤条', description: { zh: '展示流程进度。', en: 'Show workflow progress.' }, status: 'Planned' }
    ]
  },
  {
    key: 'data-entry',
    name: { zh: '数据录入', en: 'Data Entry' },
    description: {
      zh: '收集和校验用户输入。',
      en: 'Collect and validate user input.'
    },
    components: [
      { key: 'input', name: 'Input', zhName: '输入框', description: { zh: '输入单行文本。', en: 'Enter single-line text.' }, status: 'Planned' },
      { key: 'textarea', name: 'Textarea', zhName: '文本域', description: { zh: '输入多行文本。', en: 'Enter multi-line text.' }, status: 'Planned' },
      { key: 'input-number', name: 'InputNumber', zhName: '数字输入框', description: { zh: '输入数字。', en: 'Enter numeric values.' }, status: 'Planned' },
      { key: 'checkbox', name: 'Checkbox', zhName: '多选框', description: { zh: '选择多个选项。', en: 'Choose multiple options.' }, status: 'Planned' },
      { key: 'radio', name: 'Radio', zhName: '单选框', description: { zh: '选择一个选项。', en: 'Choose one option.' }, status: 'Planned' },
      { key: 'switch', name: 'Switch', zhName: '开关', description: { zh: '切换设置。', en: 'Toggle a setting.' }, status: 'Planned' },
      { key: 'select', name: 'Select', zhName: '选择器', description: { zh: '从选项中选择。', en: 'Select from options.' }, status: 'Planned' },
      { key: 'form', name: 'Form', zhName: '表单', description: { zh: '管理表单布局与校验。', en: 'Manage form layout and validation.' }, status: 'Planned' }
    ]
  },
  {
    key: 'data-display',
    name: { zh: '数据展示', en: 'Data Display' },
    description: {
      zh: '展示结构化信息。',
      en: 'Present structured information.'
    },
    components: [
      {
        key: 'tag',
        name: 'Tag',
        zhName: '标签',
        description: { zh: '标记内容状态。', en: 'Label content with status.' },
        status: 'Planned'
      },
      { key: 'badge', name: 'Badge', zhName: '徽标', description: { zh: '展示计数和状态。', en: 'Show counts and states.' }, status: 'Planned' },
      { key: 'card', name: 'Card', zhName: '卡片', description: { zh: '组合相关内容。', en: 'Group related content.' }, status: 'Planned' },
      { key: 'empty', name: 'Empty', zhName: '空状态', description: { zh: '展示空内容。', en: 'Show empty states.' }, status: 'Planned' },
      { key: 'descriptions', name: 'Descriptions', zhName: '描述列表', description: { zh: '展示记录详情。', en: 'Display record details.' }, status: 'Planned' },
      { key: 'table', name: 'Table', zhName: '表格', description: { zh: '展示表格数据。', en: 'Display tabular data.' }, status: 'Planned' },
      { key: 'pagination', name: 'Pagination', zhName: '分页', description: { zh: '切换分页数据。', en: 'Navigate paged data.' }, status: 'Planned' }
    ]
  },
  {
    key: 'feedback',
    name: { zh: '反馈', en: 'Feedback' },
    description: {
      zh: '传达系统状态和操作反馈。',
      en: 'Communicate system state and user feedback.'
    },
    components: [
      {
        key: 'alert',
        name: 'Alert',
        zhName: '警告提示',
        description: { zh: '展示上下文提示。', en: 'Show contextual information.' },
        status: 'Planned'
      },
      { key: 'message', name: 'Message', zhName: '全局提示', description: { zh: '展示轻量全局反馈。', en: 'Show global lightweight feedback.' }, status: 'Planned' },
      { key: 'modal', name: 'Modal', zhName: '对话框', description: { zh: '聚焦一个对话任务。', en: 'Focus attention in a dialog.' }, status: 'Planned' },
      { key: 'drawer', name: 'Drawer', zhName: '抽屉', description: { zh: '展示侧边面板。', en: 'Show a side panel.' }, status: 'Planned' },
      { key: 'tooltip', name: 'Tooltip', zhName: '文字提示', description: { zh: '解释紧凑控件。', en: 'Explain compact controls.' }, status: 'Planned' },
      { key: 'popover', name: 'Popover', zhName: '气泡卡片', description: { zh: '展示浮层内容。', en: 'Show floating content.' }, status: 'Planned' },
      { key: 'popconfirm', name: 'Popconfirm', zhName: '气泡确认框', description: { zh: '确认有风险的操作。', en: 'Confirm risky actions.' }, status: 'Planned' },
      { key: 'spin', name: 'Spin', zhName: '加载中', description: { zh: '展示加载状态。', en: 'Show loading state.' }, status: 'Planned' },
      { key: 'skeleton', name: 'Skeleton', zhName: '骨架屏', description: { zh: '预留加载布局。', en: 'Reserve loading layout.' }, status: 'Planned' }
    ]
  }
]

export const getComponentCategories = (locale: Locale): ComponentCategory[] =>
  componentCategorySources.map((category) => ({
    key: category.key,
    name: category.name[locale],
    description: category.description[locale],
    components: category.components.map((component) => ({
      key: component.key,
      name: component.name,
      zhName: component.zhName,
      description: component.description[locale],
      status: component.status,
      link: component.link?.[locale]
    }))
  }))

export const componentCategories = getComponentCategories('en')
```

- [ ] **Step 3: Replace Chinese homepage and overview content**

Use `getComponentCategories('zh')` in `docs/index.md` and `docs/components/overview.md`. The homepage hero actions must link to `/guide/installation` and `/components/overview`. The overview page must display `statusText.zh[component.status]`.

For `docs/index.md`, keep the current section classes and replace visible copy with Chinese:

```md
---
layout: home
outline: false
---

<script setup lang="ts">
import { getComponentCategories, statusText } from './.vitepress/data/components'

const componentCategories = getComponentCategories('zh')
const readyCount = componentCategories.flatMap((category) => category.components).filter((component) => component.status === 'Ready').length
const plannedCount = componentCategories.flatMap((category) => category.components).filter((component) => component.status === 'Planned').length
</script>

<section class="aheart-hero">
  <div class="aheart-hero__inner">
    <p class="aheart-eyebrow">Vue 3 组件库</p>
    <h1 class="aheart-title">Aheart UI</h1>
    <p class="aheart-subtitle">
      Aheart UI 是面向产品界面的 Vue 3 组件库，提供稳定的 TypeScript 类型、主题 Token、插件安装方式和逐步扩展的组件路线。
    </p>
    <div class="aheart-actions">
      <a class="aheart-action-link" href="/guide/installation">
        <AButton type="primary" size="large">开始使用</AButton>
      </a>
      <a class="aheart-action-link" href="/components/overview">
        <AButton size="large">组件总览</AButton>
      </a>
      <code class="aheart-command">pnpm add aheart-ui</code>
    </div>
  </div>
</section>

<section class="aheart-section">
  <h2>为产品界面而生</h2>
  <p class="aheart-section__intro">
    文档结构参考成熟组件库的信息组织方式，同时保持 Aheart UI 当前能力边界清晰可见。
  </p>
  <div class="aheart-feature-grid">
    <article class="aheart-card"><h3>Vue 3 + TypeScript</h3><p>组件源码、props 类型和构建产物都围绕 Vue 3 与 TypeScript 组织。</p></article>
    <article class="aheart-card"><h3>主题 Token</h3><p>使用 CSS Variables 管理颜色、字号、圆角和动效时长。</p></article>
    <article class="aheart-card"><h3>插件安装</h3><p>支持全量安装、命名导入和单组件注册的基础模式。</p></article>
    <article class="aheart-card"><h3>渐进路线</h3><p>只有完成源码、测试、文档和导出的组件才会标记为已完成。</p></article>
  </div>
</section>

<section class="aheart-section">
  <h2>组件路线图</h2>
  <p class="aheart-section__intro">
    当前有 {{ readyCount }} 个已完成组件，{{ plannedCount }} 个规划中组件。规划中表示路线方向，不代表当前已经发布。
  </p>
  <div class="aheart-category-grid">
    <section v-for="category in componentCategories" :key="category.key" class="aheart-component-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
      <div class="aheart-component-list">
        <a
          v-for="component in category.components.slice(0, 4)"
          :key="component.key"
          class="aheart-component-item"
          :href="component.link || '/components/overview'"
        >
          <span>{{ component.name }} <small v-if="component.zhName">{{ component.zhName }}</small></span>
          <span class="aheart-status" :class="component.status === 'Ready' ? 'aheart-status--ready' : 'aheart-status--planned'">
            {{ statusText.zh[component.status] }}
          </span>
        </a>
      </div>
    </section>
  </div>
</section>
```

- [ ] **Step 4: Replace the Chinese guide pages and Button page**

Use clear Chinese copy in:

```md
# 介绍

Aheart UI 是面向产品界面的 Vue 3 组件库。

当前版本聚焦稳定基础：

- Vue 3 与 TypeScript 源码。
- CSS 变量主题 Token。
- 全量插件安装。
- 命名组件导入。
- 可测试、可构建、可文档化的组件交付标准。

路线图参考 Ant Design 的信息架构，但每个组件只有完成源码、测试、导出和文档后才会标记为已完成。
```

Use equivalent Chinese content for installation, usage, theme, overview, and Button docs. Keep code examples importing `Button` from `aheart-ui`.

- [ ] **Step 5: Add English mirror pages**

Create English pages under `docs/en/` using `getComponentCategories('en')`, English nav links, and the same examples. `docs/en/index.md` should link to `/en/guide/installation` and `/en/components/overview`.

- [ ] **Step 6: Run docs build**

Run:

```bash
pnpm docs:build
```

Expected: PASS with VitePress build completing and no broken import from `.vitepress/data/components`.

- [ ] **Step 7: Commit documentation i18n foundation**

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/index.md docs/components/overview.md docs/components/button.md docs/guide docs/en
git commit -m "docs: add chinese default and english locale"
```

---

### Task 2: Icon Component

**Files:**
- Create: `packages/components/src/icon/types.ts`
- Create: `packages/components/src/icon/icon.vue`
- Create: `packages/components/src/icon/style.css`
- Create: `packages/components/src/icon/index.ts`
- Create: `packages/components/src/icon/__tests__/icon.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/icon.md`
- Create: `docs/en/components/icon.md`
- Modify: `docs/.vitepress/config.ts`

- [ ] **Step 1: Write the failing Icon test**

Create `packages/components/src/icon/__tests__/icon.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from '../icon.vue'

describe('Icon', () => {
  it('renders the selected svg path', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'check'
      }
    })

    expect(wrapper.find('svg.aheart-icon').exists()).toBe(true)
    expect(wrapper.findAll('path').length).toBeGreaterThan(0)
  })

  it('normalizes numeric size to pixels', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'search',
        size: 20,
        color: '#ff4d4f'
      }
    })

    expect(wrapper.attributes('style')).toContain('width: 20px')
    expect(wrapper.attributes('style')).toContain('height: 20px')
    expect(wrapper.attributes('style')).toContain('color: #ff4d4f')
  })

  it('spins loading icons', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'loading'
      }
    })

    expect(wrapper.classes()).toContain('is-spin')
  })
})
```

- [ ] **Step 2: Run the Icon test and confirm failure**

Run:

```bash
pnpm --filter ./packages/components test -- src/icon/__tests__/icon.test.ts
```

Expected: FAIL because `../icon.vue` does not exist.

- [ ] **Step 3: Add Icon types**

Create `packages/components/src/icon/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const iconNames = ['check', 'close', 'info', 'warning', 'success', 'error', 'loading', 'search', 'heart'] as const

export type IconName = (typeof iconNames)[number]

export const iconProps = {
  name: {
    type: String as PropType<IconName>,
    required: true,
    validator: (value: string) => iconNames.includes(value as IconName)
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: '1em'
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  spin: Boolean
} as const

export type IconProps = ExtractPropTypes<typeof iconProps>
```

- [ ] **Step 4: Add Icon component and styles**

Create `packages/components/src/icon/icon.vue`:

```vue
<template>
  <svg
    class="aheart-icon"
    :class="{ 'is-spin': spin || name === 'loading' }"
    :style="iconStyle"
    viewBox="0 0 1024 1024"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in paths" :key="index" :d="path" fill="currentColor" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { iconProps, type IconName } from './types'
import './style.css'

defineOptions({
  name: 'AIcon'
})

const props = defineProps(iconProps)

const iconPaths: Record<IconName, string[]> = {
  check: ['M382 704 184 506l56-56 142 142 402-402 56 56-458 458Z'],
  close: ['M274 218 512 456 750 218l56 56L568 512l238 238-56 56L512 568 274 806l-56-56 238-238L218 274l56-56Z'],
  info: ['M472 448h80v320h-80V448Zm0-192h80v96h-80v-96Z', 'M512 96a416 416 0 1 0 0 832 416 416 0 0 0 0-832Zm0 752a336 336 0 1 1 0-672 336 336 0 0 1 0 672Z'],
  warning: ['M512 144 64 864h896L512 144Zm0 154 306 492H206l306-492Zm-40 178h80v176h-80V476Zm0 240h80v80h-80v-80Z'],
  success: ['M512 96a416 416 0 1 0 0 832 416 416 0 0 0 0-832Zm-48 584L280 496l56-56 128 128 248-248 56 56-304 304Z'],
  error: ['M512 96a416 416 0 1 0 0 832 416 416 0 0 0 0-832Zm160 520-56 56-104-104-104 104-56-56 104-104-104-104 56-56 104 104 104-104 56 56-104 104 104 104Z'],
  loading: ['M512 96a416 416 0 0 1 416 416h-80a336 336 0 0 0-336-336V96Z'],
  search: ['M448 128a320 320 0 0 1 253 516l165 165-57 57-165-165A320 320 0 1 1 448 128Zm0 80a240 240 0 1 0 0 480 240 240 0 0 0 0-480Z'],
  heart: ['M512 864 180 558C48 436 52 240 188 158c92-56 210-36 282 44l42 46 42-46c72-80 190-100 282-44 136 82 140 278 8 400L512 864Z']
}

const normalizedSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const paths = computed(() => iconPaths[props.name])
const iconStyle = computed(() => ({
  width: normalizedSize.value,
  height: normalizedSize.value,
  color: props.color
}))
</script>
```

Create `packages/components/src/icon/style.css`:

```css
.aheart-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: -0.125em;
  line-height: 1;
}

.aheart-icon.is-spin {
  animation: aheart-icon-spin 1s linear infinite;
}

@keyframes aheart-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 5: Add installer entry and root export**

Create `packages/components/src/icon/index.ts`:

```ts
import icon from './icon.vue'
import { withInstall } from '../utils/install'

const Icon = withInstall(icon, 'AIcon')

export * from './types'
export default Icon
```

Update `packages/components/src/index.ts`:

```ts
import type { App, Plugin } from 'vue'
import Alert from './alert'
import Button from './button'
import Divider from './divider'
import Icon from './icon'
import Space from './space'
import Tag from './tag'
import './theme/index.css'

const components = [Button, Icon, Space, Divider, Tag, Alert]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Alert, Button, Divider, Icon, Space, Tag }
export default AheartUI
```

During this task, only `Icon` exists. If TypeScript fails because the future component folders are absent, keep `packages/components/src/index.ts` temporarily at:

```ts
import type { App, Plugin } from 'vue'
import Button from './button'
import Icon from './icon'
import './theme/index.css'

const components = [Button, Icon]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, Icon }
export default AheartUI
```

- [ ] **Step 6: Run Icon test and typecheck**

Run:

```bash
pnpm --filter ./packages/components test -- src/icon/__tests__/icon.test.ts
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 7: Add Icon docs and mark Icon ready**

In `docs/.vitepress/data/components.ts`, change the Icon record to:

```ts
{
  key: 'icon',
  name: 'Icon',
  zhName: '图标',
  description: { zh: '展示语义化符号。', en: 'Display semantic symbols.' },
  status: 'Ready',
  link: { zh: '/components/icon', en: '/en/components/icon' }
}
```

Add `Icon 图标` to both locale sidebars in `docs/.vitepress/config.ts`.

Create Chinese and English docs with examples for `name`, `size`, `color`, and loading spin.

- [ ] **Step 8: Commit Icon**

```bash
git add packages/components/src/icon packages/components/src/index.ts docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/icon.md docs/en/components/icon.md
git commit -m "feat: add icon component"
```

---

### Task 3: Space and Divider Components

**Files:**
- Create: `packages/components/src/space/types.ts`
- Create: `packages/components/src/space/space.vue`
- Create: `packages/components/src/space/style.css`
- Create: `packages/components/src/space/index.ts`
- Create: `packages/components/src/space/__tests__/space.test.ts`
- Create: `packages/components/src/divider/types.ts`
- Create: `packages/components/src/divider/divider.vue`
- Create: `packages/components/src/divider/style.css`
- Create: `packages/components/src/divider/index.ts`
- Create: `packages/components/src/divider/__tests__/divider.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/space.md`
- Create: `docs/components/divider.md`
- Create: `docs/en/components/space.md`
- Create: `docs/en/components/divider.md`

- [ ] **Step 1: Write failing Space and Divider tests**

Create `packages/components/src/space/__tests__/space.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Space from '../space.vue'

describe('Space', () => {
  it('renders slot children with default horizontal layout', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<button>One</button><button>Two</button>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-space')
    expect(wrapper.classes()).toContain('aheart-space--horizontal')
    expect(wrapper.text()).toContain('One')
    expect(wrapper.text()).toContain('Two')
  })

  it('supports vertical direction and numeric gap', () => {
    const wrapper = mount(Space, {
      props: {
        direction: 'vertical',
        size: 20
      }
    })

    expect(wrapper.classes()).toContain('aheart-space--vertical')
    expect(wrapper.attributes('style')).toContain('gap: 20px')
  })

  it('supports tuple gap and wrapping', () => {
    const wrapper = mount(Space, {
      props: {
        size: [8, 16],
        wrap: true
      }
    })

    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain('gap: 8px 16px')
  })
})
```

Create `packages/components/src/divider/__tests__/divider.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Divider from '../divider.vue'

describe('Divider', () => {
  it('renders horizontal divider text', () => {
    const wrapper = mount(Divider, {
      slots: {
        default: 'Section'
      }
    })

    expect(wrapper.classes()).toContain('aheart-divider')
    expect(wrapper.classes()).toContain('aheart-divider--horizontal')
    expect(wrapper.text()).toContain('Section')
  })

  it('supports dashed divider and right content position', () => {
    const wrapper = mount(Divider, {
      props: {
        dashed: true,
        contentPosition: 'right'
      },
      slots: {
        default: 'More'
      }
    })

    expect(wrapper.classes()).toContain('is-dashed')
    expect(wrapper.classes()).toContain('aheart-divider--right')
  })

  it('renders vertical divider orientation', () => {
    const wrapper = mount(Divider, {
      props: {
        direction: 'vertical'
      }
    })

    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })
})
```

- [ ] **Step 2: Run tests and confirm failure**

```bash
pnpm --filter ./packages/components test -- src/space/__tests__/space.test.ts src/divider/__tests__/divider.test.ts
```

Expected: FAIL because `space.vue` and `divider.vue` do not exist.

- [ ] **Step 3: Add Space source**

Create `packages/components/src/space/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const spaceDirections = ['horizontal', 'vertical'] as const
export const spaceSizes = ['mini', 'small', 'normal', 'large'] as const
export const spaceAligns = ['start', 'end', 'center', 'baseline'] as const

export type SpaceDirection = (typeof spaceDirections)[number]
export type SpaceSizeName = (typeof spaceSizes)[number]
export type SpaceSize = SpaceSizeName | number | [number, number]
export type SpaceAlign = (typeof spaceAligns)[number]

export const spaceProps = {
  direction: {
    type: String as PropType<SpaceDirection>,
    default: 'horizontal',
    validator: (value: string) => spaceDirections.includes(value as SpaceDirection)
  },
  size: {
    type: [String, Number, Array] as PropType<SpaceSize>,
    default: 'small'
  },
  align: {
    type: String as PropType<SpaceAlign>,
    default: undefined,
    validator: (value: string) => spaceAligns.includes(value as SpaceAlign)
  },
  wrap: Boolean,
  fill: Boolean
} as const

export type SpaceProps = ExtractPropTypes<typeof spaceProps>
```

Create `packages/components/src/space/space.vue`:

```vue
<template>
  <div class="aheart-space" :class="spaceClass" :style="spaceStyle">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { spaceProps, type SpaceSizeName } from './types'
import './style.css'

defineOptions({
  name: 'ASpace'
})

const props = defineProps(spaceProps)

const sizeMap: Record<SpaceSizeName, number> = {
  mini: 4,
  small: 8,
  normal: 16,
  large: 24
}

const gap = computed(() => {
  if (Array.isArray(props.size)) {
    return `${props.size[0]}px ${props.size[1]}px`
  }

  if (typeof props.size === 'number') {
    return `${props.size}px`
  }

  return `${sizeMap[props.size]}px`
})

const spaceClass = computed(() => [
  `aheart-space--${props.direction}`,
  {
    'is-wrap': props.wrap,
    'is-fill': props.fill
  }
])

const spaceStyle = computed(() => ({
  gap: gap.value,
  alignItems: props.align
}))
</script>
```

Create `packages/components/src/space/style.css`:

```css
.aheart-space {
  display: inline-flex;
}

.aheart-space--horizontal {
  flex-direction: row;
}

.aheart-space--vertical {
  flex-direction: column;
}

.aheart-space.is-wrap {
  flex-wrap: wrap;
}

.aheart-space.is-fill {
  display: flex;
  width: 100%;
}
```

Create `packages/components/src/space/index.ts`:

```ts
import space from './space.vue'
import { withInstall } from '../utils/install'

const Space = withInstall(space, 'ASpace')

export * from './types'
export default Space
```

- [ ] **Step 4: Add Divider source**

Create `packages/components/src/divider/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const dividerDirections = ['horizontal', 'vertical'] as const
export const dividerContentPositions = ['left', 'center', 'right'] as const

export type DividerDirection = (typeof dividerDirections)[number]
export type DividerContentPosition = (typeof dividerContentPositions)[number]

export const dividerProps = {
  direction: {
    type: String as PropType<DividerDirection>,
    default: 'horizontal',
    validator: (value: string) => dividerDirections.includes(value as DividerDirection)
  },
  contentPosition: {
    type: String as PropType<DividerContentPosition>,
    default: 'center',
    validator: (value: string) => dividerContentPositions.includes(value as DividerContentPosition)
  },
  dashed: Boolean,
  plain: Boolean
} as const

export type DividerProps = ExtractPropTypes<typeof dividerProps>
```

Create `packages/components/src/divider/divider.vue`:

```vue
<template>
  <div
    class="aheart-divider"
    :class="dividerClass"
    role="separator"
    :aria-orientation="direction"
  >
    <span v-if="$slots.default && direction === 'horizontal'" class="aheart-divider__text">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { dividerProps } from './types'
import './style.css'

defineOptions({
  name: 'ADivider'
})

const props = defineProps(dividerProps)

const dividerClass = computed(() => [
  `aheart-divider--${props.direction}`,
  `aheart-divider--${props.contentPosition}`,
  {
    'is-dashed': props.dashed,
    'is-plain': props.plain
  }
])
</script>
```

Create `packages/components/src/divider/style.css`:

```css
.aheart-divider {
  border-color: var(--aheart-color-border);
  color: var(--aheart-color-text-secondary);
  font-size: 14px;
}

.aheart-divider--horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 16px 0;
}

.aheart-divider--horizontal::before,
.aheart-divider--horizontal::after {
  display: block;
  flex: 1;
  border-top: 1px solid var(--aheart-color-border);
  content: '';
}

.aheart-divider--vertical {
  display: inline-block;
  height: 1em;
  margin: 0 8px;
  border-left: 1px solid var(--aheart-color-border);
  vertical-align: middle;
}

.aheart-divider.is-dashed::before,
.aheart-divider.is-dashed::after {
  border-top-style: dashed;
}

.aheart-divider__text {
  padding: 0 12px;
  font-weight: 500;
}

.aheart-divider--left::before {
  flex: 0 0 24px;
}

.aheart-divider--right::after {
  flex: 0 0 24px;
}

.aheart-divider.is-plain .aheart-divider__text {
  font-weight: 400;
}
```

Create `packages/components/src/divider/index.ts`:

```ts
import divider from './divider.vue'
import { withInstall } from '../utils/install'

const Divider = withInstall(divider, 'ADivider')

export * from './types'
export default Divider
```

- [ ] **Step 5: Export Space and Divider**

Update `packages/components/src/index.ts` so imports and exports include `Space` and `Divider` alongside existing ready components.

- [ ] **Step 6: Run Space and Divider tests**

```bash
pnpm --filter ./packages/components test -- src/space/__tests__/space.test.ts src/divider/__tests__/divider.test.ts
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 7: Add docs and mark Space and Divider ready**

Update metadata records:

```ts
{
  key: 'space',
  name: 'Space',
  zhName: '间距',
  description: { zh: '设置稳定的元素间距。', en: 'Set consistent inline spacing.' },
  status: 'Ready',
  link: { zh: '/components/space', en: '/en/components/space' }
}
```

```ts
{
  key: 'divider',
  name: 'Divider',
  zhName: '分割线',
  description: { zh: '分隔内容区域。', en: 'Separate content groups.' },
  status: 'Ready',
  link: { zh: '/components/divider', en: '/en/components/divider' }
}
```

Add localized sidebar entries for Space and Divider. Create Chinese and English pages showing basic usage, vertical layout, wrapping Space, text Divider, dashed Divider, and vertical Divider.

- [ ] **Step 8: Commit Space and Divider**

```bash
git add packages/components/src/space packages/components/src/divider packages/components/src/index.ts docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/space.md docs/components/divider.md docs/en/components/space.md docs/en/components/divider.md
git commit -m "feat: add space and divider components"
```

---

### Task 4: Tag and Alert Components

**Files:**
- Create: `packages/components/src/tag/types.ts`
- Create: `packages/components/src/tag/tag.vue`
- Create: `packages/components/src/tag/style.css`
- Create: `packages/components/src/tag/index.ts`
- Create: `packages/components/src/tag/__tests__/tag.test.ts`
- Create: `packages/components/src/alert/types.ts`
- Create: `packages/components/src/alert/alert.vue`
- Create: `packages/components/src/alert/style.css`
- Create: `packages/components/src/alert/index.ts`
- Create: `packages/components/src/alert/__tests__/alert.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/tag.md`
- Create: `docs/components/alert.md`
- Create: `docs/en/components/tag.md`
- Create: `docs/en/components/alert.md`

- [ ] **Step 1: Write failing Tag and Alert tests**

Create `packages/components/src/tag/__tests__/tag.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from '../tag.vue'

describe('Tag', () => {
  it('renders slot content and type class', () => {
    const wrapper = mount(Tag, {
      props: {
        type: 'success'
      },
      slots: {
        default: 'Active'
      }
    })

    expect(wrapper.text()).toContain('Active')
    expect(wrapper.classes()).toContain('aheart-tag--success')
  })

  it('emits close from closable button', async () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
```

Create `packages/components/src/alert/__tests__/alert.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from '../alert.vue'

describe('Alert', () => {
  it('renders title and description', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Saved',
        description: 'The record has been saved.'
      }
    })

    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('The record has been saved.')
  })

  it('applies type and dark effect classes', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'success',
        effect: 'dark'
      }
    })

    expect(wrapper.classes()).toContain('aheart-alert--success')
    expect(wrapper.classes()).toContain('aheart-alert--dark')
  })

  it('emits close and hides alert', async () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Notice',
        closable: true
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.aheart-alert').exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests and confirm failure**

```bash
pnpm --filter ./packages/components test -- src/tag/__tests__/tag.test.ts src/alert/__tests__/alert.test.ts
```

Expected: FAIL because `tag.vue` and `alert.vue` do not exist.

- [ ] **Step 3: Add Tag source**

Create `packages/components/src/tag/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const tagTypes = ['default', 'primary', 'success', 'warning', 'danger'] as const
export const tagSizes = ['normal', 'small'] as const

export type TagType = (typeof tagTypes)[number]
export type TagSize = (typeof tagSizes)[number]

export const tagProps = {
  type: {
    type: String as PropType<TagType>,
    default: 'default',
    validator: (value: string) => tagTypes.includes(value as TagType)
  },
  size: {
    type: String as PropType<TagSize>,
    default: 'normal',
    validator: (value: string) => tagSizes.includes(value as TagSize)
  },
  round: Boolean,
  closable: Boolean
} as const

export const tagEmits = {
  close: (event: MouseEvent) => event instanceof MouseEvent
}

export type TagProps = ExtractPropTypes<typeof tagProps>
```

Create `packages/components/src/tag/tag.vue`:

```vue
<template>
  <span class="aheart-tag" :class="tagClass">
    <span class="aheart-tag__content"><slot /></span>
    <button
      v-if="closable"
      class="aheart-tag__close"
      type="button"
      aria-label="Close tag"
      @click.stop="handleClose"
    >
      ×
    </button>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { tagEmits, tagProps } from './types'
import './style.css'

defineOptions({
  name: 'ATag'
})

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const tagClass = computed(() => [
  `aheart-tag--${props.type}`,
  `aheart-tag--${props.size}`,
  {
    'is-round': props.round,
    'is-closable': props.closable
  }
])

const handleClose = (event: MouseEvent) => {
  emit('close', event)
}
</script>
```

Create `packages/components/src/tag/style.css`:

```css
.aheart-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  border: 1px solid var(--aheart-color-border);
  border-radius: var(--aheart-radius);
  background: #f5f7fa;
  color: var(--aheart-color-text);
  white-space: nowrap;
}

.aheart-tag--normal {
  min-height: 24px;
  padding: 0 8px;
  font-size: 13px;
}

.aheart-tag--small {
  min-height: 20px;
  padding: 0 6px;
  font-size: 12px;
}

.aheart-tag--primary {
  border-color: #91caff;
  background: #e6f4ff;
  color: #0958d9;
}

.aheart-tag--success {
  border-color: #b7eb8f;
  background: #f6ffed;
  color: #389e0d;
}

.aheart-tag--warning {
  border-color: #ffe58f;
  background: #fffbe6;
  color: #d48806;
}

.aheart-tag--danger {
  border-color: #ffccc7;
  background: #fff2f0;
  color: #cf1322;
}

.aheart-tag.is-round {
  border-radius: 999px;
}

.aheart-tag__content {
  overflow: hidden;
  text-overflow: ellipsis;
}

.aheart-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  line-height: 1;
}

.aheart-tag__close:hover {
  background: rgba(0, 0, 0, 0.08);
}
```

Create `packages/components/src/tag/index.ts`:

```ts
import tag from './tag.vue'
import { withInstall } from '../utils/install'

const Tag = withInstall(tag, 'ATag')

export * from './types'
export default Tag
```

- [ ] **Step 4: Add Alert source**

Create `packages/components/src/alert/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const alertTypes = ['info', 'success', 'warning', 'error'] as const
export const alertEffects = ['light', 'dark'] as const

export type AlertType = (typeof alertTypes)[number]
export type AlertEffect = (typeof alertEffects)[number]

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: 'info',
    validator: (value: string) => alertTypes.includes(value as AlertType)
  },
  effect: {
    type: String as PropType<AlertEffect>,
    default: 'light',
    validator: (value: string) => alertEffects.includes(value as AlertEffect)
  },
  title: String,
  description: String,
  showIcon: {
    type: Boolean,
    default: true
  },
  closable: Boolean,
  center: Boolean
} as const

export const alertEmits = {
  close: (event: MouseEvent) => event instanceof MouseEvent
}

export type AlertProps = ExtractPropTypes<typeof alertProps>
```

Create `packages/components/src/alert/alert.vue`:

```vue
<template>
  <div v-if="visible" class="aheart-alert" :class="alertClass" role="alert">
    <Icon v-if="showIcon" class="aheart-alert__icon" :name="iconName" />
    <div class="aheart-alert__content">
      <div v-if="title || $slots.title" class="aheart-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.default" class="aheart-alert__description">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button
      v-if="closable"
      class="aheart-alert__close"
      type="button"
      aria-label="Close alert"
      @click="handleClose"
    >
      ×
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Icon from '../icon'
import { alertEmits, alertProps, type AlertType } from './types'
import './style.css'

defineOptions({
  name: 'AAlert'
})

const props = defineProps(alertProps)
const emit = defineEmits(alertEmits)

const visible = ref(true)

const iconMap: Record<AlertType, 'info' | 'success' | 'warning' | 'error'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
}

const iconName = computed(() => iconMap[props.type])
const alertClass = computed(() => [
  `aheart-alert--${props.type}`,
  `aheart-alert--${props.effect}`,
  {
    'is-center': props.center
  }
])

const handleClose = (event: MouseEvent) => {
  visible.value = false
  emit('close', event)
}
</script>
```

Create `packages/components/src/alert/style.css`:

```css
.aheart-alert {
  position: relative;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--aheart-radius);
  font-size: var(--aheart-font-size);
  line-height: 1.6;
}

.aheart-alert.is-center {
  align-items: center;
}

.aheart-alert--info.aheart-alert--light {
  border-color: #91caff;
  background: #e6f4ff;
  color: #0958d9;
}

.aheart-alert--success.aheart-alert--light {
  border-color: #b7eb8f;
  background: #f6ffed;
  color: #389e0d;
}

.aheart-alert--warning.aheart-alert--light {
  border-color: #ffe58f;
  background: #fffbe6;
  color: #d48806;
}

.aheart-alert--error.aheart-alert--light {
  border-color: #ffccc7;
  background: #fff2f0;
  color: #cf1322;
}

.aheart-alert--dark {
  color: #fff;
}

.aheart-alert--info.aheart-alert--dark {
  background: var(--aheart-color-primary);
}

.aheart-alert--success.aheart-alert--dark {
  background: var(--aheart-color-success);
}

.aheart-alert--warning.aheart-alert--dark {
  background: var(--aheart-color-warning);
}

.aheart-alert--error.aheart-alert--dark {
  background: var(--aheart-color-danger);
}

.aheart-alert__icon {
  margin-top: 3px;
  font-size: 16px;
}

.aheart-alert__content {
  min-width: 0;
  flex: 1;
}

.aheart-alert__title {
  font-weight: 650;
}

.aheart-alert__description {
  color: inherit;
}

.aheart-alert__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  line-height: 1;
}

.aheart-alert__close:hover {
  background: rgba(0, 0, 0, 0.08);
}
```

Create `packages/components/src/alert/index.ts`:

```ts
import alert from './alert.vue'
import { withInstall } from '../utils/install'

const Alert = withInstall(alert, 'AAlert')

export * from './types'
export default Alert
```

- [ ] **Step 5: Export Tag and Alert**

Update `packages/components/src/index.ts` so the final Phase 1 root export is:

```ts
import type { App, Plugin } from 'vue'
import Alert from './alert'
import Button from './button'
import Divider from './divider'
import Icon from './icon'
import Space from './space'
import Tag from './tag'
import './theme/index.css'

const components = [Button, Icon, Space, Divider, Tag, Alert]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Alert, Button, Divider, Icon, Space, Tag }
export default AheartUI
```

- [ ] **Step 6: Run Tag and Alert tests**

```bash
pnpm --filter ./packages/components test -- src/tag/__tests__/tag.test.ts src/alert/__tests__/alert.test.ts
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 7: Add docs and mark Tag and Alert ready**

Update metadata records:

```ts
{
  key: 'tag',
  name: 'Tag',
  zhName: '标签',
  description: { zh: '标记内容状态。', en: 'Label content with status.' },
  status: 'Ready',
  link: { zh: '/components/tag', en: '/en/components/tag' }
}
```

```ts
{
  key: 'alert',
  name: 'Alert',
  zhName: '警告提示',
  description: { zh: '展示上下文提示。', en: 'Show contextual information.' },
  status: 'Ready',
  link: { zh: '/components/alert', en: '/en/components/alert' }
}
```

Add localized sidebar entries for Tag and Alert. Create Chinese and English pages showing type variants, closable Tag, title/description Alert, dark Alert, and closable Alert.

- [ ] **Step 8: Commit Tag and Alert**

```bash
git add packages/components/src/tag packages/components/src/alert packages/components/src/index.ts docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/tag.md docs/components/alert.md docs/en/components/tag.md docs/en/components/alert.md
git commit -m "feat: add tag and alert components"
```

---

### Task 5: Final Build Output, Verification, and Push

**Files:**
- Modify: `packages/components/es/**`
- Modify: `packages/components/lib/**`
- Verify: `packages/components/src/**`
- Verify: `docs/**`

- [ ] **Step 1: Run the full test suite**

```bash
pnpm test
```

Expected: PASS for Button, Icon, Space, Divider, Tag, and Alert tests.

- [ ] **Step 2: Run typecheck**

```bash
pnpm typecheck
```

Expected: PASS with no Vue or TypeScript errors.

- [ ] **Step 3: Build package output**

```bash
pnpm build
```

Expected: PASS and refresh generated `packages/components/es/**` and `packages/components/lib/**`.

- [ ] **Step 4: Build docs**

```bash
pnpm docs:build
```

Expected: PASS for Chinese root pages and English `/en/` pages.

- [ ] **Step 5: Inspect git status**

```bash
git status --short --branch
```

Expected: generated `es` and `lib` files may be modified. `docs/.vitepress/cache/` must remain untracked and unstaged.

- [ ] **Step 6: Commit generated build output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: refresh component outputs"
```

If `git status --short` shows no generated changes after `pnpm build`, skip this commit and note it in the final report.

- [ ] **Step 7: Push branch**

```bash
git push origin codex/ant-style-docs-site
```

Expected: remote branch receives all local commits. If GitHub network fails, keep the local commits and report the connection error exactly.

- [ ] **Step 8: Report access path**

If the docs dev server from the previous run is still active, verify `http://127.0.0.1:5173/`. If it is not active, start it with:

```bash
pnpm docs:dev -- --host 127.0.0.1 --port 5173
```

Report:

- Chinese docs: `http://127.0.0.1:5173/`
- English docs: `http://127.0.0.1:5173/en/`

---

## Self-Review

- Spec coverage: Task 1 covers Chinese default docs, English `/en/`, and language-aware metadata. Tasks 2 through 4 cover the five Phase 1 ready components. Task 5 covers tests, typecheck, build, docs build, generated outputs, and push.
- Scope: This plan covers Phase 1 only. Runtime `ConfigProvider`, forms, overlays beyond Alert, tables, pickers, upload, and tree components remain outside this slice.
- Type consistency: Component names use `AIcon`, `ASpace`, `ADivider`, `ATag`, and `AAlert` for plugin registration. Root exports use `Icon`, `Space`, `Divider`, `Tag`, and `Alert`.
- Commit flow: Each task has its own commit, and the final task pushes the branch after verification.
