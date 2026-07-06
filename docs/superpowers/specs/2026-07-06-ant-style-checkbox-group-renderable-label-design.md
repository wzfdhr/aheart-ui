# CheckboxGroup Renderable Option Label Design

## Goal

Align `ACheckboxGroup` option labels with Ant-style option APIs by allowing object option `label` values to be Vue renderable nodes, not only strings.

## Current Behavior

`CheckboxOption.label` is typed as `string`. `checkbox-group.vue` passes that value through the child Checkbox `label` prop, so labels render as text only. Primitive options such as `'Plain'` and `2` are normalized to text labels and must keep working.

## Design

`CheckboxOption.label` will use Vue's `VNodeChild` type. `ACheckboxGroup` will render each object option label through the child Checkbox default slot instead of the string-only `label` prop. Primitive options remain normalized to `String(option)` so existing text output and selected-value behavior do not change.

The change is limited to option label rendering. It does not alter group value handling, event payloads, option metadata, disabled behavior, class/style handling, or the standalone Checkbox `label` prop.

## Verification

Add a component test that supplies an option label created with `h('span', ...)`, verifies the nested element renders, and verifies the option remains checked through `defaultValue`. Run focused Checkbox tests, the full component test suite, typecheck, component build, docs build, `git diff --check`, and a demo HTTP check.
