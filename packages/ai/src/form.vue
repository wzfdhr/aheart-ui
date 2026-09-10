<template>
  <AForm
    v-if="validation.valid && validation.schema"
    ref="formElement"
    class="aheart-ai-form"
    :model="formModel"
    :disabled="disabled || submitting"
    :required-mark="false"
    :layout="'vertical'"
    :aria-busy="submitting ? 'true' : 'false'"
    @submit="handleSubmit"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <header v-if="validation.schema.title || validation.schema.description" class="aheart-ai-form__header">
      <h2 v-if="validation.schema.title">{{ validation.schema.title }}</h2>
      <p v-if="validation.schema.description">{{ validation.schema.description }}</p>
    </header>

    <div v-if="errorList.length" class="aheart-ai-form__error-summary" role="alert" tabindex="-1">
      <strong>请解决 {{ errorList.length }} 个校验问题</strong>
      <ul>
        <li v-for="error in errorList" :key="error.key">
          <button type="button" @click="focusField(error.key)">{{ error.message }}</button>
        </li>
      </ul>
    </div>

    <component
      :is="section.group ? 'fieldset' : 'section'"
      v-for="section in sections"
      :key="section.key"
      class="aheart-ai-form__group"
      :data-group-key="section.group?.key"
    >
      <legend v-if="section.group">
        <span>{{ section.group.title }}</span>
        <small v-if="section.group.description">{{ section.group.description }}</small>
      </legend>
        <AFormItem v-for="field in section.fields" :key="fieldKey(field)" :name="field.key" :rules="fieldRules(field)" :dependencies="fieldDependencies(field)" no-style>
          <AIFormField
            :ref="(instance) => setFieldRef(field.key, instance)"
            :field="field"
            :value="fieldValue(field)"
            :disabled="isDisabled(field)"
            :error="errors[field.key]"
            @update="update(field.key, $event)"
          />
        </AFormItem>
    </component>

    <p v-if="submitError" class="aheart-ai-form__submit-error" role="alert">{{ submitError }}</p>
    <footer class="aheart-ai-form__footer">
      <AButton html-type="submit" type="primary" :loading="submitting" :disabled="disabled">
        {{ submitText }}
      </AButton>
    </footer>
  </AForm>
  <div v-else class="aheart-ai-form__error" role="alert">
    <strong>表单配置无效</strong>
    <ul>
      <li v-for="error in validation.errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Button as AButton, Form as AForm, FormItem as AFormItem, type FormRule } from 'aheart-ui'
import AIFormField from './form-field.vue'
import {
  type AIFormCondition,
  type AIFormFieldV1,
  type AIFormGroupV1,
  type AIFormRuleV1,
  type AIFormAsyncValidator,
  validateAIFormSchema
} from './form-schema'

defineOptions({ name: 'AAIForm' })

