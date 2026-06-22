# Ant Style InputNumber Renderables Design

## Context

`AInputNumber` already covers numeric values, min/max clamping, step controls, precision, formatter/parser, variants, status, ConfigProvider size/disabled fallback, mouse-wheel stepping, control icon configuration, and semantic hooks. Ant Design InputNumber documents prefix/suffix content and control icons as renderable nodes. The current Aheart implementation still renders these values through string interpolation.

Official reference:

- https://ant.design/components/input-number/

## Scope

This slice adds:

- `InputNumberRenderable = VNodeChild`.
- Renderable `prefix` and `suffix` props.
- Renderable `controls.upIcon` and `controls.downIcon`.
- Slots that override matching renderable props:
  - `prefix`
  - `suffix`
  - `increaseIcon`
  - `decreaseIcon`
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add `stringMode`, `decimalSeparator`, `changeOnBlur`, `defaultValue`, focus methods, addon wrappers, or new semantic parts.

## Behavior

### Renderable Values

`prefix`, `suffix`, `controls.upIcon`, and `controls.downIcon` accept Vue renderable values (`VNodeChild`). Existing string values render exactly as before.

Slots take precedence over matching props:

1. `prefix` slot over `prefix`.
2. `suffix` slot over `suffix`.
3. `increaseIcon` slot over `controls.upIcon`.
4. `decreaseIcon` slot over `controls.downIcon`.

### Presence Checks

Prefix and suffix wrappers render when the matching slot exists or the prop is a meaningful renderable value. `undefined`, `null`, `false`, `true`, and empty strings do not create empty wrappers. Numeric `0`, VNodes, arrays, and non-empty strings render.

### Existing Behavior

The slice preserves:

- formatter/parser behavior.
- min/max clamping.
- precision handling.
- keyboard and wheel stepping.
- disabled/readOnly prevention for step controls.
- existing semantic hooks for `root`, `input`, `prefix`, `suffix`, `actions`, and `action`.

## API

```ts
export type InputNumberRenderable = VNodeChild

export interface InputNumberControlsConfig {
  upIcon?: InputNumberRenderable
  downIcon?: InputNumberRenderable
}
```

`prefix` and `suffix` props use `InputNumberRenderable`.

## Testing

Add Vitest coverage for:

- VNode `prefix`, `suffix`, `controls.upIcon`, and `controls.downIcon`.
- Slots overriding renderable prefix/suffix/control icon props.
- Existing string prefix/suffix/control icon behavior staying intact.
- Existing semantic hooks still applying to renderable wrappers and action buttons.

## Documentation

Update `docs/components/input-number.md` to:

- Show renderable prefix/suffix/control icon examples.
- Document renderable prop types.
- Add Slots and Semantic DOM sections.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on InputNumber renderable content only.
- Ambiguity check: value semantics such as `stringMode`, `decimalSeparator`, and `changeOnBlur` remain explicit follow-up slices.
