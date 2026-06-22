# Ant Style Textarea Count And Semantic Controls Design

## Goal

Expand Textarea toward the Ant Design TextArea API surface with configurable clear icons, count formatting/configuration, and semantic styling hooks while preserving the existing value, rows, autoSize, status, variant, size, disabled, and ConfigProvider behavior.

Reference: https://ant.design/components/input/

This slice follows the official TextArea API names for `allowClear`, `showCount`, `count`, `autoSize`, `classNames`, and `styles`.

## Scope

Implement:

- `allowClear` object form with `clearIcon`.
- `clearIcon` slot for custom clear button content.
- `showCount` object form with `formatter`.
- `count` config with `max`, `show`, and `strategy`.
- `className`, `rootClassName`, and `style` for Textarea wrapper customization.
- `classNames` and `styles` for semantic parts: `root`, `textarea`, `clear`, and `count`.

Keep:

- Existing `modelValue`, `id`, `placeholder`, `rows`, `size`, `disabled`, `readOnly`, `status`, `variant`, `bordered`, `maxlength`, `allowClear`, `showCount`, `autoSize`, and event behavior.
- Existing `autoSize` boolean and `{ minRows, maxRows }` support.
- Existing ConfigProvider size, disabled, and variant fallback.

Out of scope:

- Base Input, Search, Password, OTP, or grouped addon behavior.
- Runtime height measurement; the existing CSS variable row-bound strategy stays in place.
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
- `className`, `rootClassName`, and `classNames.root` apply to the Textarea wrapper.
- `style`, `styles.root`, and autoSize CSS variables merge onto the Textarea wrapper.
- `classNames.textarea`, `classNames.clear`, and `classNames.count` apply to their semantic parts.
- `styles.textarea`, `styles.clear`, and `styles.count` apply to their semantic parts.

## Testing

Add tests before implementation for:

- `allowClear.clearIcon` rendering.
- `clearIcon` slot overriding the clear icon prop.
- `showCount.formatter` rendering.
- `count.max`, `count.strategy`, and `count.show` behavior.
- `count.show=false` hiding the count.
- Root class/style hooks while preserving autoSize CSS variables.
- Textarea, clear, and count semantic class/style hooks.

## Documentation

Update `docs/components/textarea.md` with:

- Custom clear icon example.
- Count formatter/config example.
- Semantic styling example.
- API rows for the new props, slots, and semantic hooks.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on Textarea control hooks and excludes Base Input, Search, Password, OTP, grouped addon behavior, runtime height measurement, and truncation.
- Compatibility check: existing Textarea tests and event behavior must continue to pass.
