# Ant Style Drawer Style Aliases Design

## Context

Ant Design Drawer keeps several deprecated style props for migration compatibility and points users toward semantic `styles`. Aheart Drawer already supports semantic `styles`, but old Ant usage such as `bodyStyle`, `headerStyle`, `footerStyle`, `maskStyle`, `drawerStyle`, and `contentWrapperStyle` is ignored.

Official reference:

- https://ant.design/components/drawer/

## Scope

This phase adds compatibility-only style aliases to `ADrawer`:

- `bodyStyle`
- `headerStyle`
- `footerStyle`
- `maskStyle`
- `drawerStyle`
- `contentWrapperStyle`

The aliases map to existing Drawer elements without adding DOM:

- `bodyStyle` -> body
- `headerStyle` -> header
- `footerStyle` -> footer
- `maskStyle` -> mask
- `drawerStyle` -> panel section
- `contentWrapperStyle` -> panel section

This phase does not add a new `wrapper` semantic part, change semantic DOM names, or alter Modal behavior.

## Behavior

Deprecated aliases are applied before the current semantic `styles` prop for the same element. This keeps existing `styles` as the preferred API and lets users override alias values during migration.

Panel styles resolve in this order:

1. `style`
2. `drawerStyle`
3. `contentWrapperStyle`
4. `styles.section`
5. resolved width or height

Mask, header, body, and footer styles resolve as:

1. deprecated alias style
2. `styles.<part>`

If an element is not rendered, its alias has no visible effect.

## Architecture

`packages/components/src/drawer/types.ts` adds six `CSSProperties` props.

`packages/components/src/drawer/drawer.vue` adds small computed style helpers:

- `mergedMaskStyle`
- `mergedHeaderStyle`
- `mergedBodyStyle`
- `mergedFooterStyle`

The existing `panelStyle` computed adds `drawerStyle` and `contentWrapperStyle` before `semanticStyle('section')`. The existing root style behavior remains unchanged.

## Testing

Add Vitest coverage for:

- All deprecated style aliases applying to their mapped elements.
- `styles.*` overriding alias values for the same semantic part.
- Panel dimensions continuing to be resolved after alias styles.

## Documentation

Update `docs/components/drawer.md` to document the alias props as migration-compatible and recommend semantic `styles` for new code.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Drawer style alias compatibility only.
- Ambiguity check: mapping and style precedence are explicit.
