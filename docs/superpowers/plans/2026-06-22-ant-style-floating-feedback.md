# Ant Style Floating Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Tooltip, Popover, and Popconfirm as Ready Feedback components.

**Architecture:** The components share a small floating utility module for placements, triggers, and style normalization. Tooltip, Popover, and Popconfirm each own focused markup and event behavior while following the same controlled/uncontrolled open-state pattern.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Tooltip`
- `Popover`
- `Popconfirm`
- shared floating utility types and helpers
- package root exports and plugin install
- docs pages and Ready status
- package build output refresh

This plan does not cover portal mounting, collision-aware positioning, async close guards, pointer-tracked overlays, or custom Popconfirm button render props.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/tooltip/__tests__/tooltip.test.ts`
- Create: `packages/components/src/popover/__tests__/popover.test.ts`
- Create: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [ ] **Step 1: Create Tooltip tests**

Create `packages/components/src/tooltip/__tests__/tooltip.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tooltip from '../tooltip.vue'

describe('Tooltip', () => {
  it('renders title from hover trigger', async () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Helpful text' },
      slots: { default: '<button>Help</button>' }
    })

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)

    await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Helpful text')
  })

  it('applies placement color arrow and zIndex', () => {
    const wrapper = mount(Tooltip, {
      props: { open: true, title: 'Colored', placement: 'bottomRight', color: '#111827', zIndex: 2000 },
      slots: { default: '<button>Help</button>' }
    })

    const popup = wrapper.find('.aheart-tooltip__popup')
    expect(popup.classes()).toContain('aheart-floating--bottomRight')
    expect(popup.attributes('style')).toContain('background: rgb(17, 24, 39)')
    expect(popup.attributes('style')).toContain('z-index: 2000')
    expect(wrapper.find('.aheart-tooltip__arrow').exists()).toBe(true)
  })

  it('toggles from click trigger and emits open events', async () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Clickable', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('click')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('respects controlled open state', async () => {
    const wrapper = mount(Tooltip, {
      props: { open: false, title: 'Controlled', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('click')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })
})
```

- [ ] **Step 2: Create Popover tests**

Create `packages/components/src/popover/__tests__/popover.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Popover from '../popover.vue'

describe('Popover', () => {
  it('renders title and content props when open', () => {
    const wrapper = mount(Popover, {
      props: { open: true, title: 'Card title', content: 'Card content', placement: 'rightTop' },
      slots: { default: '<button>Details</button>' }
    })

    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)
    expect(wrapper.find('.aheart-popover__popup').classes()).toContain('aheart-floating--rightTop')
    expect(wrapper.text()).toContain('Card title')
    expect(wrapper.text()).toContain('Card content')
  })

  it('renders title and content slots', () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: {
        default: '<button>Details</button>',
        title: '<strong class="custom-title">Slot title</strong>',
        content: '<div class="custom-content">Slot content</div>'
      }
    })

    expect(wrapper.find('.custom-title').text()).toBe('Slot title')
    expect(wrapper.find('.custom-content').text()).toBe('Slot content')
  })

  it('toggles from click trigger and emits open events', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Clickable', trigger: 'click' },
      slots: { default: '<button>Details</button>' }
    })

    await wrapper.find('.aheart-popover__trigger').trigger('click')

    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })
})
```

- [ ] **Step 3: Create Popconfirm tests**

Create `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Popconfirm from '../popconfirm.vue'

describe('Popconfirm', () => {
  it('opens from click trigger with title description icon and buttons', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Delete item?', description: 'This cannot be undone.' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__trigger').trigger('click')

    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Delete item?')
    expect(wrapper.text()).toContain('This cannot be undone.')
    expect(wrapper.text()).toContain('OK')
    expect(wrapper.text()).toContain('Cancel')
    expect(wrapper.find('.aheart-popconfirm__icon').exists()).toBe(true)
  })

  it('emits confirm and closes from OK', async () => {
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__ok').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('emits cancel and closes from Cancel', async () => {
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('respects disabled and showCancel options', async () => {
    const disabled = mount(Popconfirm, {
      props: { disabled: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await disabled.find('.aheart-popconfirm__trigger').trigger('click')
    expect(disabled.find('.aheart-popconfirm__popup').exists()).toBe(false)

    const withoutCancel = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?', showCancel: false },
      slots: { default: '<button>Delete</button>' }
    })

    expect(withoutCancel.find('.aheart-popconfirm__cancel').exists()).toBe(false)
    expect(withoutCancel.find('.aheart-popconfirm__ok').exists()).toBe(true)
  })
})
```

