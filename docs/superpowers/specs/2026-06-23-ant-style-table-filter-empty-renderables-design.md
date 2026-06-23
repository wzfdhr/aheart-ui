# Ant Style Table Filter Empty Renderables Design

## Context

The Table component already renders column titles, custom cells, and expanded rows through `VNodeChild`. Two remaining display surfaces are still string-only:

- `TableColumnFilter.text`
- `emptyText`

Ant Design Table treats filter labels and empty-state locale content as renderable UI surfaces, so Aheart Table should accept Vue renderables for those two APIs too.

## Scope

This phase adds Vue renderable support for:

- Filter option labels via `filters[].text`.
- Empty-state content via `emptyText`.

This phase does not add custom filter dropdowns, async filtering, scroll, sticky headers, virtual list behavior, row class callbacks, or a new Empty component integration.

## Design

`TableRenderable` is already defined as `VNodeChild`, so the type surface can widen `TableColumnFilter.text` from `string` to `TableRenderable`. The `emptyText` prop should use the same renderable prop shape already used by other components for content-like props: primitive values plus objects and arrays.

The table template should render both surfaces with the existing local `ARenderNode` helper:

- Filter button body: `<ARenderNode :node="filter.text" />`
- Empty cell body: `<ARenderNode :node="resolvedEmptyText" />`

`resolvedEmptyText` should preserve explicit renderable values such as `0` while still falling back for `undefined`, `null`, `false`, and empty string.

## Testing

Add a focused Table unit test that mounts a table with no rows, a VNode filter label, and a VNode empty state. The test must assert that both nodes render with their provided classes and text.

Run the test before implementation to verify the missing behavior, then rerun after the implementation.

## Documentation

Update `docs/components/table.md` to:

- Demonstrate renderable filter labels and empty-state content.
- Change the API tables for `emptyText` and `TableColumnFilter.text` from `string` to `VNodeChild`.

## Acceptance Criteria

- `filters[].text` accepts and renders strings, numbers, and Vue VNodes.
- `emptyText` accepts and renders strings, numbers, and Vue VNodes.
- Existing filtering behavior is unchanged.
- Existing empty-state fallback to ConfigProvider locale still works when `emptyText` is not provided.
- Table docs describe the widened API.
