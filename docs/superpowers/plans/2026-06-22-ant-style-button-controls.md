# Ant Style Button Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Button icon placement, delayed loading, loading-icon slot, and semantic class/style hooks.

**Architecture:** Keep the existing `button.vue` component. Extend `types.ts`, render normal icons through an icon wrapper, manage delayed loading with a small watcher, and apply root/content/icon hooks through computed class and style values.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Button.icon`
- `Button.iconPlacement`
- `Button.iconPosition`
- `Button.loading={{ delay }}`
- `Button.className`
- `Button.rootClassName`
- `Button.style`
- `Button.classNames`
- `Button.styles`
- `icon` slot
- `loadingIcon` slot
- docs and generated package output refresh

This plan does not cover Button `color`, Button `variant`, Chinese auto-spacing, or wave effects.

## Task 1: Write Failing Button Tests

**Files:**

- Modify: `packages/components/src/button/__tests__/button.test.ts`

- [ ] Add a test that `icon` renders an icon wrapper before content.
- [ ] Add a test that the `icon` slot overrides the `icon` prop.
- [ ] Add a test that `iconPlacement="end"` renders the icon after content.
- [ ] Add a test that `iconPosition="end"` behaves as an alias.
- [ ] Add a fake-timer test that `loading={{ delay: 120 }}` defers the loading indicator and disabled state.
- [ ] Add a test that `loadingIcon` slot replaces the default spinner content.
- [ ] Add a test that root, icon, and content class/style hooks apply.
- [ ] Run the focused Button tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button
```

Expected: FAIL before implementation.

## Task 2: Implement Button Controls

**Files:**

- Modify: `packages/components/src/button/types.ts`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/style.css`

- [ ] Extend Button types for loading object, icon placement aliases, root hooks, and semantic hooks.
- [ ] Import `AIcon` in `button.vue` and render the `icon` prop or `icon` slot in a semantic icon wrapper.
- [ ] Render icon before content by default and after content when `iconPlacement` or `iconPosition` resolves to `end`.
- [ ] Manage delayed loading with a watcher, clearing timers on prop changes and unmount.
- [ ] Render a default spinner through an inner loading spinner element and allow the `loadingIcon` slot to replace it.
- [ ] Apply root, icon, and content class/style hooks.
- [ ] Run focused Button tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/button.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for icon placement, delayed loading, and semantic styling.
- [ ] Update Button API and slots sections.
- [ ] Run docs build.
- [ ] Run package build.
- [ ] Commit documentation separately from generated outputs where practical.

## Task 4: Final Verification

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all pass, generated declaration files include the new Button control types, and `docs/.vitepress/dist/superpowers` is not created.

## Self-Review

- Spec coverage: every Button controls requirement from the design has a task.
- Placeholder scan: no placeholders or deferred implementation notes.
- Type consistency: prop, slot, and semantic part names match the design document.
