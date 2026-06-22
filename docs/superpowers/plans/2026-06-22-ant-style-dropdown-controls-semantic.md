# Ant Style Dropdown Controls And Semantic Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Dropdown trigger defaults, context menu trigger, preserved hidden DOM, object arrow, compatibility hooks, semantic class/style hooks, popup customization, docs, tests, and generated package output.

**Architecture:** Keep the existing inline wrapper and simplified absolute-positioned overlay. Extend Dropdown types, render default menu through a small render-node helper so popup render props can wrap it, preserve hidden popup DOM with `v-show`, and keep Menu's own implementation unchanged.

**Tech Stack:** Vue 3, TypeScript, Vite, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `trigger` default alignment to `['hover']`
- `contextMenu` trigger
- `destroyOnHidden`
- `destroyPopupOnHide`
- `arrow` object form
- `className`
- `rootClassName`
- `style`
- `overlayClassName`
- `overlayStyle`
- `classNames`
- `styles`
- `popupRender`
- `dropdownRender`
- `popup` slot
- `menu.closeOnClick`
- `openChange(open, { source })`
- docs and generated package output refresh

This plan does not cover shared floating-layer features such as `getPopupContainer`, `autoAdjustOverflow`, `align`, portals, cursor-follow context menu positioning, or collision flipping.

## File Map

- `packages/components/src/dropdown/types.ts`: add prop, trigger, render hook, semantic hook, arrow, and open-change source types.
- `packages/components/src/dropdown/dropdown.vue`: apply root/semantic hooks, context menu trigger, preserved/destroyed popup DOM, object arrow, popup render hooks, and menu close behavior.
- `packages/components/src/dropdown/style.css`: style semantic menu wrapper and object-arrow state class.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add focused RED tests for the new API and update existing trigger expectations.
- `docs/components/dropdown.md`: add usage examples and API rows.
- `packages/components/es/**` and `packages/components/lib/**`: generated build outputs.

## Task 1: Write Failing Dropdown Tests

**Files:**

- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [ ] Keep imports from Vue Test Utils, Vue, Vitest, ConfigProvider, and Dropdown.
- [ ] Update `renders trigger slot and opens on click` so Dropdown is mounted with `trigger: ['click']`.
- [ ] Update `supports controlled open state` so Dropdown is mounted with `trigger: ['click']`.
- [ ] Add a test named `uses hover as the default trigger`.
- [ ] Mount Dropdown with `menu` and no `trigger` prop.
- [ ] Trigger `click` on `.aheart-dropdown__trigger` and assert `.aheart-dropdown__overlay` does not exist.
- [ ] Trigger `mouseenter` on `.aheart-dropdown__trigger` and assert `.aheart-dropdown__overlay` exists and `openChange` first payload equals `[true, { source: 'trigger' }]`.
- [ ] Add a test named `opens from contextMenu trigger and prevents the native menu`.
- [ ] Mount Dropdown with `trigger: ['contextMenu']`.
- [ ] Trigger `contextmenu` on `.aheart-dropdown__trigger`.
- [ ] Assert the event default was prevented and overlay exists.
- [ ] Add a test named `applies root semantic and overlay class and style hooks`.
- [ ] Mount Dropdown with:
  - `open: true`
  - `menu`
  - `arrow: { pointAtCenter: true }`
  - `className: 'dropdown-class'`
  - `rootClassName: 'dropdown-root'`
  - `style: 'color: red;'`
  - `overlayClassName: 'overlay-class'`
  - `overlayStyle: { minWidth: '220px' }`
  - `classNames` for `root`, `trigger`, `popup`, `menu`, and `arrow`
  - `styles` for `root`, `trigger`, `popup`, `menu`, and `arrow`
- [ ] Assert the classes and styles land on `.aheart-dropdown`, `.aheart-dropdown__trigger`, `.aheart-dropdown__overlay`, `.aheart-dropdown__menu`, and `.aheart-dropdown__arrow`.
- [ ] Add a test named `preserves or destroys hidden overlay according to destroy props`.
- [ ] For the default case, open then close a click-trigger Dropdown and assert `.aheart-dropdown__overlay` still exists but has `display: none`.
- [ ] For `destroyOnHidden: true`, open then close a click-trigger Dropdown and assert `.aheart-dropdown__overlay` does not exist.
- [ ] For `destroyPopupOnHide: true`, open then close a click-trigger Dropdown and assert `.aheart-dropdown__overlay` does not exist.
- [ ] Add a test named `menu click closes by default without openChange close event`.
- [ ] Mount Dropdown with `defaultOpen: true`.
- [ ] Click `[data-menu-key="edit"]`.
- [ ] Assert `click` payload key is `edit`, overlay is hidden, `update:open` includes `[false]`, and `openChange` is undefined.
- [ ] Add a test named `can keep dropdown open after menu click`.
- [ ] Mount Dropdown with `defaultOpen: true` and `menu: { ...menu, closeOnClick: false }`.
- [ ] Click `[data-menu-key="edit"]`.
- [ ] Assert overlay remains visible and no `update:open(false)` was emitted.
- [ ] Add a test named `customizes popup content with slot and popupRender`.
- [ ] Mount one Dropdown with a `popup` slot and assert slot content appears.
- [ ] Mount another Dropdown with `popupRender` returning `h('div', { class: 'custom-popup' }, ['Wrapped'])` and assert custom content appears.
- [ ] Run focused Dropdown tests and confirm the new cases fail.

