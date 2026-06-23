# Ant Style Popconfirm Overlay Alias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style legacy overlay class/style aliases to Popconfirm.

**Architecture:** Keep the popup as the outer floating element and add a single internal container around message/actions. Legacy overlay aliases map to popup/container nodes, while semantic `classNames`/`styles` remain the preferred structured API.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popconfirm Overlay Alias Tests

**Files:**
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [x] Extend the existing semantic hook test with `overlayClassName`, `overlayStyle`, `overlayInnerStyle`, `classNames.container`, and `styles.container`.
- [x] Assert the popup includes `overlayClassName` and `classNames.popup`.
- [x] Assert the popup style includes `overlayStyle` and `styles.popup`.
- [x] Assert `.aheart-popconfirm__container` exists.
- [x] Assert the container includes `classNames.container`, `overlayInnerStyle`, and `styles.container`.
- [x] Run focused Popconfirm tests and confirm they fail before implementation.

### Task 2: Popconfirm Runtime And Types

**Files:**
- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`

- [x] Add `container` to `PopconfirmSemanticPart`.
- [x] Add `overlayClassName`, `overlayStyle`, and `overlayInnerStyle` props.
- [x] Add a `.aheart-popconfirm__container` wrapper around message/actions.
- [x] Add `containerClass` and `containerStyle` computed values.
- [x] Include `overlayClassName` in `popupClass`.
- [x] Include `overlayStyle` in `popupStyle`.
- [x] Include `overlayInnerStyle` before `styles.container` in `containerStyle`.

### Task 3: CSS, Docs, And Generated Output

**Files:**
- Modify: `packages/components/src/popconfirm/style.css`
- Modify: `docs/components/popconfirm.md`
- Modify generated outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm`

- [x] Add `.aheart-popconfirm__container` CSS to preserve the current column layout.
- [x] Document `overlayClassName`, `overlayStyle`, and `overlayInnerStyle`.
- [x] Document `container` in `PopconfirmSemanticPart`.
- [x] Refresh generated package output with the component build.
- [x] Keep unrelated generated declaration drift out of the commit.

### Task 4: Verification And Git

- [x] Run focused Popconfirm tests.
- [x] Run component typecheck.
- [x] Run full component tests.
- [x] Run component build.
- [x] Run docs build.
- [x] Run `git diff --check`.
- [ ] Stage, commit, push the feature branch, fast-forward `master`, push `master`, and switch back.
