<template>
  <div
    v-if="open"
    class="aheart-drawer"
    role="presentation"
    tabindex="-1"
    @keydown="handleKeydown"
  >
    <div v-if="mask" class="aheart-drawer__mask" @click="handleMaskClick" />
    <section
      class="aheart-drawer__panel"
      :class="`aheart-drawer__panel--${placement}`"
      :style="panelStyle"
      role="dialog"
      aria-modal="true"
    >
      <header v-if="title || $slots.title || $slots.extra || closable" class="aheart-drawer__header">
        <button v-if="closable" class="aheart-drawer__close" type="button" aria-label="Close" @click="close">
          ×
        </button>
        <div v-if="title || $slots.title" class="aheart-drawer__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="$slots.extra" class="aheart-drawer__extra">
          <slot name="extra" />
        </div>
      </header>
      <div class="aheart-drawer__body">
        <slot />
      </div>
      <footer v-if="hasFooter" class="aheart-drawer__footer">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { drawerEmits, drawerProps } from './types'
import './style.css'

defineOptions({
  name: 'ADrawer'
})

const props = defineProps(drawerProps)
const emit = defineEmits(drawerEmits)
const slots = useSlots()

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')

const panelStyle = computed(() =>
  isVertical.value
    ? { height: normalizeSize(props.height) }
    : { width: normalizeSize(props.width) }
)

const hasFooter = computed(() => props.footer || Boolean(slots.footer))

const close = () => {
  emit('update:open', false)
  emit('close')
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
