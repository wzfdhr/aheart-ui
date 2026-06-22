# Ant Style Data Entry Primitives Design

## Goal

Add the first Data Entry component slice for Aheart UI, following Ant Design's documentation structure and API spirit while keeping the implementation small enough to ship and verify in one batch.

This slice turns the basic input controls in the component overview from roadmap entries into real, documented, installable components.

## References

- Ant Design Input: https://ant.design/components/input/
- Ant Design InputNumber: https://ant.design/components/input-number/
- Ant Design Checkbox: https://ant.design/components/checkbox/
- Ant Design Radio: https://ant.design/components/radio/
- Ant Design Switch: https://ant.design/components/switch/

These references guide naming, examples, and expected control behavior. Aheart UI keeps its own implementation, CSS class names, and documentation wording.

## Scope

Implement these six components:

- Input
- Textarea
- InputNumber
- Checkbox
- Radio
- Switch

Out of scope for this slice:

- Form validation and field layout
- Select, DatePicker, TimePicker, Cascader, Upload, Transfer, TreeSelect
- Checkbox.Group and Radio.Group abstractions
- Input.Search, Input.Password, OTP, and addon composition
- Async or overlay behavior

Those pieces should build on this slice later.

## Architecture

Each component follows the established Aheart structure:

- `packages/components/src/<component>/<component>.vue`
- `packages/components/src/<component>/types.ts`
- `packages/components/src/<component>/style.css`
- `packages/components/src/<component>/index.ts`
- `packages/components/src/<component>/__tests__/<component>.test.ts`

The package root imports each component, registers it in the default plugin, and exports it by name.

All components use Vue 3 `v-model` conventions:

- Input, Textarea: `modelValue?: string`
- InputNumber: `modelValue?: number`
- Checkbox, Radio, Switch: `modelValue?: boolean` for simple use

Local props override ConfigProvider. Global disabled applies to every input component. Global size applies to components with visual control height: Input, Textarea, InputNumber, and Switch.

## Component APIs

### Input

Props:

- `modelValue?: string`
- `placeholder?: string`
- `size?: AheartSize`
- `disabled?: boolean`
- `status?: 'error' | 'warning'`
- `allowClear?: boolean`
- `maxlength?: number`
- `showCount?: boolean`
- `type?: string`

Events:

- `update:modelValue`
- `input`
- `change`
- `clear`

Slots:

- `prefix`
- `suffix`

### Textarea

Props:

- `modelValue?: string`
- `placeholder?: string`
- `rows?: number`
- `disabled?: boolean`
- `status?: 'error' | 'warning'`
- `maxlength?: number`
- `showCount?: boolean`
- `autoSize?: boolean`

Events:

- `update:modelValue`
- `input`
- `change`

### InputNumber

Props:

- `modelValue?: number`
- `placeholder?: string`
- `size?: AheartSize`
- `disabled?: boolean`
- `min?: number`
- `max?: number`
- `step?: number`
- `controls?: boolean`

Events:

- `update:modelValue`
- `change`

InputNumber clamps values to `min` and `max` when a value is present. Empty input emits `undefined` so consumers can distinguish no value from zero.

### Checkbox

Props:

- `modelValue?: boolean`
- `disabled?: boolean`
- `indeterminate?: boolean`
- `label?: string`

Events:

- `update:modelValue`
- `change`

Slots:

- `default`

### Radio

Props:

- `modelValue?: boolean`
- `disabled?: boolean`
- `label?: string`
- `name?: string`

Events:

- `update:modelValue`
- `change`

Slots:

- `default`

This slice implements a single radio control. Grouped value management can be added later as `RadioGroup` or through the existing `Radio` docs when the component list grows.

### Switch

Props:

- `modelValue?: boolean`
- `disabled?: boolean`
- `loading?: boolean`
- `size?: AheartSize`
- `checkedChildren?: string`
- `unCheckedChildren?: string`

Events:

- `update:modelValue`
- `change`

Switch renders a `button` with `role="switch"` and `aria-checked`.

## Styling

Styles use existing `aheart-` CSS variables:

- text, secondary text, border, fill, background
- primary, warning, danger
- control heights and spacing
- radius, motion, focus outline

Visual tone should match existing components: compact, readable, bordered, and suitable for product interfaces.

## Documentation

For each Ready component:

- Add `docs/components/<component>.md`
- Update `docs/.vitepress/data/components.ts`
- Update `docs/.vitepress/config.ts`
- Include examples, API table, events, slots where applicable, and theme token notes

## Testing

Tests are written before implementation and must cover:

- Default rendering and semantic element
- `v-model` update event
- ConfigProvider disabled inheritance
- ConfigProvider size inheritance where applicable
- Component-specific behavior:
  - Input clear and count
  - Textarea rows/count
  - InputNumber clamp and controls
  - Checkbox indeterminate
  - Radio checked behavior
  - Switch role, loading, and labels

Full verification gate:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment when plain `pnpm` is unavailable.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this slice is focused on primitive controls and avoids larger data-entry systems.
- Ambiguity check: single-control Checkbox and Radio are explicitly separated from future group abstractions.
