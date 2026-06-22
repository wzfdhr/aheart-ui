<template>
  <span class="aheart-input-number" :class="inputNumberClass">
    <span v-if="prefix" class="aheart-input-number__prefix">{{ prefix }}</span>
    <input
      class="aheart-input-number__control"
      :id="id"
      type="text"
      inputmode="decimal"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readOnly"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <span v-if="suffix" class="aheart-input-number__suffix">{{ suffix }}</span>
    <span v-if="controls" class="aheart-input-number__controls">
      <button
        class="aheart-input-number__increase"
        type="button"
        aria-label="Increase"
        :disabled="isInteractiveDisabled"
        @click="handleStep(step, 'up')"
      >
        +
      </button>
      <button
        class="aheart-input-number__decrease"
        type="button"
        aria-label="Decrease"
        :disabled="isInteractiveDisabled"
        @click="handleStep(-step, 'down')"
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
const resolvedVariant = computed(() => props.variant ?? (props.bordered === false ? 'borderless' : 'outlined'))
const isInteractiveDisabled = computed(() => isDisabled.value || props.readOnly)
const displayValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.modelValue)
  }

  return props.modelValue === undefined ? '' : String(props.modelValue)
})

const inputNumberClass = computed(() => [
  `aheart-input-number--${resolvedSize.value}`,
  `aheart-input-number--${resolvedVariant.value}`,
  {
    [`aheart-input-number--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])

const applyPrecision = (value: number) => {
  if (props.precision === undefined) {
    return value
  }

  return Number(value.toFixed(props.precision))
}

const clampValue = (value: number) => {
  const preciseValue = applyPrecision(value)

  if (props.min !== undefined && preciseValue < props.min) {
    return props.min
  }

  if (props.max !== undefined && preciseValue > props.max) {
    return props.max
  }

  return preciseValue
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

  const parsedValue = props.parser ? props.parser(rawValue) : Number(rawValue)

  if (parsedValue !== undefined && !Number.isNaN(parsedValue)) {
    emitValue(clampValue(parsedValue))
  }
}

const handleStep = (offset: number, type: 'up' | 'down') => {
  if (isInteractiveDisabled.value) {
    return
  }

  const nextValue = clampValue((props.modelValue ?? 0) + offset)
  emitValue(nextValue)
  emit('step', nextValue, { offset, type })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('pressEnter', event)
    return
  }

  if (!props.keyboard) {
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    handleStep(props.step, 'up')
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    handleStep(-props.step, 'down')
  }
}
</script>
