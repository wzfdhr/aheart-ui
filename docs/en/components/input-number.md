# InputNumber <span class="aheart-status aheart-status--ready">Ready</span>

InputNumber captures numeric values with min, max, step, controls, precision, formatter/parser hooks, blur-time commit control, variants, status, and size inheritance.

<script setup lang="ts">
import { h } from 'vue'
const inputNumberClassNames = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  root: 'demo-input-number-semantic-root',
  input: 'demo-input-number-control',
  prefix: 'demo-input-number-prefix',
  suffix: 'demo-input-number-suffix',
  actions: 'demo-input-number-actions',
  action: props.readOnly ? 'demo-input-number-action-readonly' : 'demo-input-number-action'
})
const inputNumberStyles = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  prefix: { color: 'var(--aheart-color-primary)' },
  action: { color: props.readOnly ? 'var(--aheart-color-text-secondary)' : 'var(--aheart-color-warning)' }
})
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :model-value="4" :min="1" :max="10" />
    <AInputNumber :default-value="6" />
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <AInputNumber :model-value="4" :min="1" :max="10" />
    <AInputNumber :default-value="6" />
  </ASpace>
</template>
```

## Stepping

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :model-value="2" :step="2" />
    <AInputNumber :model-value="1" step="0.5" />
    <AInputNumber :model-value="12.345" :precision="2" prefix="$" suffix="USD" />
    <AInputNumber
      :model-value="88"
      :prefix="h('strong', { class: 'demo-input-number-node' }, '$')"
      :suffix="h('span', { class: 'demo-input-number-node' }, 'USD')"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
<ASpace>
    <AInputNumber :model-value="2" :step="2" />
    <AInputNumber :model-value="1" step="0.5" />
    <AInputNumber :model-value="12.345" :precision="2" prefix="$" suffix="USD" />
    <AInputNumber
      :model-value="88"
      :prefix="h('strong', { class: 'demo-input-number-node' }, '$')"
      :suffix="h('span', { class: 'demo-input-number-node' }, 'USD')"
    />
  </ASpace>
</template>
```

Decimal stepping uses decimal arithmetic so common floating-point errors such as `0.2 + 0.1` do not affect emitted values.
When `precision` is omitted, display precision is inferred from the decimal places in the current value and `step`.
After a valid step, the input keeps focus so keyboard entry and arrow-key adjustments can continue.
When the current value reaches `max` or `min`, stepping in that direction is disabled and ignored.

## Variants and Status

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInputNumber :model-value="8" status="warning" />
    <AInputNumber :model-value="8" variant="filled" />
    <AInputNumber :model-value="8" variant="underlined" />
    <AInputNumber :model-value="8" :bordered="false" />
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical" style="width: 100%">
    <AInputNumber :model-value="8" status="warning" />
    <AInputNumber :model-value="8" variant="filled" />
    <AInputNumber :model-value="8" variant="underlined" />
    <AInputNumber :model-value="8" :bordered="false" />
  </ASpace>
</template>
```

## Formatting and Parsing

```vue
<script setup lang="ts">
import { ref } from 'vue'

const amount = ref(0)
const formatter = (value?: number, info?: { userTyping: boolean; input: string }) =>
  value === undefined ? '' : `$ ${info?.input ?? value}`
const parser = (value: string) => Number(value.replace('$', '').trim())
</script>

<template>
  <AInputNumber v-model="amount" :formatter="formatter" :parser="parser" />
</template>
```

Without a `parser`, the default parser removes currency symbols, grouping separators, and other formatting characters, and treats the full-width period `。` as a decimal point.

## Decimal Separator

<div class="aheart-demo-panel">
  <AInputNumber :model-value="12.5" decimal-separator="," />
</div>

```vue
<template>
<AInputNumber :model-value="12.5" decimal-separator="," />
</template>
```

## Commit Timing

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :default-value="4" />
    <AInputNumber :default-value="4" :change-on-blur="false" />
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <AInputNumber :default-value="4" />
    <AInputNumber :default-value="4" :change-on-blur="false" />
  </ASpace>
</template>
```

