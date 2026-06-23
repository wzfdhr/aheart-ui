<template>
  <div
    v-if="shouldRender"
    v-show="open"
    :class="rootClass"
    :style="rootStyle"
    role="presentation"
    tabindex="-1"
    @keydown="handleKeydown"
  >
    <div v-if="isMaskVisible" :class="maskClass" :style="semanticStyle('mask')" @click="handleMaskClick" />
    <div :class="wrapClass" :style="semanticStyle('wrap')">
      <AModalRenderWrapper :renderer="modalRender">
        <section
          ref="dialogRef"
          :class="dialogClass"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <header v-if="hasHeader" :class="headerClass" :style="semanticStyle('header')">
            <div v-if="hasTitle" :class="titleClass" :style="semanticStyle('title')">
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
              aria-label="Close"
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
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  useSlots,
  watch,
  type CSSProperties,
  type PropType,
  type VNodeChild
} from 'vue'
import AButton from '../button'
import ASkeleton from '../skeleton'
import {
  modalEmits,
  modalProps,
  type ModalButtonProps,
  type ModalClosableConfig,
  type ModalFocusableConfig,
  type ModalFooterRenderExtra,
  type ModalMaskConfig,
  type ModalRender,
  type ModalSemanticConfig,
  type ModalSemanticPart
} from './types'
import './style.css'

defineOptions({
  name: 'AModal'
})

const props = defineProps(modalProps)
const emit = defineEmits(modalEmits)
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
const dialogRef = ref<HTMLElement | null>(null)

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

const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose)
const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value)

const dialogStyle = computed(() => ({
  ...props.style,
  ...semanticStyle('dialog'),
  width: normalizeSize(props.width)
}))

const rootStyle = computed(() => ({
  ...props.rootStyle,
  ...semanticStyle('root'),
  zIndex: props.zIndex
}))

const hasTitle = computed(() => Boolean(slots.title) || hasRenderable(props.title))
const hasHeader = computed(() => hasTitle.value || showCloseButton.value)
const hasFooter = computed(
  () => !props.loading && (Boolean(slots.footer) || (props.footer !== false && props.footer !== null))
)

const rootClass = computed(() => ['aheart-modal', props.rootClassName, semanticClass('root')])
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
const wrapClass = computed(() => ['aheart-modal__wrap', props.wrapClassName, semanticClass('wrap')])
const dialogClass = computed(() => [
  'aheart-modal__dialog',
  {
    'is-centered': props.centered
  },
  props.className,
  semanticClass('dialog')
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
  createFooterButton('aheart-modal__cancel', resolvedCancelButtonProps.value, handleCancel, props.cancelText)
)
const okButtonNode = computed(() =>
  createFooterButton('aheart-modal__ok', resolvedOkButtonProps.value, handleOk, props.okText)
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
      captureTriggerElement()
    }

    if (open) {
      hasRendered.value = true
    } else if (shouldDestroy.value && !props.forceRender) {
      hasRendered.value = false
    }

    emit('afterOpenChange', open)

    if (!open) {
      emit('afterClose')
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
  config: ModalSemanticConfig<T> | undefined,
  part: ModalSemanticPart
): T | undefined => {
  const resolved = typeof config === 'function' ? config({ props }) : config
  return resolved?.[part]
}

const semanticClass = (part: ModalSemanticPart) => resolveSemanticConfig(props.classNames, part)
const semanticStyle = (part: ModalSemanticPart): CSSProperties | undefined =>
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
  const dialog = dialogRef.value

  if (!dialog) {
    return []
  }

  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableElementAvailable)
}

const handleTrapTab = (event: KeyboardEvent) => {
  if (!props.open || !shouldTrapFocus.value || event.key !== 'Tab') {
    return
  }

  const dialog = dialogRef.value

  if (!dialog) {
    return
  }

  const focusableElements = getFocusableElements()
  const firstElement = focusableElements[0] ?? dialog
  const lastElement = focusableElements[focusableElements.length - 1] ?? dialog
  const activeElement = document.activeElement

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

  if (props.keyboard && event.key === 'Escape') {
    close()
  }
}
</script>
