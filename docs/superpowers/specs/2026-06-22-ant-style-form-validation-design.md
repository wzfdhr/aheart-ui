# Ant Style Form Validation API Design

## Context

The current Form component handles layout and propagates size/disabled state. Ant Design Form is more than layout: it coordinates a model, rules, field status, submit success/failure callbacks, required marks, colon rendering, and visual variants for child controls. This slice adds the core synchronous validation contract while preserving the existing visual Form and FormItem behavior.

Official reference:

- https://ant.design/components/form/

## Scope

This slice adds:

- `model` on Form as a flat record of field values.
- `rules` on Form as a record keyed by FormItem `name`.
- FormItem-level `rules` that merge with Form-level rules.
- Synchronous rule support for `required`, `message`, `type`, `min`, `max`, `len`, and `pattern`.
- `finish` event on successful submit with model values.
- `finishFailed` event on failed submit with `{ values, errorFields }`.
- `validate` event per failed field with field name and error messages.
- `requiredMark`, `colon`, and `variant` Form props.
- FormItem automatic `required` mark and validation status/help derived from rules/errors, while explicit `required`, `validateStatus`, and `help` props still override visual output.
- `validate()` and `clearValidate()` exposed from Form for programmatic use.

This slice intentionally does not implement async validators, nested name paths, dependencies, `Form.List`, scroll management, transform/normalize, `validateTrigger`, or automatic child value extraction. Consumers continue to own input `v-model` and pass the same values through `model`.

## Approach

Use a lightweight provide/inject context between Form and FormItem. Form owns registered field metadata, runs synchronous validators against `model`, stores error state by field name, and provides helpers for FormItem rendering. FormItem registers its `name` and local `rules`, then computes derived required/status/help from the context.

The implementation keeps files small:

- `types.ts` defines form rule and validation result types.
- `form.vue` manages field registration, validation, submit events, and config inheritance.
- `form-item.vue` derives visual state from context.
- `style.css` adds classes for required mark modes, colon, variants, and error help visibility.

## Behavior

- Submit always emits the existing `submit` event for backward compatibility.
- If validation passes, submit emits `finish` with a shallow copy of `model`.
- If validation fails, submit emits `finishFailed` with current values and ordered error fields.
- A missing, empty string, empty array, `null`, or `undefined` value fails `required`.
- `type: 'email'` checks a simple email pattern.
- `type: 'number'` checks `typeof value === 'number'`.
- `min`, `max`, and `len` apply to string/array length and number value.
- `pattern` accepts `RegExp`.
- The first error message is rendered as FormItem help when no explicit help slot/prop is supplied.
- `requiredMark=false` hides automatic required marks; `requiredMark="optional"` shows an optional marker on non-required labeled items.
- `colon=false` removes label colon styling.
- `variant` is provided through the same ConfigProvider-style context used by controls that consume variants later; for now Form adds deterministic variant classes and docs.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify failed submit renders FormItem error, emits `finishFailed`, and does not emit `finish`.
- Verify successful submit emits `finish`.
- Verify FormItem local rules merge with Form rules and automatic required mark works.
- Verify `requiredMark="optional"`, `colon=false`, and `variant` classes render.
- Run targeted Form tests and typecheck, then full verification.

## Documentation

Update `docs/components/form.md`:

- Add model/rules validation example.
- Add submit success/failure event docs.
- Add requiredMark, colon, variant, model, rules API rows.
- Add FormRule and FormValidationError tables.
- Document exposed `validate` and `clearValidate` methods.
