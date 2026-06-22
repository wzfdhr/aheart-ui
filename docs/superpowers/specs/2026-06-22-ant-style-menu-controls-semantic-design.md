# Ant Style Menu Controls And Semantic API Design

Date: 2026-06-22

## Context

`AMenu` is already Ready with Ant-style tree items, controlled selected/open keys, multiple selection, themes, modes, and ConfigProvider disabled fallback. After the Dropdown controls/semantic pass, Menu should expose the same kind of narrow but useful configuration surface so it can serve both standalone navigation and dropdown overlays.

Reference: Ant Design Menu documentation, `https://ant.design/components/menu/`.

## Goals

- Add Menu-level semantic styling hooks without changing the existing visual defaults.
- Add useful Ant-compatible control props that are easy to reason about in this codebase:
  - `inlineIndent`
  - `forceSubMenuRender`
  - `triggerSubMenuAction`
  - `expandIcon`
  - `className`
  - `style`
  - `classNames`
  - `styles`
- Expand `MenuItem` with Ant-style display fields:
  - `icon`
  - `extra`
  - `title`
  - divider `dashed`
- Preserve current behavior for existing users.
- Keep the implementation local to Menu; do not introduce portal rendering, motion measurement, routing, or keyboard roving focus in this slice.

## Non Goals

- Horizontal overflow measurement.
- Popup submenu positioning.
- Router integration.
- Keyboard focus management.
- Submenu open/close delay props.
- Menu item slot APIs.

## Public API

```ts
export type MenuTriggerSubMenuAction = 'hover' | 'click'
export type MenuSemanticPart =
  | 'root'
  | 'list'
  | 'item'
  | 'itemButton'
  | 'submenu'
  | 'submenuTitle'
  | 'submenuList'
  | 'group'
  | 'groupTitle'
  | 'divider'
  | 'icon'
  | 'label'
  | 'extra'
  | 'expandIcon'

export type MenuClassNames = Partial<Record<MenuSemanticPart, string>>
export type MenuStyles = Partial<Record<MenuSemanticPart, StyleValue>>
export type MenuExpandIcon =
  | VNodeChild
  | ((info: { item: MenuItem; isOpen: boolean; disabled: boolean; level: number }) => VNodeChild)

export interface MenuItem {
  key: string
  label?: VNodeChild
  icon?: VNodeChild
  extra?: VNodeChild
  title?: string
  disabled?: boolean
  danger?: boolean
  dashed?: boolean
  type?: MenuItemType
  children?: MenuItem[]
}
```

`MenuProps` additions:

| Prop | Type | Default |
| --- | --- | --- |
| `inlineIndent` | `number` | `24` |
| `forceSubMenuRender` | `boolean` | `false` |
| `triggerSubMenuAction` | `'hover' \| 'click'` | `'click'` |
| `expandIcon` | `MenuExpandIcon` | - |
| `className` | `string` | - |
| `style` | `StyleValue` | - |
| `classNames` | `MenuClassNames` | `{}` |
| `styles` | `MenuStyles` | `{}` |

## Behavior

- `inlineIndent` controls nested menu padding through a CSS variable on the root.
- `className`, `style`, `classNames.root`, and `styles.root` apply to the root `nav`.
- Semantic class/style maps are passed to recursive nodes and applied to stable DOM parts.
- `forceSubMenuRender` keeps submenu lists in the DOM while hidden with `v-show`.
- `triggerSubMenuAction="hover"` toggles submenu open state on pointer enter/leave, while the click title no longer toggles.
- `expandIcon` renders in submenu titles; if it is a function it receives item/open/disabled/level state.
- `MenuItem.icon`, `label`, and `extra` render as `VNodeChild` through a small local render helper.
- `MenuItem.title` maps to the interactive button title attribute.
- Divider items support `dashed`.

## Verification

- Add RED tests for each new behavior before implementation.
- Run focused Menu tests.
- Run component typecheck.
- Update docs and generated `es` / `lib` outputs.
- Run full typecheck, test, package build, and docs build before closing the slice.
