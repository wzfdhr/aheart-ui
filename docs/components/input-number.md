# InputNumber 数字输入框 <span class="aheart-status aheart-status--ready">Ready</span>

InputNumber captures numeric values with min, max, step, controls, and size inheritance.

## 基础用法

<div class="aheart-demo-panel">
  <AInputNumber :model-value="4" :min="1" :max="10" />
</div>

```vue
<template>
  <AInputNumber v-model="value" :min="1" :max="10" />
</template>
```

## 步进

<div class="aheart-demo-panel">
  <AInputNumber :model-value="2" :step="2" />
</div>

```vue
<template>
  <AInputNumber v-model="value" :step="2" />
</template>
```

## 尺寸与禁用

<div class="aheart-demo-panel">
  <AConfigProvider size="large" disabled>
    <AInputNumber :model-value="8" />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large" disabled>
    <AInputNumber :model-value="8" />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 数字值 | `number` | - |
| placeholder | 占位提示 | `string` | - |
| size | 输入框尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| min | 最小值 | `number` | - |
| max | 最大值 | `number` | - |
| step | 每次改变步数 | `number` | `1` |
| controls | 是否显示控制按钮 | `boolean` | `true` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 数字值变化时触发 | `(value: number \| undefined) => void` |
| change | 数字值变化时触发 | `(value: number \| undefined) => void` |

## Theme Tokens

- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-control-height`
- `--aheart-radius`
