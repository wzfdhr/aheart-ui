<template>
  <span
    ref="rootRef"
    class="aheart-popconfirm"
    :class="popconfirmClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      ref="triggerRef"
      class="aheart-popconfirm__trigger"
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
        class="aheart-popconfirm__popup"
        :class="popupClass"
        :style="popupStyle"
        role="dialog"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="handlePopupClick"
      >
        <span
          v-if="showArrow"
          ref="arrowRef"
          class="aheart-floating__arrow aheart-popconfirm__arrow"
          :class="arrowClass"
          :style="arrowStyle"
          aria-hidden="true"
        />
        <span class="aheart-popconfirm__container" :class="containerClass" :style="containerStyle">
          <span class="aheart-popconfirm__message" :class="messageClass" :style="messageStyle">
            <span
              v-if="hasIcon"
              class="aheart-popconfirm__icon"
              :class="iconClass"
              :style="iconStyle"
              aria-hidden="true"
            >
              <slot name="icon">
                <ARenderNode :node="resolvedIcon" />
              </slot>
            </span>
            <span class="aheart-popconfirm__text" :class="textClass" :style="textStyle">
              <span v-if="hasTitle" class="aheart-popconfirm__title" :class="titleClass" :style="titleStyle">
                <slot name="title">
                  <ARenderNode :node="title" />
                </slot>
              </span>
              <span
                v-if="hasDescription"
                class="aheart-popconfirm__description"
                :class="descriptionClass"
                :style="descriptionStyle"
              >
                <slot name="description">
                  <ARenderNode :node="description" />
                </slot>
              </span>
            </span>
          </span>
          <span class="aheart-popconfirm__actions" :class="actionsClass" :style="actionsStyle">
            <AButton
              v-if="showCancel"
              v-bind="resolvedCancelButtonProps"
              class="aheart-popconfirm__cancel"
              :class="cancelButtonClass"
              :style="cancelButtonStyle"
              @click="handleCancel"
            >
              {{ cancelText }}
            </AButton>
            <AButton
              v-bind="resolvedOkButtonProps"
              class="aheart-popconfirm__ok"
              :class="okButtonClass"
              :style="okButtonStyle"
              @click="handleConfirm"
            >
              {{ okText }}
            </AButton>
          </span>
        </span>
      </span>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType } from 'vue'
import AButton from '../button'
import { getFloatingPopupStyle, normalizeFloatingTriggers, type FloatingPlacement } from '../utils/floating'
import '../utils/floating.css'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import {
  popconfirmEmits,
  popconfirmProps,
  type PopconfirmContent,
  type PopconfirmSemanticClassNames,
  type PopconfirmSemanticInfo,
  type PopconfirmSemanticStyles
} from './types'
import './style.css'

defineOptions({
  name: 'APopconfirm'
})

const ARenderNode = defineComponent({
  name: 'APopconfirmRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<PopconfirmContent>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => (typeof renderProps.node === 'function' ? renderProps.node() : renderProps.node)
  }
})

const hasRenderable = (value: PopconfirmContent | undefined | null) => value !== undefined && value !== null && value !== false

const props = defineProps(popconfirmProps)
const emit = defineEmits(popconfirmEmits)
const slots = useSlots()

const innerOpen = ref(props.defaultOpen)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
const effectivePlacement = ref<FloatingPlacement>(props.placement)
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const visible = computed(() => !props.disabled && mergedOpen.value)
const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyTooltipOnHide)
const motion = useMotionPresence(visible, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 })
const shouldRenderPopup = computed(() => !props.disabled && motion.isMounted.value)
const getDefaultPopupContainer = () => (typeof document === 'undefined' ? false : document.body)
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) {
    return props.getPopupContainer(triggerRef.value)
  }

  return getDefaultPopupContainer()
})
const shouldTeleport = computed(() => popupContainer.value !== false)
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
const resolvedIcon = computed<PopconfirmContent>(() => (props.icon === undefined ? '!' : props.icon))
const hasIcon = computed(() => Boolean(slots.icon) || hasRenderable(resolvedIcon.value))
const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasDescription = computed(() => Boolean(slots.description) || hasRenderable(props.description))
const semanticInfo = computed<PopconfirmSemanticInfo>(() => ({
  open: visible.value,
  placement: effectivePlacement.value
}))
const resolvedClassNames = computed<PopconfirmSemanticClassNames>(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const resolvedStyles = computed<PopconfirmSemanticStyles>(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
const popconfirmClass = computed(() => [
  props.className,
  props.rootClassName,
  resolvedClassNames.value.root,
  {
    'is-open': visible.value,
    'is-disabled': props.disabled
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
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  resolvedClassNames.value.arrow,
  {
    'aheart-popconfirm__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow])
const messageClass = computed(() => resolvedClassNames.value.message)
const messageStyle = computed(() => resolvedStyles.value.message)
const iconClass = computed(() => resolvedClassNames.value.icon)
const iconStyle = computed(() => resolvedStyles.value.icon)
const textClass = computed(() => resolvedClassNames.value.text)
const textStyle = computed(() => resolvedStyles.value.text)
const titleClass = computed(() => resolvedClassNames.value.title)
const titleStyle = computed(() => resolvedStyles.value.title)
const descriptionClass = computed(() => resolvedClassNames.value.description)
const descriptionStyle = computed(() => resolvedStyles.value.description)
const actionsClass = computed(() => resolvedClassNames.value.actions)
const actionsStyle = computed(() => resolvedStyles.value.actions)
const cancelButtonClass = computed(() => resolvedClassNames.value.cancelButton)
const cancelButtonStyle = computed(() => resolvedStyles.value.cancelButton)
const okButtonClass = computed(() => resolvedClassNames.value.okButton)
const okButtonStyle = computed(() => resolvedStyles.value.okButton)
const resolvedCancelButtonProps = computed(() => ({
  size: 'small' as const,
  ...props.cancelButtonProps
}))
const resolvedOkButtonProps = computed(() => ({
  size: 'small' as const,
  type: props.okType,
  ...props.okButtonProps
}))

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

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      effectivePlacement.value = props.placement
    }
  }
)

const requestOpen = (open: boolean) => {
  if (props.disabled) {
    return
  }

  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

let mouseEnterTimer: ReturnType<typeof setTimeout> | undefined
let mouseLeaveTimer: ReturnType<typeof setTimeout> | undefined

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

const handlePopupClick = (event: MouseEvent) => {
  emit('popupClick', event)
}

const handleConfirm = () => {
  emit('confirm')
  requestOpen(false)
}

const handleCancel = () => {
  emit('cancel')
  requestOpen(false)
}

useFloatingDismiss({
  open: visible,
  trigger: triggerRef,
  floating: popupRef,
  onDismiss: () => requestOpen(false)
})

onBeforeUnmount(() => {
  clearHoverTimers()
})
</script>
