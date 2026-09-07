<template>
  <AFormControlSlot v-if="noStyle" />
  <div v-else ref="itemRef" v-show="!hidden" class="aheart-form-item" :class="formItemClass" :data-name="typeof name === 'string' ? name : JSON.stringify(name)">
    <label
      v-if="$slots.label || (label !== undefined && label !== null)"
      class="aheart-form-item__label"
      :id="labelId"
      :for="htmlFor ?? declaredControlId() ?? explicitControlId ?? controlId"
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
        <AFormControlSlot />
        <span v-if="hasFeedback" class="aheart-form-item__feedback" aria-hidden="true">{{ feedbackIcon }}</span>
      </div>
      <div v-if="hasHelp || $slots.help" :id="effectiveValidateStatus === 'error' ? errorId : helpId" class="aheart-form-item__help" :role="effectiveValidateStatus === 'error' ? 'alert' : undefined">
        <slot name="help">
          <AFormItemRenderNode :node="effectiveHelp" />
        </slot>
      </div>
      <div v-if="hasExtra || $slots.extra" :id="extraId" class="aheart-form-item__extra">
        <slot name="extra">
          <AFormItemRenderNode :node="extra" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneVNode, Fragment, computed, defineComponent, inject, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, useSlots, watch, type PropType, type VNode, type VNodeChild } from 'vue'
import Tooltip from '../tooltip/tooltip.vue'
import { useStableId } from '../utils/use-stable-id'
import { formControlKey, mergeAriaIds } from './control-context'
import {
  formContextKey,
  formItemProps,
  type FormItemTooltipConfig,
  type FormMessageVariables,
  type FormNamePath,
  type FormTooltipTitle
} from './types'
import './style.css'

defineOptions({
  name: 'AFormItem'
})

const props = defineProps(formItemProps)
const formContext = inject(formContextKey, undefined)
const ATooltip = Tooltip
const slots = useSlots()
const itemRef = ref<HTMLElement>()
const explicitControlId = ref<string>()
const stableId = useStableId(undefined, 'aheart-field').value
const controlId = computed(() => props.htmlFor ?? `${stableId}-control`)
const labelId = `${stableId}-label`
const helpId = `${stableId}-help`
const errorId = `${stableId}-error`
const extraId = `${stableId}-extra`
const declaredControlId = () => {
  const find = (nodes: VNodeChild[]): string | undefined => {
    for (const node of nodes) {
      if (Array.isArray(node)) {
        const id = find(node)
        if (id) return id
      } else if (isVNode(node)) {
        const componentName = typeof node.type === 'object' && node.type ? (node.type as { name?: string }).name : undefined
        if (componentName === 'AFormItem') continue
        const isControl = typeof node.type !== 'string' ? node.type !== Fragment : ['input', 'select', 'textarea'].includes(node.type)
        if (isControl && typeof node.props?.id === 'string') {
          return componentName === 'ADateRangePicker' || componentName === 'ATimeRangePicker' ? `${node.props.id}-start` : node.props.id
        }
        if (componentName === 'ADateRangePicker' || componentName === 'ATimeRangePicker') return `${controlId.value}-start`
        if ((typeof node.type === 'string' || node.type === Fragment) && Array.isArray(node.children)) {
          const id = find(node.children as VNodeChild[])
          if (id) return id
        }
      }
    }
  }
  return find(slots.default?.() ?? [])
}
let disposed = false
const notifyControl = (kind: 'change' | 'blur') => {
  const name = typeof props.name === 'string' ? props.name : props.name ? [...props.name] : undefined
  if (name === undefined) return
  void nextTick(() => {
    if (disposed || JSON.stringify(name) !== JSON.stringify(props.name)) return
    if (kind === 'change') formContext?.onFieldChange(name)
    else formContext?.onFieldBlur(name)
  })
}
const syncExplicitControlId = () => {
  explicitControlId.value = itemRef.value?.querySelector<HTMLElement>('.aheart-form-item__content input:not([type="hidden"]), .aheart-form-item__content [role="combobox"], .aheart-form-item__content select, .aheart-form-item__content textarea')?.id || undefined
}
onMounted(syncExplicitControlId)
onUpdated(syncExplicitControlId)

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
  name: typeof props.name === 'string' ? props.name : props.name?.join('.') ?? '',
  ...(labelMessageVariable.value !== undefined ? { label: labelMessageVariable.value } : {}),
  ...props.messageVariables
}))
const fieldErrors = computed(() => (props.name !== undefined ? (formContext?.getFieldErrors(props.name) ?? []) : []))
const isRequired = computed(() => Boolean(props.required || (props.name !== undefined && formContext?.isFieldRequired(props.name))))
const showRequiredMark = computed(() => isRequired.value && formContext?.requiredMark.value !== false)
const showOptionalMark = computed(
  () => Boolean(props.label || props.name) && !isRequired.value && formContext?.requiredMark.value === 'optional'
)
const effectiveValidateStatus = computed(() =>
  props.validateStatus ??
  (props.name !== undefined && formContext?.isFieldValidating(props.name)
    ? 'validating'
    : fieldErrors.value.length > 0
      ? 'error'
      : undefined)
)
const effectiveHelp = computed(() => (props.help !== undefined ? props.help : (fieldErrors.value[0] ?? '')))
const hasHelp = computed(() => hasRenderableContent(effectiveHelp.value))
const hasExtra = computed(() => hasRenderableContent(props.extra))
const hasTooltip = computed(() => hasRenderableContent(tooltipTitle.value))

