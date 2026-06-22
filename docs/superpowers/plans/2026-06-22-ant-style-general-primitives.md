# Ant Style General Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Aheart UI's first General primitives after Button and ConfigProvider: Icon plus the Typography family.

**Architecture:** Follow the existing component directory pattern. Icon is a lightweight inline primitive that can render named fallback text or custom slot content. Typography exports one root plugin and four subcomponent plugins: Typography, Title, Text, Paragraph, and Link.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Icon`
- `Typography`
- `Title`
- `Text`
- `Paragraph`
- `Link`
- package root exports and plugin install
- docs pages and Ready status for Icon and Typography

This plan does not implement FloatButton or advanced Typography copyable/ellipsis behavior. It adds stable classes and props so advanced behavior can be added later without changing the public component names.

## Task 1: Add General Component Tests

**Files:**
- Create: `packages/components/src/icon/__tests__/icon.test.ts`
- Create: `packages/components/src/typography/__tests__/typography.test.ts`

- [ ] **Step 1: Create Icon failing tests**

Create `packages/components/src/icon/__tests__/icon.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Icon from '../icon.vue'

describe('Icon', () => {
  it('renders named fallback content with semantic class', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'search'
      }
    })

    expect(wrapper.classes()).toContain('aheart-icon')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('search')
  })

  it('renders custom slot and size color styles', () => {
    const wrapper = mount(Icon, {
      props: {
        size: 20,
        color: '#1677ff'
      },
      slots: {
        default: '<svg viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg>'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--aheart-icon-size: 20px')
    expect(wrapper.attributes('style')).toContain('--aheart-icon-color: #1677ff')
  })

  it('adds spin class when spin is true', () => {
    const wrapper = mount(Icon, {
      props: {
        spin: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-icon--spin')
  })
})
```

- [ ] **Step 2: Create Typography failing tests**

Create `packages/components/src/typography/__tests__/typography.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Link from '../link.vue'
import Paragraph from '../paragraph.vue'
import Text from '../text.vue'
import Title from '../title.vue'
import Typography from '../typography.vue'

describe('Typography', () => {
  it('renders the root typography wrapper', () => {
    const wrapper = mount(Typography, {
      slots: {
        default: 'Content'
      }
    })

    expect(wrapper.classes()).toContain('aheart-typography')
    expect(wrapper.text()).toContain('Content')
  })

  it('renders title with semantic heading level', () => {
    const wrapper = mount(Title, {
      props: {
        level: 3
      },
      slots: {
        default: 'Heading'
      }
    })

    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.classes()).toContain('aheart-typography-title--3')
  })

  it('renders text modifiers', () => {
    const wrapper = mount(Text, {
      props: {
        type: 'success',
        strong: true,
        code: true
      },
      slots: {
        default: 'Done'
      }
    })

    expect(wrapper.element.tagName).toBe('CODE')
    expect(wrapper.classes()).toContain('aheart-typography-text--success')
    expect(wrapper.classes()).toContain('is-strong')
  })

  it('renders paragraph with ellipsis-ready class', () => {
    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: true
      },
      slots: {
        default: 'Long content'
      }
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('is-ellipsis')
  })

  it('renders link and handles disabled state', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        disabled: true
      },
      slots: {
        default: 'Open'
      }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
```

- [ ] **Step 3: Run General RED tests**

Run:

```bash
pnpm --filter ./packages/components test -- icon typography
```

Expected: FAIL because Icon and Typography component files do not exist.

## Task 2: Implement Icon

**Files:**
- Create: `packages/components/src/icon/icon.vue`
- Create: `packages/components/src/icon/types.ts`
- Create: `packages/components/src/icon/style.css`
- Create: `packages/components/src/icon/index.ts`

- [ ] **Step 1: Create Icon types**

Create `packages/components/src/icon/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const iconProps = {
  name: String,
  size: [Number, String] as PropType<number | string>,
  color: String,
  spin: Boolean
} as const

export type IconProps = ExtractPropTypes<typeof iconProps>
```

- [ ] **Step 2: Create Icon component**

Create `packages/components/src/icon/icon.vue`:

```vue
<template>
  <span class="aheart-icon" :class="iconClass" :style="iconStyle" aria-hidden="true">
    <slot>{{ name }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconProps } from './types'
import './style.css'

defineOptions({
  name: 'AIcon'
})

const props = defineProps(iconProps)

const normalizeSize = (size: number | string | undefined) => {
  if (typeof size === 'number') {
    return `${size}px`
  }

  return size
}

const iconClass = computed(() => ({
  'aheart-icon--spin': props.spin
}))

const iconStyle = computed(() => ({
  '--aheart-icon-size': normalizeSize(props.size),
  '--aheart-icon-color': props.color
}))
</script>
```

- [ ] **Step 3: Create Icon style and install entry**

Create `packages/components/src/icon/style.css`:

```css
.aheart-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--aheart-icon-size, 1em);
  height: var(--aheart-icon-size, 1em);
  color: var(--aheart-icon-color, currentColor);
  font-size: var(--aheart-icon-size, 1em);
  line-height: 1;
  vertical-align: -0.125em;
}

.aheart-icon svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}

.aheart-icon--spin {
  animation: aheart-icon-spin 1s linear infinite;
}

@keyframes aheart-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
```

Create `packages/components/src/icon/index.ts`:

```ts
import icon from './icon.vue'
import { withInstall } from '../utils/install'

const Icon = withInstall(icon, 'AIcon')

export default Icon
```

- [ ] **Step 4: Run Icon GREEN tests**

Run:

```bash
pnpm --filter ./packages/components test -- icon
pnpm --filter ./packages/components typecheck
```

Expected: Icon tests pass and typecheck exits 0.

## Task 3: Implement Typography Family

**Files:**
- Create: `packages/components/src/typography/typography.vue`
- Create: `packages/components/src/typography/title.vue`
- Create: `packages/components/src/typography/text.vue`
- Create: `packages/components/src/typography/paragraph.vue`
- Create: `packages/components/src/typography/link.vue`
- Create: `packages/components/src/typography/types.ts`
- Create: `packages/components/src/typography/style.css`
- Create: `packages/components/src/typography/index.ts`

- [ ] **Step 1: Create Typography types**

Create `packages/components/src/typography/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
export type TitleLevel = 1 | 2 | 3 | 4 | 5

export const typographyProps = {} as const

export const titleProps = {
  level: {
    type: Number as PropType<TitleLevel>,
    default: 1,
    validator: (value: number) => value >= 1 && value <= 5
  }
} as const

export const textProps = {
  type: String as PropType<TypographyType>,
  strong: Boolean,
  italic: Boolean,
  code: Boolean,
  keyboard: Boolean,
  delete: Boolean,
  underline: Boolean,
  disabled: Boolean
} as const

export const paragraphProps = {
  type: String as PropType<TypographyType>,
  strong: Boolean,
  italic: Boolean,
  ellipsis: Boolean,
  disabled: Boolean
} as const

export const linkProps = {
  href: String,
  target: String,
  disabled: Boolean,
  underline: Boolean
} as const

export type TypographyProps = ExtractPropTypes<typeof typographyProps>
export type TitleProps = ExtractPropTypes<typeof titleProps>
export type TextProps = ExtractPropTypes<typeof textProps>
export type ParagraphProps = ExtractPropTypes<typeof paragraphProps>
export type LinkProps = ExtractPropTypes<typeof linkProps>
```

- [ ] **Step 2: Create Typography root and Title**

Create `typography.vue` and `title.vue`.

`packages/components/src/typography/typography.vue`:

```vue
<template>
  <article class="aheart-typography">
    <slot />
  </article>
</template>

<script setup lang="ts">
import './style.css'

defineOptions({
  name: 'ATypography'
})
</script>
```

`packages/components/src/typography/title.vue`:

```vue
<template>
  <component :is="tagName" class="aheart-typography-title" :class="`aheart-typography-title--${level}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { titleProps } from './types'
import './style.css'

defineOptions({
  name: 'ATitle'
})

const props = defineProps(titleProps)
const tagName = computed(() => `h${props.level}`)
</script>
```

- [ ] **Step 3: Create Text, Paragraph, and Link**

Create `text.vue`, `paragraph.vue`, and `link.vue`.

`packages/components/src/typography/text.vue`:

```vue
<template>
  <component :is="tagName" class="aheart-typography-text" :class="textClass">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { textProps } from './types'
import './style.css'

defineOptions({
  name: 'AText'
})

const props = defineProps(textProps)

const tagName = computed(() => {
  if (props.code) return 'code'
  if (props.keyboard) return 'kbd'
  if (props.delete) return 'del'
  if (props.underline) return 'u'
  if (props.italic) return 'em'
  if (props.strong) return 'strong'
  return 'span'
})

const textClass = computed(() => ({
  [`aheart-typography-text--${props.type}`]: props.type,
  'is-strong': props.strong,
  'is-italic': props.italic,
  'is-disabled': props.disabled
}))
</script>
```

`packages/components/src/typography/paragraph.vue`:

```vue
<template>
  <p class="aheart-typography-paragraph" :class="paragraphClass">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { paragraphProps } from './types'
import './style.css'

defineOptions({
  name: 'AParagraph'
})

const props = defineProps(paragraphProps)

const paragraphClass = computed(() => ({
  [`aheart-typography-paragraph--${props.type}`]: props.type,
  'is-strong': props.strong,
  'is-italic': props.italic,
  'is-ellipsis': props.ellipsis,
  'is-disabled': props.disabled
}))
</script>
```

`packages/components/src/typography/link.vue`:

```vue
<template>
  <a class="aheart-typography-link" :class="linkClass" :href="resolvedHref" :target="target" :aria-disabled="disabled || undefined">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { linkProps } from './types'
import './style.css'

defineOptions({
  name: 'ALink'
})

const props = defineProps(linkProps)
const resolvedHref = computed(() => (props.disabled ? undefined : props.href))

const linkClass = computed(() => ({
  'is-disabled': props.disabled,
  'is-underline': props.underline
}))
</script>
```

- [ ] **Step 4: Create Typography style**

Create `packages/components/src/typography/style.css`:

```css
.aheart-typography {
  color: var(--aheart-color-text);
  font-size: var(--aheart-font-size);
  line-height: var(--aheart-line-height);
}

.aheart-typography-title {
  margin: 0 0 var(--aheart-spacing-sm);
  color: var(--aheart-color-text);
  font-weight: 600;
  line-height: 1.35;
}

.aheart-typography-title--1 {
  font-size: 38px;
}

.aheart-typography-title--2 {
  font-size: 30px;
}

.aheart-typography-title--3 {
  font-size: 24px;
}

.aheart-typography-title--4 {
  font-size: 20px;
}

.aheart-typography-title--5 {
  font-size: 16px;
}

.aheart-typography-text,
.aheart-typography-paragraph,
.aheart-typography-link {
  color: var(--aheart-color-text);
  font-size: var(--aheart-font-size);
  line-height: var(--aheart-line-height);
}

.aheart-typography-paragraph {
  margin: 0 0 var(--aheart-spacing-md);
}

.aheart-typography-text--secondary,
.aheart-typography-paragraph--secondary {
  color: var(--aheart-color-text-secondary);
}

.aheart-typography-text--success,
.aheart-typography-paragraph--success {
  color: var(--aheart-color-success);
}

.aheart-typography-text--warning,
.aheart-typography-paragraph--warning {
  color: var(--aheart-color-warning);
}

.aheart-typography-text--danger,
.aheart-typography-paragraph--danger {
  color: var(--aheart-color-danger);
}

.aheart-typography-text.is-strong,
.aheart-typography-paragraph.is-strong {
  font-weight: 600;
}

.aheart-typography-text.is-italic,
.aheart-typography-paragraph.is-italic {
  font-style: italic;
}

.aheart-typography-text.is-disabled,
.aheart-typography-paragraph.is-disabled,
.aheart-typography-link.is-disabled {
  color: var(--aheart-color-text-secondary);
  cursor: not-allowed;
  opacity: 0.72;
}

.aheart-typography-text:is(code),
code.aheart-typography-text {
  padding: 0 4px;
  border: 1px solid var(--aheart-color-border);
  border-radius: var(--aheart-radius-sm);
  background: var(--aheart-color-fill);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

kbd.aheart-typography-text {
  padding: 0 4px;
  border: 1px solid var(--aheart-color-border);
  border-bottom-width: 2px;
  border-radius: var(--aheart-radius-sm);
  background: var(--aheart-color-bg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.aheart-typography-paragraph.is-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aheart-typography-link {
  color: var(--aheart-color-primary);
  text-decoration: none;
  cursor: pointer;
}

.aheart-typography-link:hover:not(.is-disabled),
.aheart-typography-link.is-underline {
  text-decoration: underline;
}
```

- [ ] **Step 5: Create Typography install entry**

Create `packages/components/src/typography/index.ts`:

```ts
import typography from './typography.vue'
import title from './title.vue'
import text from './text.vue'
import paragraph from './paragraph.vue'
import link from './link.vue'
import { withInstall } from '../utils/install'

const Typography = withInstall(typography, 'ATypography')
const Title = withInstall(title, 'ATitle')
const Text = withInstall(text, 'AText')
const Paragraph = withInstall(paragraph, 'AParagraph')
const Link = withInstall(link, 'ALink')

export { Title, Text, Paragraph, Link }
export default Typography
```

- [ ] **Step 6: Run Typography GREEN tests**

Run:

```bash
pnpm --filter ./packages/components test -- typography
pnpm --filter ./packages/components typecheck
```

Expected: Typography tests pass and typecheck exits 0.

## Task 4: Export General Primitives

**Files:**
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Update root exports**

Update `packages/components/src/index.ts` to import `Icon`, `Typography`, `Title`, `Text`, `Paragraph`, and `Link`; add all six installable components to the plugin list; and export them:

```ts
import Icon from './icon'
import Typography, { Link, Paragraph, Text, Title } from './typography'

const components = [Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link]

export { Button, ConfigProvider, Space, Divider, Flex, Icon, Typography, Title, Text, Paragraph, Link }
```

- [ ] **Step 2: Run all General tests**

Run:

```bash
pnpm --filter ./packages/components test -- icon typography
pnpm --filter ./packages/components typecheck
```

Expected: tests pass and typecheck exits 0.

- [ ] **Step 3: Commit General primitives**

Run:

```bash
git add packages/components/src/icon packages/components/src/typography packages/components/src/index.ts
git commit -m "feat: add icon and typography primitives"
```

Expected: Commit created.

## Task 5: Document Icon And Typography

**Files:**
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/icon.md`
- Create: `docs/components/typography.md`

- [ ] **Step 1: Update docs metadata and sidebar**

In `docs/.vitepress/data/components.ts`, set Icon and Typography to Ready:

```ts
{ name: 'Icon', description: 'Display semantic symbols.', status: 'Ready', link: '/components/icon' },
{ name: 'Typography', description: 'Text, title, and link styles.', status: 'Ready', link: '/components/typography' }
```

Add sidebar entries:

```ts
{ text: 'Icon 图标', link: '/components/icon' },
{ text: 'Typography 排版', link: '/components/typography' }
```

- [ ] **Step 2: Create Icon docs**

Create `docs/components/icon.md`:

````md
# Icon 图标 <span class="aheart-status aheart-status--ready">Ready</span>

Icon renders inline symbols and custom SVG content.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <AIcon name="search" />
    <AIcon name="setting" color="#1677ff" />
    <AIcon name="loading" spin />
  </ASpace>
</div>

```vue
<template>
  <AIcon name="search" />
  <AIcon name="setting" color="#1677ff" />
  <AIcon name="loading" spin />
</template>
```

## 自定义 SVG

<div class="aheart-demo-panel">
  <AIcon :size="20" color="#52c41a">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5z" />
    </svg>
  </AIcon>
</div>

```vue
<template>
  <AIcon :size="20" color="#52c41a">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.5 11.2 3.3 8l1.1-1.1 2.1 2.1 5-5L12.6 5z" />
    </svg>
  </AIcon>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 无插槽时显示的图标名称 | `string` | - |
| size | 图标尺寸 | `number` \| `string` | `1em` |
| color | 图标颜色 | `string` | `currentColor` |
| spin | 是否旋转 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义图标内容，通常是 SVG |
````

- [ ] **Step 3: Create Typography docs**

Create `docs/components/typography.md`:

````md
# Typography 排版 <span class="aheart-status aheart-status--ready">Ready</span>

Typography provides text, title, paragraph, and link primitives for product interfaces.

## 标题

<div class="aheart-demo-panel">
  <ATitle :level="3">Aheart UI</ATitle>
  <AParagraph>Calm and consistent product interface typography.</AParagraph>
</div>

```vue
<template>
  <ATitle :level="3">Aheart UI</ATitle>
  <AParagraph>Calm and consistent product interface typography.</AParagraph>
</template>
```

## 文本类型

<div class="aheart-demo-panel">
  <ASpace>
    <AText>Default</AText>
    <AText type="success" strong>Success</AText>
    <AText type="warning">Warning</AText>
    <AText code>code</AText>
  </ASpace>
</div>

```vue
<template>
  <AText>Default</AText>
  <AText type="success" strong>Success</AText>
  <AText type="warning">Warning</AText>
  <AText code>code</AText>
</template>
```

## API

### Title

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| level | 标题级别 | `1` \| `2` \| `3` \| `4` \| `5` | `1` |

### Text

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| strong | 是否加粗 | `boolean` | `false` |
| italic | 是否斜体 | `boolean` | `false` |
| code | 是否代码样式 | `boolean` | `false` |
| keyboard | 是否键盘样式 | `boolean` | `false` |
| delete | 是否删除线 | `boolean` | `false` |
| underline | 是否下划线 | `boolean` | `false` |
| disabled | 是否禁用样式 | `boolean` | `false` |

### Paragraph

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 段落类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| strong | 是否加粗 | `boolean` | `false` |
| italic | 是否斜体 | `boolean` | `false` |
| ellipsis | 是否单行省略 | `boolean` | `false` |
| disabled | 是否禁用样式 | `boolean` | `false` |

### Link

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| href | 链接地址 | `string` | - |
| target | 链接打开方式 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| underline | 是否显示下划线 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 文本内容 |
````

- [ ] **Step 4: Run docs build**

Run:

```bash
pnpm docs:build
```

Expected: docs build exits 0.

- [ ] **Step 5: Commit General docs**

Run:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/icon.md docs/components/typography.md
git commit -m "docs: add general primitive documentation"
```

Expected: Commit created.

## Task 6: Full Verification

**Files:**
- Verify source, docs, and build outputs.

- [ ] **Step 1: Run full verification**

Run:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Commit tracked build outputs**

After `pnpm build`, if tracked `packages/components/es` or `packages/components/lib` files changed, commit them:

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update general component outputs"
```

Expected: commit created if build outputs changed; skip if status is already clean.

- [ ] **Step 3: Confirm docs internals are excluded**

Run:

```bash
test ! -e docs/.vitepress/dist/superpowers
```

Expected: exit 0.

- [ ] **Step 4: Inspect git status**

Run:

```bash
git status --short --branch
```

Expected: clean branch.

## Self-Review

- This plan covers Icon and Typography only.
- Tests are written before production component files.
- Typography advanced copyable and multi-line ellipsis behavior remains out of scope for this slice.
- Ready docs are added only after components exist and tests pass.
