# Ant Style Textarea Renderable Count Design

## Context

`ATextarea` already supports rows, variants, ConfigProvider disabled fallback, `allowClear`, `autoSize`, `showCount`, `count.strategy`, `count.show`, and semantic hooks for `root`, `textarea`, `clear`, and `count`. After the Input renderable/count slice, Textarea should keep parity with Ant Design's `Input.TextArea` count and clear configuration instead of remaining string-only.

Official reference:

- https://ant.design/components/input/

## Scope

This slice adds:

- `TextareaRenderable = VNodeChild`.
- Renderable `allowClear.clearIcon`.
- `allowClear.disabled`.
- Renderable `showCount.formatter` output.
- Renderable `count.show` output.
- `count.exceedFormatter` for clipping values when `count.max` is exceeded.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add Input.Search, Input.Password, Input.OTP, TextArea resize measurement, or new Textarea semantic parts.

## Behavior

### Renderable Values

`allowClear.clearIcon`, `showCount.formatter`, and `count.show` accept Vue renderable values (`VNodeChild`). Existing string output remains unchanged.

The `clearIcon` slot continues to take precedence over `allowClear.clearIcon`.

### Clear Button Disabled State

`allowClear: { disabled: true }` hides the clear button even when the textarea has a value. Component-level `disabled` keeps the current behavior and also hides the clear button.

### Count Exceed Formatter

When `count.max` and `count.exceedFormatter` are provided, values whose measured length exceeds `count.max` are passed through:

```ts
count.exceedFormatter(value, { max })
```

The formatted value is used for:

- The displayed textarea value.
- `update:modelValue`, `input`, and `change` emissions from user input.
- Count measurement and formatter info.

`count.strategy` remains the measurement source when present. Without `exceedFormatter`, current max display behavior remains unchanged.

## API

```ts
export type TextareaRenderable = VNodeChild

export interface TextareaAllowClearConfig {
  clearIcon?: TextareaRenderable
  disabled?: boolean
}

export interface TextareaShowCountConfig {
  formatter?: (info: TextareaCountFormatterInfo) => TextareaRenderable
}

export interface TextareaCountExceedFormatterInfo {
  max: number
}

export interface TextareaCountConfig {
  max?: number
  strategy?: (value: string) => number
  show?: boolean | ((info: TextareaCountFormatterInfo) => TextareaRenderable)
  exceedFormatter?: (value: string, config: TextareaCountExceedFormatterInfo) => string
}
```

## Testing

Add Vitest coverage for:

- Renderable `allowClear.clearIcon` and `showCount.formatter` output.
- Renderable `count.show` output.
- `allowClear.disabled` hiding the clear button.
- `count.exceedFormatter` clipping initial display and emitted `input` / `change` values.
- Existing slot override, autoSize, semantic hooks, and count strategy behavior staying intact.

## Documentation

Update `docs/components/textarea.md` to:

- Show renderable clear icon and count formatter examples.
- Document `allowClear.disabled`.
- Document `count.exceedFormatter`.
- Document `showCount.formatter` and `count.show` as `VNodeChild` returns.
- Add a Semantic DOM section for existing Textarea parts.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on `ATextarea` only.
- Ambiguity check: resize measurement and specialized Input variants remain explicit follow-up slices.
