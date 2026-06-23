<template>
  <Teleport :to="teleportTo" :disabled="!shouldTeleport">
    <div
      v-if="shouldRender"
      v-show="open"
      :class="rootClass"
      :style="rootStyle"
      role="presentation"
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
            <div v-if="hasTitle" :class="titleClass" :style="semanticStyle('title')">
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
        </section>
      </ADrawerRenderWrapper>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type PropType,
  type VNodeChild
} from 'vue'
import ASkeleton from '../skeleton'
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
const hasRendered = ref(props.open || props.forceRender)
const triggerElement = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)
const getDefaultContainer = () => (typeof document === 'undefined' ? false : document.body)
const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer())
const teleportTarget = computed(() => {
  const container = resolvedContainer.value

  return typeof container === 'function' ? container() : container
})
const shouldTeleport = computed(() => teleportTarget.value !== false)
const teleportTo = computed(() => (teleportTarget.value === false ? 'body' : teleportTarget.value))

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose || props.destroyInactivePanel)
const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value)
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

const panelStyle = computed(() =>
  isVertical.value
    ? {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle('section'),
        height: normalizeSize(props.height ?? resolvedSize.value)
      }
    : {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle('section'),
        width: normalizeSize(props.width ?? resolvedSize.value)
      }
)

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

const rootClass = computed(() => ['aheart-drawer', props.rootClassName, semanticClass('root')])
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
const closeClass = computed(() => [
  'aheart-drawer__close',
  { 'is-end': isCloseAtEnd.value },
  semanticClass('close')
])

watch(
  () => props.open,
  (open, previousOpen) => {
    if (open && !previousOpen) {
      captureTriggerElement()
    }

    if (open) {
      hasRendered.value = true
    } else if (shouldDestroy.value && !props.forceRender) {
      hasRendered.value = false
    }

    emit('afterOpenChange', open)

    if (!open) {
      void nextTick(() => restoreTriggerFocus())
    }
  }
)

watch(
  () => props.forceRender,
  (forceRender) => {
    if (forceRender) {
      hasRendered.value = true
    }
  }
)

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
