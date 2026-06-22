# Ant Style Space Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Space semantic class and style hooks to `ASpace`, while preserving existing spacing, orientation, and separator behavior.

**Architecture:** Extend the current Space component in place. The root remains the inline-flex container; each child continues to be wrapped by an item element, and separators continue to render between items. New root and semantic props are merged into those existing DOM parts.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ASpace` `className`, `rootClassName`, and `style`.
- `ASpace` `classNames` and `styles`.
- Object and function forms for semantic maps.
- Semantic keys `root`, `item`, and `separator`.
- Node-friendly `separator` and `split` rendering.
- Docs and generated `es` / `lib` outputs.

This plan does not implement `Space.Compact` or `Space.Addon`.

## Files

- Modify: `packages/components/src/space/types.ts`
- Modify: `packages/components/src/space/space.vue`
- Modify: `packages/components/src/space/__tests__/space.test.ts`
- Modify: `docs/components/space.md`
- Generated after build: `packages/components/es/space/*`
- Generated after build: `packages/components/lib/space/*`

## Task 1: Write Failing Space Tests

- [ ] **Step 1: Add tests in `packages/components/src/space/__tests__/space.test.ts`**

Add tests that verify root, item, and separator semantic class / style hooks:

```ts
it('applies root item and separator semantic classes and styles', () => {
  const wrapper = mount(Space, {
    props: {
      separator: '|',
      size: [8, 12],
      className: 'space-class',
      rootClassName: 'space-root',
      style: { marginTop: '4px' },
      classNames: {
        root: 'semantic-root',
        item: 'semantic-item',
        separator: 'semantic-separator'
      },
      styles: {
        root: { color: 'red' },
        item: { paddingInline: '4px' },
        separator: { fontWeight: 600 }
      }
    },
    slots: {
      default: '<span>One</span><span>Two</span>'
    }
  })

  expect(wrapper.classes()).toContain('space-class')
  expect(wrapper.classes()).toContain('space-root')
  expect(wrapper.classes()).toContain('semantic-root')
  expect(wrapper.attributes('style')).toContain('--aheart-space-gap-horizontal: 8px')
  expect(wrapper.attributes('style')).toContain('--aheart-space-gap-vertical: 12px')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('color: red')

  const item = wrapper.find('.aheart-space__item')
  expect(item.classes()).toContain('semantic-item')
  expect(item.attributes('style')).toContain('padding-inline: 4px')

  const separator = wrapper.find('.aheart-space__separator')
  expect(separator.classes()).toContain('semantic-separator')
  expect(separator.attributes('style')).toContain('font-weight: 600')
})
```

Add tests that verify function-form semantic maps and VNode separator rendering:

```ts
it('supports function semantic maps and node separators', () => {
  const wrapper = mount(Space, {
    props: {
      orientation: 'vertical',
      separator: h('strong', { class: 'separator-node' }, '/'),
      classNames: ({ props }) => ({
        root: `semantic-${props.orientation}`,
        item: 'semantic-item',
        separator: 'semantic-separator'
      }),
      styles: ({ props }) => ({
        root: { justifyContent: props.orientation === 'vertical' ? 'center' : 'flex-start' },
        separator: { color: 'blue' }
      })
    },
    slots: {
      default: '<span>One</span><span>Two</span>'
    }
  })

  expect(wrapper.classes()).toContain('semantic-vertical')
  expect(wrapper.attributes('style')).toContain('justify-content: center')
  expect(wrapper.findAll('.semantic-item')).toHaveLength(2)
  expect(wrapper.find('.semantic-separator').attributes('style')).toContain('color: blue')
  expect(wrapper.find('.separator-node').text()).toBe('/')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- space
```

Expected: the new tests fail because semantic props and VNode separator rendering are not implemented.

## Task 2: Implement Space Semantic APIs

- [ ] **Step 1: Extend `packages/components/src/space/types.ts`**

Add `StyleValue` and `VNodeChild` imports, semantic map types, root props, and node-friendly separator props.

- [ ] **Step 2: Update `packages/components/src/space/space.vue`**

Add a small local render component for separator nodes. Resolve semantic maps from object or function props, merge root styles with gap variables, and apply item / separator classes and styles.

- [ ] **Step 3: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- space
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Space tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/space.md`**

Add semantic styling and node separator examples, API rows, and a Semantic DOM table.

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

Expected: Space `es` / `lib` outputs update.

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
