# Ant Style Tooltip Semantic Functions Design

## Context

Aheart Tooltip currently supports semantic `classNames` and `styles` maps for `root`, `trigger`, `popup`, `container`, `content`, and `arrow`. Ant Design's current Tooltip Common API documents both `classNames` and `styles` as accepting either an object map or a function that returns a map.

Reference: Ant Design Tooltip documentation, `https://ant.design/components/tooltip/`, and the shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Allow `ATooltip` to accept function-form semantic hooks without changing the existing object-form behavior.

## Behavior

- `classNames` accepts either `Partial<Record<TooltipSemanticPart, string>>` or `(info: TooltipSemanticInfo) => Partial<Record<TooltipSemanticPart, string>>`.
- `styles` accepts either `Partial<Record<TooltipSemanticPart, StyleValue>>` or `(info: TooltipSemanticInfo) => Partial<Record<TooltipSemanticPart, StyleValue>>`.
- `TooltipSemanticInfo` includes:
  - `open`: whether the tooltip popup is currently visible.
  - `placement`: the current effective placement. When `autoAdjustOverflow` changes placement, the semantic function receives the adjusted placement.
- The resolved semantic maps apply to the same nodes as today:
  - `root`
  - `trigger`
  - `popup`
  - `container`
  - `content`
  - `arrow`
- Existing object-form hooks, overlay aliases, title rendering, triggers, hover timers, Teleport, `getPopupContainer`, arrow behavior, color, z-index, and hidden lifecycle remain unchanged.

## Files

- `packages/components/src/tooltip/types.ts`: split semantic map aliases and add function-form public types.
- `packages/components/src/tooltip/tooltip.vue`: resolve function-form semantic maps once and use the resolved maps for all semantic nodes.
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`: add red-green coverage for function-form hooks and effective placement info.
- `docs/components/tooltip.md`: document object-or-function forms and the `TooltipSemanticInfo` fields.
- Generated component outputs under `packages/components/es/tooltip` and `packages/components/lib/tooltip` are refreshed by the component build.

## Testing

- Focused Tooltip tests must first fail because function-form `classNames` and `styles` are not resolved.
- After implementation, focused tests must pass with:
  - function-form hooks receiving `open` and effective `placement`,
  - returned classes/styles applying to root, trigger, popup, container, content, and arrow,
  - object-form hooks still covered by existing tests,
  - overflow-adjusted placement still reflected in the popup class.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Tooltip semantic hook function support.
- Consistency check: types, docs, tests, runtime behavior, and generated output use `TooltipSemanticInfo` consistently.
