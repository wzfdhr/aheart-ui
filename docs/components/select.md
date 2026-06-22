# Select 选择器 <span class="aheart-status aheart-status--ready">Ready</span>

Select lets users choose one or more values from a fixed option list, with search, variants, adornments, and multi-value limits.

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

## 搜索

<div class="aheart-demo-panel">
  <ASelect
    show-search
    placeholder="Search fruit"
    not-found-content="No fruit"
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
    v-model="value"
    show-search
    placeholder="Search fruit"
    not-found-content="No fruit"
    :options="options"
    @search="handleSearch"
  />
</template>
```

## 前后缀与变体

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ASelect
      model-value="2"
      prefix="Level"
      suffix-icon="⌄"
      variant="filled"
      :options="[
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 }
      ]"
    />
    <ASelect
      model-value="apple"
      variant="underlined"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <ASelect
      model-value="apple"
      :bordered="false"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
  </ASpace>
</div>

```vue
<template>
  <ASelect v-model="level" prefix="Level" suffix-icon="⌄" variant="filled" :options="levels" />
  <ASelect v-model="value" variant="underlined" :options="options" />
  <ASelect v-model="value" :bordered="false" :options="options" />
</template>
```

## Tags 与数量限制

<div class="aheart-demo-panel">
  <ASelect
    mode="tags"
    :model-value="['apple']"
    :max-count="2"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</div>

```vue
<template>
  <ASelect v-model="values" mode="tags" :max-count="2" :options="options" />
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
| modelValue | 当前值 | `string` \| `number` \| `(string \| number)[]` | - |
| id | 原生 select id | `string` | - |
| name | 原生 select name | `string` | - |
| options | 选项列表 | `SelectOption[]` | `[]` |
| placeholder | 占位提示 | `string` | - |
| prefix | 选择器前缀内容 | `string` | - |
| suffixIcon | 选择器后缀图标内容 | `string` | - |
| size | 选择器尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| status | 校验状态 | `error` \| `warning` | - |
| variant | 选择器变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| bordered | 是否显示边框，设为 `false` 时等同 `borderless` | `boolean` | `true` |
| allowClear | 是否显示清除按钮 | `boolean` | `false` |
| mode | 选择模式 | `multiple` \| `tags` | - |
| showSearch | 是否显示搜索输入 | `boolean` | `false` |
| searchValue | 受控搜索文本 | `string` | - |
| filterOption | 自定义过滤逻辑，设为 `false` 时不进行本地过滤 | `boolean` \| `(inputValue: string, option: SelectOption) => boolean` | `true` |
| notFoundContent | 无匹配选项时的提示内容 | `string` | `Not Found` |
| maxCount | 多选/tags 模式最多提交的选项数量 | `number` | - |

### SelectOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `string` | - |
| value | 选项值 | `string` \| `number` | - |
| disabled | 是否禁用 | `boolean` | `false` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化时触发 | `(value: SelectValue) => void` |
| change | 选中值变化时触发 | `(value: SelectValue) => void` |
| clear | 点击清除按钮时触发 | `() => void` |
| search | 搜索文本变化时触发 | `(value: string) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| prefix | 自定义前缀内容 |
| suffixIcon | 自定义后缀图标内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
