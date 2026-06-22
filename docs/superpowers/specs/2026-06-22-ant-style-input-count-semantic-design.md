# Ant Style Input Count And Semantic Controls Design

## Goal

Expand the base Input toward the Ant Design Input API surface with configurable clear icons, count formatting, and semantic styling hooks while preserving the existing model value, prefix, suffix, addon, status, variant, size, disabled, and ConfigProvider behavior.

Reference: https://ant.design/components/input/

This slice follows the official Input API names for `allowClear`, `showCount`, `count`, `classNames`, and `styles`.

## Scope

Implement:

- `allowClear` object form with `clearIcon`.
- `clearIcon` slot for custom clear button content.
- `showCount` object form with `formatter`.
- `count` config with `max`, `show`, and `strategy`.
- `className`, `rootClassName`, and `style` for Input wrapper customization.
- `classNames` and `styles` for semantic parts: `root`, `input`, `prefix`, `suffix`, `clear`, and `count`.

Keep:

- Existing `modelValue`, `prefix`, `suffix`, `addonBefore`, `addonAfter`, `status`, `variant`, `bordered`, `allowClear`, `maxlength`, `showCount`, `type`, and event behavior.
- Existing prefix and suffix slots.
- Existing ConfigProvider size, disabled, and variant fallback.

Out of scope:

- `Input.TextArea`, `Input.Search`, `Input.Password`, and OTP behavior.
- `addonBefore` and `addonAfter` rich slots.
- Character truncation or exceed formatting; count displays information only.

## Behavior

- `allowClear={true}` keeps the existing clear button.
- `allowClear={{ clearIcon: 'clear' }}` renders `clear` inside the clear button.
- The `clearIcon` slot overrides `allowClear.clearIcon`.
- `showCount={true}` keeps the existing count text.
- `showCount={{ formatter }}` renders the formatter result.
- `count.max` supplies the denominator when `maxlength` is absent.
- `count.strategy(value)` supplies the count length.
- `count.show=false` hides the count even when `showCount` is truthy.
- `count.show` as a formatter function renders custom count text.
- `className`, `rootClassName`, and `classNames.root` apply to the Input wrapper.
- `style` and `styles.root` apply to the Input wrapper.
- `classNames.input`, `classNames.prefix`, `classNames.suffix`, `classNames.clear`, and `classNames.count` apply to their semantic parts.
- `styles.input`, `styles.prefix`, `styles.suffix`, `styles.clear`, and `styles.count` apply to their semantic parts.

## Testing

Add tests before implementation for:

- `allowClear.clearIcon` rendering.
- `clearIcon` slot overriding the clear icon prop.
- `showCount.formatter` rendering.
- `count.max`, `count.strategy`, and `count.show` behavior.
- Root class/style hooks.
- Input, prefix, suffix, clear, and count semantic class/style hooks.

## Documentation

Update `docs/components/input.md` with:

- Custom clear icon example.
- Count formatter/config example.
- Semantic styling example.
- API rows for the new props, slots, and semantic hooks.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on base Input control hooks and excludes TextArea, Search, Password, OTP, and addon rich slots.
- Compatibility check: existing Input tests and event behavior must continue to pass.
