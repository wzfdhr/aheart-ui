<template>
  <Teleport :to="teleportTo" :disabled="!shouldTeleport">
    <div
      v-if="shouldRender"
      v-show="motion.phase.value !== 'hidden'"
      :class="rootClass"
      :style="rootStyle"
      role="presentation"
      :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <div v-if="showMask" :class="maskClass" :style="mergedMaskStyle" @click="handleMaskClick" />
      <ADrawerRenderWrapper :renderer="drawerRender">
        <section
          ref="panelRef"
          :class="panelClass"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="hasTitle ? undefined : dialogLabel"
          :aria-labelledby="hasTitle ? titleId : undefined"
          tabindex="-1"
        >
          <header v-if="hasHeader" :class="headerClass" :style="mergedHeaderStyle">
            <button
              v-if="showCloseButton && !isCloseAtEnd"
              :class="closeClass"
              :style="semanticStyle('close')"
              :disabled="isCloseButtonDisabled"
              type="button"
              aria-label="Close"
              @click="handleCloseButtonClick"
            >
              <ADrawerRenderNode :node="resolvedCloseIcon" />
            </button>
            <div v-if="hasTitle" :id="titleId" :class="titleClass" :style="semanticStyle('title')">
              <slot name="title">
                <ADrawerRenderNode :node="title" />
              </slot>
            </div>
            <div v-if="hasExtra" :class="extraClass" :style="semanticStyle('extra')">
              <slot name="extra">
                <ADrawerRenderNode :node="extra" />
              </slot>
            </div>
            <button
              v-if="showCloseButton && isCloseAtEnd"
              :class="closeClass"
              :style="semanticStyle('close')"
              :disabled="isCloseButtonDisabled"
              type="button"
              aria-label="Close"
              @click="handleCloseButtonClick"
            >
              <ADrawerRenderNode :node="resolvedCloseIcon" />
            </button>
          </header>
          <div :class="bodyClass" :style="mergedBodyStyle">
            <ASkeleton v-if="loading" active :paragraph="{ rows: 4 }" />
            <slot v-else />
          </div>
          <footer v-if="hasFooter" :class="footerClass" :style="mergedFooterStyle">
            <slot name="footer">
              <ADrawerRenderNode v-if="shouldRenderFooterProp" :node="footer" />
            </slot>
          </footer>
          <button
            v-if="isResizable"
            :class="draggerClass"
            :style="semanticStyle('dragger')"
            type="button"
            aria-label="Resize drawer"
            @pointerdown="handleResizeStart"
          />
        </section>
      </ADrawerRenderWrapper>
    </div>
  </Teleport>
</template>

<script lang="ts">
import type { InjectionKey } from 'vue'

interface DrawerPushContext {
  setChildOpen: (id: symbol, open: boolean) => void
}

const DRAWER_PUSH_CONTEXT: InjectionKey<DrawerPushContext> = Symbol('ADrawerPushContext')
</script>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type PropType,
  type VNodeChild
} from 'vue'
import ASkeleton from '../skeleton'
import { usePointerDrag } from '../utils/use-pointer-drag'
import { useMotionPresence } from '../utils/use-motion-presence'
import {
  drawerEmits,
  drawerProps,
  type DrawerClosableConfig,
  type DrawerFocusableConfig,
  type DrawerMaskConfig,
  type DrawerRender,
  type DrawerSemanticConfig,
  type DrawerSemanticPart
} from './types'
import './style.css'

defineOptions({
  name: 'ADrawer'
})

const ADrawerRenderNode = defineComponent({
  name: 'ADrawerRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const ADrawerRenderWrapper = defineComponent({
  name: 'ADrawerRenderWrapper',
  props: {
    renderer: Function as PropType<DrawerRender>
  },
  setup(renderProps, { slots }) {
    return () => {
      const node = slots.default?.() ?? null
      return renderProps.renderer ? renderProps.renderer(node) : node
    }
  }
})

const props = defineProps(drawerProps)
const emit = defineEmits(drawerEmits)
const slots = useSlots()
const instance = getCurrentInstance()
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',')
const dialogLabel = computed(() => typeof props.title === 'string' || typeof props.title === 'number' ? String(props.title) : undefined)
const triggerElement = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const leaveFocusElement = ref<HTMLElement | null>(null)
const titleId = `aheart-drawer-title-${instance?.uid ?? 'dialog'}`
let pendingCloseCompletion = false
const resizedSize = ref<number>()
const resizeStart = ref<{ size: number; clientX: number; clientY: number } | null>(null)

const parentPushContext = inject<DrawerPushContext | null>(DRAWER_PUSH_CONTEXT, null)
const drawerId = Symbol('ADrawer')
const openChildDrawers = ref(new Map<symbol, true>())

