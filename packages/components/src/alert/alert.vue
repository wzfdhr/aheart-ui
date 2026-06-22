<template>
  <div class="aheart-alert" :class="alertClass" role="alert">
    <span v-if="showIcon" class="aheart-alert__icon" aria-hidden="true">{{ iconText }}</span>
    <div class="aheart-alert__content">
      <div v-if="message" class="aheart-alert__message">{{ message }}</div>
      <div v-if="description || $slots.default" class="aheart-alert__description">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button v-if="closable" class="aheart-alert__close" type="button" aria-label="Close" @click="handleClose">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { alertEmits, alertProps } from './types'
import './style.css'

defineOptions({
  name: 'AAlert'
})

const props = defineProps(alertProps)
const emit = defineEmits(alertEmits)

const iconMap = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×'
}

const iconText = computed(() => iconMap[props.type])
const alertClass = computed(() => `aheart-alert--${props.type}`)

const handleClose = (event: MouseEvent) => {
  emit('close', event)
}
</script>
