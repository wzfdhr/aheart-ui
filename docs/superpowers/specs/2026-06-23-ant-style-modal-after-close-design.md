# Ant Style Modal After Close Design

## Context

Ant Design Modal documents `afterClose` as a callback that runs after a modal has closed completely. Aheart Modal currently emits `afterOpenChange(open)` when the controlled `open` prop changes, but it does not expose a close-only event for consumers that need cleanup after the dialog is gone.

Official reference:

- https://ant.design/components/modal/

## Scope

This phase adds:

- An `afterClose` event to `AModal`.
- Emission when the controlled `open` prop changes to `false`.
- Tests for normal close transitions and `destroyOnHidden` close transitions.
- Documentation in `docs/components/modal.md`.
- Generated `es` and `lib` Modal outputs from the component build.

This phase does not add transition timing, motion hooks, focus restoration, callback props, static Modal methods, or async close behavior.

## Behavior

`AModal` stays controlled by `open`. Close controls such as the close button, Cancel button, mask click, and Escape continue to emit `update:open` and `close`; the parent still decides whether the modal is actually closed by changing `open` to `false`.

`afterClose` fires from the `open` watcher after a real `open -> false` transition. It does not fire when a close control requests closing but the parent leaves `open` as `true`.

When `destroyOnHidden` or `destroyOnClose` removes the modal subtree, `afterClose` still emits during the same close transition.

The event order for a close transition is:

1. update internal render state
2. emit `afterOpenChange(false)`
3. emit `afterClose`

## Testing

Add Vitest coverage for:

- `afterClose` emitting once when `open` changes from `true` to `false`.
- `afterClose` not being emitted for an open transition.
- `afterClose` emitting when `destroyOnHidden` removes the modal subtree.

## Documentation

Update the Modal Events table with:

- `afterClose`: fires after the dialog has fully closed.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on one Modal event only.
- Ambiguity check: controlled-close timing and event order are explicit.
