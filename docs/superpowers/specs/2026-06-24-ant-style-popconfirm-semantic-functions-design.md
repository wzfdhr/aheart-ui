# Ant Style Popconfirm Semantic Functions Design

## Context

Aheart Popconfirm currently supports semantic `classNames` and `styles` maps for `root`, `trigger`, `popup`, `container`, `arrow`, `message`, `icon`, `text`, `title`, `description`, `actions`, `cancelButton`, and `okButton`. Ant Design's shared Tooltip/Common API applies to Tooltip, Popover, and Popconfirm, and documents both `classNames` and `styles` as accepting either an object map or a function that returns a map.

Reference: Ant Design Popconfirm documentation, `https://ant.design/components/popconfirm/`, and the shared Tooltip/Common API source, `https://github.com/ant-design/ant-design/blob/master/components/tooltip/shared/sharedProps.en-US.md`.

## Goal

Allow `APopconfirm` to accept function-form semantic hooks without changing existing object-form behavior.

## Behavior

- `classNames` accepts either `Partial<Record<PopconfirmSemanticPart, string>>` or `(info: PopconfirmSemanticInfo) => Partial<Record<PopconfirmSemanticPart, string>>`.
- `styles` accepts either `Partial<Record<PopconfirmSemanticPart, StyleValue>>` or `(info: PopconfirmSemanticInfo) => Partial<Record<PopconfirmSemanticPart, StyleValue>>`.
- `PopconfirmSemanticInfo` includes:
  - `open`: whether the popconfirm popup is currently visible.
  - `placement`: the current effective placement. When `autoAdjustOverflow` changes placement, the semantic function receives the adjusted placement.
- The resolved semantic maps apply to the same nodes as today:
  - `root`
  - `trigger`
  - `popup`
  - `container`
  - `arrow`
  - `message`
  - `icon`
  - `text`
  - `title`
  - `description`
  - `actions`
  - `cancelButton`
  - `okButton`
- Existing object-form hooks, overlay aliases, title/description/icon rendering, triggers, hover timers, Teleport, `getPopupContainer`, arrow behavior, color, z-index, buttons, events, disabled behavior, and hidden lifecycle remain unchanged.

## Files

- `packages/components/src/popconfirm/types.ts`: split semantic map aliases and add function-form public types.
- `packages/components/src/popconfirm/popconfirm.vue`: resolve function-form semantic maps once and use the resolved maps for all semantic nodes.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add red-green coverage for function-form hooks and effective placement info.
- `docs/components/popconfirm.md`: document object-or-function forms and the `PopconfirmSemanticInfo` fields.
- Generated component outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm` are refreshed by the component build.

## Testing

- Focused Popconfirm tests must first fail because function-form `classNames` and `styles` are not resolved.
- After implementation, focused tests must pass with:
  - function-form hooks receiving `open` and effective `placement`,
  - returned classes/styles applying to root, trigger, popup, container, arrow, message, icon, text, title, description, actions, cancel button, and OK button,
  - object-form hooks still covered by existing tests,
  - overflow-adjusted placement still reflected in the popup class.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popconfirm semantic hook function support.
- Consistency check: types, docs, tests, runtime behavior, and generated output use `PopconfirmSemanticInfo` consistently.
