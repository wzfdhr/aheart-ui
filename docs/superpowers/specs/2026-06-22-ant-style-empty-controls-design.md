# Ant Style Empty Controls Design

## Goal

Expand Empty toward the Ant Design Empty API surface while preserving the existing locale fallback and slots.

Reference: https://ant.design/components/empty/

This slice follows the official Empty API names for `image`, `imageStyle`, `description`, `classNames`, and `styles`. It keeps the current default image slot and default action slot.

## Scope

Implement:

- `image` prop for a custom image URL.
- `image={false}` to hide the image area.
- `imageStyle` for the image area.
- `description={false}` to hide the description.
- `description` slot for custom description content.
- `className`, `rootClassName`, and `style` for root customization.
- `classNames` and `styles` for semantic parts: `root`, `image`, `description`, and `footer`.

Keep:

- Existing locale fallback from `ConfigProvider.locale.empty.description`.
- Existing `image` slot for custom image content.
- Existing default slot as the footer/action area.
- Existing default image when no custom image is provided.

Out of scope:

- Static constants such as `PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE`.
- Data-display components automatically consuming Empty.
- Rich non-string description prop content; Vue users can use the `description` slot.

## Behavior

- `image` string renders an `<img>` inside the image area.
- The `image` slot overrides the `image` prop.
- `image={false}` hides the image area when no image slot is provided.
- `imageStyle`, `styles.image`, and `classNames.image` apply to the image area.
- `description` string renders as text.
- `description={false}` hides the description.
- The `description` slot overrides the description prop and locale fallback.
- When `description` is absent and no slot is provided, Empty falls back to ConfigProvider locale and then `No Data`.
- `className`, `rootClassName`, and `classNames.root` apply to the root element.
- `style` and `styles.root` apply to the root element.
- `classNames.footer` and `styles.footer` apply to the default action slot wrapper.

## Testing

Add tests before implementation for:

- Custom image URL rendering.
- Hidden image area when `image` is false.
- Hidden description when `description` is false.
- Description slot overriding locale fallback.
- Root and semantic class/style hooks.
- `imageStyle` applied to the image area.

## Documentation

Update `docs/components/empty.md` with:

- Image URL example.
- No image/no description example.
- Description slot example.
- Semantic styling example.
- API rows for the new props and slots.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on Empty controls and excludes static image constants and cross-component integrations.
- Compatibility check: existing Empty tests and locale fallback behavior must continue to pass.
