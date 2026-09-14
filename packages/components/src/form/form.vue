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
import {
  deleteNamePathValue,
  getNamePathValue,
  matchListDescendant,
  namePathKey,
  namePathLabel,
  namePathSegments,
  normalizeNamePath,
  remapListDescendant,
  setNamePathValue
} from './name-path'
import {
  formInternalContextKey,
  type FormInternalContext,
  type FormListController
} from './internal-context'

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
const fieldOwners = new Map<string, string>()
const recentlyRemappedOwners = new Set<string>()
const listControllers = new Map<string, FormListController>()
let submissionRun = 0
let validationRevision = 0
let listMutationDepth = 0
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
  flushPendingListReconciliation()
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
  flushPendingListReconciliation()
  const targetNames = (names ?? getFieldNames()).map(normalizeNamePath)
  submissionRun += 1
  validationRevision += 1
  resetting = true
  listMutationDepth += 1
  pendingValidations.clear()
  try {
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

    const targetKeys = new Set(targetNames.map(namePathKey))
    const controllers = Array.from(new Set(listControllers.values()))
      .filter(controller => targetKeys.has(namePathKey(controller.name)))
      .sort((left, right) => namePathSegments(left.name).length - namePathSegments(right.name).length)
    for (const controller of controllers) {
      if (listControllers.get(namePathKey(controller.name)) !== controller) continue
      const value = getNamePathValue(props.model, controller.name)
      controller.reset(Array.isArray(value) ? value : [])
      remapOwnedListState(controller.name, new Map(), controller.owner)
    }
  } finally {
    listMutationDepth -= 1
    resetting = false
  }
  observedModel = cloneValues()
  targetNames.forEach((name) => {
    const key = namePathKey(name)
    if (fieldNames.has(key)) notifiedValues.set(key, cloneInitialValue(getNamePathValue(props.model, name)))
  })
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

const isOwnedBy = (owner: string | undefined, prefix: string) =>
  owner === prefix || owner?.startsWith(`${prefix}/`) === true

const warnFormList = (message: string) => {
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn(`[AFormList] ${message}`)
}