const setChildOpen = (id: symbol, open: boolean) => {
  const nextOpenChildren = new Map(openChildDrawers.value)

  if (open) {
    nextOpenChildren.set(id, true)
  } else {
    nextOpenChildren.delete(id)
  }

  openChildDrawers.value = nextOpenChildren
}

provide(DRAWER_PUSH_CONTEXT, { setChildOpen })

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)
const parseNumericSize = (size: number | string | undefined) => {
  if (typeof size === 'number') {
    return size
  }

  const match = typeof size === 'string' ? size.trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/) : null
  return match ? Number(match[1]) : undefined
}
const clampResizeSize = (size: number) => {
  const cappedSize = props.maxSize === undefined ? size : Math.min(size, props.maxSize)
  return Math.max(0, cappedSize)
}
const formatPushDistance = (distance: number | string, negative: boolean) => {
  if (typeof distance === 'number') {
    return `${negative ? '-' : ''}${distance}px`
  }

  return negative ? `calc(0px - ${distance})` : distance
}
const getDefaultContainer = () => (typeof document === 'undefined' ? false : document.body)
const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer())
const teleportTarget = computed(() => {
  const container = resolvedContainer.value

  return typeof container === 'function' ? container() : container
})
const shouldTeleport = computed(() => teleportTarget.value !== false)
const teleportTo = computed(() => (teleportTarget.value === false ? 'body' : teleportTarget.value))

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
const hasOpenChildDrawer = computed(() => openChildDrawers.value.size > 0)
const pushConfig = computed(() => (typeof props.push === 'object' && props.push !== null ? props.push : undefined))
const isPushEnabled = computed(() => props.push !== false)
const resolvedPushDistance = computed(() => pushConfig.value?.distance ?? 180)
const pushTransform = computed(() => {
  if (!hasOpenChildDrawer.value || !isPushEnabled.value) {
    return undefined
  }

  switch (props.placement) {
    case 'left':
      return `translateX(${formatPushDistance(resolvedPushDistance.value, false)})`
    case 'top':
      return `translateY(${formatPushDistance(resolvedPushDistance.value, false)})`
    case 'bottom':
      return `translateY(${formatPushDistance(resolvedPushDistance.value, true)})`
    case 'right':
    default:
      return `translateX(${formatPushDistance(resolvedPushDistance.value, true)})`
  }
})
const resizableConfig = computed(() =>
  typeof props.resizable === 'object' && props.resizable !== null ? props.resizable : undefined
)
const isResizable = computed(() => props.resizable === true || resizableConfig.value !== undefined)
const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose || props.destroyInactivePanel)
const motion = useMotionPresence(() => props.open, {
  forceRender: () => props.forceRender,
  destroyOnHidden: () => shouldDestroy.value,
  duration: 240
})
const shouldRender = motion.isMounted
const isRenderableNode = (value: VNodeChild) =>
  value !== undefined && value !== null && value !== false && value !== true && value !== ''
const isMaskConfig = (value: typeof props.mask): value is DrawerMaskConfig =>
  typeof value === 'object' && value !== null
const maskConfig = computed(() => (isMaskConfig(props.mask) ? props.mask : undefined))
const showMask = computed(() => props.mask !== false && maskConfig.value?.enabled !== false)
const isMaskBlurred = computed(() => maskConfig.value?.blur === true)
const isMaskClosable = computed(() => maskConfig.value?.closable ?? props.maskClosable)
const isClosableConfig = (value: typeof props.closable): value is DrawerClosableConfig =>
  typeof value === 'object' && value !== null
const isFocusableConfig = (value: typeof props.focusable): value is DrawerFocusableConfig =>
  typeof value === 'object' && value !== null
const closableConfig = computed(() => (isClosableConfig(props.closable) ? props.closable : undefined))
const focusableConfig = computed(() => (isFocusableConfig(props.focusable) ? props.focusable : undefined))
const shouldFocusTriggerAfterClose = computed(() => focusableConfig.value?.focusTriggerAfterClose ?? true)
const shouldTrapFocus = computed(() => focusableConfig.value?.trap ?? showMask.value)
const resolvedCloseIcon = computed(() => {
  if (closableConfig.value?.closeIcon !== undefined) {
    return closableConfig.value.closeIcon
  }

  if (props.closeIcon !== undefined) {
    return props.closeIcon
  }

  return '×'
})
const showCloseButton = computed(
  () => props.closable !== false && resolvedCloseIcon.value !== false && resolvedCloseIcon.value !== null
)
const isCloseButtonDisabled = computed(() => closableConfig.value?.disabled === true)
const closePlacement = computed(() => closableConfig.value?.placement ?? 'start')
const isCloseAtEnd = computed(() => closePlacement.value === 'end')
const hasTitle = computed(() => Boolean(slots.title) || isRenderableNode(props.title))
const hasExtra = computed(() => Boolean(slots.extra) || isRenderableNode(props.extra))
const hasHeader = computed(() => hasTitle.value || hasExtra.value || showCloseButton.value)

