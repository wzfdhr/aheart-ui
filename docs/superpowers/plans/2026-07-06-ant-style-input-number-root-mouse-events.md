# Ant-style InputNumber Root Mouse Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route Ant-compatible InputNumber mouse listeners to the root wrapper.

**Architecture:** Keep the existing `rootAttrs` and `inputAttrs` computed split. Add a small event-key classifier so class/style and wrapper mouse listeners bind to the root, while input-specific attributes continue binding to the inner `<input>`.

**Tech Stack:** Vue 3 `<script setup>`, Vitest with Vue Test Utils, Vite component build.

---

### Task 1: Root Mouse Event Routing

**Files:**
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `docs/components/input-number.md`

- [x] **Step 1: Write the failing test**

Add a test that mounts `InputNumber` with `onClick`, `onMousedown`, `onMousemove`, and `onFocus`. Trigger click, mousedown, and mousemove on `wrapper`, then focus the inner input. Expect root mouse handlers to fire from the wrapper and focus to fire from the inner input.

- [x] **Step 2: Run test to verify it fails**

Run: `CI=true corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/input-number/__tests__/input-number.test.ts`

Expected: FAIL because root mouse listeners are not currently bound to the wrapper.

- [x] **Step 3: Implement minimal routing**

Add a root mouse event key set in `input-number.vue`, include those keys in `rootAttrs`, and exclude them from `inputAttrs`.

- [x] **Step 4: Update docs**

Update the InputNumber native attribute note to say root mouse listeners attach to the outer wrapper while input attributes/listeners remain on the inner input.

- [x] **Step 5: Verify**

Run focused tests, typecheck, component build, full component tests, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 6: Commit and integrate**

Commit with `feat: align input number root mouse events`, push `codex/consolidated-ant-style-foundation`, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
