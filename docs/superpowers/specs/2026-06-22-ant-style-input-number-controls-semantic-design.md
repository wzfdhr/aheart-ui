# Ant Style InputNumber Controls And Semantic Hooks Design

## Goal

Expand InputNumber toward the Ant Design InputNumber API surface with configurable control icons, mouse-wheel stepping, formatter info compatibility, and semantic styling hooks while preserving the existing numeric value, min/max, step, precision, formatter/parser, prefix/suffix, keyboard, status, variant, size, disabled, and ConfigProvider behavior.

Reference: https://ant.design/components/input-number/

This slice follows the official InputNumber API names for `controls`, `changeOnWheel`, `formatter`, `classNames`, and `styles`.

## Scope

Implement:

- `controls` object form with `upIcon` and `downIcon`.
- `changeOnWheel` boolean for mouse-wheel stepping.
- `formatter(value, info)` compatibility, where `info` includes `userTyping` and `input`.
- `className`, `rootClassName`, and `style` for InputNumber root customization.
- `classNames` and `styles` for semantic parts: `root`, `input`, `prefix`, `suffix`, `actions`, and `action`.

Keep:

- Existing boolean `controls` behavior.
- Existing `modelValue`, `min`, `max`, `step`, `precision`, `formatter`, `parser`, `keyboard`, `prefix`, `suffix`, `status`, `variant`, `bordered`, `readOnly`, and event behavior.
- Existing ConfigProvider size, disabled, and variant fallback.

Out of scope:

- `stringMode` and arbitrary-precision string values.
- `changeOnBlur` commit timing.
- Locale-specific `decimalSeparator`.
- Rich Vue slots for prefix/suffix or individual controls.

## Behavior

- `controls={true}` keeps the existing `+` and `-` control buttons.
- `controls={false}` hides the control buttons.
- `controls={{ upIcon: 'up', downIcon: 'down' }}` renders custom control button text.
- `changeOnWheel={true}` steps up when wheel delta is negative and steps down when wheel delta is positive.
- Wheel stepping respects disabled and read-only state.
- `changeOnWheel={false}` keeps the current no-wheel behavior.
- `formatter` receives the existing value as its first argument and an info object as its second argument.
- The formatter info object contains `userTyping: false` and the unformatted input string.
- `className`, `rootClassName`, and `classNames.root` apply to the root element.
- `style` and `styles.root` apply to the root element.
- `classNames.input`, `classNames.prefix`, `classNames.suffix`, `classNames.actions`, and `classNames.action` apply to their semantic parts.
- `styles.input`, `styles.prefix`, `styles.suffix`, `styles.actions`, and `styles.action` apply to their semantic parts.

## Testing

Add tests before implementation for:

- `controls.upIcon` and `controls.downIcon` rendering.
- `controls=false` hiding controls remains covered by the new object-form behavior.
- `changeOnWheel` stepping up and down.
- `changeOnWheel` not stepping when false.
- `formatter` receiving the info object.
- Root class/style hooks.
- Input, prefix, suffix, actions, and action semantic class/style hooks.

## Documentation

Update `docs/components/input-number.md` with:

- Custom controls example.
- Wheel stepping example.
- Semantic styling example.
- API rows for the new props, formatter signature, and semantic hooks.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on InputNumber controls, wheel stepping, formatter info, and semantic hooks; stringMode and decimalSeparator are explicitly excluded.
- Compatibility check: existing InputNumber tests and numeric event behavior must continue to pass.
