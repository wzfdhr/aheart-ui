# Ant Style Alert Controls Design

## Goal

Expand Alert toward the Ant Design Alert API surface while keeping the current lightweight Vue component model.

Reference: https://ant.design/components/alert/

This slice follows the official Alert API names for `action`, `banner`, `variant`, `title`, `icon`, `closeIcon`, `classNames`, `styles`, and `afterClose`. It keeps the existing `message`, `description`, `showIcon`, `closable`, `type`, and `close` event behavior where practical.

## Scope

Implement:

- `title` as the preferred title prop while keeping `message` as a compatibility alias.
- `banner` mode with Ant-style defaults: warning type and icon shown when no explicit `type` or `showIcon` is provided.
- `variant` with `outlined` and `filled` classes.
- `action` prop and `action` slot.
- `icon` prop and `icon` slot, effective when the resolved icon should render.
- `closeIcon` prop and `closeIcon` slot for custom close affordances.
- Internal closed state for closable alerts so clicking close unmounts the Alert.
- `afterClose` event emitted after the Alert is hidden.
- `role`, `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Semantic parts: `root`, `icon`, `content`, `title`, `description`, `action`, and `close`.

Keep:

- Existing `type` values: `success`, `info`, `warning`, and `error`.
- Existing `description` prop and default slot for description content.
- Existing `close(event)` event.
- Existing close button behavior when `closable` is true.

Out of scope:

- `Alert.ErrorBoundary`.
- Close animation timing.
- Global ConfigProvider icon overrides.
- Function-valued semantic class/style hooks.
- React-specific `closable` object API.

## Behavior

- `title` takes priority over `message`. If `title` is absent, `message` renders as before.
- `banner` uses `warning` when `type` is not provided.
- `banner` shows an icon by default unless `showIcon` is explicitly false.
- Non-banner alerts still hide the icon by default unless `showIcon` is true.
- `variant` defaults to `outlined` and adds a modifier class.
- `action` prop renders text in an action area. The `action` slot overrides the prop.
- `icon` prop or `icon` slot replaces the built-in status icon when the icon area is visible.
- `closeIcon` prop or `closeIcon` slot replaces the default close glyph.
- Clicking the close button emits `close(event)`, hides the Alert, and emits `afterClose()`.
- `role` defaults to `alert` and applies to the root element.
- `className`, `rootClassName`, and `classNames.root` apply to the root element.
- `style` and `styles.root` apply to the root element.
- `classNames` and `styles` apply to each semantic part listed in scope.

## Testing

Add tests before implementation for:

- `title` priority over `message`.
- `banner` default warning type and default icon.
- `variant`, `role`, root classes, and root styles.
- `action` prop and `action` slot rendering.
- Custom `icon` and `closeIcon` rendering.
- Closable hide behavior plus `close` and `afterClose` emits.
- Semantic class/style hooks for icon, title, description, action, and close.

## Documentation

Update `docs/components/alert.md` with:

- Banner and variant examples.
- Custom action example.
- Custom icon and close icon example.
- Semantic styling example.
- API rows for new props, events, and slots.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on Alert controls and excludes ErrorBoundary and animation systems.
- Compatibility check: current basic Alert tests should continue to pass.
