# Ant Style Alert Renderable Closable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Alert renderable content props, object `closable` config, and Ant semantic aliases while preserving current Aheart compatibility.

**Architecture:** Extend the existing `AAlert` component in place. Types gain renderable props and `AlertClosableConfig`; the Vue component gains a local render-node helper, closable config resolution, and semantic alias merging.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `AAlert` `title`, `message`, `description`, `action`, `icon`, and `closeIcon` as `VNodeChild`.
- `AAlert` `closable` as `boolean | AlertClosableConfig`.
- `AAlert` semantic aliases `section` and `actions`.
- Docs and generated `es` / `lib` outputs.

This plan does not add close animations or remove existing compatibility aliases.

## Files

- Modify: `packages/components/src/alert/types.ts`
- Modify: `packages/components/src/alert/alert.vue`
- Modify: `packages/components/src/alert/__tests__/alert.test.ts`
- Modify: `docs/components/alert.md`
- Generated after build: `packages/components/es/alert/*`
- Generated after build: `packages/components/lib/alert/*`
- Generated after build: `packages/components/es/style.css`
- Generated after build: `packages/components/lib/style.css`

## Task 1: Write Failing Alert Tests

- [ ] **Step 1: Add tests in `packages/components/src/alert/__tests__/alert.test.ts`**

Add imports:

```ts
import { h } from 'vue'
import { vi } from 'vitest'
```

Add this test for renderable props:

```ts
it('renders vnode content props for message description action icon and close icon', () => {
  const wrapper = mount(Alert, {
    props: {
      message: h('span', { class: 'message-node' }, 'Node message'),
      description: h('span', { class: 'description-node' }, 'Node description'),
      action: h('button', { class: 'action-node' }, 'Act'),
      icon: h('span', { class: 'icon-node' }, '?'),
      closeIcon: h('span', { class: 'close-node' }, 'Dismiss'),
      showIcon: true,
      closable: true
    }
  })

  expect(wrapper.find('.message-node').text()).toBe('Node message')
  expect(wrapper.find('.description-node').text()).toBe('Node description')
  expect(wrapper.find('.action-node').text()).toBe('Act')
  expect(wrapper.find('.icon-node').text()).toBe('?')
  expect(wrapper.find('.close-node').text()).toBe('Dismiss')
})
```

Add this test for object closable config:

```ts
it('supports closable config callbacks aria attributes and close icon', async () => {
  const onClose = vi.fn()
  const afterClose = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      message: 'Closable config',
      closable: {
        closeIcon: h('span', { class: 'configured-close' }, 'Close'),
        ariaLabel: 'Dismiss alert',
        ariaDescribedby: 'alert-help',
        onClose,
        afterClose
      }
    }
  })

  const button = wrapper.find('.aheart-alert__close')
  expect(button.attributes('aria-label')).toBe('Dismiss alert')
  expect(button.attributes('aria-describedby')).toBe('alert-help')
  expect(button.find('.configured-close').text()).toBe('Close')

  await button.trigger('click')

  expect(onClose).toHaveBeenCalledTimes(1)
  expect(afterClose).toHaveBeenCalledTimes(1)
  expect(wrapper.emitted('close')).toHaveLength(1)
  expect(wrapper.emitted('afterClose')).toHaveLength(1)
  expect(wrapper.find('.aheart-alert').exists()).toBe(false)
})
```

Add this test for semantic aliases:

```ts
it('supports Ant section and actions semantic aliases alongside local aliases', () => {
  const wrapper = mount(Alert, {
    props: {
      message: 'Semantic alert',
      action: 'Details',
      classNames: {
        content: 'local-content',
        section: 'ant-section',
        action: 'local-action',
        actions: 'ant-actions'
      },
      styles: {
        content: { paddingInlineStart: '2px' },
        section: { paddingInlineEnd: '4px' },
        action: { marginInlineStart: '8px' },
        actions: { marginInlineEnd: '10px' }
      }
    }
  })

  const content = wrapper.find('.aheart-alert__content')
  expect(content.classes()).toEqual(expect.arrayContaining(['local-content', 'ant-section']))
  expect(content.attributes('style')).toContain('padding-inline-start: 2px')
  expect(content.attributes('style')).toContain('padding-inline-end: 4px')

  const action = wrapper.find('.aheart-alert__action')
  expect(action.classes()).toEqual(expect.arrayContaining(['local-action', 'ant-actions']))
  expect(action.attributes('style')).toContain('margin-inline-start: 8px')
  expect(action.attributes('style')).toContain('margin-inline-end: 10px')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- alert
```

Expected: the new tests fail because renderable props, object `closable`, and Ant semantic aliases are not implemented yet.

## Task 2: Implement Alert API Additions

- [ ] **Step 1: Extend `packages/components/src/alert/types.ts`**

Add `VNodeChild`, `AlertRenderable`, `AlertClosableConfig`, and semantic aliases:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type AlertRenderable = VNodeChild
export type AlertSemanticPart =
  | 'root'
  | 'icon'
  | 'content'
  | 'section'
  | 'title'
  | 'description'
  | 'action'
  | 'actions'
  | 'close'
export interface AlertClosableConfig {
  closeIcon?: AlertRenderable
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  onClose?: (event: MouseEvent) => void
  afterClose?: () => void
}
```

Use `AlertRenderable` for `title`, `message`, `description`, `action`, `icon`, and `closeIcon`. Set `closable` prop type to `[Boolean, Object] as PropType<boolean | AlertClosableConfig>`.

- [ ] **Step 2: Update `packages/components/src/alert/alert.vue`**

Add a local `ARenderNode`, render all node-like props through it, resolve closable object config, and merge `content` + `section` and `action` + `actions` semantic classes/styles.

- [ ] **Step 3: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- alert
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Alert tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/alert.md`**

Add examples for renderable content and object `closable`. Expand API and semantic DOM docs.

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

Expected: Alert `es` / `lib` outputs update.

- [ ] **Step 4: Final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git status --short --branch
```

Expected: all commands pass and the worktree is clean after committing.
