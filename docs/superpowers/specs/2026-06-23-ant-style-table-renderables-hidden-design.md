# Ant Style Table Renderables and Hidden Columns Design

## Context

`ATable` already supports columns, local sorting, filters, row selection, expansion, pagination, loading, empty text, ConfigProvider size/disabled fallback, and emitted change metadata.

Ant Design Table treats column titles and cell render results as renderable nodes, and supports hiding columns through `column.hidden`. The current Aheart implementation already types `customRender` and `expandedRowRender` as returning `VNodeChild`, but the template prints their results through mustache interpolation. That means VNodes are converted to plain text instead of rendered DOM.

Official reference:

- https://ant.design/components/table/

## Scope

This slice adds:

- `VNodeChild` support for `TableColumn.title`.
- Actual DOM rendering for `TableColumn.customRender`.
- Actual DOM rendering for `TableExpandable.expandedRowRender`.
- `hidden?: boolean` support on columns.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add nested column groups, fixed columns, sticky headers, virtual scrolling, drag sorting, column resize, or remote data loading.

## Behavior

### Renderable Columns and Cells

`TableColumn.title` becomes `VNodeChild`. Header title output, sorter button title output, custom cell render output, and expanded row output render through a local render-node helper.

Default cell content remains the value resolved by `dataIndex`, including nested path support.

### Hidden Columns

Columns with `hidden: true` are excluded from:

- Header rendering.
- Body cell rendering.
- Sorting/filtering UI and local sort/filter calculations.
- Column count used by empty and expanded rows.

Hidden columns keep their original objects untouched; `normalizedColumns` filters them into visible columns for rendering and behavior.

### Existing Behavior

The slice preserves:

- `rowKey`, row selection, and expansion behavior.
- Sorting, filtering, and change payload shape.
- Pagination behavior.
- `showHeader`, loading, empty text, size, disabled, and bordered states.

## Testing

Add Vitest coverage for:

- VNode column title rendering.
- VNode `customRender` cell rendering.
- VNode `expandedRowRender` rendering.
- Hidden columns being omitted from headers, body cells, and column count.

The RED tests should fail before implementation because VNodes are not rendered as DOM and `hidden` is not yet part of `TableColumn`.

## Documentation

Update `docs/components/table.md` to:

- Add a custom render demo.
- Document `TableColumn.title` as `VNodeChild`.
- Document `TableColumn.hidden`.
- Clarify `customRender` and `expandedRowRender` render returned nodes.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Table renderables and hidden columns only.
- Ambiguity check: hidden columns are excluded from local sort/filter behavior because they are removed from normalized visible columns.
