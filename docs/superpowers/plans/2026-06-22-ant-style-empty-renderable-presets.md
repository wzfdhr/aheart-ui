# Ant Style Empty Renderable Presets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Empty renderable `image` / `description` props and static preset image constants while preserving existing Empty behavior.

**Architecture:** Extend the existing `AEmpty` implementation in place. Types gain renderable prop support and preset constants; `empty.vue` gains a small render-node helper and preset resolution; `empty/index.ts` attaches static constants to the installed component and re-exports them.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `AEmpty.description` as `VNodeChild | false`.
- `AEmpty.image` as URL string, `VNodeChild`, preset constant, or `false`.
- `Empty.PRESENTED_IMAGE_DEFAULT` and `Empty.PRESENTED_IMAGE_SIMPLE`.
- Named exports `PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE`.
- Docs and generated `es` / `lib` outputs.

This plan does not integrate Empty with other components.

## Files

- Modify: `packages/components/src/empty/types.ts`
- Modify: `packages/components/src/empty/empty.vue`
- Modify: `packages/components/src/empty/index.ts`
- Modify: `packages/components/src/empty/style.css`
- Modify: `packages/components/src/empty/__tests__/empty.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/components/empty.md`
- Generated after build: `packages/components/es/empty/*`
- Generated after build: `packages/components/lib/empty/*`
- Generated after build: package root `packages/components/es/index.*`
- Generated after build: package root `packages/components/lib/index.*`

## Task 1: Write Failing Empty Tests

- [ ] **Step 1: Add tests in `packages/components/src/empty/__tests__/empty.test.ts`**

Add an import for the installed component:

```ts
import EmptyInstall from '../index'
```

Add this test for renderable props:

```ts
it('renders vnode description and image props', () => {
  const wrapper = mount(Empty, {
    props: {
      description: h('span', { class: 'description-node' }, 'Node description'),
      image: h('span', { class: 'image-node' }, 'Node image')
    }
  })

  expect(wrapper.find('.description-node').text()).toBe('Node description')
  expect(wrapper.find('.image-node').text()).toBe('Node image')
  expect(wrapper.find('.aheart-empty__image img').exists()).toBe(false)
})
```

Add this test for static presets:

```ts
it('exposes and renders built-in image presets', () => {
  const emptyWithPresets = EmptyInstall as typeof EmptyInstall & {
    PRESENTED_IMAGE_DEFAULT?: unknown
    PRESENTED_IMAGE_SIMPLE?: unknown
  }

  expect(emptyWithPresets.PRESENTED_IMAGE_DEFAULT).toBeTruthy()
  expect(emptyWithPresets.PRESENTED_IMAGE_SIMPLE).toBeTruthy()

  const defaultWrapper = mount(Empty, {
    props: {
      image: emptyWithPresets.PRESENTED_IMAGE_DEFAULT,
      description: 'Default preset'
    }
  })
  expect(defaultWrapper.find('.aheart-empty__default-image').exists()).toBe(true)

  const simpleWrapper = mount(Empty, {
    props: {
      image: emptyWithPresets.PRESENTED_IMAGE_SIMPLE,
      description: 'Simple preset'
    }
  })
  expect(simpleWrapper.find('.aheart-empty__simple-image').exists()).toBe(true)
})
```

- [ ] **Step 2: Run focused test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- empty
```

Expected: the new tests fail because VNode props and static presets are not implemented yet.

## Task 2: Implement Empty Renderable Props And Presets

- [ ] **Step 1: Extend `packages/components/src/empty/types.ts`**

Add `VNodeChild`, renderable types, and internal preset constants:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export const EMPTY_PRESENTED_IMAGE_DEFAULT = '__AHEART_EMPTY_PRESENTED_IMAGE_DEFAULT__' as const
export const EMPTY_PRESENTED_IMAGE_SIMPLE = '__AHEART_EMPTY_PRESENTED_IMAGE_SIMPLE__' as const

export type EmptyRenderable = VNodeChild
export type EmptyPresetImage = typeof EMPTY_PRESENTED_IMAGE_DEFAULT | typeof EMPTY_PRESENTED_IMAGE_SIMPLE
export type EmptyImage = EmptyRenderable | EmptyPresetImage | false
export type EmptyDescription = EmptyRenderable | false
```

Use a renderable prop type for `description` and `image` that accepts string, number, boolean, object, array, and function values.

- [ ] **Step 2: Update `packages/components/src/empty/empty.vue`**

Add a local `AEmptyRenderNode`, detect URL strings versus preset constants, render the default preset through the existing `.aheart-empty__default-image`, and render the simple preset through `.aheart-empty__simple-image`.

- [ ] **Step 3: Update `packages/components/src/empty/index.ts`**

Attach static constants to the installed component:

```ts
Empty.PRESENTED_IMAGE_DEFAULT = PRESENTED_IMAGE_DEFAULT
Empty.PRESENTED_IMAGE_SIMPLE = PRESENTED_IMAGE_SIMPLE
```

Export the constants from the component entry.

- [ ] **Step 4: Update `packages/components/src/index.ts`**

Re-export `PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE` from the package root.

- [ ] **Step 5: Update `packages/components/src/empty/style.css`**

Add `.aheart-empty__simple-image` styling as a compact placeholder.

- [ ] **Step 6: Run focused tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- empty
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: focused Empty tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/empty.md`**

Add examples for `Empty.PRESENTED_IMAGE_SIMPLE` and renderable `description` props, then update the API and static constant sections.

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

Expected: Empty `es` / `lib` outputs and package root exports update.

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

## Self-Review

- Spec coverage: every Empty renderable and preset requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, export, and static constant names match the design document.
