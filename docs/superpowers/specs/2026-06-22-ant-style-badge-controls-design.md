# Ant Style Badge Controls Design

## Goal

Expand Badge toward the Ant Design Badge API surface while keeping the current lightweight Vue implementation.

Reference: https://ant.design/components/badge/

This slice follows the official Badge API names for `showZero`, `size`, `offset`, `color`, `title`, `classNames`, and `styles`. It also keeps the existing `count`, `dot`, `status`, `text`, and `overflowCount` behavior.

## Scope

Implement:

- `showZero` so numeric `count={0}` is hidden by default and visible when requested.
- `size` for numeric badges, supporting `small` and the default medium size.
- `offset` for positioned count and dot indicators.
- `color` for custom indicator/status dot color.
- `title` on the count or dot indicator.
- `classNames` and `styles` for semantic parts: `root` and `indicator`.
- A `count` slot for custom count content.
- Better standalone count/dot layout when Badge has no wrapped child.

Keep:

- Existing overflow behavior: numbers over `overflowCount` render as `${overflowCount}+`.
- Existing status values: `success`, `processing`, `default`, `error`, and `warning`.
- Existing `text` rendering for status badges.
- Existing default slot for wrapped content.

Out of scope:

- `Badge.Ribbon`.
- Animated count transitions.
- Preset color token maps beyond accepting a CSS color string.
- Function-valued semantic class/style hooks.

## Behavior

- Numeric `0` does not render an indicator unless `showZero` is true.
- `dot` renders a dot instead of a count, but numeric `count={0}` still hides it unless `showZero` is true.
- The `count` slot overrides the formatted count text.
- `size="small"` uses compact count dimensions; unset, `default`, and `medium` use the normal dimensions.
- `offset={[x, y]}` shifts absolutely positioned count and dot indicators by `x` pixels horizontally and `y` pixels vertically.
- `color` sets the indicator background for count, dot, and status dot modes.
- `title` is applied to count and dot indicators so browser hover text works.
- `classNames.root` and `styles.root` apply to the Badge root.
- `classNames.indicator` and `styles.indicator` apply to the count, dot, or status dot indicator.
- Standalone count and dot badges render inline when there is no default slot content.

## Testing

Add tests before implementation for:

- Numeric zero hidden by default and visible with `showZero`.
- Small size and offset styling on count indicators.
- Custom color and title on dot indicators.
- Semantic class/style hooks on root and indicator.
- Custom `count` slot overriding formatted text.
- Status dot using custom indicator class/style.

## Documentation

Update `docs/components/badge.md` with:

- Zero and small-size examples.
- Offset, custom color, and semantic styling examples.
- API rows for the new props and `count` slot.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this is limited to Badge controls and explicitly excludes Ribbon.
- Compatibility check: existing count, dot, and status tests must continue to pass.
