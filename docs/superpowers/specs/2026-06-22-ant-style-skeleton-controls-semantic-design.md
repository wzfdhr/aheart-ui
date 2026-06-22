# Ant Style Skeleton Controls And Semantic API Design

Date: 2026-06-22

## Context

`ASkeleton` already supports the first-pass Ant-style loading placeholder behavior: `loading`, `active`, `avatar`, `title`, `paragraph`, `round`, and default slot passthrough. The next parity gap is Ant Skeleton's richer placeholder types and semantic DOM customization.

Reference: Ant Design Skeleton documentation, `https://ant.design/components/skeleton/`.

## Goals

- Preserve current `ASkeleton` behavior for existing users.
- Add Ant-style placeholder controls:
  - `button`
  - `input`
  - `image`
  - `node`
- Add root and semantic DOM styling hooks:
  - `className`
  - `rootClassName`
  - `style`
  - `classNames`
  - `styles`
- Allow `title`, `avatar`, `paragraph`, `button`, `input`, `image`, and `node` config objects to specify useful width/height/shape/size fields.
- Keep this slice local to `ASkeleton`; do not introduce separate compound component exports yet.

## Non Goals

- `Skeleton.Button`, `Skeleton.Input`, `Skeleton.Image`, or `Skeleton.Node` named subcomponents.
- Preset image SVG illustrations beyond a simple placeholder surface.
- Loading state orchestration outside the component.

## Public API

```ts
export type SkeletonAvatarShape = 'circle' | 'square'
export type SkeletonButtonShape = 'default' | 'round' | 'circle'
export type SkeletonInputSize = 'small' | 'default' | 'large'
export type SkeletonButtonSize = 'small' | 'default' | 'large'
export type SkeletonSemanticPart =
  | 'root'
  | 'avatar'
  | 'content'
  | 'title'
  | 'paragraph'
  | 'paragraphRow'
  | 'button'
  | 'input'
  | 'image'
  | 'node'

export type SkeletonClassNames = Partial<Record<SkeletonSemanticPart, string>>
export type SkeletonStyles = Partial<Record<SkeletonSemanticPart, StyleValue>>

export interface SkeletonButtonConfig {
  active?: boolean
  block?: boolean
  shape?: SkeletonButtonShape
  size?: SkeletonButtonSize
  width?: number | string
}

export interface SkeletonInputConfig {
  active?: boolean
  block?: boolean
  size?: SkeletonInputSize
  width?: number | string
}

export interface SkeletonImageConfig {
  active?: boolean
  width?: number | string
  height?: number | string
}

export interface SkeletonNodeConfig {
  active?: boolean
  width?: number | string
  height?: number | string
  children?: VNodeChild
}
```

`SkeletonProps` additions:

| Prop | Type | Default |
| --- | --- | --- |
| `button` | `boolean \| SkeletonButtonConfig` | `false` |
| `input` | `boolean \| SkeletonInputConfig` | `false` |
| `image` | `boolean \| SkeletonImageConfig` | `false` |
| `node` | `boolean \| SkeletonNodeConfig` | `false` |
| `className` | `string` | - |
| `rootClassName` | `string` | - |
| `style` | `StyleValue` | - |
| `classNames` | `SkeletonClassNames` | `{}` |
| `styles` | `SkeletonStyles` | `{}` |

## Behavior

- When `loading=false`, render default slot exactly as current behavior.
- When `loading=true`, render root placeholder surface with semantic classes/styles.
- `button`, `input`, `image`, and `node` render before the text content area, alongside avatar/title/paragraph placeholders.
- `button.active`, `input.active`, `image.active`, and `node.active` can opt into animation even if root `active` is false.
- Root `active` still animates all rendered placeholder parts.
- `round` rounds text rows, buttons, inputs, images, and node placeholders.
- `node` can render custom `children` content inside the placeholder.
- `className` and `rootClassName` are both appended to the root for compatibility with local naming and Ant-style root class naming.

## Verification

- Add RED tests for semantic hooks, button/input/image/node rendering, local active overrides, and slot passthrough preservation.
- Run focused Skeleton tests for RED and GREEN.
- Run component typecheck.
- Update docs and generated `es` / `lib` outputs.
- Run full verification before closing the slice.