const resolvedSize = computed(() => {
  if (props.size === 'large') {
    return 736
  }

  if (props.size === 'default') {
    return 378
  }

  return props.size
})
const configuredPanelSize = computed(() =>
  isVertical.value ? props.height ?? resolvedSize.value : props.width ?? resolvedSize.value
)
const currentBaseSize = computed(
  () => parseNumericSize(configuredPanelSize.value) ?? parseNumericSize(resolvedSize.value) ?? 378
)
const activePanelSize = computed(() => resizedSize.value ?? currentBaseSize.value)
const normalizedPanelSize = computed(() =>
  resizedSize.value === undefined ? normalizeSize(configuredPanelSize.value) : `${resizedSize.value}px`
)

const panelStyle = computed(() => {
  const style: CSSProperties = isVertical.value
    ? {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle('section'),
        height: normalizedPanelSize.value
      }
    : {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle('section'),
        width: normalizedPanelSize.value
      }

  if (!pushTransform.value) {
    return style
  }

  return {
    ...style,
    transform: [style.transform ? String(style.transform) : undefined, pushTransform.value].filter(Boolean).join(' ')
  }
})

const rootStyle = computed(() => ({
  ...props.rootStyle,
  ...semanticStyle('root'),
  zIndex: props.zIndex
}))

const mergedMaskStyle = computed(() => ({
  ...props.maskStyle,
  ...semanticStyle('mask')
}))
const mergedHeaderStyle = computed(() => ({
  ...props.headerStyle,
  ...semanticStyle('header')
}))
const mergedBodyStyle = computed(() => ({
  ...props.bodyStyle,
  ...semanticStyle('body')
}))
const mergedFooterStyle = computed(() => ({
  ...props.footerStyle,
  ...semanticStyle('footer')
}))
const shouldHideFooter = computed(() => props.footer === false || props.footer === null)
const shouldRenderFooterProp = computed(() => isRenderableNode(props.footer))
const hasFooter = computed(
  () => !shouldHideFooter.value && (Boolean(slots.footer) || props.footer === true || shouldRenderFooterProp.value)
)

const rootClass = computed(() => ['aheart-drawer', `is-${motion.phase.value}`, props.rootClassName, semanticClass('root')])
const maskClass = computed(() => [
  'aheart-drawer__mask',
  { 'is-blur': isMaskBlurred.value },
  semanticClass('mask')
])
const panelClass = computed(() => [
  'aheart-drawer__panel',
  `aheart-drawer__panel--${props.placement}`,
  props.className,
  semanticClass('section')
])
const headerClass = computed(() => ['aheart-drawer__header', semanticClass('header')])
const titleClass = computed(() => ['aheart-drawer__title', semanticClass('title')])
const extraClass = computed(() => ['aheart-drawer__extra', semanticClass('extra')])
const bodyClass = computed(() => ['aheart-drawer__body', { 'is-loading': props.loading }, semanticClass('body')])
const footerClass = computed(() => ['aheart-drawer__footer', semanticClass('footer')])
const draggerClass = computed(() => [
  'aheart-drawer__dragger',
  `aheart-drawer__dragger--${props.placement}`,
  { 'is-resizing': resizeStart.value !== null },
  semanticClass('dragger')
])
const closeClass = computed(() => [
  'aheart-drawer__close',
  { 'is-end': isCloseAtEnd.value },
  semanticClass('close')
])

watch(
  () => props.open,
  (open, previousOpen) => {
    if (open && !previousOpen) {
      pendingCloseCompletion = false
      leaveFocusElement.value = null
      if (motion.phase.value === 'hidden') captureTriggerElement()
      emit('afterOpenChange', true)
    }

    if (!open) {
      pendingCloseCompletion = true
      const activeElement = document.activeElement
      leaveFocusElement.value =
        activeElement instanceof HTMLElement && panelRef.value?.contains(activeElement) ? activeElement : null
      void nextTick(() => {
        if (motion.phase.value === 'leave' && leaveFocusElement.value && document.contains(leaveFocusElement.value)) {
          leaveFocusElement.value.focus()
        }
      })
    }

  },
  { flush: 'sync' }
)

