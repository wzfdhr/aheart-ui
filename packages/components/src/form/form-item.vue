<template>
  <div class="aheart-form-item" :class="formItemClass" :data-name="name">
    <label v-if="label || $slots.label" class="aheart-form-item__label">
      <span v-if="showRequiredMark" class="aheart-form-item__required" aria-hidden="true">*</span>
      <slot name="label">{{ label }}</slot>
      <span v-if="showOptionalMark" class="aheart-form-item__optional">optional</span>
    </label>
    <div class="aheart-form-item__control">
      <div class="aheart-form-item__content">
        <slot />
        <span v-if="hasFeedback" class="aheart-form-item__feedback" aria-hidden="true">{{ feedbackIcon }}</span>
      </div>
      <div v-if="hasHelp || $slots.help" class="aheart-form-item__help">
        <slot name="help">{{ effectiveHelp }}</slot>
      </div>
      <div v-if="extra || $slots.extra" class="aheart-form-item__extra">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { formContextKey, formItemProps } from './types'
import './style.css'

defineOptions({
  name: 'AFormItem'
})

const props = defineProps(formItemProps)
const formContext = inject(formContextKey, undefined)

const effectiveRules = computed(() => props.rules ?? [])
const fieldErrors = computed(() => (props.name ? (formContext?.getFieldErrors(props.name) ?? []) : []))
const isRequired = computed(() => Boolean(props.required || (props.name && formContext?.isFieldRequired(props.name))))
const showRequiredMark = computed(() => isRequired.value && formContext?.requiredMark.value !== false)
const showOptionalMark = computed(
  () => Boolean(props.label || props.name) && !isRequired.value && formContext?.requiredMark.value === 'optional'
)
const effectiveValidateStatus = computed(() => props.validateStatus ?? (fieldErrors.value.length > 0 ? 'error' : undefined))
const effectiveHelp = computed(() => props.help ?? fieldErrors.value[0] ?? '')
const hasHelp = computed(() => Boolean(effectiveHelp.value))

watch(
  () => [props.name, effectiveRules.value] as const,
  ([name, rules], previous) => {
    const previousName = previous?.[0]

    if (previousName && previousName !== name) {
      formContext?.unregisterField(previousName)
    }

    if (name) {
      formContext?.registerField(name, rules)
    }
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  if (props.name) {
    formContext?.unregisterField(props.name)
  }
})

const formItemClass = computed(() => ({
  [`aheart-form-item--${effectiveValidateStatus.value}`]: effectiveValidateStatus.value,
  'is-required': isRequired.value,
  'is-optional': showOptionalMark.value,
  'has-feedback': props.hasFeedback
}))

const feedbackIcon = computed(() => {
  const iconMap = {
    success: '✓',
    warning: '!',
    error: '×',
    validating: '…'
  }

  return effectiveValidateStatus.value ? iconMap[effectiveValidateStatus.value] : ''
})
</script>
