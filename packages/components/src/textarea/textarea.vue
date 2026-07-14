<template>
  <span class="aheart-textarea" :class="textareaClass" :style="textareaStyle">
    <textarea
      ref="textareaRef"
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
      :aria-invalid="props.status === 'error' || countExceeded ? 'true' : undefined"
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
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { usePropPresence } from '../utils/use-prop-presence'
import { textareaEmits, textareaProps } from './types'
import './style.css'

defineOptions({
  name: 'ATextarea'
})

const props = defineProps(textareaProps)
const emit = defineEmits(textareaEmits)
const config = useAheartConfig()
const textareaRef = ref<HTMLTextAreaElement>()

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
const draftValue = ref(formatExceededValue(props.modelValue ?? ''))
const isControlled = usePropPresence('modelValue', 'model-value')

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const currentValue = computed(() => formatExceededValue(isControlled.value ? props.modelValue ?? '' : draftValue.value))
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const hasAutoSize = computed(() => Boolean(props.autoSize))
const allowClearConfig = computed(() =>
  typeof props.allowClear === 'object' && props.allowClear !== null ? props.allowClear : undefined
)
const allowClearDisabled = computed(() => allowClearConfig.value?.disabled ?? false)
const showClear = computed(
  () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && !props.readOnly && Boolean(currentValue.value)
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
    'is-readonly': props.readOnly,
    'has-clear': showClear.value,
    'has-count': showCountDisplay.value,
    'is-count-exceeded': countExceeded.value
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
const countExceeded = computed(
  () => countMaxLength.value !== undefined && countLength.value > countMaxLength.value
)
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

const resizeTextarea = () => {
  const textarea = textareaRef.value
  if (!textarea || !props.autoSize || typeof window === 'undefined') {
    return
  }

  textarea.style.height = 'auto'
  const style = window.getComputedStyle(textarea)
  const fontSize = Number.parseFloat(style.fontSize) || 14
  const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.5715
  const verticalPadding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0)
  const config = typeof props.autoSize === 'object' ? props.autoSize : undefined
  const minHeight = config?.minRows ? config.minRows * lineHeight + verticalPadding : 0
  const maxHeight = config?.maxRows ? config.maxRows * lineHeight + verticalPadding : Number.POSITIVE_INFINITY
  const contentHeight = Math.max(textarea.scrollHeight, minHeight)
  const height = Math.min(contentHeight, maxHeight)

  textarea.style.height = `${Math.round(height * 100) / 100}px`
  textarea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
}

const scheduleResize = () => {
  void nextTick(resizeTextarea)
}

const handleInput = (event: Event) => {
  const value = getEventValue(event)
  if (!isControlled.value) draftValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
  if (isControlled.value) (event.target as HTMLTextAreaElement).value = currentValue.value
  scheduleResize()
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
  if (isDisabled.value || props.readOnly || allowClearDisabled.value) return
  if (!isControlled.value) draftValue.value = ''
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
  scheduleResize()
}

watch(
  () => props.modelValue,
  (value) => {
    draftValue.value = formatExceededValue(value ?? '')
    scheduleResize()
  }
)
watch(() => props.autoSize, scheduleResize, { deep: true })
onMounted(resizeTextarea)
</script>
