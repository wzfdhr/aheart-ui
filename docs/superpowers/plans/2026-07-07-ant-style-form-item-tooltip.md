# Ant Style FormItem Tooltip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style FormItem `tooltip` rendering next to the label using the existing Tooltip component.

**Architecture:** Extend FormItem public types in `types.ts`, render a small label-adjacent Tooltip wrapper in `form-item.vue`, add scoped label tooltip CSS in `style.css`, document the API, and refresh generated package output.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [ ] Add tests for string tooltip title, config-object tooltip title/icon, numeric zero content, and empty tooltip suppression.
- [ ] Use `Teleport: true` stubbing where popup content must be queried from the wrapper.
- [ ] Run `CI=true corepack pnpm --filter ./packages/components test -- form`.
- [ ] Confirm the new tests fail because FormItem has no `tooltip` prop or rendering.

## Task 2: Implement FormItem Tooltip

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form-item.vue`
- Modify: `packages/components/src/form/style.css`

- [ ] Add `FormItemTooltipConfig` and `FormItemTooltip` types.
- [ ] Add the `tooltip` prop to FormItem props.
- [ ] Import and render the existing Tooltip component next to the label.
- [ ] Normalize primitive, VNode/function, and config-object tooltip values.
- [ ] Add CSS for stable label/tooltip spacing and trigger size.
- [ ] Run focused Form tests and typecheck.

## Task 3: Document and Build

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/form/**`
- Generated: `packages/components/lib/form/**`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [ ] Add a tooltip example and API/type docs.
- [ ] Run package build and docs build.
- [ ] Remove unrelated generated declaration ordering drift if present.

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

- Spec coverage: all scoped tooltip forms and docs are covered.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: `tooltip`, `title`, and `icon` names match the design.
