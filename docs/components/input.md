# Input 输入框 <span class="aheart-status aheart-status--ready">Ready</span>

Input captures single-line text with optional prefix, suffix, addons, clear action, count, variants, and validation status.

## 基础用法

<div class="aheart-demo-panel">
  <AInput model-value="Aheart UI" placeholder="Enter text" />
</div>

```vue
<template>
  <AInput v-model="value" placeholder="Enter text" />
</template>
```

## 前后缀与清除

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput model-value="search keyword" allow-clear :maxlength="20" show-count>
      <template #prefix>⌕</template>
      <template #suffix>.com</template>
    </AInput>
    <AInput model-value="aheart" prefix="https://" suffix=".dev" addon-before="URL" addon-after="open" />
  </ASpace>
</div>

```vue
<template>
  <AInput v-model="value" allow-clear :maxlength="20" show-count>
    <template #prefix>⌕</template>
    <template #suffix>.com</template>
  </AInput>
  <AInput
    v-model="site"
    prefix="https://"
    suffix=".dev"
    addon-before="URL"
    addon-after="open"
  />
</template>
```

## 变体

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput model-value="Outlined" variant="outlined" />
    <AInput model-value="Filled" variant="filled" />
    <AInput model-value="Underlined" variant="underlined" />
    <AInput model-value="Borderless" :bordered="false" />
  </ASpace>
</div>

```vue
<template>
  <AInput v-model="value" variant="outlined" />
  <AInput v-model="value" variant="filled" />
  <AInput v-model="value" variant="underlined" />
  <AInput v-model="value" :bordered="false" />
</template>
```

## 状态与尺寸

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput status="warning" model-value="Warning" />
    <AConfigProvider size="large" disabled>
      <AInput model-value="Disabled by ConfigProvider" />
    </AConfigProvider>
  </ASpace>
</div>

```vue
<template>
  <AInput status="warning" v-model="warningValue" />
  <AConfigProvider size="large" disabled>
    <AInput model-value="Disabled by ConfigProvider" />
  </AConfigProvider>
</template>
```

## 自定义清除图标

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput model-value="Clear me" :allow-clear="{ clearIcon: 'clear' }" />
    <AInput model-value="Slot clear" allow-clear>
      <template #clearIcon>x</template>
    </AInput>
  </ASpace>
</div>

```vue
<template>
  <AInput v-model="value" :allow-clear="{ clearIcon: 'clear' }" />
  <AInput v-model="slotValue" allow-clear>
    <template #clearIcon>x</template>
  </AInput>
</template>
```

## 计数配置

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AInput
      model-value="Aheart"
      :maxlength="20"
      :show-count="{ formatter: ({ count, maxLength }) => `${count}/${maxLength}` }"
    />
    <AInput
      model-value="hello"
      :count="{
        max: 10,
        strategy: (value) => value.split('').filter((char) => char === 'l').length,
        show: ({ count, maxLength }) => `${count} of ${maxLength}`
      }"
    />
  </ASpace>
</div>

```vue
<template>
  <AInput
    v-model="value"
    :maxlength="20"
    :show-count="{ formatter: ({ count, maxLength }) => `${count}/${maxLength}` }"
  />
  <AInput
    v-model="strategyValue"
    :count="{
      max: 10,
      strategy: (value) => value.split('').filter((char) => char === 'l').length,
      show: ({ count, maxLength }) => `${count} of ${maxLength}`
    }"
  />
</template>
```

## 语义化样式

<div class="aheart-demo-panel">
  <AInput
    model-value="Styled input"
    prefix="pre"
    suffix="suf"
    allow-clear
    show-count
    class-name="demo-input-class"
    root-class-name="demo-input-root"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-input-semantic-root', input: 'demo-input-control', prefix: 'demo-input-prefix', suffix: 'demo-input-suffix', clear: 'demo-input-clear', count: 'demo-input-count' }"
    :styles="{ prefix: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' } }"
  />
</div>

```vue
<template>
  <AInput
    v-model="value"
    prefix="pre"
    suffix="suf"
    allow-clear
    show-count
    class-name="demo-input-class"
    root-class-name="demo-input-root"
    :style="{ maxWidth: '420px' }"
    :class-names="{ root: 'demo-input-semantic-root', input: 'demo-input-control', prefix: 'demo-input-prefix', suffix: 'demo-input-suffix', clear: 'demo-input-clear', count: 'demo-input-count' }"
    :styles="{ prefix: { color: 'var(--aheart-color-primary)' }, count: { color: 'var(--aheart-color-warning)' } }"
  />
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 输入框内容 | `string` | - |
| id | 原生输入框 id | `string` | - |
| placeholder | 占位提示 | `string` | - |
| prefix | 输入框前缀内容 | `string` | - |
| suffix | 输入框后缀内容 | `string` | - |
| addonBefore | 前置组合内容 | `string` | - |
| addonAfter | 后置组合内容 | `string` | - |
| size | 输入框尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| readOnly | 是否只读 | `boolean` | `false` |
| status | 校验状态 | `error` \| `warning` | - |
| variant | 输入框变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| bordered | 是否显示边框，设为 `false` 时等同 `borderless` | `boolean` | `true` |
| allowClear | 是否显示清除按钮，支持自定义清除图标 | `boolean` \| `{ clearIcon?: string }` | `false` |
| maxlength | 最大字符数 | `number` | - |
| showCount | 是否显示字数，支持格式化 | `boolean` \| `{ formatter?: (info: CountInfo) => string }` | `false` |
| count | 计数配置 | `{ max?: number; strategy?: (value: string) => number; show?: boolean \| ((info: CountInfo) => string) }` | - |
| type | 原生输入类型 | `string` | `text` |
| className | 输入框根节点兼容 class | `string` | - |
| rootClassName | 输入框根节点 class | `string` | - |
| style | 输入框根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'clear' \| 'count', StyleValue>>` | - |

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
| prefix | 输入框前缀 |
| suffix | 输入框后缀 |
| clearIcon | 自定义清除按钮内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
