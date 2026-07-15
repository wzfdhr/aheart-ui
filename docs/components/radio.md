<script setup lang="ts">
import { h, ref } from 'vue'

const radioRef = ref<{ focus: () => void; blur: () => void }>()
const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

# Radio 单选框 <span class="aheart-status aheart-status--ready">已完成</span>

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

## 别名与默认值

<div class="aheart-demo-panel">
  <ASpace>
    <ARadio :checked="true" label="Checked alias" />
    <ARadio default-checked label="Default checked" />
  </ASpace>
</div>

```vue
<template>
  <ARadio :checked="checked" label="Checked alias" />
  <ARadio default-checked label="Default checked" />
</template>
```

## 焦点控制

<div class="aheart-demo-panel">
  <ASpace>
    <ARadio ref="radioRef" auto-focus label="Focusable radio" />
    <AButton size="small" @click="radioRef?.focus()">Focus</AButton>
    <AButton size="small" @click="radioRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const radioRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ARadio ref="radioRef" auto-focus label="Focusable radio" />
  <AButton @click="radioRef?.focus()">Focus</AButton>
  <AButton @click="radioRef?.blur()">Blur</AButton>
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

## 单选组选项配置

<div class="aheart-demo-panel">
  <ARadioGroup
    :default-value="2"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-radio-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' },
      { label: radioNodeLabel, value: 'node' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const radioNodeLabel = h('span', { class: 'demo-radio-option-node' }, 'Renderable label')
</script>

<template>
  <ARadioGroup
    :default-value="2"
    :options="[
      'Plain',
      2,
      { label: 'Styled', value: 'styled', className: 'demo-radio-option', style: { color: 'var(--aheart-color-primary)' }, title: 'Styled option' },
      { label: radioNodeLabel, value: 'node' }
    ]"
  />
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

## 语义化样式

<div class="aheart-demo-panel">
  <ARadio
    checked
    label="Styled radio"
    class-name="demo-radio-class"
    root-class-name="demo-radio-root"
    :style="{ marginTop: '4px' }"
    :class-names="{ root: 'demo-radio-semantic-root', icon: 'demo-radio-icon', label: 'demo-radio-label' }"
    :styles="{ icon: { borderColor: 'var(--aheart-color-primary)' }, label: { fontWeight: 600 } }"
  />
</div>

```vue
<template>
  <ARadio
    v-model="checked"
    label="Styled radio"
    class-name="demo-radio-class"
    root-class-name="demo-radio-root"
    :style="{ marginTop: '4px' }"
    :class-names="{ root: 'demo-radio-semantic-root', icon: 'demo-radio-icon', label: 'demo-radio-label' }"
    :styles="{ icon: { borderColor: 'var(--aheart-color-primary)' }, label: { fontWeight: 600 } }"
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
| checked | 是否选中，Ant 风格受控别名，优先级高于 `modelValue` | `boolean` | - |
| defaultChecked | 非受控初始选中状态 | `boolean` | - |
| value | 原生 value 属性 | `string` \| `number` \| `boolean` | - |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| autoFocus | 挂载后自动聚焦原生 radio 输入框 | `boolean` | `false` |
| label | 标签文本 | `string` | - |
| name | 原生 name 属性 | `string` | - |
| title | 根节点 title 属性 | `string` | - |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'icon' \| 'label', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'icon' \| 'label', StyleValue>>` | - |

### RadioGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前选中值 | `RadioValue` | - |
| value | 当前选中值，Ant 风格受控别名，优先级高于 `modelValue` | `RadioValue` | - |
| defaultValue | 非受控初始选中值 | `RadioValue` | - |
| options | 选项列表，支持字符串、数字或对象选项；对象选项的 `label` 可传渲染节点，默认和按钮模式均支持 | `(string \| number \| RadioOption)[]` | `[]` |
| disabled | 是否禁用整组 | `boolean` | ConfigProvider disabled |
| name | 传递给组内所有原生 radio 的 name 属性 | `string` | - |
| orientation | Ant 风格排列方向别名，优先级高于 `vertical` 和 `direction` | `horizontal` \| `vertical` | - |
| vertical | 是否垂直排列，优先级高于 `direction` | `boolean` | `false` |
| direction | 排列方向 | `horizontal` \| `vertical` | `horizontal` |
| optionType | 选项展示类型 | `default` \| `button` | `default` |
| buttonStyle | 按钮样式 | `outline` \| `solid` | `outline` |
| size | 按钮组尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| block | 是否撑满父元素宽度 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |

### RadioOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项内容 | `VNodeChild` | - |
| value | 选项值 | `string` \| `number` \| `boolean` | - |
| disabled | 是否禁用该选项 | `boolean` | `false` |
| className | 选项根节点 class | `string` | - |
| style | 选项根节点样式 | `StyleValue` | - |
| title | 选项根节点 title 属性 | `string` | - |

## Methods

| 名称 | 说明 |
| --- | --- |
| focus() | 聚焦原生 radio 输入框 |
| blur() | 移除原生 radio 输入框焦点 |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中时触发 | `(checked: boolean) => void` |
| update:checked | 选中时触发，配合 `checked` 使用 | `(checked: boolean) => void` |
| change | 选中时触发 | `(checked: boolean, event: Event) => void` |
| RadioGroup update:modelValue | 组内选中值变化时触发 | `(value: RadioValue) => void` |
| RadioGroup update:value | 组内选中值变化时触发，配合 `value` 使用 | `(value: RadioValue) => void` |
| RadioGroup change | 组内选中值变化时触发 | `(value: RadioValue) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义标签内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根 label 元素 |
| icon | 可视单选框 |
| label | 标签内容 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-text`
