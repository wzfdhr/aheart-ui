<script setup lang="ts">
import { h } from 'vue'

const inputNumberClassNames = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  root: 'demo-input-number-semantic-root',
  input: 'demo-input-number-control',
  prefix: 'demo-input-number-prefix',
  suffix: 'demo-input-number-suffix',
  actions: 'demo-input-number-actions',
  action: props.readOnly ? 'demo-input-number-action-readonly' : 'demo-input-number-action'
})

const inputNumberStyles = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  prefix: { color: 'var(--aheart-color-primary)' },
  action: { color: props.readOnly ? 'var(--aheart-color-text-secondary)' : 'var(--aheart-color-warning)' }
})
</script>

# InputNumber 数字输入框 <span class="aheart-status aheart-status--ready">Ready</span>

InputNumber captures numeric values with min, max, step, controls, precision, formatter/parser hooks, blur-time commit control, variants, status, and size inheritance.

## 基础用法

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :model-value="4" :min="1" :max="10" />
    <AInputNumber :default-value="6" />
  </ASpace>
</div>

```vue
<template>
  <AInputNumber v-model="value" :min="1" :max="10" />
  <AInputNumber :default-value="6" />
</template>
```

## 步进

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :model-value="2" :step="2" />
    <AInputNumber :model-value="1" step="0.5" />
    <AInputNumber :model-value="12.345" :precision="2" prefix="$" suffix="USD" />
    <AInputNumber
      :model-value="88"
      :prefix="h('strong', { class: 'demo-input-number-node' }, '$')"
      :suffix="h('span', { class: 'demo-input-number-node' }, 'USD')"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <AInputNumber v-model="value" :step="2" />
  <AInputNumber v-model="decimalValue" step="0.5" />
  <AInputNumber v-model="amount" :precision="2" prefix="$" suffix="USD" />
  <AInputNumber
    v-model="nodeAmount"
    :prefix="h('strong', { class: 'demo-input-number-node' }, '$')"
    :suffix="h('span', { class: 'demo-input-number-node' }, 'USD')"
  />
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

未提供 `parser` 时，默认解析会移除货币符号、千分位分隔符等格式字符，并会把中文句号 `。` 作为小数点处理。

## 小数分隔符

<div class="aheart-demo-panel">
  <AInputNumber :model-value="12.5" decimal-separator="," />
</div>

```vue
<template>
  <AInputNumber v-model="value" decimal-separator="," />
</template>
```

## 提交时机

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber :default-value="4" />
    <AInputNumber :default-value="4" :change-on-blur="false" />
  </ASpace>
</div>

```vue
<template>
  <AInputNumber v-model="blurValue" />
  <AInputNumber v-model="instantValue" :change-on-blur="false" />
</template>
```

## 高精度字符串

<div class="aheart-demo-panel">
  <AInputNumber
    string-mode
    model-value="1.000000000000000001"
    step="0.000000000000000001"
  />
</div>

```vue
<template>
  <AInputNumber
    v-model="value"
    string-mode
    step="0.000000000000000001"
  />
</template>
```

## 自定义控制按钮

<div class="aheart-demo-panel">
  <ASpace>
    <AInputNumber
      :model-value="8"
      :controls="{
        upIcon: h('span', { class: 'demo-input-number-node' }, 'up'),
        downIcon: h('span', { class: 'demo-input-number-node' }, 'down')
      }"
    />
    <AInputNumber :model-value="8" :controls="false" />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'
</script>

<template>
  <AInputNumber
    v-model="value"
    :controls="{
      upIcon: h('span', { class: 'demo-input-number-node' }, 'up'),
      downIcon: h('span', { class: 'demo-input-number-node' }, 'down')
    }"
  />
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

滚轮会累计移动距离，达到步进阈值后触发一次变化。长按上下控制按钮会连续步进。键盘方向键步进支持 `ArrowUp`/`ArrowDown` 和 `Up`/`Down` key 值；按住 <kbd>Shift</kbd> 会使用 10 倍步长。输入法组合输入期间不会触发方向键步进，也不会提前解析提交输入值，组合结束后再解析当前输入。

## 语义化样式

<div class="aheart-demo-panel">
  <AInputNumber
    :model-value="1200"
    prefix="$"
    suffix="USD"
    status="warning"
    read-only
    class-name="demo-input-number-class"
    root-class-name="demo-input-number-root"
    :style="{ maxWidth: '420px' }"
    :class-names="inputNumberClassNames"
    :styles="inputNumberStyles"
  />
</div>

