# Ant Style FormItem Label Controls Design

## Context

The Form component already supports form-level `colon` and `labelAlign`, and
FormItem supports renderable labels, help, and extra content. Ant Design also
allows common label controls at the Form.Item level. This slice adds those
local controls without expanding validation or layout-grid behavior.

Official reference:

- https://ant.design/components/form/

## Scope

This slice adds FormItem support for:

- `colon?: boolean` to override the form-level colon setting for one item.
- `htmlFor?: string` to bind the label to a child control id.
- `labelAlign?: 'left' | 'right'` to override form-level label alignment.
- `layout?: 'horizontal' | 'vertical'` to render a single item vertically even
  inside a horizontal form.

This slice intentionally does not add `labelCol`, `wrapperCol`, nested
`NamePath`, dependencies, `Form.List`, async validation, or automatic value
extraction from child controls.

## Behavior

- If FormItem `colon` is omitted, the current form-level colon behavior is
  preserved.
- If FormItem `colon=false`, the label colon is hidden even when the parent Form
  has `colon=true`.
- If FormItem `colon=true`, the label colon is shown even when the parent Form
  has `colon=false`.
- `htmlFor` renders on the FormItem label element.
- `labelAlign` adds deterministic left/right item classes so a single item can
  override the parent form alignment.
- `layout="vertical"` adds the existing vertical item class and uses current
  vertical CSS.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify item-level colon false and true override parent form state.
- Verify `htmlFor` renders on the label.
- Verify item-level label alignment classes render.
- Verify item-level vertical layout class renders.
- Run focused Form tests, then package typecheck and build checks.

## Documentation

Update `docs/components/form.md` with:

- A FormItem label controls example.
- FormItem API rows for `colon`, `htmlFor`, `labelAlign`, and `layout`.
