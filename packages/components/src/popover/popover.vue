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
        v-show="motion.phase.value !== 'hidden'"
        ref="popupRef"
        class="aheart-popover__popup"
        :class="popupClass"
        :style="popupStyle"
        role="dialog"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
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
import { computed, defineComponent, nextTick, onBeforeUnmount, ref, useSlots, watch, type PropType } from 'vue'
import { getFloatingPopupStyle, normalizeFloatingTriggers, type FloatingPlacement } from '../utils/floating'
import '../utils/floating.css'
import { useMotionPresence } from '../utils/use-motion-presence'
import {
  popoverEmits,
  popoverProps,
  type PopoverContent,
  type PopoverSemanticClassNames,
  type PopoverSemanticInfo,
  type PopoverSemanticStyles
} from './types'
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
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const effectivePlacement = ref<FloatingPlacement>(props.placement)
let mouseEnterTimer: ReturnType<typeof setTimeout> | undefined
let mouseLeaveTimer: ReturnType<typeof setTimeout> | undefined

const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasContent = computed(() => Boolean(slots.content) || hasRenderable(props.content))
const hasPopupContent = computed(() => hasTitle.value || hasContent.value)
const visible = computed(() => hasPopupContent.value && mergedOpen.value)
const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyTooltipOnHide)
const motion = useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 })
const shouldRenderPopup = computed(() => hasPopupContent.value && motion.isMounted.value)
const getDefaultPopupContainer = () => (typeof document === 'undefined' ? false : document.body)
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) {
    return props.getPopupContainer(triggerRef.value)
  }

  return getDefaultPopupContainer()
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => (popupContainer.value === false ? 'body' : popupContainer.value))
const semanticInfo = computed<PopoverSemanticInfo>(() => ({
  open: visible.value,
  placement: effectivePlacement.value
}))
const resolvedClassNames = computed<PopoverSemanticClassNames>(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const resolvedStyles = computed<PopoverSemanticStyles>(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
const popoverClass = computed(() => [
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
const alignOffsetStyle = computed(() => {
  const offset = props.align?.offset

  if (!Array.isArray(offset) || offset.length < 2) {
    return {}
  }

  const [x, y] = offset

  return {
    '--aheart-floating-align-x': `${Number.isFinite(x) ? x : 0}px`,
    '--aheart-floating-align-y': `${Number.isFinite(y) ? y : 0}px`
  }
})
const popupStyle = computed(() => [
  getFloatingPopupStyle(props.color, props.zIndex),
  alignOffsetStyle.value,
  props.overlayStyle,
  resolvedStyles.value.popup
])
const containerClass = computed(() => resolvedClassNames.value.container)
const containerStyle = computed(() => [props.overlayInnerStyle, resolvedStyles.value.container])
const titleClass = computed(() => resolvedClassNames.value.title)
const titleStyle = computed(() => resolvedStyles.value.title)
const contentClass = computed(() => resolvedClassNames.value.content)
const contentStyle = computed(() => resolvedStyles.value.content)
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  resolvedClassNames.value.arrow,
  {
    'aheart-popover__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => resolvedStyles.value.arrow)

watch(
  () => props.defaultOpen,
  (open) => {
    if (!isControlled.value) {
      innerOpen.value = open
    }
  }
)

type FloatingSide = 'top' | 'bottom' | 'left' | 'right'
type FloatingAlign = '' | 'Left' | 'Right' | 'Top' | 'Bottom'

const getPlacementSide = (placement: FloatingPlacement): FloatingSide => {
  if (placement.startsWith('top')) {
    return 'top'
  }

  if (placement.startsWith('bottom')) {
    return 'bottom'
  }

  if (placement.startsWith('left')) {
    return 'left'
  }

  return 'right'
}

const getPlacementAlign = (placement: FloatingPlacement): FloatingAlign => {
  if (placement.endsWith('Left')) {
    return 'Left'
  }

  if (placement.endsWith('Right')) {
    return 'Right'
  }

  if (placement.endsWith('Top')) {
    return 'Top'
  }

  if (placement.endsWith('Bottom')) {
    return 'Bottom'
  }

  return ''
}

const createPlacement = (side: FloatingSide, align: FloatingAlign) => `${side}${align}` as FloatingPlacement

const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth || 0,
    height: window.innerHeight || document.documentElement.clientHeight || 0
  }
}

const resolveAdjustedPlacement = () => {
  if (!props.autoAdjustOverflow || !triggerRef.value || !popupRef.value) {
    return props.placement
  }

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popupRect = popupRef.value.getBoundingClientRect()
  const viewport = getViewportSize()
  let side = getPlacementSide(props.placement)
  let align = getPlacementAlign(props.placement)
  const popupHeight = popupRect.height
  const popupWidth = popupRect.width

  if (popupHeight > 0 && viewport.height > 0) {
    const spaceAbove = triggerRect.top
    const spaceBelow = viewport.height - triggerRect.bottom

    if (side === 'top' && popupHeight > spaceAbove && spaceBelow > spaceAbove) {
      side = 'bottom'
    } else if (side === 'bottom' && popupHeight > spaceBelow && spaceAbove > spaceBelow) {
      side = 'top'
    }
  }

  if (popupWidth > 0 && viewport.width > 0) {
    const spaceLeft = triggerRect.left
    const spaceRight = viewport.width - triggerRect.right

    if (side === 'left' && popupWidth > spaceLeft && spaceRight > spaceLeft) {
      side = 'right'
    } else if (side === 'right' && popupWidth > spaceRight && spaceLeft > spaceRight) {
      side = 'left'
    }
  }

  if ((side === 'top' || side === 'bottom') && popupWidth > 0 && viewport.width > 0) {
    const leftAlignedRight = triggerRect.left + popupWidth
    const rightAlignedLeft = triggerRect.right - popupWidth
    const centerLeft = triggerRect.left + triggerRect.width / 2 - popupWidth / 2
    const centerRight = centerLeft + popupWidth

    if (align === 'Left' && leftAlignedRight > viewport.width && rightAlignedLeft >= 0) {
      align = 'Right'
    } else if (align === 'Right' && rightAlignedLeft < 0 && leftAlignedRight <= viewport.width) {
      align = 'Left'
    } else if (align === '' && centerLeft < 0 && leftAlignedRight <= viewport.width) {
      align = 'Left'
    } else if (align === '' && centerRight > viewport.width && rightAlignedLeft >= 0) {
      align = 'Right'
    }
  }

  if ((side === 'left' || side === 'right') && popupHeight > 0 && viewport.height > 0) {
    const topAlignedBottom = triggerRect.top + popupHeight
    const bottomAlignedTop = triggerRect.bottom - popupHeight
    const centerTop = triggerRect.top + triggerRect.height / 2 - popupHeight / 2
    const centerBottom = centerTop + popupHeight

    if (align === 'Top' && topAlignedBottom > viewport.height && bottomAlignedTop >= 0) {
      align = 'Bottom'
    } else if (align === 'Bottom' && bottomAlignedTop < 0 && topAlignedBottom <= viewport.height) {
      align = 'Top'
    } else if (align === '' && centerTop < 0 && topAlignedBottom <= viewport.height) {
      align = 'Top'
    } else if (align === '' && centerBottom > viewport.height && bottomAlignedTop >= 0) {
      align = 'Bottom'
    }
  }

  return createPlacement(side, align)
}

const updateEffectivePlacement = () => {
  effectivePlacement.value = resolveAdjustedPlacement()
}

const schedulePlacementUpdate = () => {
  if (!visible.value) {
    effectivePlacement.value = props.placement
    return
  }

  void nextTick(updateEffectivePlacement)
}

watch(
  visible,
  (open) => {
    if (open) {
      schedulePlacementUpdate()
      return
    }

    effectivePlacement.value = props.placement
  },
  { immediate: true }
)

watch(
  [() => props.placement, () => props.autoAdjustOverflow, () => props.title, () => props.content],
  () => {
    effectivePlacement.value = props.placement
    schedulePlacementUpdate()
  }
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
