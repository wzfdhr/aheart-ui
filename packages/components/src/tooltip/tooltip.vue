<template>
  <span
    class="aheart-tooltip"
    :class="tooltipClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      class="aheart-tooltip__trigger"
      :class="triggerClass"
      :style="triggerStyle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
      @click="handleClick"
      @contextmenu="handleContextmenu"
    >
      <slot />
    </span>
    <span
      v-if="shouldRenderPopup"
      v-show="visible"
      class="aheart-tooltip__popup"
      :class="popupClass"
      :style="popupStyle"
      role="tooltip"
    >
      <span
        v-if="showArrow"
        class="aheart-floating__arrow aheart-tooltip__arrow"
        :class="arrowClass"
        :style="arrowStyle"
        aria-hidden="true"
      />
      <span class="aheart-tooltip__container" :class="containerClass" :style="containerStyle">
        <span class="aheart-tooltip__content" :class="contentClass" :style="contentStyle">
          <slot name="title">{{ title }}</slot>
        </span>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import { getFloatingPopupStyle, normalizeFloatingTriggers } from '../utils/floating'
import '../utils/floating.css'
import { tooltipEmits, tooltipProps } from './types'
import './style.css'

defineOptions({
  name: 'ATooltip'
})

const props = defineProps(tooltipProps)
const emit = defineEmits(tooltipEmits)
const slots = useSlots()

const innerOpen = ref(props.defaultOpen)
const hasRenderedPopup = ref(Boolean(props.defaultOpen || props.open))
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const hasTitle = computed(() => Boolean(props.title || slots.title))
const visible = computed(() => hasTitle.value && mergedOpen.value)
const shouldRenderPopup = computed(() => hasTitle.value && (visible.value || (!props.destroyOnHidden && hasRenderedPopup.value)))
const tooltipClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-open': visible.value
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const triggerClass = computed(() => props.classNames?.trigger)
const triggerStyle = computed(() => props.styles?.trigger)
const popupClass = computed(() => [`aheart-floating--${props.placement}`, props.overlayClassName, props.classNames?.popup])
const popupStyle = computed(() => [getFloatingPopupStyle(props.color, props.zIndex), props.overlayStyle, props.styles?.popup])
const containerClass = computed(() => props.classNames?.container)
const containerStyle = computed(() => [props.overlayInnerStyle, props.styles?.container])
const contentClass = computed(() => props.classNames?.content)
const contentStyle = computed(() => props.styles?.content)
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  props.classNames?.arrow,
  {
    'aheart-tooltip__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => props.styles?.arrow)

let enterTimer: ReturnType<typeof setTimeout> | undefined
let leaveTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.defaultOpen,
  (open) => {
    if (!isControlled.value) {
      innerOpen.value = open
    }
  }
)

watch(
  visible,
  (open) => {
    if (open) {
      hasRenderedPopup.value = true
    }
  },
  { immediate: true }
)

const clearTimers = () => {
  if (enterTimer) {
    clearTimeout(enterTimer)
    enterTimer = undefined
  }

  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = undefined
  }
}

const requestOpen = (open: boolean) => {
  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

const requestOpenWithDelay = (open: boolean, delay: number) => {
  clearTimers()

  if (delay > 0) {
    const timer = setTimeout(() => requestOpen(open), delay * 1000)
    if (open) {
      enterTimer = timer
    } else {
      leaveTimer = timer
    }
    return
  }

  requestOpen(open)
}

const handleMouseEnter = () => {
  if (normalizedTriggers.value.has('hover')) {
    requestOpenWithDelay(true, props.mouseEnterDelay)
  }
}

const handleMouseLeave = () => {
  if (normalizedTriggers.value.has('hover')) {
    requestOpenWithDelay(false, props.mouseLeaveDelay)
  }
}

const handleFocusIn = () => {
  if (normalizedTriggers.value.has('focus')) {
    requestOpen(true)
  }
}

const handleFocusOut = () => {
  if (normalizedTriggers.value.has('focus')) {
    requestOpen(false)
  }
}

const handleClick = () => {
  if (normalizedTriggers.value.has('click')) {
    requestOpen(!mergedOpen.value)
  }
}

const handleContextmenu = (event: MouseEvent) => {
  if (normalizedTriggers.value.has('contextMenu')) {
    event.preventDefault()
    requestOpen(true)
  }
}

onBeforeUnmount(clearTimers)
</script>
