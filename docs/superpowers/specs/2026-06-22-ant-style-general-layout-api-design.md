# Ant Style General Layout API Design

## Goal

Improve Ant Design API parity for the most commonly reused General and Layout primitives: Button, Space, and Divider.

These components are already Ready, but their configuration surface is still narrower than the Ant Design documentation. This slice adds high-traffic API compatibility while preserving the existing Aheart UI props used by current docs and tests.

## References

- Ant Design Button: https://ant.design/components/button/
- Ant Design Space: https://ant.design/components/space/
- Ant Design Divider: https://ant.design/components/divider/

The references guide prop names and documentation structure. Aheart UI keeps an independent Vue implementation and retains backward-compatible local aliases.

## Scope

Implement:

- Button `type="dashed"`, `type="link"`, and `type="text"`
- Button `danger`
- Button `ghost`
- Button `shape="default" | "circle" | "round"`
- Button `htmlType` as an Ant-style alias for the existing `nativeType`
- Button `href` and `target` anchor rendering
- Button click emission with disabled and loading suppression
- Space `orientation="horizontal" | "vertical"`
- Space `vertical` Boolean shortcut
- Space `separator` and `split` string separators between items
- Divider `titlePlacement="left" | "center" | "right" | "start" | "end"`
- Divider `orientationMargin`
- Divider `variant="solid" | "dashed" | "dotted"`
- Divider `size="small" | "middle" | "large"`
- Divider `vertical` Boolean shortcut

Keep:

- Existing Button custom types: `success`, `warning`, and `danger`
- Existing Button `round` Boolean as an alias for `shape="round"`
- Existing Button `nativeType`
- Existing Space `direction`
- Existing Space `size`, `align`, and `wrap`
- Existing Divider `type`
- Existing Divider `orientation` as the older text-placement prop
- Existing Divider `dashed` as an alias for `variant="dashed"`

Out of scope:

- Button icon prop rendering by VNode
- Button loading delay object
- Button automatic rel handling for target blank
- Space compact mode
- Space custom VNode separator prop
- Divider children as arbitrary structured title render prop

## Architecture

### Button

Files:

- `packages/components/src/button/types.ts`
- `packages/components/src/button/button.vue`
- `packages/components/src/button/style.css`
- `packages/components/src/button/__tests__/button.test.ts`
- `docs/components/button.md`

Button keeps the existing root component but renders either a native `button` or an anchor element depending on `href`. Disabled and loading state suppress clicks for both element modes.

New props:

- `danger?: boolean`
- `ghost?: boolean`
- `shape?: 'default' | 'circle' | 'round'`
- `htmlType?: 'button' | 'submit' | 'reset'`
- `href?: string`
- `target?: string`

Events:

- `click`

### Space

Files:

- `packages/components/src/space/types.ts`
- `packages/components/src/space/space.vue`
- `packages/components/src/space/style.css`
- `packages/components/src/space/__tests__/space.test.ts`
- `docs/components/space.md`

Space keeps child normalization and wraps each rendered child. It now inserts optional separator nodes between items. `orientation` takes precedence over existing `direction`; `vertical` is a shortcut for vertical layout.

New props:

- `orientation?: 'horizontal' | 'vertical'`
- `vertical?: boolean`
- `separator?: string`
- `split?: string`

### Divider

Files:

- `packages/components/src/divider/types.ts`
- `packages/components/src/divider/divider.vue`
- `packages/components/src/divider/style.css`
- `packages/components/src/divider/__tests__/divider.test.ts`
- `docs/components/divider.md`

Divider keeps `type` as the direction prop and adds Ant-style title-placement and style variants. `titlePlacement` takes precedence over the existing `orientation` prop. `vertical` is a shortcut for `type="vertical"`.

New props:

- `titlePlacement?: 'left' | 'center' | 'right' | 'start' | 'end'`
- `orientationMargin?: number | string`
- `variant?: 'solid' | 'dashed' | 'dotted'`
- `size?: 'small' | 'middle' | 'large'`
- `vertical?: boolean`

## Behavior

- Button anchor mode renders `<a>` only when `href` exists.
- Button disabled or loading state prevents click events and anchor navigation.
- Button `htmlType` wins over `nativeType` for native buttons.
- Button `danger` applies a danger visual state without requiring `type="danger"`.
- Button `shape="round"` and `round` apply the same rounded state.
- Button `shape="circle"` creates an icon-style square button with circular radius.
- Space `orientation` wins over `vertical` and `direction`.
- Space `vertical` wins over `direction` when `orientation` is absent.
- Space separators render between items only, not before the first or after the last.
- Divider `vertical` wins over `type`.
- Divider `titlePlacement` wins over existing `orientation`.
- Divider `variant` wins over existing `dashed`.
- Divider `orientationMargin` sets a CSS variable consumed by left/right title layouts.

## Documentation

Update:

- `docs/components/button.md`
- `docs/components/space.md`
- `docs/components/divider.md`

The pages add demos and API rows for the new Ant-style props while noting backward-compatible aliases where useful.

## Testing

Tests are written before implementation:

- Button renders dashed, link, text, danger, ghost, round, and circle states.
- Button renders anchors for `href` and suppresses disabled anchor clicks.
- Button uses `htmlType` over `nativeType`.
- Space renders separators between items.
- Space resolves `orientation` and `vertical`.
- Divider resolves `titlePlacement`, `variant`, `size`, `vertical`, and `orientationMargin`.

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
- Scope check: this slice covers Button, Space, and Divider configuration parity only.
- Ambiguity check: local aliases remain supported and Ant-style props take precedence when both are present.
