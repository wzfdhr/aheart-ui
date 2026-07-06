# RadioGroup Renderable Option Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow `ARadioGroup` object option labels to render Vue nodes in both default and button option modes.

**Architecture:** Type option labels as `VNodeChild` and render them through a local helper component inside `radio-group.vue`. Primitive options still normalize to string labels, so current simple option behavior is unchanged.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs.

---

### Task 1: Add failing renderable-label tests

**Files:**
- Modify: `packages/components/src/radio/__tests__/radio.test.ts`

- [ ] **Step 1: Write the failing tests**

Add one test for default `RadioGroup` options and one test for `optionType="button"` options. Each test should pass a VNode label created with `h('span', ...)`, verify the nested element renders, and verify the selected option state.

- [ ] **Step 2: Run focused Radio tests**

Run: `CI=true corepack pnpm --filter ./packages/components test -- radio`

Expected before implementation: the new renderable-label tests fail because VNode labels are not rendered.

### Task 2: Render option labels as nodes

**Files:**
- Modify: `packages/components/src/radio/types.ts`
- Modify: `packages/components/src/radio/radio-group.vue`
- Modify: `docs/components/radio.md`

- [ ] **Step 1: Update option typing**

Import `VNodeChild` from Vue, add a `RadioRenderable` alias, and change `RadioOption.label` from `string` to `RadioRenderable`.

- [ ] **Step 2: Update group rendering**

Render `option.label` through a local render-node helper in default mode and button mode. Do not alter value, change, disabled, class, style, title, size, or layout behavior.

- [ ] **Step 3: Update docs**

Document `RadioOption.label` as `VNodeChild` and update the options row to mention renderable object labels.

- [ ] **Step 4: Run verification**

Run focused Radio tests, full component tests, typecheck, component build, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 5: Commit and integrate**

Commit the stage, push the feature branch, fast-forward `master`, verify on merged `master`, push `master`, and switch back to the feature branch.
