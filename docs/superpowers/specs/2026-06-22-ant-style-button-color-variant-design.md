# Ant Style Button Color Variant Design

## Source

- Ant Design Button docs: https://ant.design/components/button/

## Goal

Bring `AButton` closer to the current Ant Design Button API by adding explicit `color` and `variant` props and supporting `loading.icon` in the object-form loading API.

## Current State

`AButton` already supports the established Ant-style props `type`, `htmlType`, `href`, `target`, `danger`, `ghost`, `shape`, `iconPlacement`, `iconPosition`, delayed loading, and semantic `classNames` / `styles`.

The remaining API gap in this slice is that Ant treats `type` as syntactic sugar over `color` and `variant`, where explicit `color` / `variant` take priority. Ant also supports `loading: { delay, icon }` so consumers can replace the loading indicator without using a slot.

## Scope

This slice adds:

- `color` with supported values `default`, `primary`, `danger`, `success`, `warning`, `info`, and Ant preset color names.
- `variant` with supported values `outlined`, `dashed`, `solid`, `filled`, `text`, and `link`.
- `loading.icon`, rendered when `loading` is an object with an `icon` value.
- CSS classes that expose resolved color and variant states.
- Docs and generated package outputs.

This slice does not add Ant wave configuration, ConfigProvider button-specific loading icons, gradient demos, or native arbitrary button attributes.

## Behavior

`type` remains backwards compatible and still drives existing visual classes.

Explicit props take priority:

1. If `color` is provided, use it.
2. Else if `danger` is true or `type` is `danger`, use `danger`.
3. Else map `type="primary"` to `primary`.
4. Else use `default`.

Variant resolution:

1. If `variant` is provided, use it.
2. Else map `type="primary" | "success" | "warning" | "danger"` to `solid`.
3. Else map `type="dashed"` to `dashed`.
4. Else map `type="link"` to `link`.
5. Else map `type="text"` to `text`.
6. Else use `outlined`.

The rendered root receives `aheart-button--color-${resolvedColor}` and `aheart-button--variant-${resolvedVariant}` classes. Existing `aheart-button--${type}` classes remain to avoid breaking users' CSS.

`loading.icon` accepts Vue `VNodeChild`. When present and the delayed loading state is active, it renders inside the existing loading wrapper instead of the default spinner or `loadingIcon` slot. The existing `loadingIcon` slot remains higher priority because slots are already the most explicit customization surface in this component.

## Styling

The base button defines internal CSS variables for resolved button color:

- `--aheart-button-color`
- `--aheart-button-color-hover`

Known semantic colors use existing global tokens. Preset Ant color names use stable fallback colors directly in component CSS so the API is useful even before a full token expansion exists.

Variant classes define broad behavior:

- `solid`: filled background with white text.
- `outlined`: border and text use the resolved color.
- `dashed`: same as outlined with dashed border.
- `filled`: soft background with resolved text color.
- `text`: transparent border and background.
- `link`: transparent border/background and link-colored text.

`ghost` continues to force transparent backgrounds while preserving color and border behavior.

## Tests

Add focused Button tests for:

- Explicit `color` and `variant` classes taking priority over `type`.
- `danger` resolving color when no explicit `color` exists.
- `type` mapping to variant classes.
- `loading.icon` object rendering after delay and slot priority over object icon.

Run the focused Button test in RED before implementation, then package typecheck after GREEN.

## Documentation

Update `docs/components/button.md` with:

- A Color & Variant example.
- A `loading.icon` example.
- API rows for `color`, `variant`, and the expanded `loading` shape.

## Self-Review

- No placeholder requirements remain.
- Scope is limited to Button and generated Button outputs.
- The priority rules are explicit and testable.
- The design preserves existing `type`, `danger`, `ghost`, and loading slot behavior.
