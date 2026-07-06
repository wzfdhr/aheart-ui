# Ant Style InputNumber Decimal Separator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add focused `decimalSeparator` support to InputNumber.

**Architecture:** Keep InputNumber's existing formatter/parser precedence. Add default conversion helpers that only run when the matching custom formatter or parser hook is absent.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing InputNumber Decimal Separator Test

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`

- [x] Add a test that `decimalSeparator=","` displays `12,5` for `modelValue={12.5}`.
- [x] In the same test, type `3,75` and assert `update:modelValue` emits `3.75`.
- [x] Run focused InputNumber tests and confirm the new case fails before implementation.

### Task 2: Runtime And Types

**Files:**
- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`

- [x] Add `decimalSeparator` to `inputNumberProps`.
- [x] Add a helper that replaces `.` with `decimalSeparator` for default display output.
- [x] Add a helper that replaces `decimalSeparator` with `.` before default numeric parsing.
- [x] Keep custom `formatter` and `parser` precedence unchanged.
- [x] Run focused InputNumber tests and confirm green.

### Task 3: Docs And Generated Output

**Files:**
- Modify: `docs/components/input-number.md`
- Modify generated outputs under `packages/components/es` and `packages/components/lib`

- [x] Add a decimal separator docs example.
- [x] Add the `decimalSeparator` API row.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused InputNumber tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
