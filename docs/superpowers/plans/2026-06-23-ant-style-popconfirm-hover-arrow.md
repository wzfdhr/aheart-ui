# Ant Style Popconfirm Hover Delay And Arrow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style hover delay controls and object arrow configuration to Popconfirm.

**Architecture:** Reuse the Tooltip/Popover timer pattern inside `popconfirm.vue` while keeping Popconfirm's existing teleported hover handoff guard. Extend the arrow prop to a boolean-or-object type and expose a Popconfirm-specific point-at-center modifier class.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popconfirm Hover And Arrow Tests

**Files:**
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [x] Add `vi` to the Vitest imports.
- [x] Update the existing teleported hover handoff test to pass `mouseEnterDelay: 0` and `mouseLeaveDelay: 0` so it remains focused on handoff behavior.
- [x] Add a fake-timer test that proves `mouseEnterDelay` delays opening and `mouseLeaveDelay` delays hiding.
- [x] Add a test that proves `arrow: { pointAtCenter: true }` applies `aheart-popconfirm__arrow--point-at-center`.
- [x] Run focused Popconfirm tests and confirm they fail before implementation.

### Task 2: Popconfirm Runtime And Types

**Files:**
- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`

- [x] Add `PopconfirmArrowConfig` and `PopconfirmArrow` types.
- [x] Change `arrow` from `Boolean` to `[Boolean, Object]` with the new type.
- [x] Add `mouseEnterDelay` and `mouseLeaveDelay` props with `0.1` defaults.
- [x] Import `onBeforeUnmount` and add hover timer cleanup.
- [x] Replace immediate hover open/close calls with delayed scheduling.
- [x] Keep related-target guard logic so trigger-to-popup movement does not schedule a close.
- [x] Add `showArrow` and `arrowPointsAtCenter` computed values.

### Task 3: CSS, Docs, And Generated Output

**Files:**
- Modify: `packages/components/src/popconfirm/style.css`
- Modify: `docs/components/popconfirm.md`
- Modify generated outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm`

- [x] Add `.aheart-popconfirm__arrow--point-at-center`.
- [x] Add docs examples for hover delay and object arrow.
- [x] Update API rows for `mouseEnterDelay`, `mouseLeaveDelay`, and `arrow`.
- [x] Refresh generated package output with the component build.

### Task 4: Verification And Git

- [x] Run focused Popconfirm tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
