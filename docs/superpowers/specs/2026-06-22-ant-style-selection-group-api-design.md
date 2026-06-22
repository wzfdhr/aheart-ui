# Ant Style Selection Group API Design

## Context

The Data Entry components are marked Ready, but Checkbox and Radio still only expose standalone boolean controls. Ant Design treats grouped selection as a first-class API through `Checkbox.Group` and `Radio.Group`, with options-driven rendering, disabled propagation, shared `name`, layout controls, and group-level change events. The current Radio docs explicitly note grouped value management as future work, so this slice removes that gap without changing the existing standalone component contract.

Official references:

- https://ant.design/components/checkbox/
- https://ant.design/components/radio/

## Scope

This slice adds:

- `ACheckboxGroup` for `modelValue: CheckboxValue[]`, `options`, `disabled`, `name`, and horizontal/vertical layout.
- `ARadioGroup` for `modelValue: RadioValue`, `options`, `disabled`, `name`, horizontal/vertical layout, `optionType="button"`, `buttonStyle`, `size`, and `block`.
- Shared value types that allow `string`, `number`, or `boolean`, matching Ant's option value shape.
- Tests, docs, exports, and build outputs for the new group components.

This slice does not add `Checkbox.Group` as a dotted runtime property, `Radio.Button` as a separate component, deeply nested custom option content, or Form validation integration. Those can be handled in later passes if the library needs exact dotted API ergonomics or richer Form binding.

## Approach

Keep the standalone `ACheckbox` and `ARadio` behavior intact. Add sibling group SFCs inside each component directory and register them as `ACheckboxGroup` and `ARadioGroup` through the existing plugin installation system. This follows the local pattern used by components with named exports such as `FormItem`, `Row`, `Col`, and Typography subcomponents.

`ACheckboxGroup` renders `ACheckbox` for each option and owns the array update logic. `ARadioGroup` renders regular radios in default mode and compact button labels in `optionType="button"` mode. Group-level `disabled` resolves through `ConfigProvider`; option-level disabled still wins for individual items.

## Behavior

### Checkbox Group

- `modelValue` defaults to an empty array for rendering decisions.
- Clicking an unchecked option appends its value.
- Clicking a checked option removes its value.
- The group emits `update:modelValue` and `change` with the next array.
- `disabled` from props or `ConfigProvider` disables every option.
- `name` is forwarded to every native checkbox input.
- `direction="vertical"` stacks options; default is horizontal.

### Radio Group

- The selected option is the one whose value strictly equals `modelValue`.
- Selecting an option emits `update:modelValue` and `change` with that option value.
- Disabled groups and disabled options do not emit changes through user interaction.
- `name` is forwarded to every native radio input.
- `direction="vertical"` stacks regular radios.
- `optionType="button"` renders segmented button-like radios.
- `buttonStyle="solid"` gives the selected button a filled primary treatment.
- `block` makes button groups span the available width.
- `size` accepts the existing `large | middle | small` size values and falls back to `ConfigProvider`.

## Testing

Use Vitest and Vue Test Utils:

- Add failing tests before source changes.
- Verify CheckboxGroup renders checked/disabled/name/layout state and emits array updates.
- Verify RadioGroup renders selected/button/block/size/name state and emits scalar updates.
- Verify both groups inherit disabled from ConfigProvider.
- Run targeted tests for checkbox and radio, then full typecheck/test/build/docs build before final commit.

## Documentation

Update `docs/components/checkbox.md` and `docs/components/radio.md`:

- Add group examples.
- Add group API tables and option type tables.
- Remove the Radio wording that grouped value management is future work.
- Mention button-style RadioGroup mode.
