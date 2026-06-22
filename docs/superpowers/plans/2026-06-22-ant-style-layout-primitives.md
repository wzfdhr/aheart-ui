# Ant Style Layout Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first Aheart UI layout primitives: Space, Divider, and Flex, with tests, exports, docs, component metadata, and build outputs.

**Architecture:** Follow the existing component directory pattern used by Button and ConfigProvider. Space consumes ConfigProvider size, Divider renders semantic separators, and Flex provides a compact class-based flex layout helper. Each component is installable and exported from the package root.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Space`
- `Divider`
- `Flex`
- package root exports and plugin install
- docs pages and Ready status for the three components

It does not cover Grid, Layout, Splitter, or later data/form components.

## Task 1: Add Layout Component Tests

**Files:**
- Create: `packages/components/src/space/__tests__/space.test.ts`
- Create: `packages/components/src/divider/__tests__/divider.test.ts`
- Create: `packages/components/src/flex/__tests__/flex.test.ts`

- [ ] **Step 1: Create Space failing tests**

Create `packages/components/src/space/__tests__/space.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Space from '../space.vue'

describe('Space', () => {
  it('renders each default slot child as a spaced item', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<button>One</button><button>Two</button>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-space')
    expect(wrapper.classes()).toContain('aheart-space--horizontal')
    expect(wrapper.findAll('.aheart-space__item')).toHaveLength(2)
  })

  it('supports vertical direction, align, wrap, and numeric tuple size', () => {
    const wrapper = mount(Space, {
      props: {
        direction: 'vertical',
        align: 'center',
        wrap: true,
        size: [8, 12]
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-space--vertical')
    expect(wrapper.classes()).toContain('aheart-space--align-center')
    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain('--aheart-space-gap-horizontal: 8px')
    expect(wrapper.attributes('style')).toContain('--aheart-space-gap-vertical: 12px')
  })

  it('uses provider size as the default gap', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large'
      },
      slots: {
        default: {
          render() {
            return h(Space, null, () => [h('span', 'One'), h('span', 'Two')])
          }
        }
      }
    })

    expect(wrapper.find('.aheart-space').attributes('style')).toContain(
      '--aheart-space-gap-horizontal: var(--aheart-spacing-lg)'
    )
  })
})
```

- [ ] **Step 2: Create Divider failing tests**

Create `packages/components/src/divider/__tests__/divider.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Divider from '../divider.vue'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    const wrapper = mount(Divider)

    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.classes()).toContain('aheart-divider--horizontal')
  })

  it('renders label slot with orientation class', () => {
    const wrapper = mount(Divider, {
      props: {
        orientation: 'left'
      },
      slots: {
        default: 'Text'
      }
    })

    expect(wrapper.text()).toContain('Text')
    expect(wrapper.classes()).toContain('aheart-divider--left')
    expect(wrapper.find('.aheart-divider__text').exists()).toBe(true)
  })

  it('supports vertical dashed divider', () => {
    const wrapper = mount(Divider, {
      props: {
        type: 'vertical',
        dashed: true
      }
    })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.classes()).toContain('aheart-divider--vertical')
    expect(wrapper.classes()).toContain('is-dashed')
  })
})
```

- [ ] **Step 3: Create Flex failing tests**

Create `packages/components/src/flex/__tests__/flex.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Flex from '../flex.vue'

