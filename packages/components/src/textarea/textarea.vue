<template>
  <span class="aheart-textarea" :class="textareaClass" :style="textareaStyle">
    <textarea
      class="aheart-textarea__control"
      :class="controlClass"
      :style="controlStyle"
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
      v-if="showClear"
      :class="clearClass"
      :style="clearStyle"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      <slot name="clearIcon">{{ clearIconContent }}</slot>
    </button>
    <span v-if="showCountDisplay" :class="countClass" :style="countStyle">{{ countText }}</span>
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
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const hasAutoSize = computed(() => Boolean(props.autoSize))
const allowClearConfig = computed(() =>
  typeof props.allowClear === 'object' && props.allowClear !== null ? props.allowClear : undefined
)
const showClear = computed(() => Boolean(props.allowClear) && !isDisabled.value && Boolean(currentValue.value))
const clearIconContent = computed(() => allowClearConfig.value?.clearIcon ?? '×')

const textareaClass = computed(() => [
  `aheart-textarea--${resolvedSize.value}`,
  `aheart-textarea--${resolvedVariant.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    [`aheart-textarea--${props.status}`]: props.status,
    'is-autosize': hasAutoSize.value,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])

const autoSizeStyle = computed(() => {
  if (!props.autoSize || typeof props.autoSize === 'boolean') {
    return undefined
  }

  return {
    ...(props.autoSize.minRows ? { '--aheart-textarea-min-rows': props.autoSize.minRows } : {}),
    ...(props.autoSize.maxRows ? { '--aheart-textarea-max-rows': props.autoSize.maxRows } : {})
  }
})
const textareaStyle = computed(() => [autoSizeStyle.value, props.style, props.styles?.root])
const controlClass = computed(() => props.classNames?.textarea)
const controlStyle = computed(() => props.styles?.textarea)
const clearClass = computed(() => ['aheart-textarea__clear', props.classNames?.clear])
const clearStyle = computed(() => props.styles?.clear)
const countClass = computed(() => ['aheart-textarea__count', props.classNames?.count])
const countStyle = computed(() => props.styles?.count)

const countLength = computed(() => props.count?.strategy?.(currentValue.value) ?? currentValue.value.length)
const countMaxLength = computed(() => props.count?.max ?? props.maxlength)
const countInfo = computed(() => ({
  count: countLength.value,
  maxLength: countMaxLength.value,
  value: currentValue.value
}))
const showCountFormatter = computed(() =>
  typeof props.showCount === 'object' && props.showCount !== null ? props.showCount.formatter : undefined
)
const showCountDisplay = computed(() => {
  if (props.count?.show === false) {
    return false
  }

  return Boolean(props.showCount) || props.count?.show === true || typeof props.count?.show === 'function'
})
const countText = computed(() => {
  if (typeof props.count?.show === 'function') {
    return props.count.show(countInfo.value)
  }

  if (showCountFormatter.value) {
    return showCountFormatter.value(countInfo.value)
  }

  return countMaxLength.value ? `${countLength.value} / ${countMaxLength.value}` : String(countLength.value)
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
