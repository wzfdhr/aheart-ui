# Ant Style Popconfirm Hidden Lifecycle Design

## Context

Aheart Popconfirm already supports renderable title, description, and icon content, trigger control, semantic class/style hooks, popup mounting through `getPopupContainer`, and teleported hover handoff.

Ant Design Popconfirm exposes shared tooltip-style lifecycle compatibility props including `destroyOnHidden`, the older `destroyTooltipOnHide` alias, and `fresh`. Tooltip, Popover, and Dropdown in Aheart already model hidden popup preservation instead of always destroying the popup subtree.

Reference: Ant Design Popconfirm documentation, `https://ant.design/components/popconfirm/`.

## Goal

Align `APopconfirm` hidden popup lifecycle with the Ant-style shared floating API while preserving current confirmation, cancellation, trigger, popup container, semantic styling, and hover behavior.

## Behavior

- `destroyOnHidden?: boolean` is accepted and destroys the popup DOM after close when true.
- `destroyTooltipOnHide?: boolean` is accepted as the older compatibility alias and has the same effect as `destroyOnHidden`.
- Hidden Popconfirm DOM is preserved by default after the popup has rendered once.
- `fresh?: boolean` is accepted as a compatibility prop. Vue reactive content already updates while preserved, so this prop does not require special caching behavior.
- Disabled Popconfirm still does not render or preserve a popup.
- Confirm and cancel still emit their events, close the popup, and now leave the hidden popup subtree mounted by default.
- Teleport, `getPopupContainer`, popup click, hover handoff, class/style hooks, button props, and renderable content remain unchanged.

## Files

- `packages/components/src/popconfirm/types.ts`: add lifecycle compatibility props.
- `packages/components/src/popconfirm/popconfirm.vue`: preserve hidden popup DOM by default, destroy it when either lifecycle prop is true, and keep disabled handling strict.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add lifecycle tests and update close assertions for default preservation.
- `docs/components/popconfirm.md`: document the lifecycle props.
- Generated component outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm` are refreshed by the component build.

## Testing

- Focused Popconfirm tests must first fail because current Popconfirm destroys the popup on every close and does not declare `fresh`.
- After implementation, focused tests must pass with:
  - default hidden popup preservation,
  - `destroyOnHidden` destruction,
  - `destroyTooltipOnHide` alias destruction,
  - `fresh` consumed as a declared prop,
  - existing confirm, cancel, Teleport, hover, semantic, and renderable behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popconfirm lifecycle compatibility.
- Consistency check: source props, docs rows, tests, and generated output use the same public names.
