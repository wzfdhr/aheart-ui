# Textarea 文本域 <span class="aheart-status aheart-status--ready">Ready</span>

Textarea captures multi-line text with rows, count, disabled state, and validation status.

## 基础用法

<div class="aheart-demo-panel">
  <ATextarea model-value="A longer description can live here." placeholder="Enter description" />
</div>

```vue
<template>
  <ATextarea v-model="value" placeholder="Enter description" />
</template>
```

## 字数统计

<div class="aheart-demo-panel">
  <ATextarea model-value="Line one" :rows="4" :maxlength="120" show-count auto-size />
</div>

```vue
<template>
  <ATextarea v-model="value" :rows="4" :maxlength="120" show-count auto-size />
</template>
```

## 状态

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea status="error" model-value="This field needs attention." />
    <AConfigProvider disabled>
      <ATextarea model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</div>

```vue
<template>
  <ATextarea status="error" v-model="value" />
  <AConfigProvider disabled>
    <ATextarea model-value="Disabled by ConfigProvider" />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 文本内容 | `string` | - |
| placeholder | 占位提示 | `string` | - |
| rows | 文本域行数 | `number` | `3` |
| size | 文本域字号尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| status | 校验状态 | `error` \| `warning` | - |
| maxlength | 最大字符数 | `number` | - |
| showCount | 是否显示字数 | `boolean` | `false` |
| autoSize | 是否禁用手动 resize | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化时触发 | `(value: string) => void` |
| input | 输入时触发 | `(value: string) => void` |
| change | 失焦或提交变更时触发 | `(value: string) => void` |

## Theme Tokens

- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-bg`
- `--aheart-radius`
