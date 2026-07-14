<script setup lang="ts">
import { ref } from 'vue'
const value = ref('2026-07-14')
</script>

# DatePicker <span class="aheart-status aheart-status--ready">Ready</span>

Choose a single date by typing or from the calendar panel.

## Basic Usage

<ADatePicker v-model="value" />

```vue
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('2026-07-14')
</script>

<template><ADatePicker v-model="value" /></template>
```

## Disabled Dates

```vue
<ADatePicker :disabled-date="date => date.getDay() === 0 || date.getDay() === 6" />
```

With the input focused, arrows move by day or week, Enter selects, and Escape closes the panel.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Controlled date value. | `string` | - |
| defaultValue | Initial uncontrolled date. | `string` | - |
| format | Date format. | `string` | `YYYY-MM-DD` |
| placeholder | Input placeholder. | `string` | `Select date` |
| disabledDate | Marks calendar dates unavailable. | `(date: Date) => boolean` | - |
| disabled | Disables the picker. | `boolean` | `false` |
| readOnly | Makes the input read-only. | `boolean` | `false` |

| Event | Description |
| --- | --- |
| update:modelValue | Emitted when the date value changes. |
| change | Emitted when the date value changes. |
