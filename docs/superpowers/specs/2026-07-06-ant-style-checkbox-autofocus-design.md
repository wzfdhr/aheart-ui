# Ant Style Checkbox Autofocus Design

## Goal

Add Ant-style `autoFocus` support to `ACheckbox`.

## Context

`ACheckbox` already exposes `focus()`, `blur()`, `nativeElement`, and native input `focus` / `blur` events. Ant Design Checkbox documents `autoFocus` as a boolean prop. `AInputNumber`, `ARadio`, and `ASwitch` now support equivalent autofocus behavior, so Checkbox should use the same pattern.

## Requirements

- Add an `autoFocus` boolean prop to `ACheckbox`.
- On mount, if `autoFocus` is true, focus the native `<input type="checkbox">`.
- Reuse the existing `focus()` helper so the focus target stays consistent with the imperative API.
- Preserve checked state priority, `indeterminate`, disabled inheritance, events, semantic class/style hooks, and `nativeElement`.
- Update Checkbox documentation to include `autoFocus`.
- Refresh generated `es` and `lib` package output.

## Architecture

Keep the existing `inputRef` and `focus()` helper. Import `nextTick` and `onMounted`, then call `nextTick(focus)` when `props.autoFocus` is true. This mirrors the existing Radio and Switch autofocus implementation.

## Testing

Add a focused Checkbox test that mounts into `document.body`, passes `autoFocus`, awaits Vue's mount tick, and verifies `document.activeElement` is the native checkbox input. The test should fail before implementation because Checkbox does not declare or use `autoFocus`.

## Documentation

Update `docs/components/checkbox.md`:

- Add `autoFocus` to the Checkbox API table.
- Show `auto-focus` in the focus-control demo so the behavior is discoverable.

## Out of Scope

- Adding CheckboxGroup autofocus behavior.
- Changing CheckboxGroup direction aliases.
- Changing `focus()` / `blur()` event behavior.
- Changing `nativeElement` target.

## Self Review

- Placeholder scan: no placeholders remain.
- Consistency check: autofocus target matches the existing imperative `focus()` target.
- Scope check: this is a single Checkbox prop addition.
- Ambiguity check: root `nativeElement` and inner input focus target remain separate and explicit.