const props = withDefaults(
  defineProps<{
    modelValue?: Record<string, unknown>
    schema: unknown
    disabled?: boolean
    submitting?: boolean
    submitText?: string
    submitError?: string
    validators?: Record<string, AIFormAsyncValidator>
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    submitting: false,
    submitText: '提交',
    submitError: undefined
    ,validators: () => ({})
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  submit: [value: Record<string, unknown>]
  'schema-error': [errors: string[]]
  'validation-error': [errors: Array<{ key: string; message: string }>]
}>()

type FieldRef = { focus: () => void }
type FormSection = { key: string; group?: AIFormGroupV1; fields: AIFormFieldV1[] }

const validation = computed(() => {
  const base = validateAIFormSchema(props.schema)
  if (!base.valid || !base.schema) return base
  const missing = base.schema.fields.flatMap((field) => (field.rules ?? []).filter((rule): rule is Extract<AIFormRuleV1, { kind: 'async' }> => rule.kind === 'async' && !(Object.prototype.hasOwnProperty.call(props.validators, rule.validator) && typeof props.validators[rule.validator] === 'function')).map((rule) => `fields.${field.key}.rules.${rule.validator} validator 不存在`))
  return missing.length ? { valid: false, errors: [...base.errors, ...missing] } : base
})
const values = computed(() => props.modelValue)
const resolvedValues = computed(() =>
  (validation.value.schema?.fields ?? []).reduce<Record<string, unknown>>(
    (result, field) => {
      const hasValue = Object.prototype.hasOwnProperty.call(values.value, field.key)
      if (!hasValue && removedFields.has(field.key)) return result
      result[field.key] = hasValue ? values.value[field.key] : field.defaultValue
      return result
    },
    { ...values.value }
  )
)
const errors = reactive<Record<string, string>>({})
const formModel = reactive<Record<string, unknown>>({})
const pendingUpdates = new Map<string, unknown>()
const fieldRevisions = reactive<Record<string, number>>({})
const fieldRefs = new Map<string, FieldRef>()
const formElement = ref<any>()
const asyncControllers = new Map<string, AbortController>()
const beginValidationRun = () => { for (const controller of asyncControllers.values()) controller.abort(); asyncControllers.clear() }
const initialSnapshot = ref<Record<string, unknown>>({})
const removedFields = reactive(new Set<string>())
const pendingRemovals = new Set<string>()
const pendingRemovalHadKey = new Map<string, boolean>()
const pendingRemovalSource = new Map<string, Record<string, unknown>>()
const pendingRemovalCandidate = new Map<string, Record<string, unknown>>()
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const blockSubmit = ref(false)
const resetGeneration = ref(0)
const ignoreCoreResult = ref(false)

watch(
  validation,
  (result) => {
    if (!result.valid) emit('schema-error', result.errors)
  },
  { immediate: true }
)

watch(resolvedValues, (next) => {
  if (!Object.keys(initialSnapshot.value).length) initialSnapshot.value = cloneSnapshot(next)
}, { immediate: true, deep: true })

watch(
  resolvedValues,
  (next, previous) => {
    Object.keys(formModel).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(next, key)) delete formModel[key]
    })
    Object.entries(next).forEach(([key, value]) => {
      const accepted = pendingUpdates.get(key)
      if (pendingUpdates.has(key)) {
        if (isSameValue(value, accepted)) {
          pendingUpdates.delete(key)
          delete errors[key]
        }
      } else if (previous && !isSameValue(value, previous[key])) {
        delete errors[key]
      }
      formModel[key] = cloneSnapshot(value)
    })
  },
  { immediate: true, deep: true }
)
watch(values, (next) => {
  for (const key of [...pendingRemovals]) {
    const source = pendingRemovalSource.get(key)
    const candidate = pendingRemovalCandidate.get(key)
    const rawNext = toRaw(next)
    if (rawNext === source) continue
    if (rawNext !== source && !isSameValue(rawNext, candidate)) {
      pendingRemovals.delete(key); pendingRemovalHadKey.delete(key); pendingRemovalSource.delete(key); pendingRemovalCandidate.delete(key); continue
    }
    if (Object.prototype.hasOwnProperty.call(next, key)) {
      pendingRemovals.delete(key)
      pendingRemovalHadKey.delete(key)
      pendingRemovalSource.delete(key)
      pendingRemovalCandidate.delete(key)
    } else {
      removedFields.add(key)
      pendingRemovals.delete(key)
      pendingRemovalHadKey.delete(key)
      pendingRemovalSource.delete(key)
      pendingRemovalCandidate.delete(key)
    }
  }
}, { deep: true })

