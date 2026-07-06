# Ant Style Popconfirm Align Offset Design

## Context

Ant Design's shared Tooltip/Common API includes an `align` object for Tooltip, Popover, and Popconfirm. Aheart Tooltip and Popover now accept the focused `align.offset` slice, but Aheart Popconfirm does not.

Reference: Ant Design shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Add a small, verifiable Popconfirm `align.offset` compatibility slice using the shared floating offset CSS variables already used by Tooltip and Popover.

## Behavior

- `align` is an object prop accepted by `APopconfirm`.
- `align.offset` accepts a two-number tuple `[x, y]`.
- When present, the offset is exposed as popup CSS variables:
  - `--aheart-floating-align-x: <x>px`
  - `--aheart-floating-align-y: <y>px`
- Shared floating placement CSS applies those variables in placement transforms.
- If `align` is omitted or `align.offset` is invalid, both offsets default to `0px` through CSS variable fallbacks.
- `align` must not leak as a DOM attribute.

## Non-Goals

- Do not implement full `dom-align` behavior.
- Do not implement `points`, `targetOffset`, or overflow options in this slice.
- Do not change placement auto-adjustment decisions.
- Do not change Tooltip or Popover in this stage.

## Files

- `packages/components/src/popconfirm/types.ts`: add `PopconfirmAlignConfig` and the `align` prop.
- `packages/components/src/popconfirm/popconfirm.vue`: derive offset CSS variables and merge them into popup style.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add red-green coverage for offset variables and DOM attr handling.
- `docs/components/popconfirm.md`: document this supported `align.offset` slice.
- Generated component outputs under `packages/components/es` and `packages/components/lib` are refreshed by the component build.

## Testing

- Focused Popconfirm tests must first fail because `align.offset` does not produce offset variables.
- After implementation, focused Popconfirm tests must pass.
- Full component tests, component typecheck, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popconfirm `align.offset`.
- Consistency check: tests, docs, source, and generated output all use the same `align.offset` behavior.
