# InputNumber Autocomplete Off Design

## Goal

Align `AInputNumber` native input autocomplete behavior with rc InputNumber.

## Source Behavior

`@rc-component/input-number` renders the native input with `autoComplete="off"` before spreading rest props, so the default is off while callers can still override it.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` forwards user-provided native attributes, but it does not set a default `autocomplete` value when no attribute is supplied.

## Design

- Add a computed native autocomplete value near the existing input attribute helpers.
- Use `attrs.autocomplete` or `attrs.autoComplete` when callers provide a string.
- Fall back to `off` when no explicit autocomplete value is supplied.
- Filter `autocomplete` and `autoComplete` out of `inputAttrs` so the explicit binding owns the final native attribute.
- Do not change value parsing, formatting, stepping, event emission, or root/input attr routing beyond autocomplete.

## Test Coverage

Add a focused InputNumber test that verifies:

- The inner native input renders `autocomplete="off"` by default.
- An explicit `autocomplete="on"` native attribute overrides the default.

## Out of Scope

- Changing the component's controlled/uncontrolled value behavior.
- Changing which non-autocomplete native attributes are forwarded.
- Adding browser-specific autofill handling.