const matches = (condition?: AIFormCondition) => {
  if (!condition) return true
  const value = resolvedValues.value[condition.field]
  if (condition.operator === 'equals') return value === condition.value
  if (condition.operator === 'not-equals') return value !== condition.value
  if (condition.operator === 'includes') {
    return Array.isArray(value)
      ? value.includes(condition.value)
      : String(value ?? '').includes(String(condition.value ?? ''))
  }
  if (condition.operator === 'not-includes') {
    return Array.isArray(value)
      ? !value.includes(condition.value)
      : !String(value ?? '').includes(String(condition.value ?? ''))
  }
  if (condition.operator === 'is-empty') return isEmptyValue(value)
  return !isEmptyValue(value)
}
const visibleFields = computed(
  () => validation.value.schema?.fields.filter((field) => matches(field.visibleWhen)) ?? []
)
watch(resolvedValues, (next, previous) => {
  const prior = previous ?? {}
  const candidate = { ...values.value }
  let changed = false
  for (const field of validation.value.schema?.fields ?? []) {
    const wasVisible = matchesWithValues(field.visibleWhen, prior)
    const nowVisible = matchesWithValues(field.visibleWhen, next)
    if (nowVisible && pendingRemovals.has(field.key) && !removedFields.has(field.key)) {
      pendingRemovals.delete(field.key)
      pendingRemovalHadKey.delete(field.key)
      pendingRemovalSource.delete(field.key)
      pendingRemovalCandidate.delete(field.key)
    }
    if (wasVisible && !nowVisible && field.preserve === false) {
      delete candidate[field.key]
      pendingRemovals.add(field.key)
      pendingRemovalHadKey.set(field.key, Object.prototype.hasOwnProperty.call(values.value, field.key))
      pendingRemovalSource.set(field.key, toRaw(values.value))
      pendingRemovalCandidate.set(field.key, toRaw(candidate))
      changed = true
    }
  }
  if (changed) emit('update:modelValue', candidate)
}, { deep: true })
watch(resolvedValues, (next, previous) => {
  const before = previous ?? {}
  for (const field of validation.value.schema?.fields ?? []) {
    const dependencies = fieldDependencies(field)
    const changed = !isSameValue(next[field.key], before[field.key]) || dependencies.some((key) => !isSameValue(next[key], before[key]))
    if (changed) {
      asyncControllers.get(field.key)?.abort()
      asyncControllers.delete(field.key)
    }
  }
}, { deep: true })
watch(() => props.schema, () => { for (const controller of asyncControllers.values()) controller.abort(); asyncControllers.clear() })
const matchesWithValues = (condition: AIFormCondition | undefined, source: Record<string, unknown>) => {
  if (!condition) return true
  const value = source[condition.field]
  if (condition.operator === 'equals') return value === condition.value
  if (condition.operator === 'not-equals') return value !== condition.value
  if (condition.operator === 'is-empty') return isEmptyValue(value)
  if (condition.operator === 'is-not-empty') return !isEmptyValue(value)
  if (condition.operator === 'includes') return Array.isArray(value) ? value.includes(condition.value) : String(value ?? '').includes(String(condition.value ?? ''))
  return Array.isArray(value) ? !value.includes(condition.value) : !String(value ?? '').includes(String(condition.value ?? ''))
}
const isDisabled = (field: AIFormFieldV1) =>
  props.disabled || props.submitting || Boolean(field.disabledWhen && matches(field.disabledWhen))
const sections = computed<FormSection[]>(() => {
  const schema = validation.value.schema
  if (!schema) return []
  const result: FormSection[] = (schema.groups ?? [])
    .map((group) => ({
      key: group.key,
      group,
      fields: visibleFields.value.filter((field) => field.group === group.key)
    }))
    .filter((section) => section.fields.length > 0)
  const ungrouped = visibleFields.value.filter((field) => !field.group)
  if (ungrouped.length) result.push({ key: '__ungrouped', fields: ungrouped })
  return result
})
const errorList = computed(() =>
  visibleFields.value
    .filter((field) => errors[field.key])
    .map((field) => ({ key: field.key, message: errors[field.key] }))
)

watch([resolvedValues, visibleFields], () => {
  const fields = validation.value.schema?.fields ?? []
  Object.keys(errors).forEach((key) => {
    const field = fields.find((candidate) => candidate.key === key)
    if (!field || !matches(field.visibleWhen) || isDisabled(field)) delete errors[key]
  })
})

function isEmptyValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    value === false ||
    (Array.isArray(value) && (value.length === 0 || value.every((item) => item === undefined || item === null || item === '')))
  )
}
function isSameValue(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => isSameValue(item, right[index]))
  }
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const leftRecord = left as Record<string, unknown>
    const rightRecord = right as Record<string, unknown>
    const leftKeys = Object.keys(leftRecord)
    const rightKeys = Object.keys(rightRecord)
    return leftKeys.length === rightKeys.length && leftKeys.every((key) => Object.prototype.hasOwnProperty.call(rightRecord, key) && isSameValue(leftRecord[key], rightRecord[key]))
  }
  return false
}
function cloneSnapshot<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => cloneSnapshot(item)) as T
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneSnapshot(item)])) as T
  }
  return value
}
const isMissingRequiredValue = (field: AIFormFieldV1, value: unknown) =>
  field.type === 'date-range' || field.type === 'time-range'
    ? !Array.isArray(value) || value.length !== 2 || value.some((item) => item === undefined || item === null || item === '')
    : isEmptyValue(value)
