# Ant Style Checkbox Focus Methods Design

## Context

`ACheckbox` already supports `checked`, `defaultChecked`, `indeterminate`, ConfigProvider disabled fallback, group value aliases, option metadata, and semantic class/style hooks.

Ant Design Checkbox documents focus-related callbacks and imperative methods: `onFocus`, `onBlur`, `focus()`, `blur()`, and `nativeElement`. The current Aheart implementation only emits value changes and does not expose focus controls.

Official reference:

- https://ant.design/components/checkbox/

## Scope

This slice adds:

- `focus` and `blur` events emitted from the native checkbox input.
- `focus()` and `blur()` methods exposed from the component instance.
- `nativeElement` exposed from the component instance, returning the root label element.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not change CheckboxGroup option typing, label rendering, checked state priority, disabled behavior, or semantic part names.

## Behavior

### Focus Events

`ACheckbox` emits:

```ts
focus: (event: FocusEvent) => void
blur: (event: FocusEvent) => void
```

The events come directly from the native `<input type="checkbox">`.

### Imperative Methods

The component exposes:

```ts
focus: () => void
blur: () => void
nativeElement: HTMLLabelElement | undefined
```

`focus()` and `blur()` operate on the native input so keyboard and screen-reader focus land on the actual form control. `nativeElement` returns the root `<label>` wrapper to match the component-level DOM node concept.

### Existing Behavior

The slice preserves:

- `checked` over `modelValue` controlled priority.
- Uncontrolled state initialized from `defaultChecked`.
- `change`, `update:modelValue`, and `update:checked` payloads.
- CheckboxGroup option rendering and update behavior.
- ConfigProvider disabled fallback.
- Semantic hooks for `root`, `icon`, and `label`.

## Testing

Add Vitest coverage for:

- Native input `focus` and `blur` events.
- Exposed `focus()` method moving focus to the native input.
- Exposed `blur()` method removing focus from the native input.
- Exposed `nativeElement` pointing to the root label.
- Existing change behavior staying intact.

## Documentation

Update `docs/components/checkbox.md` to:

- Add a focus controls demo using a ref.
- Document `focus` and `blur` events.
- Add a Methods section listing `focus()`, `blur()`, and `nativeElement`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Checkbox focus APIs only.
- Ambiguity check: input focus target and root `nativeElement` target are explicit.
