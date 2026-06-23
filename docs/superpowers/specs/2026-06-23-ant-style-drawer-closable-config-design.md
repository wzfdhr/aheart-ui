# Ant Style Drawer Closable Config Design

## Goal

Align Drawer close-button controls with Ant Design's current Drawer API by adding configurable close icon content, disabled close-button behavior, and start/end close-button placement while preserving the existing boolean `closable` API.

## References

- Ant Design Drawer: https://ant.design/components/drawer/

The official API guides this slice through `closable`, `closeIcon`, and the object form of `closable` with `closeIcon`, `disabled`, and `placement`. Aheart UI keeps Vue events and slots, so this design maps renderable values to Vue `VNodeChild` and keeps the existing `update:open` and `close` emissions.

## Scope

Implement:

- `closeIcon` prop for custom close-button content.
- `closable` object form with `closeIcon`, `disabled`, and `placement`.
- `DrawerClosePlacement`, `DrawerCloseIcon`, `DrawerClosableConfig`, and `DrawerClosable` exported types.
- Close-button rendering for string, number, VNode, component VNode, `false`, and `null` values.
- Disabled close-button state that blocks button-triggered close emissions.
- End-placement close button in the header.
- Docs and generated declaration output for Drawer.

Keep:

- Existing `closable: true` default and existing boolean behavior.
- Existing `closable: false` behavior that hides the close button.
- Existing mask and Escape close behavior.
- Existing title, extra, footer, semantic class, and semantic style hooks.

Out of scope:

- Focus trap management.
- Push distance for nested drawers.
- `afterClose` callback support.
- Renderable `title`, `extra`, or `footer` props.
- Static Drawer APIs.

## Behavior

- `closable: true` renders the default close button with `×`.
- `closable: false` hides the close button.
- `closeIcon` customizes the close-button content when `closable` is not `false`.
- `closeIcon: false` and `closeIcon: null` hide the close button.
- `closable.closeIcon` overrides the top-level `closeIcon` prop when it is defined.
- `closable.disabled: true` renders a disabled close button and button clicks do not emit `update:open` or `close`.
- `closable.placement` defaults to `start`.
- `closable.placement: 'start'` renders the close button before the title.
- `closable.placement: 'end'` renders the close button after title and extra content and applies an end-placement class.
- The Drawer header still renders when it only contains a visible close button.
- Mask clicks and Escape keep their existing behavior even if the close button is disabled.

## Type Design

```ts
export type DrawerClosePlacement = 'start' | 'end'
export type DrawerCloseIcon = VNodeChild

export interface DrawerClosableConfig {
  closeIcon?: DrawerCloseIcon
  disabled?: boolean
  placement?: DrawerClosePlacement
}

export type DrawerClosable = boolean | DrawerClosableConfig
```

`drawerProps.closable` becomes `boolean | DrawerClosableConfig`. `drawerProps.closeIcon` accepts `VNodeChild`.

## Testing

Add tests before implementation for:

- Top-level `closeIcon` rendering custom close-button content.
- Top-level `closeIcon: false` hiding the close button.
- Object-form `closable.closeIcon` overriding the top-level `closeIcon`.
- Object-form `closable.disabled` blocking button-triggered close events.
- Object-form `closable.placement: 'end'` applying the end-placement class and preserving custom close content.

Existing Drawer tests must continue to pass.

## Documentation

Update `docs/components/drawer.md` with:

- A closable-controls example.
- API rows for `closable` and `closeIcon`.
- A `DrawerClosableConfig` type section.

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice is limited to Drawer close-button configuration.
- Compatibility check: existing boolean `closable`, mask close, Escape close, slots, and semantic hooks remain supported.
