# Ant Style Empty Renderable Presets Design

## Context

The project is iteratively aligning Aheart UI components with the official Ant Design component APIs. The next Empty slice is based on the official Ant Design Empty documentation at `https://ant.design/components/empty/`.

Current `AEmpty` already supports locale fallback, image URLs, hidden image and description states, `imageStyle`, root hooks, semantic `classNames` / `styles`, the `image` slot, the `description` slot, and the default footer slot. The previous Empty controls slice explicitly left two Ant API gaps out of scope:

- Static image presets such as `PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE`.
- Rich non-string `description` prop content.

This slice closes those gaps while preserving all current behavior.

## Recommended Approach

Extend the existing component in place:

- Widen `image` and `description` props to renderable Vue nodes while keeping `false` as the hide sentinel.
- Add `Empty.PRESENTED_IMAGE_DEFAULT` and `Empty.PRESENTED_IMAGE_SIMPLE` static properties on the installed component, plus matching named exports.
- Render the built-in presets with local CSS-only placeholders so the package does not gain image assets.

Alternatives considered:

- Require slots for rich content. This keeps Vue ergonomics simple but leaves the Ant prop API gap open.
- Use external SVG files for preset images. That adds asset handling and package surface area for a small visual difference.

## Component Behavior

### Renderable Props

- `description` accepts `VNodeChild | false`.
- `image` accepts `VNodeChild | string | false`.
- A string `image` still renders as an image URL, except for the exported preset constant values.
- The `image` slot continues to override `image`.
- The `description` slot continues to override `description`.
- `description={false}` still hides the description when there is no description slot.
- `image={false}` still hides the image when there is no image slot.
- When `description` is absent, Empty continues to fall back to `ConfigProvider.locale.empty.description`, then `No Data`.

### Preset Images

- `Empty.PRESENTED_IMAGE_DEFAULT` renders the existing default placeholder image.
- `Empty.PRESENTED_IMAGE_SIMPLE` renders a compact simple placeholder.
- The same values are exported as `PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE` from `./empty` and from the package root.

### Styling

- Existing `classNames.image`, `styles.image`, and `imageStyle` apply to preset images because they style the image wrapper.
- Add a small CSS rule for the simple preset's inner visual only.
- No semantic key changes are needed because Empty already matches Ant's semantic parts: `root`, `image`, `description`, and `footer`.

## Documentation

Update `docs/components/empty.md` with:

- A `<script setup>` example using `Empty.PRESENTED_IMAGE_SIMPLE`.
- A rich `description` prop example using `h`.
- Updated API rows for renderable `description`, renderable `image`, and the static preset constants.

## Testing

Use TDD:

- Add failing tests for renderable `description` and renderable `image` props.
- Add failing tests that the installed component exposes `PRESENTED_IMAGE_DEFAULT` and `PRESENTED_IMAGE_SIMPLE`.
- Add failing tests that the simple preset renders the simple placeholder while a URL string still renders `<img>`.
- Verify red before source implementation, then targeted green and package typecheck.

## Non-Goals

- Do not change Empty's locale fallback.
- Do not remove existing slots.
- Do not integrate Empty into Table, Select, or other data-display components in this slice.
- Do not add external image assets.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice is focused on Empty renderable props and static image presets.
- Compatibility check: existing URL image, boolean hide, slots, locale, and semantic styling behavior must continue to pass.
