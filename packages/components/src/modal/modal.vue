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
    <div v-if="mask" :class="maskClass" :style="semanticStyle('mask')" @click="handleMaskClick" />
    <div :class="wrapClass" :style="semanticStyle('wrap')">
      <AModalRenderWrapper :renderer="modalRender">
        <section
          :class="dialogClass"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
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
import { computed, defineComponent, h, ref, useSlots, watch, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import AButton from '../button'
import ASkeleton from '../skeleton'
import {
  modalEmits,
  modalProps,
  type ModalButtonProps,
  type ModalClosableConfig,
  type ModalFooterRenderExtra,
  type ModalRender,
  type ModalSemanticPart
} from './types'
import './style.css'

defineOptions({
  name: 'AModal'
})

const props = defineProps(modalProps)
const emit = defineEmits(modalEmits)
const slots = useSlots()
const hasRendered = ref(props.open || props.forceRender)

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
const hasFooter = computed(() => Boolean(slots.footer) || (props.footer !== false && props.footer !== null))

const rootClass = computed(() => ['aheart-modal', props.rootClassName, semanticClass('root')])
const maskClass = computed(() => ['aheart-modal__mask', semanticClass('mask')])
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
  (open) => {
    if (open) {
      hasRendered.value = true
    } else if (shouldDestroy.value && !props.forceRender) {
      hasRendered.value = false
    }

    emit('afterOpenChange', open)

    if (!open) {
      emit('afterClose')
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

const semanticClass = (part: ModalSemanticPart) => props.classNames?.[part]
const semanticStyle = (part: ModalSemanticPart): CSSProperties | undefined => props.styles?.[part]

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
  if (props.maskClosable) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.keyboard && event.key === 'Escape') {
    close()
  }
}
</script>
