# InputNumber Step Offset Design

## Goal

Align `AInputNumber` `step` event offset semantics with Ant-style `InputNumber`.

## Source Behavior

`rc-input-number` emits `onStep(value, info)` where `info.offset` is the current `step`, or the decuple step when Shift is held. The offset is not negated for down steps; the direction is represented by `info.type`.

## Current Gap

`AInputNumber` currently emits a signed numeric `offset`. Down steps emit negative offsets, and string `step` values are converted to numbers in the event info.

## Design

- Change `InputNumberStepInfo.offset` to `number | string`.
- Emit the original `step` value for regular handler, keyboard, and wheel steps.
- Emit the decuple step value for Shift-key keyboard steps.
- Keep `type` as the direction source: `'up'` or `'down'`.
- Do not change stepped values, clamping, keyboard enablement, wheel thresholding, or `stringMode` value types.

## Test Coverage

Update focused InputNumber tests to verify:

- string step emits string offset for both up and down steps
- down keyboard and wheel steps emit positive step offsets with `type: 'down'`

## Out of Scope

- Changing `step` value emission.
- Changing `update:modelValue` or `change` values.
- Changing wheel direction behavior.
