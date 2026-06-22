# Ant Style Checkbox Controls Semantic API Design

## Context

`ACheckbox` and `ACheckboxGroup` already cover basic checked state, disabled inheritance, indeterminate state, and options-driven groups. Ant Design Checkbox exposes a wider control surface: standalone `checked` / `defaultChecked`, semantic `classNames` / `styles`, group `value` / `defaultValue`, and option-level `className`, `style`, and `title`.

Official reference:

- https://ant.design/components/checkbox/

## Scope

This slice adds:

- `ACheckbox` controlled alias `checked`, while keeping `modelValue` as the Vue-first API.
- `ACheckbox` uncontrolled initial state through `defaultChecked`.
- `ACheckbox` update emissions for both `update:modelValue` and `update:checked`.
- `ACheckbox` `change(checked, event)` payload parity with other local controls.
- `ACheckbox` semantic style hooks: `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Checkbox semantic parts: `root`, `icon`, and `label`.
- `ACheckboxGroup` controlled alias `value`, while keeping `modelValue`.
- `ACheckboxGroup` uncontrolled initial state through `defaultValue`.
- `ACheckboxGroup` support for `options` as `string[]`, `number[]`, or object options.
- Option-level `className`, `style`, and `title`.
- Group root `className`, `rootClassName`, and `style`.
- Tests, docs, and generated build outputs.

This slice does not add dotted runtime aliases such as `ACheckbox.Group`, child-checkbox composition inside the group, imperative `focus()` / `blur()` exposes, or Form.Item binding integration. Those can be handled in later focused passes.

## Behavior

### Checkbox Value Resolution

The standalone checkbox checked state resolves in this order:

1. `checked`
2. `modelValue`
3. internal uncontrolled state initialized from `defaultChecked`, then `false`

If `checked` or `modelValue` is present, clicking does not mutate internal state. If neither is present, clicking updates internal state before emitting events.

On user change, `ACheckbox` emits:

- `update:modelValue(checked)`
- `update:checked(checked)`
- `change(checked, event)`

Disabled checkboxes do not emit through native user interaction.

### CheckboxGroup Value Resolution

The group selected value resolves in this order:

1. `value`
2. `modelValue`
3. internal uncontrolled state initialized from `defaultValue`, then `[]`

If `value` or `modelValue` is present, option changes do not mutate internal state. If neither is present, option changes update internal state before emitting.

On option change, `ACheckboxGroup` emits:

- `update:modelValue(nextValue)`
- `update:value(nextValue)`
- `change(nextValue)`

String and number options normalize to `{ label: String(option), value: option }`. Object options preserve `label`, `value`, `disabled`, `className`, `style`, and `title`.

### Semantic DOM

For `ACheckbox`:

- `root`: the root `<label>`
- `icon`: the visible checkbox indicator
- `label`: the label text/content wrapper

For `ACheckboxGroup`, `className`, `rootClassName`, and `style` apply to the group root wrapper.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before implementation.
- Verify standalone alias precedence and uncontrolled `defaultChecked`.
- Verify standalone event payloads and semantic style hooks.
- Verify group `value` alias and uncontrolled `defaultValue`.
- Verify group string/number option normalization.
- Verify option-level `className`, `style`, and `title`.
- Run targeted Checkbox tests, package typecheck, docs build, package build, then full verification.

## Documentation

Update `docs/components/checkbox.md`:

- Add examples for controlled aliases and defaults.
- Add an options example with string/number/object options.
- Add semantic styling examples.
- Expand standalone, group, option, events, slots, and Semantic DOM tables.
