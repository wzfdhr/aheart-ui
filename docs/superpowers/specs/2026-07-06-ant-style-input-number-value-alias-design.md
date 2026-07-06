# InputNumber Value Alias Design

## Goal

Align `AInputNumber` with the Ant Design InputNumber controlled value API by accepting a `value` prop in addition to Vue's `modelValue`.

## Source API

Ant Design documents `value` as the controlled current value for `InputNumber`.

## Current Gap

`AInputNumber` currently only treats `modelValue` as controlled. Passing `value` renders an empty input and step interactions start from zero instead of the provided value.

## Design

- Add `value?: number` to InputNumber props.
- Treat the component as controlled when either `modelValue` or `value` is provided.
- Prefer `modelValue` when both are provided, matching the existing Vue API as the highest-priority integration path.
- Keep emitted events unchanged:
  - `update:modelValue`
  - `change`
  - `step`
- Update internal display, formatter input, and step arithmetic to use the merged controlled/uncontrolled value.

## Testing

Add a focused test that mounts with `value`, verifies initial display, clicks the increase control, and verifies emitted next value and step metadata.

## Out of Scope

- Adding an `update:value` event
- Changing `modelValue` behavior
- `stringMode`
- `changeOnBlur`
