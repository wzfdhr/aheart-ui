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
  <AInputNumber v-model="value" :min="1" :max="10" />
  <AInputNumber :default-value="6" />
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
  <AInputNumber v-model="value" :step="2" />
  <AInputNumber v-model="decimalValue" step="0.5" />
  <AInputNumber v-model="amount" :precision="2" prefix="$" suffix="USD" />
  <AInputNumber
    v-model="nodeAmount"
    :prefix="h('strong', { class: 'demo-input-number-node' }, '$')"
    :suffix="h('span', { class: 'demo-input-number-node' }, 'USD')"
  />
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
  <AInputNumber v-model="value" status="warning" />
  <AInputNumber v-model="value" variant="filled" />
  <AInputNumber v-model="value" variant="underlined" />
  <AInputNumber v-model="value" :bordered="false" />
</template>
```

## Formatting and Parsing

```vue
<script setup lang="ts">
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
  <AInputNumber v-model="value" decimal-separator="," />
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
  <AInputNumber v-model="blurValue" />
  <AInputNumber v-model="instantValue" :change-on-blur="false" />
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
    v-model="value"
    string-mode
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
  <AInputNumber
    v-model="value"
    :controls="{
      upIcon: h('span', { class: 'demo-input-number-node' }, 'up'),
      downIcon: h('span', { class: 'demo-input-number-node' }, 'down')
    }"
  />
  <AInputNumber v-model="plainValue" :controls="false" />
</template>
```

## Wheel Stepping

<div class="aheart-demo-panel">
  <AInputNumber :model-value="4" :step="2" change-on-wheel />
</div>

```vue
<template>
  <AInputNumber v-model="value" :step="2" change-on-wheel />
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
    v-model="amount"
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
| modelValue | Configures `modelValue`. | `number` \|`string` | - |
| value | Configures `value`. | `number` \|`string` | - |
| defaultValue | Configures `defaultValue`. | `number` \|`string` | - |
| autoFocus | Configures `autoFocus`. | `boolean` | `false` |
| id | Configures `id`. | `string` | - |
| placeholder | Configures `placeholder`. | `string` | - |
| addonBefore | Configures `addonBefore`. | `VNodeChild` | - |
| addonAfter | Configures `addonAfter`. | `VNodeChild` | - |
| prefix | Configures `prefix`. | `VNodeChild` | - |
| suffix | Configures `suffix`. | `VNodeChild` | - |
| size | Configures `size`. | `large` \| `middle` \| `small` | ConfigProvider size |
| mode | Configures `mode`. | `input` \|`spinner` | `input` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| readOnly | Configures `readOnly`. | `boolean` | `false` |
| status | Configures `status`. | `error` \| `warning` | - |
| variant | Configures `variant`. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Configures `bordered`. | `boolean` | `true` |
| min | Configures `min`. | `number` | - |
| max | Configures `max`. | `number` | - |
| step | Configures `step`. | `number` \|`string` | `1` |
| precision | Configures `precision`. | `number` | - |
| decimalSeparator | Configures `decimalSeparator`. | `string` | `.` |
| stringMode | Configures `stringMode`. | `boolean` | `false` |
| formatter | Configures `formatter`. | `(value?: number \|string, info: { userTyping: boolean; input: string }) => string` | - |
| parser | Configures `parser`. | `(displayValue: string) => number \|string \|undefined` | - |
| keyboard | Configures `keyboard`. | `boolean` | `true` |
| controls | Configures `controls`. | `boolean` \|`{ upIcon?: VNodeChild; downIcon?: VNodeChild }` | `true` |
| changeOnBlur | Configures `changeOnBlur`. | `boolean` | `true` |
| changeOnWheel | Configures `changeOnWheel`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `InputNumberSemanticRecord<string> \|((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<string>)` | - |
| styles | Configures `styles`. | `InputNumberSemanticRecord<StyleValue> \|((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<StyleValue>)` | - |

In addition to declared props, native `<input>` attributes and listeners such as `name`, `autocomplete`, `pattern`, `aria-*`, and `@blur` pass through to the internal input. The internal input defaults to `autocomplete="off"`, which an explicit value overrides. It exposes `spinbutton` ARIA semantics and range metadata, including `aria-valuenow` only for valid numeric values. Component `class`, `style`, and mouse events such as `@click`, `@mousedown`, and `@mousemove` remain on the root. The root receives `is-focused`, `is-not-a-number`, and `is-out-of-range` state classes as applicable. Step controls disable only at valid `min`/`max` boundaries; root `mousedown` focuses the input and prevents the default mouse-down behavior. The component `@input` event returns the current raw input text.

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Emitted when `update:modelValue` occurs. | `(value: number \|string \|undefined) => void` |
| change | Emitted when `change` occurs. | `(value: number \|string \|undefined) => void` |
| pressEnter | Emitted when `pressEnter` occurs. | `(event: KeyboardEvent) => void` |
| input | Emitted when `input` occurs. | `(value: string) => void` |
| step | Emitted when `step` occurs. | `(value: number \|string, info: { offset: number \|string; type: 'up' \|'down'; emitter: 'handler' \|'keyboard' \|'wheel' }) => void` |

## Methods

| Name | Description | Type |
| --- | --- | --- |
| focus | Exposes the `focus` method. | `(option?: { preventScroll?: boolean; cursor?: 'start' \|'end' \|'all' }) => void` |
| blur | Exposes the `blur` method. | `() => void` |
| nativeElement | Exposes the `nativeElement` method. | `HTMLElement \|undefined` |

## Slots

| Name | Description |
| --- | --- |
| prefix | Provides the `prefix` entry. |
| suffix | Provides the `suffix` entry. |
| increaseIcon | Provides the `increaseIcon` entry. |
| decreaseIcon | Provides the `decreaseIcon` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| input | Provides the `input` entry. |
| prefix | Provides the `prefix` entry. |
| suffix | Provides the `suffix` entry. |
| actions | Provides the `actions` entry. |
| action | Provides the `action` entry. |

## InputNumberSemanticInfo

| Name | Description | Type |
| --- | --- | --- |
| props | Describes `props`. | `Readonly<Record<string, unknown>>` |

## Theme Tokens

- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-control-height`
- `--aheart-radius`
