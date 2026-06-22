<template>
  <span class="aheart-textarea" :class="textareaClass" :style="textareaStyle">
    <textarea
      class="aheart-textarea__control"
      :class="controlClass"
      :style="controlStyle"
      :id="id"
      :value="currentValue"
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
      <slot name="clearIcon">
        <ATextareaRenderNode :node="clearIconContent" />
      </slot>
    </button>
    <span v-if="showCountDisplay" :class="countClass" :style="countStyle">
      <ATextareaRenderNode :node="countText" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { textareaEmits, textareaProps } from './types'
import './style.css'

defineOptions({
  name: 'ATextarea'
})

const props = defineProps(textareaProps)
const emit = defineEmits(textareaEmits)
const config = useAheartConfig()

const ATextareaRenderNode = defineComponent({
  name: 'ATextareaRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const measureCount = (value: string) => props.count?.strategy?.(value) ?? value.length
const formatExceededValue = (value: string) => {
  const max = props.count?.max

  if (max === undefined || !props.count?.exceedFormatter || measureCount(value) <= max) {
    return value
  }

  return props.count.exceedFormatter(value, { max })
}

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const currentValue = computed(() => formatExceededValue(props.modelValue ?? ''))
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const hasAutoSize = computed(() => Boolean(props.autoSize))
const allowClearConfig = computed(() =>
  typeof props.allowClear === 'object' && props.allowClear !== null ? props.allowClear : undefined
)
const allowClearDisabled = computed(() => allowClearConfig.value?.disabled ?? false)
const showClear = computed(
  () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && Boolean(currentValue.value)
)
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

const countLength = computed(() => measureCount(currentValue.value))
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

const getEventValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = formatExceededValue(target.value)

  if (target.value !== value) {
    target.value = value
  }

  return value
}

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
