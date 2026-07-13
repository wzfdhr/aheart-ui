# Textarea <span class="aheart-status aheart-status--ready">Ready</span>

Textarea captures multi-line text with rows, count, clear action, auto-size row bounds, variants, disabled state, and validation status.

<script setup lang="ts">
import { h } from 'vue'
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ATextarea model-value="A longer description can live here." placeholder="Enter description" />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ATextarea model-value="A longer description can live here." placeholder="Enter description" />
</template>
```

## Count and Auto Size

<div class="aheart-demo-panel">
  <ATextarea
    model-value="Line one"
    :rows="4"
    :maxlength="120"
    show-count
    allow-clear
    :auto-size="{ minRows: 2, maxRows: 5 }"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ATextarea
    model-value="Line one"
    :rows="4"
    :maxlength="120"
    show-count
    allow-clear
    :auto-size="{ minRows: 2, maxRows: 5 }"
  />
</template>
```

## Variants

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea model-value="Outlined" variant="outlined" />
    <ATextarea model-value="Filled" variant="filled" />
    <ATextarea model-value="Underlined" variant="underlined" />
    <ATextarea model-value="Borderless" :bordered="false" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea model-value="Outlined" variant="outlined" />
    <ATextarea model-value="Filled" variant="filled" />
    <ATextarea model-value="Underlined" variant="underlined" />
    <ATextarea model-value="Borderless" :bordered="false" />
  </ASpace>
</template>
```

## Status

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea status="error" model-value="This field needs attention." />
    <AConfigProvider disabled>
      <ATextarea model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea status="error" model-value="This field needs attention." />
    <AConfigProvider disabled>
      <ATextarea model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</template>
```

## Custom Clear Icon

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea model-value="Clear me" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
    <ATextarea model-value="Clear disabled" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
    <ATextarea model-value="Slot clear" allow-clear>
      <template #clearIcon>x</template>
    </ATextarea>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea model-value="Clear me" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
    <ATextarea model-value="Clear disabled" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
    <ATextarea model-value="Slot clear" allow-clear>
      <template #clearIcon>x</template>
    </ATextarea>
  </ASpace>
</template>
```

## Count Configuration

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea
      model-value="Aheart"
      :maxlength="20"
      :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
    />
    <ATextarea
      model-value="hello"
      :count="{
        max: 10,
        strategy: (value) => value.split('').filter((char) => char === 'l').length,
        show: ({ count, maxLength }) => `${count} of ${maxLength}`
      }"
    />
    <ATextarea
      model-value="clipped textarea"
      :count="{
        max: 8,
        exceedFormatter: (value, { max }) => value.slice(0, max),
        show: ({ count, maxLength }) => h('span', null, `${count}/${maxLength}`)
      }"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea
      model-value="Aheart"
      :maxlength="20"
      :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
    />
    <ATextarea
      model-value="hello"
      :count="{
        max: 10,
        strategy: (value) => value.split('').filter((char) => char === 'l').length,
        show: ({ count, maxLength }) => `${count} of ${maxLength}`
      }"
    />
    <ATextarea
      model-value="clipped textarea"
      :count="{
        max: 8,
        exceedFormatter: (value, { max }) => value.slice(0, max),
        show: ({ count, maxLength }) => h('span', null, `${count}/${maxLength}`)
      }"
    />
  </ASpace>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ATextarea
    model-value="Styled textarea"
    allow-clear
    show-count
    class-name="demo-textarea-class"
    root-class-name="demo-textarea-root"
    :auto-size="{ minRows: 2, maxRows: 5 }"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-textarea-semantic-root', textarea: 'demo-textarea-control', clear: 'demo-textarea-clear', count: 'demo-textarea-count' }"
    :styles="{ textarea: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' } }"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ATextarea
    model-value="Styled textarea"
    allow-clear
    show-count
    class-name="demo-textarea-class"
    root-class-name="demo-textarea-root"
    :auto-size="{ minRows: 2, maxRows: 5 }"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-textarea-semantic-root', textarea: 'demo-textarea-control', clear: 'demo-textarea-clear', count: 'demo-textarea-count' }"
    :styles="{ textarea: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' } }"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current value. | `string` | - |
| id | The native control id. | `string` | - |
| placeholder | Placeholder text. | `string` | - |
| rows | The number of visible rows. | `number` | `3` |
| size | The component size. | `large` \|`middle` \|`small` | ConfigProvider size |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| readOnly | Whether the control is read-only. | `boolean` | `false` |
| status | The validation status. | `error` \| `warning` | - |
| variant | The visual variant. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Whether a border is shown; `false` is equivalent to `borderless`. | `boolean` | `true` |
| allowClear | Whether to show a clear control, with optional custom icon configuration. | `boolean` \|`{ clearIcon?: VNodeChild; disabled?: boolean }` | `false` |
| maxlength | The maximum character count. | `number` | - |
| showCount | Whether to show the count, with optional formatting. | `boolean` \|`{ formatter?: (info: CountInfo) => VNodeChild }` | `false` |
| count | Count configuration, including max, counting strategy, display, and overflow formatting. | `{ max?: number; strategy?: (value: string) => number; show?: boolean \|((info: CountInfo) => VNodeChild); exceedFormatter?: (value: string, config: { max: number }) => string }` | - |
| autoSize | Whether to disable manual resizing or configure minimum and maximum rows. | `boolean` \|`{ minRows?: number; maxRows?: number }` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `Partial<Record<'root' \| 'textarea' \| 'clear' \| 'count', string>>` | - |
| styles | Styles for semantic DOM parts. | `Partial<Record<'root' \| 'textarea' \| 'clear' \| 'count', StyleValue>>` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fires when the component value changes. | `(value: string) => void` |
| input | Fires when input text changes. | `(value: string) => void` |
| change | Fires when the component value changes. | `(value: string) => void` |
| clear | Fires when the clear control is clicked. | `() => void` |
| pressEnter | Fires when Enter is pressed. | `(event: KeyboardEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| clearIcon | Custom clear-control content. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
| textarea | The native textarea control. |
| clear | The clear control. |
| count | The count-text container. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-bg`
- `--aheart-radius`
