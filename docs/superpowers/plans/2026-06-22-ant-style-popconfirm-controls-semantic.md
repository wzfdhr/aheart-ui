# Ant Style Popconfirm Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Popconfirm icon, button prop bags, color, popup click, root hooks, semantic class/style hooks, docs, tests, and generated package output.

**Architecture:** Keep the current trigger and inline popup structure. Extend Popconfirm types, compute merged root/popup/action button props, keep slot overrides intact, and reuse the existing floating helper for color and z-index.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `icon`
- `color`
- `okButtonProps`
- `cancelButtonProps`
- `popupClick`
- `className`
- `rootClassName`
- `style`
- `classNames`
- `styles`
- docs and generated package output refresh

This plan does not cover shared floating-layer features such as `getPopupContainer`, `autoAdjustOverflow`, `fresh`, `destroyOnHidden`, or custom `align`.

## File Map

- `packages/components/src/popconfirm/types.ts`: add prop, event, and semantic hook types.
- `packages/components/src/popconfirm/popconfirm.vue`: apply root and semantic hooks, color, icon prop, button prop bags, and popup click.
- `packages/components/src/popconfirm/style.css`: add disabled action styling and keep semantic hook targets stable.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add focused RED tests for the new API.
- `docs/components/popconfirm.md`: add usage examples and API rows.
- `packages/components/es/**` and `packages/components/lib/**`: generated build outputs.

## Task 1: Write Failing Popconfirm Tests

**Files:**

- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

- [ ] Add a test named `renders icon color and action button prop bags`.
- [ ] Mount Popconfirm with:
  - `defaultOpen: true`
  - `title: 'Archive item?'`
  - `description: 'This can be restored later.'`
  - `icon: '?'`
  - `color: 'rgb(1, 2, 3)'`
  - `okText: 'Archive'`
  - `okButtonProps: { danger: true, ghost: true, className: 'ok-extra' }`
  - `cancelButtonProps: { disabled: true, className: 'cancel-extra' }`
- [ ] Assert `.aheart-popconfirm__icon` text is `?`.
- [ ] Assert `.aheart-popconfirm__popup` style contains `background: rgb(1, 2, 3)`.
- [ ] Assert `.aheart-popconfirm__ok` has `ok-extra`, `is-danger`, and `is-ghost`.
- [ ] Assert `.aheart-popconfirm__cancel` has `cancel-extra` and `disabled`.
- [ ] Add a test named `applies root and semantic class and style hooks`.
- [ ] Mount Popconfirm with `defaultOpen: true`, root hook props, and semantic maps for `root`, `trigger`, `popup`, `arrow`, `message`, `icon`, `text`, `title`, `description`, `actions`, `cancelButton`, and `okButton`.
- [ ] Assert each semantic class/style lands on the expected element.
- [ ] Add a test named `emits popupClick without closing`.
- [ ] Mount Popconfirm with `defaultOpen: true` and click `.aheart-popconfirm__popup`.
- [ ] Assert `popupClick` receives a `MouseEvent` and `.aheart-popconfirm__popup` still exists.
- [ ] Run focused Popconfirm tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popconfirm
```

Expected: FAIL before implementation.

## Task 2: Implement Popconfirm Controls

**Files:**

- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`
- Modify: `packages/components/src/popconfirm/style.css`

- [ ] Extend types with `PopconfirmButtonProps`, `PopconfirmSemanticPart`, `PopconfirmClassNames`, and `PopconfirmStyles`.
- [ ] Add props for `icon`, `color`, `okButtonProps`, `cancelButtonProps`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Add `popupClick` emit validator.
- [ ] Apply root class/style hooks to `.aheart-popconfirm`.
- [ ] Apply trigger hooks to `.aheart-popconfirm__trigger`.
- [ ] Apply popup hooks and merge `[getFloatingPopupStyle(color, zIndex), styles.popup]`.
- [ ] Emit `popupClick` from popup `@click`.
- [ ] Render `icon` prop inside the icon slot fallback.
- [ ] Merge OK button defaults as `{ size: 'small', type: okType, ...okButtonProps }`.
- [ ] Merge Cancel button defaults as `{ size: 'small', ...cancelButtonProps }`.
- [ ] Apply button semantic classes/styles to the two action buttons.
- [ ] Run focused Popconfirm tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- popconfirm
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/popconfirm.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Add icon and color example.
- [ ] Add button prop bag example.
- [ ] Add popup click example.
- [ ] Add semantic styling example.
- [ ] Update API rows for `icon`, `color`, `okButtonProps`, `cancelButtonProps`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- [ ] Update Events table for `popupClick`.
- [ ] Add `PopconfirmSemanticPart` table.
- [ ] Run docs build.
- [ ] Run package build.
- [ ] Commit documentation separately from generated outputs where practical.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
```

Expected: PASS.

## Task 4: Final Verification

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/popconfirm/index.d.ts && test -f packages/components/lib/popconfirm/index.d.ts && grep -q "PopconfirmSemanticPart" packages/components/es/popconfirm/types.d.ts && grep -q "PopconfirmSemanticPart" packages/components/lib/popconfirm/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo popconfirm-controls-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, final checks print `popconfirm-controls-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Popconfirm icon, color, button prop bag, popup click, root hook, and semantic hook requirement has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, and semantic part names match the design document.
