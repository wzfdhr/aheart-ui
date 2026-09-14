<template>
  <AFormControlSlot v-if="noStyle" />
  <div v-else ref="itemRef" v-show="!hidden" class="aheart-form-item" :class="formItemClass" :data-name="dataName">
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
import { formInternalContextKey } from './internal-context'
import { formListNameContextKey } from './list-context'
import { namePathKey } from './name-path'
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
const formInternalContext = inject(formInternalContextKey, undefined)
const formListContext = inject(formListNameContextKey, undefined)
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
const resolvedName = computed<FormNamePath | undefined>(() =>
  props.name === undefined ? undefined : formListContext?.resolveName(props.name) ?? props.name
)
const resolvedOwner = computed<string | undefined>(() =>
  props.name === undefined ? undefined : formListContext?.resolveOwner(props.name)
)
const resolvedDependencies = computed(() =>
  (props.dependencies ?? []).map(dependency => formListContext?.resolveName(dependency) ?? dependency)
)
const dataName = computed(() => {
  const name = resolvedName.value
  return name === undefined ? undefined : typeof name === 'string' ? name : JSON.stringify(name)
})
const notifyControl = (kind: 'change' | 'blur') => {
  const currentName = resolvedName.value
  const name = typeof currentName === 'string' ? currentName : currentName ? [...currentName] : undefined
  const owner = resolvedOwner.value
  if (name === undefined) return
  void nextTick(() => {
    const latestName = resolvedName.value
    if (disposed || latestName === undefined) return
    if (formInternalContext && owner) {
      if (kind === 'change') formInternalContext.onOwnedFieldChange(name, owner)
      else formInternalContext.onOwnedFieldBlur(name, owner)
    } else if (namePathKey(name) === namePathKey(latestName)) {
      if (kind === 'change') formContext?.onFieldChange(name)
      else formContext?.onFieldBlur(name)
    }
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
  name: typeof resolvedName.value === 'string' ? resolvedName.value : resolvedName.value?.join('.') ?? '',
  ...(labelMessageVariable.value !== undefined ? { label: labelMessageVariable.value } : {}),
  ...props.messageVariables
}))
const fieldErrors = computed(() => {
  const name = resolvedName.value
  if (name === undefined) return []
  return resolvedOwner.value && formInternalContext
    ? formInternalContext.getFieldErrors(name)
    : formContext?.getFieldErrors(name) ?? []
})
const isRequired = computed(() => {
  const name = resolvedName.value
  if (props.required) return true
  if (name === undefined) return false
  return resolvedOwner.value && formInternalContext
    ? formInternalContext.isFieldRequired(name)
    : formContext?.isFieldRequired(name) ?? false
})
const showRequiredMark = computed(() => isRequired.value && formContext?.requiredMark.value !== false)
const showOptionalMark = computed(
  () => Boolean(props.label || props.name) && !isRequired.value && formContext?.requiredMark.value === 'optional'
)
const effectiveValidateStatus = computed(() =>
  props.validateStatus ??
  (resolvedName.value !== undefined && (resolvedOwner.value && formInternalContext
    ? formInternalContext.isFieldValidating(resolvedName.value)
    : formContext?.isFieldValidating(resolvedName.value))
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
let registeredOwner: string | undefined
watch(
  () => [resolvedName.value, effectiveRules.value, props.validateFirst, effectiveMessageVariables.value, resolvedDependencies.value, props.validateTrigger, props.preserve, resolvedOwner.value] as const,
  ([name, rules, validateFirst, messageVariables, dependencies, validateTrigger, preserve, owner]) => {
    const previousName = registeredName
    const previousOwner = registeredOwner

    if (previousName !== undefined && (name === undefined || namePathKey(previousName) !== namePathKey(name) || previousOwner !== owner)) {
      if (previousOwner && formInternalContext) formInternalContext.unregisterOwnedField(previousName, previousOwner)
      else formContext?.unregisterField(previousName)
    }

    if (name !== undefined) {
      if (owner && formInternalContext) formInternalContext.registerOwnedField(name, owner, rules, validateFirst, messageVariables, { dependencies, validateTrigger, preserve })
      else formContext?.registerField(name, rules, validateFirst, messageVariables, { dependencies, validateTrigger, preserve })
    }
    registeredName = typeof name === 'string' ? name : name ? [...name] : undefined
    registeredOwner = owner
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  disposed = true
  if (registeredName !== undefined) {
    if (registeredOwner && formInternalContext) formInternalContext.unregisterOwnedField(registeredName, registeredOwner)
    else formContext?.unregisterField(registeredName)
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
