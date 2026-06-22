# Ant Style Grid Design

## Goal

Add first-pass Grid components to complete the current Layout roadmap.

This slice follows Ant Design's Row and Col model: a 24-column layout system with gutter, alignment, ordering, offsets, push/pull, flex columns, and responsive breakpoint props.

## References

- Ant Design Grid: https://ant.design/components/grid/

The reference guides API names and documentation structure. Aheart UI keeps an independent Vue implementation and a smaller first-pass feature set.

## Scope

Implement:

- Row
- Col
- 24-grid span classes
- Row gutter as number, tuple, or responsive object
- Row justify and align classes
- Row wrap control
- Col span, offset, order, push, pull, and flex
- Col responsive props: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- Package default export that installs both Row and Col

Out of scope:

- `useBreakpoint` composable
- Custom breakpoint token overrides
- Server-side layout measurement
- CSS grid auto-placement
- Layout designer utilities

## Architecture

Directory:

- `packages/components/src/grid/row.vue`
- `packages/components/src/grid/col.vue`
- `packages/components/src/grid/types.ts`
- `packages/components/src/grid/style.css`
- `packages/components/src/grid/index.ts`
- `packages/components/src/grid/__tests__/grid.test.ts`

`ARow` is a flex container that owns gutter CSS variables and alignment classes. `ACol` renders a flex item with span/offset/order/push/pull classes and responsive CSS variables.

Props:

`Row`:

- `gutter?: number | [GridGutter, GridGutter] | GridResponsiveGutter`
- `justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'`
- `align?: 'top' | 'middle' | 'bottom' | 'stretch'`
- `wrap?: boolean`

`Col`:

- `span?: number`
- `offset?: number`
- `order?: number`
- `pull?: number`
- `push?: number`
- `flex?: string | number`
- `xs?: ColSpanConfig`
- `sm?: ColSpanConfig`
- `md?: ColSpanConfig`
- `lg?: ColSpanConfig`
- `xl?: ColSpanConfig`
- `xxl?: ColSpanConfig`

Responsive `ColSpanConfig` accepts either a number or an object with `span`, `offset`, `order`, `pull`, `push`, and `flex`.

## Behavior

- Row sets `display: flex`, wraps by default, and applies negative margins for gutter spacing.
- Col consumes Row gutter variables through CSS and applies matching horizontal/vertical padding.
- Col span maps to 24-grid percentages.
- Offset/push/pull use 24-grid percentages.
- Responsive props map to breakpoint-specific CSS custom properties.
- Numeric `flex` becomes `flex: 0 0 <number>px`; string `flex` is passed through.

## Documentation

Update Layout status:

- Grid -> Ready

Add VitePress page:

- `docs/components/grid.md`

The page includes Row/Col basics, gutter, alignment, flex columns, responsive examples, API tables, and theme token notes.

## Testing

Tests are written before implementation:

- Row renders flex classes and default wrap.
- Row normalizes numeric and tuple gutters into CSS variables.
- Col renders span and offset/order/push/pull classes.
- Col renders numeric and string flex styles.
- Col emits responsive CSS variables/classes for breakpoints.
- Root Grid export installs Row and Col through plugin install.

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
- Scope check: this slice covers Grid Row/Col only, which is enough to finish the Layout category.
- Ambiguity check: responsive values are static CSS classes and variables in this pass.
