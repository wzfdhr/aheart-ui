# InputNumber Invalid Boundary Controls Design

## Goal

Keep `AInputNumber` step controls from being disabled by min/max boundary comparisons when the current value is invalid or empty.

## Source Behavior

`@rc-component/input-number` computes `upDisabled` and `downDisabled` from validated decimal values. If the current decimal value is missing or invalid, the boundary-disabled computation returns `false` instead of comparing the invalid value against `min` or `max`.

Source reference: `https://github.com/react-component/input-number/blob/master/src/InputNumber.tsx?plain=1`

## Current Gap

`AInputNumber` currently compares `String(mergedValue)` with `min`/`max` whenever a boundary prop exists. For an invalid controlled value such as `abc`, `compareDecimalStrings('abc', '1')` falls back to numeric comparison and treats the invalid value as below `min`, causing the decrement control to render disabled.

## Design

- Update the existing `isValueAtOrAboveMax` and `isValueAtOrBelowMin` computeds.
- Keep the current inclusive boundary behavior for valid values:
  - `value >= max` disables increase.
  - `value <= min` disables decrease.
- Return `false` for `undefined`, empty string, or values that fail `isValidValueString(String(value))`.
- Do not change the root `is-not-a-number` or `is-out-of-range` state classes.
- Do not change parsing, clamping, stepping arithmetic, emitted values, keyboard behavior, wheel behavior, or disabled/readOnly handling.

## Test Coverage

Add a focused InputNumber test that verifies:

- A non-empty invalid current value with `min` and `max` leaves both step controls enabled.
- A value exactly equal to `max` still disables increase.
- A value exactly equal to `min` still disables decrease.

## Out of Scope

- Changing how stepping behaves after a user activates controls while the controlled value is invalid.
- Changing empty-value commit behavior.
- Changing min/max prop types.
- Changing visual styles for disabled controls.
