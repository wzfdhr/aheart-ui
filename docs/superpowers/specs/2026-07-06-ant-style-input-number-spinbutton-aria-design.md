# InputNumber Spinbutton ARIA Design

## Goal

Align `AInputNumber` inner input accessibility semantics with rc InputNumber.

## Source Behavior

`@rc-component/input-number` renders the inner input with `role="spinbutton"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.

Source reference: `https://raw.githubusercontent.com/react-component/input-number/master/src/InputNumber.tsx`

## Current Gap

`AInputNumber` forwards native `min`, `max`, and `step` attributes to the inner input, but it does not expose the equivalent spinbutton ARIA metadata. Assistive technology cannot reliably identify the input as a numeric spinbutton with a current value and optional bounds.

## Design

- Add `role="spinbutton"` to the inner input.
- Bind `aria-valuemin` to `min` when present.
- Bind `aria-valuemax` to `max` when present.
- Bind `aria-valuenow` to the current merged value when present.
- Leave `aria-valuenow` unset when the current value is empty or undefined.
- Do not change value parsing, formatting, stepping, min/max clamping, native attr forwarding, or emitted values.

## Test Coverage

Add a focused InputNumber test that mounts with `modelValue`, `min`, and `max`, then verifies the inner input has:

- `role="spinbutton"`
- `aria-valuemin`
- `aria-valuemax`
- `aria-valuenow`

Add a boundary test that mounts with an empty string current value and verifies `aria-valuenow` is not rendered.

## Out of Scope

- Changing current value semantics.
- Adding new emitted events.
- Implementing out-of-range styling.
- Changing the existing native `min`, `max`, or `step` attributes.
