# Input <span class="aheart-status aheart-status--ready">Ready</span>

Input captures single-line text with optional prefix, suffix, addons, clear action, count, variants, and validation status.

<script setup lang="ts">
import { h } from 'vue'
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <AInput model-value="Aheart UI" placeholder="Enter text" />
</div>

```vue
<template>
<AInput model-value="Aheart UI" placeholder="Enter text" />
</template>
```

## Prefix, Suffix, and Clear

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput model-value="search keyword" allow-clear :maxlength="20" show-count>
      <template #prefix>⌕</template>
      <template #suffix>.com</template>
    </AInput>
    <AInput model-value="aheart" prefix="https://" suffix=".dev" addon-before="URL" addon-after="open" />
    <AInput
      model-value="render node"
      :prefix="h('span', { class: 'demo-input-node' }, '@')"
      :suffix="h('span', { class: 'demo-input-node' }, 'verified')"
      :addon-before="h('strong', null, 'Account')"
      :addon-after="h('span', null, 'OK')"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
<ASpace direction="vertical" style="width: 100%">
    <AInput model-value="search keyword" allow-clear :maxlength="20" show-count>
      <template #prefix>⌕</template>
      <template #suffix>.com</template>
    </AInput>
    <AInput model-value="aheart" prefix="https://" suffix=".dev" addon-before="URL" addon-after="open" />
    <AInput
      model-value="render node"
      :prefix="h('span', { class: 'demo-input-node' }, '@')"
      :suffix="h('span', { class: 'demo-input-node' }, 'verified')"
      :addon-before="h('strong', null, 'Account')"
      :addon-after="h('span', null, 'OK')"
    />
  </ASpace>
</template>
```

## Variants

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput model-value="Outlined" variant="outlined" />
    <AInput model-value="Filled" variant="filled" />
    <AInput model-value="Underlined" variant="underlined" />
    <AInput model-value="Borderless" :bordered="false" />
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical" style="width: 100%">
    <AInput model-value="Outlined" variant="outlined" />
    <AInput model-value="Filled" variant="filled" />
    <AInput model-value="Underlined" variant="underlined" />
    <AInput model-value="Borderless" :bordered="false" />
  </ASpace>
</template>
```

## Status and Size

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput status="warning" model-value="Warning" />
    <AConfigProvider size="large" disabled>
      <AInput model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical" style="width: 100%">
    <AInput status="warning" model-value="Warning" />
    <AConfigProvider size="large" disabled>
      <AInput model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</template>
```

## Custom Clear Icon

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput model-value="Clear me" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
    <AInput model-value="Clear disabled" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
    <AInput model-value="Slot clear" allow-clear>
      <template #clearIcon>x</template>
    </AInput>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
<ASpace direction="vertical" style="width: 100%">
    <AInput model-value="Clear me" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
    <AInput model-value="Clear disabled" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
    <AInput model-value="Slot clear" allow-clear>
      <template #clearIcon>x</template>
    </AInput>
  </ASpace>
</template>
```

## Count Configuration

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput
      model-value="Aheart"
      :maxlength="20"
      :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
    />
    <AInput
      model-value="hello"
      :count="{
        max: 10,
        strategy: (value) => value.split('').filter((char) => char === 'l').length,
        show: ({ count, maxLength }) => `${count} of ${maxLength}`
      }"
    />
    <AInput
      model-value="clipped value"
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
    <AInput
      model-value="Aheart"
      :maxlength="20"
      :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
    />
    <AInput
      model-value="hello"
      :count="{
        max: 10,
        strategy: (value) => value.split('').filter((char) => char === 'l').length,
        show: ({ count, maxLength }) => `${count} of ${maxLength}`
      }"
    />
    <AInput
      model-value="clipped value"
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
  <AInput
    model-value="Styled input"
    prefix="pre"
    suffix="suf"
    addon-before="Before"
    addon-after="After"
    allow-clear
    show-count
    class-name="demo-input-class"
    root-class-name="demo-input-root"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-input-semantic-root', group: 'demo-input-group', input: 'demo-input-control', prefix: 'demo-input-prefix', suffix: 'demo-input-suffix', clear: 'demo-input-clear', count: 'demo-input-count', addonBefore: 'demo-input-addon-before', addonAfter: 'demo-input-addon-after' }"
    :styles="{ group: { maxWidth: '520px' }, prefix: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' }, addonBefore: { color: 'var(--aheart-color-primary)' }, addonAfter: { color: 'var(--aheart-color-warning)' } }"
  />
</div>

```vue
<template>
<AInput
    model-value="Styled input"
    prefix="pre"
    suffix="suf"
    addon-before="Before"
    addon-after="After"
    allow-clear
    show-count
    class-name="demo-input-class"
    root-class-name="demo-input-root"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-input-semantic-root', group: 'demo-input-group', input: 'demo-input-control', prefix: 'demo-input-prefix', suffix: 'demo-input-suffix', clear: 'demo-input-clear', count: 'demo-input-count', addonBefore: 'demo-input-addon-before', addonAfter: 'demo-input-addon-after' }"
    :styles="{ group: { maxWidth: '520px' }, prefix: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' }, addonBefore: { color: 'var(--aheart-color-primary)' }, addonAfter: { color: 'var(--aheart-color-warning)' } }"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current value. | `string` | - |
| id | The native control id. | `string` | - |
| placeholder | Placeholder text. | `string` | - |
| prefix | Prefix content. | `VNodeChild` | - |
| suffix | Suffix content. | `VNodeChild` | - |
| addonBefore | Content before the input group. | `VNodeChild` | - |
| addonAfter | Content after the input group. | `VNodeChild` | - |
| size | The component size. | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| readOnly | Whether the control is read-only. | `boolean` | `false` |
| status | The validation status. | `error` \| `warning` | - |
| variant | The visual variant. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Whether a border is shown; `false` is equivalent to `borderless`. | `boolean` | `true` |
| allowClear | Whether to show a clear control, with optional custom icon configuration. | `boolean` \|`{ clearIcon?: VNodeChild; disabled?: boolean }` | `false` |
| maxlength | The maximum character count. | `number` | - |
| showCount | Whether to show the count, with optional formatting. | `boolean` \|`{ formatter?: (info: CountInfo) => VNodeChild }` | `false` |
| count | Count configuration, including max, counting strategy, display, and overflow formatting. | `{ max?: number; strategy?: (value: string) => number; show?: boolean \|((info: CountInfo) => VNodeChild); exceedFormatter?: (value: string, config: { max: number }) => string }` | - |
| type | The value type. | `string` | `text` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `Partial<Record<'root' \| 'group' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count' \| 'addonBefore' \| 'addonAfter', string>>` | - |
| styles | Styles for semantic DOM parts. | `Partial<Record<'root' \| 'group' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count' \| 'addonBefore' \| 'addonAfter', StyleValue>>` | - |

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
| prefix | Custom prefix content. |
| suffix | Custom suffix content. |
| clearIcon | Custom clear-control content. |
| addonBefore | Content before the input group. |
| addonAfter | Content after the input group. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
| group | The input-group container when addons are present. |
| input | The native input control. |
| prefix | Custom prefix content. |
| suffix | Custom suffix content. |
| clear | The clear control. |
| count | The count-text container. |
| addonBefore | Content before the input group. |
| addonAfter | Content after the input group. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
