# Ant Style Config Provider Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Aheart UI global configuration foundation, wire the existing Button into it, and document ConfigProvider as the first Ant-style configuration component.

**Architecture:** Add a typed provide/inject config context under `packages/components/src/config`, implement `AConfigProvider` as an installable component, and update Button so local props override provider defaults. Documentation marks ConfigProvider Ready only after implementation, tests, exports, and docs exist.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This is the first executable sub-plan from `docs/superpowers/specs/2026-06-22-ant-style-components-foundation-design.md`.

It covers:

- `ConfigProvider`
- shared config context/composable
- expanded theme tokens
- Button consumption of global size/disabled config
- ConfigProvider docs and metadata

It does not implement the remaining first-slice components. Those need separate follow-up plans for Layout, General, and Feedback/Data Display primitives.

## Commands

Use these commands for verification. If plain `pnpm` is unavailable, prefix with the bundled Node path shown below.

```bash
pnpm --filter ./packages/components test -- config-provider
pnpm --filter ./packages/components test -- button
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Bundled fallback:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 <script>
```

## File Structure

- Create: `packages/components/src/config/context.ts`
- Create: `packages/components/src/config/index.ts`
- Create: `packages/components/src/config-provider/config-provider.vue`
- Create: `packages/components/src/config-provider/index.ts`
- Create: `packages/components/src/config-provider/style.css`
- Create: `packages/components/src/config-provider/types.ts`
- Create: `packages/components/src/config-provider/__tests__/config-provider.test.ts`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/style.css`
- Modify: `packages/components/src/button/types.ts`
- Modify: `packages/components/src/button/__tests__/button.test.ts`
- Modify: `packages/components/src/theme/index.css`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/config-provider.md`

## Task 1: Add Config Context And ConfigProvider

**Files:**
- Create: `packages/components/src/config/context.ts`
- Create: `packages/components/src/config/index.ts`
- Create: `packages/components/src/config-provider/config-provider.vue`
- Create: `packages/components/src/config-provider/types.ts`
- Create: `packages/components/src/config-provider/style.css`
- Create: `packages/components/src/config-provider/index.ts`
- Create: `packages/components/src/config-provider/__tests__/config-provider.test.ts`
- Modify: `packages/components/src/theme/index.css`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Write the failing ConfigProvider test**

Create `packages/components/src/config-provider/__tests__/config-provider.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { useAheartConfig } from '../../config'
import ConfigProvider from '../config-provider.vue'

const ConfigReader = defineComponent({
  setup() {
    const config = useAheartConfig()

    return () =>
      h('div', {
        class: 'config-reader',
        'data-size': config.value.size,
        'data-disabled': String(config.value.disabled),
        'data-empty': config.value.locale?.empty?.description
      })
  }
})

describe('ConfigProvider', () => {
  it('provides size disabled and locale to descendants', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true,
        locale: {
          empty: {
            description: '暂无内容'
          }
        }
      },
      slots: {
        default: ConfigReader
      }
    })

    const reader = wrapper.find('.config-reader')
    expect(reader.attributes('data-size')).toBe('large')
    expect(reader.attributes('data-disabled')).toBe('true')
    expect(reader.attributes('data-empty')).toBe('暂无内容')
  })

  it('applies theme tokens as scoped CSS variables', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          primaryColor: '#0958d9',
          borderRadius: '4px',
          fontSize: '13px'
        }
      },
      slots: {
        default: 'content'
      }
    })

    expect(wrapper.classes()).toContain('aheart-config-provider')
    expect(wrapper.attributes('style')).toContain('--aheart-color-primary: #0958d9')
    expect(wrapper.attributes('style')).toContain('--aheart-radius: 4px')
    expect(wrapper.attributes('style')).toContain('--aheart-font-size: 13px')
  })
})
```

- [ ] **Step 2: Run the ConfigProvider RED test**

Run:

```bash
pnpm --filter ./packages/components test -- config-provider
```

Expected: FAIL because `../config-provider.vue` and `../../config` are missing.

- [ ] **Step 3: Create the shared config context**

Create `packages/components/src/config/context.ts`:

```ts
import { computed, inject, provide, type ComputedRef, type InjectionKey, type Ref, unref } from 'vue'

export type AheartSize = 'large' | 'middle' | 'small'

export interface AheartLocale {
  empty?: {
    description?: string
  }
}

export interface AheartTheme {
  primaryColor?: string
  primaryHoverColor?: string
  successColor?: string
  warningColor?: string
  dangerColor?: string
  infoColor?: string
  textColor?: string
  textSecondaryColor?: string
  borderColor?: string
  fillColor?: string
  backgroundColor?: string
  borderRadius?: string
  fontSize?: string
}

export interface AheartConfig {
  size?: AheartSize
  disabled?: boolean
  locale?: AheartLocale
  theme?: AheartTheme
}

export const defaultAheartConfig: Required<Pick<AheartConfig, 'size' | 'disabled'>> & Pick<AheartConfig, 'locale' | 'theme'> = {
  size: 'middle',
  disabled: false,
  locale: {
    empty: {
      description: 'No Data'
    }
  },
  theme: {}
}

export const aheartConfigKey: InjectionKey<ComputedRef<AheartConfig>> = Symbol('aheart-config')

export const useAheartConfig = () => {
  return inject(aheartConfigKey, computed(() => defaultAheartConfig))
}

export const provideAheartConfig = (config: Ref<AheartConfig>) => {
  const parentConfig = useAheartConfig()
  const mergedConfig = computed<AheartConfig>(() => {
    const current = unref(config)
    const parent = parentConfig.value

    return {
      ...defaultAheartConfig,
      ...parent,
      ...current,
      locale: {
        ...defaultAheartConfig.locale,
        ...parent.locale,
        ...current.locale,
        empty: {
          ...defaultAheartConfig.locale?.empty,
          ...parent.locale?.empty,
          ...current.locale?.empty
        }
      },
      theme: {
        ...parent.theme,
        ...current.theme
      }
    }
  })

  provide(aheartConfigKey, mergedConfig)
  return mergedConfig
}

export const resolveConfigValue = <T>(localValue: T | undefined, providerValue: T | undefined, fallback: T) => {
  return localValue ?? providerValue ?? fallback
}
```

Create `packages/components/src/config/index.ts`:

```ts
export * from './context'
```

- [ ] **Step 4: Create ConfigProvider types**

Create `packages/components/src/config-provider/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartLocale, AheartSize, AheartTheme } from '../config'

export const configProviderProps = {
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  locale: Object as PropType<AheartLocale>,
  theme: Object as PropType<AheartTheme>
} as const

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
```

- [ ] **Step 5: Create ConfigProvider component and style**

Create `packages/components/src/config-provider/config-provider.vue`:

```vue
<template>
  <div class="aheart-config-provider" :style="cssVariables">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { provideAheartConfig } from '../config'
import { configProviderProps } from './types'
import './style.css'

defineOptions({
  name: 'AConfigProvider'
})

const props = defineProps(configProviderProps)

provideAheartConfig(
  computed(() => ({
    size: props.size,
    disabled: props.disabled,
    locale: props.locale,
    theme: props.theme
  }))
)

const cssVariables = computed(() => {
  const theme = props.theme || {}

  return {
    '--aheart-color-primary': theme.primaryColor,
    '--aheart-color-primary-hover': theme.primaryHoverColor,
    '--aheart-color-success': theme.successColor,
    '--aheart-color-warning': theme.warningColor,
    '--aheart-color-danger': theme.dangerColor,
    '--aheart-color-info': theme.infoColor,
    '--aheart-color-text': theme.textColor,
    '--aheart-color-text-secondary': theme.textSecondaryColor,
    '--aheart-color-border': theme.borderColor,
    '--aheart-color-fill': theme.fillColor,
    '--aheart-color-bg': theme.backgroundColor,
    '--aheart-radius': theme.borderRadius,
    '--aheart-font-size': theme.fontSize
  }
})
</script>
```

Create `packages/components/src/config-provider/style.css`:

```css
.aheart-config-provider {
  color: var(--aheart-color-text);
  font-size: var(--aheart-font-size);
}
```

Create `packages/components/src/config-provider/index.ts`:

```ts
import configProvider from './config-provider.vue'
import { withInstall } from '../utils/install'

const ConfigProvider = withInstall(configProvider, 'AConfigProvider')

export default ConfigProvider
```

- [ ] **Step 6: Extend global theme tokens**

Replace `packages/components/src/theme/index.css` with:

```css
:root {
  --aheart-color-primary: #1677ff;
  --aheart-color-primary-hover: #4096ff;
  --aheart-color-success: #52c41a;
  --aheart-color-warning: #faad14;
  --aheart-color-danger: #ff4d4f;
  --aheart-color-info: #1677ff;
  --aheart-color-text: #1f2329;
  --aheart-color-text-secondary: #646a73;
  --aheart-color-border: #d9d9d9;
  --aheart-color-fill: #f5f5f5;
  --aheart-color-bg: #ffffff;
  --aheart-color-bg-disabled: #f5f5f5;
  --aheart-color-bg-elevated: #ffffff;
  --aheart-font-size: 14px;
  --aheart-font-size-sm: 12px;
  --aheart-font-size-lg: 16px;
  --aheart-line-height: 1.5715;
  --aheart-radius: 6px;
  --aheart-radius-sm: 4px;
  --aheart-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  --aheart-control-height-lg: 40px;
  --aheart-control-height: 32px;
  --aheart-control-height-sm: 24px;
  --aheart-spacing-xs: 4px;
  --aheart-spacing-sm: 8px;
  --aheart-spacing-md: 16px;
  --aheart-spacing-lg: 24px;
  --aheart-motion-duration: 0.2s;
  --aheart-motion-ease: cubic-bezier(0.645, 0.045, 0.355, 1);
}
```

- [ ] **Step 7: Export ConfigProvider**

Replace `packages/components/src/index.ts` with:

```ts
import type { App, Plugin } from 'vue'
import Button from './button'
import ConfigProvider from './config-provider'
import './theme/index.css'

const components = [Button, ConfigProvider]

const AheartUI: Plugin = {
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}

export { Button, ConfigProvider }
export default AheartUI
```

- [ ] **Step 8: Run ConfigProvider GREEN verification**

Run:

```bash
pnpm --filter ./packages/components test -- config-provider
pnpm --filter ./packages/components typecheck
```

Expected: ConfigProvider tests pass and typecheck exits 0.

- [ ] **Step 9: Commit ConfigProvider foundation**

Run:

```bash
git add packages/components/src/config packages/components/src/config-provider packages/components/src/theme/index.css packages/components/src/index.ts
git commit -m "feat: add config provider foundation"
```

Expected: Commit created.

## Task 2: Connect Button To ConfigProvider

**Files:**
- Modify: `packages/components/src/button/types.ts`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/style.css`
- Modify: `packages/components/src/button/__tests__/button.test.ts`

- [ ] **Step 1: Add failing Button config tests**

Add the import to `packages/components/src/button/__tests__/button.test.ts`:

```ts
import ConfigProvider from '../../config-provider/config-provider.vue'
```

Append these tests inside `describe('Button', () => { ... })`:

```ts
  it('uses global size and disabled config when local props are absent', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true
      },
      slots: {
        default: Button
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('aheart-button--large')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('lets local Button props override global config', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true
      },
      slots: {
        default: {
          render() {
            return h(Button, { size: 'small', disabled: false }, () => '保存')
          }
        }
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('aheart-button--small')
    expect(button.attributes('disabled')).toBeUndefined()
  })
```

Also add `h` to the existing Vue import if needed:

```ts
import { h } from 'vue'
```

- [ ] **Step 2: Run Button RED test**

Run:

```bash
pnpm --filter ./packages/components test -- button
```

Expected: FAIL because Button does not read ConfigProvider yet.

- [ ] **Step 3: Update Button prop types**

Replace `packages/components/src/button/types.ts` with:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export const buttonTypes = ['default', 'primary', 'success', 'warning', 'danger'] as const
export const buttonSizes = ['large', 'normal', 'middle', 'small', 'mini'] as const
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
    validator: (value: string) => buttonSizes.includes(value as ButtonSize)
  },
  nativeType: {
    type: String as PropType<NativeButtonType>,
    default: 'button',
    validator: (value: string) => nativeButtonTypes.includes(value as NativeButtonType)
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  loading: Boolean,
  block: Boolean,
  round: Boolean
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
```

- [ ] **Step 4: Update Button component**

Replace `packages/components/src/button/button.vue` with:

```vue
<template>
  <button
    class="aheart-button"
    :class="buttonClass"
    :type="nativeType"
    :disabled="isDisabled || loading"
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
import { resolveConfigValue, useAheartConfig } from '../config'
import { buttonProps } from './types'
import './style.css'

defineOptions({
  name: 'AButton'
})

const props = defineProps(buttonProps)
const config = useAheartConfig()

const resolvedSize = computed(() => {
  const providerSize = config.value.size === 'middle' ? 'normal' : config.value.size
  return resolveConfigValue(props.size, providerSize, 'normal')
})

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${resolvedSize.value}`,
  {
    'is-block': props.block,
    'is-round': props.round,
    'is-loading': props.loading
  }
])
</script>
```

- [ ] **Step 5: Update Button size CSS to use tokens**

In `packages/components/src/button/style.css`, replace the size blocks with:

```css
.aheart-button--large {
  height: var(--aheart-control-height-lg);
  padding: 0 18px;
}

