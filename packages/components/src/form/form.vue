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

const cloneInitialValue = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneInitialValue(item)) as T
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T
  }

  if (value instanceof Map) {
    return new Map(Array.from(value, ([key, item]) => [cloneInitialValue(key), cloneInitialValue(item)])) as T
  }

  if (value instanceof Set) {
    return new Set(Array.from(value, (item) => cloneInitialValue(item))) as T
  }

  if (value && typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value)

    if (prototype === Object.prototype || prototype === null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, cloneInitialValue(item)])
      ) as T
    }
  }

  return value
}

const isSameFormValue = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) {
    return true
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((item, index) => isSameFormValue(item, right[index]))
    )
  }

  if (left instanceof Date || right instanceof Date) {
    return left instanceof Date && right instanceof Date && left.getTime() === right.getTime()
  }

  if (left instanceof Map || right instanceof Map) {
    if (!(left instanceof Map) || !(right instanceof Map) || left.size !== right.size) {
      return false
    }

    const leftEntries = Array.from(left.entries())
    const rightEntries = Array.from(right.entries())
    return leftEntries.every(
      ([key, value], index) =>
        isSameFormValue(key, rightEntries[index]?.[0]) &&
        isSameFormValue(value, rightEntries[index]?.[1])
    )
  }

  if (left instanceof Set || right instanceof Set) {
    if (!(left instanceof Set) || !(right instanceof Set) || left.size !== right.size) {
      return false
    }

    const leftValues = Array.from(left.values())
    const rightValues = Array.from(right.values())
    return leftValues.every((value, index) => isSameFormValue(value, rightValues[index]))
  }

  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const leftPrototype = Object.getPrototypeOf(left)
    const rightPrototype = Object.getPrototypeOf(right)
    const isPlainObject = (prototype: object | null) =>
      prototype === Object.prototype || prototype === null

    if (!isPlainObject(leftPrototype) || !isPlainObject(rightPrototype)) {
      return false
    }

    const leftRecord = left as Record<string, unknown>
    const rightRecord = right as Record<string, unknown>
    const leftKeys = Object.keys(leftRecord)
    const rightKeys = Object.keys(rightRecord)

    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every(
        (key) =>
          Object.prototype.hasOwnProperty.call(rightRecord, key) &&
          isSameFormValue(leftRecord[key], rightRecord[key])
      )
    )
  }

  return false
}

const initialValues = cloneInitialValue(props.model)
const retiredFieldNames = new Set<string>()
const validationRuns = new Map<string, number>()
let submissionRun = 0

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

type RuleValidationResult = string | undefined
type MaybePromise<T> = T | Promise<T>

const isPromiseLike = <T>(value: MaybePromise<T>): value is Promise<T> =>
  typeof (value as Promise<T> | undefined)?.then === 'function'

const normalizeValidatorResult = (result: void | boolean | string, message: string): RuleValidationResult => {
  if (typeof result === 'string') {
    return result
  }

  return result === false ? message : undefined
}

const normalizeValidatorError = (error: unknown, message: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return typeof error === 'string' && error ? error : message
}

const validateRule = (name: string, value: unknown, rule: FormRule): MaybePromise<RuleValidationResult> => {
  const message = interpolateMessage(rule.message ?? getDefaultMessage(name, rule), getRuleMessageVariables(name, rule))

  if (rule.required && isEmptyValue(value)) {
    return message
  }

  if (!isEmptyValue(value)) {
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
  }

  if (!rule.validator) {
    return undefined
  }

  try {
    const result = rule.validator(rule, value, props.model)

    if (isPromiseLike(result)) {
      return result.then(
        (resolved) => normalizeValidatorResult(resolved, message),
        (error) => normalizeValidatorError(error, message)
      )
    }

    return normalizeValidatorResult(result, message)
  } catch (error) {
    return normalizeValidatorError(error, message)
  }
}

const ensureFieldState = (name: string) => {
  if (!fieldStates[name]) {
    fieldStates[name] = { errors: [], validating: false, rules: [], validateFirst: false, messageVariables: {} }
  }

  return fieldStates[name]
}

const collectRuleErrors = (
  name: string,
  rules: FormRule[],
  validateFirst: FormValidateFirst
): MaybePromise<string[]> => {
  if (validateFirst === true) {
    const runNext = (index: number): MaybePromise<string[]> => {
      for (let ruleIndex = index; ruleIndex < rules.length; ruleIndex += 1) {
        const result = validateRule(name, props.model[name], rules[ruleIndex])

        if (isPromiseLike(result)) {
          return result.then((error) => (error ? [error] : runNext(ruleIndex + 1)))
        }

        if (result) {
          return [result]
        }
      }

      return []
    }

    return runNext(0)
  }

  const results = rules.map((rule) => validateRule(name, props.model[name], rule))
  const finalize = (resolved: RuleValidationResult[]) => {
    const errors = resolved.filter((error): error is string => Boolean(error))
    return validateFirst === 'parallel' ? errors.slice(0, 1) : errors
  }

  return results.some(isPromiseLike)
    ? Promise.all(results.map((result) => Promise.resolve(result))).then(finalize)
    : finalize(results as RuleValidationResult[])
}

