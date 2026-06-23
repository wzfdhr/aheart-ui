# Ant Style Tabs Renderables Design

## Context

`ATabs` already supports items, controlled and uncontrolled active keys, disabled tabs, size fallback, placement aliases, gutter, extra content, indicator configuration, animated state classes, tab click events, and semantic class/style hooks.

Ant Design Tabs models item `label`, `icon`, `children`, and `tabBarExtraContent` as renderable nodes. The current Aheart implementation types and renders these as plain strings, so VNode content is not rendered as DOM.

Official reference:

- https://ant.design/components/tabs/

## Scope

This slice adds:

- `VNodeChild` support for `TabItem.label`.
- `VNodeChild` support for `TabItem.icon`.
- `VNodeChild` support for `TabItem.children`.
- `VNodeChild` support for `tabBarExtraContent` string/object values.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add `destroyOnHidden`, `forceRender`, editable-card tabs, overflow menus, custom tab bar rendering, or lifecycle caching for inactive panes.

## Behavior

### Renderable Items

`TabItem` content fields accept `VNodeChild`:

```ts
export type TabsRenderable = VNodeChild

export interface TabItem {
  key: string
  label: TabsRenderable
  icon?: TabsRenderable
  children?: TabsRenderable
  disabled?: boolean
}
```

The active panel renders `children` through a local render helper. Named slots (`tab-${key}`) still override item children.

### Renderable Extra Content

`tabBarExtraContent` accepts:

```ts
TabsRenderable | { left?: TabsRenderable; right?: TabsRenderable }
```

Passing a plain renderable value continues to place content on the right side, preserving existing behavior. Object form can render left and right nodes.

### Existing Behavior

The slice preserves:

- Controlled and uncontrolled active key behavior.
- Disabled tab behavior.
- `tabClick`, `update:activeKey`, and `change` events.
- `type`, size, centered, placement, gutter, indicator, animated, and semantic hooks.
- Named panel slots overriding item children.

## Testing

Add Vitest coverage for:

- VNode tab label, icon, and children rendering.
- VNode `tabBarExtraContent` in object form rendering left and right content.
- Named panel slots continuing to override item children.

The RED tests should fail before implementation because current Tabs uses mustache interpolation for item content and extra content.

## Documentation

Update `docs/components/tabs.md` to:

- Add a custom renderables demo.
- Document `TabItem.label`, `icon`, and `children` as `VNodeChild`.
- Document `tabBarExtraContent` as `VNodeChild | { left?: VNodeChild; right?: VNodeChild }`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Tabs renderable content only.
- Ambiguity check: named slots remain the higher-priority panel content source.
