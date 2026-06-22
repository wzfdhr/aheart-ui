# Radio 单选框 <span class="aheart-status aheart-status--ready">Ready</span>

Radio captures a single boolean selection. Grouped value management will be added in a later slice.

## 基础用法

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

## 自定义内容

<div class="aheart-demo-panel">
  <ARadio :model-value="true">Custom radio label</ARadio>
</div>

```vue
<template>
  <ARadio v-model="checked">Custom radio label</ARadio>
</template>
```

## 全局禁用

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否选中 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| label | 标签文本 | `string` | - |
| name | 原生 name 属性 | `string` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中时触发 | `(checked: boolean) => void` |
| change | 选中时触发 | `(checked: boolean) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义标签内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
