# Ant Style Select Form Design

## Goal

Finish the current Data Entry roadmap by adding first-pass Select and Form components.

This slice follows Ant Design's public component shape while keeping behavior focused: Select covers option selection and common state props; Form covers layout, item labels, validation presentation, and ConfigProvider propagation for nested controls.

## References

- Ant Design Select: https://ant.design/components/select/
- Ant Design Form: https://ant.design/components/form/

These references guide API names and documentation structure. Aheart UI keeps independent implementation and styling.

## Scope

Implement:

- Select
- Form
- FormItem

Out of scope:

- Async option loading
- Virtual scrolling
- Search filtering
- Custom dropdown rendering
- Form validation rules engine
- Dependency tracking between fields
- Dynamic field arrays

## Architecture

### Select

Directory:

- `packages/components/src/select/select.vue`
- `packages/components/src/select/types.ts`
- `packages/components/src/select/style.css`
- `packages/components/src/select/index.ts`
- `packages/components/src/select/__tests__/select.test.ts`

Select uses a styled native `select` element for reliability and accessibility in the first slice. It supports single and multiple selection through `modelValue`, `options`, and `mode`.

Props:

- `modelValue?: string | string[]`
- `options?: SelectOption[]`
- `placeholder?: string`
- `size?: AheartSize`
- `disabled?: boolean`
- `status?: 'error' | 'warning'`
- `allowClear?: boolean`
- `mode?: 'multiple'`

Events:

- `update:modelValue`
- `change`
- `clear`

### Form

Directory:

- `packages/components/src/form/form.vue`
- `packages/components/src/form/form-item.vue`
- `packages/components/src/form/types.ts`
- `packages/components/src/form/style.css`
- `packages/components/src/form/index.ts`
- `packages/components/src/form/__tests__/form.test.ts`

`AForm` is a presentational form container that also provides Aheart size and disabled state to descendants by using the existing ConfigProvider context helper.

Props:

- `layout?: 'horizontal' | 'vertical' | 'inline'`
- `labelAlign?: 'left' | 'right'`
- `size?: AheartSize`
- `disabled?: boolean`

Events:

- `submit`

`AFormItem` presents one field row.

Props:

- `label?: string`
- `name?: string`
- `required?: boolean`
- `validateStatus?: 'success' | 'warning' | 'error' | 'validating'`
- `help?: string`
- `extra?: string`
- `hasFeedback?: boolean`

Slots:

- `default`
- `label`
- `help`
- `extra`

## Documentation

Update Data Entry status:

- Select -> Ready
- Form -> Ready

Add VitePress pages:

- `docs/components/select.md`
- `docs/components/form.md`

`Form` docs cover both `AForm` and `AFormItem`.

## Testing

Tests are written before implementation:

- Select render/options/placeholder
- Select update/change events
- Select allowClear
- Select multiple mode
- ConfigProvider size and disabled inheritance
- Form layout and submit event
- FormItem required/help/extra/validation status
- Form disabled/size propagation into nested Input

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
- Scope check: first-pass Select/Form avoid large async, validation, and dynamic-field systems.
- Ambiguity check: Form validation is explicitly visual only in this slice.
