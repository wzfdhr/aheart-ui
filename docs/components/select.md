<script setup lang="ts">
import { ref } from 'vue'

const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

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

## 焦点控制

<div class="aheart-demo-panel">
  <ASpace>
    <ASelect
      ref="selectRef"
      placeholder="Focusable select"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <AButton size="small" @click="selectRef?.focus()">Focus</AButton>
    <AButton size="small" @click="selectRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect ref="selectRef" placeholder="Focusable select" :options="options" />
  <AButton @click="selectRef?.focus()">Focus</AButton>
  <AButton @click="selectRef?.blur()">Blur</AButton>
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

## 字段映射与排序

<div class="aheart-demo-panel">
  <ASelect
    show-search
    option-filter-prop="code"
    :field-names="{ label: 'name', value: 'id', disabled: 'locked' }"
    :filter-sort="(a, b, info) => `${a.label}-${info.searchValue}`.localeCompare(`${b.label}-${info.searchValue}`)"
    :options="[
      { name: 'Beta', id: 2, code: 'fruit', locked: false },
      { name: 'Alpha', id: 1, code: 'fruit', locked: true },
      { name: 'Gamma', id: 3, code: 'team', locked: false }
    ]"
  />
</div>

```vue
<template>
  <ASelect
    show-search
    option-filter-prop="code"
    :field-names="{ label: 'name', value: 'id', disabled: 'locked' }"
    :filter-sort="sortOptions"
    :options="remoteOptions"
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

## 默认值与加载

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ASelect
      default-value="banana"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <ASelect
      loading
      loading-icon="Loading"
      placeholder="Loading options"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
  </ASpace>
</div>

```vue
<template>
  <ASelect default-value="banana" :options="options" />
  <ASelect loading loading-icon="Loading" placeholder="Loading options" :options="options" />
</template>
```

## 自定义清除与语义化样式

<div class="aheart-demo-panel">
  <ASelect
    model-value="apple"
    :allow-clear="{ clearIcon: 'clear' }"
    class-name="demo-select"
    :class-names="{ selector: 'demo-select-control', clear: 'demo-select-clear' }"
    :styles="{ root: { maxWidth: '320px' }, selector: { borderColor: 'var(--aheart-color-primary)' } }"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' }
    ]"
  />
</div>

```vue
<template>
  <ASelect
    v-model="value"
    :allow-clear="{ clearIcon: 'clear' }"
    class-name="demo-select"
    :class-names="{ selector: 'demo-select-control', clear: 'demo-select-clear' }"
    :styles="{ root: { maxWidth: '320px' } }"
    :options="options"
  />
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
| defaultValue | 非受控默认值 | `string` \| `number` \| `(string \| number)[]` | - |
| options | 选项列表 | `SelectOption[]` | `[]` |
| placeholder | 占位提示 | `string` | - |
| prefix | 选择器前缀内容 | `string` | - |
| suffixIcon | 选择器后缀图标内容 | `string` | - |
| loadingIcon | 自定义加载图标 | `VNodeChild` | - |
| size | 选择器尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| status | 校验状态 | `error` \| `warning` | - |
| variant | 选择器变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| bordered | 是否显示边框，设为 `false` 时等同 `borderless` | `boolean` | `true` |
| allowClear | 是否显示清除按钮，可配置清除图标 | `boolean \| { clearIcon?: VNodeChild }` | `false` |
| mode | 选择模式 | `multiple` \| `tags` | - |
| showSearch | 是否显示搜索输入 | `boolean` | `false` |
| searchValue | 受控搜索文本 | `string` | - |
| optionFilterProp | 默认搜索匹配的选项字段 | `string` | `label` |
| filterOption | 自定义过滤逻辑，设为 `false` 时不进行本地过滤 | `boolean` \| `(inputValue: string, option: SelectOption) => boolean` | `true` |
| filterSort | 自定义过滤后排序 | `(optionA, optionB, info) => number` | - |
| fieldNames | 自定义选项字段名 | `SelectFieldNames` | `{ label: 'label', value: 'value', disabled: 'disabled' }` |
| notFoundContent | 无匹配选项时的提示内容 | `string` | `Not Found` |
| maxCount | 多选/tags 模式最多提交的选项数量 | `number` | - |
| loading | 是否显示加载状态 | `boolean` | `false` |
| className | 根节点类名 | `string` | - |
| rootClassName | 根节点类名 | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化 DOM 类名 | `SelectClassNames` | `{}` |
| styles | 语义化 DOM 样式 | `SelectStyles` | `{}` |

### SelectOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本 | `string` | - |
| value | 选项值 | `string` \| `number` | - |
| disabled | 是否禁用 | `boolean` | `false` |

### SelectFieldNames

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项文本字段名 | `string` | `label` |
| value | 选项值字段名 | `string` | `value` |
| disabled | 禁用状态字段名 | `string` | `disabled` |

### SelectFilterSortInfo

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| searchValue | 当前搜索文本 | `string` |

## Methods

| 名称 | 说明 |
| --- | --- |
| focus() | 聚焦选择器；开启 `showSearch` 时聚焦搜索输入框 |
| blur() | 移除选择器焦点 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化时触发 | `(value: SelectValue) => void` |
| change | 选中值变化时触发 | `(value: SelectValue) => void` |
| clear | 点击清除按钮时触发 | `() => void` |
| search | 搜索文本变化时触发 | `(value: string) => void` |
| focus | 选择器或搜索输入框聚焦时触发 | `(event: FocusEvent) => void` |
| blur | 选择器或搜索输入框失焦时触发 | `(event: FocusEvent) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| prefix | 自定义前缀内容 |
| suffixIcon | 自定义后缀图标内容 |
| loadingIcon | 自定义加载图标 |
| clearIcon | 自定义清除图标 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| prefix | 前缀区域 |
| search | 搜索输入 |
| selector | 原生 select 控件 |
| option | 选项节点 |
| notFound | 空结果选项 |
| clear | 清除按钮 |
| suffix | 后缀区域 |
| loading | 加载图标区域 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
