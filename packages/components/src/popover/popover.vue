<template>
  <span
    ref="rootRef"
    class="aheart-popover"
    :class="popoverClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      ref="triggerRef"
      class="aheart-popover__trigger"
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
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <span
        v-if="shouldRenderPopup"
        v-show="visible"
        ref="popupRef"
        class="aheart-popover__popup"
        :class="popupClass"
        :style="popupStyle"
        role="dialog"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <span
          v-if="showArrow"
          class="aheart-floating__arrow aheart-popover__arrow"
          :class="arrowClass"
          :style="arrowStyle"
          aria-hidden="true"
        />
        <span class="aheart-popover__container" :class="containerClass" :style="containerStyle">
          <span v-if="hasTitle" class="aheart-popover__title" :class="titleClass" :style="titleStyle">
            <slot name="title">
              <ARenderNode :node="title" />
            </slot>
          </span>
          <span v-if="hasContent" class="aheart-popover__content" :class="contentClass" :style="contentStyle">
            <slot name="content">
              <ARenderNode :node="content" />
            </slot>
          </span>
        </span>
      </span>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType } from 'vue'
import { getFloatingPopupStyle, normalizeFloatingTriggers } from '../utils/floating'
import '../utils/floating.css'
import { popoverEmits, popoverProps, type PopoverContent } from './types'
import './style.css'

defineOptions({
  name: 'APopover'
})

const ARenderNode = defineComponent({
  name: 'APopoverRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<PopoverContent>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => (typeof renderProps.node === 'function' ? renderProps.node() : renderProps.node)
  }
})

const hasRenderable = (value: PopoverContent | undefined | null) => value !== undefined && value !== null && value !== false

const props = defineProps(popoverProps)
const emit = defineEmits(popoverEmits)
const slots = useSlots()

const innerOpen = ref(props.defaultOpen)
const hasRenderedPopup = ref(Boolean(props.defaultOpen || props.open))
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
let mouseEnterTimer: ReturnType<typeof setTimeout> | undefined
let mouseLeaveTimer: ReturnType<typeof setTimeout> | undefined

const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasContent = computed(() => Boolean(slots.content) || hasRenderable(props.content))
const hasPopupContent = computed(() => hasTitle.value || hasContent.value)
const visible = computed(() => hasPopupContent.value && mergedOpen.value)
const shouldRenderPopup = computed(() => hasPopupContent.value && (visible.value || (!props.destroyOnHidden && hasRenderedPopup.value)))
const getDefaultPopupContainer = () => (typeof document === 'undefined' ? false : document.body)
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) {
    return props.getPopupContainer(triggerRef.value)
  }

  return getDefaultPopupContainer()
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => (popupContainer.value === false ? 'body' : popupContainer.value))
const popoverClass = computed(() => [
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
const titleClass = computed(() => props.classNames?.title)
const titleStyle = computed(() => props.styles?.title)
const contentClass = computed(() => props.classNames?.content)
const contentStyle = computed(() => props.styles?.content)
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  props.classNames?.arrow,
  {
    'aheart-popover__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => props.styles?.arrow)

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

const requestOpen = (open: boolean) => {
  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

const clearMouseEnterTimer = () => {
  if (mouseEnterTimer) {
    clearTimeout(mouseEnterTimer)
    mouseEnterTimer = undefined
  }
}

const clearMouseLeaveTimer = () => {
  if (mouseLeaveTimer) {
    clearTimeout(mouseLeaveTimer)
    mouseLeaveTimer = undefined
  }
}

const clearHoverTimers = () => {
  clearMouseEnterTimer()
  clearMouseLeaveTimer()
}

const delayToMs = (delay: number) => Math.max(0, delay * 1000)

const requestOpenWithDelay = (open: boolean, delay: number) => {
  const timerDelay = delayToMs(delay)

  if (timerDelay === 0) {
    requestOpen(open)
    return
  }

  const timer = setTimeout(() => {
    if (open) {
      mouseEnterTimer = undefined
    } else {
      mouseLeaveTimer = undefined
    }

    requestOpen(open)
  }, timerDelay)

  if (open) {
    mouseEnterTimer = timer
  } else {
    mouseLeaveTimer = timer
  }
}

const handleMouseEnter = () => {
  if (normalizedTriggers.value.has('hover')) {
    clearMouseLeaveTimer()
    clearMouseEnterTimer()
    requestOpenWithDelay(true, props.mouseEnterDelay)
  }
}

const containsRelatedTarget = (event: MouseEvent, element: HTMLElement | null) =>
  event.relatedTarget instanceof Node && Boolean(element?.contains(event.relatedTarget))

const isHoveringTriggerOrPopup = (event: MouseEvent) =>
  containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value)

const handleMouseLeave = (event: MouseEvent) => {
  if (normalizedTriggers.value.has('hover') && !isHoveringTriggerOrPopup(event)) {
    clearMouseEnterTimer()
    clearMouseLeaveTimer()
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

onBeforeUnmount(() => {
  clearHoverTimers()
})
</script>
