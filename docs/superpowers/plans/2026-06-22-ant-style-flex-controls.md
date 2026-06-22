# Ant Style Flex Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design Flex configuration parity to `AFlex` while preserving existing Aheart layout aliases.

**Architecture:** Extend the existing Flex component in place. The root stays a single rendered element, now chosen by `component`, with computed classes preserving current alias behavior and computed styles applying CSS-compatible layout values.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `AFlex` `className`, `rootClassName`, and `style`.
- Ant-style `orientation`, `component`, and `flex`.
- CSS-value compatible `wrap`, `justify`, `align`, and `gap`.
- Docs and generated `es` / `lib` outputs.

This plan does not add `classNames` or `styles` semantic maps because Ant Flex does not expose a Semantic DOM table.

## Files

- Modify: `packages/components/src/flex/types.ts`
- Modify: `packages/components/src/flex/flex.vue`
- Modify: `packages/components/src/flex/__tests__/flex.test.ts`
- Modify: `docs/components/flex.md`
- Generated after build: `packages/components/es/flex/*`
- Generated after build: `packages/components/lib/flex/*`

## Task 1: Write Failing Flex Tests

- [ ] **Step 1: Add tests in `packages/components/src/flex/__tests__/flex.test.ts`**

Add this test for root configuration, component rendering, and CSS-compatible values:

```ts
it('supports root hooks custom component and CSS-compatible layout values', () => {
  const wrapper = mount(Flex, {
    props: {
      component: 'section',
      orientation: 'horizontal',
      vertical: true,
      wrap: 'wrap-reverse',
      justify: 'space-between',
      align: 'flex-start',
      gap: '2rem',
      flex: '1 1 auto',
      className: 'flex-class',
      rootClassName: 'flex-root',
      style: { marginTop: '4px' }
    },
    slots: {
      default: '<span>One</span><span>Two</span>'
    }
  })

  expect(wrapper.element.tagName).toBe('SECTION')
  expect(wrapper.classes()).toContain('flex-class')
  expect(wrapper.classes()).toContain('flex-root')
  expect(wrapper.classes()).toContain('aheart-flex--horizontal')
  expect(wrapper.classes()).not.toContain('is-vertical')
  expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: 2rem')
  expect(wrapper.attributes('style')).toContain('flex-wrap: wrap-reverse')
  expect(wrapper.attributes('style')).toContain('justify-content: space-between')
  expect(wrapper.attributes('style')).toContain('align-items: flex-start')
  expect(wrapper.attributes('style')).toContain('flex: 1 1 auto')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
})
```

Add this test for `medium` gap and existing alias preservation:

```ts
it('supports Ant medium gap and keeps local justify aliases', () => {
  const wrapper = mount(Flex, {
    props: {
      justify: 'between',
      align: 'center',
      gap: 'medium',
      wrap: 'reverse'
    }
  })

  expect(wrapper.classes()).toContain('aheart-flex--justify-between')
  expect(wrapper.classes()).toContain('aheart-flex--align-center')
  expect(wrapper.classes()).toContain('is-wrap-reverse')
  expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: var(--aheart-spacing-md)')
  expect(wrapper.attributes('style')).toContain('justify-content: space-between')
  expect(wrapper.attributes('style')).toContain('align-items: center')
  expect(wrapper.attributes('style')).toContain('flex-wrap: wrap-reverse')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- flex
```

Expected: the new tests fail because Flex does not yet implement these props and CSS-compatible style merging.

## Task 2: Implement Flex API Additions

- [ ] **Step 1: Extend `packages/components/src/flex/types.ts`**

Add `StyleValue` import, broader string unions, `orientation`, `component`, `flex`, and root hook props.

- [ ] **Step 2: Update `packages/components/src/flex/flex.vue`**

Render `<component :is="component || 'div'">`, compute direction from `orientation || vertical`, preserve existing classes, and merge layout styles with `props.style`.

- [ ] **Step 3: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- flex
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Flex tests and package typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/flex.md`**

Add custom element and root styling examples. Expand the API table.

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

Expected: Flex `es` / `lib` outputs update.

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
