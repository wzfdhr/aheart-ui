# Select 选择器 <span class="aheart-status aheart-status--ready">Ready</span>

Select lets users choose one or more values from a fixed option list.

## 基础用法

<div class="aheart-demo-panel">
  <ASelect
    model-value="banana"
    placeholder="Choose fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</div>

```vue
<template>
  <ASelect
    v-model="value"
    placeholder="Choose fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</template>
```

## 多选与清除

<div class="aheart-demo-panel">
  <ASelect
    mode="multiple"
    :model-value="['apple', 'banana']"
    allow-clear
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</div>

```vue
<template>
  <ASelect
    v-model="values"
    mode="multiple"
    allow-clear
    :options="options"
  />
</template>
```

## 状态与全局配置

<div class="aheart-demo-panel">
  <AConfigProvider size="large" disabled>
    <ASelect
      status="warning"
      placeholder="Disabled"
      :options="[
        { label: 'Ready', value: 'ready' },
        { label: 'Paused', value: 'paused' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<template>
  <AConfigProvider size="large" disabled>
    <ASelect status="warning" placeholder="Disabled" :options="options" />
  </AConfigProvider>
</template>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值 | `string` \| `string[]` | - |
| options | 选项列表 | `SelectOption[]` | `[]` |
| placeholder | 占位提示 | `string` | - |
| size | 选择器尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| status | 校验状态 | `error` \| `warning` | - |
| allowClear | 是否显示清除按钮 | `boolean` | `false` |
| mode | 选择模式 | `multiple` | - |

### SelectOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `string` | - |
| value | 选项值 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化时触发 | `(value: string \| string[]) => void` |
| change | 选中值变化时触发 | `(value: string \| string[]) => void` |
| clear | 点击清除按钮时触发 | `() => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