Command:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- dropdown
```

Expected: FAIL before implementation.

## Task 2: Implement Dropdown Controls

**Files:**

- Modify: `packages/components/src/dropdown/types.ts`
- Modify: `packages/components/src/dropdown/dropdown.vue`
- Modify: `packages/components/src/dropdown/style.css`

- [ ] Extend types with `DropdownArrow`, `DropdownSemanticPart`, `DropdownClassNames`, `DropdownStyles`, `DropdownOpenChangeSource`, and `DropdownOpenChangeInfo`.
- [ ] Extend `DropdownTrigger` to include `contextMenu`.
- [ ] Add `closeOnClick?: boolean` to `DropdownMenuConfig`.
- [ ] Add props for `destroyOnHidden`, `destroyPopupOnHide`, `className`, `rootClassName`, `style`, `overlayClassName`, `overlayStyle`, `classNames`, `styles`, `popupRender`, and `dropdownRender`.
- [ ] Change `trigger` default to `['hover']`.
- [ ] Change `arrow` prop to `Boolean | Object` and default it to `false`.
- [ ] Change `openChange` emit validator to accept `(open, info)`.
- [ ] Add root class/style hooks to `.aheart-dropdown`.
- [ ] Add trigger hooks, `aria-disabled`, and `contextmenu` handler to `.aheart-dropdown__trigger`.
- [ ] Render popup with `v-if="shouldRenderPopup"` and `v-show="mergedOpen"`.
- [ ] Track `hasRenderedOverlay` once `mergedOpen` becomes true.
- [ ] Compute `shouldDestroyOnHidden` from `destroyOnHidden || destroyPopupOnHide`.
- [ ] Apply popup classes `[placement, overlayClassName, classNames.popup]`.
- [ ] Apply popup styles `[overlayStyle, styles.popup]`.
- [ ] Apply arrow semantic hooks and point-at-center class.
- [ ] Wrap the default menu node with `.aheart-dropdown__menu` and menu semantic hooks.
- [ ] Add a local `ARenderNode` component that renders `VNodeChild`.
- [ ] Compute default menu node with `h(AMenu, ...)`.
- [ ] Compute popup content from `popupRender`, then `dropdownRender`, then default menu node.
- [ ] Let the `popup` slot override render props.
- [ ] Keep click, hover, and context menu triggers immediate.
- [ ] Update `setOpen` to accept `{ source, emitOpenChange }`.
- [ ] Use `setOpen(..., { source: 'trigger' })` for trigger interactions.
- [ ] On menu click, emit Dropdown `click`; when `closeOnClick !== false`, close with `emitOpenChange: false`.
- [ ] Run focused Dropdown tests and component typecheck.

Commands:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- dropdown
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

## Task 3: Update Docs And Build Output

**Files:**

- Modify: `docs/components/dropdown.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] Update the basic example to show hover as the default trigger.
- [ ] Add explicit click-trigger example.
- [ ] Add context menu trigger example.
- [ ] Add object-arrow example.
- [ ] Add hidden overlay preservation/destruction example.
- [ ] Add popup customization example using the `popup` slot and `popupRender`.
- [ ] Add semantic styling example.
- [ ] Update API rows for `trigger`, `destroyOnHidden`, `destroyPopupOnHide`, `arrow`, `className`, `rootClassName`, `style`, `overlayClassName`, `overlayStyle`, `classNames`, `styles`, `popupRender`, and `dropdownRender`.
- [ ] Add `menu.closeOnClick` to `DropdownMenuConfig`.
- [ ] Add `DropdownSemanticPart` table.
- [ ] Update Events to document `openChange(open, info)`.
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
test -f packages/components/es/dropdown/index.d.ts && test -f packages/components/lib/dropdown/index.d.ts && grep -q "DropdownSemanticPart" packages/components/es/dropdown/types.d.ts && grep -q "DropdownSemanticPart" packages/components/lib/dropdown/types.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo dropdown-controls-semantic-build-ok
git diff --quiet -- packages/components/es/style.css packages/components/lib/style.css && echo deterministic-style-output-clean
```

Expected: all commands exit 0, final checks print `dropdown-controls-semantic-build-ok` and `deterministic-style-output-clean`, and `git status --short` is clean after generated outputs are committed.

## Self-Review

- Spec coverage: every Dropdown trigger, destroy-on-hidden, arrow, compatibility hook, semantic hook, popup customization, and menu-close requirement has a task.
- Placeholder scan: no unfinished markers or postponed requirements.
- Type consistency: prop, event, source, and semantic part names match the design document.
