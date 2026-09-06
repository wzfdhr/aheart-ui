<template>
  <form ref="formElement" class="aheart-form" :class="formClass" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, reactive, ref, watch } from 'vue'
import { provideAheartConfig } from '../config'
import {
  formContextKey,
  formEmits,
  formProps,
  type FormContext,
  type FormFieldState,
  type FormMessageVariables,
  type FormModel,
  type FormNamePath,
  type FormRule,
  type FormValidateFirst,
  type FormValidationError
} from './types'
import { deleteNamePathValue, getNamePathValue, namePathKey, namePathLabel, normalizeNamePath, setNamePathValue } from './name-path'
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
const externalErrors = reactive(new Map<string, string[]>())
let submissionRun = 0
let validationRevision = 0
let disposed = false
let resetting = false
const staleValidation = Symbol('stale-validation')

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

const cloneValues = (): FormModel => cloneInitialValue(props.model)

const getRules = (name: FormNamePath) => [...(typeof name === 'string' ? (props.rules[name] ?? []) : []), ...(fieldStates[namePathKey(name)]?.rules ?? [])]

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

const getDefaultMessage = (name: FormNamePath, rule: FormRule) => {
  const label = namePathLabel(name)
  if (rule.required) {
    return `${label} is required`
  }

  if (rule.type) {
    return `${label} is not a valid ${rule.type}`
  }

  if (rule.len !== undefined) {
    return `${label} length must be ${rule.len}`
  }

  if (rule.min !== undefined) {
    return `${label} must be at least ${rule.min}`
  }

  if (rule.max !== undefined) {
    return `${label} must be at most ${rule.max}`
  }

  if (rule.pattern) {
    return `${label} format is invalid`
  }

  return `${label} is invalid`
}

const stringifyMessageVariable = (value: unknown) => (value === undefined || value === null ? '' : String(value))

const interpolateMessage = (message: string, variables: Record<string, unknown>) =>
  message.replace(/\\?\$\{([^}]+)\}/g, (match, key: string) =>
    match.startsWith('\\') ? match.slice(1) : stringifyMessageVariable(variables[key.trim()])
  )

