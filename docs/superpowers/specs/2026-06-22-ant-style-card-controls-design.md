# Ant Style Card Controls Design

## Goal

Expand Card toward the Ant Design Card API surface with modern variant control, inner-card styling, actions props, and semantic styling hooks while preserving the existing title, extra, cover, actions slot, loading, hoverable, and ConfigProvider size behavior.

Reference: https://ant.design/components/card/

This slice follows the official Card API names for `variant`, `type`, `classNames`, and `styles`. It also keeps existing `bordered` behavior as a compatibility option.

## Scope

Implement:

- `variant` prop with `outlined` and `borderless`.
- `type="inner"` for inner-card visual treatment.
- `actions` prop for simple action item arrays.
- `className`, `rootClassName`, and `style` for root customization.
- `classNames` and `styles` for semantic parts: `root`, `header`, `title`, `extra`, `cover`, `body`, and `actions`.
- `headStyle` and `bodyStyle` compatibility props that map to header and body styles.

Keep:

- Existing `title` and `extra` string props.
- Existing `title`, `extra`, `cover`, and `actions` slots for rich Vue content.
- Existing `bordered`, `hoverable`, `loading`, and `size` behavior.
- Existing loading placeholder behavior.

Out of scope:

- `Card.Meta` and `Card.Grid` subcomponents.
- Tabbed cards.
- Rich non-slot ReactNode-style props.

## Behavior

- `variant="borderless"` renders the card as borderless.
- `variant="outlined"` renders the card with a border.
- If both `variant` and `bordered` are provided, `variant` determines the final border state.
- `type="inner"` adds an inner-card class for nested-card styling.
- `actions` prop renders action items when the `actions` slot is absent.
- The `actions` slot overrides the `actions` prop.
- `className`, `rootClassName`, and `classNames.root` apply to the root element.
- `style` and `styles.root` apply to the root element.
- `classNames.header`, `classNames.title`, `classNames.extra`, `classNames.cover`, `classNames.body`, and `classNames.actions` apply to their semantic parts.
- `styles.header`, `headStyle`, `styles.title`, `styles.extra`, `styles.cover`, `styles.body`, `bodyStyle`, and `styles.actions` apply to their semantic parts.

## Testing

Add tests before implementation for:

- Variant control and `type="inner"` classes.
- `variant` taking precedence over `bordered`.
- `actions` prop rendering and `actions` slot overriding it.
- Root customization hooks.
- Header, title, extra, cover, body, and actions semantic class/style hooks.
- `headStyle` and `bodyStyle` compatibility mapping.

## Documentation

Update `docs/components/card.md` with:

- Variant and inner-card example.
- Actions prop example.
- Semantic styling example.
- API rows for new props and slots behavior.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on Card shell controls and excludes Card.Meta, Card.Grid, and tabs.
- Compatibility check: existing Card tests and ConfigProvider size behavior must continue to pass.
