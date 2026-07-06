# Ant Style Dropdown Side Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style side placements to Dropdown and inherited Dropdown.Button behavior.

**Architecture:** Keep Dropdown's local CSS placement class model. Expand the placement union and resolver to the same side/alignment concepts used by Tooltip, Popover, and Popconfirm, then add CSS rules for side placement classes and arrows.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Dropdown Side Placement Tests

**Files:**
- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [x] Add a test that opens `placement="leftTop"` and asserts the overlay keeps `aheart-dropdown__overlay--leftTop`.
- [x] Add a test that opens `placement="left"` near the left viewport edge and asserts `autoAdjustOverflow` flips to `aheart-dropdown__overlay--right`.
- [x] Run focused Dropdown tests and confirm the new cases fail before implementation.

### Task 2: Runtime, Types, And CSS

**Files:**
- Modify: `packages/components/src/dropdown/types.ts`
- Modify: `packages/components/src/dropdown/dropdown.vue`
- Modify: `packages/components/src/dropdown/style.css`

- [x] Expand `DropdownPlacement` to include `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, and `rightBottom`.
- [x] Expand placement side and alignment helpers to support left/right sides and Top/Bottom alignment.
- [x] Update `resolveAdjustedPlacement` so top/bottom behavior stays unchanged and left/right can flip horizontally.
- [x] Add vertical alignment adjustment for left/right side placements.
- [x] Add CSS rules for side overlay placement classes.
- [x] Add CSS rules for side placement arrows.
- [x] Run focused Dropdown tests and confirm green.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/dropdown.md`
- Modify generated outputs under `packages/components/es` and `packages/components/lib`

- [x] Add a side placement docs example.
- [x] Update Dropdown and Dropdown.Button placement API rows to list all twelve values.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Dropdown tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
