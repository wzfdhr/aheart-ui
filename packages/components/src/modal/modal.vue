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
      <div v-if="isMaskVisible" :class="maskClass" :style="semanticStyle('mask')" @click="handleMaskClick" />
      <div :class="wrapClass" :style="wrapStyle" @click.self="handleMaskClick">
        <AModalRenderWrapper :renderer="modalRender">
          <section
            ref="dialogRef"
            :class="dialogClass"
            :style="dialogStyle"
            role="dialog"
            aria-modal="true"
            :aria-label="hasTitle ? undefined : dialogAriaLabel"
            :aria-labelledby="hasTitle ? titleId : undefined"
            tabindex="-1"
          >
            <header v-if="hasHeader" :class="headerClass" :style="semanticStyle('header')">
              <div v-if="hasTitle" :id="titleId" :class="titleClass" :style="semanticStyle('title')">
                <slot name="title">
                  <AModalRenderNode :node="title" />
                </slot>
              </div>
              <button
                v-if="showCloseButton"
                :class="closeClass"
                :style="semanticStyle('close')"
                :disabled="isCloseButtonDisabled"
                type="button"
                :aria-label="closeAriaLabel"
                @click="handleCloseButtonClick"
              >
                <AModalRenderNode :node="resolvedCloseIcon" />
              </button>
            </header>
            <div :class="bodyClass" :style="semanticStyle('body')">
              <ASkeleton v-if="loading" active :paragraph="{ rows: 3 }" />
              <slot v-else />
            </div>
            <footer v-if="hasFooter" :class="footerClass" :style="semanticStyle('footer')">
              <slot name="footer">
                <AModalRenderNode :node="footerContent" />
              </slot>
            </footer>
          </section>
        </AModalRenderWrapper>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type PropType,
  type VNodeChild
} from 'vue'
import AButton from '../button'
import { useAheartConfig } from '../config'
import ASkeleton from '../skeleton'
import { useMotionPresence } from '../utils/use-motion-presence'
import { useTeleportReady } from '../utils/use-teleport-ready'
import {
  modalEmits,
  modalProps,
  type ModalButtonProps,
  type ModalClosableConfig,
  type ModalFocusableConfig,
  type ModalFooterRenderExtra,
  type ModalMaskConfig,
  type ModalRender,
  type ModalResponsiveWidth,
  type ModalSemanticConfig,
  type ModalSemanticPart,
  type ModalWidth
} from './types'
import {
  getRecentPointerTarget,
  isTopmost,
  lockBodyScroll,
  prepareOverlayDocument,
  refreshOverlayStack,
  registerOverlay,
  unlockBodyScroll,
  unregisterOverlay
} from '../utils/overlay-controller'
import './style.css'

defineOptions({
  name: 'AModal'
})

const props = defineProps(modalProps)
const emit = defineEmits(modalEmits)
const slots = useSlots()
const config = useAheartConfig()
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
const modalWidthBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

const triggerElement = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
const leaveFocusElement = ref<HTMLElement | null>(null)
const modalStackId = Symbol('aheart-modal')
const titleId = `aheart-modal-title-${instance?.uid ?? 'dialog'}`
let pendingCloseCompletion = false
let overlayRegistered = false
let overlayDocument: Document | null = null
const effectiveZIndex = ref(props.zIndex)

const getModalDocument = () => {
  const target = teleportTarget.value
  return dialogRef.value?.ownerDocument ??
    triggerElement.value?.ownerDocument ??
    (typeof target === 'object' && target ? target.ownerDocument : document)
}
const isModalTopmost = () => isTopmost(modalStackId, overlayDocument ?? getModalDocument())

const registerModalOverlay = () => {
  if (overlayRegistered) return
  const ownerDocument = getModalDocument()
  registerOverlay({
    id: modalStackId,
    document: ownerDocument,
    getTrigger: () => triggerElement.value,
    getContent: () => dialogRef.value,
    escapeEnabled: () => props.open && props.keyboard,
    getBaseZIndex: () => props.zIndex,
    onZIndexChange: (zIndex) => {
      effectiveZIndex.value = zIndex
    },
    onEscape: close
  })
  lockBodyScroll(ownerDocument)
  overlayDocument = ownerDocument
  overlayRegistered = true
}

const unregisterModalOverlay = () => {
  if (!overlayRegistered) return
  const ownerDocument = overlayDocument ?? getModalDocument()
  unregisterOverlay(modalStackId, ownerDocument)
  unlockBodyScroll(ownerDocument)
  overlayDocument = null
  overlayRegistered = false
}

