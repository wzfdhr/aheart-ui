# InputNumber Invalid ARIA Value Design

## Goal

Align `AInputNumber` spinbutton `aria-valuenow` behavior with rc InputNumber for invalid current values.

## Source Behavior

`@rc-component/input-number` renders `aria-valuenow` as `null` when its internal decimal value is invalid, and otherwise renders the decimal value string.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` already omits `aria-valuenow` for empty values, but it still renders non-empty invalid string values such as `abc` as `aria-valuenow="abc"`. That is invalid spinbutton metadata.

## Design

- Reuse the existing decimal validation helper for `ariaValueNow`.
- Keep omitting `aria-valuenow` for `undefined` and empty string values.
- Omit `aria-valuenow` for non-finite or non-decimal values.
- Keep rendering valid numeric strings, high-precision stringMode values, and number values as strings.
- Do not change displayed value, parsing, event emission, stepping, or controlled value semantics.

## Test Coverage

Add a focused InputNumber test that verifies:

- `modelValue: 'abc'` does not render `aria-valuenow`.
- A valid high-precision string value still renders the same `aria-valuenow` string.

## Out of Scope

- Rejecting invalid controlled values.
- Changing visual invalid styling.
- Changing the default parser.
- Changing value clamping.
