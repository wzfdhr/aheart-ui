# Ant Style Pagination Controls And Semantic Hooks Design

## Context

The current Pagination component supports controlled and uncontrolled current page state, simple mode, disabled and size inheritance, total text, and hiding single-page pagination. Ant Design's Pagination API also exposes richer control configuration such as alignment, page-size changing, quick jumping, compact page ranges, custom total rendering, custom item rendering, and semantic class/style hooks.

This design adds the highest-value configuration surface while preserving the current lightweight native-button implementation.

## Goals

- Add Ant-style layout controls: `align` and `showLessItems`.
- Add page-size changing with `showSizeChanger`, `pageSizeOptions`, `update:pageSize`, and `showSizeChange`.
- Add quick jumping with `showQuickJumper`.
- Expand `showTotal` from a boolean to either `true` or a formatter function.
- Add `itemRender` for page, previous, and next item content.
- Add root compatibility hooks: `className`, `rootClassName`, and `style`.
- Add semantic `classNames` and `styles` hooks for `root`, `total`, `prev`, `next`, `page`, `activePage`, `sizeChanger`, and `quickJumper`.
- Keep existing current-page, simple, hide-on-single-page, disabled, and size behavior stable.

## Non-Goals

- Do not implement responsive page-count switching; it needs viewport observation and should be a separate slice.
- Do not implement mini-mode locale text, locale packages, or custom select components for the page-size changer.
- Do not implement a popup-based Pagination or custom dropdown; use native controls consistent with the current codebase.
- Do not implement advanced ellipsis jump controls as separate clickable jump-prev or jump-next buttons in this slice.

## API Design

`Pagination.align` accepts `'start' | 'center' | 'end'` and maps to root alignment classes.

`Pagination.showLessItems` limits the visible page range around the current page. The component will still always render first and last pages when there is more than one page, inserting a non-interactive ellipsis marker for skipped ranges.

`Pagination.showSizeChanger` shows a native select for page-size changes. If omitted, the component keeps the current behavior and does not infer automatic display from `total`.

`Pagination.pageSizeOptions` accepts `Array<number | string>` and defaults to `[10, 20, 50, 100]`. Values are parsed as positive integers before emission.

`Pagination.showQuickJumper` shows a native number input and a Go button. Enter or Go normalizes the target page to the valid range and emits the same current-change events as clicking a page.

`Pagination.showTotal` becomes `boolean | ((total: number, range: [number, number]) => string)`. Boolean `true` keeps the existing `Total n items` text.

`Pagination.itemRender` receives `(page, type, originalElement)` where `type` is `'page' | 'prev' | 'next'`. Because this component accepts string content rather than rich Vue nodes for custom render callbacks in current patterns, the return type is `string | number`.

`Pagination.className`, `Pagination.rootClassName`, and `Pagination.style` attach to the root `nav`.

`Pagination.classNames` and `Pagination.styles` accept semantic maps keyed by:

- `root`
- `total`
- `prev`
- `next`
- `page`
- `activePage`
- `sizeChanger`
- `quickJumper`

## Behavior

Changing page size emits `update:pageSize`, `showSizeChange(current, pageSize)`, and `change(current, pageSize)`. The current page is normalized against the new page count before emission.

Quick jumping is disabled when the component is disabled. Invalid or empty quick-jump values are ignored.

`showLessItems` uses a narrow sibling window. Default mode uses a wider window. Both modes avoid rendering duplicate first or last pages.

Disabled mode prevents page, size, and quick-jump changes.

## Testing

Add focused Pagination tests before implementation:

- page-size changer renders configured options and emits `update:pageSize`, `showSizeChange`, and `change`.
- quick jumper normalizes input and emits current updates.
- `showLessItems`, `align`, and functional `showTotal` render expected output.
- `itemRender` customizes previous, next, and page item text.
- root and semantic class/style hooks apply to expected elements.

Run the focused test first to verify RED, then implement and run Pagination tests plus package typecheck.

## Documentation

Update `docs/components/pagination.md` with examples for alignment, page-size changing, quick jumper, custom total rendering, custom item rendering, and semantic styling. Expand API and Events tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no cross-component dependencies beyond existing ConfigProvider.
- Ambiguity check: rich Vue node rendering and responsive behavior are explicitly out of scope for this slice.
- Type consistency: semantic part names and event names match the API design above.
