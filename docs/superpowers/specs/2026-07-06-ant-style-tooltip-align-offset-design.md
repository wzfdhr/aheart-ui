# Ant Style Tooltip Align Offset Design

## Context

Ant Design's shared Tooltip/Common API includes an `align` object for Tooltip, Popover, and Popconfirm. Aheart Tooltip currently supports placement, viewport auto-adjustment, popup container, semantic styles, and deprecated lifecycle aliases, but it does not accept `align`.

Reference: Ant Design shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Add a small, verifiable Tooltip `align.offset` compatibility slice without replacing the current floating implementation with a full `dom-align` engine.

## Behavior

- `align` is an object prop accepted by `ATooltip`.
- `align.offset` accepts a two-number tuple `[x, y]`.
- When present, the offset is exposed as popup CSS variables:
  - `--aheart-floating-align-x: <x>px`
  - `--aheart-floating-align-y: <y>px`
- Shared floating placement CSS uses those variables in its translate transforms so every placement can be shifted without changing default behavior.
- If `align` is omitted or `align.offset` is invalid, both offsets default to `0px` through CSS variable fallbacks.
- `align` must not leak as a DOM attribute.

## Non-Goals

- Do not implement full `dom-align` behavior.
- Do not implement `points`, `targetOffset`, or overflow options in this slice.
- Do not change placement auto-adjustment decisions.
- Do not change Popover or Popconfirm in this stage.

## Files

- `packages/components/src/tooltip/types.ts`: add `TooltipAlignConfig` and the `align` prop.
- `packages/components/src/tooltip/tooltip.vue`: derive offset CSS variables and merge them into popup style.
- `packages/components/src/utils/floating.css`: apply offset variables across placement transforms.
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`: add red-green coverage for offset variables and DOM attr handling.
- `docs/components/tooltip.md`: document this supported `align.offset` slice.
- Generated component outputs under `packages/components/es` and `packages/components/lib` are refreshed by the component build.

## Testing

- Focused Tooltip tests must first fail because `align.offset` does not produce offset variables.
- After implementation, focused Tooltip tests must pass.
- Full component tests, component typecheck, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Tooltip `align.offset`.
- Consistency check: tests, docs, source, CSS, and generated output all use the same `align.offset` behavior.
