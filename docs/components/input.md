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
| allowClear | 是否显示清除按钮 | `boolean` | `false` |
| maxlength | 最大字符数 | `number` | - |
| showCount | 是否显示字数 | `boolean` | `false` |
| type | 原生输入类型 | `string` | `text` |

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

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