watch(
  () => motion.phase.value,
  (phase) => {
    if (phase === 'entered' && props.open) {
      void nextTick(() => focusPanel())
      return
    }

    if (phase === 'hidden' && !props.open && pendingCloseCompletion) {
      pendingCloseCompletion = false
      emit('afterOpenChange', false)
      void nextTick(() => restoreTriggerFocus())
      leaveFocusElement.value = null
    }
  }
)

watch(
  () => props.open,
  (open) => {
    parentPushContext?.setChildOpen(drawerId, open)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  parentPushContext?.setChildOpen(drawerId, false)
})

const resolveSemanticConfig = <T,>(
  config: DrawerSemanticConfig<T> | undefined,
  part: DrawerSemanticPart
): T | undefined => {
  const resolved = typeof config === 'function' ? config({ props }) : config
  return resolved?.[part]
}

const semanticClass = (part: DrawerSemanticPart) => resolveSemanticConfig(props.classNames, part)
const semanticStyle = (part: DrawerSemanticPart): CSSProperties | undefined =>
  resolveSemanticConfig(props.styles, part)

const captureTriggerElement = () => {
  triggerElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
}

const restoreTriggerFocus = () => {
  const target = triggerElement.value

  if (!shouldFocusTriggerAfterClose.value || !target || !document.contains(target)) {
    return
  }

  target.focus()
}

const isFocusableElementAvailable = (element: HTMLElement) =>
  !element.hasAttribute('hidden') &&
  element.getAttribute('aria-hidden') !== 'true' &&
  element.tabIndex >= 0 &&
  !(element instanceof HTMLInputElement && element.type === 'hidden')

const getFocusableElements = () => {
  const panel = panelRef.value

  if (!panel) {
    return []
  }

  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable)
}

const focusPanel = () => {
  if (!props.open) {
    return
  }

  const panel = panelRef.value
  const target = getFocusableElements()[0] ?? panel

  target?.focus()
}

onMounted(() => {
  if (!props.open) {
    return
  }

  captureTriggerElement()
  focusPanel()
})

const handleTrapTab = (event: KeyboardEvent) => {
  if (!props.open || !shouldTrapFocus.value || event.key !== 'Tab') {
    return
  }

  const panel = panelRef.value

  if (!panel) {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0] ?? panel
  const lastElement = focusableElements[focusableElements.length - 1] ?? panel
  const activeElement = document.activeElement

  if (event.shiftKey) {
    if (activeElement === firstElement || !panel.contains(activeElement)) {
      event.preventDefault()
      lastElement.focus()
    }

    return
  }

  if (activeElement === lastElement || !panel.contains(activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
}

function getNextResizeSize(event: PointerEvent | MouseEvent) {
  const start = resizeStart.value

  if (!start) {
    return activePanelSize.value
  }

  switch (props.placement) {
    case 'left':
      return clampResizeSize(start.size + event.clientX - start.clientX)
    case 'top':
      return clampResizeSize(start.size + event.clientY - start.clientY)
    case 'bottom':
      return clampResizeSize(start.size + start.clientY - event.clientY)
    case 'right':
    default:
      return clampResizeSize(start.size + start.clientX - event.clientX)
  }
}

function handleResizeMove(event: Event) {
  if (!resizeStart.value) {
    return
  }

  event.preventDefault()
  const nextSize = getNextResizeSize(event as PointerEvent | MouseEvent)
  resizedSize.value = nextSize
  resizableConfig.value?.onResize?.(nextSize)
}

function handleResizeEnd() {
  if (!resizeStart.value) {
    return
  }

  resizeStart.value = null
  resizableConfig.value?.onResizeEnd?.()
}

const { isDragging: isResizing, start: startPointerResize } = usePointerDrag({
  cursor: () => (props.placement === 'top' || props.placement === 'bottom' ? 'row-resize' : 'col-resize'),
  onMove: handleResizeMove,
  onEnd: (reason) => {
    if (reason === 'end') {
      handleResizeEnd()
    } else {
      resizeStart.value = null
    }
  }
})

function handleResizeStart(event: PointerEvent) {
  if (!isResizable.value) {
    return
  }

  startPointerResize(event)

  if (!isResizing.value) {
    return
  }

  resizeStart.value = {
    size: activePanelSize.value,
    clientX: event.clientX,
    clientY: event.clientY
  }
  resizableConfig.value?.onResizeStart?.()
}

const close = () => {
  emit('update:open', false)
  emit('close')
}

const handleCloseButtonClick = () => {
  if (isCloseButtonDisabled.value) {
    return
  }

  close()
}

const handleMaskClick = () => {
  if (isMaskClosable.value) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  handleTrapTab(event)

  if (props.keyboard && event.key === 'Escape') {
    close()
  }
}
</script>
