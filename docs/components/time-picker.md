<script setup lang="ts">
import { ref } from 'vue'

const timeValue = ref('09:30')
const steppedTime = ref('10:15:30')
const confirmedTime = ref('14:30')
const twelveHourTime = ref('02:30 PM')

const businessHours = {
  disabledHours: () => [0, 1, 2, 3, 4, 5, 22, 23],
  disabledMinutes: (hour: number) => hour === 12 ? [0, 5, 10] : [],
  disabledSeconds: () => [0, 15, 30, 45]
}
</script>

# TimePicker 时间选择器 <span class="aheart-status aheart-status--ready">Ready</span>

通过时、分、秒分栏选择一天中的时间，支持步长、确认、12 小时制和结构化禁用规则。

## 基础用法

<div class="aheart-demo-panel">
  <ATimePicker v-model="timeValue" allow-clear />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('09:30')
</script>

<template><ATimePicker v-model="value" /></template>
```

分钟默认按 1 分钟递增；只有业务明确需要时才配置更大的步长。

## 步长与秒

<div class="aheart-demo-panel">
  <ATimePicker
    v-model="steppedTime"
    format="HH:mm:ss"
    :hour-step="1"
    :minute-step="5"
    :second-step="10"
  />
</div>

```vue
<ATimePicker
  v-model="value"
  format="HH:mm:ss"
  :minute-step="5"
  :second-step="10"
/>
```

## 确认与此刻

<div class="aheart-demo-panel">
  <ATimePicker v-model="confirmedTime" need-confirm show-now />
</div>

```vue
<ATimePicker v-model="value" need-confirm show-now />
```

开启 `needConfirm` 后，选择分栏只更新面板草稿，点击“确定”才提交值。

## 12 小时制

<div class="aheart-demo-panel">
  <ATimePicker v-model="twelveHourTime" use12-hours format="hh:mm A" />
</div>

```vue
<ATimePicker v-model="value" use12-hours format="hh:mm A" />
```

## 禁用时间

<div class="aheart-demo-panel">
  <ATimePicker
    default-value="09:20:10"
    format="HH:mm:ss"
    :disabled-time="businessHours"
  />
</div>

```vue
<script setup lang="ts">
const disabledTime = {
  disabledHours: () => [0, 1, 2, 3, 4, 5, 22, 23],
  disabledMinutes: (hour: number) => hour === 12 ? [0, 5, 10] : [],
  disabledSeconds: () => [0, 15, 30, 45]
}
</script>

<template>
  <ATimePicker format="HH:mm:ss" :disabled-time="disabledTime" />
</template>
```

仍兼容 `(time: string) => boolean` 字符串禁用函数；复杂规则推荐使用结构化配置。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 受控时间值 | `string` | - |
| id | 时间输入框 id | `string` | - |
| labelledBy | 为输入框提供可访问名称的标签元素 id | `string` | - |
| ariaLabelledby | `labelledBy` 的兼容别名 | `string` | - |
| defaultValue | 非受控初始时间 | `string` | - |
| placeholder | 占位提示 | `string` | `Select time` |
| hourStep | 小时间隔 | `number` | `1` |
| minuteStep | 分钟间隔 | `number` | `1` |
| secondStep | 秒间隔 | `number` | `1` |
| format | 显示和输出格式 | `HH:mm` \| `HH:mm:ss` \| `hh:mm A` 等 | `HH:mm` |
| use12Hours | 是否使用 12 小时制 | `boolean` | `false` |
| allowClear | 是否显示清除按钮 | `boolean` | `true` |
| open | 受控浮层状态 | `boolean` | - |
| defaultOpen | 非受控初始展开状态 | `boolean` | `false` |
| placement | 浮层位置 | `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` | `bottomLeft` |
| autoAdjustOverflow | 是否自动翻转与避让 | `boolean` | `true` |
| getPopupContainer | 自定义浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| showNow | 是否显示“此刻”操作 | `boolean` | `true` |
| needConfirm | 是否需要点击确定后提交 | `boolean` | `false` |
| disabledTime | 结构化禁用规则或兼容的字符串禁用函数 | `DisabledTimeConfig \| (() => DisabledTimeConfig) \| ((time: string) => boolean)` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| readOnly | 是否只读 | `boolean` | `false` |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 时间变化 | `(value?: string) => void` |
| change | 时间变化 | `(value?: string) => void` |
| openChange | 浮层状态请求变化 | `(open: boolean) => void` |
| clear | 点击清除时触发 | `() => void` |
