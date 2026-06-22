# Ant Style Tabs Layout And Semantic Hooks Design

## Context

The current Tabs component supports `items`, controlled and uncontrolled active keys, `line` and `card` types, inherited size, centered tabs, disabled items, and panel slots. Ant Design's Tabs API also includes placement, tab bar extra content, tab spacing, indicator configuration, animation flags, tab-click callbacks, item icons, and semantic class/style hooks.

This design adds the highest-value layout and styling controls while preserving the current item-based implementation.

## Goals

- Add tab placement with `tabPlacement="top" | "bottom" | "start" | "end"`.
- Add Ant compatibility alias `tabPosition="top" | "bottom" | "left" | "right"`.
- Add `tabBarExtraContent` as a string or `{ left?: string; right?: string }` object.
- Add `tabBarGutter` and `tabBarStyle` for spacing and nav styling.
- Add `indicator` configuration with size and alignment metadata.
- Add `animated` as `boolean | { inkBar?: boolean; tabPane?: boolean }`.
- Add `tabClick` event emitted when an enabled tab button is clicked.
- Add `icon` support on `TabItem`.
- Add root compatibility hooks: `className`, `rootClassName`, and `style`.
- Add semantic `classNames` and `styles` hooks for `root`, `nav`, `navList`, `tab`, `activeTab`, `tabIcon`, `tabLabel`, `panel`, `extra`, `extraLeft`, and `extraRight`.
- Keep existing active-key, disabled, size, centered, card, and panel slot behavior stable.

## Non-Goals

- Do not implement editable-card add/remove behavior in this slice.
- Do not implement overflow scrolling or more-dropdown behavior.
- Do not implement full lifecycle caching with `destroyOnHidden` in this slice.
- Do not add rich render-function tab labels; keep labels and extra content as text or slots consistent with the current library patterns.

## API Design

`Tabs.tabPlacement` accepts logical positions:

- `top`
- `bottom`
- `start`
- `end`

`Tabs.tabPosition` accepts physical positions for Ant compatibility:

- `top`
- `bottom`
- `left`
- `right`

If both are provided, `tabPlacement` wins. `left` maps to `start`; `right` maps to `end`.

`Tabs.tabBarExtraContent` accepts either a string rendered on the right side or an object with `left` and `right` text. Slots named `extraLeft` and `extraRight` override the corresponding text content.

`Tabs.tabBarGutter` sets the gap between tab buttons via a CSS variable on the nav list.

`Tabs.tabBarStyle` applies to the nav element.

`Tabs.indicator` accepts:

- `size?: number`
- `align?: "start" | "center" | "end"`

The active tab receives indicator alignment classes and size CSS variables. CSS renders the indicator through the existing active-tab pseudo element.

`Tabs.animated` accepts either a boolean or an object. `true` enables both indicator and panel animation classes. Object form controls ink-bar and panel classes independently.

`Tabs.tabClick` emits `(key, event)` when an enabled tab is clicked, including clicks on the currently active tab. Disabled tab clicks do not emit.

`TabItem.icon` renders a text icon before the label.

`Tabs.className`, `Tabs.rootClassName`, and `Tabs.style` attach to the root.

`Tabs.classNames` and `Tabs.styles` accept semantic maps keyed by:

- `root`
- `nav`
- `navList`
- `tab`
- `activeTab`
- `tabIcon`
- `tabLabel`
- `panel`
- `extra`
- `extraLeft`
- `extraRight`

## Behavior

Vertical placements (`start` and `end`) render nav and panel side by side. `end` places the panel before the nav visually through flex ordering while preserving accessible tab markup.

Bottom placement renders the panel before the nav.

`tabClick` is emitted before active-key updates for enabled tabs.

Panel rendering remains focused on the active item for this slice to avoid changing the current lifecycle behavior.

## Testing

Add focused Tabs tests before implementation:

- placement, tab position alias, gutter, extra content, and item icons render expected classes and text.
- animated and indicator configuration add expected classes and CSS variables.
- `tabClick` emits for enabled tabs, including active tabs, and disabled tabs do not emit.
- root and semantic class/style hooks apply to expected elements.

Run the focused test first to verify RED, then implement and run Tabs tests plus package typecheck.

## Documentation

Update `docs/components/tabs.md` with examples for placement, extra content, custom indicator, tab click, item icons, and semantic styling. Expand API, TabItem, Events, and Slots tables.

## Build Output

Run the package build after source and docs are complete. Commit source/tests, docs, and generated outputs separately where practical.

## Self-Review

- Placeholder scan: no unfinished markers or postponed requirements.
- Scope check: one component, no cross-component dependencies beyond existing ConfigProvider.
- Ambiguity check: editable-card, overflow, and lifecycle caching are explicitly out of scope.
- Type consistency: semantic part names and event names match the API design above.
