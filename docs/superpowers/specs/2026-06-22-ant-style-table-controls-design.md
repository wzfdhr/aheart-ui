# Ant Style Table Controls Design

## Goal

Expand the existing Table component toward Ant Design's common control surface by adding default and controlled sorting, column filters, richer `change` payloads, and more predictable pagination state.

This slice builds on the first-pass Table foundation instead of replacing it.

## References

- Ant Design Table: https://ant.design/components/table/

The official API uses `columns`, `dataSource`, `pagination`, column `filters`, column `sorter`, `sortOrder`, `defaultSortOrder`, `filteredValue`, `defaultFilteredValue`, and `onChange(pagination, filters, sorter, extra)` as the reference model. Aheart UI keeps local, lightweight controls and Vue event naming.

## Scope

Implement:

- Column `defaultSortOrder`
- Column `filters`
- Column `filteredValue`
- Column `defaultFilteredValue`
- Column `filterMultiple`
- Local filter controls in the table header
- Local sorting for both function sorters and simple `sorter: true`
- `change` payload with pagination, filters, sorter, and extra current data
- Pagination state reset to page 1 when filters or sorting change

Keep:

- Existing row selection behavior
- Existing expandable row behavior
- Existing local pagination through `APagination`
- Existing ConfigProvider size and disabled fallbacks

Out of scope:

- Custom filter dropdown renderers
- Remote data loading adapters
- Multiple-column sort priority
- Tree filters
- Fixed headers and fixed columns
- Row selection column customization

## Behavior

- Sort state initializes from the first column with `sortOrder` or `defaultSortOrder`.
- A controlled `sortOrder` column always wins over internal sort state.
- Clicking a sortable header cycles through `ascend`, `descend`, and no sort.
- `sorter: true` uses the column value for basic string/number comparison.
- Filter state initializes from `filteredValue` or `defaultFilteredValue`.
- A controlled `filteredValue` column always wins over internal filter state.
- Filter buttons support multiple values by default; `filterMultiple: false` keeps only one active value.
- Filtering happens before sorting and pagination.
- Filter or sorter changes reset internal pagination to page 1.
- `change` emits `(pagination, filters, sorter, extra)` where `extra.currentDataSource` is the post-filter, post-sort data.

## Testing

Add tests before implementation for:

- `defaultSortOrder` sorting data on initial render
- Controlled `sortOrder` overriding internal sort state
- Header filters reducing rows and emitting filters plus extra data
- `filterMultiple: false` replacing the active filter value
- Pagination change emitting filters, sorter, and extra current data

## Documentation

Update `docs/components/table.md` with:

- A filtering demo
- Controlled/default sorting notes in the sorting demo
- Expanded API tables for filter fields and `change` extra

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice handles table controls, not ProTable or remote data orchestration.
- Compatibility check: existing row selection and expandable row tests must keep passing.
