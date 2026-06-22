# InputNumber 数字输入框 <span class="aheart-status aheart-status--ready">Ready</span>

InputNumber captures numeric values with min, max, step, controls, precision, formatter/parser hooks, variants, status, and size inheritance.

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
  <ASpace>
    <AInputNumber :model-value="2" :step="2" />
    <AInputNumber :model-value="12.345" :precision="2" prefix="$" suffix="USD" />
  </ASpace>
</div>

```vue
<template>
  <AInputNumber v-model="value" :step="2" />
  <AInputNumber v-model="amount" :precision="2" prefix="$" suffix="USD" />
</template>
```

## 变体与状态

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInputNumber :model-value="8" status="warning" />
    <AInputNumber :model-value="8" variant="filled" />
    <AInputNumber :model-value="8" variant="underlined" />
    <AInputNumber :model-value="8" :bordered="false" />
  </ASpace>
</div>

```vue
<template>
  <AInputNumber v-model="value" status="warning" />
  <AInputNumber v-model="value" variant="filled" />
  <AInputNumber v-model="value" variant="underlined" />
  <AInputNumber v-model="value" :bordered="false" />
</template>
```

## 格式化与解析

```vue
<script setup lang="ts">
const formatter = (value?: number, info?: { userTyping: boolean; input: string }) =>
  value === undefined ? '' : `$ ${info?.input ?? value}`
const parser = (value: string) => Number(value.replace('$', '').trim())
</script>

<template>
  <AInputNumber v-model="amount" :formatter="formatter" :parser="parser" />
</template>
```

## 自定义控制按钮

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :model-value="8" :controls="{ upIcon: 'up', downIcon: 'down' }" />
    <AInputNumber :model-value="8" :controls="false" />
  </ASpace>
</div>

```vue
<template>
  <AInputNumber v-model="value" :controls="{ upIcon: 'up', downIcon: 'down' }" />
  <AInputNumber v-model="plainValue" :controls="false" />
</template>
```

## 滚轮步进

<div class="aheart-demo-panel">
  <AInputNumber :model-value="4" :step="2" change-on-wheel />
</div>

```vue
<template>
  <AInputNumber v-model="value" :step="2" change-on-wheel />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <AInputNumber
    :model-value="1200"
    prefix="$"
    suffix="USD"
    class-name="demo-input-number-class"
    root-class-name="demo-input-number-root"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-input-number-semantic-root', input: 'demo-input-number-control', prefix: 'demo-input-number-prefix', suffix: 'demo-input-number-suffix', actions: 'demo-input-number-actions', action: 'demo-input-number-action' }"
    :styles="{ prefix: { color: 'var(--aheart-color-primary)' }, action: { color: 'var(--aheart-color-warning)' } }"
  />
</div>

```vue
<template>
  <AInputNumber
    v-model="amount"
    prefix="$"
    suffix="USD"
    class-name="demo-input-number-class"
    root-class-name="demo-input-number-root"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-input-number-semantic-root', input: 'demo-input-number-control', prefix: 'demo-input-number-prefix', suffix: 'demo-input-number-suffix', actions: 'demo-input-number-actions', action: 'demo-input-number-action' }"
    :styles="{ prefix: { color: 'var(--aheart-color-primary)' }, action: { color: 'var(--aheart-color-warning)' } }"
  />
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
| id | 原生输入框 id | `string` | - |
| placeholder | 占位提示 | `string` | - |
| prefix | 输入框前缀内容 | `string` | - |
| suffix | 输入框后缀内容 | `string` | - |
| size | 输入框尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| readOnly | 是否只读 | `boolean` | `false` |
| status | 校验状态 | `error` \| `warning` | - |
| variant | 输入框变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| bordered | 是否显示边框，设为 `false` 时等同 `borderless` | `boolean` | `true` |
| min | 最小值 | `number` | - |
| max | 最大值 | `number` | - |
| step | 每次改变步数 | `number` | `1` |
| precision | 数值精度 | `number` | - |
| formatter | 展示值格式化函数 | `(value?: number, info: { userTyping: boolean; input: string }) => string` | - |
| parser | 展示值解析函数 | `(displayValue: string) => number \| undefined` | - |
| keyboard | 是否启用方向键步进 | `boolean` | `true` |
| controls | 是否显示控制按钮，支持自定义上下按钮内容 | `boolean` \| `{ upIcon?: string; downIcon?: string }` | `true` |
| changeOnWheel | 是否启用鼠标滚轮步进 | `boolean` | `false` |
| className | 数字输入框根节点兼容 class | `string` | - |
| rootClassName | 数字输入框根节点 class | `string` | - |
| style | 数字输入框根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'actions' \| 'action', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'actions' \| 'action', StyleValue>>` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 数字值变化时触发 | `(value: number \| undefined) => void` |
| change | 数字值变化时触发 | `(value: number \| undefined) => void` |
| pressEnter | 按下回车时触发 | `(event: KeyboardEvent) => void` |
| step | 点击控制按钮或键盘步进时触发 | `(value: number, info: { offset: number; type: 'up' \| 'down' }) => void` |

## Theme Tokens

- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-control-height`
- `--aheart-radius`
