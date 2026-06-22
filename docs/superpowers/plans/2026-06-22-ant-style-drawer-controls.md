# Ant Style Drawer Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for the source change and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Drawer configuration for sizing, loading, semantic styling, root/panel styling, rendering lifecycle, and open-state lifecycle events.

**Architecture:** Keep the existing single `drawer.vue` component. Extend `types.ts` with Drawer semantic styling types, derive root/panel/body classes and styles in computed values, use the existing Skeleton component for loading, and control render persistence with a small internal `hasRendered` state.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Drawer.size`
- `Drawer.loading`
- `Drawer.extra`
- `Drawer.zIndex`
- `Drawer.className`
- `Drawer.rootClassName`
- `Drawer.style`
- `Drawer.rootStyle`
- `Drawer.classNames`
- `Drawer.styles`
- `Drawer.forceRender`
- `Drawer.destroyOnHidden`
- `afterOpenChange`
- docs and generated package output refresh

This plan does not cover portals, resizable drawers, nested push behavior, focus trap management, close icon placement objects, or function-valued semantic styling callbacks.

## Task 1: Write Failing Drawer Tests

**Files:**

- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] Add tests for `size` presets and custom sizes.
- [ ] Add tests for `loading` rendering Skeleton and hiding body slot content.
- [ ] Add tests for `extra` prop rendering when no `extra` slot is present.
- [ ] Add tests for `rootClassName`, `className`, `classNames`, `rootStyle`, `style`, `styles`, and `zIndex`.
- [ ] Add tests for `afterOpenChange`, `forceRender`, and `destroyOnHidden`.
- [ ] Run the focused Drawer tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- drawer
```

Expected: FAIL before implementation.

## Task 2: Implement Drawer Controls

**Files:**

- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`
- Modify: `packages/components/src/drawer/style.css`

- [ ] Extend Drawer types for size, semantic parts, class/style hooks, loading, force rendering, and lifecycle events.
- [ ] Resolve size based on placement, `size`, and legacy `width`/`height`.
- [ ] Render Skeleton in body when `loading` is true.
- [ ] Render `extra` prop only when no `extra` slot exists.
- [ ] Apply root, panel, and semantic classes/styles.
- [ ] Track render persistence for `forceRender`, `destroyOnHidden`, and `destroyOnClose`.
- [ ] Emit `afterOpenChange(open)` when `open` changes.
- [ ] Run focused Drawer tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- drawer
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/drawer.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for loading, preset size, and semantic styling.
- [ ] Update Drawer API, events, and slots sections.
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

Expected: all pass, generated declaration files include the new Drawer control types, and `docs/.vitepress/dist/superpowers` is not created.
