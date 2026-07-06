# Ant-style InputNumber Key Aliases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align InputNumber keyboard step key aliases with Ant/rc InputNumber.

**Architecture:** Keep the existing `handleKeydown` and `handleStep` flow. Add small key predicate helpers so `Up` shares the `ArrowUp` path and `Down` shares the `ArrowDown` path without changing keyboard suppression, Shift 10x stepping, or emitted metadata.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest, Vite package build.

---

### Task 1: Legacy Keyboard Step Key Aliases

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a focused test that mounts `InputNumber` with `modelValue: 2` and `step: 2`, triggers `keydown` with `{ key: 'Up' }` and `{ key: 'Down' }`, then expects `update:modelValue` to emit `4` and `0`, and `step` to emit keyboard metadata for up and down.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because current code does not handle `Up` or `Down`.

- [x] **Step 3: Implement minimal source change**

Add key predicate helpers and route `Up` through the existing up path and `Down` through the existing down path.

- [x] **Step 4: Update docs**

Document that keyboard stepping supports `ArrowUp`/`ArrowDown` and legacy `Up`/`Down` key values.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number key aliases`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
