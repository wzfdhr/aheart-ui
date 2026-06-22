# Ant Style Flex Controls Design

## Context

`AFlex` already provides a small one-dimensional layout helper with `vertical`, `wrap`, `justify`, `align`, and `gap`. Ant Design Flex also supports `orientation`, `flex`, and `component`, while common component props provide root class and style customization.

Official reference:

- https://ant.design/components/flex/

## Scope

This slice adds:

- `AFlex` root hooks: `className`, `rootClassName`, and `style`.
- Ant-style `orientation`, preserving the existing `vertical` shortcut.
- Ant-style `component` to choose the rendered root element.
- Ant-style `flex` CSS shorthand prop.
- Broader CSS-value compatibility for `wrap`, `justify`, `align`, and `gap`.
- Documentation and generated `es` / `lib` outputs.

This slice does not add `classNames` or `styles` semantic maps because the official Flex page does not expose a Semantic DOM table for Flex.

## Behavior

### Value Resolution

Direction resolves as:

1. `orientation`
2. `vertical=true` resolves to `vertical`
3. `horizontal`

Wrap resolves as:

1. `wrap=true` resolves to `wrap`
2. `wrap=false` or missing resolves to no explicit override
3. `wrap="reverse"` resolves to `wrap-reverse`
4. Other string values are passed through as CSS `flex-wrap`

Gap resolves as:

1. Number resolves to `Npx`
2. `small`, `middle`, `medium`, and `large` resolve to Aheart spacing tokens
3. Other strings pass through as CSS gap values

`justify` and `align` continue to support existing aliases such as `between`, `around`, and `evenly`, and also accept direct CSS values such as `space-between`, `flex-start`, and `normal`.

### DOM

`component` defaults to `div`. Root class and style hooks apply to the rendered component. Internal layout style is merged before user `style`, so user-provided style can intentionally override it.

## Testing

Use Vitest and Vue Test Utils:

- Verify root `className`, `rootClassName`, and `style` merge with gap / flex layout styles.
- Verify `component` changes the rendered root tag.
- Verify `orientation` wins over `vertical`.
- Verify `flex`, CSS-style `justify`, `align`, `wrap`, and custom string `gap` are applied.
- Verify existing alias classes continue to render for backward compatibility.
- Run targeted Flex tests, package typecheck, docs build, package build, then full verification.

## Documentation

Update `docs/components/flex.md`:

- Add custom element / flex shorthand example.
- Add root styling example.
- Expand the API table with `orientation`, `component`, `flex`, `className`, `rootClassName`, and `style`.
- Clarify `middle` remains supported locally while `medium` follows Ant naming.
