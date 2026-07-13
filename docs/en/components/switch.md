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
<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASpace>
    <ASwitch :model-value="true" />
    <ASwitch />
  </ASpace>
</template>
```

## Labels and Loading

<div class="aheart-demo-panel">
  <ASpace>
    <ASwitch :model-value="true" checked-children="On" un-checked-children="Off" />
    <ASwitch loading />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASpace>
    <ASwitch :model-value="true" checked-children="On" un-checked-children="Off" />
    <ASwitch loading />
  </ASpace>
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
<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASpace>
    <ASwitch :checked="true" checked-children="Checked" un-checked-children="Unchecked" />
    <ASwitch :value="true" checked-children="Value" />
    <ASwitch default-checked checked-children="Default" un-checked-children="Off" />
  </ASpace>
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
<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASwitch default-checked>
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
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASwitch
    default-checked
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
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <ASpace>
    <ASwitch ref="switchRef" auto-focus />
    <AButton size="small" @click="switchRef?.focus()">Focus</AButton>
    <AButton size="small" @click="switchRef?.blur()">Blur</AButton>
  </ASpace>
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
<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
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
</template>
```

## Global Configuration

<div class="aheart-demo-panel">
  <AConfigProvider size="small" disabled>
    <ASwitch />
  </AConfigProvider>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const switchRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLButtonElement }>()
const checkedNode = h('span', { class: 'demo-switch-node' }, '1')
const uncheckedNode = h('span', { class: 'demo-switch-node' }, '0')
</script>

<template>
  <AConfigProvider size="small" disabled>
    <ASwitch />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current value. | `boolean` | `false` |
| checked | The controlled checked state. | `boolean` | - |
| value | The value. | `boolean` | - |
| defaultChecked | The initial uncontrolled checked state. | `boolean` | - |
| defaultValue | The initial uncontrolled value. | `boolean` | - |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| loading | Whether to show a loading state. | `boolean` | `false` |
| size | The component size. | `large` \|`middle` \|`small` | ConfigProvider size |
| autoFocus | Whether to focus the native control after mounting. | `boolean` | `false` |
| checkedChildren | Content shown while the switch is on. | `VNodeChild` | - |
| unCheckedChildren | Content shown while the switch is off. | `VNodeChild` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `Partial<Record<'root' \| 'content' \| 'indicator', string>>` | - |
| styles | Styles for semantic DOM parts. | `Partial<Record<'root' \| 'content' \| 'indicator', StyleValue>>` | - |

## Methods

| Name | Description |
| --- | --- |
| focus() | Focuses the native control. |
| blur() | Removes focus from the native control. |
| nativeElement | The root native element. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fires when the component value changes. | `(checked: boolean) => void` |
| update:checked | Fires when the corresponding value or interaction changes. | `(checked: boolean) => void` |
| update:value | Fires when the corresponding value or interaction changes. | `(checked: boolean) => void` |
| change | Fires when the component value changes. | `(checked: boolean, event: MouseEvent) => void` |
| click | Fires when the corresponding value or interaction changes. | `(checked: boolean, event: MouseEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| checkedChildren | Custom on-state content. |
| unCheckedChildren | Custom off-state content. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
| indicator | The switch indicator. |
| content | The on/off content. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-text-secondary`
- `--aheart-motion-duration`
