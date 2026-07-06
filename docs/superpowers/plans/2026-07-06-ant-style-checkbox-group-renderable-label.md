# CheckboxGroup Renderable Option Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow `ACheckboxGroup` object option labels to render Vue nodes while preserving existing primitive option behavior.

**Architecture:** Type option labels as `VNodeChild` and render them through the child Checkbox default slot from the group template. Primitive options continue normalizing to string labels, so current text labels and selection logic are preserved.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs.

---

### Task 1: Add failing renderable-label test

**Files:**
- Modify: `packages/components/src/checkbox/__tests__/checkbox.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that mounts `CheckboxGroup` with an option whose `label` is `h('span', { class: 'checkbox-option-node' }, 'Custom label')` and `value` is `'custom'`.

- [ ] **Step 2: Run focused Checkbox tests**

Run: `CI=true corepack pnpm --filter ./packages/components test -- checkbox`

Expected before implementation: the new test fails because the renderable node is not rendered.

### Task 2: Render option labels as nodes

**Files:**
- Modify: `packages/components/src/checkbox/types.ts`
- Modify: `packages/components/src/checkbox/checkbox-group.vue`
- Modify: `docs/components/checkbox.md`

- [ ] **Step 1: Update option typing**

Import `VNodeChild` from Vue and change `CheckboxOption.label` from `string` to `VNodeChild`.

- [ ] **Step 2: Update group rendering**

Render `option.label` through the child `Checkbox` default slot instead of passing it to the `label` prop.

- [ ] **Step 3: Update docs**

Document `CheckboxOption.label` as `VNodeChild` and clarify that `options` supports renderable labels on object options.

- [ ] **Step 4: Run verification**

Run focused Checkbox tests, full component tests, typecheck, component build, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 5: Commit and integrate**

Commit the stage, push the feature branch, fast-forward `master`, verify on merged `master`, push `master`, and switch back to the feature branch.
