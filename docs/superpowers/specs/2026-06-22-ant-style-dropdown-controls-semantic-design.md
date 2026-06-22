# Ant Style Dropdown Controls And Semantic Hooks Design

## Context

The current Dropdown component supports menu items, click or hover triggers, placement, controlled or default open state, ConfigProvider disabled fallback, a boolean arrow, and menu-click events.

Ant Design's Dropdown API also exposes a hover-first default trigger, `contextMenu` trigger, disabled state, preserved or destroyed hidden popup DOM, object-form arrow configuration, overlay compatibility hooks, semantic class/style hooks, popup content customization, and richer open-change metadata. This slice adds the Dropdown-owned parts of that surface while preserving the current simplified inline positioning strategy.

Reference checked: https://ant.design/components/dropdown/

## Goals

- Align the default trigger with Ant by changing `trigger` to `['hover']`.
- Keep explicit `trigger: ['click']` and add `trigger: ['contextMenu']`.
- Keep `disabled` and ConfigProvider disabled fallback behavior.
- Add `destroyOnHidden`, defaulting to `false` to keep a rendered popup mounted after first open.
- Add deprecated compatibility alias `destroyPopupOnHide`, where either prop destroys the popup when hidden.
- Expand `arrow` from `boolean` to `boolean | { pointAtCenter?: boolean }`.
- Add root hooks: `className`, `rootClassName`, and `style`.
- Add overlay compatibility hooks: `overlayClassName` and `overlayStyle`.
- Add semantic `classNames` and `styles` hooks for `root`, `trigger`, `popup`, `menu`, and `arrow`.
- Add `popupRender` and deprecated `dropdownRender` render hooks that receive the default menu node and return custom popup content.
- Add a `popup` slot as the Vue-native custom popup content escape hatch.
- Add `menu.closeOnClick`, defaulting to `true`, to preserve the current close-after-menu-click behavior while allowing users to keep the dropdown open.
- Emit `openChange(open, { source })`, where `source` is `trigger` for trigger interactions and `menu` for menu-driven close. Match Ant by not firing `openChange` when a menu item click closes the popup.
- Keep current menu config, menu click event, controlled open behavior, placement classes, and inline absolute positioning stable.

## Non-Goals

- Do not implement `getPopupContainer`, `autoAdjustOverflow`, `align`, route-aware portals, cursor-follow positioning for context menu, or collision flipping in this slice. Those should be shared floating-layer work across Tooltip, Popover, Popconfirm, and Dropdown.
- Do not convert Dropdown to a global overlay or teleport implementation.
- Do not redesign Menu. Dropdown can pass menu props and listen to menu click, but Menu's own component surface remains separate.

## API Design

`Dropdown.trigger` accepts `click`, `hover`, and `contextMenu` entries. The default becomes `['hover']`. Click and hover interactions use the existing placement-driven inline popup. Context menu prevents the browser menu and opens immediately at the configured placement.

`Dropdown.destroyOnHidden` controls whether the popup DOM is removed when closed:

- `false`: after the popup has opened once, keep it mounted with `v-show`.
- `true`: remove it when hidden.

`Dropdown.destroyPopupOnHide` is accepted as a deprecated alias. If either `destroyOnHidden` or `destroyPopupOnHide` is true, the hidden popup is destroyed.

`Dropdown.arrow` accepts:

- `true`: render the arrow.
- `false`: hide the arrow.
- `{ pointAtCenter: true }`: render the arrow and add a centered-arrow state class.

`Dropdown.className`, `Dropdown.rootClassName`, and `Dropdown.style` attach to the root wrapper.

`Dropdown.overlayClassName` and `Dropdown.overlayStyle` attach to the popup.

`Dropdown.classNames` and `Dropdown.styles` accept semantic maps keyed by:

- `root`
- `trigger`
- `popup`
- `menu`
- `arrow`

The popup structure remains:

- `.aheart-dropdown`
- `.aheart-dropdown__trigger`
- `.aheart-dropdown__overlay`
- `.aheart-dropdown__arrow`

The default menu receives `.aheart-dropdown__menu` plus semantic menu hooks.

`Dropdown.popupRender` and `Dropdown.dropdownRender` accept `(menus: VNodeChild) => VNodeChild`. `popupRender` wins when both are supplied. The `popup` slot wins over both render props.

`Dropdown.menu.closeOnClick` defaults to `true`. When `false`, menu clicks emit Dropdown's `click` event but do not close uncontrolled dropdowns.

## Behavior

Controlled and uncontrolled open behavior remains unchanged for trigger interactions.

Disabled Dropdown ignores click, hover, and context menu interactions and adds `aria-disabled="true"` to the trigger.

Trigger interactions emit both `update:open` and `openChange(open, { source: 'trigger' })`.

Menu-click closing emits `update:open(false)` but does not emit `openChange`, matching Ant's documented `onOpenChange` behavior.

`defaultOpen` still seeds uncontrolled state. When it changes later, uncontrolled Dropdown follows it.

The popup can render from menu config, `popupRender`, `dropdownRender`, or the `popup` slot.

## Testing

Add focused Dropdown tests before implementation:

- default trigger is hover, while explicit click still toggles on click.
- context menu trigger opens and prevents the native browser menu.
- semantic root, trigger, popup, menu, and arrow class/style hooks apply.
- overlay compatibility props attach to popup.
- `destroyOnHidden=false` keeps the popup mounted after first close; `destroyOnHidden=true` and `destroyPopupOnHide=true` remove it.
- object-form arrow renders and applies the point-at-center class.
- menu click closes by default without `openChange(false)` and can stay open with `menu.closeOnClick=false`.
- `popup` slot and `popupRender` can customize popup content.
- existing disabled fallback, controlled open state, and click event behavior remains stable.

Run the focused test first to verify RED, then implement and run Dropdown tests plus package typecheck.

## Documentation

Update `docs/components/dropdown.md` with examples for default hover, click trigger, context menu trigger, object arrow, destroy-on-hidden, popup customization, and semantic styling. Expand API, Events, Slots, and semantic DOM tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no shared floating refactor in this slice.
- Ambiguity check: unsupported Ant APIs are explicit non-goals.
- Type consistency: semantic part names, render prop names, and event names match the API design above.
