<script setup lang="ts">
import { ref } from 'vue'

const date = ref('2026-07-14')
const formatted = ref('2026-07-14')
const week = ref('2026-W29')
const month = ref('2026-07')
const quarter = ref('2026-Q3')
const year = ref('2026')
const multiple = ref(['2026-07-14', '2026-07-20'])
const dateTime = ref('2026-07-14 09:30:00')
const presetDate = ref<string>()
const today = new Date()
const pad = (value: number) => String(value).padStart(2, '0')
const todayValue = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
const thisMonthEnd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
</script>

# DatePicker 日期选择器 <span class="aheart-status aheart-status--ready">Ready</span>

面向企业表单与任务排期的日期选择器。显示格式与提交格式相互独立，对外始终输出字符串。

## 基础用法

<ADatePicker v-model="date" />

当前值：`{{ date }}`

```vue
<ADatePicker v-model="date" />
```

## 显示格式与输入掩码

<ADatePicker v-model="formatted" format="DD/MM/YYYY" value-format="YYYY-MM-DD" />

输入连续数字 `14072026` 时会自动整理为 `14/07/2026`，提交值仍为 `2026-07-14`。

```vue
<ADatePicker
  v-model="formatted"
  format="DD/MM/YYYY"
  value-format="YYYY-MM-DD"
/>
```

`format` 也可传入数组。第一个格式负责展示，其余格式仅用于兼容输入。

## 周、月、季度与年

<ASpace wrap>
  <ADatePicker v-model="week" picker="week" />
  <ADatePicker v-model="month" picker="month" />
  <ADatePicker v-model="quarter" picker="quarter" />
  <ADatePicker v-model="year" picker="year" />
</ASpace>

```vue
<ADatePicker v-model="week" picker="week" />
<ADatePicker v-model="month" picker="month" />
<ADatePicker v-model="quarter" picker="quarter" />
<ADatePicker v-model="year" picker="year" />
```

## 多选

<ADatePicker v-model="multiple" multiple />

多选值：`{{ multiple.join(', ') }}`

```vue
<ADatePicker v-model="multiple" multiple />
```

多选与 `showTime` 不可同时使用。开发环境检测到冲突时会给出警告，并优先保留多选日期能力。

## 日期与时间

<ADatePicker
  v-model="dateTime"
  :show-time="{ use12Hours: true, minuteStep: 5, secondStep: 10 }"
/>

```vue
<ADatePicker
  v-model="dateTime"
  :show-time="{ use12Hours: true, minuteStep: 5, secondStep: 10 }"
/>
```

开启 `showTime` 后默认提交格式为 `YYYY-MM-DD HH:mm:ss`。上例使用 12 小时制，因此输入框显示 `hh:mm:ss A`，但 `v-model` 仍保持 24 小时字符串；分钟只能按 5 分钟递进，秒按 10 秒递进。日期和时间先进入草稿，点击“确定”后一次提交；按 Escape 或点击外部会取消未确认草稿。

## 预设

<ADatePicker
  v-model="presetDate"
  :presets="[
    { label: '今天', value: () => todayValue },
    { label: '本月末', value: () => thisMonthEnd }
  ]"
/>

```vue
<ADatePicker
  v-model="value"
  :presets="[
    { label: '今天', value: () => todayValue },
    { label: '本月末', value: () => thisMonthEnd }
  ]"
/>
```

`todayValue` 与 `thisMonthEnd` 都是按 `valueFormat` 生成的字符串。预设回调同样不得返回原生 `Date` 或 Dayjs。

## 边界与禁用

<ADatePicker
  default-value="2026-07-14"
  min-date="2026-07-10"
  max-date="2026-07-25"
  :disabled-date="value => value.endsWith('-18')"
/>

```vue
<ADatePicker
  min-date="2026-07-10"
  max-date="2026-07-25"
  :disabled-date="value => value.endsWith('-18')"
/>
```

## 规格与状态

<ASpace direction="vertical" style="width: 100%">
  <ASpace wrap>
    <ADatePicker size="small" placeholder="小尺寸" />
    <ADatePicker placeholder="默认尺寸" />
    <ADatePicker size="large" placeholder="大尺寸" />
  </ASpace>
  <ASpace wrap>
    <ADatePicker variant="filled" placeholder="填充" />
    <ADatePicker variant="borderless" placeholder="无边框" />
    <ADatePicker variant="underlined" placeholder="下划线" />
    <ADatePicker status="warning" placeholder="警告" />
    <ADatePicker status="error" placeholder="错误" />
  </ASpace>
</ASpace>

聚焦输入框后，方向键移动活动日期，Enter 选择，Escape 关闭面板并恢复焦点。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / defaultValue | 受控值 / 非受控初始值 | `string \| string[]` | - |
| picker | 选择粒度 | `date \| week \| month \| quarter \| year` | `date` |
| multiple | 开启多选 | `boolean` | `false` |
| showTime | 日期时间组合配置 | `boolean \| PickerShowTimeOptions` | `false` |
| needConfirm | 选择后等待确认 | `boolean` | `showTime` 时为 `true` |
| presets | 快捷预设 | `PickerPreset[]` | - |
| format | 展示及可接受输入格式 | `string \| string[]` | 跟随 `picker` |
| valueFormat | `v-model` 字符串格式 | `string` | 跟随 `picker` |
| minDate / maxDate | 可选择日期边界 | `string` | - |
| disabledDate | 自定义禁用规则 | `(value: string, info) => boolean` | - |
| pickerValue / defaultPickerValue | 受控 / 非受控面板日期 | `string` | - |
| size | 控件尺寸 | `small \| middle \| large` | `middle` |
| status | 校验状态 | `warning \| error` | - |
| variant | 视觉变体 | `outlined \| filled \| borderless \| underlined` | `outlined` |
| prefix / suffixIcon | 前缀和后缀内容 | `VNodeChild` | - |
| allowClear | 允许清除 | `boolean` | `true` |
| open / defaultOpen | 受控 / 非受控弹层状态 | `boolean` | `false` |
| placement | 弹层方位 | `FloatingPlacement` | `bottomLeft` |
| autoAdjustOverflow | 自动翻转和边缘避让 | `boolean` | `true` |
| getPopupContainer | 自定义弹层容器 | `(trigger) => HTMLElement` | `document.body` |

`PickerShowTimeOptions` 支持 `format`、`hourStep`、`minuteStep`、`secondStep`、`use12Hours` 和字符串 `defaultValue`。步长不仅影响控件显示，也会约束最终提交值。

## 事件

| 事件 | 说明 |
| --- | --- |
| update:modelValue / change | 已提交值变化 |
| openChange | 弹层打开状态请求变化 |
| panelChange | 面板日期变化 |
| ok | 确认草稿 |
| clear | 清除值 |
| invalid | 输入无法解析或命中禁用规则 |

## 插槽与方法

提供 `prefix`、`suffix`、`cell`、`tag`、`footer` 插槽。组件实例暴露 `focus()` 与 `blur()`。

## 从旧版迁移

| 旧行为 | 新行为 |
| --- | --- |
| `format` 同时决定显示和提交值 | 使用 `format` 控制显示，`valueFormat` 控制提交字符串 |
| `disabledDate` 接收原生 `Date` | 接收按日规范化的 `YYYY-MM-DD` 字符串和模式信息 |
| 默认英文占位文案 | 默认读取 ConfigProvider 中文 locale |
| 面板使用组件内绝对定位 | 使用 Floating UI，支持 Teleport、翻转、边缘避让和离场动效 |
