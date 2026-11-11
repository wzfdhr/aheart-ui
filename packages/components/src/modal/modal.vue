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
import { useDialogLayer } from '../utils/use-dialog-layer'
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
  'audio[controls]',
  'video[controls]',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  'details > summary:first-of-type',
  '[tabindex]:not([tabindex="-1"])'
].join(',')
const modalWidthBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

const dialogRef = ref<HTMLElement | null>(null)
const modalStackId = Symbol('aheart-modal')
const titleId = `aheart-modal-title-${instance?.uid ?? 'dialog'}`
let pendingCloseCompletion = false

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
const layer = useDialogLayer({
  id: modalStackId,
  content: dialogRef,
  getContainer: () => props.getContainer,
  getZIndex: () => props.zIndex,
  escapeEnabled: () => props.open && props.keyboard,
  onEscape: () => close()
})
const { effectiveZIndex, shouldTeleport, teleportTo } = layer
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
      if (motion.phase.value === 'hidden') layer.captureTrigger()
      layer.register()
      emit('afterOpenChange', true)
    }

    if (!open) {
      pendingCloseCompletion = true
      layer.captureFocusBeforeClose(() => motion.phase.value === 'leave')
    }
  },
  { flush: 'sync' }
)

watch(
  () => props.open,
  (open) => {
    if (open && layer.isTopmost()) focusDialog()
  },
  { flush: 'post' }
)

watch(
  () => motion.phase.value,
  (phase) => {
    if (phase === 'entered' && props.open && layer.isTopmost()) {
      void nextTick(() => focusDialog())
      return
    }

    if (phase === 'hidden' && !props.open && pendingCloseCompletion) {
      layer.unregister()
      pendingCloseCompletion = false
      emit('afterOpenChange', false)
      emit('afterClose')
      closableConfig.value?.afterClose?.()
      void nextTick(() => {
        if (!props.open) layer.restoreTriggerFocus(shouldFocusTriggerAfterClose.value)
      })
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

const isEditableHost = (element: HTMLElement) => {
  const isEditable = (node: HTMLElement | null) => node && (node.isContentEditable || ['', 'true', 'plaintext-only'].includes(node.getAttribute('contenteditable') ?? 'false'))
  const parentHost = element.parentElement?.closest<HTMLElement>('[contenteditable]') ?? null
  return !element.hasAttribute('tabindex') && isEditable(element) && !isEditable(parentHost)
}

const isFocusableElementAvailable = (element: HTMLElement) => {
  if ((element.tabIndex < 0 && !isEditableHost(element)) || element.matches(':disabled') || (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'hidden')) return false
  const view = element.ownerDocument.defaultView
  const visibility = view?.getComputedStyle(element).visibility
  if (visibility === 'hidden' || visibility === 'collapse') return false
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    if (node.hidden || node.hasAttribute('inert') || node.getAttribute('aria-hidden') === 'true') return false
    if (view?.getComputedStyle(node).display === 'none') return false
    if (node !== element && node.tagName === 'DETAILS' && !node.hasAttribute('open')) {
      const summary = Array.from(node.children).find(child => child.tagName === 'SUMMARY')
      if (!summary?.contains(element)) return false
    }
    if (node === dialogRef.value) break
  }
  return true
}

const getFocusableElements = (tabOrder = false) => {
  const dialog = dialogRef.value
  if (!dialog) return []

  const candidates = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(isFocusableElementAvailable)
  if (tabOrder) candidates.sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER) - (b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER))
  const groups = new Map<Node, Map<string, HTMLInputElement[]>>()
  for (const element of candidates) {
    if (element.tagName !== 'INPUT') continue
    const input = element as HTMLInputElement
    if (input.type !== 'radio' || !input.name) continue
    const owner = input.form ?? input.getRootNode()
    if (!groups.has(owner)) groups.set(owner, new Map())
    const names = groups.get(owner)!
    if (!names.has(input.name)) names.set(input.name, [])
    names.get(input.name)!.push(input)
  }
  const excluded = new Set<HTMLElement>()
  for (const names of groups.values()) {
    for (const group of names.values()) {
      const target = group.find(input => input === dialog.ownerDocument.activeElement) ?? group.find(input => input.checked) ?? group[0]
      for (const input of group) if (input !== target) excluded.add(input)
    }
  }
  return candidates.filter(element => !excluded.has(element))
}

const focusElement = (element: HTMLElement) => {
  element.focus()
  const active = element.ownerDocument.activeElement
  return active === element || element.contains(active)
}

const focusDialog = () => {
  if (!props.open) {
    return
  }

  const dialog = dialogRef.value
  for (const target of getFocusableElements()) {
    if (focusElement(target)) return
  }
  dialog?.focus()
}

onBeforeMount(() => {
  if (props.open) layer.register()
})

onMounted(() => {
  layer.prepare()

  if (!props.open || !layer.isTopmost()) {
    return
  }

  layer.captureTrigger()
  focusDialog()
})

let pendingTabCheck: number | undefined
let pendingTabWindow: Window | null = null
const clearPendingTabCheck = () => {
  if (pendingTabCheck !== undefined) pendingTabWindow?.clearTimeout(pendingTabCheck)
  pendingTabCheck = undefined
  pendingTabWindow = null
}
watch(() => props.open, open => { if (!open) clearPendingTabCheck() }, { flush: 'sync' })
onBeforeUnmount(clearPendingTabCheck)

const handleTrapTab = (event: KeyboardEvent) => {
  if (!props.open || !layer.isTopmost() || !shouldTrapFocus.value || event.key !== 'Tab') return
  clearPendingTabCheck()
  if (event.defaultPrevented) return
  const dialog = dialogRef.value
  if (!dialog) return

  const elements = getFocusableElements(true)
  const active = dialog.ownerDocument.activeElement as HTMLElement | null
  const current = active ? elements.indexOf(active) : -1
  const direction = event.shiftKey ? -1 : 1
  const next = current < 0
    ? (event.shiftKey ? elements.length - 1 : 0)
    : (current + direction + elements.length) % elements.length
  const recover = () => {
    for (let offset = 0; offset < elements.length; offset += 1) {
      const index = (next + offset * direction + elements.length) % elements.length
      const target = elements[index]
      if (target.isConnected && dialog.contains(target) && isFocusableElementAvailable(target) && focusElement(target)) return
    }
    focusDialog()
  }
  const boundary = event.shiftKey ? active === elements[0] : active === elements[elements.length - 1]
  if (!elements.length || boundary || !dialog.contains(active)) {
    event.preventDefault()
    recover()
    return
  }

  // Keep native radio/editor/composite navigation. Some engines skip ordinary
  // controls and leave the document; recover only after that actually happens.
  const view = dialog.ownerDocument.defaultView
  if (!view) return
  pendingTabWindow = view
  pendingTabCheck = view.setTimeout(() => {
    pendingTabCheck = undefined
    pendingTabWindow = null
    if (!props.open || !shouldTrapFocus.value || !layer.isTopmost() || dialogRef.value !== dialog || !dialog.isConnected || view.closed) return
    if (!dialog.contains(dialog.ownerDocument.activeElement)) recover()
  }, 0)
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
  const ownerDocument = layer.getActiveDocument()
  if (
    !event.composedPath().includes(ownerDocument) &&
    props.open &&
    props.keyboard &&
    event.key === 'Escape' &&
    layer.isTopmost()
  ) {
    event.preventDefault()
    event.stopPropagation()
    close()
  }
}
</script>