describe('Flex', () => {
  it('renders flex layout classes and numeric gap variable', () => {
    const wrapper = mount(Flex, {
      props: {
        justify: 'between',
        align: 'center',
        gap: 12,
        wrap: true
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-flex')
    expect(wrapper.classes()).toContain('aheart-flex--justify-between')
    expect(wrapper.classes()).toContain('aheart-flex--align-center')
    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: 12px')
  })

  it('supports vertical direction and token gap', () => {
    const wrapper = mount(Flex, {
      props: {
        vertical: true,
        gap: 'large'
      }
    })

    expect(wrapper.classes()).toContain('is-vertical')
    expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: var(--aheart-spacing-lg)')
  })
})
```

- [ ] **Step 4: Run layout RED tests**

Run:

```bash
pnpm --filter ./packages/components test -- space divider flex
```

Expected: FAIL because `space.vue`, `divider.vue`, and `flex.vue` are missing.

## Task 2: Implement Space

**Files:**
- Create: `packages/components/src/space/space.vue`
- Create: `packages/components/src/space/types.ts`
- Create: `packages/components/src/space/style.css`
- Create: `packages/components/src/space/index.ts`

- [ ] **Step 1: Create Space types**

Create `packages/components/src/space/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type SpaceSize = AheartSize | number | [number, number]
export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'

export const spaceProps = {
  size: [String, Number, Array] as PropType<SpaceSize>,
  direction: {
    type: String as PropType<SpaceDirection>,
    default: 'horizontal'
  },
  align: String as PropType<SpaceAlign>,
  wrap: Boolean
} as const

export type SpaceProps = ExtractPropTypes<typeof spaceProps>
```

- [ ] **Step 2: Create Space component**

Create `packages/components/src/space/space.vue`:

```vue
<template>
  <div class="aheart-space" :class="spaceClass" :style="spaceStyle">
    <div v-for="(child, index) in normalizedChildren" :key="index" class="aheart-space__item">
      <component :is="child" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment, computed, useSlots } from 'vue'
import { useAheartConfig } from '../config'
import { spaceProps, type SpaceSize } from './types'
import './style.css'

defineOptions({
  name: 'ASpace'
})

const props = defineProps(spaceProps)
const slots = useSlots()
const config = useAheartConfig()

const normalizedChildren = computed(() => (slots.default?.() || []).filter((child) => child.type !== Comment))

const sizeToGap = (size: SpaceSize | undefined) => {
  if (Array.isArray(size)) {
    return [`${size[0]}px`, `${size[1]}px`]
  }

  if (typeof size === 'number') {
    return [`${size}px`, `${size}px`]
  }

  const resolved = size || config.value.size || 'middle'
  const tokenMap = {
    large: 'var(--aheart-spacing-lg)',
    middle: 'var(--aheart-spacing-md)',
    small: 'var(--aheart-spacing-sm)'
  }

  return [tokenMap[resolved], tokenMap[resolved]]
}

const spaceClass = computed(() => [
  `aheart-space--${props.direction}`,
  {
    [`aheart-space--align-${props.align}`]: props.align,
    'is-wrap': props.wrap
  }
])

const spaceStyle = computed(() => {
  const [horizontal, vertical] = sizeToGap(props.size)

  return {
    '--aheart-space-gap-horizontal': horizontal,
    '--aheart-space-gap-vertical': vertical
  }
})
</script>
```

- [ ] **Step 3: Create Space style and install entry**

Create `packages/components/src/space/style.css`:

```css
.aheart-space {
  display: inline-flex;
  gap: var(--aheart-space-gap-vertical) var(--aheart-space-gap-horizontal);
}

.aheart-space--horizontal {
  flex-direction: row;
}

.aheart-space--vertical {
  flex-direction: column;
}

.aheart-space--align-start {
  align-items: flex-start;
}

.aheart-space--align-end {
  align-items: flex-end;
}

.aheart-space--align-center {
  align-items: center;
}

.aheart-space--align-baseline {
  align-items: baseline;
}

.aheart-space.is-wrap {
  flex-wrap: wrap;
}

.aheart-space__item {
  display: inline-flex;
  min-width: 0;
}
```

Create `packages/components/src/space/index.ts`:

```ts
import space from './space.vue'
import { withInstall } from '../utils/install'

const Space = withInstall(space, 'ASpace')

export default Space
```

## Task 3: Implement Divider

**Files:**
- Create: `packages/components/src/divider/divider.vue`
- Create: `packages/components/src/divider/types.ts`
- Create: `packages/components/src/divider/style.css`
- Create: `packages/components/src/divider/index.ts`

- [ ] **Step 1: Create Divider files**

`packages/components/src/divider/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export type DividerType = 'horizontal' | 'vertical'
export type DividerOrientation = 'left' | 'center' | 'right'

export const dividerProps = {
  type: {
    type: String as PropType<DividerType>,
    default: 'horizontal'
  },
  orientation: {
    type: String as PropType<DividerOrientation>,
    default: 'center'
  },
  dashed: Boolean,
  plain: Boolean
} as const

export type DividerProps = ExtractPropTypes<typeof dividerProps>
```

`packages/components/src/divider/divider.vue`:

```vue
<template>
  <div
    class="aheart-divider"
    :class="dividerClass"
    role="separator"
    :aria-orientation="type"
  >
    <span v-if="$slots.default && type === 'horizontal'" class="aheart-divider__text">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dividerProps } from './types'
import './style.css'

defineOptions({
  name: 'ADivider'
})

const props = defineProps(dividerProps)

const dividerClass = computed(() => [
  `aheart-divider--${props.type}`,
  `aheart-divider--${props.orientation}`,
  {
    'has-text': Boolean(props.type === 'horizontal'),
    'is-dashed': props.dashed,
    'is-plain': props.plain
  }
])
</script>
```

`packages/components/src/divider/style.css`:

```css
.aheart-divider {
  box-sizing: border-box;
  color: var(--aheart-color-text);
  border-color: var(--aheart-color-border);
}

.aheart-divider--horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 100%;
  margin: var(--aheart-spacing-md) 0;
}

.aheart-divider--horizontal::before,
.aheart-divider--horizontal::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--aheart-color-border);
}

