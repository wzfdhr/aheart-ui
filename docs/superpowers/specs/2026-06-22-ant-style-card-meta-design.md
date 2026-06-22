# Ant Style Card Meta Design

## Source

- Ant Design Card docs: https://ant.design/components/card/

## Goal

Add `Card.Meta` parity for `Aheart UI` Card so users can compose avatar, title, and description content in the same pattern as Ant Design.

## Current State

`ACard` already supports the Card shell APIs from the earlier controls slice: `title`, `extra`, `cover`, `actions`, `loading`, `hoverable`, `variant`, `type="inner"`, `className`, `rootClassName`, `style`, `headStyle`, `bodyStyle`, `classNames`, and `styles`.

The explicit gap in this slice is the official `Card.Meta` subcomponent. The previous Card controls design intentionally left `Card.Meta` out of scope.

## Scope

Implement:

- `ACardMeta` component.
- Named exports `CardMeta` and `ACardMeta`.
- `Card.Meta` property for Ant-style composition.
- Root export from `packages/components/src/index.ts`.
- Props:
  - `avatar?: VNodeChild`
  - `title?: VNodeChild`
  - `description?: VNodeChild`
  - `className?: string`
  - `rootClassName?: string`
  - `style?: StyleValue`
  - `classNames?: Partial<Record<'root' | 'section' | 'avatar' | 'title' | 'description', string>>`
  - `styles?: Partial<Record<'root' | 'section' | 'avatar' | 'title' | 'description', StyleValue>>`
- Slots:
  - `avatar`
  - `title`
  - `description`
  - `default` as a fallback body when no explicit title or description slot/prop is provided.

Out of scope:

- `Card.Grid`
- tabbed card APIs
- React-only prop behavior beyond renderable Vue props and slots

## Behavior

`ACardMeta` renders a root element with `aheart-card-meta`.

If `avatar` prop or `avatar` slot exists, render `.aheart-card-meta__avatar`.

The content area renders `.aheart-card-meta__section` when at least one of these exists:

- title prop
- title slot
- description prop
- description slot
- default slot

Title and description slots override their corresponding props.

If no explicit title or description content exists, the default slot renders inside the section. This keeps the component useful in Vue while preserving the Ant-style named prop API.

Semantic class/style hooks map as follows:

- `root`: `.aheart-card-meta`
- `section`: `.aheart-card-meta__section`
- `avatar`: `.aheart-card-meta__avatar`
- `title`: `.aheart-card-meta__title`
- `description`: `.aheart-card-meta__description`

`className`, `rootClassName`, and `classNames.root` all apply to the root. `style` and `styles.root` apply to the root.

## Architecture

Create `packages/components/src/card/meta.vue`. Keep the render-node helper local, following the existing Badge, Spin, Space, and Tag patterns for `VNodeChild` props.

Extend `packages/components/src/card/types.ts` with `CardMeta` types and props. Update `packages/components/src/card/index.ts` so the default export is `Card` with a `Meta` property and so `CardMeta` / `ACardMeta` are named exports. Update the package root export and installation list.

## Tests

Add focused Card tests that prove:

- `CardMeta` renders avatar, title, and description props.
- Slots override renderable props.
- Semantic hooks apply to root, section, avatar, title, and description.
- `Card.Meta` is attached to the default Card export.

Use TDD: write these tests first and verify they fail before creating `meta.vue`.

## Documentation

Update `docs/components/card.md` with:

- A Card.Meta example.
- API rows for `CardMeta`.
- Slots rows for `CardMeta`.
- Root export mention through normal examples.

## Self-Review

- No placeholders remain.
- Scope is limited to Card.Meta and its generated outputs.
- The design does not disturb existing Card shell behavior.
- Every behavior has an observable DOM or export test.
