# Ant Style Popconfirm Controls And Semantic Hooks Design

## Context

The current Popconfirm component supports title, description, placement, trigger, controlled or default open state, OK and cancel text, `okType`, disabled state, `showCancel`, arrow, z-index, title/description/icon slots, and confirm/cancel/open events.

Ant Design's Popconfirm API also exposes a prop-level icon, OK and cancel button prop bags, popup click handling, color, and semantic class/style hooks. This slice adds the Popconfirm-owned parts of that surface without expanding the shared floating positioning engine.

Reference checked: https://ant.design/components/popconfirm/

## Goals

- Add `icon` as a string prop. The `icon` slot remains the highest-priority override.
- Add `okButtonProps` and `cancelButtonProps` using the local `AButton` prop surface.
- Add `color` and pass it through the existing floating popup style helper.
- Add `popupClick` event that receives the popup click `MouseEvent`.
- Add root compatibility hooks: `className`, `rootClassName`, and `style`.
- Add semantic `classNames` and `styles` hooks for `root`, `trigger`, `popup`, `arrow`, `message`, `icon`, `text`, `title`, `description`, `actions`, `cancelButton`, and `okButton`.
- Preserve current title, description, slots, trigger behavior, controlled open behavior, disabled behavior, `showCancel`, `okType`, z-index, confirm, cancel, and open-change behavior.

## Non-Goals

- Do not implement `getPopupContainer`, `autoAdjustOverflow`, `fresh`, `destroyOnHidden`, or custom `align` in this slice. Those require shared floating-layer work across Tooltip, Popover, Dropdown, and Popconfirm.
- Do not add promise-aware confirm loading. Button loading can already be passed through `okButtonProps`.
- Do not add rich render functions for text props; keep slots as the Vue-native rich-content path.

## API Design

`Popconfirm.icon` renders inside `.aheart-popconfirm__icon` when no `icon` slot is provided. The fallback remains `!`.

`Popconfirm.okButtonProps` and `Popconfirm.cancelButtonProps` are partial local `ButtonProps` objects. Defaults are:

- OK button: `{ size: 'small', type: okType }`
- Cancel button: `{ size: 'small' }`

The prop bags are merged after those defaults so callers can override `size`, `type`, `disabled`, `loading`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.

`Popconfirm.color` uses the existing `getFloatingPopupStyle(color, zIndex)` helper, matching Popover's current behavior.

`popupClick` emits when the popup container is clicked. It does not close the popup by itself.

`className`, `rootClassName`, and `style` attach to the root `.aheart-popconfirm` element.

`classNames` and `styles` accept semantic maps keyed by:

- `root`
- `trigger`
- `popup`
- `arrow`
- `message`
- `icon`
- `text`
- `title`
- `description`
- `actions`
- `cancelButton`
- `okButton`

## Behavior

Controlled and uncontrolled open behavior remains unchanged.

Disabled Popconfirm still never opens and still does not emit open-change requests from trigger events.

Confirm and cancel still emit their action event first and then request close.

`okButtonProps.disabled` prevents the local `AButton` from emitting a click, so confirm does not fire.

`cancelButtonProps.disabled` prevents cancel from firing.

## Testing

Add focused Popconfirm tests before implementation:

- `icon`, `color`, `okButtonProps`, and `cancelButtonProps` render expected text, style, and button attributes/classes.
- root and semantic class/style hooks apply to root, trigger, popup, arrow, message, icon, text, title, description, actions, cancelButton, and okButton.
- `popupClick` emits the `MouseEvent` and does not close the popup.
- existing open, confirm, cancel, disabled, and `showCancel` behavior remains stable.

Run the focused test first to verify RED, then implement and run Popconfirm tests plus package typecheck.

## Documentation

Update `docs/components/popconfirm.md` with examples for icon/color, button prop bags, popup click, and semantic styling. Expand API and Events tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no shared floating refactor in this slice.
- Ambiguity check: unsupported Ant APIs are explicit non-goals.
- Type consistency: semantic part names and event names match the API design above.
