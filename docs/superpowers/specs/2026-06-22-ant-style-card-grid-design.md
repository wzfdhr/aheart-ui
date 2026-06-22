# Ant Style Card Grid Design

## Context

`ACard` already supports Ant-style shell controls and `ACardMeta` / `Card.Meta` composition. Ant Design Card also exposes `Card.Grid`, a small subcomponent used inside cards to build tiled option panels.

Official reference:

- https://ant.design/components/card/

## Scope

This slice adds:

- `ACardGrid` as an installable component.
- `CardGrid` and `ACardGrid` named exports from the Card package.
- `Card.Grid` static property for Ant-style composition.
- `hoverable` prop with Ant-compatible default `true`.
- Root hooks: `className`, `rootClassName`, and `style`.
- Semantic hooks: `classNames` and `styles`.
- Semantic parts: `root` and `content`.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add tabbed cards, card-level grid layout management, selectable grids, or rich render props. Consumers continue to place grids in the card body through normal slot composition.

## Behavior

`ACardGrid` renders a single tile wrapper. Its default slot is rendered inside a content element so semantic content hooks can target tile content independently from the root tile.

`hoverable` defaults to `true`, adding a hover shadow class. `hoverable={false}` removes the hover class while preserving border, sizing, and content layout.

`className`, `rootClassName`, and `classNames.root` apply to the root tile. `style` and `styles.root` merge on the root tile. `classNames.content` and `styles.content` apply to the inner content wrapper.

## API

`CardGrid` props:

- `hoverable?: boolean`
- `className?: string`
- `rootClassName?: string`
- `style?: StyleValue`
- `classNames?: Partial<Record<'root' | 'content', string>>`
- `styles?: Partial<Record<'root' | 'content', StyleValue>>`

## Testing

Use Vitest and Vue Test Utils:

- Verify `CardGrid` renders slot content and defaults to hoverable.
- Verify `hoverable={false}` removes the hover class.
- Verify root and content semantic classes and styles.
- Verify `Card.Grid` and named exports are available.
- Verify root plugin installation registers `ACardGrid`.

## Documentation

Update `docs/components/card.md`:

- Add a Card Grid example.
- Add a CardGrid API table.
- Add CardGrid Slots and Semantic DOM tables.
- Mention both `<ACardGrid>` and `Card.Grid` / `ACard.Grid` composition.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: one Card subcomponent; no tabbed Card or selection system.
- Type consistency: `CardGrid`, `ACardGrid`, `CardGridProps`, `CardGridSemanticPart`, `CardGridClassNames`, and `CardGridStyles` names are consistent with existing `CardMeta` naming.
