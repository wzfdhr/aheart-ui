# InputNumber Default Value Design

## Goal

Align `AInputNumber` with the Ant Design InputNumber API by supporting `defaultValue` as an uncontrolled initial value.

## Source API

Ant Design documents `defaultValue` as the initial value for `InputNumber`.

## Current Gap

`AInputNumber` currently only reads `modelValue`. When a consumer passes `defaultValue` without `modelValue`, the input renders empty and component-driven changes do not update the displayed value internally.

## Design

- Add a `defaultValue?: number` prop.
- Treat the component as controlled when `modelValue !== undefined`.
- Use internal state initialized from `defaultValue` when uncontrolled.
- Keep existing controlled behavior unchanged: `modelValue` wins over `defaultValue`.
- On user input, clear, and step interactions:
  - update internal state only when uncontrolled
  - always emit `update:modelValue` and `change`
- Keep the existing numeric value model for this stage.

## Testing

Add a focused test that mounts with `defaultValue`, verifies the initial display, clicks a step control, verifies the updated display, and verifies emitted values.

## Out of Scope

- `stringMode`
- `changeOnBlur`
- arbitrary precision values
- syncing a later `defaultValue` prop change into internal state
