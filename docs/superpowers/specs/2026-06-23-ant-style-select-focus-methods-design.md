# Ant Style Select Focus Methods Design

## Context

`ASelect` already supports single and multi-value selection, search, field name mapping, local filtering, filtering sort, variants, prefix/suffix affordances, loading and clear icons, ConfigProvider size/disabled fallback, and semantic class/style hooks.

Ant Design Select documents focus-related callbacks and imperative methods: `onFocus`, `onBlur`, `focus()`, and `blur()`. The current Aheart implementation renders a native `<select>` plus an optional search input, but it does not emit focus events or expose component instance methods for focus control.

Official reference:

- https://ant.design/components/select/

## Scope

This slice adds:

- `focus` and `blur` events emitted from the native focusable Select controls.
- `focus()` and `blur()` methods exposed from the component instance.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not add dropdown open state, virtual list behavior, option groups, label-in-value, token separators, custom tag rendering, dropdown rendering, or popup placement behavior.

## Behavior

### Focus Events

`ASelect` emits:

```ts
focus: (event: FocusEvent) => void
blur: (event: FocusEvent) => void
```

The events come from the native `<select>` control and, when `showSearch` is enabled, the native search input as well.

### Imperative Methods

The component exposes:

```ts
focus: () => void
blur: () => void
```

`focus()` targets the search input when `showSearch` is enabled so users can type immediately. Without `showSearch`, it targets the native `<select>` control. `blur()` removes focus from both possible internal focus targets.

### Existing Behavior

The slice preserves:

- Controlled and uncontrolled value behavior.
- Single, `multiple`, and `tags` mode value mapping.
- `allowClear`, `clear`, `search`, and `change` payloads.
- `fieldNames`, `optionFilterProp`, `filterOption`, and `filterSort` behavior.
- ConfigProvider size and disabled fallback.
- Semantic hooks for root, prefix, search, selector, option, notFound, clear, suffix, and loading.

## Testing

Add Vitest coverage for:

- Native selector `focus` and `blur` event emission.
- Exposed `focus()` method moving focus to the native select in normal mode.
- Exposed `blur()` method removing focus from the native select.
- Exposed `focus()` method moving focus to the search input when `showSearch` is enabled.
- Existing value change behavior staying intact.

The RED tests should fail before implementation because `ASelect` does not emit focus/blur and does not expose `focus` or `blur`.

## Documentation

Update `docs/components/select.md` to:

- Add a focus controls demo using a ref.
- Document `focus` and `blur` events.
- Add a Methods section listing `focus()` and `blur()`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Select focus APIs only.
- Ambiguity check: focus targets for searchable and non-searchable modes are explicit.