## High-Precision Strings

<div class="aheart-demo-panel">
  <AInputNumber
    string-mode
    model-value="1.000000000000000001"
    step="0.000000000000000001"
  />
</div>

```vue
<template>
<AInputNumber
    string-mode
    model-value="1.000000000000000001"
    step="0.000000000000000001"
  />
</template>
```

## Custom Controls

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber
      :model-value="8"
      :controls="{
        upIcon: h('span', { class: 'demo-input-number-node' }, 'up'),
        downIcon: h('span', { class: 'demo-input-number-node' }, 'down')
      }"
    />
    <AInputNumber :model-value="8" :controls="false" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
<ASpace>
    <AInputNumber
      :model-value="8"
      :controls="{
        upIcon: h('span', { class: 'demo-input-number-node' }, 'up'),
        downIcon: h('span', { class: 'demo-input-number-node' }, 'down')
      }"
    />
    <AInputNumber :model-value="8" :controls="false" />
  </ASpace>
</template>
```

## Wheel Stepping

<div class="aheart-demo-panel">
  <AInputNumber :model-value="4" :step="2" change-on-wheel />
</div>

```vue
<template>
<AInputNumber :model-value="4" :step="2" change-on-wheel />
</template>
```

After the input receives focus, the wheel accumulates movement and emits a change after the step threshold is reached. Holding the up or down control steps continuously. Keyboard stepping accepts `ArrowUp`/`ArrowDown` and `Up`/`Down` key values; holding <kbd>Shift</kbd> uses a 10x step. IME composition does not trigger arrow-key stepping or parse the value early; the current input is parsed after composition ends.

## Semantic Styling

<div class="aheart-demo-panel">
  <AInputNumber
    :model-value="1200"
    prefix="$"
    suffix="USD"
    status="warning"
    read-only
    class-name="demo-input-number-class"
    root-class-name="demo-input-number-root"
    :style="{ maxWidth: '420px' }"
    :class-names="inputNumberClassNames"
    :styles="inputNumberStyles"
  />
</div>

```vue
<script setup lang="ts">
const inputNumberClassNames = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  root: 'demo-input-number-semantic-root',
  input: 'demo-input-number-control',
  prefix: 'demo-input-number-prefix',
  suffix: 'demo-input-number-suffix',
  actions: 'demo-input-number-actions',
  action: props.readOnly ? 'demo-input-number-action-readonly' : 'demo-input-number-action'
})
const inputNumberStyles = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  prefix: { color: 'var(--aheart-color-primary)' },
  action: { color: props.readOnly ? 'var(--aheart-color-text-secondary)' : 'var(--aheart-color-warning)' }
})
</script>

<template>
<AInputNumber
    :model-value="1200"
    prefix="$"
    suffix="USD"
    status="warning"
    read-only
    class-name="demo-input-number-class"
    root-class-name="demo-input-number-root"
    :style="{ maxWidth: '420px' }"
    :class-names="inputNumberClassNames"
    :styles="inputNumberStyles"
  />
</template>
```

## Size and Disabled State

<div class="aheart-demo-panel">
  <AConfigProvider size="large" disabled>
    <AInputNumber :model-value="8" />
  </AConfigProvider>
</div>

```vue
<template>
<AConfigProvider size="large" disabled>
    <AInputNumber :model-value="8" />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The numeric value; strings are supported in `stringMode`. | `number` \|`string` | - |
