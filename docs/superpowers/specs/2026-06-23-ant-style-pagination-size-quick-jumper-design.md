# Ant Style Pagination Size Changer and Quick Jumper Design

## Context

`APagination` already supports controlled and uncontrolled `current` / `pageSize`, total text, simple mode, alignment, compact page windows, explicit page-size changer, quick jumper, item rendering, ConfigProvider size/disabled fallback, and semantic class/style hooks.

Ant Design Pagination documents two API details that are not yet represented in Aheart:

- `showSizeChanger` is enabled automatically when `total` is greater than a boundary value.
- `totalBoundaryShowSizeChanger` controls that boundary, defaulting to `50`.
- `showQuickJumper` can be an object with a custom `goButton` node.

Official reference:

- https://ant.design/components/pagination/

## Scope

This slice adds:

- Ant-style automatic page-size changer display when `total > totalBoundaryShowSizeChanger`.
- A new `totalBoundaryShowSizeChanger` prop.
- Explicit `showSizeChanger={false}` override behavior.
- Object-form `showQuickJumper` with custom `goButton` renderable content.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add Ant's full Select props passthrough for `showSizeChanger`, custom locale text, mini-mode variants beyond existing size support, responsive sizing, or interactive ellipsis buttons.

## Behavior

### Size Changer Boundary

`APagination` shows the size changer when:

- `showSizeChanger` is `true`, or
- `showSizeChanger` is omitted and `total > totalBoundaryShowSizeChanger`.

`showSizeChanger={false}` hides the size changer even when `total` is above the boundary.

`totalBoundaryShowSizeChanger` defaults to `50`. Values less than `0` are normalized to `0` so the boundary remains deterministic.

### Quick Jumper Go Button

`showQuickJumper` accepts either:

```ts
boolean | { goButton?: VNodeChild }
```

When `showQuickJumper` is `true`, the existing default `Go` button is preserved. When it is an object, the quick jumper renders a go button only when `goButton` is renderable; that button uses the provided content and triggers the same page jump as Enter.

### Existing Behavior

The slice preserves:

- Controlled and uncontrolled current page behavior.
- Controlled and uncontrolled page size behavior.
- `showSizeChange` / `change` emit payloads.
- `showTotal`, `itemRender`, `align`, `simple`, and `showLessItems`.
- ConfigProvider size and disabled fallback.
- Semantic hooks for root, total, prev, next, page, activePage, sizeChanger, and quickJumper.

## Testing

Add Vitest coverage for:

- Automatic size changer display when `total` is greater than the default boundary.
- Explicit `showSizeChanger={false}` overriding the automatic boundary behavior.
- Custom `totalBoundaryShowSizeChanger`.
- Object-form `showQuickJumper` rendering a custom `goButton` and jumping on click.

The RED tests should fail before implementation because the current component does not render a default size changer above total `50`, does not expose `totalBoundaryShowSizeChanger`, and only accepts boolean `showQuickJumper`.

## Documentation

Update `docs/components/pagination.md` to:

- Show automatic size changer behavior in the page-size demo.
- Add a quick jumper custom go button demo.
- Document `totalBoundaryShowSizeChanger`.
- Document `showQuickJumper` as `boolean | { goButton?: VNodeChild }`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Pagination boundary and quick jumper API parity only.
- Ambiguity check: explicit `false` override and object quick jumper behavior are defined.
