# Ant Style Card Tabs Design

## Context

`ACard` now covers the shell API, `Card.Meta`, and `Card.Grid`. Ant Design Card also supports tabbed cards through `tabList`, `activeTabKey`, `defaultActiveTabKey`, `tabBarExtraContent`, `tabProps`, and `onTabChange`.

Official reference:

- https://ant.design/components/card/

## Scope

This slice adds:

- `tabList` items on `ACard`.
- Controlled `activeTabKey`.
- Uncontrolled `defaultActiveTabKey`.
- `tabBarExtraContent` renderable content.
- `tabProps` for tabbar class/style and gutter hooks.
- `update:activeTabKey` and `tabChange` events.
- Per-tab content through `tab-{key}` slots, then item `children`, then default slot fallback.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add editable-card tabs, overflow/more dropdown behavior, route integration, or card-level use of the standalone `ATabs` component.

## Behavior

### Active Tab Resolution

The active tab resolves in this order:

1. `activeTabKey`
2. internal uncontrolled state initialized from `defaultActiveTabKey`
3. first enabled tab key
4. first tab key

Clicking an enabled, inactive tab:

- updates internal active key only when uncontrolled
- emits `update:activeTabKey(key)`
- emits `tabChange(key)`

Clicking the active tab or a disabled tab does not emit change events.

### Content Resolution

When `tabList` is present and an active tab exists, the card body renders content in this order:

1. slot named `tab-${activeTabKey}`
2. active tab `children`
3. default slot

When `tabList` is not present, body rendering stays unchanged.

### Tab Bar

The tab bar renders between the card header and the card body. `tabBarExtraContent` renders at the end of the tab bar, and a `tabBarExtraContent` slot can override the prop.

`tabProps` provides lightweight styling hooks for the internal card tabbar:

- `className`, `rootClassName`, `style`
- `tabBarGutter`
- `classNames`
- `styles`

Semantic tab parts are:

- `root`: tabbar wrapper
- `list`: tab button list
- `tab`: every tab button
- `activeTab`: the active tab button
- `tabLabel`: tab label wrapper
- `extra`: extra content wrapper

## API

```ts
export interface CardTab {
  key: string
  tab: VNodeChild
  disabled?: boolean
  children?: VNodeChild
}

export type CardTabSemanticPart = 'root' | 'list' | 'tab' | 'activeTab' | 'tabLabel' | 'extra'

export interface CardTabProps {
  className?: string
  rootClassName?: string
  style?: StyleValue
  tabBarGutter?: number
  classNames?: Partial<Record<CardTabSemanticPart, string>>
  styles?: Partial<Record<CardTabSemanticPart, StyleValue>>
}
```

## Testing

Use Vitest and Vue Test Utils:

- Verify default active tab resolves from the first enabled tab and renders `tab-{key}` slot content.
- Verify `defaultActiveTabKey` initializes uncontrolled state and tab clicks emit `update:activeTabKey` / `tabChange`.
- Verify controlled `activeTabKey` does not mutate visual state after clicks.
- Verify disabled and active tab clicks do not emit change events.
- Verify item `children`, default slot fallback, `tabBarExtraContent`, `tabBarExtraContent` slot, and `tabProps` class/style hooks.

## Documentation

Update `docs/components/card.md`:

- Add a tabbed card example.
- Expand Card API with tab props and events.
- Add `CardTab` and `CardTabProps` tables.
- Add tab slot documentation.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on `ACard` tab controls only.
- Ambiguity check: active tab clicks are explicitly non-changing and do not emit `tabChange`.
