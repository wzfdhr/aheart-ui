# Ant Style Popconfirm Align Offset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a focused Popconfirm `align.offset` compatibility slice.

**Architecture:** Reuse the existing floating placement system and the shared offset CSS variables already supported by `floating.css`. Accept `align` on Popconfirm, convert valid `align.offset` tuples into popup CSS variables, and preserve existing user style override order.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popconfirm Align Offset Test

**Files:**
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [x] Add a test that renders an open popconfirm with `align: { offset: [8, -4] }`.
- [x] Assert the popup inline style contains `--aheart-floating-align-x: 8px`.
- [x] Assert the popup inline style contains `--aheart-floating-align-y: -4px`.
- [x] Assert `align` is not forwarded as a DOM attribute.
- [x] Run focused Popconfirm tests and confirm the new case fails before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`

- [x] Add `PopconfirmAlignConfig` and `align` to `popconfirmProps`.
- [x] Add a computed `alignOffsetStyle` that returns CSS variable values for valid numeric offset tuples.
- [x] Merge `alignOffsetStyle` into `popupStyle` before user overlay/style hooks.
- [x] Keep all default placement styles visually unchanged when no variables are present.
- [x] Run focused Popconfirm tests and confirm green.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/popconfirm.md`
- Modify generated outputs under `packages/components/es` and `packages/components/lib`

- [x] Add a Popconfirm API row for `align`.
- [x] Document that this slice supports `align.offset`.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Popconfirm tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