const fieldValue = (field: AIFormFieldV1) => {
  const value = resolvedValues.value[field.key]
  if (value !== undefined) return value
  if (field.type === 'checkbox' || field.type === 'upload') return []
  if (field.type === 'date-range' || field.type === 'time-range') return undefined
  return ''
}
const fieldKey = (field: AIFormFieldV1) => `${field.key}-${fieldRevisions[field.key] ?? 0}`
const setFieldRef = (key: string, instance: unknown) => {
  if (instance && typeof (instance as FieldRef).focus === 'function') fieldRefs.set(key, instance as FieldRef)
  else fieldRefs.delete(key)
}
const focusField = (key: string) => fieldRefs.get(key)?.focus()
const update = async (key: string, value: unknown) => {
  pendingUpdates.set(key, value)
  emit('update:modelValue', { ...values.value, [key]: value })
  await nextTick()
  if (values.value[key] !== value) fieldRevisions[key] = (fieldRevisions[key] ?? 0) + 1
}

const fieldRules = (field: AIFormFieldV1): FormRule[] => {
  if (isDisabled(field)) return []
  const rules: FormRule[] = []
  if (field.required && !isDisabled(field)) {
    const message = `${field.label}为必填项`
    rules.push({ required: true, message }, { message, validator: (_rule, value) => (isMissingRequiredValue(field, value) ? message : undefined) })
  }
  for (const rule of field.rules ?? []) rules.push(compileRule(field, rule))
  return rules
}
const isDateValue = (value: unknown) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}
const isTimeValue = (value: unknown) => typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value) && value.split(':').map(Number).every((item, index) => index === 0 ? item < 24 : item < 60)

