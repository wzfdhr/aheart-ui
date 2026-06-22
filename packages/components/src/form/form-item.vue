<template>
  <div class="aheart-form-item" :class="formItemClass" :data-name="name">
    <label v-if="label || $slots.label" class="aheart-form-item__label">
      <span v-if="required" class="aheart-form-item__required" aria-hidden="true">*</span>
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="aheart-form-item__control">
      <div class="aheart-form-item__content">
        <slot />
        <span v-if="hasFeedback" class="aheart-form-item__feedback" aria-hidden="true">{{ feedbackIcon }}</span>
      </div>
      <div v-if="help || $slots.help" class="aheart-form-item__help">
        <slot name="help">{{ help }}</slot>
      </div>
      <div v-if="extra || $slots.extra" class="aheart-form-item__extra">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formItemProps } from './types'
import './style.css'

defineOptions({
  name: 'AFormItem'
})

const props = defineProps(formItemProps)

const formItemClass = computed(() => ({
  [`aheart-form-item--${props.validateStatus}`]: props.validateStatus,
  'is-required': props.required,
  'has-feedback': props.hasFeedback
}))

const feedbackIcon = computed(() => {
  const iconMap = {
    success: '✓',
    warning: '!',
    error: '×',
    validating: '…'
  }

  return props.validateStatus ? iconMap[props.validateStatus] : ''
})
</script>
