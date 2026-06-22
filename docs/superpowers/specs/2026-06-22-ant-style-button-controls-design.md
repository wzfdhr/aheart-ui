# Ant Style Button Controls Design

## Goal

Expand Button toward the Ant Design Button API surface with icon placement, delayed loading, and semantic styling hooks while keeping the existing visual type, size, shape, href, disabled, and ConfigProvider behavior.

Reference: https://ant.design/components/button/

This slice follows the official Button API names for `icon`, `iconPosition`, `loading.delay`, `classNames`, and `styles`. It also supports `iconPlacement` as the current Ant name and keeps `iconPosition` as a compatibility alias.

## Scope

Implement:

- `icon` prop for simple named icon content rendered through `AIcon`.
- `icon` slot for custom icon content.
- `iconPlacement` prop with `start` and `end`.
- `iconPosition` alias with `start` and `end`.
- `loading` object form with `delay`.
- `loadingIcon` slot for custom loading indicator content.
- `className`, `rootClassName`, and `style` for root customization.
- `classNames` and `styles` for semantic parts: `root`, `icon`, and `content`.

Keep:

- Existing `type`, `size`, `shape`, `round`, `danger`, `ghost`, `block`, `href`, `target`, `nativeType`, `htmlType`, and ConfigProvider behavior.
- Existing loading boolean behavior and click suppression while loading.
- Existing default slot as the button content.

Out of scope:

- `color` and `variant` token-driven Button API.
- Auto inserting spaces between two Chinese characters.
- Rich non-slot icon nodes through a prop.
- Wave effect integration.

## Behavior

- `icon` renders an `AIcon` before the content by default.
- The `icon` slot overrides the `icon` prop.
- `iconPlacement="end"` renders the icon after the content.
- `iconPosition` behaves as an alias for `iconPlacement`; `iconPlacement` wins when both are present.
- `loading={true}` immediately renders the loading indicator, disables interaction, and hides the normal icon.
- `loading={{ delay: n }}` renders the loading indicator only after `n` milliseconds and suppresses interaction once the delayed loading state is active.
- The `loadingIcon` slot replaces the default spinner content inside the loading indicator.
- `className`, `rootClassName`, and `classNames.root` apply to the root element.
- `style` and `styles.root` apply to the root element.
- `classNames.icon` and `styles.icon` apply to the normal icon wrapper.
- `classNames.content` and `styles.content` apply to the content wrapper.

## Testing

Add tests before implementation for:

- `icon` prop rendering before content.
- `icon` slot overriding the `icon` prop.
- `iconPlacement="end"` rendering after content.
- `iconPosition="end"` alias behavior.
- `loading={{ delay }}` deferring the loading indicator and disabled state.
- Custom `loadingIcon` slot rendering.
- Root and semantic class/style hooks.

## Documentation

Update `docs/components/button.md` with:

- Icon placement example.
- Delayed loading example.
- Semantic styling example.
- API rows for the new props and slots.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on icon, loading, and semantic hooks; color and variant stay in a future Button visual-token slice.
- Compatibility check: existing Button tests and ConfigProvider behavior must continue to pass.