const remapOwnedListState = (
  listName: FormNamePath,
  oldIndexToNewIndex: ReadonlyMap<number, number>,
  ownerPrefix: string
) => {
  const skippedValueInvalidation = new Set<string>()
  const fieldSnapshots = Array.from(fieldNames.entries()).flatMap(([oldKey, name]) => {
    const owner = fieldOwners.get(oldKey)
    const match = owner && isOwnedBy(owner, ownerPrefix) ? matchListDescendant(name, listName) : undefined
    if (!match) return []
    const nextName = remapListDescendant(name, listName, oldIndexToNewIndex)
    return [{
      oldKey,
      oldIndex: match.index,
      nextName,
      state: fieldStates[oldKey],
      options: fieldOptions.get(oldKey),
      run: validationRuns.get(oldKey) ?? 0,
      external: externalErrors.get(oldKey),
      notified: notifiedValues.get(oldKey),
      hasNotified: notifiedValues.has(oldKey),
      owner
    }]
  })

  const nestedControllers = Array.from(new Set(listControllers.values())).flatMap((controller) => {
    const match = isOwnedBy(controller.owner, ownerPrefix) ? matchListDescendant(controller.name, listName) : undefined
    if (!match) return []
    return [{ controller, oldKey: namePathKey(controller.name), nextName: remapListDescendant(controller.name, listName, oldIndexToNewIndex) }]
  })

  for (const snapshot of fieldSnapshots) {
    delete fieldStates[snapshot.oldKey]
    fieldNames.delete(snapshot.oldKey)
    fieldOptions.delete(snapshot.oldKey)
    pendingValidations.delete(snapshot.oldKey)
    notifiedValues.delete(snapshot.oldKey)
    externalErrors.delete(snapshot.oldKey)
    fieldOwners.delete(snapshot.oldKey)
    validationRuns.set(snapshot.oldKey, snapshot.run + 1)
    retiredFieldNames.delete(snapshot.oldKey)
  }

  for (const { controller, oldKey } of nestedControllers) {
    if (listControllers.get(oldKey) === controller) listControllers.delete(oldKey)
  }

  for (const snapshot of fieldSnapshots) {
    if (!snapshot.nextName || !snapshot.state) continue
    const nextKey = namePathKey(snapshot.nextName)
    const nextIndex = matchListDescendant(snapshot.nextName, listName)?.index
    if (fieldNames.has(nextKey) && !fieldSnapshots.some(candidate => candidate.oldKey === nextKey)) {
      warnFormList(`cannot remap field state to occupied path ${namePathLabel(snapshot.nextName)}`)
      continue
    }
    snapshot.state.validating = false
    snapshot.state.dependencies = snapshot.state.dependencies.map((dependency) =>
      remapListDescendant(dependency, listName, oldIndexToNewIndex) ?? dependency
    )
    fieldStates[nextKey] = snapshot.state
    fieldNames.set(nextKey, snapshot.nextName)
    if (snapshot.options) fieldOptions.set(nextKey, snapshot.options)
    validationRuns.set(nextKey, snapshot.run + 1)
    if (snapshot.external) externalErrors.set(nextKey, snapshot.external)
    notifiedValues.set(nextKey, snapshot.hasNotified
      ? cloneInitialValue(snapshot.notified)
      : cloneInitialValue(getNamePathValue(props.model, snapshot.nextName)))
    if (snapshot.owner) fieldOwners.set(nextKey, snapshot.owner)
    retiredFieldNames.delete(nextKey)
    if (nextIndex !== snapshot.oldIndex) {
      skippedValueInvalidation.add(nextKey)
      if (snapshot.owner) {
        const remappedOwner = snapshot.owner
        recentlyRemappedOwners.add(remappedOwner)
        void nextTick(() => recentlyRemappedOwners.delete(remappedOwner))
      }
    }
  }

  for (const { controller, nextName } of nestedControllers) {
    if (!nextName) continue
    const nextKey = namePathKey(nextName)
    const occupied = listControllers.get(nextKey)
    if (occupied && occupied !== controller) {
      warnFormList(`cannot remap nested list to occupied path ${namePathLabel(nextName)}`)
      continue
    }
    controller.name = nextName
    listControllers.set(nextKey, controller)
  }

  validationRevision += 1
  submissionRun += 1
  return skippedValueInvalidation
}

const reconcileExternalLists = () => {
  const skippedValueInvalidation = new Set<string>()
  const controllers = Array.from(new Set(listControllers.values()))
    .sort((left, right) => namePathSegments(left.name).length - namePathSegments(right.name).length)
  for (const controller of controllers) {
    if (listControllers.get(namePathKey(controller.name)) !== controller) continue
    const value = getNamePathValue(props.model, controller.name)
    const items = Array.isArray(value) ? value : []
    const result = controller.reconcile(items)
    if (!result) continue
    for (const key of remapOwnedListState(controller.name, result.oldIndexToNewIndex, controller.owner)) {
      skippedValueInvalidation.add(key)
    }
  }
  return skippedValueInvalidation
}

const processModelChanges = (previous: FormModel, skippedValueInvalidation = new Set<string>()) => {
  for (const name of getFieldNames()) {
    const key = namePathKey(name)
    if (!skippedValueInvalidation.has(key) && !isSameFormValue(getNamePathValue(previous, name), getNamePathValue(props.model, name))) {
      invalidateField(name)
      clearExternalError(name)
    }
    const dependencies = fieldStates[key]?.dependencies ?? []
    if (!resetting && !skippedValueInvalidation.has(key) && dependencies.some((path) => !isSameFormValue(getNamePathValue(previous, path), getNamePathValue(props.model, path)))) {
      invalidateField(name)
      queueValidation(name)
    }
  }
}

