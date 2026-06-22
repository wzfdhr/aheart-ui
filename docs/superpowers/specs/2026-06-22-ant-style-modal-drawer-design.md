# Ant Style Modal Drawer Design

## Goal

Add first-pass Modal and Drawer components to move the Feedback roadmap forward.

Modal follows Ant Design's centered dialog model for focused decisions and task content. Drawer follows Ant Design's edge panel model for contextual workflows that should not navigate away from the current screen.

## References

- Ant Design Modal: https://ant.design/components/modal/
- Ant Design Drawer: https://ant.design/components/drawer/

The references guide API names and documentation structure. Aheart UI keeps an independent Vue implementation and a smaller first-pass feature set.

## Scope

Implement:

- Modal
- Controlled `open` state with `update:open`
- Modal title, default content, and configurable default footer
- Modal `ok`, `cancel`, and `close` events
- Modal `okText`, `cancelText`, `okType`, `confirmLoading`, `width`, and `centered`
- Mask rendering, mask close, close button, and Escape close behavior
- Drawer
- Drawer title, extra area, default content, and optional footer
- Drawer `placement`, `width`, and `height`
- Drawer `close` and `update:open` events
- Drawer mask rendering, mask close, close button, and Escape close behavior

Out of scope:

- Static Modal methods such as `confirm`, `info`, `success`, `error`, and `warning`
- Promise-based close guards
- Portal mounting to `document.body`
- Animated enter/leave transitions
- Nested Drawer push behavior
- Drawer resizable mode
- Loading skeleton inside Drawer
- Per-section custom styles and class names

## Architecture

### Modal

Directory:

- `packages/components/src/modal/modal.vue`
- `packages/components/src/modal/types.ts`
- `packages/components/src/modal/style.css`
- `packages/components/src/modal/index.ts`
- `packages/components/src/modal/__tests__/modal.test.ts`

`AModal` renders an inline overlay when `open` is true. Consumers control visibility with `v-model:open`; the component emits update events and semantic actions instead of owning external workflow state.

Props:

- `open?: boolean`
- `title?: string`
- `width?: number | string`
- `centered?: boolean`
- `closable?: boolean`
- `mask?: boolean`
- `maskClosable?: boolean`
- `keyboard?: boolean`
- `confirmLoading?: boolean`
- `okText?: string`
- `cancelText?: string`
- `okType?: ButtonType`
- `footer?: boolean`
- `destroyOnClose?: boolean`

Events:

- `update:open`
- `ok`
- `cancel`
- `close`

Slots:

- `default`
- `title`
- `footer`

### Drawer

Directory:

- `packages/components/src/drawer/drawer.vue`
- `packages/components/src/drawer/types.ts`
- `packages/components/src/drawer/style.css`
- `packages/components/src/drawer/index.ts`
- `packages/components/src/drawer/__tests__/drawer.test.ts`

`ADrawer` renders an inline overlay when `open` is true. Placement controls which edge the panel attaches to. Horizontal drawers use `width`; vertical drawers use `height`.

Props:

- `open?: boolean`
- `title?: string`
- `placement?: 'top' | 'right' | 'bottom' | 'left'`
- `width?: number | string`
- `height?: number | string`
- `closable?: boolean`
- `mask?: boolean`
- `maskClosable?: boolean`
- `keyboard?: boolean`
- `footer?: boolean`
- `destroyOnClose?: boolean`

Events:

- `update:open`
- `close`

Slots:

- `default`
- `title`
- `extra`
- `footer`

## Behavior

- Closed Modal and Drawer render no overlay nodes.
- Clicking a mask closes the component only when `maskClosable` is true.
- Clicking the close button emits `close` and `update:open(false)`.
- Pressing Escape closes the component only when `keyboard` is true.
- Modal OK emits `ok`; Cancel emits `cancel`, `close`, and `update:open(false)`.
- Modal default footer is shown when `footer` is true and can be replaced through the `footer` slot.
- Modal `confirmLoading` maps to the OK button loading state.
- Drawer `extra` slot renders in the header action area.
- Drawer footer renders only when `footer` is true or a `footer` slot is provided.
- Drawer placement class and size style are deterministic for testing and documentation.

## Documentation

Update Feedback status:

- Modal -> Ready
- Drawer -> Ready

Add VitePress pages:

- `docs/components/modal.md`
- `docs/components/drawer.md`

The pages include basic demos, footer/extra examples, placement examples, API tables, events, slots, and theme token notes.

## Testing

Tests are written before implementation:

- `AModal` renders title, body, default footer, centered state, and width.
- `AModal` emits OK, Cancel, close, and `update:open`.
- `AModal` closes from mask only when allowed.
- `AModal` closes from Escape only when allowed.
- `ADrawer` renders title, body, extra, placement, and size.
- `ADrawer` emits close and `update:open`.
- `ADrawer` closes from mask only when allowed.
- `ADrawer` closes from Escape only when allowed.
- Closed Modal and Drawer do not render overlay nodes.

Full verification:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this slice covers Modal and Drawer only, not the remaining Tooltip, Popover, and Popconfirm components.
- Ambiguity check: overlay mounting is inline in this pass, not a portal service.
