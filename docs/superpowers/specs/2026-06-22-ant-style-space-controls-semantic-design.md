# Ant Style Space Semantic API Design

## Context

`ASpace` already supports horizontal and vertical spacing, alignment, wrapping, tuple / numeric sizes, ConfigProvider-driven size, and separator aliases. Ant Design Space exposes semantic `classNames` and `styles` APIs for `root`, `item`, and `separator`, and keeps `split` as a deprecated compatibility alias in favor of `separator`.

Official reference:

- https://ant.design/components/space/

## Scope

This slice adds:

- `ASpace` root hooks: `className`, `rootClassName`, and `style`.
- `ASpace` semantic hooks: `classNames` and `styles`.
- Space semantic parts: `root`, `item`, and `separator`.
- Function or object form support for `classNames` and `styles`, matching Ant's Space API shape.
- Node-friendly `separator` and `split` rendering instead of string-only interpolation.
- Documentation and generated `es` / `lib` outputs.

This slice does not implement `Space.Compact` or `Space.Addon`. Those are separate structural APIs and should be handled in their own focused pass.

## Behavior

### Value Resolution

Space direction resolves as:

1. `orientation`
2. `vertical=true` resolves to `vertical`
3. `direction`

Separator resolves as:

1. `separator`
2. `split`

`split` remains supported for compatibility, but docs describe `separator` as the preferred prop.

### Semantic DOM

`ASpace` exposes these semantic parts:

- `root`: the root spacing container.
- `item`: each child wrapper.
- `separator`: each separator node between child wrappers.

`className`, `rootClassName`, and `classNames.root` apply to the root element. `style` and `styles.root` merge with existing gap CSS variables. `classNames.item` / `styles.item` apply to every item wrapper. `classNames.separator` / `styles.separator` apply to every separator wrapper.

`classNames` and `styles` may be an object or a function receiving `{ props }`; the function form is evaluated from the current props.

## Testing

Use Vitest and Vue Test Utils:

- Verify root `className`, `rootClassName`, `style`, `classNames.root`, `styles.root`, and gap CSS variables merge.
- Verify `classNames.item` / `styles.item` apply to every item.
- Verify `classNames.separator` / `styles.separator` apply to every separator.
- Verify function-form `classNames` and `styles` receive props and produce semantic classes / styles.
- Verify a VNode separator renders through `separator`, while `split` remains a fallback.
- Run targeted Space tests, package typecheck, docs build, package build, then full verification.

## Documentation

Update `docs/components/space.md`:

- Add a semantic styling example.
- Add a node separator example.
- Expand the API table with root and semantic props.
- Add a Semantic DOM table.
- Clarify that `split` is the compatibility alias and `separator` is preferred.
