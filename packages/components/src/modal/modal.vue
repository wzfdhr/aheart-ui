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
      <section
        :class="dialogClass"
        :style="dialogStyle"
        role="dialog"
        aria-modal="true"
      >
        <header v-if="title || $slots.title || closable" :class="headerClass" :style="semanticStyle('header')">
          <div v-if="title || $slots.title" :class="titleClass" :style="semanticStyle('title')">
            <slot name="title">{{ title }}</slot>
          </div>
          <button v-if="closable" :class="closeClass" :style="semanticStyle('close')" type="button" aria-label="Close" @click="close">
            ×
          </button>
        </header>
        <div :class="bodyClass" :style="semanticStyle('body')">
          <ASkeleton v-if="loading" active :paragraph="{ rows: 3 }" />
          <slot v-else />
        </div>
        <footer v-if="hasFooter" :class="footerClass" :style="semanticStyle('footer')">
          <slot name="footer">
            <AButton class="aheart-modal__cancel" v-bind="resolvedCancelButtonProps" @click="handleCancel">{{ cancelText }}</AButton>
            <AButton
              class="aheart-modal__ok"
              v-bind="resolvedOkButtonProps"
              @click="handleOk"
            >
              {{ okText }}
            </AButton>
          </slot>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch, type CSSProperties } from 'vue'
import AButton from '../button'
import ASkeleton from '../skeleton'
import { modalEmits, modalProps, type ModalSemanticPart } from './types'
import './style.css'

defineOptions({
  name: 'AModal'
})

const props = defineProps(modalProps)
const emit = defineEmits(modalEmits)
const slots = useSlots()
const hasRendered = ref(props.open || props.forceRender)

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

const hasFooter = computed(() => props.footer || Boolean(slots.footer))

const rootClass = computed(() => ['aheart-modal', props.rootClassName, semanticClass('root')])
const maskClass = computed(() => ['aheart-modal__mask', semanticClass('mask')])
const wrapClass = computed(() => ['aheart-modal__wrap', semanticClass('wrap')])
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

const resolvedCancelButtonProps = computed(() => props.cancelButtonProps ?? {})
const resolvedOkButtonProps = computed(() => ({
  ...props.okButtonProps,
  type: props.okButtonProps?.type ?? props.okType,
  loading: props.confirmLoading || Boolean(props.okButtonProps?.loading)
}))

watch(
  () => props.open,
  (open) => {
    if (open) {
      hasRendered.value = true
    } else if (shouldDestroy.value && !props.forceRender) {
      hasRendered.value = false
    }

    emit('afterOpenChange', open)
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
