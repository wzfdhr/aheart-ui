<script setup lang="ts">
import { ref } from 'vue'
const value = ref('09:30')
</script>

# TimePicker <span class="aheart-status aheart-status--ready">Ready</span>

Choose one time of day.

## Basic Usage

<ATimePicker v-model="value" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('09:30')
</script>

<template><ATimePicker v-model="value" /></template>
```

## Time Step And Disabled Times

```vue
<ATimePicker :minute-step="30" :disabled-time="time => time < '09:00'" />
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Controlled time value. | `string` | - |
| defaultValue | Initial uncontrolled time. | `string` | - |
| minuteStep | Minute interval. | `number` | `15` |
| disabledTime | Marks times unavailable. | `(time: string) => boolean` | - |
| disabled | Disables the picker. | `boolean` | `false` |
| readOnly | Makes the input read-only. | `boolean` | `false` |

| Event | Description |
| --- | --- |
| update:modelValue | Emitted when the time changes. |
| change | Emitted when the time changes. |
