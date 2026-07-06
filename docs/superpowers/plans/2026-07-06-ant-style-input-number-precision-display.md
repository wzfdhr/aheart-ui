# Ant-style InputNumber Precision Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber default display formatting with Ant/rc precision behavior.

**Architecture:** Keep `displayValue` as the single display entry point. Add a small default display formatter used only when no custom `formatter` is provided and no pending typed text is being shown.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Precision Display Formatting

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a test that mounts `modelValue=12.5` with `precision=2` and expects `12.50`, and another mount with `precision=2` plus `decimalSeparator=","` expecting `12,50`.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current display path returns `12.5` and `12,5`.

- [x] **Step 3: Implement minimal source change**

Add a default display helper that pads valid decimal values to the configured precision before applying `decimalSeparator`.

- [x] **Step 4: Update docs**

Document that `precision` also affects default displayed trailing zeros.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number precision display`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
