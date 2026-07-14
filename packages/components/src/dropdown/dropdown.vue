<template>
  <div
    ref="rootRef"
    class="aheart-dropdown"
    :class="dropdownClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      ref="triggerRef"
      class="aheart-dropdown__trigger"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :class="triggerClass"
      :style="triggerStyle"
      @click="handleTriggerClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @contextmenu="handleContextmenu"
    >
      <slot />
    </span>
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="shouldRenderOverlay"
        v-show="motion.phase.value !== 'hidden'"
        ref="overlayRef"
        class="aheart-dropdown__overlay"
        :class="overlayClass"
        :style="overlayStyle"
        role="presentation"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <span
          v-if="showArrow"
          ref="arrowRef"
          class="aheart-dropdown__arrow"
          :class="arrowClass"
          :style="arrowStyle"
          aria-hidden="true"
        />
        <slot name="popup">
          <ARenderNode :node="popupContent" />
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, ref, useSlots, watch, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AMenu, { type MenuClickInfo } from '../menu'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import {
  dropdownEmits,
  dropdownProps,
  type DropdownPlacement,
  type DropdownOpenChangeInfo,
  type DropdownSemanticClassNames,
  type DropdownSemanticInfo,
  type DropdownSemanticStyles
} from './types'
import './style.css'

defineOptions({
  name: 'ADropdown'
})

const props = defineProps(dropdownProps)
const emit = defineEmits(dropdownEmits)
const config = useAheartConfig()
const slots = useSlots()

const ARenderNode = defineComponent({
  name: 'ADropdownRenderNode',
  props: {
    node: null
  },
  setup(renderProps) {
    return () => renderProps.node as VNodeChild
  }
})

const innerOpen = ref(props.defaultOpen)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
const effectivePlacement = ref(props.placement)
let mouseEnterTimer: ReturnType<typeof setTimeout> | undefined
let mouseLeaveTimer: ReturnType<typeof setTimeout> | undefined
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const triggerSet = computed(() => new Set(props.trigger))
const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyPopupOnHide)
const hasMenu = computed(() => Boolean(props.menu?.items?.length))
const hasOverlayContent = computed(() => hasMenu.value || Boolean(slots.popup || props.popupRender || props.dropdownRender))
const motion = useMotionPresence(mergedOpen, { destroyOnHidden: shouldDestroyOnHidden, duration: 120 })
const shouldRenderOverlay = computed(() => hasOverlayContent.value && motion.isMounted.value)
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
  floating: overlayRef,
  arrow: arrowRef,
  open: () => shouldRenderOverlay.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  offset: 8,
  autoAdjustOverflow: () => props.autoAdjustOverflow,
  arrowSize: 8
})

const semanticInfo = computed<DropdownSemanticInfo>(() => ({
  open: mergedOpen.value,
  placement: effectivePlacement.value
}))
const resolvedClassNames = computed<DropdownSemanticClassNames>(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const resolvedStyles = computed<DropdownSemanticStyles>(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
const dropdownClass = computed(() => [
  props.className,
  props.rootClassName,
  resolvedClassNames.value.root,
  {
    'is-open': mergedOpen.value,
    'is-disabled': isDisabled.value
  }
])

const rootStyle = computed(() => [props.style, resolvedStyles.value.root])
const triggerClass = computed(() => resolvedClassNames.value.trigger)
const triggerStyle = computed(() => resolvedStyles.value.trigger)
const overlayClass = computed(() => [
  `aheart-dropdown__overlay--${effectivePlacement.value}`,
  `aheart-floating--${effectivePlacement.value}`,
  `is-${motion.phase.value}`,
  props.overlayClassName,
  resolvedClassNames.value.popup
])
const overlayStyle = computed(() => [
  floatingPosition.popupStyle.value,
  props.overlayStyle,
  resolvedStyles.value.popup
])
const menuClass = computed(() => resolvedClassNames.value.menu)
const menuStyle = computed(() => resolvedStyles.value.menu)
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  resolvedClassNames.value.arrow,
  {
    'aheart-dropdown__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => [floatingPosition.arrowStyle.value, resolvedStyles.value.arrow])
const defaultMenuNode = computed(() => {
  if (!hasMenu.value) {
    return null
  }

  return h(
    'div',
    {
      class: ['aheart-dropdown__menu', menuClass.value],
      style: menuStyle.value
    },
    [
      h(AMenu, {
        items: props.menu?.items,
        selectable: props.menu?.selectable ?? false,
        selectedKeys: props.menu?.selectedKeys,
        defaultSelectedKeys: props.menu?.defaultSelectedKeys,
        onClick: handleMenuClick
      })
    ]
  )
})
const popupContent = computed(() => {
  const menus = defaultMenuNode.value

  if (props.popupRender) {
    return props.popupRender(menus)
  }

  if (props.dropdownRender) {
    return props.dropdownRender(menus)
  }

  return menus
})

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
    effectivePlacement.value = placement as DropdownPlacement
  },
  { immediate: true }
)

const setOpen = (
  open: boolean,
  options: { source?: DropdownOpenChangeInfo['source']; emitOpenChange?: boolean } = {}
) => {
  if (isDisabled.value) {
    return
  }

  const { source = 'trigger', emitOpenChange = true } = options

  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)

  if (emitOpenChange) {
    emit('openChange', open, { source })
  }
}

const containsRelatedTarget = (event: MouseEvent, element: HTMLElement | null) =>
  event.relatedTarget instanceof Node && Boolean(element?.contains(event.relatedTarget))

const isHoveringTriggerOrOverlay = (event: MouseEvent) =>
  containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, overlayRef.value)

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

const setOpenWithHoverDelay = (open: boolean, delay: number) => {
  const timerDelay = delayToMs(delay)

  if (timerDelay === 0) {
    setOpen(open, { source: 'trigger' })
    return
  }

  const timer = setTimeout(() => {
    if (open) {
      mouseEnterTimer = undefined
    } else {
      mouseLeaveTimer = undefined
    }

    setOpen(open, { source: 'trigger' })
  }, timerDelay)

  if (open) {
    mouseEnterTimer = timer
  } else {
    mouseLeaveTimer = timer
  }
}

const handleTriggerClick = () => {
  if (!triggerSet.value.has('click')) {
    return
  }

  setOpen(!mergedOpen.value, { source: 'trigger' })
}

const handleMouseEnter = () => {
  if (triggerSet.value.has('hover')) {
    clearMouseLeaveTimer()
    clearMouseEnterTimer()
    setOpenWithHoverDelay(true, props.mouseEnterDelay)
  }
}

const handleMouseLeave = (event: MouseEvent) => {
  if (triggerSet.value.has('hover') && !isHoveringTriggerOrOverlay(event)) {
    clearMouseEnterTimer()
    clearMouseLeaveTimer()
    setOpenWithHoverDelay(false, props.mouseLeaveDelay)
  }
}

const handleContextmenu = (event: MouseEvent) => {
  if (triggerSet.value.has('contextMenu')) {
    event.preventDefault()
    setOpen(true, { source: 'trigger' })
  }
}

const handleMenuClick = (info: MenuClickInfo) => {
  emit('click', info)

  if (props.menu?.closeOnClick === false) {
    return
  }

  setOpen(false, { source: 'menu', emitOpenChange: false })
}

useFloatingDismiss({
  open: mergedOpen,
  trigger: triggerRef,
  floating: overlayRef,
  onDismiss: () => setOpen(false, { source: 'trigger' })
})

onBeforeUnmount(clearHoverTimers)
</script>