- [ ] **Step 4: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tooltip popover popconfirm
```

Expected: FAIL because Tooltip, Popover, and Popconfirm implementation files do not exist.

## Task 2: Implement Floating Feedback Components

**Files:**
- Create: `packages/components/src/utils/floating.ts`
- Create: `packages/components/src/tooltip/tooltip.vue`
- Create: `packages/components/src/tooltip/types.ts`
- Create: `packages/components/src/tooltip/style.css`
- Create: `packages/components/src/tooltip/index.ts`
- Create: `packages/components/src/popover/popover.vue`
- Create: `packages/components/src/popover/types.ts`
- Create: `packages/components/src/popover/style.css`
- Create: `packages/components/src/popover/index.ts`
- Create: `packages/components/src/popconfirm/popconfirm.vue`
- Create: `packages/components/src/popconfirm/types.ts`
- Create: `packages/components/src/popconfirm/style.css`
- Create: `packages/components/src/popconfirm/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create shared floating utilities**

Create `packages/components/src/utils/floating.ts` with placement and trigger unions, validators, and helpers for trigger normalization and popup inline style.

- [ ] **Step 2: Create component files**

Create component files matching `docs/superpowers/specs/2026-06-22-ant-style-floating-feedback-design.md`.

The implementation must:

- render `ATooltip` popups only when content exists and merged open state is true
- render `APopover` popups only when title/content exists and merged open state is true
- render `APopconfirm` popups when merged open state is true
- support controlled and uncontrolled open state for all three components
- support hover, focus, click, and contextmenu triggers
- support deterministic placement classes
- emit `update:open` and `openChange` whenever a user action requests open-state change
- emit Popconfirm `confirm` and `cancel`

- [ ] **Step 3: Update package root exports**

Modify `packages/components/src/index.ts` so Tooltip, Popover, and Popconfirm are imported, registered, and exported.

- [ ] **Step 4: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tooltip popover popconfirm
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit source**

```bash
git add packages/components/src/utils/floating.ts packages/components/src/tooltip packages/components/src/popover packages/components/src/popconfirm packages/components/src/index.ts
git commit -m "feat: add floating feedback components"
```

## Task 3: Add Documentation

**Files:**
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/tooltip.md`
- Create: `docs/components/popover.md`
- Create: `docs/components/popconfirm.md`

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Tooltip` -> Ready with `/components/tooltip`
- `Popover` -> Ready with `/components/popover`
- `Popconfirm` -> Ready with `/components/popconfirm`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Tooltip 文字提示`
- `Popover 气泡卡片`
- `Popconfirm 气泡确认框`

- [ ] **Step 3: Create component docs**

Create `docs/components/tooltip.md`, `docs/components/popover.md`, and `docs/components/popconfirm.md` with:

- Ready badge
- demos
- API tables
- event tables
- slot tables
- theme token notes

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/.vitepress/data/components.ts docs/.vitepress/config.ts docs/components/tooltip.md docs/components/popover.md docs/components/popconfirm.md
git commit -m "docs: add floating feedback documentation"
```

## Task 4: Full Verification And Build Output

**Files:**
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Check declaration output and docs exclusions**

Run:

```bash
test -f packages/components/es/tooltip/index.d.ts && test -f packages/components/es/popover/index.d.ts && test -f packages/components/es/popconfirm/index.d.ts && test -f packages/components/lib/tooltip/index.d.ts && test -f packages/components/lib/popover/index.d.ts && test -f packages/components/lib/popconfirm/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
```

Expected: `declarations-and-docs-ok`

- [ ] **Step 3: Remove generated VitePress cache**

Run:

```bash
test ! -d docs/.vitepress/cache || rm -rf docs/.vitepress/cache
```

- [ ] **Step 4: Commit build output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update floating feedback outputs"
```

## Self-Review

- Spec coverage: all Tooltip, Popover, and Popconfirm design requirements map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `FloatingPlacement`, `FloatingTrigger`, `TooltipProps`, `PopoverProps`, and `PopconfirmProps` names are consistent across the plan.
