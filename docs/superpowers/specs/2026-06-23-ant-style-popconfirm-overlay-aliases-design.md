# Ant Style Popconfirm Overlay Alias Design

## Context

Aheart Tooltip and Popover already support Ant-style legacy overlay styling aliases:

- `overlayClassName`
- `overlayStyle`
- `overlayInnerStyle`

Popconfirm supports semantic class/style hooks, popup mounting, hover timing, hidden lifecycle, and object arrow configuration, but it does not yet accept those overlay aliases. Ant Design still documents these aliases on the shared Tooltip/Popover/Popconfirm floating API as deprecated compatibility props.

Reference: Ant Design Popconfirm documentation, `https://ant.design/components/popconfirm/`.

## Goal

Align `APopconfirm` with the shared legacy overlay styling API while preserving semantic class/style hooks as the preferred path.

## Behavior

- `overlayClassName?: string` applies to the popup element together with `classNames.popup`.
- `overlayStyle?: StyleValue` applies to the popup element together with `styles.popup`.
- `overlayInnerStyle?: StyleValue` applies to a new internal content container.
- `classNames.container` and `styles.container` are added as semantic hooks for the same internal content container.
- The internal content container wraps the message and actions content, not the arrow.
- Existing `classNames.message`, `classNames.actions`, button hooks, icon/title/description hooks, popup click, confirm/cancel, hidden lifecycle, Teleport, and hover behavior remain unchanged.

## Files

- `packages/components/src/popconfirm/types.ts`: add `container` semantic part and overlay alias props.
- `packages/components/src/popconfirm/popconfirm.vue`: map overlay aliases and add the internal container wrapper.
- `packages/components/src/popconfirm/style.css`: style the internal container so existing layout remains equivalent.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add alias and container semantic coverage.
- `docs/components/popconfirm.md`: document the aliases and `container` semantic part.
- Generated component outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm` are refreshed by the component build.

## Testing

- Focused Popconfirm tests must first fail because the props are not declared, the popup does not receive overlay aliases, and the container node does not exist.
- After implementation, focused tests must pass with:
  - popup class/style aliases applied,
  - inner style applied to the content container,
  - `classNames.container` and `styles.container` applied,
  - existing semantic hooks and confirm/cancel behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popconfirm overlay styling compatibility and its container semantic hook.
- Consistency check: source props, docs rows, tests, and generated output use the same public names.
