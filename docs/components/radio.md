# Radio 单选框 <span class="aheart-status aheart-status--ready">Ready</span>

Radio captures a single boolean selection or one value from a grouped option set.

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

## 单选组

<div class="aheart-demo-panel">
  <ARadioGroup
    model-value="apple"
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
  <ARadioGroup v-model="fruit" name="fruit" :options="options" />
</template>
```

## 按钮样式

<div class="aheart-demo-panel">
  <ARadioGroup
    model-value="weekly"
    option-type="button"
    button-style="solid"
    size="large"
    block
    :options="[
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' }
    ]"
  />
</div>

```vue
<template>
  <ARadioGroup
    v-model="frequency"
    option-type="button"
    button-style="solid"
    size="large"
    block
    :options="options"
  />
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

### Radio

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否选中 | `boolean` | `false` |
| value | 原生 value 属性 | `string` \| `number` \| `boolean` | - |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| label | 标签文本 | `string` | - |
| name | 原生 name 属性 | `string` | - |

### RadioGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前选中值 | `RadioValue` | - |
| options | 选项列表 | `RadioOption[]` | `[]` |
| disabled | 是否禁用整组 | `boolean` | ConfigProvider disabled |
| name | 传递给组内所有原生 radio 的 name 属性 | `string` | - |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| optionType | 选项展示类型 | `default` \| `button` | `default` |
| buttonStyle | 按钮样式 | `outline` \| `solid` | `outline` |
| size | 按钮组尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| block | 是否撑满父元素宽度 | `boolean` | `false` |

### RadioOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `string` | - |
| value | 选项值 | `string` \| `number` \| `boolean` | - |
| disabled | 是否禁用该选项 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中时触发 | `(checked: boolean) => void` |
| change | 选中时触发 | `(checked: boolean) => void` |
| RadioGroup update:modelValue | 组内选中值变化时触发 | `(value: RadioValue) => void` |
| RadioGroup change | 组内选中值变化时触发 | `(value: RadioValue) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义标签内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
