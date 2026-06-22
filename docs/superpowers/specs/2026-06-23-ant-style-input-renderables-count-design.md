# Ant Style Input Renderables Count Design

## Context

`AInput` already covers basic Ant-style input behavior: variants, prefix/suffix strings, addons, `allowClear`, `showCount`, `count.strategy`, and semantic hooks for the root/control/prefix/suffix/clear/count parts. The remaining gap in this slice is that Ant Design treats most adornment and count UI values as renderable nodes, while the current implementation still narrows several of them to strings.

Official reference:

- https://ant.design/components/input/

## Scope

This slice adds:

- Renderable prop support for `prefix`, `suffix`, `addonBefore`, and `addonAfter`.
- `addonBefore` and `addonAfter` slots that override their renderable props.
- Renderable `allowClear.clearIcon`.
- `allowClear.disabled`.
- Renderable `showCount.formatter` output.
- Renderable `count.show` formatter output.
- `count.exceedFormatter` for clipping values when `count.max` is exceeded.
- Semantic hooks for `group`, `addonBefore`, and `addonAfter`.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add `Input.Search`, `Input.Password`, `Input.OTP`, TextArea changes, or function-valued semantic hook maps.

## Behavior

### Renderable Values

`prefix`, `suffix`, `addonBefore`, `addonAfter`, `allowClear.clearIcon`, `showCount.formatter`, and `count.show` accept Vue renderable values (`VNodeChild`). String behavior remains unchanged.

Slots take precedence over matching renderable props:

1. `prefix` slot over `prefix`.
2. `suffix` slot over `suffix`.
3. `clearIcon` slot over `allowClear.clearIcon`.
4. `addonBefore` slot over `addonBefore`.
5. `addonAfter` slot over `addonAfter`.

### Clear Button Disabled State

`allowClear: { disabled: true }` hides the clear button even when the input has a value. Component-level `disabled` still hides the clear button as it does today.

### Count Exceed Formatter

When `count.max` and `count.exceedFormatter` are provided, values whose measured length exceeds `count.max` are passed through:

```ts
count.exceedFormatter(value, { max })
```

The formatted value is used for:

- The displayed input value.
- `update:modelValue` and `input` emissions from user input.
- Count measurement and formatter info.

`count.strategy` remains the measurement source when present. Without `exceedFormatter`, existing max display behavior remains unchanged.

### Semantic DOM Hooks

The semantic map extends to:

```ts
type InputSemanticPart =
  | 'root'
  | 'group'
  | 'input'
  | 'prefix'
  | 'suffix'
  | 'clear'
  | 'count'
  | 'addonBefore'
  | 'addonAfter'
```

`group` applies to `.aheart-input-group`, while `addonBefore` and `addonAfter` apply to their addon spans.

## API

```ts
export type InputRenderable = VNodeChild

export interface InputAllowClearConfig {
  clearIcon?: InputRenderable
  disabled?: boolean
}

export interface InputShowCountConfig {
  formatter?: (info: InputCountFormatterInfo) => InputRenderable
}

export interface InputCountExceedFormatterInfo {
  max: number
}

export interface InputCountConfig {
  max?: number
  strategy?: (value: string) => number
  show?: boolean | ((info: InputCountFormatterInfo) => InputRenderable)
  exceedFormatter?: (value: string, config: InputCountExceedFormatterInfo) => string
}
```

## Testing

Add Vitest coverage for:

- Renderable prefix/suffix/addons/clear icon/count formatter values.
- Addon slots overriding renderable addon props.
- `allowClear.disabled` hiding the clear button.
- `count.exceedFormatter` clipping initial display and emitted input values.
- `group`, `addonBefore`, and `addonAfter` semantic class/style hooks.

## Documentation

Update `docs/components/input.md` to:

- Show renderable adornments and count formatter output.
- Document `allowClear.disabled`.
- Document `count.exceedFormatter`.
- Document addon slots.
- Extend the API and Semantic DOM sections.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on `AInput` only.
- Ambiguity check: TextArea and specialized Input variants remain explicit follow-up slices.
