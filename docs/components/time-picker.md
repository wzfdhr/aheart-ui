<script setup lang="ts">
import { ref } from 'vue'

const timeValue = ref('09:30:00')
const steppedTime = ref('10:15:30')
const confirmedTime = ref('14:30:00')
const twelveHourTime = ref('14:30:00')
const rangeValue = ref<[string | undefined, string | undefined]>(['09:00:00', '18:00:00'])
const nightShift = ref<[string | undefined, string | undefined]>(['22:00:00', '06:00:00'])

const businessHours = {
  disabledHours: () => [0, 1, 2, 3, 4, 5, 22, 23],
  disabledMinutes: (hour: number) => hour === 12 ? [0, 5, 10] : [],
  disabledSeconds: () => [0, 15, 30, 45]
}
</script>

# TimePicker 时间选择器 <span class="aheart-status aheart-status--ready">已完成</span>

通过时、分、秒分栏选择一天中的时间，支持单值、范围、步长、确认、12 小时制和结构化禁用规则。内部使用共享 Picker codec，对外始终保持字符串值。

## 基础用法

<div class="aheart-demo-panel">
  <ATimePicker v-model="timeValue" allow-clear />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('09:30:00')
</script>

<template><ATimePicker v-model="value" /></template>
```

默认格式为 `HH:mm:ss`，分钟和秒均按 1 递增；只有业务明确需要时才配置更大的步长。

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

开启 `needConfirm` 后，分栏选择、手动输入和滚动选择都只更新面板草稿，点击“确定”才提交值；按 Escape 或点击浮层外部会放弃草稿。

## 12 小时制

<div class="aheart-demo-panel">
  <ATimePicker v-model="twelveHourTime" use12-hours />
</div>

```vue
<ATimePicker v-model="value" use12-hours />
```

仅开启 `use12Hours` 时，输入框自动使用 `hh:mm:ss A`，并按运行时 locale 显示“上午 / 下午”；业务值仍保持默认的 `HH:mm:ss`。显式传入 `format` 可调整显示结构，`A` 仍使用本地化时段文案。

## 显示与输出格式

`format` 只控制输入框展示，`valueFormat` 控制 `v-model` 和事件输出。下面的界面显示 12 小时制，但业务值仍是 `HH:mm:ss`。

```vue
<ATimePicker v-model="value" format="hh:mm A" value-format="HH:mm:ss" use12-hours />
```

## 时间范围

<div class="aheart-demo-panel">
  <ATimeRangePicker v-model="rangeValue" />
  <span>{{ rangeValue.join(' 至 ') }}</span>
</div>

```vue
<ATimeRangePicker v-model="range" />
```

范围组件在同一浮层中编辑开始与结束时间，草稿会即时显示在两个输入框中，点击“确定”后统一提交。设置 `need-confirm="false"` 时，分栏、手动输入和预设会即时提交，且不显示确定按钮。默认自动校正先后顺序；夜班等跨日业务可设置 `order="false"`。

## 跨日与预设

<div class="aheart-demo-panel">
  <ATimeRangePicker
    v-model="nightShift"
    :order="false"
    :allow-empty="[false, true]"
    :presets="[{ label: '夜班', value: ['22:00:00', '06:00:00'] }]"
  />
</div>

```vue
<ATimeRangePicker
  v-model="range"
  :order="false"
  :allow-empty="[false, true]"
  :presets="[{ label: '夜班', value: ['22:00:00', '06:00:00'] }]"
/>
```

`allowEmpty` 分别控制开始端和结束端能否为空，可通过清除按钮或键盘删除形成开放端。控件尾部的清除按钮用于清空整个范围。`disabledTime(value, part)` 可按 `start` / `end` 返回布尔值或结构化禁用规则。

## 隐藏禁用项与滚动

```vue
<ATimePicker
  hide-disabled-options
  change-on-scroll
  :disabled-time="businessHours"
/>
```

`hideDisabledOptions` 会从分栏移除不可用选项；`changeOnScroll` 开启后，滚动居中的值会进入当前草稿。默认关闭，避免普通页面滚动误改时间。

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
| format | 输入框显示格式 | `HH:mm` \| `HH:mm:ss` \| `hh:mm A` 等 | `HH:mm:ss` |
| valueFormat | `v-model` 与事件输出格式 | `string` | `HH:mm:ss` |
| use12Hours | 是否使用 12 小时制；未显式设置 `format` 时显示为本地化 `hh:mm:ss A` | `boolean` | `false` |
| allowClear | 是否显示清除按钮 | `boolean` | `true` |
| open | 受控浮层状态 | `boolean` | - |
| defaultOpen | 非受控初始展开状态 | `boolean` | `false` |
| placement | 浮层位置 | `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` | `bottomLeft` |
| autoAdjustOverflow | 是否自动翻转与避让 | `boolean` | `true` |
| getPopupContainer | 自定义浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
| showNow | 是否显示“此刻”操作 | `boolean` | `true` |
| needConfirm | 是否需要点击确定后提交 | `boolean` | `false` |
| hideDisabledOptions | 是否隐藏禁用选项 | `boolean` | `false` |
| changeOnScroll | 滚动居中项是否进入选择 | `boolean` | `false` |
| size | 控件尺寸 | `small` \| `middle` \| `large` | `middle` |
| status | 校验状态 | `warning` \| `error` | - |
| variant | 视觉变体 | `outlined` \| `filled` \| `borderless` \| `underlined` | `outlined` |
| prefix / suffixIcon / clearIcon | 前缀与图标扩展 | `VNodeChild \| Component` | - |
| renderExtraFooter | 额外页脚内容 | `() => VNodeChild` | - |
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
| invalid | 输入无法解析或被禁用 | `(input: string) => void` |

### TimeRangePicker API

支持 `TimePicker.RangePicker` 与独立的 `TimeRangePicker` 导出，并继承单值组件的格式、步长、12 小时制、禁用、外观和浮层属性。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / defaultValue | 受控范围 / 非受控初始范围 | `[string?, string?]` | - |
| allowEmpty | 分端允许空值 | `[boolean, boolean]` | `[false, false]` |
| order | 是否自动按时间顺序校正 | `boolean` | `true` |
| separator | 输入间隔内容 | `VNodeChild` | 箭头 |
| presets | 快捷范围 | `PickerPreset<RangePickerValue>[]` | - |
| needConfirm | 是否统一确认后提交；关闭时选择、手输和预设即时提交 | `boolean` | `true` |
| disabledTime | 分端禁用规则 | `(value, part) => boolean \| DisabledTimeConfig` | - |

范围组件额外触发 `calendarChange(value, { range })` 与 `ok(value)`；实例暴露 `focus('start' | 'end')` 和 `blur()`。

## 迁移说明

本版本默认格式由 `HH:mm` 调整为 `HH:mm:ss`。需要保持分钟级旧值时，请同时设置 `format="HH:mm"` 与 `value-format="HH:mm"`。显示格式不再隐式决定业务输出格式。12 小时制的 `A` 标记现在按 ConfigProvider locale 显示，但 `valueFormat` 的业务输出不做本地化。
