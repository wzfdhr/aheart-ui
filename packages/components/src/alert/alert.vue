<template>
  <div v-if="!closed" class="aheart-alert" :class="alertClass" :style="rootStyle" :role="role">
    <span v-if="effectiveShowIcon" :class="iconClass" :style="iconStyle" aria-hidden="true">
      <slot name="icon">
        <ARenderNode :node="iconText" />
      </slot>
    </span>
    <div :class="contentClass" :style="contentStyle">
      <div v-if="hasTitle" :class="titleClass" :style="titleStyle">
        <ARenderNode :node="effectiveTitle" />
      </div>
      <div v-if="hasDescription" :class="descriptionClass" :style="descriptionStyle">
        <slot>
          <ARenderNode :node="description" />
        </slot>
      </div>
    </div>
    <div v-if="hasAction" :class="actionClass" :style="actionStyle">
      <slot name="action">
        <ARenderNode :node="action" />
      </slot>
    </div>
    <button
      v-if="isClosable"
      :class="closeClass"
      :style="closeStyle"
      type="button"
      :aria-label="closeAriaLabel"
      :aria-labelledby="closeAriaLabelledby"
      :aria-describedby="closeAriaDescribedby"
      @click="handleClose"
    >
      <slot name="closeIcon">
        <ARenderNode :node="resolvedCloseIcon" />
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, ref, useSlots, type VNodeChild } from 'vue'
import { alertEmits, alertProps, type AlertClosableConfig } from './types'
import './style.css'

defineOptions({
  name: 'AAlert'
})

const props = defineProps(alertProps)
const emit = defineEmits(alertEmits)
const slots = useSlots()
const closed = ref(false)

const ARenderNode = defineComponent({
  name: 'AAlertRenderNode',
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

const iconMap = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×'
}

const hasRenderable = (value: unknown) => value !== undefined && value !== null && value !== false && value !== ''
const isClosableConfig = (value: boolean | AlertClosableConfig): value is AlertClosableConfig => {
  return typeof value === 'object' && value !== null
}

const effectiveType = computed(() => props.type ?? (props.banner ? 'warning' : 'info'))
const effectiveTitle = computed(() => props.title ?? props.message)
const hasTitle = computed(() => hasRenderable(effectiveTitle.value))
const effectiveShowIcon = computed(() => props.showIcon ?? props.banner)
const iconText = computed(() => props.icon ?? iconMap[effectiveType.value])
const hasDescription = computed(() => Boolean(slots.default) || hasRenderable(props.description))
const hasAction = computed(() => Boolean(slots.action) || hasRenderable(props.action))
const isClosable = computed(() => props.closable !== false)
const closableConfig = computed(() => (isClosableConfig(props.closable) ? props.closable : undefined))
const resolvedCloseIcon = computed(() => closableConfig.value?.closeIcon ?? props.closeIcon ?? '×')
const closeAriaLabel = computed(() => closableConfig.value?.ariaLabel ?? 'Close')
const closeAriaLabelledby = computed(() => closableConfig.value?.ariaLabelledby)
const closeAriaDescribedby = computed(() => closableConfig.value?.ariaDescribedby)

const rootStyle = computed(() => [props.style, props.styles?.root])
const iconStyle = computed(() => props.styles?.icon)
const contentStyle = computed(() => [props.styles?.content, props.styles?.section])
const titleStyle = computed(() => props.styles?.title)
const descriptionStyle = computed(() => props.styles?.description)
const actionStyle = computed(() => [props.styles?.action, props.styles?.actions])
const closeStyle = computed(() => props.styles?.close)

const alertClass = computed(() => [
  `aheart-alert--${effectiveType.value}`,
  `aheart-alert--variant-${props.variant}`,
  {
    'aheart-alert--banner': props.banner,
    'aheart-alert--with-description': hasDescription.value,
    'aheart-alert--closable': isClosable.value
  },
  props.className,
  props.rootClassName,
  props.classNames?.root
])

const iconClass = computed(() => ['aheart-alert__icon', props.classNames?.icon])
const contentClass = computed(() => ['aheart-alert__content', props.classNames?.content, props.classNames?.section])
const titleClass = computed(() => ['aheart-alert__message', props.classNames?.title])
const descriptionClass = computed(() => ['aheart-alert__description', props.classNames?.description])
const actionClass = computed(() => ['aheart-alert__action', props.classNames?.action, props.classNames?.actions])
const closeClass = computed(() => ['aheart-alert__close', props.classNames?.close])

const handleClose = (event: MouseEvent) => {
  emit('close', event)
  closableConfig.value?.onClose?.(event)
  closed.value = true
  emit('afterClose')
  closableConfig.value?.afterClose?.()
}
</script>
