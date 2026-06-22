# Ant Style Floating Feedback Design

## Goal

Add first-pass Tooltip, Popover, and Popconfirm components to complete the Feedback roadmap's remaining planned floating components.

Tooltip follows Ant Design's compact explanatory overlay model. Popover extends the same floating behavior with title and richer content. Popconfirm extends the same model with a confirmation panel and OK/Cancel actions.

## References

- Ant Design Tooltip: https://ant.design/components/tooltip/
- Ant Design Popover: https://ant.design/components/popover/
- Ant Design Popconfirm: https://ant.design/components/popconfirm/

The references guide API names and documentation structure. Aheart UI keeps an independent Vue implementation and a smaller first-pass feature set.

## Scope

Implement:

- Tooltip
- Tooltip controlled and uncontrolled open state
- Tooltip trigger modes: hover, focus, click, and contextmenu
- Tooltip placement classes
- Tooltip title, color, arrow, and z-index options
- Popover
- Popover title and content props
- Popover title and content slots
- Popover controlled and uncontrolled open state
- Popover trigger, placement, arrow, color, and z-index options
- Popconfirm
- Popconfirm title and description props
- Popconfirm title, description, and icon slots
- Popconfirm controlled and uncontrolled open state
- Popconfirm trigger, placement, arrow, okText, cancelText, okType, disabled, and showCancel options
- Popconfirm confirm and cancel events

Out of scope:

- Portal mounting to `document.body`
- Collision detection, automatic flipping, and viewport shifting
- Pointer-tracked overlays
- Async close guards for Popconfirm
- Tooltip fresh-cache semantics
- Popover nested complex focus trap
- Popconfirm custom button render props

## Architecture

### Shared Floating Utilities

Directory:

- `packages/components/src/utils/floating.ts`

The floating utilities define placement and trigger unions, validators, trigger normalization, popup style normalization, and placement class helpers. Each component owns its own markup while sharing the small cross-component vocabulary.

Supported placements:

- `top`
- `left`
- `right`
- `bottom`
- `topLeft`
- `topRight`
- `bottomLeft`
- `bottomRight`
- `leftTop`
- `leftBottom`
- `rightTop`
- `rightBottom`

Supported triggers:

- `hover`
- `focus`
- `click`
- `contextmenu`

### Tooltip

Directory:

- `packages/components/src/tooltip/tooltip.vue`
- `packages/components/src/tooltip/types.ts`
- `packages/components/src/tooltip/style.css`
- `packages/components/src/tooltip/index.ts`
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`

Props:

- `title?: string`
- `placement?: FloatingPlacement`
- `trigger?: FloatingTrigger | FloatingTrigger[]`
- `open?: boolean`
- `defaultOpen?: boolean`
- `color?: string`
- `arrow?: boolean`
- `zIndex?: number`
- `mouseEnterDelay?: number`
- `mouseLeaveDelay?: number`

Events:

- `update:open`
- `openChange`

Slots:

- `default`
- `title`

### Popover

Directory:

- `packages/components/src/popover/popover.vue`
- `packages/components/src/popover/types.ts`
- `packages/components/src/popover/style.css`
- `packages/components/src/popover/index.ts`
- `packages/components/src/popover/__tests__/popover.test.ts`

Props:

- `title?: string`
- `content?: string`
- `placement?: FloatingPlacement`
- `trigger?: FloatingTrigger | FloatingTrigger[]`
- `open?: boolean`
- `defaultOpen?: boolean`
- `color?: string`
- `arrow?: boolean`
- `zIndex?: number`

Events:

- `update:open`
- `openChange`

Slots:

- `default`
- `title`
- `content`

### Popconfirm

Directory:

- `packages/components/src/popconfirm/popconfirm.vue`
- `packages/components/src/popconfirm/types.ts`
- `packages/components/src/popconfirm/style.css`
- `packages/components/src/popconfirm/index.ts`
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

Props:

- `title?: string`
- `description?: string`
- `placement?: FloatingPlacement`
- `trigger?: FloatingTrigger | FloatingTrigger[]`
- `open?: boolean`
- `defaultOpen?: boolean`
- `okText?: string`
- `cancelText?: string`
- `okType?: ButtonType`
- `disabled?: boolean`
- `showCancel?: boolean`
- `arrow?: boolean`
- `zIndex?: number`

Events:

- `update:open`
- `openChange`
- `confirm`
- `cancel`

Slots:

- `default`
- `title`
- `description`
- `icon`

## Behavior

- Controlled components use `open` as source of truth and emit `update:open` plus `openChange`.
- Uncontrolled components initialize from `defaultOpen` and update internal state.
- Hover opens on mouseenter and closes on mouseleave, with optional delays for Tooltip.
- Focus opens on focusin and closes on focusout.
- Click toggles open state.
- Context menu opens on `contextmenu` and prevents the native context menu.
- Tooltip hides when no title prop or title slot is provided.
- Popover hides when no title/content prop or corresponding slot is provided.
- Popconfirm opens from its trigger unless `disabled` is true.
- Popconfirm OK emits `confirm`, then closes.
- Popconfirm Cancel emits `cancel`, then closes.
- Placement classes are deterministic for testing and documentation.

## Documentation

Update Feedback status:

- Tooltip -> Ready
- Popover -> Ready
- Popconfirm -> Ready

Add VitePress pages:

- `docs/components/tooltip.md`
- `docs/components/popover.md`
- `docs/components/popconfirm.md`

The pages include basic demos, trigger demos, placement examples, API tables, event tables, slot tables, and theme token notes.

## Testing

Tests are written before implementation:

- `ATooltip` renders overlay title when opened by hover.
- `ATooltip` applies placement, color, arrow, and z-index.
- `ATooltip` toggles from click trigger and emits open events.
- `ATooltip` respects controlled `open`.
- `APopover` renders title and content props when open.
- `APopover` renders title and content slots.
- `APopover` toggles from click trigger and emits open events.
- `APopconfirm` opens from click trigger with title, description, icon, and buttons.
- `APopconfirm` emits confirm and closes from OK.
- `APopconfirm` emits cancel and closes from Cancel.
- `APopconfirm` respects disabled and showCancel options.

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
- Scope check: this slice covers Tooltip, Popover, and Popconfirm only.
- Ambiguity check: floating overlays are inline positioned in this pass, not portal-mounted overlays.
