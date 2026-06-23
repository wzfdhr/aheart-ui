# Ant Style Modal Focus Trigger Design

## Context

Ant Design Modal documents the old `focusTriggerAfterClose` prop as deprecated and points consumers to `focusable.focusTriggerAfterClose`. Aheart Modal currently has no focus restoration behavior after the dialog closes.

Official reference:

- https://ant.design/components/modal/

## Scope

This phase adds:

- `focusable?: { focusTriggerAfterClose?: boolean }` to `AModal`.
- Deprecated-compatible `focusTriggerAfterClose?: boolean` support.
- Default focus restoration to the element that was active when the modal opened.
- Tests, docs, and generated `es` / `lib` Modal outputs.

This phase does not add focus trapping, auto-focus buttons, portal `getContainer`, static Modal methods, or animation timing changes.

## Behavior

When a modal transitions from closed to open, it records `document.activeElement` if it is an `HTMLElement`.

When that modal later transitions from open to closed:

- If `focusable.focusTriggerAfterClose` is `false`, focus is not restored.
- If `focusable.focusTriggerAfterClose` is `true`, focus is restored even when the deprecated `focusTriggerAfterClose` prop is `false`.
- If `focusable.focusTriggerAfterClose` is omitted, `focusTriggerAfterClose` is used when provided.
- If both values are omitted, focus restoration is enabled by default.
- Focus is restored only when the saved element is still connected to `document`.

Focus restoration runs after the close state change has been queued, so consumers observing the closed state do not see the modal retain focus.

## Testing

Add Vitest coverage for:

- Default focus restoration after an open-to-close transition.
- New `focusable.focusTriggerAfterClose` taking precedence over deprecated `focusTriggerAfterClose`.
- Disabled `focusable.focusTriggerAfterClose` leaving current focus unchanged.

## Documentation

Update `docs/components/modal.md` to:

- Add a focus restoration example.
- Add `focusable` to the API table.
- Add deprecated-compatible `focusTriggerAfterClose` to the API table with guidance to prefer `focusable.focusTriggerAfterClose`.
- Add a `ModalFocusableConfig` reference section.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on focus restoration only.
- Ambiguity check: default behavior, precedence, disabled behavior, and detached-element handling are explicit.
