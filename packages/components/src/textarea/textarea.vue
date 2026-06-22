<template>
  <span class="aheart-textarea" :class="textareaClass">
    <textarea
      class="aheart-textarea__control"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="isDisabled"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
    />
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

const textareaClass = computed(() => [
  `aheart-textarea--${resolvedSize.value}`,
  {
    [`aheart-textarea--${props.status}`]: props.status,
    'is-autosize': props.autoSize,
    'is-disabled': isDisabled.value
  }
])

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
</script>
