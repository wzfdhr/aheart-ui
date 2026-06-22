# Checkbox 多选框 <span class="aheart-status aheart-status--ready">Ready</span>

Checkbox captures a boolean choice with checked, disabled, and indeterminate states.

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否选中 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| indeterminate | 是否半选 | `boolean` | `false` |
| label | 标签文本 | `string` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中状态变化时触发 | `(checked: boolean) => void` |
| change | 选中状态变化时触发 | `(checked: boolean) => void` |

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
