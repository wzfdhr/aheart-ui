# Ant-style InputNumber Chinese Decimal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber default parsing with Ant/rc InputNumber's Chinese decimal point normalization.

**Architecture:** Keep `parseInputValue` as the single parsing entry point. Extend the default normalization helper used only when no custom `parser` is provided, so `。` becomes `.` before the existing cleanup regex runs.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Chinese Decimal Normalization

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a test that enters `1。5` with `changeOnBlur=false` and verifies `update:modelValue` and `change` emit `1.5`.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current default cleanup removes `。` and emits `15`.

- [x] **Step 3: Implement minimal source change**

Add a default normalization helper that replaces `。` with `.` before the existing `decimalSeparator` conversion and `/[^\w.-]+/g` cleanup.

- [x] **Step 4: Update docs**

Document that the default parser treats `。` as a decimal point when no custom parser is provided.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number chinese decimal`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