const compileRule = (field: AIFormFieldV1, rule: AIFormRuleV1): FormRule => ({
  ...(rule.kind === 'format' && rule.format === 'email' ? { type: 'email' as const } : {}),
  ...(rule.kind === 'range' && rule.min !== undefined ? { min: rule.min } : {}),
  ...(rule.kind === 'range' && rule.max !== undefined ? { max: rule.max } : {}),
  message: rule.message ?? `${field.label}校验失败`,
  validator: (_rule, value) => {
    if (!field.required && isEmptyValue(value)) return undefined
    if (rule.kind === 'range') {
      const size = rule.valueType === 'number' ? (typeof value === 'number' && Number.isFinite(value) ? value : undefined) : (typeof value === 'string' || Array.isArray(value) ? value.length : undefined)
      if (size === undefined || (rule.min !== undefined && size < rule.min) || (rule.max !== undefined && size > rule.max)) return rule.message ?? `${field.label}范围不合法`
      return undefined
    }
    if (rule.kind === 'format') {
      if (typeof value !== 'string') return rule.message ?? `${field.label}格式不合法`
      const valid = rule.format === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : rule.format === 'url' ? (() => { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' } catch { return false } })() : rule.format === 'date' ? /^\d{4}-\d{2}-\d{2}$/.test(value) && isDateValue(value) : isTimeValue(value)
      return valid ? undefined : rule.message ?? `${field.label}格式不合法`
    }
    if (rule.kind === 'compare') {
      const other = resolvedValues.value[rule.field]
      const compatible = typeof value === typeof other && (typeof value === 'number' ? Number.isFinite(value) && Number.isFinite(other as number) : true)
      if (!compatible) return rule.message ?? `${field.label}与${rule.field}类型不匹配`
      if (['greater-than', 'greater-than-or-equal', 'less-than', 'less-than-or-equal'].includes(rule.operator)) {
        const kind = (item: unknown) => typeof item === 'number' && Number.isFinite(item) ? 'number' : isDateValue(item) ? 'date' : isTimeValue(item) ? 'time' : undefined
        if (!kind(value) || !kind(other) || kind(value) !== kind(other)) return rule.message ?? `${field.label}有序比较不合法`
      }
      const comparison = rule.operator === 'equals' ? value === other : rule.operator === 'not-equals' ? value !== other : rule.operator === 'greater-than' ? (value as any) > (other as any) : rule.operator === 'greater-than-or-equal' ? (value as any) >= (other as any) : rule.operator === 'less-than' ? (value as any) < (other as any) : (value as any) <= (other as any)
      return comparison ? undefined : rule.message ?? `${field.label}比较不成立`
    }
    const controller = asyncControllers.get(field.key) ?? new AbortController()
    asyncControllers.set(field.key, controller)
    const validator = Object.prototype.hasOwnProperty.call(props.validators, rule.validator) && typeof props.validators[rule.validator] === 'function' ? props.validators[rule.validator] : undefined
    if (!validator) return `${field.label}校验器不存在`
    try {
      const result = validator(value, { values: resolvedValues.value, field, signal: controller.signal })
      const normalize = (resolved: void | boolean | string) => {
        if (controller.signal.aborted) return undefined
        if (resolved === false) return rule.message ?? `${field.label}校验失败`
        if (typeof resolved === 'string') return resolved
        return undefined
      }
      return result && typeof (result as Promise<unknown>).then === 'function' ? (result as Promise<void | boolean | string>).then(normalize) : normalize(result as void | boolean | string)
    } catch (error) {
      if (controller.signal.aborted) return undefined
      return error instanceof Error ? error.message : rule.message ?? `${field.label}校验失败`
    }
  }
})

const handleSubmit = () => {
  if (props.disabled || props.submitting) return
  ignoreCoreResult.value = false
  beginValidationRun()
  formElement.value?.clearValidate?.()
  Object.keys(errors).forEach((key) => delete errors[key])
  blockSubmit.value = false
}
const fieldDependencies = (field: AIFormFieldV1) => Array.from(new Set([...(field.dependencies ?? []), ...(field.rules ?? []).filter((rule): rule is Extract<AIFormRuleV1, { kind: 'compare' }> => rule.kind === 'compare').map((rule) => rule.field)]))

const handleFinish = (result: Record<string, unknown>) => {
  if (ignoreCoreResult.value) { ignoreCoreResult.value = false; return }
  if (props.disabled || props.submitting || blockSubmit.value) return
  emit('submit', { ...result })
}

const handleFinishFailed = (info: { errorFields: Array<{ name: string | readonly (string | number)[]; errors: string[] }> }) => {
  if (ignoreCoreResult.value) { ignoreCoreResult.value = false; return }
  if (props.disabled || props.submitting) return
  const validationErrors = info.errorFields
    .map((error) => {
      const key = typeof error.name === 'string' ? error.name : String(error.name[0])
      const field = validation.value.schema?.fields.find((candidate) => candidate.key === key)
      const message = error.errors[0] || `${field?.label ?? key}为必填项`
      return { key, message }
    })
    .filter((error) => visibleFields.value.some((field) => field.key === error.key) && !isDisabled(validation.value.schema!.fields.find((field) => field.key === error.key)!))
  validationErrors.forEach((error) => { errors[error.key] = error.message })
  if (validationErrors.length) {
    emit('validation-error', validationErrors)
    void nextTick(() => focusField(validationErrors[0].key))
  }
}

const validate = () => { beginValidationRun(); return Promise.resolve(formElement.value?.validate?.() ?? { errorFields: [] }).then((result) => {
  Object.keys(errors).forEach((key) => delete errors[key])
  for (const item of result.errorFields ?? []) {
    const key = typeof item.name === 'string' ? item.name : String(item.name[0])
    if (item.errors?.[0]) errors[key] = item.errors[0]
  }
  return result
}) }
const resetFields = () => {
  for (const controller of asyncControllers.values()) controller.abort()
  asyncControllers.clear()
  removedFields.clear()
  pendingRemovals.clear()
  pendingRemovalHadKey.clear()
  pendingRemovalSource.clear()
  pendingRemovalCandidate.clear()
  resetGeneration.value += 1
  ignoreCoreResult.value = true
  Object.keys(errors).forEach((key) => delete errors[key])
  const names = (validation.value.schema?.fields ?? []).map((field) => ({ name: field.key, errors: [] as string[] }))
  formElement.value?.clearValidate?.()
  formElement.value?.setFieldsErrors?.(names)
  Object.keys(errors).forEach((key) => delete errors[key])
  emit('update:modelValue', cloneSnapshot(initialSnapshot.value))
}
const clearValidate = (names?: string[]) => {
  if (!names) Object.keys(errors).forEach((key) => delete errors[key])
  else names.forEach((name) => delete errors[name])
  formElement.value?.clearValidate?.(names)
}
const setFieldsErrors = (fields: Array<{ name: string; errors: string[] }>) => {
  fields.forEach((field) => { if (field.errors[0]) errors[field.name] = field.errors[0]; else delete errors[field.name] })
  formElement.value?.setFieldsErrors?.(fields)
}
defineExpose({ validate, resetFields, clearValidate, setFieldsErrors })
onBeforeUnmount(() => { for (const controller of asyncControllers.values()) controller.abort() })
</script>
