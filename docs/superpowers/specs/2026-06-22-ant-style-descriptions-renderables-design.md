# Ant Style Descriptions Renderables Design

## Context

`ADescriptions` currently renders `title`, `extra`, item labels, and item content as plain strings. Ant Design documents `title` and `extra` as ReactNode fields, recommends the `items` API, and shows item `children` rendered as nodes. Its `DescriptionItem.label` is also documented as ReactNode.

Official reference:

- https://ant.design/components/descriptions/

## Scope

This slice adds renderable node parity for:

- `title`
- `extra`
- `DescriptionItem.label`
- `DescriptionItem.content`
- `DescriptionItem.children`

It also adds header slots:

- `title`
- `extra`

This slice keeps the existing `items` API as the only item source. It does not add the legacy `<ADescriptionsItem>` child component, responsive breakpoint objects for `column`, or screen-based item spans.

## Behavior

### Header Rendering

The header appears when either title or extra content is present through props or slots.

Priority:

1. `title` slot, then `title` prop
2. `extra` slot, then `extra` prop

Falsy renderable values (`undefined`, `null`, `false`, empty string) do not create header content.

### Item Rendering

Each item renders:

1. `label` as a renderable node.
2. content from `content`, then `children`, then an empty string.

Labels and content can be strings, numbers, booleans, VNodes, arrays, or render functions through Vue `VNodeChild`.

### Existing Behavior Kept

- `span: 'filled'` still fills the remaining row.
- `colon`, `labelStyle`, `contentStyle`, semantic `classNames`, semantic `styles`, layout, bordered, and size behavior stay unchanged.
- Text-only uses continue to render the same visible text.

## API

```ts
export type DescriptionRenderable = VNodeChild

export interface DescriptionItem {
  key?: string | number
  label: DescriptionRenderable
  content?: DescriptionRenderable
  children?: DescriptionRenderable
  span?: DescriptionItemSpan
  className?: string
  style?: StyleValue
  labelStyle?: StyleValue
  contentStyle?: StyleValue
}
```

`descriptionsProps.title` and `descriptionsProps.extra` use the same renderable prop shape.

## Testing

Add Vitest coverage for:

- Prop-based VNode title, extra, label, and content.
- Slot-based title and extra overriding prop content.
- `content` taking precedence over `children`.
- Existing string tests remaining green.

## Documentation

Update `docs/components/descriptions.md` to:

- Add a renderable content example.
- Document `title`, `extra`, `label`, `content`, and `children` as `VNodeChild`.
- Document `title` and `extra` slots.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on renderable content parity only.
- Ambiguity check: prop and slot precedence is explicit.
