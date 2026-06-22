<template>
  <span class="aheart-input" :class="inputClass">
    <span v-if="$slots.prefix" class="aheart-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      class="aheart-input__control"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
    />
    <button
      v-if="allowClear && !isDisabled && modelValue"
      class="aheart-input__clear"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      ×
    </button>
    <span v-if="$slots.suffix" class="aheart-input__suffix">
      <slot name="suffix" />
    </span>
    <span v-if="showCount" class="aheart-input__count">{{ countText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { inputEmits, inputProps } from './types'
import './style.css'

defineOptions({
  name: 'AInput'
})

const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const currentValue = computed(() => props.modelValue ?? '')

const inputClass = computed(() => [
  `aheart-input--${resolvedSize.value}`,
  {
    [`aheart-input--${props.status}`]: props.status,
    'is-disabled': isDisabled.value
  }
])

const countText = computed(() => {
  const length = currentValue.value.length
  return props.maxlength ? `${length} / ${props.maxlength}` : String(length)
})

const getEventValue = (event: Event) => (event.target as HTMLInputElement).value

const handleInput = (event: Event) => {
  const value = getEventValue(event)
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  emit('change', getEventValue(event))
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
}
</script>
