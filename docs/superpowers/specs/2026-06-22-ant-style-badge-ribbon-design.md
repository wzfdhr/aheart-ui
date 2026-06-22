# Ant Style Badge Ribbon Design

## Context

The project is iteratively aligning Aheart UI components with the current Ant Design component APIs. The next useful Badge slice is based on the official Ant Design Badge documentation at `https://ant.design/components/badge/` and the source documentation in `ant-design/components/badge/index.en-US.md`.

Current `ABadge` already supports counts, dots, status badges, `offset`, `overflowCount`, `showZero`, `size`, `color`, `title`, a `count` slot, and semantic `classNames` / `styles` for `root` and `indicator`. It does not yet expose root Common props directly, its `count` and `text` props are string/number-only, and it has no Ant-style `Badge.Ribbon` equivalent.

## Recommended Approach

Use the established Aheart pattern: keep `ABadge` small, add a sibling Vue component for the ribbon, export and globally install it as `ABadgeRibbon`, and attach it to the default Badge export as `Badge.Ribbon` for import-time parity. This avoids overloading `badge.vue` with two layouts while preserving Ant's compound-component mental model.

Alternatives considered:

- Add ribbon behavior inside `badge.vue` behind a mode prop. This would blur two separate DOM structures and make tests less focused.
- Skip Ribbon for now and only add root props. This would be lower risk but leaves a visible Ant Badge feature missing.

## Component Behavior

### ABadge

- Add `className`, `rootClassName`, and `style` to the root `<span>`.
- Preserve existing `classNames.root`, `styles.root`, `classNames.indicator`, and `styles.indicator`.
- Widen `count` to `VNodeChild`, while preserving numeric overflow behavior only for numeric counts.
- Widen `text` to `VNodeChild` for status labels.
- Render VNode-like prop content through a local render-node helper. Keep the existing `count` slot override.
- Keep current zero hiding, dot, offset, status, and color behavior unchanged.

### ABadgeRibbon

- Render a wrapper around the default slot and an absolutely positioned ribbon indicator.
- Props:
  - `text`: `VNodeChild`
  - `color`: `string`
  - `placement`: `'start' | 'end'`, default `end`
  - `className`, `rootClassName`, `style`
  - `classNames` / `styles` semantic hooks for `root`, `indicator`, and `content`
- Apply `color` to the ribbon background and corner color.
- Render `text` through a render-node helper.
- Register as `ABadgeRibbon`, export named aliases `BadgeRibbon` and `ABadgeRibbon`, and attach `Badge.Ribbon`.

## Documentation

Update `docs/components/badge.md` with:

- A root controls and renderable count/text example.
- A ribbon example around `ACard`.
- Updated API table for root props and broader `count` / `text` types.
- A `BadgeRibbon` API table and semantic DOM table.

## Testing

Use TDD:

- Add failing tests for `ABadge` root hooks plus VNode count/text rendering.
- Add failing tests for `ABadgeRibbon` rendering, placement, color, and semantic hooks.
- Add an export/install test for the named ribbon component and attached `Badge.Ribbon`.
- Run targeted Badge tests red, then implement minimal source changes, then run the targeted tests and package typecheck green.

## Non-Goals

- Do not implement animated scroll-number transitions.
- Do not add a full preset color token table for every Ant preset color; existing CSS color strings remain supported.
- Do not change Badge status layout or default visual density beyond what is needed for Ribbon.