| value | Ant Design-compatible controlled numeric value; `modelValue` takes precedence when both are provided. | `number` \|`string` | - |
| defaultValue | The initial uncontrolled value. | `number` \|`string` | - |
| autoFocus | Whether to focus the native control after mounting. | `boolean` | `false` |
| id | The native control id. | `string` | - |
| placeholder | Placeholder text. | `string` | - |
| addonBefore | Content before the input group. | `VNodeChild` | - |
| addonAfter | Content after the input group. | `VNodeChild` | - |
| prefix | Prefix content. | `VNodeChild` | - |
| suffix | Suffix content. | `VNodeChild` | - |
| size | The component size. | `large` \| `middle` \| `small` | ConfigProvider size |
| mode | Display mode; `spinner` uses increment/decrement controls and centers the input. | `input` \|`spinner` | `input` |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| readOnly | Whether the control is read-only. | `boolean` | `false` |
| status | The validation status. | `error` \| `warning` | - |
| variant | The visual variant. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Whether a border is shown; `false` is equivalent to `borderless`. | `boolean` | `true` |
| min | The minimum value or character/array length. | `number` | - |
| max | The maximum value or character/array length. | `number` | - |
| step | The amount changed per step. | `number` \|`string` | `1` |
| precision | Numeric precision; also pads the default display decimal places. | `number` | - |
| decimalSeparator | The decimal separator used for default display and parsing. | `string` | `.` |
| stringMode | Whether to use strings for high-precision decimal values. | `boolean` | `false` |
| formatter | Formats the displayed value. | `(value?: number \|string, info: { userTyping: boolean; input: string }) => string` | - |
| parser | Parses the displayed value into the model value. | `(displayValue: string) => number \|string \|undefined` | - |
| keyboard | Whether arrow-key stepping is enabled. | `boolean` | `true` |
| controls | Whether to show step controls, with optional custom icons. Controls are hidden when disabled or read-only. | `boolean` \|`{ upIcon?: VNodeChild; downIcon?: VNodeChild }` | `true` |
| changeOnBlur | Commits input changes on blur; set `false` to commit while typing. | `boolean` | `true` |
| changeOnWheel | Whether mouse-wheel stepping is enabled. | `boolean` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `InputNumberSemanticRecord<string> \|((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<string>)` | - |
| styles | Styles for semantic DOM parts. | `InputNumberSemanticRecord<StyleValue> \|((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<StyleValue>)` | - |

In addition to declared props, native `<input>` attributes and listeners such as `name`, `autocomplete`, `pattern`, `aria-*`, and `@blur` pass through to the internal input. The internal input defaults to `autocomplete="off"`, which an explicit value overrides. It exposes `spinbutton` ARIA semantics and range metadata, including `aria-valuenow` only for valid numeric values. Component `class`, `style`, and mouse events such as `@click`, `@mousedown`, and `@mousemove` remain on the root. The root receives `is-focused`, `is-not-a-number`, and `is-out-of-range` state classes as applicable. Step controls disable only at valid `min`/`max` boundaries; root `mousedown` focuses the input and prevents the default mouse-down behavior. The component `@input` event returns the current raw input text.

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fires when the component value changes. | `(value: number \|string \|undefined) => void` |
| change | Fires when the component value changes. | `(value: number \|string \|undefined) => void` |
| pressEnter | Fires when Enter is pressed. | `(event: KeyboardEvent) => void` |
| input | Fires when input text changes and returns the current raw input text. | `(value: string) => void` |
| step | Fires after control, keyboard, or wheel stepping. In `stringMode`, `value` is a string; `info.offset` is the step and `info.type` is the direction. | `(value: number \|string, info: { offset: number \|string; type: 'up' \|'down'; emitter: 'handler' \|'keyboard' \|'wheel' }) => void` |

## Methods

| Name | Description | Type |
| --- | --- | --- |
| focus | Focuses the control. | `(option?: { preventScroll?: boolean; cursor?: 'start' \|'end' \|'all' }) => void` |
| blur | Removes focus from the control. | `() => void` |
| nativeElement | The `nativeElement` method. | `HTMLElement \|undefined` |

## Slots

| Name | Description |
| --- | --- |
| prefix | Custom prefix content. |
| suffix | Custom suffix content. |
| increaseIcon | Custom increment-control content. |
| decreaseIcon | Custom decrement-control content. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
| input | The native input control. |
| prefix | Custom prefix content. |
| suffix | Custom suffix content. |
| actions | The step-control container. |
| action | An individual step control. |

## InputNumberSemanticInfo

| Name | Description | Type |
| --- | --- | --- |
| props | Current read-only InputNumber props passed to a semantic function. | `Readonly<Record<string, unknown>>` |

## Theme Tokens

- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-control-height`
- `--aheart-radius`