.aheart-button--middle,
.aheart-button--normal {
  height: var(--aheart-control-height);
  padding: 0 14px;
}

.aheart-button--small {
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.aheart-button--mini {
  height: var(--aheart-control-height-sm);
  padding: 0 8px;
  font-size: var(--aheart-font-size-sm);
}
```

- [ ] **Step 6: Run Button GREEN verification**

Run:

```bash
pnpm --filter ./packages/components test -- button
pnpm --filter ./packages/components typecheck
```

Expected: Button tests pass and typecheck exits 0.

- [ ] **Step 7: Commit Button config integration**

Run:

```bash
git add packages/components/src/button
git commit -m "feat: connect button to config provider"
```

Expected: Commit created.

## Task 3: Document ConfigProvider

**Files:**
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/config-provider.md`

- [ ] **Step 1: Update docs component metadata**

In `docs/.vitepress/data/components.ts`, add a `ConfigProvider` entry in `General` after Button:

```ts
{ name: 'ConfigProvider', description: 'Configure global theme, size, locale, and disabled state.', status: 'Ready', link: '/components/config-provider' },
```

- [ ] **Step 2: Update VitePress sidebar**

In `docs/.vitepress/config.ts`, add this item to the `/components/` sidebar:

```ts
{ text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
```

- [ ] **Step 3: Create ConfigProvider docs**

Create `docs/components/config-provider.md`:

````md
# ConfigProvider 全局配置 <span class="aheart-status aheart-status--ready">Ready</span>

ConfigProvider provides shared configuration for Aheart UI components, including global size, disabled state, locale text, and local theme token overrides.

## 基础用法

<div class="aheart-demo-panel">
  <AConfigProvider size="large">
    <div class="aheart-demo-row">
      <AButton>Default</AButton>
      <AButton type="primary">Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large">
    <AButton>Default</AButton>
    <AButton type="primary">Primary</AButton>
  </AConfigProvider>
</template>
```

## 禁用状态

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <div class="aheart-demo-row">
      <AButton>Disabled</AButton>
      <AButton type="primary">Disabled Primary</AButton>
    </div>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider disabled>
    <AButton>Disabled</AButton>
    <AButton type="primary">Disabled Primary</AButton>
  </AConfigProvider>
</template>
```

## Theme Tokens

<div class="aheart-demo-panel">
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider :theme="{ primaryColor: '#0958d9', borderRadius: '4px' }">
    <AButton type="primary">Custom Theme</AButton>
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 全局组件尺寸 | `large` \| `middle` \| `small` | `middle` |
| disabled | 全局禁用状态 | `boolean` | `false` |
| locale | 组件内置文案 | `AheartLocale` | `{ empty: { description: 'No Data' } }` |
| theme | 局部主题 token 覆盖 | `AheartTheme` | `{}` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 需要接收配置的组件内容 |

## Theme Token Fields

`theme` currently supports:

- `primaryColor`
- `primaryHoverColor`
- `successColor`
- `warningColor`
- `dangerColor`
- `infoColor`
- `textColor`
- `textSecondaryColor`
- `borderColor`
- `fillColor`
- `backgroundColor`
- `borderRadius`
- `fontSize`
````

- [ ] **Step 4: Run docs build**

Run:

```bash
pnpm docs:build
```

Expected: VitePress build succeeds and `/components/config-provider` renders.

- [ ] **Step 5: Commit ConfigProvider docs**

Run:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/config-provider.md
git commit -m "docs: add config provider documentation"
```

Expected: Commit created.

## Task 4: Full Verification

**Files:**
- Verify all source and docs changes from Tasks 1-3.

- [ ] **Step 1: Run full verification**

Run:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Check generated package declarations**

Run:

```bash
pnpm build
test -f packages/components/es/config-provider/index.d.ts
test -f packages/components/es/config/context.d.ts
```

Expected: all commands exit 0.

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

- This plan covers the first foundation sub-slice from the approved design spec.
- Every production-code task starts with failing tests.
- ConfigProvider is not marked Ready until implementation, tests, exports, docs, and docs metadata exist.
- The remaining first-slice components still require follow-up implementation plans.