.aheart-divider--horizontal:not(.has-text)::after {
  display: none;
}

.aheart-divider--vertical {
  display: inline-block;
  height: 0.9em;
  margin: 0 var(--aheart-spacing-sm);
  vertical-align: middle;
  border-left: 1px solid var(--aheart-color-border);
}

.aheart-divider--left::before,
.aheart-divider--right::after {
  flex: 0.08;
}

.aheart-divider__text {
  padding: 0 var(--aheart-spacing-sm);
  font-weight: 500;
}

.aheart-divider.is-dashed,
.aheart-divider.is-dashed::before,
.aheart-divider.is-dashed::after {
  border-style: dashed;
}

.aheart-divider.is-plain .aheart-divider__text {
  font-weight: 400;
}
```

`packages/components/src/divider/index.ts`:

```ts
import divider from './divider.vue'
import { withInstall } from '../utils/install'

const Divider = withInstall(divider, 'ADivider')

export default Divider
```

## Task 4: Implement Flex And Exports

**Files:**
- Create: `packages/components/src/flex/flex.vue`
- Create: `packages/components/src/flex/types.ts`
- Create: `packages/components/src/flex/style.css`
- Create: `packages/components/src/flex/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create Flex files**

Create `packages/components/src/flex/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type FlexGap = AheartSize | number

export const flexProps = {
  vertical: Boolean,
  wrap: [Boolean, String] as PropType<boolean | string>,
  justify: String as PropType<FlexJustify>,
  align: String as PropType<FlexAlign>,
  gap: [String, Number] as PropType<FlexGap>
} as const

export type FlexProps = ExtractPropTypes<typeof flexProps>
```

Create `packages/components/src/flex/flex.vue`:

```vue
<template>
  <div class="aheart-flex" :class="flexClass" :style="flexStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { flexProps, type FlexGap } from './types'
import './style.css'

defineOptions({
  name: 'AFlex'
})

const props = defineProps(flexProps)

const gapToValue = (gap: FlexGap | undefined) => {
  if (typeof gap === 'number') {
    return `${gap}px`
  }

  const tokenMap = {
    large: 'var(--aheart-spacing-lg)',
    middle: 'var(--aheart-spacing-md)',
    small: 'var(--aheart-spacing-sm)'
  }

  return gap ? tokenMap[gap] : undefined
}

const flexClass = computed(() => [
  {
    'is-vertical': props.vertical,
    'is-wrap': props.wrap === true,
    [`is-wrap-${props.wrap}`]: typeof props.wrap === 'string',
    [`aheart-flex--justify-${props.justify}`]: props.justify,
    [`aheart-flex--align-${props.align}`]: props.align
  }
])

const flexStyle = computed(() => ({
  '--aheart-flex-gap': gapToValue(props.gap)
}))
</script>
```

Create `packages/components/src/flex/style.css`:

```css
.aheart-flex {
  display: flex;
  gap: var(--aheart-flex-gap, 0);
}

.aheart-flex.is-vertical {
  flex-direction: column;
}

.aheart-flex.is-wrap {
  flex-wrap: wrap;
}

.aheart-flex.is-wrap-nowrap {
  flex-wrap: nowrap;
}

.aheart-flex.is-wrap-reverse {
  flex-wrap: wrap-reverse;
}

.aheart-flex--justify-start {
  justify-content: flex-start;
}

.aheart-flex--justify-end {
  justify-content: flex-end;
}

.aheart-flex--justify-center {
  justify-content: center;
}

.aheart-flex--justify-between {
  justify-content: space-between;
}

.aheart-flex--justify-around {
  justify-content: space-around;
}

.aheart-flex--justify-evenly {
  justify-content: space-evenly;
}

.aheart-flex--align-start {
  align-items: flex-start;
}

.aheart-flex--align-end {
  align-items: flex-end;
}

.aheart-flex--align-center {
  align-items: center;
}

.aheart-flex--align-baseline {
  align-items: baseline;
}

.aheart-flex--align-stretch {
  align-items: stretch;
}
```

Create `packages/components/src/flex/index.ts`:

```ts
import flex from './flex.vue'
import { withInstall } from '../utils/install'

const Flex = withInstall(flex, 'AFlex')

export default Flex
```

- [ ] **Step 2: Export layout components**

Update `packages/components/src/index.ts` to import `Space`, `Divider`, and `Flex`; include them in `components`; and export them:

```ts
import Divider from './divider'
import Flex from './flex'
import Space from './space'

const components = [Button, ConfigProvider, Space, Divider, Flex]

export { Button, ConfigProvider, Space, Divider, Flex }
```

- [ ] **Step 3: Run layout GREEN tests**

Run:

```bash
pnpm --filter ./packages/components test -- space divider flex
pnpm --filter ./packages/components typecheck
```

