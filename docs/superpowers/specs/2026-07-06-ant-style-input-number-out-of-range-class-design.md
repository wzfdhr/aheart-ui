# InputNumber Out-Of-Range Class Design

## Goal

Expose a root out-of-range state class on `AInputNumber`, aligning with rc InputNumber's range state class while following Aheart's local `is-*` state-class naming.

## Source Behavior

`@rc-component/input-number` includes a root out-of-range class when its internal decimal value is valid but outside the configured min/max range. It explicitly excludes invalid values from the out-of-range class.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` can receive a controlled value outside `min` or `max`, and its step controls already use range comparisons. The root element does not expose an out-of-range state class for styling or semantic root targeting.

## Design

- Add a computed `isOutOfRange` helper near the existing invalid/current value helpers.
- Treat `undefined` and empty string values as empty rather than out-of-range.
- Treat invalid values as not-a-number only, not out-of-range.
- Use strict min/max comparisons:
  - `value < min` is out-of-range.
  - `value > max` is out-of-range.
  - Values exactly equal to `min` or `max` are in range.
- Reuse `isValidValueString` and `compareDecimalStrings` to preserve decimal string behavior.
- Add `is-out-of-range` to the root class object when `isOutOfRange` is true.
- Do not change displayed value, parser behavior, event emission, stepping, clamping, control disabled states, or ARIA behavior.

## Test Coverage

Add a focused InputNumber test that verifies:

- A valid value above `max` renders the root `is-out-of-range` class.
- A valid decimal string below `min` renders the root `is-out-of-range` class.
- A value exactly equal to `max` does not render `is-out-of-range`.
- A non-empty invalid value does not render `is-out-of-range`.

## Out of Scope

- Changing clamp behavior for controlled values.
- Changing visual invalid styles.
- Rejecting invalid controlled values.
- Changing control disabled logic.
- Changing semantic class/style callback APIs.
