# Ant Style Popover Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Popover hover delays, destroy-on-hidden behavior, object arrow, compatibility hooks, semantic class/style hooks, docs, tests, and generated package output.

**Architecture:** Keep the existing inline wrapper and simplified absolute-positioned popup. Extend Popover types, add a stable inner container, schedule hover open/close through local timers, and keep shared floating utilities unchanged.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `mouseEnterDelay`
- `mouseLeaveDelay`
- `destroyOnHidden`
- `fresh`
- `arrow` object form
- `className`
- `rootClassName`
- `style`
- `overlayClassName`
- `overlayStyle`
- `overlayInnerStyle`
- `classNames`
- `styles`
- docs and generated package output refresh

This plan does not cover shared floating-layer features such as `getPopupContainer`, `autoAdjustOverflow`, `align`, portals, or collision flipping.

## File Map

- `packages/components/src/popover/types.ts`: add prop and semantic hook types.
- `packages/components/src/popover/popover.vue`: apply root and semantic hooks, delays, destroy-on-hidden, object arrow, and overlay compatibility props.
- `packages/components/src/popover/style.css`: style the new inner container and object-arrow state class.
- `packages/components/src/popover/__tests__/popover.test.ts`: add focused RED tests for the new API.
- `docs/components/popover.md`: add usage examples and API rows.
- `packages/components/es/**` and `packages/components/lib/**`: generated build outputs.

## Task 1: Write Failing Popover Tests

**Files:**

- Modify: `packages/components/src/popover/__tests__/popover.test.ts`

- [ ] Add `vi` import from Vitest so fake timers can be used.
- [ ] Add a test named `applies root semantic and overlay class and style hooks`.
- [ ] Mount Popover with:
  - `open: true`
  - `title: 'Card title'`
  - `content: 'Card content'`
  - `className: 'popover-class'`
  - `rootClassName: 'popover-root'`
  - `style: 'color: red;'`
  - `overlayClassName: 'overlay-class'`
  - `overlayStyle: { borderColor: 'green' }`
  - `overlayInnerStyle: { padding: '4px' }`
  - `classNames` for `root`, `trigger`, `popup`, `container`, `title`, `content`, and `arrow`
  - `styles` for `root`, `trigger`, `popup`, `container`, `title`, `content`, and `arrow`
- [ ] Assert the classes and styles land on `.aheart-popover`, `.aheart-popover__trigger`, `.aheart-popover__popup`, `.aheart-popover__container`, `.aheart-popover__title`, `.aheart-popover__content`, and `.aheart-popover__arrow`.
- [ ] Add a test named `respects hover enter and leave delays`.
- [ ] Use `vi.useFakeTimers()` and `vi.useRealTimers()` in `try/finally`.
- [ ] Mount Popover with `content: 'Delayed'`, `mouseEnterDelay: 0.2`, and `mouseLeaveDelay: 0.3`.
- [ ] Trigger `mouseenter`, advance 199ms, assert popup does not exist, advance 1ms, assert popup exists.
- [ ] Trigger `mouseleave`, advance 299ms, assert popup still visible, advance 1ms, assert popup hidden.
- [ ] Add a test named `preserves or destroys hidden popup according to destroyOnHidden`.
- [ ] For the default case, open then close a click-trigger Popover and assert `.aheart-popover__popup` still exists but is not visible.
- [ ] For `destroyOnHidden: true`, open then close a click-trigger Popover and assert `.aheart-popover__popup` does not exist.
- [ ] Add a test named `renders object arrow point at center class`.
- [ ] Mount Popover with `open: true`, `content: 'Arrow'`, and `arrow: { pointAtCenter: true }`.
- [ ] Assert `.aheart-popover__arrow` has `aheart-popover__arrow--point-at-center`.
- [ ] Run focused Popover tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popover
```

Expected: FAIL before implementation.

## Task 2: Implement Popover Controls

**Files:**

- Modify: `packages/components/src/popover/types.ts`
- Modify: `packages/components/src/popover/popover.vue`
- Modify: `packages/components/src/popover/style.css`

- [ ] Extend types with `PopoverArrow`, `PopoverSemanticPart`, `PopoverClassNames`, and `PopoverStyles`.
- [ ] Add props for `mouseEnterDelay`, `mouseLeaveDelay`, `destroyOnHidden`, `fresh`, `className`, `rootClassName`, `style`, `overlayClassName`, `overlayStyle`, `overlayInnerStyle`, `classNames`, and `styles`.
- [ ] Change `arrow` prop to `Boolean | Object` and default it to `true`.
- [ ] Add root class/style hooks to `.aheart-popover`.
- [ ] Add trigger hooks to `.aheart-popover__trigger`.
- [ ] Render popup with `v-if="shouldRenderPopup"` and `v-show="visible"`.
- [ ] Track `hasRenderedPopup` once `visible` becomes true.
- [ ] Add `.aheart-popover__container` around title and content.
- [ ] Apply popup classes `[floating placement, overlayClassName, classNames.popup]`.
- [ ] Apply popup styles `[getFloatingPopupStyle(color, zIndex), overlayStyle, styles.popup]`.
- [ ] Apply container styles `[overlayInnerStyle, styles.container]`.
- [ ] Apply title, content, and arrow semantic hooks.
- [ ] Add hover timer helpers that convert seconds to milliseconds and clear stale timers.
- [ ] Clear timers in `onBeforeUnmount`.
- [ ] Keep focus, click, and context menu triggers immediate.
- [ ] Run focused Popover tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popover
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/popover.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add color and object-arrow example.
- [ ] Add hover delay example.
- [ ] Add preserved/destroyed popup DOM example.
- [ ] Add semantic styling example.
- [ ] Update API rows for `mouseEnterDelay`, `mouseLeaveDelay`, `destroyOnHidden`, `fresh`, `className`, `rootClassName`, `style`, `overlayClassName`, `overlayStyle`, `overlayInnerStyle`, `classNames`, and `styles`.
- [ ] Add `PopoverSemanticPart` table.
- [ ] Run docs build.
- [ ] Run package build.
- [ ] Commit documentation separately from generated outputs where practical.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
```

Expected: PASS.

## Task 4: Final Verification

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/popover/index.d.ts && test -f packages/components/lib/popover/index.d.ts && grep -q "PopoverSemanticPart" packages/components/es/popover/types.d.ts && grep -q "PopoverSemanticPart" packages/components/lib/popover/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo popover-controls-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, final checks print `popover-controls-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Popover delay, destroy-on-hidden, arrow, compatibility hook, root hook, and semantic hook requirement has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, and semantic part names match the design document.
