# Ant Style Descriptions Semantic API Design

## Context

`ADescriptions` already renders title, extra content, bordered and vertical layouts, column spans, and ConfigProvider-driven size. Ant Design Descriptions 6 exposes root-level compatibility hooks, item-level style hooks, `colon`, `span="filled"`, and semantic `classNames` / `styles` APIs.

Official reference:

- https://ant.design/components/descriptions/

## Scope

This slice adds:

- `ADescriptions` root hooks: `className`, `rootClassName`, and `style`.
- `ADescriptions` semantic hooks: `classNames` and `styles`.
- Root-level `colon`, `labelStyle`, and `contentStyle` compatibility props.
- `DescriptionItem` `key`, `children`, `className`, `style`, `labelStyle`, `contentStyle`, and `span="filled"`.
- Documentation and generated `es` / `lib` outputs.

This slice preserves the existing `title`, `extra`, `items`, `bordered`, `column`, `layout`, and `size` behavior. It does not implement responsive breakpoint column objects.

## Behavior

### Value Resolution

Descriptions content resolves as:

1. `item.content`
2. `item.children`
3. Empty string

Item span resolves as:

1. `span="filled"` fills the remaining columns in the current row.
2. A numeric `span` clamps between `1` and `column`.
3. Missing span resolves to `1`.

When `span="filled"` begins an empty row, it spans the full row.

### Semantic DOM

`ADescriptions` exposes these semantic parts:

- `root`: the root section element.
- `header`: title / extra wrapper, rendered only when needed.
- `title`: title text.
- `extra`: extra text.
- `table`: description table wrapper.
- `row`: each rendered row.
- `item`: each description item wrapper.
- `label`: each item label.
- `content`: each item content.

Ant's official semantic keys are covered by `root`, `header`, `title`, `extra`, `label`, and `content`. `table`, `row`, and `item` are additional Aheart hooks for the current CSS-grid DOM.

`className`, `rootClassName`, and `classNames.root` apply to the root element. `style` and `styles.root` merge with the existing column CSS variable. Deprecated Ant-compatible `labelStyle` and `contentStyle` apply to every item label and content, then item-level styles apply last.

### Colon

Labels render with a colon by default. `colon={false}` removes the colon marker while preserving spacing and existing layout behavior.

## Testing

Use Vitest and Vue Test Utils:

- Verify root, header, title, extra, table, row, item, label, and content semantic classes and styles.
- Verify root `className`, `rootClassName`, `style`, and existing column CSS variable merge.
- Verify root-level and item-level `labelStyle` / `contentStyle` merge in the expected order.
- Verify `span="filled"` fills the remaining row and `children` can be used as item content.
- Verify `colon={false}` removes the colon class while the default keeps it.
- Run targeted Descriptions tests, package typecheck, docs build, package build, then full verification.

## Documentation

Update `docs/components/descriptions.md`:

- Add a semantic styling example.
- Expand the API table with root, semantic, colon, and compatibility style props.
- Expand the `DescriptionItem` table.
- Add a Semantic DOM table.
