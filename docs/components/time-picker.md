<script setup lang="ts">
import { ref } from 'vue'
const value = ref('09:30')
</script>

# TimePicker 时间选择器 <span class="aheart-status aheart-status--ready">Ready</span>

选择一天中的一个时间。

## 基础用法

<ATimePicker v-model="value" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('09:30')
</script>

<template><ATimePicker v-model="value" /></template>
```

## 时间间隔与禁用

```vue
<ATimePicker :minute-step="30" :disabled-time="time => time < '09:00'" />
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 受控时间值 | `string` | - |
| defaultValue | 非受控初始时间 | `string` | - |
| minuteStep | 分钟间隔 | `number` | `15` |
| disabledTime | 禁用时间 | `(time: string) => boolean` | - |
| disabled | 禁用选择器 | `boolean` | `false` |
| readOnly | 只读输入 | `boolean` | `false` |

| 事件 | 说明 |
| --- | --- |
| update:modelValue | 时间变化 |
| change | 时间变化 |
