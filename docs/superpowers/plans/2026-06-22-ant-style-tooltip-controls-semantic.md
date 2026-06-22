# Ant Style Tooltip Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Tooltip preserved hidden DOM, object arrow, compatibility hooks, semantic class/style hooks, docs, tests, and generated package output.

**Architecture:** Keep the existing inline wrapper and simplified absolute-positioned popup. Extend Tooltip types, add a stable inner container, keep hover scheduling local to Tooltip, and keep shared floating utilities unchanged.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `mouseEnterDelay` default alignment
- `mouseLeaveDelay` default alignment
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

- `packages/components/src/tooltip/types.ts`: add prop and semantic hook types.
- `packages/components/src/tooltip/tooltip.vue`: apply root and semantic hooks, preserved/destroyed popup DOM, object arrow, and overlay compatibility props.
- `packages/components/src/tooltip/style.css`: style the new inner container and object-arrow state class.
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`: add focused RED tests for the new API.
- `docs/components/tooltip.md`: add usage examples and API rows.
- `packages/components/es/**` and `packages/components/lib/**`: generated build outputs.

## Task 1: Write Failing Tooltip Tests

**Files:**

- Modify: `packages/components/src/tooltip/__tests__/tooltip.test.ts`

- [ ] Add `vi` import from Vitest so fake timers can be used:

```ts
import { describe, expect, it, vi } from 'vitest'
```

- [ ] Add a test named `applies root semantic and overlay class and style hooks`.
- [ ] Mount Tooltip with:
  - `open: true`
  - `title: 'Helpful text'`
  - `className: 'tooltip-class'`
  - `rootClassName: 'tooltip-root'`
  - `style: 'color: red;'`
  - `overlayClassName: 'overlay-class'`
  - `overlayStyle: { borderColor: 'green' }`
  - `overlayInnerStyle: { padding: '4px' }`
  - `classNames` for `root`, `trigger`, `popup`, `container`, `content`, and `arrow`
  - `styles` for `root`, `trigger`, `popup`, `container`, `content`, and `arrow`
- [ ] Assert the classes and styles land on `.aheart-tooltip`, `.aheart-tooltip__trigger`, `.aheart-tooltip__popup`, `.aheart-tooltip__container`, `.aheart-tooltip__content`, and `.aheart-tooltip__arrow`.
- [ ] Add a test named `uses Ant-style default hover delays`.
- [ ] Use `vi.useFakeTimers()` and `vi.useRealTimers()` in `try/finally`.
- [ ] Mount Tooltip with `title: 'Delayed default'`.
- [ ] Trigger `mouseenter`, advance 99ms, assert popup does not exist, advance 1ms, assert popup exists.
- [ ] Trigger `mouseleave`, advance 99ms, assert popup still exists, advance 1ms, assert the last `openChange` payload is `false` and the popup is hidden with `display: none`.
- [ ] Add a test named `respects custom hover enter and leave delays`.
- [ ] Mount Tooltip with `title: 'Delayed custom'`, `mouseEnterDelay: 0.2`, and `mouseLeaveDelay: 0.3`.
- [ ] Trigger `mouseenter`, advance 199ms, assert popup does not exist, advance 1ms, assert popup exists.
- [ ] Trigger `mouseleave`, advance 299ms, assert popup still exists, advance 1ms, assert the last `openChange` payload is `false` and the popup is hidden with `display: none`.
- [ ] Add a test named `preserves or destroys hidden popup according to destroyOnHidden`.
- [ ] For the default case, open then close a click-trigger Tooltip and assert `.aheart-tooltip__popup` still exists but is hidden.
- [ ] For `destroyOnHidden: true`, open then close a click-trigger Tooltip and assert `.aheart-tooltip__popup` does not exist.
- [ ] Add a test named `renders object arrow point at center class`.
- [ ] Mount Tooltip with `open: true`, `title: 'Arrow'`, and `arrow: { pointAtCenter: true }`.
- [ ] Assert `.aheart-tooltip__arrow` has `aheart-tooltip__arrow--point-at-center`.
- [ ] Run focused Tooltip tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tooltip
```

Expected: FAIL before implementation.

## Task 2: Implement Tooltip Controls

**Files:**

- Modify: `packages/components/src/tooltip/types.ts`
- Modify: `packages/components/src/tooltip/tooltip.vue`
- Modify: `packages/components/src/tooltip/style.css`

- [ ] Extend types with `TooltipArrow`, `TooltipSemanticPart`, `TooltipClassNames`, and `TooltipStyles`:

```ts
export interface TooltipArrowConfig {
  pointAtCenter?: boolean
}

export type TooltipArrow = boolean | TooltipArrowConfig
export type TooltipSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'content' | 'arrow'
export type TooltipClassNames = Partial<Record<TooltipSemanticPart, string>>
export type TooltipStyles = Partial<Record<TooltipSemanticPart, StyleValue>>
```

- [ ] Add props for `destroyOnHidden`, `fresh`, `className`, `rootClassName`, `style`, `overlayClassName`, `overlayStyle`, `overlayInnerStyle`, `classNames`, and `styles`.
- [ ] Change `arrow` prop to `Boolean | Object` and default it to `true`.
- [ ] Change `mouseEnterDelay` and `mouseLeaveDelay` defaults to `0.1`.
- [ ] Add root class/style hooks to `.aheart-tooltip`.
- [ ] Add trigger hooks to `.aheart-tooltip__trigger`.
- [ ] Render popup with `v-if="shouldRenderPopup"` and `v-show="visible"`.
- [ ] Track `hasRenderedPopup` once `visible` becomes true.
- [ ] Add `.aheart-tooltip__container` around content.
- [ ] Apply popup classes `[floating placement, overlayClassName, classNames.popup]`.
- [ ] Apply popup styles `[getFloatingPopupStyle(color, zIndex), overlayStyle, styles.popup]`.
- [ ] Apply container styles `[overlayInnerStyle, styles.container]`.
- [ ] Apply content and arrow semantic hooks.
- [ ] Keep the existing hover timer behavior and clear timers in `onBeforeUnmount`.
- [ ] Keep focus, click, and context menu triggers immediate.
- [ ] Run focused Tooltip tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tooltip
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/tooltip.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add object-arrow example.
- [ ] Add hover delay example.
- [ ] Add preserved/destroyed popup DOM example.
- [ ] Add semantic styling example.
- [ ] Update API rows for `mouseEnterDelay`, `mouseLeaveDelay`, `destroyOnHidden`, `fresh`, `className`, `rootClassName`, `style`, `overlayClassName`, `overlayStyle`, `overlayInnerStyle`, `classNames`, and `styles`.
- [ ] Add `TooltipSemanticPart` table.
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
test -f packages/components/es/tooltip/index.d.ts && test -f packages/components/lib/tooltip/index.d.ts && grep -q "TooltipSemanticPart" packages/components/es/tooltip/types.d.ts && grep -q "TooltipSemanticPart" packages/components/lib/tooltip/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo tooltip-controls-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, final checks print `tooltip-controls-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Tooltip delay, destroy-on-hidden, arrow, compatibility hook, root hook, and semantic hook requirement has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, and semantic part names match the design document.
