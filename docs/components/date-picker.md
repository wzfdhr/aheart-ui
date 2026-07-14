<script setup lang="ts">
import { ref } from 'vue'
const value = ref('2026-07-14')
</script>

# DatePicker 日期选择器 <span class="aheart-status aheart-status--ready">Ready</span>

通过输入或日历面板选择单个日期。

## 基础用法

<ADatePicker v-model="value" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('2026-07-14')
</script>

<template><ADatePicker v-model="value" /></template>
```

## 禁用日期

```vue
<ADatePicker :disabled-date="date => date.getDay() === 0 || date.getDay() === 6" />
```

聚焦输入框后，方向键按日或周移动，Enter 选择，Escape 关闭面板。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 受控日期值 | `string` | - |
| defaultValue | 非受控初始日期 | `string` | - |
| format | 日期格式 | `string` | `YYYY-MM-DD` |
| placeholder | 输入提示 | `string` | `Select date` |
| disabledDate | 禁用日期 | `(date: Date) => boolean` | - |
| disabled | 禁用选择器 | `boolean` | `false` |
| readOnly | 只读输入 | `boolean` | `false` |

| 事件 | 说明 |
| --- | --- |
| update:modelValue | 日期值变化 |
| change | 日期值变化 |
