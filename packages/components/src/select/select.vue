<template>
  <span class="aheart-select" :class="selectClass">
    <select
      class="aheart-select__control"
      :value="selectValue"
      :multiple="isMultiple"
      :disabled="isDisabled"
      @change="handleChange"
    >
      <option v-if="placeholder && !isMultiple" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <button
      v-if="allowClear && !isDisabled && hasValue"
      class="aheart-select__clear"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { selectEmits, selectProps, type SelectValue } from './types'
import './style.css'

defineOptions({
  name: 'ASelect'
})

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)
const config = useAheartConfig()

const normalizedOptions = computed(() => props.options ?? [])
const isMultiple = computed(() => props.mode === 'multiple')
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const selectValue = computed(() => {
  if (isMultiple.value) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }

  return typeof props.modelValue === 'string' ? props.modelValue : ''
})

const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0
  }

  return Boolean(props.modelValue)
})

const selectClass = computed(() => [
  `aheart-select--${resolvedSize.value}`,
  {
    [`aheart-select--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-multiple': isMultiple.value
  }
])

const emitValue = (value: SelectValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement

  if (isMultiple.value) {
    emitValue(Array.from(target.selectedOptions).map((option) => option.value))
    return
  }

  emitValue(target.value)
}

const handleClear = () => {
  const value = isMultiple.value ? [] : ''
  emit('update:modelValue', value)
  emit('change', value)
  emit('clear')
}
</script>
