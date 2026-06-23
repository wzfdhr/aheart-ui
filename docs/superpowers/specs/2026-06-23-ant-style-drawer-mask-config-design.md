# Ant Style Drawer Mask Config Design

## Goal

Align Drawer mask controls with Ant Design's current object-style mask API while preserving Aheart's existing `mask` boolean and `maskClosable` compatibility.

## References

- Ant Design Drawer: https://ant.design/components/drawer/

Ant Design currently documents `mask` as `boolean | { enabled?: boolean; blur?: boolean; closable?: boolean }`. Aheart Drawer already supports `mask: boolean` and `maskClosable: boolean`; this slice adds the object form and keeps the old prop as a fallback.

## Scope

Implement:

- `DrawerMaskConfig` exported type with `enabled`, `blur`, and `closable`.
- `DrawerMask = boolean | DrawerMaskConfig`.
- Object-form `mask` prop.
- Mask rendering controlled by `mask.enabled`.
- Mask-click close behavior controlled by `mask.closable`, falling back to `maskClosable` when undefined.
- Blur mask styling through an `is-blur` class.
- Docs and generated declaration/runtime output.

Keep:

- Existing `mask: true` default behavior.
- Existing `mask: false` behavior.
- Existing `maskClosable` behavior when `mask` is boolean or `mask.closable` is undefined.
- Existing semantic `classNames.mask` and `styles.mask` hooks.

Out of scope:

- Removing or deprecating `maskClosable`.
- Modal mask config.
- Focus trap or auto-focus behavior.
- Motion/animation behavior.

## Behavior

- `mask: true` renders the mask and uses `maskClosable` for click close.
- `mask: false` hides the mask.
- `mask: { enabled: false }` hides the mask.
- `mask: {}` and `mask: { enabled: true }` render the mask.
- `mask: { closable: false }` renders the mask but clicking it does not close the Drawer.
- `mask: { closable: true }` closes the Drawer on mask click even when `maskClosable` is false.
- `mask: { blur: true }` adds `is-blur` to the mask and applies a backdrop blur.
- Existing `styles.mask` still merges onto the mask.

## Type Design

```ts
export interface DrawerMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}

export type DrawerMask = boolean | DrawerMaskConfig
```

`drawerProps.mask` becomes `DrawerMask`.

## Testing

Add tests before implementation for:

- `mask: { enabled: false }` hiding the mask.
- `mask: { blur: true }` rendering an `is-blur` mask.
- `mask: { closable: false }` blocking mask-click close.
- `mask: { closable: true }` overriding `maskClosable: false`.

Existing Drawer tests must continue to pass.

## Documentation

Update `docs/components/drawer.md` with:

- A mask config example.
- API row for `mask` as `boolean | DrawerMaskConfig`.
- A `DrawerMaskConfig` type section.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice is limited to Drawer mask configuration.
- Compatibility check: boolean `mask` and old `maskClosable` remain supported.
