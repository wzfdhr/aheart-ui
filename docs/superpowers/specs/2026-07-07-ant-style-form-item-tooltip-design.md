# Ant Style FormItem Tooltip Design

## Context

FormItem already supports renderable labels plus local label controls. Ant
Design also allows a `tooltip` prompt next to the label. Aheart already has a
Tooltip component, so this slice reuses that primitive instead of adding custom
floating behavior inside FormItem.

Official reference:

- https://ant.design/components/form/

## Scope

This slice adds FormItem `tooltip` support:

- `tooltip="text"` renders a label-adjacent tooltip trigger with that text as
  the tooltip title.
- `tooltip={ title, icon, ...tooltipProps }` renders the configured title,
  optional custom trigger icon, and forwards supported Tooltip props such as
  `placement`, `open`, `trigger`, `color`, `arrow`, and semantic class/style
  hooks.
- A string, number, VNode, or function tooltip value is treated as the tooltip
  title.

This slice intentionally does not implement Form-level tooltip defaults,
accessibility ids between labels and popup content, or async validation
prompts.

## Behavior

- The tooltip only renders when FormItem has a label slot or label prop.
- Empty tooltip values (`undefined`, `null`, `false`, empty string, empty
  arrays) render nothing.
- `0` remains valid tooltip content.
- Object values that look like Vue VNodes are rendered as title content rather
  than treated as config objects.
- Config object `icon` overrides the default `?` trigger text.
- Config object `title` can be a VNode or function, matching the existing
  Tooltip title contract.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify string tooltip renders a FormItem tooltip trigger and can reveal its
  title.
- Verify config object title and custom icon render.
- Verify numeric `0` renders while empty tooltip values do not.
- Run focused Form tests, then full package verification.

## Documentation

Update `docs/components/form.md` with:

- A FormItem tooltip example.
- A FormItem API row for `tooltip`.
- A compact `FormItemTooltip` type section.
