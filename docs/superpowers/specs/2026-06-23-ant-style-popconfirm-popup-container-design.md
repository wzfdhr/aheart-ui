# Ant Style Popconfirm Popup Container Design

## Context

Aheart Popconfirm already supports trigger modes, controlled and uncontrolled open state, disabled state, renderable title/description/icon content, action button props, color, z-index, popup click events, and semantic class/style hooks. Ant Design Popconfirm 6.4.5 shares the floating popup API with Tooltip and Popover, including `getPopupContainer(triggerNode)` with a default body-mounted popup.

Reference: Ant Design Popconfirm documentation, `https://ant.design/components/popconfirm/`.

## Goal

Align `APopconfirm` popup mounting with the Ant-style container API while preserving current confirmation actions, trigger behavior, renderable content, semantic styling, and popup click events.

## Behavior

- `getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement` is accepted on `APopconfirm`.
- When omitted, the popconfirm popup teleports to `document.body`.
- When provided, the callback receives the trigger wrapper element and the popup teleports into the returned container.
- Existing structure tests use a Teleport stub so they can keep asserting local popup DOM.
- Real Teleport tests prove default body mounting and callback-based custom container mounting.
- Hover-triggered Popconfirm remains open when pointer movement goes from trigger/root to the teleported popup, and closes when the pointer leaves both areas.
- Popup click, OK, Cancel, semantic class/style hooks, and renderable content behavior remain unchanged.

## Files

- `packages/components/src/popconfirm/types.ts`: add `PopconfirmGetPopupContainer` and `getPopupContainer`.
- `packages/components/src/popconfirm/popconfirm.vue`: wrap the popup in Teleport, add trigger/root/popup refs, resolve the target container, and keep hover behavior stable across the teleported popup.
- `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`: add a Teleport-stubbed helper for local tests and real Teleport coverage for default, custom, and hover handoff behavior.
- `docs/components/popconfirm.md`: document the new API.
- Generated component outputs under `packages/components/es/popconfirm` and `packages/components/lib/popconfirm` are refreshed by the component build.

## Testing

- Focused Popconfirm tests must first fail because the popup renders inline, `getPopupContainer` is not a prop, and hover leave does not account for a teleported popup target.
- After implementation, the Popconfirm suite must pass with:
  - default popup mounting under `document.body`,
  - custom popup mounting through `getPopupContainer`,
  - hover transfer between trigger and teleported popup preserved,
  - all existing trigger, confirmation, semantic, popup click, and renderable content behavior preserved.
- Component typecheck, full component tests, component build, docs build, and Git diff checks must pass before commit.

## Self Review

- Placeholder scan: no placeholder text remains.
- Scope check: this slice is limited to Popconfirm popup mounting and hover continuity needed by that mounting change.
- Consistency check: `PopconfirmGetPopupContainer`, `getPopupContainer`, Teleport behavior, docs, tests, and generated output use the same API names.
