# Ant Style Tooltip Align Offset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a focused Tooltip `align.offset` compatibility slice.

**Architecture:** Keep the existing CSS placement model. Accept `align` on Tooltip, convert valid `align.offset` tuples into popup CSS variables, and let shared floating CSS apply those variables in placement transforms.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Tooltip Align Offset Test

**Files:**
- Modify: `packages/components/src/tooltip/__tests__/tooltip.test.ts`

- [x] Add a test that renders an open tooltip with `align: { offset: [8, -4] }`.
- [x] Assert the popup inline style contains `--aheart-floating-align-x: 8px`.
- [x] Assert the popup inline style contains `--aheart-floating-align-y: -4px`.
- [x] Assert `align` is not forwarded as a DOM attribute.
- [x] Run focused Tooltip tests and confirm the new case fails before implementation.

### Task 2: Runtime, Types, And Shared CSS

**Files:**
- Modify: `packages/components/src/tooltip/types.ts`
- Modify: `packages/components/src/tooltip/tooltip.vue`
- Modify: `packages/components/src/utils/floating.css`

- [x] Add `TooltipAlignConfig` and `align` to `tooltipProps`.
- [x] Add a computed `alignOffsetStyle` that returns CSS variable values for valid numeric offset tuples.
- [x] Merge `alignOffsetStyle` into `popupStyle` before user overlay/style hooks.
- [x] Update each shared floating placement transform to include `var(--aheart-floating-align-x, 0px)` and `var(--aheart-floating-align-y, 0px)`.
- [x] Keep all default placement styles visually unchanged when no variables are present.
- [x] Run focused Tooltip tests and confirm green.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/tooltip.md`
- Modify generated outputs under `packages/components/es` and `packages/components/lib`

- [x] Add a Tooltip API row for `align`.
- [x] Document that this slice supports `align.offset`.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Tooltip tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
