# Ant Style Typography Foundation Design

## Context

`ATypography`, `ATitle`, `AText`, `AParagraph`, and `ALink` currently cover the basic typography tags and a few visual modifiers. Ant Design Typography documents root customization via `className` / `style` plus semantic `classNames` / `styles`, text highlighting with `mark`, and object-style `ellipsis` configuration such as row counts.

Official reference:

- https://ant.design/components/typography/

## Scope

This slice adds:

- Shared root customization props for Typography primitives:
  - `className`
  - `rootClassName`
  - `style`
  - `classNames`
  - `styles`
- A `root` semantic part for Typography primitives.
- `mark` support for `ATitle`, `AText`, and `AParagraph`.
- `type` / `disabled` support for `ATitle` to match the existing Text and Paragraph tone states.
- Object-style Paragraph ellipsis with `rows`.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add `copyable`, `editable`, expandable ellipsis controls, suffix/onEllipsis callbacks, or interactive editing.

## Behavior

### Root Hooks

Each Typography primitive applies:

1. Built-in base class.
2. Built-in state classes.
3. `className`.
4. `rootClassName`.
5. `classNames.root`.

Root styles merge in this order:

1. Component-computed style.
2. `style`.
3. `styles.root`.

`classNames` and `styles` accept either an object or a function receiving `{ props }`, matching the pattern already used by `ASpace`.

### Mark

`AText mark` renders as a `mark` element when no higher-priority semantic text tag is selected. It also applies an `is-mark` class so `mark` can combine with `strong`, `italic`, `type`, or custom styles.

`ATitle mark` and `AParagraph mark` keep their native heading/paragraph tags and apply the same `is-mark` styling.

### Paragraph Ellipsis Rows

`AParagraph ellipsis` keeps the existing single-line behavior.

`AParagraph :ellipsis="{ rows: 2 }"` applies multiline ellipsis classes and the CSS variable `--aheart-typography-ellipsis-rows: 2`.

Invalid or missing `rows` values fall back to one row.

## API

```ts
export type TypographySemanticPart = 'root'
export type TypographyClassNames =
  | Partial<Record<TypographySemanticPart, string>>
  | ((info: TypographySemanticInfo) => Partial<Record<TypographySemanticPart, string>>)

export type TypographyStyles =
  | Partial<Record<TypographySemanticPart, StyleValue>>
  | ((info: TypographySemanticInfo) => Partial<Record<TypographySemanticPart, StyleValue>>)

export interface TypographyEllipsisConfig {
  rows?: number
}

export type TypographyEllipsis = boolean | TypographyEllipsisConfig
```

## Testing

Add Vitest coverage for:

- `ATypography` root class/style hooks.
- `ATitle` type, disabled, mark, and root hooks.
- `AText mark` rendering and root hooks.
- `AParagraph` object ellipsis row styling and root hooks.
- `ALink` root hooks while preserving disabled href behavior.

## Documentation

Update `docs/components/typography.md` to:

- Add semantic styling examples.
- Document `mark`.
- Document Paragraph `ellipsis` as `boolean | TypographyEllipsisConfig`.
- Document shared root hook props.
- Add a Semantic DOM section.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Typography foundation parity only.
- Ambiguity check: copyable/editable and interactive ellipsis are explicitly excluded.
