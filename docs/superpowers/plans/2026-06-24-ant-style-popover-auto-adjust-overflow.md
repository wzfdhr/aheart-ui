# Ant Style Popover Auto Adjust Overflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `autoAdjustOverflow` support to Popover.

**Architecture:** Keep Popover's existing floating CSS classes and compute an effective placement after the popup is rendered. The resolver measures trigger and popup rectangles, flips the main side when the popup would overflow, adjusts edge alignment when needed, and leaves the configured placement untouched when adjustment is disabled.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popover Overflow Adjustment Tests

**Files:**
- Modify: `packages/components/src/popover/__tests__/popover.test.ts`

- [x] Add DOMRect and viewport helpers for deterministic overflow tests.
- [x] Add a test proving `placement="top"` flips to `bottom` when the popup cannot fit above the trigger.
- [x] Add a test proving `autoAdjustOverflow={false}` keeps `top` in the same geometry.
- [x] Add a test proving `placement="left"` flips to `right` when the popup cannot fit left of the trigger.
- [x] Run focused Popover tests and confirm the new adjustment cases fail before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/popover/types.ts`
- Modify: `packages/components/src/popover/popover.vue`

- [x] Add `autoAdjustOverflow` to `popoverProps` with default `true`.
- [x] Add `effectivePlacement` state initialized from `props.placement`.
- [x] Use `effectivePlacement` in popup classes.
- [x] Add helpers for viewport size, placement side, placement alignment, and placement reconstruction.
- [x] Add a resolver that flips top/bottom/left/right and adjusts Left/Right or Top/Bottom alignment from measured bounding boxes.
- [x] Schedule placement adjustment with `nextTick` after visibility or relevant props change.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/popover.md`
- Modify generated outputs under `packages/components/es/popover` and `packages/components/lib/popover`

- [x] Document `autoAdjustOverflow` in `APopover` API.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Popover tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
