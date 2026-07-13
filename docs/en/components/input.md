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
  <AInput v-model="value" placeholder="Enter text" />
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
  <AInput v-model="value" allow-clear :maxlength="20" show-count>
    <template #prefix>⌕</template>
    <template #suffix>.com</template>
  </AInput>
  <AInput
    v-model="site"
    prefix="https://"
    suffix=".dev"
    addon-before="URL"
    addon-after="open"
  />
  <AInput
    v-model="nodeValue"
    :prefix="h('span', { class: 'demo-input-node' }, '@')"
    :suffix="h('span', { class: 'demo-input-node' }, 'verified')"
    :addon-before="h('strong', null, 'Account')"
    :addon-after="h('span', null, 'OK')"
  />
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
  <AInput v-model="value" variant="outlined" />
  <AInput v-model="value" variant="filled" />
  <AInput v-model="value" variant="underlined" />
  <AInput v-model="value" :bordered="false" />
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
  <AInput status="warning" v-model="warningValue" />
  <AConfigProvider size="large" disabled>
    <AInput model-value="Disabled by ConfigProvider" />
  </AConfigProvider>
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
  <AInput v-model="value" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
  <AInput v-model="disabledClearValue" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
  <AInput v-model="slotValue" allow-clear>
    <template #clearIcon>x</template>
  </AInput>
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
  <AInput
    v-model="value"
    :maxlength="20"
    :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
  />
  <AInput
    v-model="strategyValue"
    :count="{
      max: 10,
      strategy: (value) => value.split('').filter((char) => char === 'l').length,
      show: ({ count, maxLength }) => `${count} of ${maxLength}`
    }"
  />
  <AInput
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
    v-model="value"
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
| modelValue | Configures `modelValue`. | `string` | - |
| id | Configures `id`. | `string` | - |
| placeholder | Configures `placeholder`. | `string` | - |
| prefix | Configures `prefix`. | `VNodeChild` | - |
| suffix | Configures `suffix`. | `VNodeChild` | - |
| addonBefore | Configures `addonBefore`. | `VNodeChild` | - |
| addonAfter | Configures `addonAfter`. | `VNodeChild` | - |
| size | Configures `size`. | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| readOnly | Configures `readOnly`. | `boolean` | `false` |
| status | Configures `status`. | `error` \| `warning` | - |
| variant | Configures `variant`. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Configures `bordered`. | `boolean` | `true` |
| allowClear | Configures `allowClear`. | `boolean` \|`{ clearIcon?: VNodeChild; disabled?: boolean }` | `false` |
| maxlength | Configures `maxlength`. | `number` | - |
| showCount | Configures `showCount`. | `boolean` \|`{ formatter?: (info: CountInfo) => VNodeChild }` | `false` |
| count | Configures `count`. | `{ max?: number; strategy?: (value: string) => number; show?: boolean \|((info: CountInfo) => VNodeChild); exceedFormatter?: (value: string, config: { max: number }) => string }` | - |
| type | Configures `type`. | `string` | `text` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'group' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count' \| 'addonBefore' \| 'addonAfter', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'group' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count' \| 'addonBefore' \| 'addonAfter', StyleValue>>` | - |

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
| prefix | Provides the `prefix` entry. |
| suffix | Provides the `suffix` entry. |
| clearIcon | Provides the `clearIcon` entry. |
| addonBefore | Provides the `addonBefore` entry. |
| addonAfter | Provides the `addonAfter` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| group | Provides the `group` entry. |
| input | Provides the `input` entry. |
| prefix | Provides the `prefix` entry. |
| suffix | Provides the `suffix` entry. |
| clear | Provides the `clear` entry. |
| count | Provides the `count` entry. |
| addonBefore | Provides the `addonBefore` entry. |
| addonAfter | Provides the `addonAfter` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
