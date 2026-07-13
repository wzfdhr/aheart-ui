# Switch <span class="aheart-status aheart-status--ready">Ready</span>

Switch toggles a boolean setting with semantic `role="switch"` output.

<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch :model-value="true" />
    <ASwitch />
  </ASpace>
</div>

```vue
<template>
  <ASwitch v-model="checked" />
</template>
```

## contentandloading

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch :model-value="true" checked-children="On" un-checked-children="Off" />
    <ASwitch loading />
  </ASpace>
</div>

```vue
<template>
  <ASwitch v-model="checked" checked-children="On" un-checked-children="Off" />
  <ASwitch loading />
</template>
```

## Aliases and Defaults

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch :checked="true" checked-children="Checked" un-checked-children="Unchecked" />
    <ASwitch :value="true" checked-children="Value" />
    <ASwitch default-checked checked-children="Default" un-checked-children="Off" />
  </ASpace>
</div>

```vue
<template>
  <ASwitch :checked="checked" />
  <ASwitch :value="enabled" />
  <ASwitch default-checked />
</template>
```

## Custom Content

<div class="aheart-demo-panel">
  <ASwitch default-checked>
    <template #checkedChildren>1</template>
    <template #unCheckedChildren>0</template>
  </ASwitch>
</div>

```vue
<template>
  <ASwitch v-model="checked">
    <template #checkedChildren>1</template>
    <template #unCheckedChildren>0</template>
  </ASwitch>
</template>
```

## Rendered Node Content

<div class="aheart-demo-panel">
  <ASwitch
    default-checked
    :checked-children="checkedNode"
    :un-checked-children="uncheckedNode"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASwitch
    v-model="checked"
    :checked-children="checkedNode"
    :un-checked-children="uncheckedNode"
  />
</template>
```

## Focus Control

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch ref="switchRef" auto-focus />
    <AButton size="small" @click="switchRef?.focus()">Focus</AButton>
    <AButton size="small" @click="switchRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
</script>

<template>
  <ASwitch ref="switchRef" auto-focus />
  <AButton @click="switchRef?.focus()">Focus</AButton>
  <AButton @click="switchRef?.blur()">Blur</AButton>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ASwitch
    default-checked
    class-name="demo-switch"
    root-class-name="demo-switch-root"
    :style="{ width: '72px' }"
    :class-names="{ root: 'demo-switch-semantic-root', indicator: 'demo-switch-indicator', content: 'demo-switch-content' }"
    :styles="{ indicator: { boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)' }, content: { fontWeight: 600 } }"
    checked-children="On"
    un-checked-children="Off"
  />
</div>

```vue
<template>
  <ASwitch
    v-model="checked"
    class-name="demo-switch"
    root-class-name="demo-switch-root"
    :style="{ width: '72px' }"
    :class-names="{ root: 'demo-switch-semantic-root', indicator: 'demo-switch-indicator', content: 'demo-switch-content' }"
    :styles="{ indicator: { boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)' }, content: { fontWeight: 600 } }"
  />
</template>
```

## Global Configuration

<div class="aheart-demo-panel">
  <AConfigProvider size="small" disabled>
    <ASwitch />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="small" disabled>
    <ASwitch />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Configures `modelValue`. | `boolean` | `false` |
| checked | Configures `checked`. | `boolean` | - |
| value | Configures `value`. | `boolean` | - |
| defaultChecked | Configures `defaultChecked`. | `boolean` | - |
| defaultValue | Configures `defaultValue`. | `boolean` | - |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| loading | Configures `loading`. | `boolean` | `false` |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| autoFocus | Configures `autoFocus`. | `boolean` | `false` |
| checkedChildren | Configures `checkedChildren`. | `VNodeChild` | - |
| unCheckedChildren | Configures `unCheckedChildren`. | `VNodeChild` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'content' \| 'indicator', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'content' \| 'indicator', StyleValue>>` | - |

## Methods

| Name | Description |
| --- | --- |
| focus() | Provides the `focus()` entry. |
| blur() | Provides the `blur()` entry. |
| nativeElement | Provides the `nativeElement` entry. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Emitted when `update:modelValue` occurs. | `(checked: boolean) => void` |
| update:checked | Emitted when `update:checked` occurs. | `(checked: boolean) => void` |
| update:value | Emitted when `update:value` occurs. | `(checked: boolean) => void` |
| change | Emitted when `change` occurs. | `(checked: boolean, event: MouseEvent) => void` |
| click | Emitted when `click` occurs. | `(checked: boolean, event: MouseEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| checkedChildren | Provides the `checkedChildren` entry. |
| unCheckedChildren | Provides the `unCheckedChildren` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| indicator | Provides the `indicator` entry. |
| content | Provides the `content` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text-secondary`
- `--aheart-motion-duration`
