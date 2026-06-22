# Ant Style Button Color Variant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Button `color`, `variant`, and object-form `loading.icon` support while preserving existing Button APIs.

**Architecture:** Extend `AButton` in place. Types define Ant-style color and variant unions; the Vue component resolves explicit props over legacy `type` and renders object loading icons with the local `ARenderNode` pattern; CSS consumes resolved color through component-scoped variables.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite, vite-plugin-dts, VitePress, pnpm workspace.

---

## Files

- Modify: `packages/components/src/button/types.ts`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/style.css`
- Modify: `packages/components/src/button/__tests__/button.test.ts`
- Modify: `docs/components/button.md`
- Generated after build: `packages/components/es/button/*`
- Generated after build: `packages/components/lib/button/*`

## Task 1: Write Failing Button Tests

- [ ] **Step 1: Add tests in `packages/components/src/button/__tests__/button.test.ts`**

Append these tests inside the existing `describe('Button', () => { ... })` block:

```ts
  it('resolves explicit color and variant classes over type sugar', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        color: 'danger',
        variant: 'filled'
      },
      slots: {
        default: 'Delete'
      }
    })

    expect(wrapper.classes()).toContain('aheart-button--primary')
    expect(wrapper.classes()).toContain('aheart-button--color-danger')
    expect(wrapper.classes()).toContain('aheart-button--variant-filled')
    expect(wrapper.classes()).not.toContain('aheart-button--color-primary')
    expect(wrapper.attributes('style')).toContain('--aheart-button-color: var(--aheart-color-danger)')
  })

  it('maps type and danger to Ant-style color and variant classes', () => {
    const primary = mount(Button, {
      props: {
        type: 'primary'
      }
    })
    const dashedDanger = mount(Button, {
      props: {
        type: 'dashed',
        danger: true
      }
    })

    expect(primary.classes()).toContain('aheart-button--color-primary')
    expect(primary.classes()).toContain('aheart-button--variant-solid')
    expect(dashedDanger.classes()).toContain('aheart-button--color-danger')
    expect(dashedDanger.classes()).toContain('aheart-button--variant-dashed')
  })

  it('renders loading.icon from object loading after delay', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Button, {
      props: {
        loading: {
          delay: 50,
          icon: h('span', { class: 'object-loading-icon' }, 'loading')
        }
      },
      slots: {
        default: 'Save'
      }
    })

    expect(wrapper.find('.object-loading-icon').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(50)
    await nextTick()

    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
    expect(wrapper.find('.object-loading-icon').text()).toBe('loading')
    expect(wrapper.find('.aheart-button__loading-spinner').exists()).toBe(false)
  })

  it('keeps the loadingIcon slot higher priority than loading.icon', () => {
    const wrapper = mount(Button, {
      props: {
        loading: {
          icon: h('span', { class: 'object-loading-icon' }, 'object')
        }
      },
      slots: {
        loadingIcon: '<span class="slot-loading-icon">slot</span>',
        default: 'Save'
      }
    })

    expect(wrapper.find('.slot-loading-icon').text()).toBe('slot')
    expect(wrapper.find('.object-loading-icon').exists()).toBe(false)
  })
```

- [ ] **Step 2: Run focused Button tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button
```

Expected: the new tests fail because `color`, `variant`, and `loading.icon` are not implemented yet.

## Task 2: Implement Button API Support

- [ ] **Step 1: Extend `packages/components/src/button/types.ts`**

Add `VNodeChild`, color unions, variant unions, and object loading icon support:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export const buttonColors = [
  'default',
  'primary',
  'danger',
  'success',
  'warning',
  'info',
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold'
] as const
export const buttonVariants = ['outlined', 'dashed', 'solid', 'filled', 'text', 'link'] as const

export type ButtonColor = (typeof buttonColors)[number]
export type ButtonVariant = (typeof buttonVariants)[number]
export type ButtonLoading = boolean | { delay?: number; icon?: VNodeChild }
```

Add props:

```ts
  color: {
    type: String as PropType<ButtonColor>,
    validator: (value: string) => buttonColors.includes(value as ButtonColor)
  },
  variant: {
    type: String as PropType<ButtonVariant>,
    validator: (value: string) => buttonVariants.includes(value as ButtonVariant)
  },
```

- [ ] **Step 2: Update `packages/components/src/button/button.vue`**

Add local render support and resolved state:

```ts
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType, type VNodeChild } from 'vue'
import type { ButtonColor, ButtonType, ButtonVariant } from './types'

const ARenderNode = defineComponent({
  name: 'AButtonRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const typeColorMap: Partial<Record<ButtonType, ButtonColor>> = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger'
}
const typeVariantMap: Partial<Record<ButtonType, ButtonVariant>> = {
  primary: 'solid',
  success: 'solid',
  warning: 'solid',
  danger: 'solid',
  dashed: 'dashed',
  link: 'link',
  text: 'text'
}
const resolvedColor = computed<ButtonColor>(() => props.color || (isDanger.value ? 'danger' : typeColorMap[props.type] || 'default'))
const resolvedVariant = computed<ButtonVariant>(() => props.variant || typeVariantMap[props.type] || 'outlined')
const objectLoadingIcon = computed(() =>
  typeof props.loading === 'object' && props.loading !== null ? props.loading.icon : undefined
)
const hasObjectLoadingIcon = computed(
  () => objectLoadingIcon.value !== undefined && objectLoadingIcon.value !== null && objectLoadingIcon.value !== false
)
```

Update the loading fallback in the template:

```vue
      <slot name="loadingIcon">
        <ARenderNode v-if="hasObjectLoadingIcon" :node="objectLoadingIcon" />
        <span v-else class="aheart-button__loading-spinner" />
      </slot>
```

Add classes and root CSS variables:

```ts
  `aheart-button--color-${resolvedColor.value}`,
  `aheart-button--variant-${resolvedVariant.value}`,
```

```ts
const colorTokens: Record<ButtonColor, string> = {
  default: 'var(--aheart-color-text)',
  primary: 'var(--aheart-color-primary)',
  danger: 'var(--aheart-color-danger)',
  success: 'var(--aheart-color-success)',
  warning: 'var(--aheart-color-warning)',
  info: 'var(--aheart-color-info)',
  blue: '#1677ff',
  purple: '#722ed1',
  cyan: '#13c2c2',
  green: '#52c41a',
  magenta: '#eb2f96',
  pink: '#eb2f96',
  red: '#f5222d',
  orange: '#fa8c16',
  yellow: '#fadb14',
  volcano: '#fa541c',
  geekblue: '#2f54eb',
  lime: '#a0d911',
  gold: '#faad14'
}

const rootStyle = computed(() => [
  {
    '--aheart-button-color': colorTokens[resolvedColor.value],
    '--aheart-button-color-hover':
      resolvedColor.value === 'default' ? 'var(--aheart-color-primary-hover)' : colorTokens[resolvedColor.value]
  },
  props.style,
  props.styles?.root
])
```

- [ ] **Step 3: Update `packages/components/src/button/style.css`**

Add variant styles that use the component color variables:

```css
.aheart-button--variant-solid {
  border-color: transparent;
  background: var(--aheart-button-color);
  color: #fff;
}

.aheart-button--variant-outlined,
.aheart-button--variant-dashed {
  border-color: var(--aheart-button-color);
  color: var(--aheart-button-color);
}

.aheart-button--variant-dashed {
  border-style: dashed;
}

.aheart-button--variant-filled {
  border-color: transparent;
  background: color-mix(in srgb, var(--aheart-button-color) 12%, white);
  color: var(--aheart-button-color);
}

.aheart-button--variant-text,
.aheart-button--variant-link {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
  color: var(--aheart-button-color);
}
```

Keep the existing legacy selectors so old `type` styling remains compatible.

- [ ] **Step 4: Run focused tests and package typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: focused Button tests and package typecheck pass.

- [ ] **Step 5: Commit implementation**

Run:

```bash
git add packages/components/src/button/types.ts packages/components/src/button/button.vue packages/components/src/button/style.css packages/components/src/button/__tests__/button.test.ts
git commit -m "feat: add button color variant parity"
```

## Task 3: Document And Build Outputs

- [ ] **Step 1: Update `docs/components/button.md`**

Add a Color & Variant example, add a `loading.icon` example, and update the API rows:

```md
| color | 按钮颜色，显式设置时优先于 `type` 推导 | `default` \| `primary` \| `danger` \| `success` \| `warning` \| `info` \| Ant 预设色 | - |
| variant | 按钮变体，显式设置时优先于 `type` 推导 | `outlined` \| `dashed` \| `solid` \| `filled` \| `text` \| `link` | - |
| loading | 是否加载中，支持延迟显示和自定义图标 | `boolean` \| `{ delay?: number; icon?: VNodeChild }` | `false` |
```

- [ ] **Step 2: Build docs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build passes.

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: Button `es` / `lib` outputs update.

- [ ] **Step 4: Commit docs and generated outputs**

Run:

```bash
git add docs/components/button.md packages/components/es/button packages/components/lib/button
git commit -m "docs: document button color variant APIs"
```

## Task 4: Final Verification

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git diff --check
git status --short --branch
```

Expected: all commands pass, whitespace check is clean, and the worktree is clean after committing.

## Self-Review

- Spec coverage: every design requirement maps to a task.
- Placeholder scan: no placeholder steps remain.
- Type consistency: `ButtonColor`, `ButtonVariant`, and `ButtonLoading` match the proposed implementation.
- Scope: limited to Button source, tests, docs, and generated Button outputs.
