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
| value | 原生 value 属性 | `string` \| `number` \| `boolean` | - |
| name | 原生 name 属性 | `string` | - |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| indeterminate | 是否半选 | `boolean` | `false` |
| label | 标签文本 | `string` | - |

### CheckboxGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 已选值数组 | `CheckboxValue[]` | `[]` |
| options | 选项列表 | `CheckboxOption[]` | `[]` |
| disabled | 是否禁用整组 | `boolean` | ConfigProvider disabled |
| name | 传递给组内所有原生 checkbox 的 name 属性 | `string` | - |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |

### CheckboxOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `string` | - |
| value | 选项值 | `string` \| `number` \| `boolean` | - |
| disabled | 是否禁用该选项 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中状态变化时触发 | `(checked: boolean) => void` |
| change | 选中状态变化时触发 | `(checked: boolean) => void` |
| CheckboxGroup update:modelValue | 组内选中值变化时触发 | `(value: CheckboxValue[]) => void` |
| CheckboxGroup change | 组内选中值变化时触发 | `(value: CheckboxValue[]) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义标签内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
- `--aheart-radius-sm`
