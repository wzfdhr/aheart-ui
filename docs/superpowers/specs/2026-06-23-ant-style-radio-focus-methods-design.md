# Ant Style Radio Focus Methods Design

## Context

`ARadio` already supports controlled and uncontrolled checked state, ConfigProvider disabled fallback, grouped values, option metadata, button-style groups, and semantic class/style hooks.

Ant Design Radio documents imperative methods for the single Radio component: `focus()` and `blur()`. The current Aheart implementation renders the native radio input but does not expose component instance methods for focusing or blurring that input.

Official reference:

- https://ant.design/components/radio/

## Scope

This slice adds:

- `focus()` and `blur()` methods exposed from the `ARadio` component instance.
- Tests proving the methods operate on the native radio input.
- Documentation and generated `es` / `lib` outputs.

This slice does not add focus or blur events because the current Ant Radio Methods section only documents imperative methods. It also does not change RadioGroup option typing, `optionType`, `buttonStyle`, disabled behavior, checked-state priority, or semantic part names.

## Behavior

### Imperative Methods

The component exposes:

```ts
focus: () => void
blur: () => void
```

`focus()` and `blur()` operate on the native `<input type="radio">` so keyboard and assistive-technology focus land on the actual form control.

### Existing Behavior

The slice preserves:

- `checked` over `modelValue` controlled priority.
- Uncontrolled state initialized from `defaultChecked`.
- `change`, `update:modelValue`, and `update:checked` payloads.
- RadioGroup option rendering and update behavior.
- ConfigProvider disabled fallback.
- Semantic hooks for `root`, `icon`, and `label`.

## Testing

Add Vitest coverage for:

- Exposed `focus()` moving document focus to the native radio input.
- Exposed `blur()` removing document focus from the native radio input.
- Existing change behavior staying intact.

The RED test should fail before implementation because the component instance does not expose `focus` or `blur`.

## Documentation

Update `docs/components/radio.md` to:

- Add a focus controls demo using a component ref.
- Add a Methods section listing `focus()` and `blur()`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Radio focus methods only.
- Ambiguity check: native input focus target is explicit.
