# Ant Style Modal Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for the source change and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Modal configuration for loading, footer button passthrough, semantic styling, root/dialog styling, render lifecycle, and open-state lifecycle events.

**Architecture:** Keep the existing `modal.vue` component. Extend `types.ts` with semantic styling types and button prop passthrough, derive root/dialog/body classes and styles with computed values, use the existing Skeleton component for loading, and control render persistence with a small internal `hasRendered` state.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Modal.loading`
- `Modal.okButtonProps`
- `Modal.cancelButtonProps`
- `Modal.zIndex`
- `Modal.className`
- `Modal.rootClassName`
- `Modal.style`
- `Modal.rootStyle`
- `Modal.classNames`
- `Modal.styles`
- `Modal.forceRender`
- `Modal.destroyOnHidden`
- `afterOpenChange`
- docs and generated package output refresh

This plan does not cover static modal APIs, portals, focus traps, async close coordination, function-valued footer renderers, or close icon customization.

## Task 1: Write Failing Modal Tests

**Files:**

- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] Add tests for `loading` rendering Skeleton and hiding body slot content.
- [ ] Add tests for `okButtonProps` and `cancelButtonProps` passthrough.
- [ ] Add tests for `rootClassName`, `className`, `classNames`, `rootStyle`, `style`, `styles`, and `zIndex`.
- [ ] Add tests for `afterOpenChange`, `forceRender`, and `destroyOnHidden`.
- [ ] Run the focused Modal tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- modal
```

Expected: FAIL before implementation.

## Task 2: Implement Modal Controls

**Files:**

- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`
- Modify: `packages/components/src/modal/style.css` only if loading spacing needs adjustment

- [ ] Extend Modal types for semantic parts, class/style hooks, button props, loading, force rendering, and lifecycle events.
- [ ] Render Skeleton in body when `loading` is true.
- [ ] Pass `okButtonProps` and `cancelButtonProps` to the default footer buttons.
- [ ] Apply root, dialog, and semantic classes/styles.
- [ ] Track render persistence for `forceRender`, `destroyOnHidden`, and `destroyOnClose`.
- [ ] Emit `afterOpenChange(open)` when `open` changes.
- [ ] Run focused Modal tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- modal
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/modal.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add examples for loading, button props, and semantic styling.
- [ ] Update Modal API, events, and slots sections.
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

Expected: all pass, generated declaration files include the new Modal control types, and `docs/.vitepress/dist/superpowers` is not created.
