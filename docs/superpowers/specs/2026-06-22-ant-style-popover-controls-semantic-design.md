# Ant Style Popover Controls And Semantic Hooks Design

## Context

The current Popover component supports title, content, placement, trigger, controlled or default open state, color, arrow, z-index, title/content slots, and open-change events.

Ant Design's Popover API also exposes semantic class/style hooks, hover open and close delays, preserved or destroyed popup DOM, a `fresh` option, object-form arrow configuration, and older overlay class/style compatibility props. This slice adds the Popover-owned parts of that surface while preserving the current simplified floating positioning helper.

Reference checked: https://ant.design/components/popover/

## Goals

- Add `mouseEnterDelay` and `mouseLeaveDelay` in seconds.
- Add `destroyOnHidden`, defaulting to `false` to keep a rendered popup mounted after first open.
- Add `fresh` as an accepted prop. In Vue, hidden mounted content naturally stays reactive, so no special cache layer is needed.
- Expand `arrow` from `boolean` to `boolean | { pointAtCenter?: boolean }`.
- Add root compatibility hooks: `className`, `rootClassName`, and `style`.
- Add deprecated-but-useful overlay compatibility hooks: `overlayClassName`, `overlayStyle`, and `overlayInnerStyle`.
- Add semantic `classNames` and `styles` hooks for `root`, `trigger`, `popup`, `container`, `title`, `content`, and `arrow`.
- Keep current title, content, slots, placement, trigger, controlled open behavior, color, z-index, and `openChange` behavior stable.

## Non-Goals

- Do not implement `getPopupContainer`, `autoAdjustOverflow`, `align`, route-aware portals, or collision flipping in this slice. Those should be shared floating-layer work across Tooltip, Popover, Popconfirm, and Dropdown.
- Do not implement a special hidden-content cache for `fresh`; Vue reactivity updates mounted hidden DOM without a React-style cache.
- Do not change the simplified absolute-positioning strategy.

## API Design

`Popover.mouseEnterDelay` and `Popover.mouseLeaveDelay` are seconds, matching Ant's public API. Delays only affect hover triggers; focus, click, and context menu remain immediate.

`Popover.destroyOnHidden` controls whether the popup DOM is removed when closed:

- `false`: after the popup has opened once, keep it mounted with `v-show`.
- `true`: remove it when hidden.

`Popover.fresh` is accepted for API compatibility. It does not need extra runtime behavior in the current Vue implementation.

`Popover.arrow` accepts:

- `true`: render the arrow.
- `false`: hide the arrow.
- `{ pointAtCenter: true }`: render the arrow and add a centered-arrow state class.

`Popover.className`, `Popover.rootClassName`, and `Popover.style` attach to the root wrapper.

`Popover.overlayClassName` and `Popover.overlayStyle` attach to the popup. `Popover.overlayInnerStyle` attaches to the inner container.

`Popover.classNames` and `Popover.styles` accept semantic maps keyed by:

- `root`
- `trigger`
- `popup`
- `container`
- `title`
- `content`
- `arrow`

The popup structure becomes:

- `.aheart-popover`
- `.aheart-popover__trigger`
- `.aheart-popover__popup`
- `.aheart-popover__arrow`
- `.aheart-popover__container`
- `.aheart-popover__title`
- `.aheart-popover__content`

## Behavior

Controlled and uncontrolled open behavior remains unchanged.

When hover timers are pending, the opposite hover event clears the stale timer before scheduling its own action.

`defaultOpen` still seeds uncontrolled state. When it changes later, uncontrolled Popover follows it.

The popup is only rendered when there is title or content from props or slots.

## Testing

Add focused Popover tests before implementation:

- semantic root, trigger, popup, container, title, content, and arrow class/style hooks apply.
- overlay compatibility props attach to popup and container.
- hover triggers respect enter and leave delays using fake timers.
- `destroyOnHidden=false` keeps the popup mounted after first close; `destroyOnHidden=true` removes it.
- object-form arrow renders and applies the point-at-center class.
- existing title/content, slot, click trigger, and open-change behavior remains stable.

Run the focused test first to verify RED, then implement and run Popover tests plus package typecheck.

## Documentation

Update `docs/components/popover.md` with examples for color/arrow, delayed hover, semantic styling, and preserved popup DOM. Expand API, Events, and semantic DOM tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no shared floating refactor in this slice.
- Ambiguity check: unsupported Ant APIs are explicit non-goals.
- Type consistency: semantic part names and event names match the API design above.
