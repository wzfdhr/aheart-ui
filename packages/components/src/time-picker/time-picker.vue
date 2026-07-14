<template>
  <span class="aheart-time-picker">
    <input
      class="aheart-time-picker__input"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      @focus="open = true"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <div v-if="open" class="aheart-time-picker__panel" role="listbox" aria-label="Choose time">
      <button
        v-for="time in times"
        :key="time"
        type="button"
        :data-time="time"
        :disabled="Boolean(disabledTime?.(time))"
        :class="{ 'is-selected': time === inputValue }"
        role="option"
        :aria-selected="time === inputValue"
        @click="selectTime(time)"
      >{{ time }}</button>
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import './style.css'

defineOptions({ name: 'ATimePicker' })

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  minuteStep?: number
  disabledTime?: (value: string) => boolean
}>(), {
  placeholder: 'Select time',
  minuteStep: 15
})
const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  change: [value: string | undefined]
}>()

const internalValue = ref(props.defaultValue)
const open = ref(false)
const inputValue = computed(() => props.modelValue ?? internalValue.value ?? '')
const times = computed(() => {
  const step = Math.max(1, Math.min(60, props.minuteStep))
  return Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: Math.ceil(60 / step) }, (_, index) => {
      const minute = index * step
      return minute < 60 ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` : undefined
    }).filter((time): time is string => time !== undefined)
  ).flat()
})
const focusedIndex = ref(0)
const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
const updateValue = (value: string | undefined) => {
  if (props.modelValue === undefined) internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const selectTime = (time: string) => {
  if (props.disabled || props.disabledTime?.(time)) return
  updateValue(time)
  open.value = false
}
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    open.value = false
    return
  }

  const currentIndex = Math.max(0, times.value.indexOf(inputValue.value))
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault()
    open.value = true
    focusedIndex.value = Math.min(times.value.length - 1, currentIndex + 1)
    return
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault()
    open.value = true
    focusedIndex.value = Math.max(0, currentIndex - 1)
    return
  }
  if (event.key === 'Enter' && open.value) {
    event.preventDefault()
    selectTime(times.value[focusedIndex.value])
  }
}
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  if (!value) return updateValue(undefined)
  if (isTime(value) && !props.disabledTime?.(value)) selectTime(value)
}
</script>
