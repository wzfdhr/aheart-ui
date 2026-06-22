<template>
  <span
    class="aheart-tooltip"
    :class="{ 'is-open': visible }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      class="aheart-tooltip__trigger"
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
      v-if="visible"
      class="aheart-tooltip__popup"
      :class="`aheart-floating--${placement}`"
      :style="popupStyle"
      role="tooltip"
    >
      <span v-if="arrow" class="aheart-floating__arrow aheart-tooltip__arrow" aria-hidden="true" />
      <span class="aheart-tooltip__content">
        <slot name="title">{{ title }}</slot>
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
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const hasTitle = computed(() => Boolean(props.title || slots.title))
const visible = computed(() => hasTitle.value && mergedOpen.value)
const popupStyle = computed(() => getFloatingPopupStyle(props.color, props.zIndex))

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
  if (normalizedTriggers.value.has('contextmenu')) {
    event.preventDefault()
    requestOpen(true)
  }
}

onBeforeUnmount(clearTimers)
</script>
