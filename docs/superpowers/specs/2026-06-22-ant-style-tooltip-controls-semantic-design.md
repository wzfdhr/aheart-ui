# Ant Style Tooltip Controls And Semantic Hooks Design

## Context

The current Tooltip component supports title, placement, trigger, controlled or default open state, color, arrow, z-index, title slot, hover delays, and open-change events.

Ant Design's Tooltip API also exposes preserved or destroyed hidden popup DOM, a `fresh` option, object-form arrow configuration, root and overlay compatibility hooks, and semantic class/style hooks. This slice adds the Tooltip-owned parts of that surface while preserving the current simplified floating positioning helper.

Reference checked: https://ant.design/components/tooltip/

## Goals

- Keep `mouseEnterDelay` and `mouseLeaveDelay` as seconds, and align their defaults to `0.1`.
- Add `destroyOnHidden`, defaulting to `false` to keep a rendered popup mounted after first open.
- Add `fresh` as an accepted prop. In Vue, hidden mounted content naturally stays reactive, so no special cache layer is needed.
- Expand `arrow` from `boolean` to `boolean | { pointAtCenter?: boolean }`.
- Add root compatibility hooks: `className`, `rootClassName`, and `style`.
- Add deprecated-but-useful overlay compatibility hooks: `overlayClassName`, `overlayStyle`, and `overlayInnerStyle`.
- Add semantic `classNames` and `styles` hooks for `root`, `trigger`, `popup`, `container`, `content`, and `arrow`.
- Keep current title, title slot, placement, trigger, controlled open behavior, color, z-index, hover delay behavior, and `openChange` behavior stable.

## Non-Goals

- Do not implement `getPopupContainer`, `autoAdjustOverflow`, `align`, route-aware portals, or collision flipping in this slice. Those should be shared floating-layer work across Tooltip, Popover, Popconfirm, and Dropdown.
- Do not implement a special hidden-content cache for `fresh`; Vue reactivity updates mounted hidden DOM without a React-style cache.
- Do not change the simplified absolute-positioning strategy.

## API Design

`Tooltip.mouseEnterDelay` and `Tooltip.mouseLeaveDelay` are seconds, matching Ant's public API. Delays only affect hover triggers; focus, click, and context menu remain immediate.

`Tooltip.destroyOnHidden` controls whether the popup DOM is removed when closed:

- `false`: after the popup has opened once, keep it mounted with `v-show`.
- `true`: remove it when hidden.

`Tooltip.fresh` is accepted for API compatibility. It does not need extra runtime behavior in the current Vue implementation.

`Tooltip.arrow` accepts:

- `true`: render the arrow.
- `false`: hide the arrow.
- `{ pointAtCenter: true }`: render the arrow and add a centered-arrow state class.

`Tooltip.className`, `Tooltip.rootClassName`, and `Tooltip.style` attach to the root wrapper.

`Tooltip.overlayClassName` and `Tooltip.overlayStyle` attach to the popup. `Tooltip.overlayInnerStyle` attaches to the inner container.

`Tooltip.classNames` and `Tooltip.styles` accept semantic maps keyed by:

- `root`
- `trigger`
- `popup`
- `container`
- `content`
- `arrow`

The popup structure becomes:

- `.aheart-tooltip`
- `.aheart-tooltip__trigger`
- `.aheart-tooltip__popup`
- `.aheart-tooltip__arrow`
- `.aheart-tooltip__container`
- `.aheart-tooltip__content`

## Behavior

Controlled and uncontrolled open behavior remains unchanged.

When hover timers are pending, the opposite hover event clears the stale timer before scheduling its own action.

`defaultOpen` still seeds uncontrolled state. When it changes later, uncontrolled Tooltip follows it.

The popup is only rendered when there is title content from props or slots.

## Testing

Add focused Tooltip tests before implementation:

- semantic root, trigger, popup, container, content, and arrow class/style hooks apply.
- overlay compatibility props attach to popup and container.
- hover triggers respect default and custom enter/leave delays using fake timers.
- `destroyOnHidden=false` keeps the popup mounted after first close; `destroyOnHidden=true` removes it.
- object-form arrow renders and applies the point-at-center class.
- existing title, title slot, click trigger, controlled open, and open-change behavior remains stable.

Run the focused test first to verify RED, then implement and run Tooltip tests plus package typecheck.

## Documentation

Update `docs/components/tooltip.md` with examples for object arrow, delayed hover, preserved popup DOM, and semantic styling. Expand API, Events, Slots, and semantic DOM tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no shared floating refactor in this slice.
- Ambiguity check: unsupported Ant APIs are explicit non-goals.
- Type consistency: semantic part names and event names match the API design above.