Expected: tests pass and typecheck exits 0.

- [ ] **Step 4: Commit layout primitives**

Run:

```bash
git add packages/components/src/space packages/components/src/divider packages/components/src/flex packages/components/src/index.ts
git commit -m "feat: add layout primitives"
```

Expected: Commit created.

## Task 5: Document Layout Components

**Files:**
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/space.md`
- Create: `docs/components/divider.md`
- Create: `docs/components/flex.md`

- [ ] **Step 1: Update docs metadata and sidebar**

In `docs/.vitepress/data/components.ts`, replace the existing Layout entries for Space, Divider, and Flex with:

```ts
{ name: 'Space', description: 'Set consistent inline spacing.', status: 'Ready', link: '/components/space' },
{ name: 'Divider', description: 'Separate content groups.', status: 'Ready', link: '/components/divider' },
{ name: 'Flex', description: 'Compose flexible layouts.', status: 'Ready', link: '/components/flex' },
```

Add sidebar entries:

```ts
{ text: 'Space 间距', link: '/components/space' },
{ text: 'Divider 分割线', link: '/components/divider' },
{ text: 'Flex 弹性布局', link: '/components/flex' }
```

- [ ] **Step 2: Create docs pages**

Create `docs/components/space.md`:

````md
# Space 间距 <span class="aheart-status aheart-status--ready">Ready</span>

Space sets consistent spacing between inline or vertical elements.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace>
    <AButton>Cancel</AButton>
    <AButton type="primary">Submit</AButton>
  </ASpace>
</template>
```

## 垂直排列

<div class="aheart-demo-panel">
  <ASpace direction="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</div>

```vue
<template>
  <ASpace direction="vertical" size="small">
    <AButton>First</AButton>
    <AButton>Second</AButton>
  </ASpace>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 间距尺寸 | `large` \| `middle` \| `small` \| `number` \| `[number, number]` | ConfigProvider size |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` | - |
| wrap | 是否自动换行 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要添加间距的内容 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
````

Create `docs/components/divider.md`:

````md
# Divider 分割线 <span class="aheart-status aheart-status--ready">Ready</span>

Divider separates content groups with horizontal or vertical rules.

## 基础用法

<div class="aheart-demo-panel">
  <span>Text</span>
  <ADivider />
  <span>More text</span>
</div>

```vue
<template>
  <span>Text</span>
  <ADivider />
  <span>More text</span>
</template>
```

## 带文字

<div class="aheart-demo-panel">
  <ADivider orientation="left">Section</ADivider>
</div>

```vue
<template>
  <ADivider orientation="left">Section</ADivider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 分割线方向 | `horizontal` \| `vertical` | `horizontal` |
| orientation | 文字位置 | `left` \| `center` \| `right` | `center` |
| dashed | 是否虚线 | `boolean` | `false` |
| plain | 文字是否普通样式 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 水平分割线中的标题内容 |

## Theme Tokens

- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
````

Create `docs/components/flex.md`:

````md
# Flex 弹性布局 <span class="aheart-status aheart-status--ready">Ready</span>

Flex provides a small layout helper for one-dimensional alignment and spacing.

## 基础用法

<div class="aheart-demo-panel">
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex gap="middle" align="center">
    <AButton>Left</AButton>
    <AButton type="primary">Right</AButton>
  </AFlex>
</template>
```

## 两端对齐

<div class="aheart-demo-panel">
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</div>

```vue
<template>
  <AFlex justify="between" align="center" gap="small">
    <span>Label</span>
    <AButton type="primary">Action</AButton>
  </AFlex>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| vertical | 是否垂直布局 | `boolean` | `false` |
| wrap | 换行方式 | `boolean` \| `nowrap` \| `reverse` | `false` |
| justify | 主轴对齐 | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | - |
| align | 交叉轴对齐 | `start` \| `end` \| `center` \| `baseline` \| `stretch` | - |
| gap | 间距 | `large` \| `middle` \| `small` \| `number` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | Flex 内容 |

## Theme Tokens

- `--aheart-spacing-sm`
- `--aheart-spacing-md`
- `--aheart-spacing-lg`
````

- [ ] **Step 3: Run docs build**

Run:

```bash
pnpm docs:build
```

Expected: docs build exits 0.

- [ ] **Step 4: Commit layout docs**

Run:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/space.md docs/components/divider.md docs/components/flex.md
git commit -m "docs: add layout primitive documentation"
```

Expected: Commit created.

## Task 6: Full Verification

**Files:**
- Verify all layout component and docs changes.

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
git commit -m "build: update layout component outputs"
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

- This plan covers Space, Divider, and Flex only.
- Each component has tests before implementation.
- Ready docs are added only after components exist and tests pass.
- Later layout components such as Grid, Layout, and Splitter remain planned for follow-up slices.