const getRuleMessageVariables = (name: FormNamePath, rule: FormRule) => ({
  name: namePathLabel(name),
  ...(fieldStates[namePathKey(name)]?.messageVariables ?? {}),
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

const validateRule = (name: FormNamePath, value: unknown, rule: FormRule): MaybePromise<RuleValidationResult> => {
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

const ensureFieldState = (name: FormNamePath) => {
  const key = namePathKey(name)
  if (!fieldStates[key]) {
    fieldStates[key] = { errors: [], validating: false, rules: [], validateFirst: false, messageVariables: {}, dependencies: [], validateTrigger: props.validateTrigger, preserve: props.preserve }
  }

  return fieldStates[key]
}

const collectRuleErrors = (
  name: FormNamePath,
  rules: FormRule[],
  validateFirst: FormValidateFirst
): MaybePromise<string[]> => {
  if (validateFirst === true) {
    const runNext = (index: number): MaybePromise<string[]> => {
      for (let ruleIndex = index; ruleIndex < rules.length; ruleIndex += 1) {
        const result = validateRule(name, getNamePathValue(props.model, name), rules[ruleIndex])

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

  const results = rules.map((rule) => validateRule(name, getNamePathValue(props.model, name), rule))
  const finalize = (resolved: RuleValidationResult[]) => {
    const errors = resolved.filter((error): error is string => Boolean(error))
    return validateFirst === 'parallel' ? errors.slice(0, 1) : errors
  }

  return results.some(isPromiseLike)
    ? Promise.all(results.map((result) => Promise.resolve(result))).then(finalize)
    : finalize(results as RuleValidationResult[])
}

const validateField = (name: FormNamePath, trigger?: 'change' | 'blur'): MaybePromise<FormValidationError | undefined | typeof staleValidation> => {
  const key = namePathKey(name)
  const fieldState = ensureFieldState(name)
  if (!fieldNames.has(key) && !retiredFieldNames.has(key)) fieldNames.set(key, normalizeNamePath(name))
  const startedModel = cloneValues()
  const runId = (validationRuns.get(key) ?? 0) + 1
  validationRuns.set(key, runId)
  const rules = getRules(name).filter((rule) => {
    if (!trigger || rule.validateTrigger === undefined) return true
    if (rule.validateTrigger === false) return false
    return rule.validateTrigger === trigger || (Array.isArray(rule.validateTrigger) && rule.validateTrigger.includes(trigger))
  })
  const result = collectRuleErrors(name, rules, fieldState.validateFirst)

  const finish = (errors: string[]) => {
    if (disposed || validationRuns.get(key) !== runId || retiredFieldNames.has(key) || !isSameFormValue(startedModel, props.model)) {
      if (validationRuns.get(key) === runId && fieldStates[key]) fieldStates[key].validating = false
      return staleValidation
    }

    if (fieldStates[key]) {
      fieldStates[key].errors = errors
      fieldStates[key].validating = false
    }

    const allErrors = [...(externalErrors.get(key) ?? []), ...errors]
    emit('validate', name, allErrors.length === 0, allErrors)

    return allErrors.length > 0 ? { name, errors: allErrors } : undefined
  }

  if (isPromiseLike(result)) {
    fieldState.validating = true
    return result.then(finish)
  }

  return finish(result)
}

const fieldNames = new Map<string, FormNamePath>()
const getFieldNames = () => Array.from(fieldNames.entries()).filter(([key]) => !retiredFieldNames.has(key)).map(([, name]) => name)
  .concat(Object.keys(props.rules).filter((name) => !fieldNames.has(namePathKey(name)) && !retiredFieldNames.has(namePathKey(name))).map((name) => name as FormNamePath))

const validateFields = (names?: FormNamePath[]) => {
  const startRevision = validationRevision
  const targets = names ?? getFieldNames()
  const results = targets.map((name) => validateField(name))
  const expectedRuns = targets.map((name) => validationRuns.get(namePathKey(name)))
  const finish = (resolved: Array<FormValidationError | undefined | typeof staleValidation>) => {
    const outOfDate = disposed || startRevision !== validationRevision || resolved.includes(staleValidation) ||
      targets.some((name, index) => validationRuns.get(namePathKey(name)) !== expectedRuns[index])
    return {
      values: cloneValues(),
      errorFields: resolved.filter((error): error is FormValidationError => error !== undefined && error !== staleValidation),
      ...(outOfDate ? { outOfDate: true as const } : {})
    }
  }

  return results.some(isPromiseLike)
    ? Promise.all(results.map((result) => Promise.resolve(result))).then(finish)
    : finish(results as Array<FormValidationError | undefined | typeof staleValidation>)
}

const validate = () => validateFields()

const resetFields = (names?: FormNamePath[]) => {
  const targetNames = (names ?? getFieldNames()).map(normalizeNamePath)
  submissionRun += 1
  validationRevision += 1
  resetting = true
  pendingValidations.clear()

  targetNames.forEach((name) => {
    const key = namePathKey(name)
    validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1)
    externalErrors.delete(key)

    if (typeof name === 'string' && Object.prototype.hasOwnProperty.call(initialValues, name)) {
      setNamePathValue(props.model, name, cloneInitialValue(initialValues[name]))
    } else if (typeof name !== 'string' && getNamePathValue(initialValues, name) !== undefined) {
      setNamePathValue(props.model, name, cloneInitialValue(getNamePathValue(initialValues, name)))
    } else {
      deleteNamePathValue(props.model, name)
    }

    if (fieldStates[key]) {
      fieldStates[key].errors = []
      fieldStates[key].validating = false
    }
  })
  resetting = false
  observedModel = cloneValues()
  targetNames.forEach((name) => notifiedValues.set(namePathKey(name), cloneInitialValue(getNamePathValue(props.model, name))))
}

const clearValidate = (names?: FormNamePath[]) => {
  const targetNames = names ?? getFieldNames()
  targetNames.forEach((name) => {
    const key = namePathKey(name)
    externalErrors.delete(key)
    pendingValidations.delete(key)
    validationRevision += 1
    if (fieldStates[key]) {
      validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1)
      fieldStates[key].errors = []
      fieldStates[key].validating = false
    }
  })
}

const setFieldValue = (name: FormNamePath, value: unknown) => {
  setNamePathValue(props.model, name, value)
  observeModel()
  clearValidate([name])
}

const setFieldsValue = (values: FormModel) => {
  Object.entries(values).forEach(([name, value]) => {
    setNamePathValue(props.model, name, value)
  })
  observeModel()
  clearValidate(Object.keys(values))
}

const getFieldValue = (name: FormNamePath) => getNamePathValue(props.model, name)

const pickValues = (names: FormNamePath[]) =>
  names.reduce<FormModel>((values, name) => {
    if (typeof name === 'string') values[name] = getNamePathValue(props.model, name)
    else setNamePathValue(values, name, getNamePathValue(props.model, name))
    return values
  }, {})

const getFieldsValue = (names?: FormNamePath[] | true) => {
  if (names === true) {
    return cloneValues()
  }

  return pickValues(names ?? getFieldNames())
}

const getFieldError = (name: FormNamePath) => [...(fieldStates[namePathKey(name)]?.errors ?? []), ...(externalErrors.get(namePathKey(name)) ?? [])]

const getFieldsError = (names?: FormNamePath[]) =>
  (names ?? getFieldNames()).map((name) => ({
    name,
    errors: getFieldError(name)
  }))

const scrollToField = (name: FormNamePath, options?: ScrollIntoViewOptions) => {
  const target = Array.from(formElement.value?.querySelectorAll<HTMLElement>('[data-name]') ?? []).find(
    (element) => element.dataset.name === (typeof name === 'string' ? name : JSON.stringify(name))
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

const notifiedValues = new Map<string, unknown>()
let observedModel = cloneValues()
const fieldOptions = new Map<string, { validateTrigger?: FormFieldState['validateTrigger']; preserve?: boolean }>()
const pendingValidations = new Map<string, { name: FormNamePath; event?: 'change' | 'blur' }>()
let validationScheduled = false
const queueValidation = (name: FormNamePath, event?: 'change' | 'blur') => {
  const key = namePathKey(name)
  const existing = pendingValidations.get(key)
  if (!existing || existing.event !== undefined) pendingValidations.set(key, { name, event })
  if (validationScheduled) return
  validationScheduled = true
  void nextTick(() => {
    validationScheduled = false
    const batch = [...pendingValidations.values()]
    pendingValidations.clear()
    if (disposed) return
    for (const task of batch) {
      if (!retiredFieldNames.has(namePathKey(task.name))) void validateField(task.name, task.event)
    }
  })
}
const clearExternalError = (name: FormNamePath) => externalErrors.delete(namePathKey(name))
const invalidateField = (name: FormNamePath) => {
  validationRevision += 1
  const key = namePathKey(name)
  validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1)
  if (fieldStates[key]) {
    fieldStates[key].errors = []
    fieldStates[key].validating = false
  }
}
const shouldTrigger = (trigger: FormFieldState['validateTrigger'] | undefined, event: 'change' | 'blur') =>
  trigger !== false && (trigger === event || (Array.isArray(trigger) && trigger.includes(event)))
const observeModel = () => {
  const previous = observedModel
  observedModel = cloneValues()
  for (const name of getFieldNames()) {
    const key = namePathKey(name)
    if (!isSameFormValue(getNamePathValue(previous, name), getNamePathValue(props.model, name))) {
      invalidateField(name)
      clearExternalError(name)
    }
    const dependencies = fieldStates[key]?.dependencies ?? []
    if (!resetting && dependencies.some((path) => !isSameFormValue(getNamePathValue(previous, path), getNamePathValue(props.model, path)))) {
      invalidateField(name)
      queueValidation(name)
    }
  }
}
watch(() => props.model, observeModel, { deep: true, flush: 'sync' })
watch(() => props.rules, () => {
  for (const name of getFieldNames()) invalidateField(name)
}, { deep: true, flush: 'sync' })
watch(() => [props.validateTrigger, props.preserve], () => {
  fieldNames.forEach((_name, key) => {
    const state = fieldStates[key]
    if (!state) return
    state.validateTrigger = fieldOptions.get(key)?.validateTrigger ?? props.validateTrigger
    state.preserve = fieldOptions.get(key)?.preserve ?? props.preserve
  })
}, { deep: true })

const formContext: FormContext = {
  requiredMark: computed(() => props.requiredMark),
  colon: computed(() => props.colon),
  registerField(name, rules, validateFirst: FormValidateFirst, messageVariables: FormMessageVariables, options) {
    const key = namePathKey(name)
    const previousState = fieldStates[key]
    const effectiveTrigger = options?.validateTrigger === undefined ? props.validateTrigger : options.validateTrigger
    const effectivePreserve = options?.preserve === undefined ? props.preserve : options.preserve
    const changed = previousState && (!isSameFormValue(previousState.rules, rules) || previousState.validateFirst !== validateFirst || !isSameFormValue(previousState.messageVariables, messageVariables) || !isSameFormValue(previousState.dependencies, options?.dependencies ?? []))
    retiredFieldNames.delete(key)
    fieldNames.set(key, normalizeNamePath(name))
    if (!notifiedValues.has(key)) notifiedValues.set(key, cloneInitialValue(getNamePathValue(props.model, name)))
    fieldOptions.set(key, { validateTrigger: options?.validateTrigger, preserve: options?.preserve })
    if (changed) invalidateField(name)
    fieldStates[key] = {
      errors: fieldStates[key]?.errors ?? [],
      validating: fieldStates[key]?.validating ?? false,
      rules,
      validateFirst,
      messageVariables,
      dependencies: options?.dependencies ?? [],
      validateTrigger: effectiveTrigger,
      preserve: effectivePreserve
    }
  },
  unregisterField(name) {
    const key = namePathKey(name)
    const state = fieldStates[key]
    retiredFieldNames.add(key)
    validationRevision += 1
    validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1)
    externalErrors.delete(key)
    delete fieldStates[key]
    fieldNames.delete(key)
    fieldOptions.delete(key)
    pendingValidations.delete(key)
    notifiedValues.delete(key)
    if (state?.preserve === false) deleteNamePathValue(props.model, name)
  },
  getFieldErrors(name) {
    return getFieldError(name)
  },
  isFieldValidating(name) {
    return fieldStates[namePathKey(name)]?.validating ?? false
  },
  isFieldRequired(name) {
    return getRules(name).some((rule) => rule.required)
  },
  onFieldChange(name) {
    observeModel()
    const key = namePathKey(name)
    const value = getNamePathValue(props.model, name)
    if (isSameFormValue(value, notifiedValues.get(key))) return
    notifiedValues.set(key, cloneInitialValue(value))
    if (shouldTrigger(fieldStates[key]?.validateTrigger, 'change')) queueValidation(name, 'change')
  },
  onFieldBlur(name) {
    observeModel()
    if (shouldTrigger(fieldStates[namePathKey(name)]?.validateTrigger, 'blur')) queueValidation(name, 'blur')
  }
}

provide(formContextKey, formContext)

const handleSubmit = (event: Event) => {
  emit('submit', event)
  pendingValidations.clear()
  submissionRun += 1
  const runId = submissionRun
  const submitRevision = validationRevision
  const submittedValues = cloneInitialValue(props.model)
  const validationResult = validate()

  const finishSubmission = (result: { values: FormModel; errorFields: FormValidationError[]; outOfDate?: boolean }) => {
    if (disposed || result.outOfDate || runId !== submissionRun || submitRevision !== validationRevision || !isSameFormValue(submittedValues, props.model)) {
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

const setFieldsErrors = (fields: Array<{ name: FormNamePath; errors: string[] }>) => {
  fields.forEach(({ name, errors }) => {
    const key = namePathKey(name)
    fieldNames.set(key, normalizeNamePath(name))
    ensureFieldState(name)
    retiredFieldNames.delete(key)
    pendingValidations.delete(key)
    notifiedValues.set(key, cloneInitialValue(getNamePathValue(props.model, name)))
    validationRevision += 1
    validationRuns.set(key, (validationRuns.get(key) ?? 0) + 1)
    if (errors.length === 0) externalErrors.delete(key)
    else externalErrors.set(key, [...errors])
    if (fieldStates[key]) {
      fieldStates[key].errors = []
      fieldStates[key].validating = false
    }
  })
}

onBeforeUnmount(() => {
  disposed = true
  pendingValidations.clear()
  submissionRun += 1
  validationRevision += 1
})

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
  scrollToField,
  setFieldsErrors
})
</script>
