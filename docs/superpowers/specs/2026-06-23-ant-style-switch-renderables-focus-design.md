# Ant Style Switch Renderables and Focus Design

## Context

`ASwitch` already supports boolean state through `modelValue`, Ant-style `checked` and `value` aliases, uncontrolled `defaultChecked` and `defaultValue`, loading/disabled states, size fallback, checked and unchecked slots, and semantic class/style hooks.

Ant Design Switch documents `checkedChildren` and `unCheckedChildren` as renderable node content, plus `autoFocus` and imperative `focus()` / `blur()` methods. The current Aheart implementation keeps `checkedChildren` and `unCheckedChildren` as strings and does not expose focus controls.

Official reference:

- https://ant.design/components/switch/

## Scope

This slice adds:

- `SwitchRenderable = VNodeChild`.
- Renderable `checkedChildren` and `unCheckedChildren` props.
- Slot precedence for `checkedChildren` and `unCheckedChildren`.
- Numeric `0` support for checked and unchecked content.
- `autoFocus` prop that focuses the root switch button after mount.
- `focus()` and `blur()` methods exposed from the component instance.
- Tests, docs, and generated `es` / `lib` outputs.

This slice does not change the existing controlled/uncontrolled priority, loading behavior, size token mapping, semantic part names, or visual shape of the switch.

## Behavior

### Renderable Children

`checkedChildren` and `unCheckedChildren` accept Vue renderable values (`VNodeChild`). Existing string values render exactly as before. Slots keep current behavior and take precedence over matching props:

1. `checkedChildren` slot over `checkedChildren`.
2. `unCheckedChildren` slot over `unCheckedChildren`.

Renderable values follow the same presence rules used by recent Input/InputNumber work: `undefined`, `null`, `false`, `true`, and empty strings do not create meaningful content; numeric `0`, VNodes, arrays, and non-empty strings render.

### Focus Controls

`autoFocus` focuses the root `<button role="switch">` after mount. The component exposes:

```ts
focus: () => void
blur: () => void
```

The exposed methods operate on the root button and do not emit change/click events.

### Existing Behavior

The slice preserves:

- `checked` > `value` > `modelValue` controlled priority.
- Uncontrolled state initialized from `defaultChecked` or `defaultValue`.
- Disabled and loading click suppression.
- `update:modelValue`, `update:checked`, `update:value`, `change`, and `click` event payloads.
- ConfigProvider size and disabled fallback.
- Semantic hooks for `root`, `indicator`, and `content`.

## API

```ts
export type SwitchRenderable = VNodeChild
```

`checkedChildren` and `unCheckedChildren` use `SwitchRenderable`.

`autoFocus` is a boolean prop.

## Testing

Add Vitest coverage for:

- VNode `checkedChildren` and `unCheckedChildren` props.
- Slots overriding renderable checked/unchecked props.
- Numeric `0` checked/unchecked content.
- `autoFocus` focusing the root switch button.
- Exposed `focus()` and `blur()` methods.

## Documentation

Update `docs/components/switch.md` to:

- Show renderable checked/unchecked content.
- Show focus method usage.
- Document `VNodeChild` prop types and `autoFocus`.
- Add a Methods section for `focus()` and `blur()`.

## Self-Review

- Placeholder scan: no unfinished placeholders.
- Scope check: focused on Switch renderable content and official focus controls.
- Ambiguity check: slot precedence, meaningful renderable values, and focus target are explicit.
