# Ant Style Popover Semantic Functions Design

## Context

Aheart Popover currently supports semantic `classNames` and `styles` maps for `root`, `trigger`, `popup`, `container`, `title`, `content`, and `arrow`. Ant Design's shared Tooltip/Common API applies to Tooltip, Popover, and Popconfirm, and documents both `classNames` and `styles` as accepting either an object map or a function that returns a map.

Reference: Ant Design Popover documentation, `https://ant.design/components/popover/`, and the shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Allow `APopover` to accept function-form semantic hooks without changing existing object-form behavior.

## Behavior

- `classNames` accepts either `Partial<Record<PopoverSemanticPart, string>>` or `(info: PopoverSemanticInfo) => Partial<Record<PopoverSemanticPart, string>>`.
- `styles` accepts either `Partial<Record<PopoverSemanticPart, StyleValue>>` or `(info: PopoverSemanticInfo) => Partial<Record<PopoverSemanticPart, StyleValue>>`.
- `PopoverSemanticInfo` includes:
  - `open`: whether the popover popup is currently visible.
  - `placement`: the current effective placement. When `autoAdjustOverflow` changes placement, the semantic function receives the adjusted placement.
- The resolved semantic maps apply to the same nodes as today:
  - `root`
  - `trigger`
  - `popup`
  - `container`
  - `title`
  - `content`
  - `arrow`
- Existing object-form hooks, overlay aliases, title/content rendering, triggers, hover timers, Teleport, `getPopupContainer`, arrow behavior, color, z-index, and hidden lifecycle remain unchanged.

## Files

- `packages/components/src/popover/types.ts`: split semantic map aliases and add function-form public types.
- `packages/components/src/popover/popover.vue`: resolve function-form semantic maps once and use the resolved maps for all semantic nodes.
- `packages/components/src/popover/__tests__/popover.test.ts`: add red-green coverage for function-form hooks and effective placement info.
- `docs/components/popover.md`: document object-or-function forms and the `PopoverSemanticInfo` fields.
- Generated component outputs under `packages/components/es/popover` and `packages/components/lib/popover` are refreshed by the component build.

## Testing

- Focused Popover tests must first fail because function-form `classNames` and `styles` are not resolved.
- After implementation, focused tests must pass with:
  - function-form hooks receiving `open` and effective `placement`,
  - returned classes/styles applying to root, trigger, popup, container, title, content, and arrow,
  - object-form hooks still covered by existing tests,
  - overflow-adjusted placement still reflected in the popup class.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popover semantic hook function support.
- Consistency check: types, docs, tests, runtime behavior, and generated output use `PopoverSemanticInfo` consistently.