const AModalRenderNode = defineComponent({
  name: 'AModalRenderNode',
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

const AModalRenderWrapper = defineComponent({
  name: 'AModalRenderWrapper',
  props: {
    renderer: Function as PropType<ModalRender>
  },
  setup(renderProps, { slots }) {
    return () => {
      const node = slots.default?.() ?? null
      return renderProps.renderer ? renderProps.renderer(node) : node
    }
  }
})

const isClosableConfig = (value: typeof props.closable): value is ModalClosableConfig =>
  typeof value === 'object' && value !== null

const isMaskConfig = (value: typeof props.mask): value is ModalMaskConfig =>
  typeof value === 'object' && value !== null

const isFocusableConfig = (value: typeof props.focusable): value is ModalFocusableConfig =>
  typeof value === 'object' && value !== null

const hasRenderable = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return value !== undefined && value !== null && value !== false && value !== true && value !== ''
}

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)
const isResponsiveWidth = (value: ModalWidth): value is ModalResponsiveWidth =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const getDefaultContainer = () => (typeof document === 'undefined' ? false : document.body)
const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer())
const teleportTarget = computed(() => {
  const container = resolvedContainer.value

  if (typeof window === 'undefined' && typeof container === 'function') return false
  return typeof container === 'function' ? container() : container
})
const teleportReady = useTeleportReady()
const shouldTeleport = computed(() => teleportReady.value && teleportTarget.value !== false)
const teleportTo = computed(() => (teleportTarget.value === false ? 'body' : teleportTarget.value))
const fixedDialogWidth = computed(() => {
  const width = props.width

  return isResponsiveWidth(width) ? undefined : normalizeSize(width)
})
const responsiveWidthVars = computed(() => {
  const width = props.width

  if (!isResponsiveWidth(width)) {
    return {}
  }

  const style: Record<string, string> = {}

  modalWidthBreakpoints.forEach((breakpoint) => {
    const breakpointWidth = width[breakpoint]

    if (breakpointWidth !== undefined && breakpointWidth !== null) {
      style[`--aheart-modal-${breakpoint}-width`] = normalizeSize(breakpointWidth)
    }
  })

  return style
})

const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose)
const motion = useMotionPresence(() => props.open, {
  forceRender: () => props.forceRender,
  destroyOnHidden: () => shouldDestroy.value,
  duration: 180
})
const shouldRender = motion.isMounted

const dialogStyle = computed(() => ({
  ...props.style,
  ...responsiveWidthVars.value,
  ...semanticStyles('dialog', 'container'),
  width: fixedDialogWidth.value
}))

const rootStyle = computed(() => ({
  ...props.rootStyle,
  ...semanticStyle('root'),
  zIndex: effectiveZIndex.value
}))

const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasHeader = computed(() => hasTitle.value || showCloseButton.value)
const hasFooter = computed(
  () => !props.loading && (Boolean(slots.footer) || (props.footer !== false && props.footer !== null))
)

const rootClass = computed(() => ['aheart-modal', `is-${motion.phase.value}`, props.rootClassName, semanticClass('root')])
const maskConfig = computed(() => (isMaskConfig(props.mask) ? props.mask : undefined))
const isMaskVisible = computed(() => (props.mask === false ? false : maskConfig.value?.enabled !== false))
const isMaskBlurred = computed(() => maskConfig.value?.blur === true)
const isMaskClosable = computed(() => maskConfig.value?.closable ?? props.maskClosable)
const maskClass = computed(() => [
  'aheart-modal__mask',
  {
    'is-blur': isMaskBlurred.value
  },
  semanticClass('mask')
])
const wrapClass = computed(() => ['aheart-modal__wrap', props.wrapClassName, semanticClasses('wrap', 'wrapper')])
const wrapStyle = computed(() => semanticStyles('wrap', 'wrapper'))
const dialogClass = computed(() => [
  'aheart-modal__dialog',
  {
    'is-centered': props.centered
  },
  props.className,
  semanticClasses('dialog', 'container')
])
const headerClass = computed(() => ['aheart-modal__header', semanticClass('header')])
const titleClass = computed(() => ['aheart-modal__title', semanticClass('title')])
const bodyClass = computed(() => ['aheart-modal__body', { 'is-loading': props.loading }, semanticClass('body')])
const footerClass = computed(() => ['aheart-modal__footer', semanticClass('footer')])
const closeClass = computed(() => ['aheart-modal__close', semanticClass('close')])
const closableConfig = computed(() => (isClosableConfig(props.closable) ? props.closable : undefined))
const focusableConfig = computed(() => (isFocusableConfig(props.focusable) ? props.focusable : undefined))
const shouldFocusTriggerAfterClose = computed(
  () => focusableConfig.value?.focusTriggerAfterClose ?? props.focusTriggerAfterClose ?? true
)
const shouldTrapFocus = computed(() => focusableConfig.value?.trap ?? isMaskVisible.value)
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
const hasExplicitProp = (name: string) => Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, name)
const resolvedOkText = computed<VNodeChild>(() =>
  hasExplicitProp('okText') ? props.okText : config.value.locale?.modal?.okText ?? 'OK'
)
const resolvedCancelText = computed<VNodeChild>(() =>
  hasExplicitProp('cancelText') ? props.cancelText : config.value.locale?.modal?.cancelText ?? 'Cancel'
)
const closeAriaLabel = computed(() => config.value.locale?.modal?.close ?? 'Close')
const dialogAriaLabel = computed(() => config.value.locale?.modal?.ariaLabel ?? 'Dialog')

