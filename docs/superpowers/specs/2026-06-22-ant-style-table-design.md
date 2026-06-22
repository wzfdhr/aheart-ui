# Ant Style Table Design

## Goal

Add a first-pass Table component that covers the Ant Design table core: column configuration, data rendering, local sorting, row selection, expandable rows, pagination, loading, empty state, size, and bordered variants.

This slice moves the Data Display roadmap forward while keeping advanced enterprise table features out of scope until the foundation is stable.

## References

- Ant Design Table: https://ant.design/components/table/

The reference guides API names and documentation structure. Aheart UI keeps an independent Vue implementation and a smaller first-pass feature set.

## Scope

Implement:

- Table
- Column-driven rendering with `columns` and `dataSource`
- `rowKey` as a string key or function
- Local sorting through column `sorter`
- Row selection through `rowSelection`
- Expandable row content through `expandable`
- Built-in pagination through the existing Pagination component
- Loading and empty presentation
- ConfigProvider size and disabled fallback

Out of scope:

- Filter dropdowns
- Fixed columns and fixed headers
- Virtual scrolling
- Editable rows and cells
- Tree data indentation
- Grouped table heads
- Drag sorting
- Server-side data adapters

## Architecture

Directory:

- `packages/components/src/table/table.vue`
- `packages/components/src/table/types.ts`
- `packages/components/src/table/style.css`
- `packages/components/src/table/index.ts`
- `packages/components/src/table/__tests__/table.test.ts`

`ATable` is a typed Vue component that renders a semantic native table wrapped in a responsive scroll container. It uses the local `APagination` component for pagination controls, and it uses the existing ConfigProvider context for size and disabled state.

Props:

- `columns?: TableColumn[]`
- `dataSource?: TableRecord[]`
- `rowKey?: string | ((record: TableRecord) => string | number)`
- `bordered?: boolean`
- `loading?: boolean`
- `size?: AheartSize`
- `disabled?: boolean`
- `pagination?: false | TablePaginationConfig`
- `rowSelection?: TableRowSelection`
- `expandable?: TableExpandable`
- `showHeader?: boolean`
- `emptyText?: string`

Events:

- `change`
- `update:selectedRowKeys`
- `select`
- `expand`

Column shape:

- `title`
- `dataIndex`
- `key`
- `align`
- `width`
- `className`
- `sorter`
- `sortOrder`
- `ellipsis`

Row selection shape:

- `selectedRowKeys`
- `defaultSelectedRowKeys`
- `type`
- `disabled`

Expandable shape:

- `expandedRowKeys`
- `defaultExpandedRowKeys`
- `expandedRowRender`
- `rowExpandable`

## Behavior

- Rows use `rowKey`, falling back to `record.key`, then the row index.
- Clicking a sortable header cycles through `ascend`, `descend`, and no sort.
- Sort state affects displayed rows locally and emits `change` with pagination and sorter information.
- Selection supports checkbox and radio modes; disabled tables cannot change selection.
- Expanded rows render one full-width row after the source row.
- Pagination slices sorted data locally and emits `change` when the current page changes.
- Empty state appears when there is no paged data and the table is not loading.
- Loading state uses an Ant-like lightweight overlay and keeps the table structure visible.

## Documentation

Update Data Display status:

- Table -> Ready

Add VitePress page:

- `docs/components/table.md`

The page includes basic usage, sorting, row selection, expandable rows, pagination, loading/empty states, API tables, events, and theme token notes.

## Testing

Tests are written before implementation:

- Render columns and rows
- Render empty state
- Sort local data and emit change
- Select checkbox rows and emit selection events
- Support radio row selection
- Render expandable row content and emit expand events
- Paginate data through the existing Pagination component
- Respect ConfigProvider size and disabled fallback

Full verification:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this is focused on first-pass Table, not a full ProTable/data-grid system.
- Ambiguity check: sorting, pagination, selection, and expansion are all local UI behavior in this slice.
