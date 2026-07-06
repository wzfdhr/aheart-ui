<script setup lang="ts">
import { ref } from 'vue'

const checkboxRef = ref<{ focus: () => void; blur: () => void; nativeElement?: HTMLLabelElement }>()
</script>

# Checkbox 多选框 <span class="aheart-status aheart-status--ready">Ready</span>

Checkbox captures a boolean choice or a grouped set of choices with checked, disabled, and indeterminate states.

## 基础用法

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

## 半选状态

<div class="aheart-demo-panel">
  <ACheckbox :model-value="true" indeterminate label="Partially selected" />
</div>

```vue
<template>
  <ACheckbox v-model="checked" indeterminate label="Partially selected" />
</template>
```

## 别名与默认值

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

## 焦点控制

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

## 多选组

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

## 多选组选项配置

<div class="aheart-demo-panel">
  <ACheckboxGroup
    :default-value="['Plain', 2]"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-checkbox-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' }
    ]"
  />
</div>

```vue
<template>
  <ACheckboxGroup
    :default-value="['Plain', 2]"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-checkbox-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' }
    ]"
  />
</template>
```

## 垂直布局

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

## 语义化样式

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

## 全局禁用

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否选中 | `boolean` | `false` |
| checked | 是否选中，Ant 风格受控别名，优先级高于 `modelValue` | `boolean` | - |
| defaultChecked | 非受控初始选中状态 | `boolean` | - |
| value | 原生 value 属性 | `string` \| `number` \| `boolean` | - |
| name | 原生 name 属性 | `string` | - |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| autoFocus | 挂载后自动聚焦原生 checkbox 输入框 | `boolean` | `false` |
| indeterminate | 是否半选 | `boolean` | `false` |
| label | 标签文本 | `string` | - |
| title | 根节点 title 属性 | `string` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'icon' \| 'label', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'icon' \| 'label', StyleValue>>` | - |

### CheckboxGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 已选值数组 | `CheckboxValue[]` | `[]` |
| value | 已选值数组，Ant 风格受控别名，优先级高于 `modelValue` | `CheckboxValue[]` | - |
| defaultValue | 非受控初始选中值数组 | `CheckboxValue[]` | - |
| options | 选项列表，支持字符串、数字或对象选项 | `(string \| number \| CheckboxOption)[]` | `[]` |
| disabled | 是否禁用整组 | `boolean` | ConfigProvider disabled |
| name | 传递给组内所有原生 checkbox 的 name 属性 | `string` | - |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |

### CheckboxOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `string` | - |
| value | 选项值 | `string` \| `number` \| `boolean` | - |
| disabled | 是否禁用该选项 | `boolean` | `false` |
| className | 选项根节点 class | `string` | - |
| style | 选项根节点样式 | `StyleValue` | - |
| title | 选项根节点 title 属性 | `string` | - |

## Methods

| 名称 | 说明 |
| --- | --- |
| focus() | 聚焦原生 checkbox 输入框 |
| blur() | 移除原生 checkbox 输入框焦点 |
| nativeElement | 根 label 元素 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中状态变化时触发 | `(checked: boolean) => void` |
| update:checked | 选中状态变化时触发，配合 `checked` 使用 | `(checked: boolean) => void` |
| change | 选中状态变化时触发 | `(checked: boolean, event: Event) => void` |
| focus | 原生 checkbox 聚焦时触发 | `(event: FocusEvent) => void` |
| blur | 原生 checkbox 失焦时触发 | `(event: FocusEvent) => void` |
| CheckboxGroup update:modelValue | 组内选中值变化时触发 | `(value: CheckboxValue[]) => void` |
| CheckboxGroup update:value | 组内选中值变化时触发，配合 `value` 使用 | `(value: CheckboxValue[]) => void` |
| CheckboxGroup change | 组内选中值变化时触发 | `(value: CheckboxValue[]) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义标签内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根 label 元素 |
| icon | 可视勾选框 |
| label | 标签内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-radius-sm`
