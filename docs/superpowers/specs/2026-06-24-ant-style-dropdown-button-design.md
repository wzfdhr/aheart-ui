# Ant Style Dropdown Button Design

## Context

Aheart Dropdown already supports Ant-style menu overlays, popup mounting, hidden lifecycle, overlay class/style aliases, popup render aliases, and arrow configuration. Ant Design also exposes a split-button convenience entry named `Dropdown.Button`; its docs show button-with-menu and loading examples, and its source keeps the component as a compatibility export.

References:

- Ant Design Dropdown documentation, `https://ant.design/components/dropdown/`
- Ant Design Dropdown button source, `https://github.com/ant-design/ant-design/blob/master/components/dropdown/dropdown-button.tsx`

## Goal

Add a Vue-compatible `ADropdownButton` component and `Dropdown.Button` static export that compose the existing `AButton` and `ADropdown` without duplicating dropdown overlay behavior.

## Behavior

- `Dropdown.Button` and named exports `DropdownButton` / `ADropdownButton` point to the same installed component.
- The root renders an inline split button with a left main `AButton` and a right dropdown trigger `AButton`.
- The left button renders the default slot and emits `click` for the primary action.
- The right button controls the existing `ADropdown` instance and inherits `menu`, `trigger`, `placement`, `open`, `defaultOpen`, `arrow`, `getPopupContainer`, `destroyOnHidden`, `destroyPopupOnHide`, `overlayClassName`, `overlayStyle`, `classNames`, `styles`, `popupRender`, and `dropdownRender`.
- The split button default `placement` is `bottomRight`, matching Ant's button dropdown default.
- `type`, `danger`, `size`, `loading`, `htmlType`, `nativeType`, `href`, `target`, and `title` apply to the left main button where applicable.
- `disabled` disables both buttons and prevents dropdown interaction; `loading` disables the dropdown trigger while the main button shows loading.
- `icon` customizes the right trigger icon; the default icon is a compact down chevron.
- `buttonsRender` can transform or replace the `[mainButton, dropdownTrigger]` nodes before render.
- Menu item clicks are forwarded as `menuClick` so they do not collide with the main button's `click` event.

## Files

- `packages/components/src/dropdown/types.ts`: add DropdownButton prop, render, and emit types.
- `packages/components/src/dropdown/dropdown-button.vue`: compose `AButton` and `ADropdown`.
- `packages/components/src/dropdown/style.css`: add split-button layout styles.
- `packages/components/src/dropdown/index.ts`: export and attach `Dropdown.Button`.
- `packages/components/src/index.ts`: install and export `DropdownButton`.
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`: add split-button behavior and export coverage.
- `docs/components/dropdown.md`: document `ADropdownButton`, its API, events, and usage.
- Generated outputs under `packages/components/es` and `packages/components/lib` are refreshed by the component build.

## Testing

- Focused Dropdown tests must first fail because `DropdownButton` and `Dropdown.Button` do not exist.
- After implementation, focused tests must pass with:
  - split button rendering,
  - main button click emission,
  - dropdown trigger opening and menu rendering,
  - overlay aliases passed through,
  - loading/disabled trigger suppression,
  - `buttonsRender` transformation,
  - static and named export availability.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Dropdown.Button compatibility and does not change core Dropdown overlay behavior.
- Consistency check: exported names, docs rows, tests, and generated output use `DropdownButton`, `ADropdownButton`, and `Dropdown.Button` consistently.