const labelledBy = computed(() => !props.noStyle && (slots.label || props.label !== undefined && props.label !== null) ? labelId : undefined)
const describedBy = computed(() => props.noStyle ? undefined : mergeAriaIds(
  hasHelp.value || slots.help ? effectiveValidateStatus.value === 'error' ? errorId : helpId : undefined,
  hasExtra.value || slots.extra ? extraId : undefined
))
provide(formControlKey, {
  controlId,
  labelledBy,
  describedBy,
  invalid: computed(() => effectiveValidateStatus.value === 'error'),
  status: effectiveValidateStatus,
  change: () => notifyControl('change'),
  blur: () => notifyControl('blur')
})

// Native controls in ordinary HTML slots participate too; component controls
// consume the same context without rewriting their VNodes or event contracts.
const AFormControlSlot = defineComponent({
  name: 'AFormControlSlot',
  setup() {
    return () => {
      let nativeIndex = 0
      const visit = (node: VNodeChild): VNodeChild => {
        if (Array.isArray(node)) return node.map(visit)
        if (!isVNode(node)) return node
        if (typeof node.type === 'string' && ['input', 'select', 'textarea'].includes(node.type) && node.props?.type !== 'hidden') {
          const index = nativeIndex++
          return cloneVNode(node, {
            id: node.props?.id ?? (index ? `${controlId.value}-${index}` : controlId.value),
            'aria-labelledby': mergeAriaIds(node.props?.['aria-labelledby'], labelledBy.value),
            'aria-describedby': mergeAriaIds(node.props?.['aria-describedby'], describedBy.value),
            'aria-invalid': node.props?.['aria-invalid'] ?? (effectiveValidateStatus.value === 'error' ? 'true' : undefined),
            onInput: () => notifyControl('change'),
            onChange: () => notifyControl('change'),
            onBlur: () => notifyControl('blur')
          })
        }
        if ((typeof node.type === 'string' || node.type === Fragment) && Array.isArray(node.children)) {
          const copy = cloneVNode(node)
          copy.children = node.children.map((child) => visit(child as VNodeChild)) as VNode[]
          return copy
        }
        return node
      }
      return visit(slots.default?.() ?? [])
    }
  }
})

let registeredName: FormNamePath | undefined
watch(
  () => [props.name, effectiveRules.value, props.validateFirst, effectiveMessageVariables.value, props.dependencies, props.validateTrigger, props.preserve] as const,
  ([name, rules, validateFirst, messageVariables, dependencies, validateTrigger, preserve]) => {
    const previousName = registeredName

    if (previousName !== undefined && JSON.stringify(previousName) !== JSON.stringify(name)) {
      formContext?.unregisterField(previousName)
    }

    if (name !== undefined) {
      formContext?.registerField(name, rules, validateFirst, messageVariables, { dependencies, validateTrigger, preserve })
    }
    registeredName = typeof name === 'string' ? name : name ? [...name] : undefined
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  disposed = true
  if (registeredName !== undefined) {
    formContext?.unregisterField(registeredName)
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
