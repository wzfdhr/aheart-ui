# Ant Style Radio Controls Semantic API Design

## Context

`ARadio` and `ARadioGroup` already cover basic checked state, disabled inheritance, options-driven groups, button-style groups, size, and block layout. Ant Design Radio exposes a wider control surface: standalone `checked` / `defaultChecked`, semantic `classNames` / `styles`, group `value` / `defaultValue`, primitive options, option metadata, and root style hooks.

Official reference:

- https://ant.design/components/radio/

## Scope

This slice adds:

- `ARadio` controlled alias `checked`, while keeping `modelValue` as the Vue-first API.
- `ARadio` uncontrolled initial state through `defaultChecked`.
- `ARadio` update emissions for both `update:modelValue` and `update:checked`.
- `ARadio` `change(checked, event)` payload parity with Checkbox and Switch.
- `ARadio` semantic style hooks: `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Radio semantic parts: `root`, `icon`, and `label`.
- `ARadioGroup` controlled alias `value`, while keeping `modelValue`.
- `ARadioGroup` uncontrolled initial state through `defaultValue`.
- `ARadioGroup` support for `options` as `string[]`, `number[]`, or object options.
- Option-level `className`, `style`, and `title`.
- Group root `className`, `rootClassName`, and `style`.
- Tests, docs, and generated build outputs.

This slice does not add dotted runtime aliases such as `ARadio.Group`, a separate `ARadioButton` component, child radio composition inside a group, imperative `focus()` / `blur()` exposes, or Form.Item binding integration.

## Behavior

### Radio Value Resolution

The standalone radio checked state resolves in this order:

1. `checked`
2. `modelValue`
3. internal uncontrolled state initialized from `defaultChecked`, then `false`

If `checked` or `modelValue` is present, selecting the radio does not mutate internal state. If neither is present, selecting the radio updates internal state before emitting events.

On user change, `ARadio` emits:

- `update:modelValue(true)`
- `update:checked(true)`
- `change(true, event)`

Disabled radios do not emit through native user interaction.

### RadioGroup Value Resolution

The group selected value resolves in this order:

1. `value`
2. `modelValue`
3. internal uncontrolled state initialized from `defaultValue`

If `value` or `modelValue` is present, option changes do not mutate internal state. If neither is present, option changes update internal state before emitting.

On option change, `ARadioGroup` emits:

- `update:modelValue(nextValue)`
- `update:value(nextValue)`
- `change(nextValue)`

String and number options normalize to `{ label: String(option), value: option }`. Object options preserve `label`, `value`, `disabled`, `className`, `style`, and `title`.

### Semantic DOM

For `ARadio`:

- `root`: the root `<label>`
- `icon`: the visible radio indicator
- `label`: the label text/content wrapper

For `ARadioGroup`, `className`, `rootClassName`, and `style` apply to the group root wrapper. Option-level metadata applies to either the rendered `ARadio` root or the button-style option label.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before implementation.
- Verify standalone alias precedence and uncontrolled `defaultChecked`.
- Verify standalone event payloads and semantic style hooks.
- Verify group `value` alias and uncontrolled `defaultValue`.
- Verify group string/number option normalization.
- Verify option-level `className`, `style`, and `title` in both normal and button modes.
- Run targeted Radio tests, package typecheck, docs build, package build, then full verification.

## Documentation

Update `docs/components/radio.md`:

- Add examples for controlled aliases and defaults.
- Add an options example with string/number/object options.
- Add semantic styling examples.
- Expand standalone, group, option, events, slots, and Semantic DOM tables.
