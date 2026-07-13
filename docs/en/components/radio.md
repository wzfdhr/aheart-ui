# Radio <span class="aheart-status aheart-status--ready">Ready</span>

Radio captures a single boolean selection or one value from a grouped option set.

<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <ARadio :model-value="true" name="choice" label="Option A" />
    <ARadio name="choice" label="Option B" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ASpace>
    <ARadio :model-value="true" name="choice" label="Option A" />
    <ARadio name="choice" label="Option B" />
  </ASpace>
</template>
```

## Custom Content

<div class="aheart-demo-panel">
  <ARadio :model-value="true">Custom radio label</ARadio>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ARadio :model-value="true">Custom radio label</ARadio>
</template>
```

## Aliases and Defaults

<div class="aheart-demo-panel">
  <ASpace>
    <ARadio :checked="true" label="Checked alias" />
    <ARadio default-checked label="Default checked" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ASpace>
    <ARadio :checked="true" label="Checked alias" />
    <ARadio default-checked label="Default checked" />
  </ASpace>
</template>
```

## Focus Control

<div class="aheart-demo-panel">
  <ASpace>
    <ARadio ref="radioRef" auto-focus label="Focusable radio" />
    <AButton size="small" @click="radioRef?.focus()">Focus</AButton>
    <AButton size="small" @click="radioRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ASpace>
    <ARadio ref="radioRef" auto-focus label="Focusable radio" />
    <AButton size="small" @click="radioRef?.focus()">Focus</AButton>
    <AButton size="small" @click="radioRef?.blur()">Blur</AButton>
  </ASpace>
</template>
```

## Radio Group

<div class="aheart-demo-panel">
  <ARadioGroup
    model-value="apple"
    name="fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ARadioGroup
    model-value="apple"
    name="fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</template>
```

## Radio Group Options

<div class="aheart-demo-panel">
  <ARadioGroup
    :default-value="2"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-radio-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' },
      { label: radioNodeLabel, value: 'node' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ARadioGroup
    :default-value="2"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-radio-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' },
      { label: radioNodeLabel, value: 'node' }
    ]"
  />
</template>
```

## Button Style

<div class="aheart-demo-panel">
  <ARadioGroup
    model-value="weekly"
    option-type="button"
    button-style="solid"
    size="large"
    block
    :options="[
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ARadioGroup
    model-value="weekly"
    option-type="button"
    button-style="solid"
    size="large"
    block
    :options="[
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' }
    ]"
  />
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ARadio
    checked
    label="Styled radio"
    class-name="demo-radio-class"
    root-class-name="demo-radio-root"
    :style="{ marginTop: '4px' }"
    :class-names="{ root: 'demo-radio-semantic-root', icon: 'demo-radio-icon', label: 'demo-radio-label' }"
    :styles="{ icon: { borderColor: 'var(--aheart-color-primary)' }, label: { fontWeight: 600 } }"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ARadio
    checked
    label="Styled radio"
    class-name="demo-radio-class"
    root-class-name="demo-radio-root"
    :style="{ marginTop: '4px' }"
    :class-names="{ root: 'demo-radio-semantic-root', icon: 'demo-radio-icon', label: 'demo-radio-label' }"
    :styles="{ icon: { borderColor: 'var(--aheart-color-primary)' }, label: { fontWeight: 600 } }"
  />
</template>
```

## Global Disabled State

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <ARadio label="Disabled by ConfigProvider" />
  </AConfigProvider>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <AConfigProvider disabled>
    <ARadio label="Disabled by ConfigProvider" />
  </AConfigProvider>
</template>
```

## API

### Radio

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Whether the radio is selected. | `boolean` | `false` |
| checked | Ant-style controlled selected-state alias; takes precedence over `modelValue`. | `boolean` | - |
| defaultChecked | The initial uncontrolled checked state. | `boolean` | - |
| value | The native `value` attribute. | `string` \| `number` \| `boolean` | - |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| autoFocus | Whether to focus the native control after mounting. | `boolean` | `false` |
| label | The label content. | `string` | - |
| name | The native control name. | `string` | - |
| title | The root element `title` attribute. | `string` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `Partial<Record<'root' \| 'icon' \| 'label', string>>` | - |
| styles | Styles for semantic DOM parts. | `Partial<Record<'root' \| 'icon' \| 'label', StyleValue>>` | - |

### RadioGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current selected value. | `RadioValue` | - |
| value | Ant-style controlled value alias; takes precedence over `modelValue`. | `RadioValue` | - |
| defaultValue | The initial uncontrolled value. | `RadioValue` | - |
| options | Options may be strings, numbers, or objects. Object `label` values may be renderable nodes in both default and button modes. | `(string \|number \|RadioOption)[]` | `[]` |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| name | The native control name. | `string` | - |
| orientation | Ant-style direction alias; takes precedence over `vertical` and `direction`. | `horizontal` \|`vertical` | - |
| vertical | Whether to arrange options vertically; takes precedence over `direction`. | `boolean` | `false` |
| direction | The arrangement direction. | `horizontal` \|`vertical` | `horizontal` |
| optionType | The option presentation type. | `default` \|`button` | `default` |
| buttonStyle | The button appearance. | `outline` \|`solid` | `outline` |
| size | The component size. | `large` \|`middle` \|`small` | ConfigProvider size |
| block | Whether the group fills its parent width. | `boolean` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |

### RadioOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | The label content. | `VNodeChild` | - |
| value | The native `value` attribute. | `string` \| `number` \| `boolean` | - |
| disabled | Whether the component is disabled. | `boolean` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| title | The root element `title` attribute. | `string` | - |

## Methods

| Name | Description |
| --- | --- |
| focus() | Focuses the native radio input. |
| blur() | Removes focus from the native radio input. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fires when the component value changes. | `(checked: boolean) => void` |
| update:checked | Fires when selected state changes while using `checked`. | `(checked: boolean) => void` |
| change | Fires when the component value changes. | `(checked: boolean, event: Event) => void` |
| RadioGroup update:modelValue | Fires when the group’s selected value changes. | `(value: RadioValue) => void` |
| RadioGroup update:value | Fires when the group’s selected value changes while using `value`. | `(value: RadioValue) => void` |
| RadioGroup change | Fires when the group’s selected value changes. | `(value: RadioValue) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Custom component content. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
| icon | The visible selection control. |
| label | The label content. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
