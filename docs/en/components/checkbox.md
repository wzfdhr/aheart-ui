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
<template>
  <ACheckbox v-model="checked" label="Selected" />
</template>
```

## Indeterminate State

<div class="aheart-demo-panel">
  <ACheckbox :model-value="true" indeterminate label="Partially selected" />
</div>

```vue
<template>
  <ACheckbox v-model="checked" indeterminate label="Partially selected" />
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
<template>
  <ACheckbox :checked="checked" label="Checked alias" />
  <ACheckbox default-checked label="Default checked" />
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
import { ref } from 'vue'

const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
</script>

<template>
  <ACheckbox ref="checkboxRef" auto-focus label="Focusable checkbox" />
  <AButton @click="checkboxRef?.focus()">Focus</AButton>
  <AButton @click="checkboxRef?.blur()">Blur</AButton>
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
<template>
  <ACheckboxGroup v-model="fruits" name="fruit" :options="options" />
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
import { h } from 'vue'

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
<template>
  <ACheckboxGroup v-model="permissions" direction="vertical" :options="options" />
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
<template>
  <ACheckbox
    v-model="checked"
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
| modelValue | Configures `modelValue`. | `boolean` | `false` |
| checked | Configures `checked`. | `boolean` | - |
| defaultChecked | Configures `defaultChecked`. | `boolean` | - |
| value | Configures `value`. | `string` \| `number` \| `boolean` | - |
| name | Configures `name`. | `string` | - |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| autoFocus | Configures `autoFocus`. | `boolean` | `false` |
| indeterminate | Configures `indeterminate`. | `boolean` | `false` |
| label | Configures `label`. | `string` | - |
| title | Configures `title`. | `string` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'icon' \| 'label', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'icon' \| 'label', StyleValue>>` | - |

### CheckboxGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Configures `modelValue`. | `CheckboxValue[]` | `[]` |
| value | Configures `value`. | `CheckboxValue[]` | - |
| defaultValue | Configures `defaultValue`. | `CheckboxValue[]` | - |
| options | Configures `options`. | `(string \|number \|CheckboxOption)[]` | `[]` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| name | Configures `name`. | `string` | - |
| direction | Configures `direction`. | `horizontal` \|`vertical` | `horizontal` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |

### CheckboxOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | Configures `label`. | `VNodeChild` | - |
| value | Configures `value`. | `string` \| `number` \| `boolean` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| title | Configures `title`. | `string` | - |

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
| change | Emitted when `change` occurs. | `(checked: boolean, event: Event) => void` |
| focus | Emitted when `focus` occurs. | `(event: FocusEvent) => void` |
| blur | Emitted when `blur` occurs. | `(event: FocusEvent) => void` |
| CheckboxGroup update:modelValue | Emitted when `CheckboxGroup update:modelValue` occurs. | `(value: CheckboxValue[]) => void` |
| CheckboxGroup update:value | Emitted when `CheckboxGroup update:value` occurs. | `(value: CheckboxValue[]) => void` |
| CheckboxGroup change | Emitted when `CheckboxGroup change` occurs. | `(value: CheckboxValue[]) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| icon | Provides the `icon` entry. |
| label | Provides the `label` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-radius-sm`
