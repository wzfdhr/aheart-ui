<template>
  <slot v-if="noStyle" />
  <div v-else v-show="!hidden" class="aheart-form-item" :class="formItemClass" :data-name="name">
    <label
      v-if="$slots.label || (label !== undefined && label !== null)"
      class="aheart-form-item__label"
      :for="htmlFor"
    >
      <span v-if="showRequiredMark" class="aheart-form-item__required" aria-hidden="true">*</span>
      <slot name="label">
        <AFormItemRenderNode :node="label" />
      </slot>
      <span v-if="showOptionalMark" class="aheart-form-item__optional">optional</span>
      <span v-if="hasTooltip" class="aheart-form-item__tooltip">
        <ATooltip v-bind="resolvedTooltipProps">
          <span class="aheart-form-item__tooltip-icon" aria-hidden="true">
            <AFormItemRenderNode :node="tooltipIcon" />
          </span>
        </ATooltip>
      </span>
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
import { computed, defineComponent, inject, isVNode, onBeforeUnmount, watch, type PropType, type VNodeChild } from 'vue'
import Tooltip from '../tooltip/tooltip.vue'
import {
  formContextKey,
  formItemProps,
  type FormItemTooltipConfig,
  type FormMessageVariables,
  type FormTooltipTitle
} from './types'
import './style.css'

defineOptions({
  name: 'AFormItem'
})

const props = defineProps(formItemProps)
const formContext = inject(formContextKey, undefined)
const ATooltip = Tooltip

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

const hasRenderableContent = (value: FormTooltipTitle | VNodeChild | undefined) => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (typeof value === 'function') {
    return true
  }

  return value !== undefined && value !== null && value !== false && value !== ''
}

const isTooltipConfig = (value: typeof props.tooltip): value is FormItemTooltipConfig =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !isVNode(value)

const tooltipTitle = computed<FormTooltipTitle | undefined>(() => {
  if (isTooltipConfig(props.tooltip)) {
    return props.tooltip.title
  }

  return props.tooltip
})

const tooltipIcon = computed<VNodeChild>(() =>
  isTooltipConfig(props.tooltip) && props.tooltip.icon !== undefined ? props.tooltip.icon : '?'
)

const resolvedTooltipProps = computed(() => {
  if (isTooltipConfig(props.tooltip)) {
    const { icon: _icon, title: _title, ...tooltipProps } = props.tooltip

    return {
      ...tooltipProps,
      title: tooltipTitle.value
    }
  }

  return {
    title: tooltipTitle.value
  }
})

const effectiveRules = computed(() => props.rules ?? [])
const labelMessageVariable = computed(() =>
  typeof props.label === 'string' || typeof props.label === 'number' ? String(props.label) : undefined
)
const effectiveMessageVariables = computed<FormMessageVariables>(() => ({
  name: props.name ?? '',
  ...(labelMessageVariable.value !== undefined ? { label: labelMessageVariable.value } : {}),
  ...props.messageVariables
}))
const fieldErrors = computed(() => (props.name ? (formContext?.getFieldErrors(props.name) ?? []) : []))
const isRequired = computed(() => Boolean(props.required || (props.name && formContext?.isFieldRequired(props.name))))
const showRequiredMark = computed(() => isRequired.value && formContext?.requiredMark.value !== false)
const showOptionalMark = computed(
  () => Boolean(props.label || props.name) && !isRequired.value && formContext?.requiredMark.value === 'optional'
)
const effectiveValidateStatus = computed(() =>
  props.validateStatus ??
  (props.name && formContext?.isFieldValidating(props.name)
    ? 'validating'
    : fieldErrors.value.length > 0
      ? 'error'
      : undefined)
)
const effectiveHelp = computed(() => (props.help !== undefined ? props.help : (fieldErrors.value[0] ?? '')))
const hasHelp = computed(() => hasRenderableContent(effectiveHelp.value))
const hasExtra = computed(() => hasRenderableContent(props.extra))
const hasTooltip = computed(() => hasRenderableContent(tooltipTitle.value))

watch(
  () => [props.name, effectiveRules.value, props.validateFirst, effectiveMessageVariables.value] as const,
  ([name, rules, validateFirst, messageVariables], previous) => {
    const previousName = previous?.[0]

    if (previousName && previousName !== name) {
      formContext?.unregisterField(previousName)
    }

    if (name) {
      formContext?.registerField(name, rules, validateFirst, messageVariables)
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
  [`aheart-form-item--${props.layout}`]: props.layout,
  [`aheart-form-item--label-${props.labelAlign}`]: props.labelAlign,
  'aheart-form-item--colon': props.colon === true,
  'aheart-form-item--no-colon': props.colon === false,
  'aheart-form-item--hidden': props.hidden,
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
