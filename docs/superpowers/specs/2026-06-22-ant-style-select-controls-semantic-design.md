# Ant Style Select Controls And Semantic API Design

Date: 2026-06-22

## Context

`ASelect` already has the first practical Ant-style API slice: native select rendering, typed string/number values, `mode="multiple"`, `mode="tags"`, variants, search, `filterOption`, `notFoundContent`, prefix/suffix affordances, and `maxCount`. The next parity gap is Ant Select's configuration and semantic styling surface that can fit the current native-select architecture.

Reference: Ant Design Select documentation, `https://ant.design/components/select/`.

## Goals

- Preserve current native select behavior and all existing public props.
- Add root and semantic styling hooks:
  - `className`
  - `rootClassName`
  - `style`
  - `classNames`
  - `styles`
- Add option data remapping:
  - `fieldNames`
- Add search control refinements:
  - `optionFilterProp`
  - `filterSort`
- Add uncontrolled initial value support:
  - `defaultValue`
- Add loading affordances:
  - `loading`
  - `loadingIcon`
  - `loadingIcon` slot
- Expand clear affordance:
  - `allowClear` as `boolean | { clearIcon?: VNodeChild }`
  - `clearIcon` slot

## Non Goals

- Custom popup rendering.
- `open`, `defaultOpen`, `placement`, `popupRender`, virtual scroll, or portal behavior.
- `labelInValue`, `optionRender`, `tagRender`, `labelRender`, or free-form tag creation.
- Option groups or nested `fieldNames.options`.

## Public API

```ts
export type SelectAllowClear = boolean | { clearIcon?: VNodeChild }
export type SelectSemanticPart =
  | 'root'
  | 'prefix'
  | 'search'
  | 'selector'
  | 'option'
  | 'notFound'
  | 'clear'
  | 'suffix'
  | 'loading'

export type SelectClassNames = Partial<Record<SelectSemanticPart, string>>
export type SelectStyles = Partial<Record<SelectSemanticPart, StyleValue>>

export interface SelectFieldNames {
  label?: string
  value?: string
  disabled?: string
}

export interface SelectFilterSortInfo {
  searchValue: string
}

export type SelectFilterSort = (optionA: SelectOption, optionB: SelectOption, info: SelectFilterSortInfo) => number
```

`SelectProps` additions:

| Prop | Type | Default |
| --- | --- | --- |
| `defaultValue` | `SelectValue` | - |
| `fieldNames` | `SelectFieldNames` | `{ label: 'label', value: 'value', disabled: 'disabled' }` |
| `optionFilterProp` | `string` | `label` |
| `filterSort` | `SelectFilterSort` | - |
| `loading` | `boolean` | `false` |
| `loadingIcon` | `VNodeChild` | - |
| `className` | `string` | - |
| `rootClassName` | `string` | - |
| `style` | `StyleValue` | - |
| `classNames` | `SelectClassNames` | `{}` |
| `styles` | `SelectStyles` | `{}` |

`allowClear` changes from `boolean` to `SelectAllowClear`.

## Behavior

- `modelValue` remains controlled when supplied.
- `defaultValue` initializes internal value when `modelValue` is not supplied.
- Selection changes update internal value for uncontrolled usage and still emit `update:modelValue` and `change`.
- `fieldNames` maps raw option records into `{ label, value, disabled }`.
- `optionFilterProp` controls which raw option field is used for default filtering. It supports remapped fields and custom raw option keys.
- `filterSort` sorts filtered options and receives the current search text.
- `loading` applies a loading class and renders a loading icon next to the suffix area.
- `loadingIcon` prop or slot replaces the default loading dot.
- `allowClear` object controls the clear icon while preserving current boolean behavior.
- `className` and `rootClassName` append to the root.
- Semantic hooks apply to root, prefix, search input, native select, options, not-found option, clear button, suffix, and loading icon.

## Verification

- Add RED tests for semantic classes/styles.
- Add RED tests for `fieldNames`, `optionFilterProp`, and `filterSort`.
- Add RED tests for `defaultValue` uncontrolled state.
- Add RED tests for `loading` and custom loading icon.
- Add RED tests for `allowClear.clearIcon` and `clearIcon` slot.
- Run focused Select tests for RED and GREEN.
- Run component typecheck.
- Update docs and generated `es` / `lib` outputs.
- Run full verification before closing the slice.
