<template>
  <span class="aheart-date-picker">
    <input
      class="aheart-date-picker__input"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      @focus="open = true"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <div v-if="open" class="aheart-date-picker__panel" role="dialog" aria-label="Choose date">
      <div class="aheart-date-picker__header">
        <button type="button" aria-label="Previous month" @click="moveMonth(-1)">‹</button>
        <span>{{ viewYear }}-{{ String(viewMonth + 1).padStart(2, '0') }}</span>
        <button type="button" aria-label="Next month" @click="moveMonth(1)">›</button>
      </div>
      <div class="aheart-date-picker__weekdays" aria-hidden="true">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>
      <div class="aheart-date-picker__grid" role="grid">
        <button
          v-for="date in calendarDays"
          :key="date.key"
          type="button"
          :data-date="date.key"
          :disabled="date.disabled"
          :class="{ 'is-outside': !date.isCurrentMonth, 'is-selected': isSelected(date.value) }"
          role="gridcell"
          @click="selectDate(date.value)"
        >{{ date.value.getDate() }}</button>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatDate, parseDate, sameDate } from './date-utils'
import './style.css'

defineOptions({ name: 'ADatePicker' })

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  format?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  disabledDate?: (date: Date) => boolean
}>(), {
  format: 'YYYY-MM-DD',
  placeholder: 'Select date'
})
const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  change: [value: string | undefined]
}>()

const internalValue = ref(props.defaultValue)
const open = ref(false)
const selectedDate = computed(() => parseDate(props.modelValue ?? internalValue.value ?? '', props.format))
const currentDate = selectedDate.value ?? new Date()
const viewYear = ref(currentDate.getFullYear())
const viewMonth = ref(currentDate.getMonth())
const focusedDate = ref(currentDate)
const inputValue = computed(() => props.modelValue ?? internalValue.value ?? '')
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const calendarDays = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const start = new Date(viewYear.value, viewMonth.value, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const value = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    return {
      value,
      key: formatDate(value, 'YYYY-MM-DD'),
      isCurrentMonth: value.getMonth() === viewMonth.value,
      disabled: Boolean(props.disabledDate?.(value))
    }
  })
})

const moveMonth = (offset: number) => {
  const next = new Date(viewYear.value, viewMonth.value + offset, 1)
  viewYear.value = next.getFullYear()
  viewMonth.value = next.getMonth()
}
const isSelected = (date: Date) => sameDate(date, selectedDate.value)
const updateValue = (value: string | undefined) => {
  if (props.modelValue === undefined) internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const selectDate = (date: Date) => {
  if (props.disabled || props.disabledDate?.(date)) return
  updateValue(formatDate(date, props.format))
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth()
  open.value = false
}
const moveFocus = (offset: number) => {
  const next = new Date(focusedDate.value.getFullYear(), focusedDate.value.getMonth(), focusedDate.value.getDate() + offset)
  focusedDate.value = next
  viewYear.value = next.getFullYear()
  viewMonth.value = next.getMonth()
}
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    open.value = false
    return
  }

  const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
  if (event.key in offsets) {
    event.preventDefault()
    open.value = true
    moveFocus(offsets[event.key])
    return
  }

  if (event.key === 'Enter' && open.value) {
    event.preventDefault()
    selectDate(focusedDate.value)
  }
}
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (!value) return updateValue(undefined)
  const date = parseDate(value, props.format)
  if (date && !props.disabledDate?.(date)) selectDate(date)
}
</script>
