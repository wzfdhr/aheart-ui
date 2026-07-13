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
<template>
  <ARadio v-model="checked" name="choice" label="Option A" />
</template>
```

## Custom Content

<div class="aheart-demo-panel">
  <ARadio :model-value="true">Custom radio label</ARadio>
</div>

```vue
<template>
  <ARadio v-model="checked">Custom radio label</ARadio>
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
<template>
  <ARadio :checked="checked" label="Checked alias" />
  <ARadio default-checked label="Default checked" />
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
import { ref } from 'vue'

const radioRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ARadio ref="radioRef" auto-focus label="Focusable radio" />
  <AButton @click="radioRef?.focus()">Focus</AButton>
  <AButton @click="radioRef?.blur()">Blur</AButton>
</template>
```

## content

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
<template>
  <ARadioGroup v-model="fruit" name="fruit" :options="options" />
</template>
```

## contentoptionconfigure

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
import { h } from 'vue'

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

## contentstyle

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
<template>
  <ARadioGroup
    v-model="frequency"
    option-type="button"
    button-style="solid"
    size="large"
    block
    :options="options"
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
<template>
  <ARadio
    v-model="checked"
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
| modelValue | Configures `modelValue`. | `boolean` | `false` |
| checked | Configures `checked`. | `boolean` | - |
| defaultChecked | Configures `defaultChecked`. | `boolean` | - |
| value | Configures `value`. | `string` \| `number` \| `boolean` | - |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| autoFocus | Configures `autoFocus`. | `boolean` | `false` |
| label | Configures `label`. | `string` | - |
| name | Configures `name`. | `string` | - |
| title | Configures `title`. | `string` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'icon' \| 'label', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'icon' \| 'label', StyleValue>>` | - |

### RadioGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Configures `modelValue`. | `RadioValue` | - |
| value | Configures `value`. | `RadioValue` | - |
| defaultValue | Configures `defaultValue`. | `RadioValue` | - |
| options | Configures `options`. | `(string \|number \|RadioOption)[]` | `[]` |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| name | Configures `name`. | `string` | - |
| orientation | Configures `orientation`. | `horizontal` \|`vertical` | - |
| vertical | Configures `vertical`. | `boolean` | `false` |
| direction | Configures `direction`. | `horizontal` \|`vertical` | `horizontal` |
| optionType | Configures `optionType`. | `default` \|`button` | `default` |
| buttonStyle | Configures `buttonStyle`. | `outline` \|`solid` | `outline` |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| block | Configures `block`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |

### RadioOption

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

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Emitted when `update:modelValue` occurs. | `(checked: boolean) => void` |
| update:checked | Emitted when `update:checked` occurs. | `(checked: boolean) => void` |
| change | Emitted when `change` occurs. | `(checked: boolean, event: Event) => void` |
| RadioGroup update:modelValue | Emitted when `RadioGroup update:modelValue` occurs. | `(value: RadioValue) => void` |
| RadioGroup update:value | Emitted when `RadioGroup update:value` occurs. | `(value: RadioValue) => void` |
| RadioGroup change | Emitted when `RadioGroup change` occurs. | `(value: RadioValue) => void` |

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
