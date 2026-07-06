# InputNumber Auto Precision Display Design

## Goal

Align `AInputNumber` default display precision with Ant Design's `InputNumber` behavior when `precision` is not explicitly provided.

## Source Behavior

`rc-input-number` computes display precision from the explicit `precision` prop when present; otherwise it uses the maximum decimal precision from the current value and `step`. This auto precision is skipped while the user is actively typing.

## Current Gap

`AInputNumber` pads default display values only when `precision` is explicitly provided. With `modelValue: 1` and `step: 0.01`, the input displays `1`; Ant-style behavior displays `1.00` outside user typing.

## Design

- Add a small precision helper for decimal strings and numeric scientific notation.
- Keep explicit `precision` as the highest-priority display and value precision.
- Infer default display precision from `max(valuePrecision, stepPrecision)` when no explicit `precision` is provided.
- Keep pending typed text unchanged while `changeOnBlur` is active.
- Keep emitted numeric values unchanged unless explicit `precision` is provided.

## Test Coverage

Add focused InputNumber coverage for `modelValue: 1` with `step: 0.01` and `modelValue: 1.2` with `step: "0.01"` expecting default displayed values `1.00` and `1.20`.

## Out of Scope

- Auto rounding emitted numeric values based on `step`.
- Changing custom `formatter` behavior.
- Changing `stringMode` emitted value types.
