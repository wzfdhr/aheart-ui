# Ant Style Modal Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Modal and Drawer as Ready Feedback components.

**Architecture:** Modal and Drawer are focused controlled overlay components rendered inline when `open` is true. They share close semantics through masks, close buttons, Escape handling, and `update:open(false)` events while keeping their props and styles component-local.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Modal`
- `Drawer`
- package root exports and plugin install
- docs pages and Ready status
- package build output refresh

This plan does not cover static Modal methods, portal mounting, transition animations, nested Drawer push behavior, Drawer resizable mode, or the remaining Tooltip, Popover, and Popconfirm components.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/modal/__tests__/modal.test.ts`
- Create: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Create Modal tests**

Create `packages/components/src/modal/__tests__/modal.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Modal from '../modal.vue'

describe('Modal', () => {
  it('renders title content footer centered state and width when open', () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Edit profile', centered: true, width: 480 },
      slots: { default: 'Profile form' }
    })

    expect(wrapper.find('.aheart-modal').exists()).toBe(true)
    expect(wrapper.find('.aheart-modal__dialog').classes()).toContain('is-centered')
    expect(wrapper.find('.aheart-modal__dialog').attributes('style')).toContain('width: 480px')
    expect(wrapper.text()).toContain('Edit profile')
    expect(wrapper.text()).toContain('Profile form')
    expect(wrapper.text()).toContain('OK')
    expect(wrapper.text()).toContain('Cancel')
  })

  it('emits ok cancel close and update events from footer buttons', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, okText: 'Save', cancelText: 'Back' }
    })

    await wrapper.find('.aheart-modal__ok').trigger('click')
    expect(wrapper.emitted('ok')).toHaveLength(1)

    await wrapper.find('.aheart-modal__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('closes from the mask only when maskClosable is true', async () => {
    const closable = mount(Modal, { props: { open: true } })
    await closable.find('.aheart-modal__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Modal, { props: { open: true, maskClosable: false } })
    await locked.find('.aheart-modal__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('closes from Escape only when keyboard is true', async () => {
    const closable = mount(Modal, { props: { open: true } })
    await closable.find('.aheart-modal').trigger('keydown', { key: 'Escape' })
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Modal, { props: { open: true, keyboard: false } })
    await locked.find('.aheart-modal').trigger('keydown', { key: 'Escape' })
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('does not render overlay nodes when closed', () => {
    const wrapper = mount(Modal, { props: { open: false, title: 'Hidden' } })

    expect(wrapper.find('.aheart-modal').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Hidden')
  })
})
```

- [ ] **Step 2: Create Drawer tests**

Create `packages/components/src/drawer/__tests__/drawer.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Drawer from '../drawer.vue'

describe('Drawer', () => {
  it('renders title content extra placement and width when open', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, title: 'Filters', placement: 'left', width: 320 },
      slots: {
        default: 'Filter form',
        extra: '<button class="extra-action">Reset</button>'
      }
    })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
    expect(wrapper.find('.aheart-drawer__panel').classes()).toContain('aheart-drawer__panel--left')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('width: 320px')
    expect(wrapper.text()).toContain('Filters')
    expect(wrapper.text()).toContain('Filter form')
    expect(wrapper.find('.extra-action').text()).toBe('Reset')
  })

  it('uses height for top and bottom placements', () => {
    const wrapper = mount(Drawer, {
      props: { open: true, placement: 'bottom', height: '42vh' }
    })

    expect(wrapper.find('.aheart-drawer__panel').classes()).toContain('aheart-drawer__panel--bottom')
    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('height: 42vh')
  })

  it('emits close and update events from the close button', async () => {
    const wrapper = mount(Drawer, { props: { open: true, title: 'Details' } })

    await wrapper.find('.aheart-drawer__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('closes from the mask only when maskClosable is true', async () => {
    const closable = mount(Drawer, { props: { open: true } })
    await closable.find('.aheart-drawer__mask').trigger('click')
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Drawer, { props: { open: true, maskClosable: false } })
    await locked.find('.aheart-drawer__mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('closes from Escape only when keyboard is true', async () => {
    const closable = mount(Drawer, { props: { open: true } })
    await closable.find('.aheart-drawer').trigger('keydown', { key: 'Escape' })
    expect(closable.emitted('update:open')?.[0]).toEqual([false])

    const locked = mount(Drawer, { props: { open: true, keyboard: false } })
    await locked.find('.aheart-drawer').trigger('keydown', { key: 'Escape' })
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('does not render overlay nodes when closed', () => {
    const wrapper = mount(Drawer, { props: { open: false, title: 'Hidden' } })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Hidden')
  })
})
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- modal drawer
```

Expected: FAIL because Modal and Drawer implementation files do not exist.

## Task 2: Implement Modal And Drawer

**Files:**
- Create: `packages/components/src/modal/modal.vue`
- Create: `packages/components/src/modal/types.ts`
- Create: `packages/components/src/modal/style.css`
- Create: `packages/components/src/modal/index.ts`
- Create: `packages/components/src/drawer/drawer.vue`
- Create: `packages/components/src/drawer/types.ts`
- Create: `packages/components/src/drawer/style.css`
- Create: `packages/components/src/drawer/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create component files**

Create component files matching `docs/superpowers/specs/2026-06-22-ant-style-modal-drawer-design.md`.

The implementation must:

- render `AModal` only when `open` is true
- render `ADrawer` only when `open` is true
- support close buttons, masks, Escape close, and `update:open(false)` events
- support Modal title/default/footer slots and default OK/Cancel footer
- support Drawer title/default/extra/footer slots, placement, width, and height

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so Modal and Drawer are imported, registered, and exported.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- modal drawer
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/modal packages/components/src/drawer packages/components/src/index.ts
git commit -m "feat: add modal and drawer components"
```

## Task 3: Add Documentation

**Files:**
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/modal.md`
- Create: `docs/components/drawer.md`

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Modal` -> Ready with `/components/modal`
- `Drawer` -> Ready with `/components/drawer`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Modal 对话框`
- `Drawer 抽屉`

- [ ] **Step 3: Create component docs**

Create `docs/components/modal.md` and `docs/components/drawer.md` with:

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
git add docs/.vitepress/data/components.ts docs/.vitepress/config.ts docs/components/modal.md docs/components/drawer.md
git commit -m "docs: add modal and drawer documentation"
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
test -f packages/components/es/modal/index.d.ts && test -f packages/components/es/drawer/index.d.ts && test -f packages/components/lib/modal/index.d.ts && test -f packages/components/lib/drawer/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
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
git commit -m "build: update modal and drawer outputs"
```

## Self-Review

- Spec coverage: all Modal and Drawer design requirements map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `ModalProps`, `ModalEmits`, `DrawerProps`, and `DrawerPlacement` names are consistent across the plan.