let externalListReconcileScheduled = false
let externalListPreviousModel: FormModel | undefined
const needsExternalListReconcile = () => Array.from(new Set(listControllers.values())).some(controller => {
  const value = getNamePathValue(props.model, controller.name)
  return controller.needsReconcile(Array.isArray(value) ? value : [])
})

const flushPendingListReconciliation = () => {
  if (!externalListReconcileScheduled) return
  externalListReconcileScheduled = false
  const previous = externalListPreviousModel ?? observedModel
  externalListPreviousModel = undefined
  if (disposed) return
  const skippedValueInvalidation = reconcileExternalLists()
  observedModel = cloneValues()
  processModelChanges(previous, skippedValueInvalidation)
}

const scheduleExternalListReconciliation = () => {
  if (externalListReconcileScheduled) return
  externalListReconcileScheduled = true
  externalListPreviousModel = observedModel
  queueMicrotask(flushPendingListReconciliation)
}

const observeModel = () => {
  if (listMutationDepth > 0) return
  if (externalListReconcileScheduled || needsExternalListReconcile()) {
    scheduleExternalListReconciliation()
    return
  }
  const previous = observedModel
  observedModel = cloneValues()
  processModelChanges(previous)
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

const registerField = (
  name: FormNamePath,
  rules: FormRule[],
  validateFirst: FormValidateFirst,
  messageVariables: FormMessageVariables,
  options?: { dependencies?: FormNamePath[]; validateTrigger?: FormFieldState['validateTrigger']; preserve?: boolean },
  owner?: string
) => {
    const key = namePathKey(name)
    const previousState = fieldStates[key]
    const previousOwner = fieldOwners.get(key)
    const effectiveTrigger = options?.validateTrigger === undefined ? props.validateTrigger : options.validateTrigger
    const effectivePreserve = options?.preserve === undefined ? props.preserve : options.preserve
    const changed = previousState && (!isSameFormValue(previousState.rules, rules) || previousState.validateFirst !== validateFirst || !isSameFormValue(previousState.messageVariables, messageVariables) || !isSameFormValue(previousState.dependencies, options?.dependencies ?? []))
    retiredFieldNames.delete(key)
    fieldNames.set(key, normalizeNamePath(name))
    if (!notifiedValues.has(key)) notifiedValues.set(key, cloneInitialValue(getNamePathValue(props.model, name)))
    fieldOptions.set(key, { validateTrigger: options?.validateTrigger, preserve: options?.preserve })
    if (owner === undefined) fieldOwners.delete(key)
    else fieldOwners.set(key, owner)
    const lifecycleRemap = owner !== undefined && previousOwner === owner && recentlyRemappedOwners.delete(owner)
    if (changed && !lifecycleRemap) invalidateField(name)
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
}

const unregisterField = (name: FormNamePath, owner?: string) => {
    const key = namePathKey(name)
    if (owner !== undefined && fieldOwners.get(key) !== owner) return
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
    fieldOwners.delete(key)
    if (owner) recentlyRemappedOwners.delete(owner)
    if (state?.preserve === false) deleteNamePathValue(props.model, name)
}

const resolveOwnedName = (name: FormNamePath, owner: string) => {
  const directKey = namePathKey(name)
  if (fieldOwners.get(directKey) === owner) return fieldNames.get(directKey) ?? name
  for (const [key, candidateOwner] of fieldOwners) {
    if (candidateOwner === owner) return fieldNames.get(key) ?? name
  }
  return undefined
}

const notifyFieldChange = (name: FormNamePath) => {
    flushPendingListReconciliation()
    observeModel()
    const key = namePathKey(name)
    const value = getNamePathValue(props.model, name)
    if (isSameFormValue(value, notifiedValues.get(key))) return
    notifiedValues.set(key, cloneInitialValue(value))
    if (shouldTrigger(fieldStates[key]?.validateTrigger, 'change')) queueValidation(name, 'change')
}

const notifyFieldBlur = (name: FormNamePath) => {
    flushPendingListReconciliation()
    observeModel()
    if (shouldTrigger(fieldStates[namePathKey(name)]?.validateTrigger, 'blur')) queueValidation(name, 'blur')
}

const formContext: FormContext = {
  requiredMark: computed(() => props.requiredMark),
  colon: computed(() => props.colon),
  registerField(name, rules, validateFirst, messageVariables, options) {
    registerField(name, rules, validateFirst, messageVariables, options)
  },
  unregisterField(name) {
    unregisterField(name)
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
    notifyFieldChange(name)
  },
  onFieldBlur(name) {
    notifyFieldBlur(name)
  }
}

provide(formContextKey, formContext)

const formInternalContext: FormInternalContext = {
  registerOwnedField(name, owner, rules, validateFirst, messageVariables, options) {
    registerField(name, rules, validateFirst, messageVariables, options, owner)
  },
  unregisterOwnedField(name, owner) {
    unregisterField(name, owner)
  },
  getFieldErrors: getFieldError,
  isFieldValidating(name) {
    return fieldStates[namePathKey(name)]?.validating ?? false
  },
  isFieldRequired(name) {
    return getRules(name).some(rule => rule.required)
  },
  onOwnedFieldChange(name, owner) {
    const currentName = resolveOwnedName(name, owner)
    if (currentName !== undefined) notifyFieldChange(currentName)
  },
  onOwnedFieldBlur(name, owner) {
    const currentName = resolveOwnedName(name, owner)
    if (currentName !== undefined) notifyFieldBlur(currentName)
  },
  initializeList(name, initialValue) {
    const current = getNamePathValue(props.model, name)
    if (current !== undefined || initialValue === undefined) return Array.isArray(current) ? current : undefined
    const cloned = cloneInitialValue(initialValue)
    listMutationDepth += 1
    try {
      setNamePathValue(props.model, name, cloned)
      setNamePathValue(initialValues, name, cloneInitialValue(initialValue))
      observedModel = cloneValues()
    } finally {
      listMutationDepth -= 1
    }
    return getNamePathValue(props.model, name) as readonly unknown[]
  },
  getValue(name) {
    return getNamePathValue(props.model, name)
  },
  registerList(controller) {
    const key = namePathKey(controller.name)
    const current = listControllers.get(key)
    if (current && current.owner !== controller.owner) {
      warnFormList(`duplicate live list path ${namePathLabel(controller.name)}; the first owner remains active`)
      return false
    }
    listControllers.set(key, controller)
    return true
  },
  unregisterList(name, owner) {
    const key = namePathKey(name)
    const current = listControllers.get(key)
    if (current?.owner === owner) listControllers.delete(key)
  },
  mutateList(name, owner, oldIndexToNewIndex, mutation) {
    flushPendingListReconciliation()
    const direct = listControllers.get(namePathKey(name))
    const controller = direct?.owner === owner ? direct : Array.from(new Set(listControllers.values())).find(item => item.owner === owner)
    if (!controller) return false
    const current = getNamePathValue(props.model, controller.name)
    if (current !== undefined && !Array.isArray(current)) return false
    const previous = observedModel
    const ownerDocument = formElement.value?.ownerDocument
    const activeElement = ownerDocument?.activeElement as (Element & { focus?: (options?: FocusOptions) => void }) | null | undefined
    listMutationDepth += 1
    try {
      let items = current as unknown[] | undefined
      if (!items) {
        items = []
        setNamePathValue(props.model, controller.name, items)
      }
      mutation(items)
      const skipped = remapOwnedListState(controller.name, oldIndexToNewIndex, owner)
      observedModel = cloneValues()
      processModelChanges(previous, skipped)
    } finally {
      listMutationDepth -= 1
    }
    notifyFieldChange(controller.name)
    void nextTick(() => {
      if (!ownerDocument || !activeElement?.isConnected || typeof activeElement.focus !== 'function') return
      if (ownerDocument.activeElement === ownerDocument.body || ownerDocument.activeElement === null) {
        activeElement.focus({ preventScroll: true })
      }
    })
    return true
  }
}

provide(formInternalContextKey, formInternalContext)

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
  flushPendingListReconciliation()
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
