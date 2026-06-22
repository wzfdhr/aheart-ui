<template>
  <div
    v-if="open"
    class="aheart-modal"
    role="presentation"
    tabindex="-1"
    @keydown="handleKeydown"
  >
    <div v-if="mask" class="aheart-modal__mask" @click="handleMaskClick" />
    <div class="aheart-modal__wrap">
      <section
        class="aheart-modal__dialog"
        :class="{ 'is-centered': centered }"
        :style="dialogStyle"
        role="dialog"
        aria-modal="true"
      >
        <header v-if="title || $slots.title || closable" class="aheart-modal__header">
          <div v-if="title || $slots.title" class="aheart-modal__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button v-if="closable" class="aheart-modal__close" type="button" aria-label="Close" @click="close">
            ×
          </button>
        </header>
        <div class="aheart-modal__body">
          <slot />
        </div>
        <footer v-if="hasFooter" class="aheart-modal__footer">
          <slot name="footer">
            <AButton class="aheart-modal__cancel" @click="handleCancel">{{ cancelText }}</AButton>
            <AButton
              class="aheart-modal__ok"
              :type="okType"
              :loading="confirmLoading"
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
import { computed, useSlots } from 'vue'
import AButton from '../button'
import { modalEmits, modalProps } from './types'
import './style.css'

defineOptions({
  name: 'AModal'
})

const props = defineProps(modalProps)
const emit = defineEmits(modalEmits)
const slots = useSlots()

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

const dialogStyle = computed(() => ({
  width: normalizeSize(props.width)
}))

const hasFooter = computed(() => props.footer || Boolean(slots.footer))

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
