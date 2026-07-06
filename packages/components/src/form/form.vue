<template>
  <form ref="formElement" class="aheart-form" :class="formClass" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide, reactive, ref } from 'vue'
import { provideAheartConfig } from '../config'
import {
  formContextKey,
  formEmits,
  formProps,
  type FormContext,
  type FormFieldState,
  type FormMessageVariables,
  type FormModel,
  type FormRule,
  type FormValidateFirst,
  type FormValidationError
} from './types'
import './style.css'

defineOptions({
  name: 'AForm'
})

const props = defineProps(formProps)
const emit = defineEmits(formEmits)
const fieldStates = reactive<Record<string, FormFieldState>>({})
const formElement = ref<HTMLFormElement>()

provideAheartConfig(
  computed(() => ({
    size: props.size,
    disabled: props.disabled,
    variant: props.variant
  }))
)

const formClass = computed(() => [
  `aheart-form--${props.layout}`,
  `aheart-form--label-${props.labelAlign}`,
  `aheart-form--required-${props.requiredMark === false ? 'hidden' : props.requiredMark === 'optional' ? 'optional' : 'visible'}`,
  {
    [`aheart-form--${props.variant}`]: props.variant,
    'aheart-form--no-colon': !props.colon
  }
])

const cloneValues = (): FormModel => ({ ...props.model })

const getRules = (name: string) => [...(props.rules[name] ?? []), ...(fieldStates[name]?.rules ?? [])]

const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

const getValueSize = (value: unknown) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length
  }

  return undefined
}

const getDefaultMessage = (name: string, rule: FormRule) => {
  if (rule.required) {
    return `${name} is required`
  }

  if (rule.type) {
    return `${name} is not a valid ${rule.type}`
  }

  if (rule.len !== undefined) {
    return `${name} length must be ${rule.len}`
  }

  if (rule.min !== undefined) {
    return `${name} must be at least ${rule.min}`
  }

  if (rule.max !== undefined) {
    return `${name} must be at most ${rule.max}`
  }

  if (rule.pattern) {
    return `${name} format is invalid`
  }

  return `${name} is invalid`
}

const stringifyMessageVariable = (value: unknown) => (value === undefined || value === null ? '' : String(value))

const interpolateMessage = (message: string, variables: Record<string, unknown>) =>
  message.replace(/\\?\$\{([^}]+)\}/g, (match, key: string) =>
    match.startsWith('\\') ? match.slice(1) : stringifyMessageVariable(variables[key.trim()])
  )

const getRuleMessageVariables = (name: string, rule: FormRule) => ({
  name,
  ...(fieldStates[name]?.messageVariables ?? {}),
  ...(rule.type !== undefined ? { type: rule.type } : {}),
  ...(rule.len !== undefined ? { len: rule.len } : {}),
  ...(rule.min !== undefined ? { min: rule.min } : {}),
  ...(rule.max !== undefined ? { max: rule.max } : {})
})

const validateRule = (name: string, value: unknown, rule: FormRule) => {
  const message = interpolateMessage(rule.message ?? getDefaultMessage(name, rule), getRuleMessageVariables(name, rule))

  if (rule.required && isEmptyValue(value)) {
    return message
  }

  if (isEmptyValue(value)) {
    return undefined
  }

  if (rule.type === 'email' && (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
    return message
  }

  if (rule.type === 'number' && typeof value !== 'number') {
    return message
  }

  if (rule.type === 'string' && typeof value !== 'string') {
    return message
  }

  if (rule.type === 'array' && !Array.isArray(value)) {
    return message
  }

  const valueSize = getValueSize(value)

  if (rule.len !== undefined && valueSize !== rule.len) {
    return message
  }

  if (rule.min !== undefined && valueSize !== undefined && valueSize < rule.min) {
    return message
  }

  if (rule.max !== undefined && valueSize !== undefined && valueSize > rule.max) {
    return message
  }

  if (rule.pattern && (typeof value !== 'string' || !rule.pattern.test(value))) {
    return message
  }

  return undefined
}

const validateField = (name: string): FormValidationError | undefined => {
  const validateFirst = Boolean(fieldStates[name]?.validateFirst)
  const errors: string[] = []

  for (const rule of getRules(name)) {
    const error = validateRule(name, props.model[name], rule)

    if (error) {
      errors.push(error)

      if (validateFirst) {
        break
      }
    }
  }

  if (!fieldStates[name]) {
    fieldStates[name] = { errors: [], rules: [], validateFirst: false, messageVariables: {} }
  }

  fieldStates[name].errors = errors
  emit('validate', name, errors.length === 0, errors)

  return errors.length > 0 ? { name, errors } : undefined
}

const getFieldNames = () => Array.from(new Set([...Object.keys(props.rules), ...Object.keys(fieldStates)]))

const validate = () => {
  const errorFields = getFieldNames()
    .map((name) => validateField(name))
    .filter((error): error is FormValidationError => Boolean(error))

  return {
    values: cloneValues(),
    errorFields
  }
}

const clearValidate = (names?: string[]) => {
  const targetNames = names ?? Object.keys(fieldStates)
  targetNames.forEach((name) => {
    if (fieldStates[name]) {
      fieldStates[name].errors = []
    }
  })
}

const scrollToField = (name: string, options?: ScrollIntoViewOptions) => {
  const target = Array.from(formElement.value?.querySelectorAll<HTMLElement>('[data-name]') ?? []).find(
    (element) => element.dataset.name === name
  )

  if (!target) {
    return
  }

  if (options === undefined) {
    target.scrollIntoView()
    return
  }

  target.scrollIntoView(options)
}

const scrollToFirstError = (errorFields: FormValidationError[]) => {
  if (!props.scrollToFirstError || errorFields.length === 0) {
    return
  }

  scrollToField(errorFields[0].name, props.scrollToFirstError === true ? undefined : props.scrollToFirstError)
}

const formContext: FormContext = {
  requiredMark: computed(() => props.requiredMark),
  colon: computed(() => props.colon),
  registerField(name, rules, validateFirst: FormValidateFirst, messageVariables: FormMessageVariables) {
    fieldStates[name] = {
      errors: fieldStates[name]?.errors ?? [],
      rules,
      validateFirst,
      messageVariables
    }
  },
  unregisterField(name) {
    delete fieldStates[name]
  },
  getFieldErrors(name) {
    return fieldStates[name]?.errors ?? []
  },
  isFieldRequired(name) {
    return getRules(name).some((rule) => rule.required)
  }
}

provide(formContextKey, formContext)

const handleSubmit = (event: Event) => {
  emit('submit', event)
  const validationResult = validate()

  if (validationResult.errorFields.length > 0) {
    emit('finishFailed', validationResult)
    scrollToFirstError(validationResult.errorFields)
    return
  }

  emit('finish', validationResult.values)
}

defineExpose({
  validate,
  clearValidate,
  scrollToField
})
</script>
