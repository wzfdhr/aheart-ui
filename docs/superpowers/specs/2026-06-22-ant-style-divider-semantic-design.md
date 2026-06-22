# Ant Style Divider Semantic API Design

## Context

`ADivider` already supports horizontal and vertical layouts, title placement aliases, orientation margin, dashed / dotted / solid variants, size, and plain title styling. Ant Design Divider 6 adds semantic style hooks through `classNames` and `styles`, while keeping older compatibility props such as `type` and `orientationMargin`.

Official reference:

- https://ant.design/components/divider/

## Scope

This slice adds:

- `ADivider` root hooks: `className`, `rootClassName`, and `style`.
- `ADivider` semantic hooks: `classNames` and `styles`.
- Divider semantic parts: `root`, `line`, and `text`.
- Documentation that marks `type` and `orientationMargin` as compatibility props while preserving behavior.
- Tests and generated `es` / `lib` outputs.

This slice does not change the existing `vertical` shortcut, `type` compatibility alias, `orientationMargin`, `dashed`, `plain`, `variant`, or `size` behavior.

## Behavior

### Value Resolution

Divider direction continues to resolve as:

1. `vertical=true` resolves to vertical.
2. Otherwise `type` controls the direction.

Title placement continues to resolve as:

1. `titlePlacement`
2. `orientation`

Variant continues to resolve as:

1. `dashed=true` resolves to `dashed`.
2. Otherwise `variant`.

### Semantic DOM

`ADivider` exposes these semantic parts:

- `root`: the root separator element.
- `line`: the divider line element.
- `text`: the title text wrapper, rendered only for horizontal dividers with default slot content.

`className`, `rootClassName`, and `classNames.root` apply to the root element. `style` and `styles.root` merge with the existing orientation margin CSS variable. `classNames.line` / `styles.line` apply to the visible line element, and `classNames.text` / `styles.text` apply to the title text wrapper.

## Testing

Use Vitest and Vue Test Utils:

- Verify root `className`, `rootClassName`, `style`, `classNames.root`, and `styles.root`.
- Verify line semantic class and style.
- Verify text semantic class and style on titled horizontal dividers.
- Verify existing orientation margin CSS variable still merges with root style.
- Run targeted Divider tests, package typecheck, docs build, package build, then full verification.

## Documentation

Update `docs/components/divider.md`:

- Add a semantic styling example.
- Expand the API table with `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Add a Semantic DOM table.
- Clarify compatibility notes for `type` and `orientationMargin`.
