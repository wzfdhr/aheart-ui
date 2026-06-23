# Ant Style Popconfirm Hidden Lifecycle Implementation Plan

**Goal:** Add Ant-style hidden lifecycle compatibility to Popconfirm.

**Architecture:** Keep Popconfirm trigger, popup, and Teleport ownership inside `popconfirm.vue`. Preserve the popup subtree after first render with `v-show`, and fall back to `v-if` destruction when `destroyOnHidden` or `destroyTooltipOnHide` is set.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popconfirm Lifecycle Tests

**Files:**
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [x] Update confirm and cancel close assertions to expect hidden preserved popup DOM by default.
- [x] Add coverage for default hidden preservation, `destroyOnHidden`, and `destroyTooltipOnHide`.
- [x] Add coverage proving `fresh` is declared and not forwarded as a root DOM attribute.
- [x] Run focused Popconfirm tests and confirm they fail before implementation.

### Task 2: Popconfirm Runtime And Types

**Files:**
- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`

- [x] Add `destroyOnHidden`, `destroyTooltipOnHide`, and `fresh` props.
- [x] Track whether the popup has rendered at least once.
- [x] Render the popup while visible or preserved, and hide it with `v-show`.
- [x] Destroy the hidden popup when either destruction prop is true.
- [x] Keep disabled Popconfirm from preserving stale popup DOM.

### Task 3: Documentation And Generated Output

**Files:**
- Modify: `docs/components/popconfirm.md`
- Modify generated outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm`

- [x] Add API rows for `destroyOnHidden`, `destroyTooltipOnHide`, and `fresh`.
- [x] Refresh generated package output with the component build.

### Task 4: Verification And Git

- [x] Run focused Popconfirm tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
