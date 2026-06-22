# Ant Style Drawer Controls Design

## Goal

Expand the existing Drawer component toward Ant Design's common configuration surface by adding preset/custom size, loading skeletons, semantic class/style hooks, root/panel styling, extra actions as a prop, z-index control, and open-state lifecycle events.

This slice keeps the existing Drawer interaction model and slots while making it much easier to configure in app-level workflows.

## References

- Ant Design Drawer: https://ant.design/components/drawer/

The official API names guide this slice: `afterOpenChange`, `className`, `rootClassName`, `classNames`, `styles`, `extra`, `forceRender`, `destroyOnHidden`, `loading`, `size`, `style`, `rootStyle`, and `zIndex`. Aheart UI keeps a local Vue implementation and uses Vue events/slots.

## Scope

Implement:

- `size` preset and custom value support
- `loading` skeleton state in the body
- `extra` prop for simple header actions, in addition to the existing `extra` slot
- `zIndex` root stacking control
- `className` and `style` for the drawer panel
- `rootClassName` and `rootStyle` for the root wrapper
- `classNames` and `styles` for semantic parts
- `forceRender`
- `destroyOnHidden`
- `afterOpenChange(open)` event

Keep:

- Existing `open`, `title`, `placement`, `width`, `height`, `closable`, `mask`, `maskClosable`, `keyboard`, `footer`, and `destroyOnClose`
- Existing slots: `default`, `title`, `extra`, and `footer`
- Existing close behavior from close button, mask, and Escape

Out of scope:

- Portal `getContainer`
- Resizable drawers
- Nested drawer push distance
- Focus trap management
- Close icon placement objects
- Function-valued semantic styling callbacks

## Behavior

- `size="default"` resolves to `378px`; `size="large"` resolves to `736px`; number and string sizes are used directly.
- For left/right drawers, size maps to width. For top/bottom drawers, size maps to height.
- Legacy `width` and `height` override `size` for compatibility.
- `loading` replaces body slot content with an active Skeleton.
- `extra` prop renders simple text/number header actions when the `extra` slot is absent.
- `rootClassName`, `rootStyle`, and `zIndex` apply to the root overlay.
- `className` and `style` apply to the drawer panel.
- `classNames` and `styles` apply to semantic parts: `root`, `mask`, `section`, `header`, `title`, `extra`, `body`, `footer`, and `close`.
- `forceRender` pre-renders the drawer root while closed.
- `destroyOnHidden` and the existing `destroyOnClose` unmount the drawer after it closes unless `forceRender` is true.
- `afterOpenChange` emits when `open` changes.

## Testing

Add tests before implementation for:

- `size` preset/custom sizing and legacy width/height override
- `loading` skeleton body state
- `extra` prop fallback
- root/panel/semantic class and style hooks
- `afterOpenChange`, `forceRender`, and `destroyOnHidden`

## Documentation

Update `docs/components/drawer.md` with:

- Loading example
- Preset size example
- Semantic styling example
- API rows for the new props and event

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on Drawer configuration, not portal, resize, nested drawer, or focus-trap systems.
- Compatibility check: existing Drawer interaction tests must continue to pass.
