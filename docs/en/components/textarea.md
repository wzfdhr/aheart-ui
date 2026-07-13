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
<template>
  <ATextarea v-model="value" placeholder="Enter description" />
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
<template>
  <ATextarea
    v-model="value"
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
<template>
  <ATextarea v-model="value" variant="outlined" />
  <ATextarea v-model="value" variant="filled" />
  <ATextarea v-model="value" variant="underlined" />
  <ATextarea v-model="value" :bordered="false" />
</template>
```

## status

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea status="error" model-value="This field needs attention." />
    <AConfigProvider disabled>
      <ATextarea model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</div>

```vue
<template>
  <ATextarea status="error" v-model="value" />
  <AConfigProvider disabled>
    <ATextarea model-value="Disabled by ConfigProvider" />
  </AConfigProvider>
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
  <ATextarea v-model="value" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
  <ATextarea v-model="disabledClearValue" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
  <ATextarea v-model="slotValue" allow-clear>
    <template #clearIcon>x</template>
  </ATextarea>
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
  <ATextarea
    v-model="value"
    :maxlength="20"
    :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
  />
  <ATextarea
    v-model="strategyValue"
    :count="{
      max: 10,
      strategy: (value) => value.split('').filter((char) => char === 'l').length,
      show: ({ count, maxLength }) => `${count} of ${maxLength}`
    }"
  />
  <ATextarea
    v-model="clippedValue"
    :count="{
      max: 8,
      exceedFormatter: (value, { max }) => value.slice(0, max),
      show: ({ count, maxLength }) => h('span', null, `${count}/${maxLength}`)
    }"
  />
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
<template>
  <ATextarea
    v-model="value"
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
| modelValue | Configures `modelValue`. | `string` | - |
| id | Configures `id`. | `string` | - |
| placeholder | Configures `placeholder`. | `string` | - |
| rows | Configures `rows`. | `number` | `3` |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| readOnly | Configures `readOnly`. | `boolean` | `false` |
| status | Configures `status`. | `error` \| `warning` | - |
| variant | Configures `variant`. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Configures `bordered`. | `boolean` | `true` |
| allowClear | Configures `allowClear`. | `boolean` \|`{ clearIcon?: VNodeChild; disabled?: boolean }` | `false` |
| maxlength | Configures `maxlength`. | `number` | - |
| showCount | Configures `showCount`. | `boolean` \|`{ formatter?: (info: CountInfo) => VNodeChild }` | `false` |
| count | Configures `count`. | `{ max?: number; strategy?: (value: string) => number; show?: boolean \|((info: CountInfo) => VNodeChild); exceedFormatter?: (value: string, config: { max: number }) => string }` | - |
| autoSize | Configures `autoSize`. | `boolean` \|`{ minRows?: number; maxRows?: number }` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'textarea' \| 'clear' \| 'count', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'textarea' \| 'clear' \| 'count', StyleValue>>` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Emitted when `update:modelValue` occurs. | `(value: string) => void` |
| input | Emitted when `input` occurs. | `(value: string) => void` |
| change | Emitted when `change` occurs. | `(value: string) => void` |
| clear | Emitted when `clear` occurs. | `() => void` |
| pressEnter | Emitted when `pressEnter` occurs. | `(event: KeyboardEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| clearIcon | Provides the `clearIcon` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| textarea | Provides the `textarea` entry. |
| clear | Provides the `clear` entry. |
| count | Provides the `count` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-bg`
- `--aheart-radius`
