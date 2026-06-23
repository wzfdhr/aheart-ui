# Ant Style Popover Popup Container Design

## Context

Aheart Popover already covers renderable title/content, trigger modes, hover delays, arrow configuration, hidden DOM preservation, semantic class/style hooks, and overlay compatibility props. Ant Design Popover 6.4.5 inherits the common floating API and documents `getPopupContainer(triggerNode)`, defaulting popup mounting to `document.body` while allowing consumers to redirect the popup to a custom container.

Reference: Ant Design Popover documentation, `https://ant.design/components/popover/`.

## Goal

Align `APopover` popup mounting with the Ant-style container API while preserving the current Popover content, trigger, delay, semantic styling, arrow, and destroy behavior.

## Behavior

- `getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement` is accepted on `APopover`.
- When omitted, the popover popup teleports to `document.body`.
- When provided, the callback receives the trigger wrapper element and the popup teleports into the returned container.
- Existing structure tests use a Teleport stub so they can keep asserting the local popup DOM.
- Real Teleport tests prove default body mounting and callback-based custom container mounting.
- Popup hover handlers remain active after teleporting so moving over the popup participates in the same delayed hover behavior as the root wrapper.

## Files

- `packages/components/src/popover/types.ts`: add `PopoverGetPopupContainer` and `getPopupContainer`.
- `packages/components/src/popover/popover.vue`: wrap the popup in Teleport, add a trigger ref, resolve the target container, and keep popup hover handlers.
- `packages/components/src/popover/__tests__/popover.test.ts`: add a Teleport-stubbed helper for local tests and real Teleport coverage for default and custom containers.
- `docs/components/popover.md`: document the new API.
- Generated component outputs under `packages/components/es/popover` and `packages/components/lib/popover` are refreshed by the component build.

## Testing

- Focused Popover tests must first fail because the popup renders inline and `getPopupContainer` is not a prop.
- After implementation, the Popover suite must pass with:
  - default popup mounting under `document.body`,
  - custom popup mounting through `getPopupContainer`,
  - all existing trigger, delay, semantic, arrow, destroy, and renderable content behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popover popup mounting.
- Consistency check: `PopoverGetPopupContainer`, `getPopupContainer`, Teleport behavior, docs, tests, and generated output use the same API names.
