# Ant Style Display Feedback Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first lightweight Data Display and Feedback primitives: Tag, Badge, Alert, Spin, and Empty.

**Architecture:** Follow the existing component directory pattern with typed props, local CSS, install entries, package root exports, tests, VitePress docs, and tracked build outputs. Empty consumes ConfigProvider locale to prove the shared config layer supports display components.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Tag`
- `Badge`
- `Alert`
- `Spin`
- `Empty`
- package root exports and plugin install
- docs pages and Ready status for these five components

This plan does not cover Message, Modal, Drawer, Tooltip, Popover, Popconfirm, Skeleton, Card, Table, or Pagination.

## Task 1: Add Display And Feedback Component Tests

**Files:**
- Create: `packages/components/src/tag/__tests__/tag.test.ts`
- Create: `packages/components/src/badge/__tests__/badge.test.ts`
- Create: `packages/components/src/alert/__tests__/alert.test.ts`
- Create: `packages/components/src/spin/__tests__/spin.test.ts`
- Create: `packages/components/src/empty/__tests__/empty.test.ts`

- [ ] **Step 1: Create Tag failing tests**

Create `packages/components/src/tag/__tests__/tag.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from '../tag.vue'

describe('Tag', () => {
  it('renders slot content with color class', () => {
    const wrapper = mount(Tag, {
      props: {
        color: 'success'
      },
      slots: {
        default: 'Active'
      }
    })

    expect(wrapper.classes()).toContain('aheart-tag')
    expect(wrapper.classes()).toContain('aheart-tag--success')
    expect(wrapper.text()).toContain('Active')
  })

  it('emits close when closable close button is clicked', async () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true
      },
      slots: {
        default: 'Closable'
      }
    })

    await wrapper.find('.aheart-tag__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Create Badge failing tests**

Create `packages/components/src/badge/__tests__/badge.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from '../badge.vue'

describe('Badge', () => {
  it('renders count with overflow text', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 120,
        overflowCount: 99
      },
      slots: {
        default: '<span>Inbox</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-badge')
    expect(wrapper.find('.aheart-badge__count').text()).toBe('99+')
  })

  it('renders a dot badge', () => {
    const wrapper = mount(Badge, {
      props: {
        dot: true
      }
    })

    expect(wrapper.find('.aheart-badge__dot').exists()).toBe(true)
  })

  it('renders standalone status with text', () => {
    const wrapper = mount(Badge, {
      props: {
        status: 'success',
        text: 'Online'
      }
    })

    expect(wrapper.classes()).toContain('aheart-badge--status')
    expect(wrapper.find('.aheart-badge__status-dot').classes()).toContain('aheart-badge__status-dot--success')
    expect(wrapper.text()).toContain('Online')
  })
})
```

- [ ] **Step 3: Create Alert failing tests**

Create `packages/components/src/alert/__tests__/alert.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from '../alert.vue'

describe('Alert', () => {
  it('renders role alert with type class and content', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'success',
        message: 'Saved',
        description: 'The record has been saved.',
        showIcon: true
      }
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.classes()).toContain('aheart-alert--success')
    expect(wrapper.find('.aheart-alert__icon').exists()).toBe(true)
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('The record has been saved.')
  })

  it('emits close when closable close button is clicked', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        message: 'Closable'
      }
    })

    await wrapper.find('.aheart-alert__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
```

- [ ] **Step 4: Create Spin failing tests**

Create `packages/components/src/spin/__tests__/spin.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Spin from '../spin.vue'

describe('Spin', () => {
  it('renders spinner with aria busy and tip', () => {
    const wrapper = mount(Spin, {
      props: {
        tip: 'Loading',
        size: 'large'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.classes()).toContain('aheart-spin--large')
    expect(wrapper.text()).toContain('Loading')
  })

  it('wraps default content and marks container loading', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: true
      },
      slots: {
        default: '<section>Content</section>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-spin-nested')
    expect(wrapper.find('.aheart-spin-container').classes()).toContain('is-blur')
    expect(wrapper.text()).toContain('Content')
  })

  it('hides spinner when spinning is false', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: false
      }
    })

    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(false)
  })
})
```

- [ ] **Step 5: Create Empty failing tests**

Create `packages/components/src/empty/__tests__/empty.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Empty from '../empty.vue'

describe('Empty', () => {
  it('renders default description', () => {
    const wrapper = mount(Empty)

    expect(wrapper.classes()).toContain('aheart-empty')
    expect(wrapper.text()).toContain('No Data')
  })

  it('uses description prop before locale', () => {
    const wrapper = mount(Empty, {
      props: {
        description: 'Nothing here'
      }
    })

    expect(wrapper.text()).toContain('Nothing here')
  })

  it('uses ConfigProvider empty locale fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: {
          empty: {
            description: '暂无内容'
          }
        }
      },
      slots: {
        default: {
          render() {
            return h(Empty)
          }
        }
      }
    })

    expect(wrapper.text()).toContain('暂无内容')
  })

  it('renders image and default action slots', () => {
    const wrapper = mount(Empty, {
      slots: {
        image: '<span class="custom-image">image</span>',
        default: '<button>Create</button>'
      }
    })

    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Create')
  })
})
```

- [ ] **Step 6: Run RED tests**

Run:

```bash
pnpm --filter ./packages/components test -- tag badge alert spin empty
```

Expected: FAIL because component files do not exist.

## Task 2: Implement Tag And Badge

**Files:**
- Create: `packages/components/src/tag/tag.vue`
- Create: `packages/components/src/tag/types.ts`
- Create: `packages/components/src/tag/style.css`
- Create: `packages/components/src/tag/index.ts`
- Create: `packages/components/src/badge/badge.vue`
- Create: `packages/components/src/badge/types.ts`
- Create: `packages/components/src/badge/style.css`
- Create: `packages/components/src/badge/index.ts`

- [ ] **Step 1: Create Tag files**

Create `packages/components/src/tag/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | string

export const tagProps = {
  color: {
    type: String as PropType<TagColor>,
    default: 'default'
  },
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
  <span class="aheart-tag" :class="tagClass" :style="tagStyle">
    <span class="aheart-tag__content">
      <slot />
    </span>
    <button v-if="closable" class="aheart-tag__close" type="button" aria-label="Close" @click="handleClose">
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tagEmits, tagProps } from './types'
import './style.css'

defineOptions({
  name: 'ATag'
})

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const presetColors = ['default', 'primary', 'success', 'warning', 'danger']
const isPresetColor = computed(() => presetColors.includes(props.color))

const tagClass = computed(() => ({
  [`aheart-tag--${props.color}`]: isPresetColor.value,
  'is-custom-color': !isPresetColor.value
}))

const tagStyle = computed(() => ({
  '--aheart-tag-color': isPresetColor.value ? undefined : props.color
}))

const handleClose = (event: MouseEvent) => {
  emit('close', event)
}
</script>
```

Create `packages/components/src/tag/style.css` and `packages/components/src/tag/index.ts`:

```css
.aheart-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--aheart-spacing-xs);
  min-height: 22px;
  padding: 0 7px;
  border: 1px solid var(--aheart-color-border);
  border-radius: var(--aheart-radius-sm);
  background: var(--aheart-color-fill);
  color: var(--aheart-color-text);
  font-size: var(--aheart-font-size-sm);
  line-height: 20px;
}

.aheart-tag--primary {
  border-color: var(--aheart-color-primary);
  background: color-mix(in srgb, var(--aheart-color-primary) 12%, white);
  color: var(--aheart-color-primary);
}

.aheart-tag--success {
  border-color: var(--aheart-color-success);
  background: color-mix(in srgb, var(--aheart-color-success) 12%, white);
  color: var(--aheart-color-success);
}

.aheart-tag--warning {
  border-color: var(--aheart-color-warning);
  background: color-mix(in srgb, var(--aheart-color-warning) 12%, white);
  color: var(--aheart-color-warning);
}

.aheart-tag--danger {
  border-color: var(--aheart-color-danger);
  background: color-mix(in srgb, var(--aheart-color-danger) 12%, white);
  color: var(--aheart-color-danger);
}

.aheart-tag.is-custom-color {
  border-color: var(--aheart-tag-color);
  color: var(--aheart-tag-color);
  background: color-mix(in srgb, var(--aheart-tag-color) 12%, white);
}

.aheart-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}
```

```ts
import tag from './tag.vue'
import { withInstall } from '../utils/install'

const Tag = withInstall(tag, 'ATag')

export default Tag
```

- [ ] **Step 2: Create Badge files**

Create `packages/components/src/badge/types.ts`:

```ts
import type { ExtractPropTypes, PropType } from 'vue'

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'

export const badgeProps = {
  count: [Number, String] as PropType<number | string>,
  dot: Boolean,
  status: String as PropType<BadgeStatus>,
  text: String,
  overflowCount: {
    type: Number,
    default: 99
  }
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>
```

Create `packages/components/src/badge/badge.vue`:

```vue
<template>
  <span class="aheart-badge" :class="badgeClass">
    <slot />
    <sup v-if="dot" class="aheart-badge__dot" />
    <sup v-else-if="count !== undefined" class="aheart-badge__count">{{ displayCount }}</sup>
    <template v-if="status">
      <span class="aheart-badge__status-dot" :class="`aheart-badge__status-dot--${status}`" />
      <span v-if="text" class="aheart-badge__status-text">{{ text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { badgeProps } from './types'
import './style.css'

defineOptions({
  name: 'ABadge'
})

const props = defineProps(badgeProps)

const displayCount = computed(() => {
  if (typeof props.count === 'number' && props.count > props.overflowCount) {
    return `${props.overflowCount}+`
  }

  return props.count
})

const badgeClass = computed(() => ({
  'aheart-badge--status': props.status,
  'aheart-badge--standalone': !props.count && !props.dot
}))
</script>
```

Create `packages/components/src/badge/style.css`:

```css
.aheart-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.aheart-badge__count,
.aheart-badge__dot {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.aheart-badge__count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--aheart-color-danger);
  color: #fff;
  font-size: var(--aheart-font-size-sm);
  line-height: 20px;
  text-align: center;
}

.aheart-badge__dot,
.aheart-badge__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--aheart-color-danger);
}

.aheart-badge--status {
  gap: var(--aheart-spacing-xs);
}

.aheart-badge--standalone {
  line-height: var(--aheart-line-height);
}

.aheart-badge__status-dot {
  display: inline-block;
}

.aheart-badge__status-dot--success {
  background: var(--aheart-color-success);
}

.aheart-badge__status-dot--processing {
  background: var(--aheart-color-primary);
}

.aheart-badge__status-dot--default {
  background: var(--aheart-color-text-secondary);
}

.aheart-badge__status-dot--error {
  background: var(--aheart-color-danger);
}

.aheart-badge__status-dot--warning {
  background: var(--aheart-color-warning);
}

.aheart-badge__status-text {
  color: var(--aheart-color-text);
  font-size: var(--aheart-font-size);
}
```

Create `packages/components/src/badge/index.ts`:

```ts
import badge from './badge.vue'
import { withInstall } from '../utils/install'

const Badge = withInstall(badge, 'ABadge')

export default Badge
```

- [ ] **Step 3: Run Tag and Badge GREEN tests**

Run:

```bash
pnpm --filter ./packages/components test -- tag badge
pnpm --filter ./packages/components typecheck
```

Expected: Tag and Badge tests pass and typecheck exits 0.

## Task 3: Implement Alert, Spin, And Empty

**Files:**
- Create: `packages/components/src/alert/*`
- Create: `packages/components/src/spin/*`
- Create: `packages/components/src/empty/*`

- [ ] **Step 1: Create Alert**

Create `packages/components/src/alert/types.ts`, `alert.vue`, `style.css`, and `index.ts`. The component must use `role="alert"`, emit `close`, render message/description/default slot, and show an icon when `showIcon` is true.

- [ ] **Step 2: Create Spin**

Create `packages/components/src/spin/types.ts`, `spin.vue`, `style.css`, and `index.ts`. The component must default `spinning` to true, render `.aheart-spin__indicator` only while spinning, add `aria-busy`, support `tip`, and render `.aheart-spin-container.is-blur` when default slot content is present.

- [ ] **Step 3: Create Empty**

Create `packages/components/src/empty/types.ts`, `empty.vue`, `style.css`, and `index.ts`. The component must prefer `description`, then ConfigProvider `locale.empty.description`, then `No Data`; it must render an image slot and default action slot.

- [ ] **Step 4: Export components**

Update `packages/components/src/index.ts` to import, install, and export `Tag`, `Badge`, `Alert`, `Spin`, and `Empty`.

- [ ] **Step 5: Run GREEN tests**

Run:

```bash
pnpm --filter ./packages/components test -- tag badge alert spin empty
pnpm --filter ./packages/components typecheck
```

Expected: tests pass and typecheck exits 0.

- [ ] **Step 6: Commit display and feedback primitives**

Run:

```bash
git add packages/components/src/tag packages/components/src/badge packages/components/src/alert packages/components/src/spin packages/components/src/empty packages/components/src/index.ts
git commit -m "feat: add display and feedback primitives"
```

Expected: Commit created.

## Task 4: Document Components

**Files:**
- Modify: `docs/.vitepress/config.ts`
- Modify: `docs/.vitepress/data/components.ts`
- Create: `docs/components/tag.md`
- Create: `docs/components/badge.md`
- Create: `docs/components/alert.md`
- Create: `docs/components/spin.md`
- Create: `docs/components/empty.md`

- [ ] **Step 1: Update docs metadata and sidebar**

Set Tag, Badge, Alert, Spin, and Empty to `Ready` with links in `docs/.vitepress/data/components.ts`.

Add sidebar entries:

```ts
{ text: 'Tag 标签', link: '/components/tag' },
{ text: 'Badge 徽标', link: '/components/badge' },
{ text: 'Alert 警告提示', link: '/components/alert' },
{ text: 'Spin 加载中', link: '/components/spin' },
{ text: 'Empty 空状态', link: '/components/empty' }
```

- [ ] **Step 2: Create docs pages**

Create exact docs pages for `tag`, `badge`, `alert`, `spin`, and `empty`. Each page must include a Ready heading, a short English description, at least one live `<div class="aheart-demo-panel">` example, a Vue code block, API table, slots/events table when the component has one, and theme token notes.

- [ ] **Step 3: Run docs build**

Run:

```bash
pnpm docs:build
```

Expected: docs build exits 0.

- [ ] **Step 4: Commit docs**

Run:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/tag.md docs/components/badge.md docs/components/alert.md docs/components/spin.md docs/components/empty.md
git commit -m "docs: add display and feedback documentation"
```

Expected: Commit created.

## Task 5: Full Verification

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
git commit -m "build: update display and feedback outputs"
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

- This plan covers five lightweight components only.
- Empty explicitly proves ConfigProvider locale consumption outside Button.
- Components with global APIs, portals, or focus traps remain out of scope for later slices.
