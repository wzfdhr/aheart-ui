<template>
  <div v-if="!closed" class="aheart-alert" :class="alertClass" :style="rootStyle" :role="role">
    <span v-if="effectiveShowIcon" :class="iconClass" :style="iconStyle" aria-hidden="true">
      <slot name="icon">{{ iconText }}</slot>
    </span>
    <div :class="contentClass" :style="contentStyle">
      <div v-if="effectiveTitle" :class="titleClass" :style="titleStyle">{{ effectiveTitle }}</div>
      <div v-if="description || $slots.default" :class="descriptionClass" :style="descriptionStyle">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <div v-if="hasAction" :class="actionClass" :style="actionStyle">
      <slot name="action">{{ action }}</slot>
    </div>
    <button v-if="closable" :class="closeClass" :style="closeStyle" type="button" aria-label="Close" @click="handleClose">
      <slot name="closeIcon">{{ closeIcon || '×' }}</slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { alertEmits, alertProps } from './types'
import './style.css'

defineOptions({
  name: 'AAlert'
})

const props = defineProps(alertProps)
const emit = defineEmits(alertEmits)
const slots = useSlots()
const closed = ref(false)

const iconMap = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×'
}

const effectiveType = computed(() => props.type ?? (props.banner ? 'warning' : 'info'))
const effectiveTitle = computed(() => props.title ?? props.message)
const effectiveShowIcon = computed(() => props.showIcon ?? props.banner)
const iconText = computed(() => props.icon ?? iconMap[effectiveType.value])
const hasAction = computed(() => Boolean(props.action || slots.action))

const rootStyle = computed(() => [props.style, props.styles?.root])
const iconStyle = computed(() => props.styles?.icon)
const contentStyle = computed(() => props.styles?.content)
const titleStyle = computed(() => props.styles?.title)
const descriptionStyle = computed(() => props.styles?.description)
const actionStyle = computed(() => props.styles?.action)
const closeStyle = computed(() => props.styles?.close)

const alertClass = computed(() => [
  `aheart-alert--${effectiveType.value}`,
  `aheart-alert--variant-${props.variant}`,
  {
    'aheart-alert--banner': props.banner,
    'aheart-alert--with-description': Boolean(props.description || slots.default),
    'aheart-alert--closable': props.closable
  },
  props.className,
  props.rootClassName,
  props.classNames?.root
])

const iconClass = computed(() => ['aheart-alert__icon', props.classNames?.icon])
const contentClass = computed(() => ['aheart-alert__content', props.classNames?.content])
const titleClass = computed(() => ['aheart-alert__message', props.classNames?.title])
const descriptionClass = computed(() => ['aheart-alert__description', props.classNames?.description])
const actionClass = computed(() => ['aheart-alert__action', props.classNames?.action])
const closeClass = computed(() => ['aheart-alert__close', props.classNames?.close])

const handleClose = (event: MouseEvent) => {
  emit('close', event)
  closed.value = true
  emit('afterClose')
}
</script>
