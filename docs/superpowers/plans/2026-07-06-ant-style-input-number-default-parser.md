# Ant-style InputNumber Default Parser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber default parsing of formatted numeric text with Ant/rc InputNumber.

**Architecture:** Keep `parseInputValue` as the single parsing entry point. Add a small default normalization helper used only when no custom `parser` prop is provided, so custom parser behavior remains unchanged while numeric and stringMode validation reuse the existing clamp pipeline.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Default Parser Cleanup

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a focused test that mounts `InputNumber` with `changeOnBlur: false`, types `$ 1,234.50`, and expects `update:modelValue` and `change` to emit `1234.5`.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current default parsing passes `$ 1,234.50` directly to `Number(...)`.

- [x] **Step 3: Implement minimal source change**

Add a default parser normalization helper that applies `decimalSeparator` and removes characters matching rc's `/[^\w.-]+/g` cleanup rule before numeric or stringMode validation.

- [x] **Step 4: Update docs**

Document that the default parser removes currency symbols and thousands separators unless a custom `parser` is provided.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number default parser`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
