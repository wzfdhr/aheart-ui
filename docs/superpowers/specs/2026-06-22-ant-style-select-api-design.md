# Ant Style Select API Design

## Context

The current Select component is a thin native `<select>` wrapper. It supports options, placeholder, multiple mode, status, allowClear, size, and disabled inheritance. Ant Design Select exposes a broader everyday API surface: searchable options, variants, prefix/suffix affordances, not-found content, max selection count, tags mode, and string/number option values.

Official reference:

- https://ant.design/components/select/

## Scope

This slice adds practical Ant-style Select configuration without replacing the component with a full custom popup implementation:

- `SelectValue` accepts `string | number | Array<string | number>`.
- `mode` accepts `multiple` and `tags`; tags mode behaves as an option-backed multi-select in this native-control slice.
- `id` and `name` pass through to the native select.
- `variant` supports `outlined`, `borderless`, `filled`, and `underlined`.
- `bordered={false}` maps to `borderless`.
- `prefix` and `suffixIcon` props plus matching slots render inline adornments.
- `showSearch` renders a search input and filters options by label by default.
- `searchValue` controls the search text when supplied.
- `filterOption` accepts `false` to disable filtering or a predicate for custom filtering.
- `notFoundContent` controls the disabled option shown when filtering has no matches.
- `maxCount` limits emitted values for multiple/tags selection.
- `search` event emits the latest search text.

This slice does not implement a custom popup, async loading, virtualization, `labelInValue`, `fieldNames`, `optionRender`, `placement`, `open`, keyboard popup navigation, or free-form tag creation. Those require a deeper dropdown architecture and should be handled in a later Select rewrite slice.

## Approach

Keep the existing SFC and native select behavior. Extend `types.ts`, render a search input only when `showSearch` is enabled, compute filtered options, and keep value parsing deterministic by mapping native option string values back to the original typed option value.

The component will still render a native select for accessibility and low implementation risk. Visual parity improves through wrapper classes, prefix/suffix affordances, and variant styles. Behavioral parity improves through search filtering, maxCount limiting, tags-mode multi-select behavior, and typed value emission.

## Behavior

- Single mode emits one typed option value.
- Multiple and tags mode emit arrays of typed option values.
- Numeric option values round-trip as numbers by looking up the selected native value in `options`.
- `showSearch` filters by case-insensitive label text unless `filterOption` is `false` or a custom function.
- When filtering removes all options, the native select renders one disabled option with `notFoundContent`.
- `maxCount` caps emitted array values in multiple/tags mode.
- `allowClear` emits `''` for single mode and `[]` for multiple/tags mode, matching the current public behavior.
- `prefix` and `suffixIcon` props render text adornments; slots with the same names override prop text.
- `variant` classes are styling-only and do not change emitted values.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify search filtering, search event, and not-found option.
- Verify variant, bordered false, prefix, suffixIcon, id, name, and number values.
- Verify tags mode and maxCount limiting.
- Run targeted Select tests and typecheck, then full verification.

## Documentation

Update `docs/components/select.md`:

- Add search and variant examples.
- Add tags/maxCount example.
- Expand API rows and event rows.
- Expand SelectOption value type to `string | number`.
