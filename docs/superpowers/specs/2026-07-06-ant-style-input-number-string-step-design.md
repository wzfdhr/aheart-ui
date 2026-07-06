# InputNumber String Step Design

## Goal

Align `AInputNumber` with the Ant Design `InputNumber` API by allowing `step` to accept numeric strings as well as numbers.

## Source API

Ant Design documents `step` as `number | string`, with default `1`, and describes it as the amount by which the current value is increased or decreased.

## Current Gap

`AInputNumber` currently declares `step` as `Number`. When a consumer passes a string value such as `"0.5"`, runtime step interactions can concatenate instead of adding numerically.

## Design

- Keep `modelValue` numeric for this stage.
- Accept `step` as `number | string`.
- Normalize `step` to a finite number for all component-driven interactions:
  - control buttons
  - keyboard arrow steps
  - wheel steps
- Preserve the public `step` prop value on the native input attribute so decimal string values remain visible to the browser.
- Keep the existing `step` event contract: `{ offset: number; type: 'up' | 'down' }`.
- Fall back to `1` for invalid string values so interactions remain predictable.

## Test Coverage

Add a focused InputNumber test that mounts with `step: '0.5'`, clicks both controls, and verifies numeric emitted values plus numeric step event offsets.

## Out of Scope

- `stringMode`
- arbitrary-precision arithmetic
- uncontrolled `defaultValue`
- changing `modelValue` or `change` event value types
