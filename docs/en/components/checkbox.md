# Checkbox <span class="aheart-status aheart-status--ready">Ready</span>

Checkbox captures a boolean choice or a grouped set of choices with checked, disabled, and indeterminate states.

<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace>
    <ACheckbox :model-value="true" label="Selected" />
    <ACheckbox label="Unchecked" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ASpace>
    <ACheckbox :model-value="true" label="Selected" />
    <ACheckbox label="Unchecked" />
  </ASpace>
</template>
```

## Indeterminate State

<div class="aheart-demo-panel">
  <ACheckbox :model-value="true" indeterminate label="Partially selected" />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ACheckbox :model-value="true" indeterminate label="Partially selected" />
</template>
```

## Aliases and Defaults

<div class="aheart-demo-panel">
  <ASpace>
    <ACheckbox :checked="true" label="Checked alias" />
    <ACheckbox default-checked label="Default checked" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ASpace>
    <ACheckbox :checked="true" label="Checked alias" />
    <ACheckbox default-checked label="Default checked" />
  </ASpace>
</template>
```

## Focus Control

<div class="aheart-demo-panel">
  <ASpace>
    <ACheckbox ref="checkboxRef" auto-focus label="Focusable checkbox" />
    <AButton size="small" @click="checkboxRef?.focus()">Focus</AButton>
    <AButton size="small" @click="checkboxRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ASpace>
    <ACheckbox ref="checkboxRef" auto-focus label="Focusable checkbox" />
    <AButton size="small" @click="checkboxRef?.focus()">Focus</AButton>
    <AButton size="small" @click="checkboxRef?.blur()">Blur</AButton>
  </ASpace>
</template>
```

## Checkbox Group

<div class="aheart-demo-panel">
  <ACheckboxGroup
    :model-value="['apple']"
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
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ACheckboxGroup
    :model-value="['apple']"
    name="fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</template>
```

## Checkbox Group Options

<div class="aheart-demo-panel">
  <ACheckboxGroup
    :default-value="['Plain', 2]"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-checkbox-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' },
      { label: checkboxNodeLabel, value: 'node' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ACheckboxGroup
    :default-value="['Plain', 2]"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-checkbox-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' },
      { label: checkboxNodeLabel, value: 'node' }
    ]"
  />
</template>
```

## Vertical Layout

<div class="aheart-demo-panel">
  <ACheckboxGroup
    direction="vertical"
    :model-value="['read']"
    :options="[
      { label: 'Read', value: 'read' },
      { label: 'Write', value: 'write' },
      { label: 'Publish', value: 'publish' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ACheckboxGroup
    direction="vertical"
    :model-value="['read']"
    :options="[
      { label: 'Read', value: 'read' },
      { label: 'Write', value: 'write' },
      { label: 'Publish', value: 'publish' }
    ]"
  />
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ACheckbox
    checked
    label="Styled checkbox"
    class-name="demo-checkbox-class"
    root-class-name="demo-checkbox-root"
    :style="{ marginTop: '4px' }"
    :class-names="{ root: 'demo-checkbox-semantic-root', icon: 'demo-checkbox-icon', label: 'demo-checkbox-label' }"
    :styles="{ icon: { borderColor: 'var(--aheart-color-primary)' }, label: { fontWeight: 600 } }"
  />
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <ACheckbox
    checked
    label="Styled checkbox"
    class-name="demo-checkbox-class"
    root-class-name="demo-checkbox-root"
    :style="{ marginTop: '4px' }"
    :class-names="{ root: 'demo-checkbox-semantic-root', icon: 'demo-checkbox-icon', label: 'demo-checkbox-label' }"
    :styles="{ icon: { borderColor: 'var(--aheart-color-primary)' }, label: { fontWeight: 600 } }"
  />
</template>
```

## Global Disabled State

<div class="aheart-demo-panel">
  <AConfigProvider disabled>
    <ACheckbox label="Disabled by ConfigProvider" />
  </AConfigProvider>
</div>

```vue
<script setup lang="ts">
import { h, ref } from 'vue'
const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
const checkboxNodeLabel = h('span', { class: 'demo-checkbox-option-node' }, 'Renderable label')
</script>

<template>
  <AConfigProvider disabled>
    <ACheckbox label="Disabled by ConfigProvider" />
  </AConfigProvider>
</template>
```

## API

### Checkbox

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current value. | `boolean` | `false` |
| checked | The controlled checked state. | `boolean` | - |
| defaultChecked | The initial uncontrolled checked state. | `boolean` | - |
| value | The value. | `string` \| `number` \| `boolean` | - |
| name | The native control name. | `string` | - |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| autoFocus | Whether to focus the native control after mounting. | `boolean` | `false` |
| indeterminate | Whether the checkbox is indeterminate. | `boolean` | `false` |
| label | The label content. | `string` | - |
| title | The root element `title` attribute. | `string` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `Partial<Record<'root' \| 'icon' \| 'label', string>>` | - |
| styles | Styles for semantic DOM parts. | `Partial<Record<'root' \| 'icon' \| 'label', StyleValue>>` | - |

### CheckboxGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current value. | `CheckboxValue[]` | `[]` |
| value | The value. | `CheckboxValue[]` | - |
| defaultValue | The initial uncontrolled value. | `CheckboxValue[]` | - |
| options | The available options. | `(string \|number \|CheckboxOption)[]` | `[]` |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| name | The native control name. | `string` | - |
| direction | The layout direction. | `horizontal` \|`vertical` | `horizontal` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |

### CheckboxOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | The label content. | `VNodeChild` | - |
| value | The value. | `string` \| `number` \| `boolean` | - |
| disabled | Whether the component is disabled. | `boolean` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| title | The root element `title` attribute. | `string` | - |

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
| change | Fires when the component value changes. | `(checked: boolean, event: Event) => void` |
| focus | Fires when the native control receives focus. | `(event: FocusEvent) => void` |
| blur | Fires when the native control loses focus. | `(event: FocusEvent) => void` |
| CheckboxGroup update:modelValue | Fires when the corresponding value or interaction changes. | `(value: CheckboxValue[]) => void` |
| CheckboxGroup update:value | Fires when the corresponding value or interaction changes. | `(value: CheckboxValue[]) => void` |
| CheckboxGroup change | Fires when the corresponding value or interaction changes. | `(value: CheckboxValue[]) => void` |

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
- `--aheart-radius-sm`
