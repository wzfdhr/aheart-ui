# Ant Style Spin Description Design

## Context

`ASpin` currently supports `tip` as a string-only description. Ant Design Spin v6 documents `description` as the current custom description API, with `tip` kept as a deprecated alias. Ant also exposes a `description` semantic DOM part.

Official reference:

- https://ant.design/components/spin/

## Scope

This slice adds:

- `description` prop as renderable content.
- `description` slot.
- `tip` widened to renderable content for compatibility.
- `SpinRenderable` public type.
- `description` semantic class/style hooks while keeping existing `tip` hooks as aliases.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add `Spin.setDefaultIndicator`, function-valued `classNames` / `styles`, or rename the existing DOM class from `aheart-spin__tip`.

## Behavior

### Description Resolution

The rendered description resolves in this order:

1. `description` slot
2. `description` prop
3. `tip` prop

The description renders only when the spinner indicator is visible.

Falsy renderable values (`undefined`, `null`, `false`, empty string) do not render a description node.

### Compatibility

Existing `tip="Loading"` behavior remains unchanged visually.

`classNames.description` / `styles.description` target the description node. Existing `classNames.tip` / `styles.tip` still work and are merged for compatibility.

### Existing Behavior Kept

- `spinning`, `delay`, nested children, fullscreen, percent, size, indicator, and wrapper behavior remain unchanged.
- Existing semantic hooks for `root`, `section`, `indicator`, `dot`, `tip`, `percent`, and `container` remain supported.

## API

```ts
export type SpinRenderable = VNodeChild

export const spinProps = {
  description: [String, Number, Boolean, Object, Array, Function] as PropType<SpinRenderable>,
  tip: [String, Number, Boolean, Object, Array, Function] as PropType<SpinRenderable>
}

export type SpinSemanticPart =
  | 'root'
  | 'section'
  | 'indicator'
  | 'dot'
  | 'description'
  | 'tip'
  | 'percent'
  | 'container'
```

## Testing

Add Vitest coverage for:

- VNode `description` rendering.
- `description` slot overriding `description` and `tip` props.
- `tip` remaining a fallback alias.
- `classNames.description` / `styles.description` and legacy `tip` hooks applying to the same description node.

## Documentation

Update `docs/components/spin.md` to:

- Prefer `description` in examples.
- Document `tip` as a compatibility alias.
- Document `description` prop and slot.
- Add `description` to Semantic DOM.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Spin description parity only.
- Ambiguity check: description resolution and tip compatibility are explicit.
