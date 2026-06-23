# Ant Style Tooltip Popup Container Design

## Context

Aheart Tooltip already covers renderable titles, trigger modes, hover delays, arrow configuration, hidden DOM preservation, semantic class/style hooks, and overlay compatibility props. Ant Design Tooltip 6.4.3 also documents the common `getPopupContainer(triggerNode)` API, which defaults popup mounting to `document.body` and lets consumers redirect the popup to a custom container.

Reference: Ant Design Tooltip documentation, `https://ant.design/components/tooltip/`.

## Goal

Align `ATooltip` popup mounting with the Ant-style container API while preserving the current trigger, delay, semantic styling, destroy, and renderable title behavior.

## Behavior

- `getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement` is accepted on `ATooltip`.
- When omitted, the tooltip popup is teleported to `document.body`.
- When provided, the callback receives the trigger wrapper element and the popup teleports into the returned container.
- Existing tests that inspect popup structure keep using a Teleport stub so they can assert the component tree locally.
- Real Teleport tests prove default body mounting and callback-based container mounting.
- Popup hover handlers remain active after teleporting so moving over the popup does not immediately schedule a close.

## Files

- `packages/components/src/tooltip/types.ts`: add `TooltipGetPopupContainer` and `getPopupContainer`.
- `packages/components/src/tooltip/tooltip.vue`: wrap the popup in Teleport, add a trigger ref, resolve the target container, and keep popup hover handlers.
- `packages/components/src/tooltip/__tests__/tooltip.test.ts`: add a mount helper with Teleport stubbing for local structure tests, plus real Teleport coverage for default and custom containers.
- `docs/components/tooltip.md`: document the new API.
- Generated component outputs under `packages/components/es/tooltip` and `packages/components/lib/tooltip` are refreshed by the component build.

## Testing

- Focused Tooltip tests must first fail because the popup renders inline and `getPopupContainer` is not a prop.
- After implementation, the Tooltip suite must pass with:
  - default popup mounting under `document.body`,
  - custom popup mounting through `getPopupContainer`,
  - all existing trigger, delay, semantic, arrow, destroy, and renderable content behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Tooltip popup mounting.
- Consistency check: `TooltipGetPopupContainer`, `getPopupContainer`, Teleport behavior, docs, tests, and generated output use the same API names.
