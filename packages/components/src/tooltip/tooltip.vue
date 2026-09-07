<template>
  <span
    ref="rootRef"
    class="aheart-tooltip"
    :class="tooltipClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      ref="triggerRef"
      class="aheart-tooltip__trigger"
      :aria-describedby="hasTitle ? popupId : undefined"
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
        v-show="motion.phase.value !== 'hidden'"
        ref="popupRef"
        class="aheart-tooltip__popup"
        :id="popupId"
        :class="popupClass"
        :style="popupStyle"
        role="tooltip"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @focusout="handleFocusOut"
      >
        <span
          v-if="showArrow"
          ref="arrowRef"
          class="aheart-floating__arrow aheart-tooltip__arrow"
          :class="arrowClass"
          :style="arrowStyle"
          aria-hidden="true"
        />
        <span class="aheart-tooltip__container" :class="containerClass" :style="containerStyle">
          <span class="aheart-tooltip__content" :class="contentClass" :style="contentStyle">
            <slot name="title">
              <ARenderNode :node="title" />
            </slot>
          </span>
        </span>
      </span>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType } from 'vue'
import { getFloatingPopupStyle, normalizeFloatingTriggers, type FloatingPlacement } from '../utils/floating-core'
import '../utils/floating.css'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { useTeleportReady } from '../utils/use-teleport-ready'
import { useStableId } from '../utils/use-stable-id'
import { useTriggerAria } from '../utils/use-trigger-aria'
import {
  tooltipEmits,
  tooltipProps,
  type TooltipSemanticClassNames,
  type TooltipSemanticInfo,
  type TooltipSemanticStyles,
  type TooltipTitle
} from './types'
import './style.css'

defineOptions({
  name: 'ATooltip'
})

const ARenderNode = defineComponent({
  name: 'ATooltipRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<TooltipTitle>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => (typeof renderProps.node === 'function' ? renderProps.node() : renderProps.node)
  }
})

const hasTitleContent = (value: TooltipTitle | undefined | null) =>
  value !== undefined && value !== null && value !== false && value !== ''

const props = defineProps(tooltipProps)
const emit = defineEmits(tooltipEmits)
const slots = useSlots()

const innerOpen = ref(props.defaultOpen)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const popupId = useStableId(undefined, 'aheart-tooltip')
const arrowRef = ref<HTMLElement | null>(null)
const effectivePlacement = ref<FloatingPlacement>(props.placement)
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const hasTitle = computed(() => Boolean(slots.title) || hasTitleContent(props.title))
useTriggerAria(triggerRef, () => ({
  'aria-describedby': hasTitle.value ? popupId.value : undefined
}))
const visible = computed(() => hasTitle.value && mergedOpen.value)
const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyTooltipOnHide)
const motion = useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 })
const teleportReady = useTeleportReady()
const shouldRenderPopup = computed(() => hasTitle.value && motion.isMounted.value)
const getDefaultPopupContainer = () => (typeof document === 'undefined' ? false : document.body)
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) {
    return props.getPopupContainer(triggerRef.value)
  }

  return getDefaultPopupContainer()
})
const shouldTeleport = computed(() => teleportReady.value && popupContainer.value !== false)
const teleportTo = computed(() => (popupContainer.value === false ? 'body' : popupContainer.value))
const floatingPosition = useFloatingPosition({
  reference: triggerRef,
  floating: popupRef,
  arrow: arrowRef,
  open: () => shouldRenderPopup.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  offset: 8,
  alignOffset: () => props.align?.offset,
  autoAdjustOverflow: () => props.autoAdjustOverflow,
  arrowSize: 8
})
const semanticInfo = computed<TooltipSemanticInfo>(() => ({
  open: visible.value,
  placement: effectivePlacement.value
}))
const resolvedClassNames = computed<TooltipSemanticClassNames>(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const resolvedStyles = computed<TooltipSemanticStyles>(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
const tooltipClass = computed(() => [
  props.className,
  props.rootClassName,
  resolvedClassNames.value.root,
  {
    'is-open': visible.value
  }
])
const rootStyle = computed(() => [props.style, resolvedStyles.value.root])
const triggerClass = computed(() => resolvedClassNames.value.trigger)
const triggerStyle = computed(() => resolvedStyles.value.trigger)
const popupClass = computed(() => [
  `aheart-floating--${effectivePlacement.value}`,
  `is-${motion.phase.value}`,
  props.overlayClassName,
  resolvedClassNames.value.popup
])
const popupStyle = computed(() => [
  floatingPosition.popupStyle.value,
  getFloatingPopupStyle(props.color, props.zIndex),
  props.overlayStyle,
  resolvedStyles.value.popup
])
const containerClass = computed(() => resolvedClassNames.value.container)
const containerStyle = computed(() => [props.overlayInnerStyle, resolvedStyles.value.container])
const contentClass = computed(() => resolvedClassNames.value.content)
const contentStyle = computed(() => resolvedStyles.value.content)
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  resolvedClassNames.value.arrow,
  {
    'aheart-tooltip__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow])

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
  () => floatingPosition.placement.value,
  (placement) => {
    effectivePlacement.value = placement
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

const containsRelatedTarget = (event: MouseEvent, element: HTMLElement | null) =>
  event.relatedTarget instanceof Node && Boolean(element?.contains(event.relatedTarget))

const isHoveringTriggerOrPopup = (event: MouseEvent) =>
  containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value)

const handleMouseLeave = (event: MouseEvent) => {
  if (normalizedTriggers.value.has('hover') && !isHoveringTriggerOrPopup(event)) {
    requestOpenWithDelay(false, props.mouseLeaveDelay)
  }
}

const handleFocusIn = () => {
  if (normalizedTriggers.value.has('focus')) {
    clearTimers()
    requestOpen(true)
  }
}

const handleFocusOut = (event: FocusEvent) => {
  if (normalizedTriggers.value.has('focus')) {
    clearTimers()
    const nextTarget = event.relatedTarget
    if (nextTarget instanceof Node && (rootRef.value?.contains(nextTarget) || popupRef.value?.contains(nextTarget))) {
      return
    }
    requestOpen(false)
  }
}

const handleClick = () => {
  if (normalizedTriggers.value.has('click')) {
    clearTimers()
    requestOpen(!mergedOpen.value)
  }
}

const handleContextmenu = (event: MouseEvent) => {
  if (normalizedTriggers.value.has('contextMenu')) {
    clearTimers()
    event.preventDefault()
    requestOpen(true)
  }
}

useFloatingDismiss({
  open: visible,
  trigger: triggerRef,
  floating: popupRef,
  onDismiss: () => requestOpen(false)
})

onBeforeUnmount(clearTimers)
</script>
