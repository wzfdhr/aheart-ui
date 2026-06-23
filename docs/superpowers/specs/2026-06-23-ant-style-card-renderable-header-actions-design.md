# Ant Style Card Renderable Header Actions Design

## Context

`ACard` already supports Ant-style variants, size fallback, loading state, cover/header/body/action regions, tabs, Card.Meta, Card.Grid, semantic class/style hooks, and generated package outputs.

Ant Design Card models `title`, `extra`, and `actions` as renderable React nodes. The current Aheart Card still types `title` and `extra` as strings and `actions` as string or number items, and the template renders `title` and `extra` with text interpolation. Vue nodes passed to those props do not render as DOM.

Official reference:

- https://ant.design/components/card/

## Scope

This slice adds:

- `VNodeChild` support for `title`.
- `VNodeChild` support for `extra`.
- `VNodeChild[]` support for `actions`.
- Correct rendering of numeric `0` in header and extra regions.
- Slot override priority for `title`, `extra`, and `actions`.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not change Card tabs, Card.Meta, Card.Grid, loading skeletons, size resolution, variants, cover rendering, semantic class/style names, or tab panel behavior.

## Behavior

### Header Renderables

`title` and `extra` accept any Vue child node. The `title` and `extra` slots keep priority over the corresponding props.

`0` is treated as visible content. Empty values `undefined`, `null`, `false`, and `''` are treated as absent for prop-driven header sections unless the matching slot is present.

### Action Renderables

`actions` accepts `VNodeChild[]`. Each item renders inside the existing `.aheart-card__action` wrapper so existing layout and semantic hooks remain stable.

The `actions` slot continues to override the `actions` prop.

### Existing Behavior

The slice preserves:

- Card root, cover, header, body, and actions DOM structure.
- `headStyle`, `bodyStyle`, `classNames`, and `styles`.
- Tab list, active tab state, tab slots, tab children, and tab semantic hooks.
- Card.Meta and Card.Grid.

## Testing

Add Vitest coverage for:

- VNode `title`, `extra`, and `actions` props.
- Numeric `0` title and extra rendering.
- Slot override priority for title, extra, and actions.
- Empty string title/extra not creating a header by themselves.

The RED tests should fail before implementation because current prop validators and text interpolation do not render object VNodes in `title`, `extra`, or `actions`.

## Documentation

Update `docs/components/card.md` to:

- Add a renderable header/actions demo using `h`.
- Document `title`, `extra`, and `actions` as `VNodeChild`/`VNodeChild[]`.
- Mention slot priority and empty header value behavior.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Card header/action renderability only.
- Ambiguity check: numeric `0` renders; empty string remains absent.