const resolvedCancelButtonProps = computed(() => props.cancelButtonProps ?? {})
const resolvedOkButtonProps = computed(() => ({
  ...props.okButtonProps,
  type: props.okButtonProps?.type ?? props.okType,
  loading: props.confirmLoading || Boolean(props.okButtonProps?.loading)
}))
const createFooterButton = (
  className: string,
  buttonProps: ModalButtonProps,
  onClick: () => void,
  content: VNodeChild
) => {
  const { class: customClass, ...restButtonProps } = buttonProps as ModalButtonProps & { class?: unknown }

  return h(
    AButton,
    {
      ...restButtonProps,
      class: [className, customClass],
      onClick
    },
    () => content
  )
}
const cancelButtonNode = computed(() =>
  createFooterButton('aheart-modal__cancel', resolvedCancelButtonProps.value, handleCancel, resolvedCancelText.value)
)
const okButtonNode = computed(() =>
  createFooterButton('aheart-modal__ok', resolvedOkButtonProps.value, handleOk, resolvedOkText.value)
)
const defaultFooterNode = computed(() => [cancelButtonNode.value, okButtonNode.value])
const footerRenderExtra = computed<ModalFooterRenderExtra>(() => ({
  okButton: okButtonNode.value,
  cancelButton: cancelButtonNode.value,
  OkBtn: () => okButtonNode.value,
  CancelBtn: () => cancelButtonNode.value
}))
const footerContent = computed(() => {
  if (typeof props.footer === 'function') {
    return props.footer(defaultFooterNode.value, footerRenderExtra.value)
  }

  if (props.footer === true) {
    return defaultFooterNode.value
  }

  return props.footer
})

watch(
  () => props.open,
  (open, previousOpen) => {
    if (open && !previousOpen) {
      pendingCloseCompletion = false
      leaveFocusElement.value = null
      if (motion.phase.value === 'hidden') captureTriggerElement()
      registerModalOverlay()
      emit('afterOpenChange', true)
    }

    if (!open) {
      pendingCloseCompletion = true
      const ownerDocument = overlayDocument ?? getModalDocument()
      const activeElement = ownerDocument.activeElement
      const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement
      leaveFocusElement.value =
        HTMLElementConstructor && activeElement instanceof HTMLElementConstructor && dialogRef.value?.contains(activeElement)
          ? activeElement as HTMLElement
          : null
      void nextTick(() => {
        if (motion.phase.value === 'leave' && leaveFocusElement.value && ownerDocument.contains(leaveFocusElement.value)) {
          leaveFocusElement.value.focus()
        }
      })
    }
  },
  { flush: 'sync' }
)

watch(
  () => props.zIndex,
  (zIndex) => {
    if (overlayRegistered) refreshOverlayStack(overlayDocument ?? getModalDocument())
    else effectiveZIndex.value = zIndex
  }
)

watch(
  () => props.open,
  (open) => {
    if (open && isModalTopmost()) focusDialog()
  },
  { flush: 'post' }
)

