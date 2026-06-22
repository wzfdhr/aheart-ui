<template>
  <div class="aheart-message" :style="messageStyle">
    <div
      v-for="notice in notices"
      :key="notice.key"
      class="aheart-message-notice"
      :class="`aheart-message-notice--${notice.type}`"
      role="status"
      aria-live="polite"
    >
      <span class="aheart-message-notice__icon" aria-hidden="true">{{ iconMap[notice.type] }}</span>
      <span class="aheart-message-notice__content">{{ notice.content }}</span>
      <button
        class="aheart-message-notice__close"
        type="button"
        aria-label="Close"
        @click="$emit('close', notice.key)"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { messageEmits, messageProps } from './types'
import './style.css'

defineOptions({
  name: 'AMessage'
})

const props = defineProps(messageProps)
defineEmits(messageEmits)

const iconMap = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×',
  loading: '…'
}

const normalizeTop = (top: number | string) => (typeof top === 'number' ? `${top}px` : top)

const messageStyle = computed(() => ({
  top: normalizeTop(props.top)
}))
</script>
