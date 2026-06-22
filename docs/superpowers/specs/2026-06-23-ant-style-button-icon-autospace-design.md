# Ant Style Button Icon and Auto Space Design

## Context

`AButton` already supports Ant-style type, danger, ghost, block, shape, link rendering, loading delay/custom loading icon, `htmlType`, `iconPosition`, color/variant, ConfigProvider fallbacks, and semantic class/style hooks.

Ant Design Button documents `icon` as renderable node content and `autoInsertSpace` for spacing two Chinese characters. The current Aheart implementation treats `icon` as an icon-name string rendered through `AIcon`, and it does not expose `autoInsertSpace`.

Official reference:

- https://ant.design/components/button/

## Scope

This slice adds:

- `ButtonIcon = VNodeChild`.
- Renderable `icon` prop support while preserving existing string icon-name behavior.
- Slot precedence for `icon`.
- Numeric `0` icon support.
- `autoInsertSpace` prop, defaulting to `true` to match Ant behavior.
- Automatic spacing for exactly two Chinese characters in the default button content when `autoInsertSpace` is not disabled.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not change size names, color palettes, loading delay semantics, anchor disabled behavior, or semantic part names.

## Behavior

### Icon Rendering

`icon` accepts Vue renderable values (`VNodeChild`). To preserve existing Aheart API compatibility:

- String `icon` values keep rendering through `AIcon` as icon names.
- Non-string renderable values render directly.
- The `icon` slot continues to override the `icon` prop.
- Numeric `0` is treated as meaningful renderable icon content.

The existing `iconPlacement` and `iconPosition` controls keep determining whether the icon is before or after content.

### Auto Insert Space

`autoInsertSpace` defaults to `true`. When enabled and the default slot resolves to exactly one text node containing two Chinese characters, the content renders with one ASCII space between them.

Examples:

- `保存` renders as `保 存`.
- `OK` remains `OK`.
- `默认按钮` remains `默认按钮`.
- Custom nested markup is not transformed.
- `autoInsertSpace={false}` renders `保存` unchanged.

### Existing Behavior

The slice preserves:

- Loading state suppressing normal icons.
- `loadingIcon` slot priority over `loading.icon`.
- Disabled/loading click suppression.
- Link button rendering from `href`.
- Semantic hooks for `root`, `icon`, and `content`.

## API

```ts
export type ButtonIcon = VNodeChild
```

`icon` uses `ButtonIcon`. String values are interpreted as Aheart icon names for backward compatibility.

`autoInsertSpace` is a boolean prop with default `true`.

## Testing

Add Vitest coverage for:

- VNode `icon` prop rendering.
- Numeric `0` `icon` prop rendering.
- `icon` slot overriding renderable prop content.
- Existing string icon-name behavior staying intact.
- Default two-Chinese-character content auto-spacing.
- `autoInsertSpace={false}` preserving original content.
- Non-Chinese and longer text content staying unchanged.

## Documentation

Update `docs/components/button.md` to:

- Show renderable icon examples.
- Show `autoInsertSpace` enabled/disabled examples.
- Document `icon` as `VNodeChild` with string icon-name compatibility.
- Document `autoInsertSpace`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Button icon renderability and `autoInsertSpace`.
- Ambiguity check: string icon compatibility and auto-space text matching rules are explicit.
