<template>
  <span class="aheart-textarea" :class="textareaClass" :style="textareaStyle">
    <textarea
      class="aheart-textarea__control"
      :id="id"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="isDisabled"
      :readonly="readOnly"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @keydown="handleKeydown"
    />
    <button
      v-if="allowClear && !isDisabled && modelValue"
      class="aheart-textarea__clear"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      ×
    </button>
    <span v-if="showCount" class="aheart-textarea__count">{{ countText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { textareaEmits, textareaProps } from './types'
import './style.css'

defineOptions({
  name: 'ATextarea'
})

const props = defineProps(textareaProps)
const emit = defineEmits(textareaEmits)
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const currentValue = computed(() => props.modelValue ?? '')
const resolvedVariant = computed(() => props.variant ?? (props.bordered === false ? 'borderless' : 'outlined'))
const hasAutoSize = computed(() => Boolean(props.autoSize))

const textareaClass = computed(() => [
  `aheart-textarea--${resolvedSize.value}`,
  `aheart-textarea--${resolvedVariant.value}`,
  {
    [`aheart-textarea--${props.status}`]: props.status,
    'is-autosize': hasAutoSize.value,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])

const textareaStyle = computed(() => {
  if (!props.autoSize || typeof props.autoSize === 'boolean') {
    return undefined
  }

  return {
    ...(props.autoSize.minRows ? { '--aheart-textarea-min-rows': props.autoSize.minRows } : {}),
    ...(props.autoSize.maxRows ? { '--aheart-textarea-max-rows': props.autoSize.maxRows } : {})
  }
})

const countText = computed(() => {
  const length = currentValue.value.length
  return props.maxlength ? `${length} / ${props.maxlength}` : String(length)
})

const getEventValue = (event: Event) => (event.target as HTMLTextAreaElement).value

const handleInput = (event: Event) => {
  const value = getEventValue(event)
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  emit('change', getEventValue(event))
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('pressEnter', event)
  }
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
}
</script>
