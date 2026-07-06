<template>
  <div class="aheart-form-item" :class="formItemClass" :data-name="name">
    <label v-if="$slots.label || (label !== undefined && label !== null)" class="aheart-form-item__label">
      <span v-if="showRequiredMark" class="aheart-form-item__required" aria-hidden="true">*</span>
      <slot name="label">
        <AFormItemRenderNode :node="label" />
      </slot>
      <span v-if="showOptionalMark" class="aheart-form-item__optional">optional</span>
    </label>
    <div class="aheart-form-item__control">
      <div class="aheart-form-item__content">
        <slot />
        <span v-if="hasFeedback" class="aheart-form-item__feedback" aria-hidden="true">{{ feedbackIcon }}</span>
      </div>
      <div v-if="hasHelp || $slots.help" class="aheart-form-item__help">
        <slot name="help">
          <AFormItemRenderNode :node="effectiveHelp" />
        </slot>
      </div>
      <div v-if="hasExtra || $slots.extra" class="aheart-form-item__extra">
        <slot name="extra">
          <AFormItemRenderNode :node="extra" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, inject, onBeforeUnmount, watch, type PropType, type VNodeChild } from 'vue'
import { formContextKey, formItemProps } from './types'
import './style.css'

defineOptions({
  name: 'AFormItem'
})

const props = defineProps(formItemProps)
const formContext = inject(formContextKey, undefined)

const AFormItemRenderNode = defineComponent({
  name: 'AFormItemRenderNode',
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

const hasRenderableContent = (value: VNodeChild | undefined) => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return value !== undefined && value !== null && value !== false && value !== ''
}

const effectiveRules = computed(() => props.rules ?? [])
const fieldErrors = computed(() => (props.name ? (formContext?.getFieldErrors(props.name) ?? []) : []))
const isRequired = computed(() => Boolean(props.required || (props.name && formContext?.isFieldRequired(props.name))))
const showRequiredMark = computed(() => isRequired.value && formContext?.requiredMark.value !== false)
const showOptionalMark = computed(
  () => Boolean(props.label || props.name) && !isRequired.value && formContext?.requiredMark.value === 'optional'
)
const effectiveValidateStatus = computed(() => props.validateStatus ?? (fieldErrors.value.length > 0 ? 'error' : undefined))
const effectiveHelp = computed(() => (props.help !== undefined ? props.help : (fieldErrors.value[0] ?? '')))
const hasHelp = computed(() => hasRenderableContent(effectiveHelp.value))
const hasExtra = computed(() => hasRenderableContent(props.extra))

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
