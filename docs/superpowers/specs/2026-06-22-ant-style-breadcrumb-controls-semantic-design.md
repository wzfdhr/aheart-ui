# Ant Style Breadcrumb Controls And Semantic API Design

Date: 2026-06-22

## Context

`ABreadcrumb` is already Ready with a minimal `items` plus `separator` API. To keep navigation components moving toward Ant-style parity, Breadcrumb needs a small richer surface for render customization, path params, click handlers, VNode titles, and semantic DOM styling.

Reference: Ant Design Breadcrumb documentation, `https://ant.design/components/breadcrumb/`.

## Goals

- Preserve the current simple `items`/`separator` behavior.
- Allow `title` and `separator` to render `VNodeChild`, not only strings.
- Add `itemRender` for users that need custom link/text output.
- Add `path` and `params` support for route-like breadcrumb items.
- Add per-item `className`, `style`, and `onClick` fields.
- Add root and semantic DOM styling hooks:
  - `className`
  - `style`
  - `classNames`
  - `styles`
- Keep the implementation static and local; do not add dropdown menus or router dependencies in this slice.

## Non Goals

- Dropdown menu integration for breadcrumb items.
- Router-link component integration.
- Automatically reading Vue Router state.
- Deprecated `routes` compatibility.

## Public API

```ts
export type BreadcrumbSemanticPart = 'root' | 'list' | 'item' | 'link' | 'text' | 'separator'
export type BreadcrumbClassNames = Partial<Record<BreadcrumbSemanticPart, string>>
export type BreadcrumbStyles = Partial<Record<BreadcrumbSemanticPart, StyleValue>>

export interface BreadcrumbItem {
  title: VNodeChild
  href?: string
  path?: string
  className?: string
  style?: StyleValue
  disabled?: boolean
  onClick?: (event: MouseEvent, item: BreadcrumbItem, index: number) => void
}

export type BreadcrumbItemRender = (
  item: BreadcrumbItem,
  params: Record<string, string | number>,
  items: BreadcrumbItem[],
  paths: string[],
  index: number
) => VNodeChild
```

`BreadcrumbProps` additions:

| Prop | Type | Default |
| --- | --- | --- |
| `params` | `Record<string, string | number>` | `{}` |
| `separator` | `VNodeChild` | `/` |
| `itemRender` | `BreadcrumbItemRender` | - |
| `className` | `string` | - |
| `style` | `StyleValue` | - |
| `classNames` | `BreadcrumbClassNames` | `{}` |
| `styles` | `BreadcrumbStyles` | `{}` |

## Behavior

- If `href` exists, use it for non-current enabled link items.
- If `href` is absent and `path` exists, interpolate `:params` in `path` and use it as the link href for non-current enabled items.
- `itemRender` receives the current item, root params, all items, cumulative resolved paths, and index.
- `itemRender` output wins over the default link/text rendering.
- `onClick` runs for enabled breadcrumb items.
- Current item remains non-link by default and gets `aria-current="page"`.
- Disabled items do not render as links and do not call `onClick`.

## Verification

- Add failing Breadcrumb tests for VNode rendering, semantic hooks, `itemRender`, path params, per-item class/style, and click handling.
- Run focused Breadcrumb tests for RED and GREEN.
- Run component typecheck.
- Update docs and generated `es` / `lib` outputs.
- Run full verification before closing the slice.
