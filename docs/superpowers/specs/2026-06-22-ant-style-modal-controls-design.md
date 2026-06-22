# Ant Style Modal Controls Design

## Goal

Expand the existing Modal component toward Ant Design's common configuration surface by adding button prop passthrough, loading skeletons, semantic class/style hooks, root/dialog styling, z-index control, render lifecycle controls, and open-state lifecycle events.

This slice keeps the current Modal slot and event model while making the component more practical for product workflows.

## References

- Ant Design Modal: https://ant.design/components/modal/

The official API names guide this slice: `afterOpenChange`, `cancelButtonProps`, `okButtonProps`, `destroyOnHidden`, `forceRender`, `loading`, `zIndex`, `className`, `rootClassName`, `style`, `styles`, and `classNames`. Aheart UI keeps a Vue-first implementation and does not copy Ant Design source.

## Scope

Implement:

- `loading` skeleton state in the modal body
- `okButtonProps` and `cancelButtonProps`
- `zIndex` root stacking control
- `className` and `style` for the modal dialog
- `rootClassName` and `rootStyle` for the root wrapper
- `classNames` and `styles` for semantic parts
- `forceRender`
- `destroyOnHidden`
- `afterOpenChange(open)` event

Keep:

- Existing `open`, `title`, `width`, `centered`, `closable`, `mask`, `maskClosable`, `keyboard`, `confirmLoading`, `okText`, `cancelText`, `okType`, `footer`, and `destroyOnClose`
- Existing slots: `default`, `title`, and `footer`
- Existing close behavior from close button, mask, Cancel, and Escape

Out of scope:

- Portal `getContainer`
- Static methods such as `Modal.confirm`
- Async close coordination
- Focus trap management
- Function-valued footer renderers
- Close icon customization

## Behavior

- `loading` replaces body slot content with an active Skeleton.
- `okButtonProps` and `cancelButtonProps` are passed to the default footer buttons.
- `confirmLoading` still controls the OK button loading state and combines with `okButtonProps.loading`.
- `rootClassName`, `rootStyle`, and `zIndex` apply to the root overlay.
- `className` and `style` apply to the modal dialog together with `width`.
- `classNames` and `styles` apply to semantic parts: `root`, `mask`, `wrap`, `dialog`, `header`, `title`, `body`, `footer`, and `close`.
- `forceRender` pre-renders the modal root while closed.
- `destroyOnHidden` and the existing `destroyOnClose` unmount the modal after it closes unless `forceRender` is true.
- `afterOpenChange` emits when `open` changes.

## Testing

Add tests before implementation for:

- Loading skeleton body state
- OK and Cancel button prop passthrough
- Root/dialog/semantic class and style hooks
- `afterOpenChange`, `forceRender`, and `destroyOnHidden`

## Documentation

Update `docs/components/modal.md` with:

- Loading example
- Button props and semantic styling example
- API rows for the new props and event

## Self-Review

- Placeholder scan: no unresolved placeholders.
- Scope check: this slice focuses on Modal configuration, not static APIs, portals, or focus-trap systems.
- Compatibility check: existing Modal interaction tests must continue to pass.
