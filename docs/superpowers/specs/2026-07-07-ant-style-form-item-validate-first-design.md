# Ant Style FormItem Validate First Design

## Context

FormItem currently registers item-level rules with Form, and Form submit-time validation collects every failing synchronous rule for a field. Ant Design Form.Item also exposes `validateFirst`, which stops validation reporting at the first failing rule for that field.

Official reference:

- https://ant.design/components/form/

## Scope

This slice adds:

- `validateFirst?: boolean | 'parallel'` on FormItem.
- Field registration carries the FormItem `validateFirst` setting into Form state.
- Submit-time field validation returns only the first error for fields whose item sets `validateFirst`.
- Documentation and generated package output for the new prop.

This slice intentionally does not implement asynchronous validators, true parallel async validation, `validateTrigger`, dependency-driven validation, nested name paths, or automatic child value extraction.

## Behavior

- `validateFirst=false` or omitted preserves current behavior: all failing synchronous rules for a field are collected.
- `validateFirst=true` returns the first failing rule message for that FormItem's field.
- `validateFirst='parallel'` is accepted for Ant-style API compatibility; with the current synchronous rule engine it behaves like first-error reporting.
- Fields defined only through Form `rules` and no FormItem keep all-error collection.
- Existing field registration, unregistration, error rendering, submit, `finishFailed`, and `validate` emissions remain stable.

## Testing

Use Vitest and Vue Test Utils:

- Add a failing test proving a normal field still reports multiple synchronous rule errors.
- Add a failing test proving a FormItem with `validateFirst` reports only the first error and emits that reduced error list through `validate` and `finishFailed`.
- Run focused Form tests, then full package verification.

## Documentation

Update `docs/components/form.md` with:

- A validate-first example.
- A FormItem API row for `validateFirst`.
