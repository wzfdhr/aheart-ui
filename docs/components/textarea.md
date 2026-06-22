<script setup lang="ts">
import { h } from 'vue'
</script>

# Textarea 文本域 <span class="aheart-status aheart-status--ready">Ready</span>

Textarea captures multi-line text with rows, count, clear action, auto-size row bounds, variants, disabled state, and validation status.

## 基础用法

<div class="aheart-demo-panel">
  <ATextarea model-value="A longer description can live here." placeholder="Enter description" />
</div>

```vue
<template>
  <ATextarea v-model="value" placeholder="Enter description" />
</template>
```

## 字数统计与自适应

<div class="aheart-demo-panel">
  <ATextarea
    model-value="Line one"
    :rows="4"
    :maxlength="120"
    show-count
    allow-clear
    :auto-size="{ minRows: 2, maxRows: 5 }"
  />
</div>

```vue
<template>
  <ATextarea
    v-model="value"
    :rows="4"
    :maxlength="120"
    show-count
    allow-clear
    :auto-size="{ minRows: 2, maxRows: 5 }"
  />
</template>
```

## 变体

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea model-value="Outlined" variant="outlined" />
    <ATextarea model-value="Filled" variant="filled" />
    <ATextarea model-value="Underlined" variant="underlined" />
    <ATextarea model-value="Borderless" :bordered="false" />
  </ASpace>
</div>

```vue
<template>
  <ATextarea v-model="value" variant="outlined" />
  <ATextarea v-model="value" variant="filled" />
  <ATextarea v-model="value" variant="underlined" />
  <ATextarea v-model="value" :bordered="false" />
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

## 自定义清除图标

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea model-value="Clear me" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
    <ATextarea model-value="Clear disabled" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
    <ATextarea model-value="Slot clear" allow-clear>
      <template #clearIcon>x</template>
    </ATextarea>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ATextarea v-model="value" :allow-clear="{ clearIcon: h('span', { class: 'demo-clear-node' }, 'clear') }" />
  <ATextarea v-model="disabledClearValue" :allow-clear="{ disabled: true, clearIcon: 'clear' }" />
  <ATextarea v-model="slotValue" allow-clear>
    <template #clearIcon>x</template>
  </ATextarea>
</template>
```

## 计数配置

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ATextarea
      model-value="Aheart"
      :maxlength="20"
      :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
    />
    <ATextarea
      model-value="hello"
      :count="{
        max: 10,
        strategy: (value) => value.split('').filter((char) => char === 'l').length,
        show: ({ count, maxLength }) => `${count} of ${maxLength}`
      }"
    />
    <ATextarea
      model-value="clipped textarea"
      :count="{
        max: 8,
        exceedFormatter: (value, { max }) => value.slice(0, max),
        show: ({ count, maxLength }) => h('span', null, `${count}/${maxLength}`)
      }"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <ATextarea
    v-model="value"
    :maxlength="20"
    :show-count="{ formatter: ({ count, maxLength }) => h('strong', null, `${count}/${maxLength}`) }"
  />
  <ATextarea
    v-model="strategyValue"
    :count="{
      max: 10,
      strategy: (value) => value.split('').filter((char) => char === 'l').length,
      show: ({ count, maxLength }) => `${count} of ${maxLength}`
    }"
  />
  <ATextarea
    v-model="clippedValue"
    :count="{
      max: 8,
      exceedFormatter: (value, { max }) => value.slice(0, max),
      show: ({ count, maxLength }) => h('span', null, `${count}/${maxLength}`)
    }"
  />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <ATextarea
    model-value="Styled textarea"
    allow-clear
    show-count
    class-name="demo-textarea-class"
    root-class-name="demo-textarea-root"
    :auto-size="{ minRows: 2, maxRows: 5 }"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-textarea-semantic-root', textarea: 'demo-textarea-control', clear: 'demo-textarea-clear', count: 'demo-textarea-count' }"
    :styles="{ textarea: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' } }"
  />
</div>

```vue
<template>
  <ATextarea
    v-model="value"
    allow-clear
    show-count
    class-name="demo-textarea-class"
    root-class-name="demo-textarea-root"
    :auto-size="{ minRows: 2, maxRows: 5 }"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-textarea-semantic-root', textarea: 'demo-textarea-control', clear: 'demo-textarea-clear', count: 'demo-textarea-count' }"
    :styles="{ textarea: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' } }"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 文本内容 | `string` | - |
| id | 原生文本域 id | `string` | - |
| placeholder | 占位提示 | `string` | - |
| rows | 文本域行数 | `number` | `3` |
| size | 文本域字号尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| readOnly | 是否只读 | `boolean` | `false` |
| status | 校验状态 | `error` \| `warning` | - |
| variant | 文本域变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| bordered | 是否显示边框，设为 `false` 时等同 `borderless` | `boolean` | `true` |
| allowClear | 是否显示清除按钮，支持自定义清除图标与禁用清除按钮 | `boolean` \| `{ clearIcon?: VNodeChild; disabled?: boolean }` | `false` |
| maxlength | 最大字符数 | `number` | - |
| showCount | 是否显示字数，支持格式化 | `boolean` \| `{ formatter?: (info: CountInfo) => VNodeChild }` | `false` |
| count | 计数配置 | `{ max?: number; strategy?: (value: string) => number; show?: boolean \| ((info: CountInfo) => VNodeChild); exceedFormatter?: (value: string, config: { max: number }) => string }` | - |
| autoSize | 是否禁用手动 resize，或配置最小/最大行数 | `boolean` \| `{ minRows?: number; maxRows?: number }` | `false` |
| className | 文本域根节点兼容 class | `string` | - |
| rootClassName | 文本域根节点 class | `string` | - |
| style | 文本域根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'textarea' \| 'clear' \| 'count', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'textarea' \| 'clear' \| 'count', StyleValue>>` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化时触发 | `(value: string) => void` |
| input | 输入时触发 | `(value: string) => void` |
| change | 失焦或提交变更时触发 | `(value: string) => void` |
| clear | 点击清除按钮时触发 | `() => void` |
| pressEnter | 按下回车时触发 | `(event: KeyboardEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| clearIcon | 自定义清除按钮内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 文本域根容器 |
| textarea | 原生文本域控件 |
| clear | 清除按钮 |
| count | 计数文本容器 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-bg`
- `--aheart-radius`
