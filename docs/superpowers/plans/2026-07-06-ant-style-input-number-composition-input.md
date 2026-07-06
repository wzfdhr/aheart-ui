# Ant-style InputNumber Composition Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber typed-input parsing with Ant/rc InputNumber during IME composition.

**Architecture:** Keep native input handling in `input-number.vue`. Extract a small shared typed-input collector so normal input and `compositionend` use the same parsing path, while active composition emits only raw input text.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Composition Input Parsing Guard

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a test that starts composition, triggers native input with `changeOnBlur=false`, verifies raw `input` is emitted without value events, then triggers `compositionend` and verifies the parsed value is committed.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code parses and emits typed value during active composition.

- [x] **Step 3: Implement minimal source change**

Extract shared typed-input collection, skip value parsing while `isComposing` is true, and collect the current input value on `compositionend`.

- [x] **Step 4: Update docs**

Document that IME composition keeps raw input during composition and parses after composition ends.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number composition input`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
