# Ant Style FormItem Label Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style FormItem local label controls for colon, htmlFor, label alignment, and item layout.

**Architecture:** Extend FormItem props in `types.ts`, derive item classes and label attributes in `form-item.vue`, add focused CSS overrides in `style.css`, then document the API in `docs/components/form.md`.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [ ] Add tests showing item-level `colon`, `htmlFor`, `labelAlign`, and `layout`.
- [ ] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [ ] Confirm the new tests fail because the props/classes/attributes are not implemented.

## Task 2: Implement FormItem Label Controls

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`
- Modify: `packages/components/src/form/style.css`

- [ ] Add FormItem props: `colon`, `htmlFor`, `labelAlign`, and `layout`.
- [ ] Render `htmlFor` on the label element.
- [ ] Compute item classes for explicit colon, no-colon, label-left, label-right, and vertical layout.
- [ ] Add CSS so item colon overrides work with existing form-level colon CSS.
- [ ] Run focused Form tests and package typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`

- [ ] Add a label controls example to Form docs.
- [ ] Update FormItem API rows.
- [ ] Run package build and docs build.
- [ ] Remove unrelated generated-output drift if present.

## Task 4: Verify and Publish Phase

- [ ] Run full component tests.
- [ ] Run package typecheck.
- [ ] Run package build.
- [ ] Run docs build.
- [ ] Run `git diff --check`.
- [ ] Commit the phase.
- [ ] Push the feature branch.
- [ ] Fast-forward merge into `master`, push `master`, and switch back.

## Self-Review

- Spec coverage: the tasks cover all scoped props and documentation.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: prop names match the design and Ant-style API names.
