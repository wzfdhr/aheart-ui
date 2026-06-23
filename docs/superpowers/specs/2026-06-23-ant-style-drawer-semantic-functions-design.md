# Ant Style Drawer Semantic Functions Design

## Context

Ant Design Drawer documents `classNames` and `styles` as semantic DOM customization hooks that may be provided as either objects or functions. Aheart Drawer currently accepts only object records, while Aheart Modal already supports the function form through a small semantic config resolver.

Official reference:

- https://ant.design/components/drawer/

## Scope

This phase adds:

- Function-valued `classNames` and `styles` support to `ADrawer`.
- `DrawerSemanticInfo`, `DrawerSemanticRecord<T>`, and `DrawerSemanticConfig<T>` exported types.
- A local semantic resolver in `drawer.vue` that passes the current props object to each function.
- Tests, docs, and generated `es` / `lib` Drawer outputs.

This phase does not rename semantic parts, change default DOM structure, add new semantic keys, or alter Modal behavior.

## Behavior

`classNames` and `styles` continue to accept object records:

```ts
classNames={{ body: 'workspace-drawer-body' }}
styles={{ body: { padding: '24px' } }}
```

They also accept functions:

```ts
const classNames = ({ props }) => ({
  root: props.placement === 'left' ? 'drawer-left-root' : 'drawer-root'
})
```

The function receives:

```ts
interface DrawerSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```

The returned record is resolved per semantic part. Existing object-form precedence and merge behavior stays unchanged.

## Architecture

`packages/components/src/drawer/types.ts` broadens semantic types to match Modal's pattern:

- `DrawerSemanticInfo`
- `DrawerSemanticRecord<T>`
- `DrawerSemanticConfig<T>`
- `DrawerClassNames = DrawerSemanticConfig<string>`
- `DrawerStyles = DrawerSemanticConfig<CSSProperties>`

`packages/components/src/drawer/drawer.vue` adds a generic `resolveSemanticConfig` helper. `semanticClass` and `semanticStyle` call that helper, so existing class and style call sites remain stable.

## Testing

Add Vitest coverage for:

- Function-valued `classNames` receiving current Drawer props and applying classes.
- Function-valued `styles` receiving current Drawer props and applying styles.
- Object-valued semantic hooks continuing to work through the existing test.

## Documentation

Update `docs/components/drawer.md` to:

- Document `classNames` and `styles` as object or function forms.
- Add a `DrawerSemanticInfo` reference section.
- Keep the existing semantic styling example unchanged because object form remains the common case.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Drawer semantic hook function support only.
- Ambiguity check: function input, return shape, and preserved object behavior are explicit.
