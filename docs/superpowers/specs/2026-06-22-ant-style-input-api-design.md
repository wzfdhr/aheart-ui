# Ant Style Input API Design

## Goal

Improve Ant Design API parity for the core Data Entry input primitives: Input, Textarea, and InputNumber.

These components are already Ready, but their configuration surface is still missing common Ant-style props used in product forms. This slice expands configuration while preserving current Aheart UI behavior and existing docs examples.

## References

- Ant Design Input: https://ant.design/components/input/
- Ant Design InputNumber: https://ant.design/components/input-number/

The references guide prop names and documentation structure. Aheart UI keeps an independent Vue implementation and does not add Ant's separate Password, Search, or OTP subcomponents in this slice.

## Scope

Implement:

- Input `prefix` and `suffix` string props in addition to existing slots
- Input `addonBefore` and `addonAfter`
- Input `variant="outlined" | "borderless" | "filled" | "underlined"`
- Input `bordered` compatibility alias
- Input `readOnly`
- Input `id`
- Input `pressEnter` event
- Textarea `allowClear`
- Textarea `variant`
- Textarea `bordered`
- Textarea `readOnly`
- Textarea `id`
- Textarea `autoSize` object form with `minRows` and `maxRows`
- Textarea `clear` and `pressEnter` events
- InputNumber `prefix` and `suffix`
- InputNumber `status`
- InputNumber `variant`
- InputNumber `bordered`
- InputNumber `readOnly`
- InputNumber `id`
- InputNumber `formatter`
- InputNumber `parser`
- InputNumber `precision`
- InputNumber `keyboard`
- InputNumber `pressEnter` and `step` events

Out of scope:

- Input Password, Search, Group, Compact, and OTP subcomponents
- Input `count` object strategy with formatter/exceed handling
- Textarea custom count formatter
- InputNumber stringMode and BigInt precision behavior
- InputNumber changeOnWheel and changeOnBlur
- InputNumber custom controls icons

## Architecture

### Input

Files:

- `packages/components/src/input/types.ts`
- `packages/components/src/input/input.vue`
- `packages/components/src/input/style.css`
- `packages/components/src/input/__tests__/input.test.ts`
- `docs/components/input.md`

Input keeps the existing wrapper and native input. Addon wrappers are rendered outside the core input shell. Prefix and suffix props are rendered next to slot content, with slots taking priority when both exist.

New props:

- `prefix?: string`
- `suffix?: string`
- `addonBefore?: string`
- `addonAfter?: string`
- `variant?: InputVariant`
- `bordered?: boolean`
- `readOnly?: boolean`
- `id?: string`

New event:

- `pressEnter`

### Textarea

Files:

- `packages/components/src/textarea/types.ts`
- `packages/components/src/textarea/textarea.vue`
- `packages/components/src/textarea/style.css`
- `packages/components/src/textarea/__tests__/textarea.test.ts`
- `docs/components/textarea.md`

Textarea keeps the existing native textarea and count overlay. `autoSize` object form maps to CSS custom properties for min/max height based on row count.

New props:

- `allowClear?: boolean`
- `variant?: TextareaVariant`
- `bordered?: boolean`
- `readOnly?: boolean`
- `id?: string`
- `autoSize?: boolean | { minRows?: number; maxRows?: number }`

New events:

- `clear`
- `pressEnter`

### InputNumber

Files:

- `packages/components/src/input-number/types.ts`
- `packages/components/src/input-number/input-number.vue`
- `packages/components/src/input-number/style.css`
- `packages/components/src/input-number/__tests__/input-number.test.ts`
- `docs/components/input-number.md`

InputNumber keeps numeric model values. Formatter affects display only; parser turns typed strings back into numeric input before clamping and precision normalization. Step buttons emit both `change` and `step`.

New props:

- `prefix?: string`
- `suffix?: string`
- `status?: 'error' | 'warning'`
- `variant?: InputNumberVariant`
- `bordered?: boolean`
- `readOnly?: boolean`
- `id?: string`
- `formatter?: (value: number | undefined) => string`
- `parser?: (displayValue: string) => number | undefined`
- `precision?: number`
- `keyboard?: boolean`

New events:

- `pressEnter`
- `step`

## Behavior

- `bordered=false` maps to `variant="borderless"` unless an explicit `variant` is provided.
- `variant` class names are deterministic across Input, Textarea, and InputNumber.
- `readOnly` sets native `readonly` and suppresses clear/step edits where applicable.
- Pressing Enter emits `pressEnter`.
- Input addon wrappers are rendered only when addon props are present.
- Textarea clear emits `update:modelValue`, `input`, and `clear`.
- Textarea `autoSize` object sets CSS min/max heights using `minRows` and `maxRows`.
- InputNumber formatter controls displayed text; parser is used for typed input.
- InputNumber precision rounds typed and stepped values.
- InputNumber `keyboard=false` ignores ArrowUp and ArrowDown.

## Documentation

Update:

- `docs/components/input.md`
- `docs/components/textarea.md`
- `docs/components/input-number.md`

The pages add demos and API rows for the new Ant-style props and events.

## Testing

Tests are written before implementation:

- Input renders addon, prefix/suffix props, variant, borderless alias, readonly, id, and pressEnter.
- Textarea clears when allowClear is enabled, applies autoSize object styles, variant, readonly, id, and pressEnter.
- InputNumber renders prefix/suffix, status, variant, readonly, id, formatted display, parsed input, precision, keyboard suppression, and step events.

Full verification:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this slice covers Input, Textarea, and InputNumber configuration parity only.
- Ambiguity check: Ant-style props take precedence over compatibility aliases where both exist.