watch(
  () => motion.phase.value,
  (phase) => {
    if (phase === 'entered' && props.open && isModalTopmost()) {
      void nextTick(() => focusDialog())
      return
    }

    if (phase === 'hidden' && !props.open && pendingCloseCompletion) {
      unregisterModalOverlay()
      pendingCloseCompletion = false
      emit('afterOpenChange', false)
      emit('afterClose')
      closableConfig.value?.afterClose?.()
      void nextTick(() => restoreTriggerFocus())
      leaveFocusElement.value = null
    }
  }
)

const resolveSemanticConfig = <T,>(
  config: ModalSemanticConfig<T> | undefined,
  part: ModalSemanticPart
): T | undefined => {
  const resolved = typeof config === 'function' ? config({ props }) : config
  return resolved?.[part]
}

const semanticClass = (part: ModalSemanticPart) => resolveSemanticConfig(props.classNames, part)
const semanticStyle = (part: ModalSemanticPart): CSSProperties | undefined =>
  resolveSemanticConfig(props.styles, part)
const semanticClasses = (...parts: ModalSemanticPart[]) => parts.map((part) => semanticClass(part))
const semanticStyles = (...parts: ModalSemanticPart[]): CSSProperties | undefined => {
  const merged = parts.reduce<CSSProperties>(
    (styles, part) => ({
      ...styles,
      ...semanticStyle(part)
    }),
    {}
  )

  return Object.keys(merged).length > 0 ? merged : undefined
}

const captureTriggerElement = () => {
  const ownerDocument = getModalDocument()
  const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement
  const pointerTarget = getRecentPointerTarget(ownerDocument)
  triggerElement.value = HTMLElementConstructor && pointerTarget instanceof HTMLElementConstructor
    ? pointerTarget
    : HTMLElementConstructor && ownerDocument.activeElement instanceof HTMLElementConstructor
      ? ownerDocument.activeElement as HTMLElement
      : null
}

const restoreTriggerFocus = () => {
  const target = triggerElement.value

  if (!shouldFocusTriggerAfterClose.value || !target || !target.ownerDocument.contains(target)) {
    return
  }

  target.focus()
}

const isFocusableElementAvailable = (element: HTMLElement) =>
  !element.hasAttribute('hidden') &&
  element.getAttribute('aria-hidden') !== 'true' &&
  element.tabIndex >= 0 &&
  !(element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'hidden')

const getFocusableElements = () => {
  const dialog = dialogRef.value

  if (!dialog) {
    return []
  }

  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable)
}

const focusDialog = () => {
  if (!props.open) {
    return
  }

  const dialog = dialogRef.value
  const target = getFocusableElements()[0] ?? dialog

  target?.focus()
}

onBeforeMount(() => {
  if (props.open) registerModalOverlay()
})

onMounted(() => {
  prepareOverlayDocument(getModalDocument())

  if (!props.open || !isModalTopmost()) {
    return
  }

  captureTriggerElement()
  focusDialog()
})
onBeforeUnmount(() => {
  unregisterModalOverlay()
})

const handleTrapTab = (event: KeyboardEvent) => {
  if (!props.open || !isModalTopmost() || !shouldTrapFocus.value || event.key !== 'Tab') {
    return
  }

  const dialog = dialogRef.value

  if (!dialog) {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0] ?? dialog
  const lastElement = focusableElements[focusableElements.length - 1] ?? dialog
  const activeElement = dialog.ownerDocument.activeElement

  if (event.shiftKey) {
    if (activeElement === firstElement || !dialog.contains(activeElement)) {
      event.preventDefault()
      lastElement.focus()
    }

    return
  }

  if (activeElement === lastElement || !dialog.contains(activeElement)) {
    event.preventDefault()
    firstElement.focus()
  }
}

const notifyClosableClose = () => {
  closableConfig.value?.onClose?.()
}

const close = () => {
  notifyClosableClose()
  emit('update:open', false)
  emit('close')
}

const handleCloseButtonClick = () => {
  if (isCloseButtonDisabled.value) {
    return
  }

  close()
}

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const handleMaskClick = () => {
  if (isMaskClosable.value) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  handleTrapTab(event)

  // The document capture listener owns normal browser events. Keep a local
  // fallback for detached/custom-document hosts where the event never reaches it.
  const ownerDocument = overlayDocument ?? getModalDocument()
  if (
    !event.composedPath().includes(ownerDocument) &&
    props.open &&
    props.keyboard &&
    event.key === 'Escape' &&
    isModalTopmost()
  ) {
    event.preventDefault()
    event.stopPropagation()
    close()
  }
}
</script>
