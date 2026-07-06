# Ant Style InputNumber String Mode Design

## Context

Ant Design documents `stringMode` for InputNumber so high precision decimal values can be handled as strings instead of losing precision through JavaScript number arithmetic. Aheart InputNumber currently accepts only numeric `modelValue`, `value`, and `defaultValue` props, and all emitted values are numbers or `undefined`.

Official reference:

- https://ant.design/components/input-number/

## Scope

This phase adds:

- `stringMode` prop support.
- String-capable `modelValue`, `value`, and `defaultValue`.
- String-capable `formatter`, `parser`, `update:modelValue`, `change`, and `step` payload types.
- String output for typed input when `stringMode` is true.
- String output for step, keyboard, and wheel changes when `stringMode` is true.
- String decimal addition for regular decimal strings so common high precision step cases keep their exact decimal text.
- Tests, docs, and generated `es` / `lib` InputNumber outputs.

This phase does not change the existing empty input behavior from `undefined` to `null`. It also does not implement `changeOnBlur` or scientific-notation exact arithmetic.

## Behavior

When `stringMode` is false, existing number behavior stays unchanged.

When `stringMode` is true:

- `modelValue`, `value`, and `defaultValue` may be numbers or strings.
- Display uses the string value as-is before applying `decimalSeparator` or `formatter`.
- Default parsing emits the parsed display string rather than converting it to a number.
- Custom `parser` may return either a number or a string; the emitted value is converted to a string.
- Numeric min/max clamping still applies and returns the clamped boundary as a string.
- Control, keyboard, and wheel stepping add `step` as decimal text when possible, preserving examples such as `1 + 0.00000000000001 -> "1.00000000000001"`.
- Existing `step` event metadata continues to include `offset`, `type`, and `emitter`; `offset` remains numeric for compatibility.

## Testing

Add focused InputNumber tests for:

- String `modelValue` display with `stringMode`.
- Typed input emitting string `update:modelValue` and `change` payloads.
- String `defaultValue` acting as the uncontrolled initial value.
- High precision string step output.
- Existing numeric behavior remaining unchanged.

## Documentation

Update `docs/components/input-number.md` with:

- A `stringMode` example.
- API rows for string-capable value props, formatter/parser, events, and `stringMode`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on InputNumber string value mode only.
- Ambiguity check: empty value, min/max clamping, exact arithmetic limits, and step metadata compatibility are explicit.
