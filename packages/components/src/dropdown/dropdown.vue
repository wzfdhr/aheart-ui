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
        v-show="mergedOpen"
        ref="overlayRef"
        class="aheart-dropdown__overlay"
        :class="overlayClass"
        :style="overlayStyle"
        role="presentation"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <span
          v-if="showArrow"
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
const hasRenderedOverlay = ref(Boolean(props.defaultOpen || props.open))
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
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
const shouldRenderOverlay = computed(
  () => hasOverlayContent.value && (mergedOpen.value || (!shouldDestroyOnHidden.value && hasRenderedOverlay.value))
)
const getDefaultPopupContainer = () => (typeof document === 'undefined' ? false : document.body)
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) {
    return props.getPopupContainer(triggerRef.value)
  }

  return getDefaultPopupContainer()
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => (popupContainer.value === false ? 'body' : popupContainer.value))

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
  props.overlayClassName,
  resolvedClassNames.value.popup
])
const overlayStyle = computed(() => [props.overlayStyle, resolvedStyles.value.popup])
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
const arrowStyle = computed(() => resolvedStyles.value.arrow)
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

type DropdownPlacementSide = 'top' | 'bottom'
type DropdownPlacementAlign = '' | 'Left' | 'Right'

const getPlacementSide = (placement: DropdownPlacement): DropdownPlacementSide =>
  placement.startsWith('top') ? 'top' : 'bottom'

const getPlacementAlign = (placement: DropdownPlacement): DropdownPlacementAlign => {
  if (placement.endsWith('Left')) {
    return 'Left'
  }

  if (placement.endsWith('Right')) {
    return 'Right'
  }

  return ''
}

const createPlacement = (
  side: DropdownPlacementSide,
  align: DropdownPlacementAlign
) => `${side}${align}` as DropdownPlacement

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
  if (!props.autoAdjustOverflow || !triggerRef.value || !overlayRef.value) {
    return props.placement
  }

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const overlayRect = overlayRef.value.getBoundingClientRect()
  const viewport = getViewportSize()
  let side = getPlacementSide(props.placement)
  let align = getPlacementAlign(props.placement)
  const overlayHeight = overlayRect.height
  const overlayWidth = overlayRect.width

  if (overlayHeight > 0 && viewport.height > 0) {
    const spaceAbove = triggerRect.top
    const spaceBelow = viewport.height - triggerRect.bottom

    if (side === 'bottom' && overlayHeight > spaceBelow && spaceAbove > spaceBelow) {
      side = 'top'
    } else if (side === 'top' && overlayHeight > spaceAbove && spaceBelow > spaceAbove) {
      side = 'bottom'
    }
  }

  if (overlayWidth > 0 && viewport.width > 0) {
    const leftAlignedRight = triggerRect.left + overlayWidth
    const rightAlignedLeft = triggerRect.right - overlayWidth
    const centerLeft = triggerRect.left + triggerRect.width / 2 - overlayWidth / 2
    const centerRight = centerLeft + overlayWidth

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

  return createPlacement(side, align)
}

const updateEffectivePlacement = () => {
  effectivePlacement.value = resolveAdjustedPlacement()
}

const schedulePlacementUpdate = () => {
  if (!mergedOpen.value) {
    effectivePlacement.value = props.placement
    return
  }

  void nextTick(updateEffectivePlacement)
}

watch(
  mergedOpen,
  (open) => {
    if (open) {
      hasRenderedOverlay.value = true
      schedulePlacementUpdate()
      return
    }

    effectivePlacement.value = props.placement
  },
  { immediate: true }
)

watch(
  [() => props.placement, () => props.autoAdjustOverflow],
  () => {
    effectivePlacement.value = props.placement
    schedulePlacementUpdate()
  }
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

onBeforeUnmount(clearHoverTimers)
</script>
