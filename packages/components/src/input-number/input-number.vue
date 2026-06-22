<template>
  <span class="aheart-input-number" :class="inputNumberClass">
    <input
      class="aheart-input-number__control"
      type="number"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
    />
    <span v-if="controls" class="aheart-input-number__controls">
      <button
        class="aheart-input-number__increase"
        type="button"
        aria-label="Increase"
        :disabled="isDisabled"
        @click="handleStep(step)"
      >
        +
      </button>
      <button
        class="aheart-input-number__decrease"
        type="button"
        aria-label="Decrease"
        :disabled="isDisabled"
        @click="handleStep(-step)"
      >
        −
      </button>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { inputNumberEmits, inputNumberProps } from './types'
import './style.css'

defineOptions({
  name: 'AInputNumber'
})

const props = defineProps(inputNumberProps)
const emit = defineEmits(inputNumberEmits)
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const displayValue = computed(() => (props.modelValue === undefined ? '' : String(props.modelValue)))

const inputNumberClass = computed(() => [
  `aheart-input-number--${resolvedSize.value}`,
  {
    'is-disabled': isDisabled.value
  }
])

const clampValue = (value: number) => {
  if (props.min !== undefined && value < props.min) {
    return props.min
  }

  if (props.max !== undefined && value > props.max) {
    return props.max
  }

  return value
}

const emitValue = (value: number | undefined) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value

  if (rawValue === '') {
    emitValue(undefined)
    return
  }

  const parsedValue = Number(rawValue)

  if (!Number.isNaN(parsedValue)) {
    emitValue(clampValue(parsedValue))
  }
}

const handleStep = (offset: number) => {
  if (isDisabled.value) {
    return
  }

  emitValue(clampValue((props.modelValue ?? 0) + offset))
}
</script>
