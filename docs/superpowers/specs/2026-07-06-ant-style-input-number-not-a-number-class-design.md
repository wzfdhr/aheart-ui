# InputNumber Not-A-Number Class Design

## Goal

Expose a root not-a-number state class on `AInputNumber`, aligning with rc InputNumber's invalid numeric state class while following Aheart's local `is-*` state-class naming.

## Source Behavior

`@rc-component/input-number` includes a root not-a-number class when its internal decimal value is `NaN`.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` can receive a non-empty invalid string value such as `abc`. It already avoids rendering invalid `aria-valuenow`, but the root element does not expose a state class for styling or semantic root targeting.

## Design

- Add a computed `isNotANumber` helper near the existing `ariaValueNow` helper.
- Treat `undefined` and empty string values as empty rather than not-a-number.
- Treat non-empty values that fail `isValidValueString(String(value))` as not-a-number.
- Add `is-not-a-number` to the root class object when `isNotANumber` is true.
- Do not change displayed value, parser behavior, event emission, stepping, clamping, or ARIA behavior.

## Test Coverage

Add a focused InputNumber test that verifies:

- `modelValue: 'abc'` renders the root `is-not-a-number` class.
- An empty string current value does not render `is-not-a-number`.
- A valid high-precision string value does not render `is-not-a-number`.

## Out of Scope

- Adding out-of-range state classes.
- Changing visual invalid styles.
- Rejecting invalid controlled values.
- Changing semantic class/style callback APIs.
