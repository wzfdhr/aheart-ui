# TagGroup Renderable Option Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow `ATagGroup` object option labels to render Vue nodes while preserving primitive option behavior.

**Architecture:** Type option labels as `VNodeChild` and render them through a local helper component inside the existing CheckableTag slot. Primitive options still normalize to string labels, so current selection and text behavior are unchanged.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs.

---

### Task 1: Add failing renderable-label test

**Files:**
- Modify: `packages/components/src/tag/__tests__/tag.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that mounts `TagGroup` with an option whose `label` is `h('span', { class: 'tag-option-node' }, 'Custom tag')` and `value` is `'custom'`.

- [ ] **Step 2: Run focused Tag tests**

Run: `CI=true corepack pnpm --filter ./packages/components test -- tag`

Expected before implementation: the new test fails because the renderable node is not rendered.

### Task 2: Render option labels as nodes

**Files:**
- Modify: `packages/components/src/tag/types.ts`
- Modify: `packages/components/src/tag/tag-group.vue`
- Modify: `docs/components/tag.md`

- [ ] **Step 1: Update option typing**

Add a `TagRenderable` alias backed by `VNodeChild`, keep `TagIcon` compatible with it, and change `TagOption.label` from `string` to `TagRenderable`.

- [ ] **Step 2: Update group rendering**

Render `option.label` through a local render-node helper inside each `ACheckableTag`.

- [ ] **Step 3: Update docs**

Document `TagOption.label` as `VNodeChild` and update the TagGroup demo to show a renderable label option.

- [ ] **Step 4: Run verification**

Run focused Tag tests, full component tests, typecheck, component build, docs build, `git diff --check`, and demo HTTP check.

- [ ] **Step 5: Commit and integrate**

Commit the stage, push the feature branch, fast-forward `master`, verify on merged `master`, push `master`, and switch back to the feature branch.
