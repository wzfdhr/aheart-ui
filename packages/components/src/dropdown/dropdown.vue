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
import { computed, defineComponent, h, ref, useSlots, watch, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AMenu, { type MenuClickInfo } from '../menu'
import { dropdownEmits, dropdownProps, type DropdownOpenChangeInfo } from './types'
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

const dropdownClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-open': mergedOpen.value,
    'is-disabled': isDisabled.value
  }
])

const rootStyle = computed(() => [props.style, props.styles?.root])
const triggerClass = computed(() => props.classNames?.trigger)
const triggerStyle = computed(() => props.styles?.trigger)
const overlayClass = computed(() => [
  `aheart-dropdown__overlay--${props.placement}`,
  props.overlayClassName,
  props.classNames?.popup
])
const overlayStyle = computed(() => [props.overlayStyle, props.styles?.popup])
const menuClass = computed(() => props.classNames?.menu)
const menuStyle = computed(() => props.styles?.menu)
const showArrow = computed(() => props.arrow !== false)
const arrowPointsAtCenter = computed(() => typeof props.arrow === 'object' && props.arrow?.pointAtCenter === true)
const arrowClass = computed(() => [
  props.classNames?.arrow,
  {
    'aheart-dropdown__arrow--point-at-center': arrowPointsAtCenter.value
  }
])
const arrowStyle = computed(() => props.styles?.arrow)
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
  mergedOpen,
  (open) => {
    if (open) {
      hasRenderedOverlay.value = true
    }
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

const handleTriggerClick = () => {
  if (!triggerSet.value.has('click')) {
    return
  }

  setOpen(!mergedOpen.value, { source: 'trigger' })
}

const handleMouseEnter = () => {
  if (triggerSet.value.has('hover')) {
    setOpen(true, { source: 'trigger' })
  }
}

const handleMouseLeave = (event: MouseEvent) => {
  if (triggerSet.value.has('hover') && !isHoveringTriggerOrOverlay(event)) {
    setOpen(false, { source: 'trigger' })
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
</script>
