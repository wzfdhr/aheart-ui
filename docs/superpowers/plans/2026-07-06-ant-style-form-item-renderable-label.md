# FormItem Renderable Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow `AFormItem` `label` prop values to render Vue nodes while preserving label slot priority and required/optional marks.

**Architecture:** Type `label` as a `VNodeChild` renderable prop and render it through a local helper component inside the existing label slot fallback. Keep Form validation, field registration, help/extra slots, and control inheritance unchanged.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs.

---

### Task 1: Add failing renderable-label test

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [x] **Step 1: Write the failing test**

Add a test that mounts `FormItem` with `label: h('span', { class: 'form-label-node' }, 'Custom label')` and `required: true`.

Also cover `label: 0` so renderable numeric values are not dropped by truthy checks.

- [x] **Step 2: Run focused Form tests**

Run: `CI=true corepack pnpm --filter ./packages/components test -- form`

Expected before implementation: the new test fails because the renderable node is not rendered.

### Task 2: Render FormItem label prop as a node

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`
- Modify: `docs/components/form.md`

- [x] **Step 1: Update label typing**

Import `VNodeChild`, add `FormRenderable`, and change `formItemProps.label` from `String` to a renderable prop type.

- [x] **Step 2: Update label fallback rendering**

Render the prop fallback through a local render-node helper while keeping `<slot name="label">` priority and existing required/optional marks.

- [x] **Step 3: Update docs**

Document `label` as `VNodeChild`, update a demo to show a renderable label, and keep the label slot documented.

- [x] **Step 4: Run verification**

Run focused Form tests, full component tests, typecheck, component build, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 5: Commit and integrate**

Commit the stage, push the feature branch, fast-forward `master`, verify on merged `master`, push `master`, and switch back to the feature branch.
