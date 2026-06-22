<template>
  <span
    class="aheart-popover"
    :class="{ 'is-open': visible }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      class="aheart-popover__trigger"
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
      class="aheart-popover__popup"
      :class="`aheart-floating--${placement}`"
      :style="popupStyle"
      role="dialog"
    >
      <span v-if="arrow" class="aheart-floating__arrow aheart-popover__arrow" aria-hidden="true" />
      <span v-if="hasTitle" class="aheart-popover__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span v-if="hasContent" class="aheart-popover__content">
        <slot name="content">{{ content }}</slot>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { getFloatingPopupStyle, normalizeFloatingTriggers } from '../utils/floating'
import '../utils/floating.css'
import { popoverEmits, popoverProps } from './types'
import './style.css'

defineOptions({
  name: 'APopover'
})

const props = defineProps(popoverProps)
const emit = defineEmits(popoverEmits)
const slots = useSlots()

const innerOpen = ref(props.defaultOpen)
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const hasTitle = computed(() => Boolean(props.title || slots.title))
const hasContent = computed(() => Boolean(props.content || slots.content))
const visible = computed(() => (hasTitle.value || hasContent.value) && mergedOpen.value)
const popupStyle = computed(() => getFloatingPopupStyle(props.color, props.zIndex))

watch(
  () => props.defaultOpen,
  (open) => {
    if (!isControlled.value) {
      innerOpen.value = open
    }
  }
)

const requestOpen = (open: boolean) => {
  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

const handleMouseEnter = () => {
  if (normalizedTriggers.value.has('hover')) {
    requestOpen(true)
  }
}

const handleMouseLeave = () => {
  if (normalizedTriggers.value.has('hover')) {
    requestOpen(false)
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
</script>
