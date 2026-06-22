# Ant Style Display Navigation Design

## Goal

Add the next Data Display slice for Aheart UI: Card, Descriptions, and Pagination.

These components fill common product interface needs that sit between simple badges/tags and heavier data systems such as Table. The implementation follows Ant Design's component surface while staying small enough to test and document in one batch.

## References

- Ant Design Card: https://ant.design/components/card/
- Ant Design Descriptions: https://ant.design/components/descriptions/
- Ant Design Pagination: https://ant.design/components/pagination/

These references guide API shape and examples. Aheart UI keeps independent implementation, class names, and documentation wording.

## Scope

Implement:

- Card
- Descriptions
- Pagination

Out of scope:

- Table sorting/filtering/fixed columns
- Pagination page-size changer UI
- Card.Grid and Card.Meta subcomponents
- Editable descriptions
- Router integration

## Architecture

Each component follows the established directory pattern:

- `<component>.vue`
- `types.ts`
- `style.css`
- `index.ts`
- `__tests__/<component>.test.ts`

The package root imports, installs, and exports each component.

Card and Descriptions consume ConfigProvider size. Pagination consumes ConfigProvider size and disabled state. Local props override provider values.

## Component APIs

### Card

Props:

- `title?: string`
- `extra?: string`
- `bordered?: boolean`
- `hoverable?: boolean`
- `loading?: boolean`
- `size?: AheartSize`

Slots:

- `title`
- `extra`
- `cover`
- `actions`
- `default`

Card renders a semantic `section` with optional header, cover, body, loading state, and actions footer.

### Descriptions

Props:

- `title?: string`
- `extra?: string`
- `items?: DescriptionItem[]`
- `bordered?: boolean`
- `column?: number`
- `layout?: 'horizontal' | 'vertical'`
- `size?: AheartSize`

Description item fields:

- `label: string`
- `content: string`
- `span?: number`

Descriptions renders a `role="table"` wrapper with row and cell roles so tests can verify semantic structure without coupling to table markup.

### Pagination

Props:

- `total?: number`
- `current?: number`
- `defaultCurrent?: number`
- `pageSize?: number`
- `defaultPageSize?: number`
- `disabled?: boolean`
- `size?: AheartSize`
- `simple?: boolean`
- `hideOnSinglePage?: boolean`
- `showTotal?: boolean`

Events:

- `update:current`
- `update:pageSize`
- `change`

Pagination supports controlled and uncontrolled current page. It renders previous, page, and next buttons. `simple` mode renders a compact `current / totalPages` indicator.

## Styling

Use existing Aheart tokens:

- colors, borders, fill, background
- control heights and spacing
- radius and shadow
- motion and focus outlines

The visual style should remain compact and product-oriented.

## Documentation

Each component gets a VitePress page, Ready status, sidebar entry, API table, examples, events or slots where applicable, and token notes.

## Testing

Tests are written before implementation and must cover:

- render structure and core content
- prop variants
- slot override behavior where applicable
- ConfigProvider size/disabled inheritance where applicable
- events for Pagination page changes

Full verification remains:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this avoids Table and advanced Card subcomponents.
- Ambiguity check: Pagination page-size changer UI is out of scope for this slice.