```vue
<script setup lang="ts">
const inputNumberClassNames = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  root: 'demo-input-number-semantic-root',
  input: 'demo-input-number-control',
  prefix: 'demo-input-number-prefix',
  suffix: 'demo-input-number-suffix',
  actions: 'demo-input-number-actions',
  action: props.readOnly ? 'demo-input-number-action-readonly' : 'demo-input-number-action'
})

const inputNumberStyles = ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
  prefix: { color: 'var(--aheart-color-primary)' },
  action: { color: props.readOnly ? 'var(--aheart-color-text-secondary)' : 'var(--aheart-color-warning)' }
})
</script>

<template>
  <AInputNumber
    v-model="amount"
    prefix="$"
    suffix="USD"
    status="warning"
    read-only
    class-name="demo-input-number-class"
    root-class-name="demo-input-number-root"
    :style="{ maxWidth: '420px' }"
    :class-names="inputNumberClassNames"
    :styles="inputNumberStyles"
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
| modelValue | 数字值，`stringMode` 下支持字符串 | `number` \| `string` | - |
| value | 受控数字值，兼容 Ant Design API；与 `modelValue` 同时传入时 `modelValue` 优先 | `number` \| `string` | - |
| defaultValue | 非受控初始值，`stringMode` 下支持字符串 | `number` \| `string` | - |
| autoFocus | 挂载后自动聚焦输入框 | `boolean` | `false` |
| id | 原生输入框 id | `string` | - |
| placeholder | 占位提示 | `string` | - |
| addonBefore | 输入框前置标签内容，兼容 Ant Design deprecated API | `VNodeChild` | - |
| addonAfter | 输入框后置标签内容，兼容 Ant Design deprecated API | `VNodeChild` | - |
| prefix | 输入框前缀内容 | `VNodeChild` | - |
| suffix | 输入框后缀内容 | `VNodeChild` | - |
| size | 输入框尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| mode | 展示模式，`spinner` 模式使用加减控制按钮并居中输入内容 | `input` \| `spinner` | `input` |
| disabled | 是否禁用 | `boolean` | ConfigProvider disabled |
| readOnly | 是否只读 | `boolean` | `false` |
| status | 校验状态 | `error` \| `warning` | - |
| variant | 输入框变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| bordered | 是否显示边框，设为 `false` 时等同 `borderless` | `boolean` | `true` |
| min | 最小值 | `number` | - |
| max | 最大值 | `number` | - |
| step | 每次改变步数 | `number` \| `string` | `1` |
| precision | 数值精度，也会影响默认显示的小数位补齐 | `number` | - |
| decimalSeparator | 默认显示和解析使用的小数分隔符 | `string` | `.` |
| stringMode | 使用字符串值处理高精度小数 | `boolean` | `false` |
| formatter | 展示值格式化函数 | `(value?: number \| string, info: { userTyping: boolean; input: string }) => string` | - |
| parser | 展示值解析函数 | `(displayValue: string) => number \| string \| undefined` | - |
| keyboard | 是否启用方向键步进 | `boolean` | `true` |
| controls | 是否显示控制按钮，支持自定义上下按钮内容；禁用或只读时不显示 | `boolean` \| `{ upIcon?: VNodeChild; downIcon?: VNodeChild }` | `true` |
| changeOnBlur | 输入框失焦时提交输入变化；设为 `false` 时输入即提交 | `boolean` | `true` |
| changeOnWheel | 是否启用鼠标滚轮步进 | `boolean` | `false` |
| className | 数字输入框根节点兼容 class | `string` | - |
| rootClassName | 数字输入框根节点 class | `string` | - |
| style | 数字输入框根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数形式 | `InputNumberSemanticRecord<string> \| ((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<string>)` | - |
| styles | 语义化结构样式，支持对象或函数形式 | `InputNumberSemanticRecord<StyleValue> \| ((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<StyleValue>)` | - |

除组件已声明的属性外，原生 `<input>` 属性与监听器会透传到内部输入框，例如 `name`、`autocomplete`、`pattern`、`aria-*`、`@blur`；组件上的 `class`、`style` 和鼠标事件（如 `@click`、`@mousedown`、`@mousemove`）保留在根节点。`@input` 为组件事件，返回当前原始输入文本。

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 数字值变化时触发，`stringMode` 下返回字符串 | `(value: number \| string \| undefined) => void` |
| change | 数字值变化时触发，`stringMode` 下返回字符串 | `(value: number \| string \| undefined) => void` |
| pressEnter | 按下回车时触发 | `(event: KeyboardEvent) => void` |
| input | 输入框内容变化时触发，返回当前原始输入文本 | `(value: string) => void` |
| step | 控制按钮、键盘或滚轮步进时触发，`stringMode` 下 value 返回字符串 | `(value: number \| string, info: { offset: number; type: 'up' \| 'down'; emitter: 'handler' \| 'keyboard' \| 'wheel' }) => void` |

## Methods

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框，支持控制光标位置 | `(option?: { preventScroll?: boolean; cursor?: 'start' \| 'end' \| 'all' }) => void` |
| blur | 移除输入框焦点 | `() => void` |
| nativeElement | 数字输入框根 DOM 元素 | `HTMLElement \| undefined` |

## Slots

| 名称 | 说明 |
| --- | --- |
| prefix | 输入框前缀内容 |
| suffix | 输入框后缀内容 |
| increaseIcon | 自定义增加按钮内容 |
| decreaseIcon | 自定义减少按钮内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 数字输入框根容器 |
| input | 原生输入控件 |
| prefix | 前缀容器 |
| suffix | 后缀容器 |
| actions | 步进按钮组容器 |
| action | 单个步进按钮 |

## InputNumberSemanticInfo

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| props | 当前 InputNumber props，只读传入语义化函数 | `Readonly<Record<string, unknown>>` |

## Theme Tokens

- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-bg`
- `--aheart-control-height`
- `--aheart-radius`