const validateField = (name: string): MaybePromise<FormValidationError | undefined> => {
  const fieldState = ensureFieldState(name)
  const runId = (validationRuns.get(name) ?? 0) + 1
  validationRuns.set(name, runId)
  const result = collectRuleErrors(name, getRules(name), fieldState.validateFirst)

  const finish = (errors: string[]) => {
    if (validationRuns.get(name) !== runId || retiredFieldNames.has(name)) {
      return undefined
    }

    if (fieldStates[name]) {
      fieldStates[name].errors = errors
      fieldStates[name].validating = false
    }

    emit('validate', name, errors.length === 0, errors)

    return errors.length > 0 ? { name, errors } : undefined
  }

  if (isPromiseLike(result)) {
    fieldState.validating = true
    return result.then(finish)
  }

  return finish(result)
}

const getFieldNames = () =>
  Array.from(new Set([...Object.keys(props.rules), ...Object.keys(fieldStates)])).filter(
    (name) => !retiredFieldNames.has(name)
  )

const validateFields = (names?: string[]) => {
  const results = (names ?? getFieldNames()).map((name) => validateField(name))
  const finish = (resolved: Array<FormValidationError | undefined>) => ({
    values: cloneValues(),
    errorFields: resolved.filter((error): error is FormValidationError => Boolean(error))
  })

  return results.some(isPromiseLike)
    ? Promise.all(results.map((result) => Promise.resolve(result))).then(finish)
    : finish(results as Array<FormValidationError | undefined>)
}

const validate = () => validateFields()

const resetFields = (names?: string[]) => {
  submissionRun += 1
  const targetNames = names ?? getFieldNames()

  targetNames.forEach((name) => {
    validationRuns.set(name, (validationRuns.get(name) ?? 0) + 1)

    if (Object.prototype.hasOwnProperty.call(initialValues, name)) {
      props.model[name] = cloneInitialValue(initialValues[name])
    } else {
      delete props.model[name]
    }

    if (fieldStates[name]) {
      fieldStates[name].errors = []
      fieldStates[name].validating = false
    }
  })
}

const clearValidate = (names?: string[]) => {
  const targetNames = names ?? Object.keys(fieldStates)
  targetNames.forEach((name) => {
    if (fieldStates[name]) {
      validationRuns.set(name, (validationRuns.get(name) ?? 0) + 1)
      fieldStates[name].errors = []
      fieldStates[name].validating = false
    }
  })
}

const setFieldValue = (name: string, value: unknown) => {
  props.model[name] = value
  clearValidate([name])
}

const setFieldsValue = (values: FormModel) => {
  Object.entries(values).forEach(([name, value]) => {
    props.model[name] = value
  })
  clearValidate(Object.keys(values))
}

const getFieldValue = (name: string) => props.model[name]

const pickValues = (names: string[]) =>
  names.reduce<FormModel>((values, name) => {
    values[name] = props.model[name]
    return values
  }, {})

const getFieldsValue = (names?: string[] | true) => {
  if (names === true) {
    return cloneValues()
  }

  return pickValues(names ?? getFieldNames())
}

const getFieldError = (name: string) => [...(fieldStates[name]?.errors ?? [])]

const getFieldsError = (names?: string[]) =>
  (names ?? getFieldNames()).map((name) => ({
    name,
    errors: getFieldError(name)
  }))

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
    retiredFieldNames.delete(name)
    fieldStates[name] = {
      errors: fieldStates[name]?.errors ?? [],
      validating: fieldStates[name]?.validating ?? false,
      rules,
      validateFirst,
      messageVariables
    }
  },
  unregisterField(name) {
    retiredFieldNames.add(name)
    validationRuns.set(name, (validationRuns.get(name) ?? 0) + 1)
    delete fieldStates[name]
  },
  getFieldErrors(name) {
    return fieldStates[name]?.errors ?? []
  },
  isFieldValidating(name) {
    return fieldStates[name]?.validating ?? false
  },
  isFieldRequired(name) {
    return getRules(name).some((rule) => rule.required)
  }
}

provide(formContextKey, formContext)

const handleSubmit = (event: Event) => {
  emit('submit', event)
  submissionRun += 1
  const runId = submissionRun
  const submittedValues = cloneInitialValue(props.model)
  const validationResult = validate()

  const finishSubmission = (result: { values: FormModel; errorFields: FormValidationError[] }) => {
    if (runId !== submissionRun || !isSameFormValue(submittedValues, props.model)) {
      return
    }

    if (result.errorFields.length > 0) {
      emit('finishFailed', result)
      scrollToFirstError(result.errorFields)
      return
    }

    emit('finish', result.values)
  }

  if (isPromiseLike(validationResult)) {
    void validationResult.then(finishSubmission)
    return
  }

  finishSubmission(validationResult)
}

defineExpose({
  validate,
  validateFields,
  resetFields,
  clearValidate,
  setFieldValue,
  setFieldsValue,
  getFieldValue,
  getFieldsValue,
  getFieldError,
  getFieldsError,
  scrollToField
})
</script>
