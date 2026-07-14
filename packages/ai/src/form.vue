<template>
  <form
    v-if="validation.valid && validation.schema"
    ref="formElement"
    class="aheart-ai-form"
    :aria-busy="submitting ? 'true' : 'false'"
    @submit.prevent="submit"
  >
    <header v-if="validation.schema.title || validation.schema.description" class="aheart-ai-form__header">
      <h2 v-if="validation.schema.title">{{ validation.schema.title }}</h2>
      <p v-if="validation.schema.description">{{ validation.schema.description }}</p>
    </header>

    <div v-if="errorList.length" class="aheart-ai-form__error-summary" role="alert" tabindex="-1">
      <strong>请完成 {{ errorList.length }} 个必填项</strong>
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
      <AIFormField
        v-for="field in section.fields"
        :key="fieldKey(field)"
        :ref="(instance) => setFieldRef(field.key, instance)"
        :field="field"
        :value="fieldValue(field)"
        :disabled="isDisabled(field)"
        :error="errors[field.key]"
        @update="update(field.key, $event)"
      />
    </component>

    <p v-if="submitError" class="aheart-ai-form__submit-error" role="alert">{{ submitError }}</p>
    <footer class="aheart-ai-form__footer">
      <AButton html-type="submit" type="primary" :loading="submitting" :disabled="disabled">
        {{ submitText }}
      </AButton>
    </footer>
  </form>
  <div v-else class="aheart-ai-form__error" role="alert">
    <strong>表单配置无效</strong>
    <ul>
      <li v-for="error in validation.errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, watch } from 'vue'
import { Button as AButton } from 'aheart-ui'
import AIFormField from './form-field.vue'
import {
  type AIFormCondition,
  type AIFormFieldV1,
  type AIFormGroupV1,
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
  }>(),
  {
    modelValue: () => ({}),
    disabled: false,
    submitting: false,
    submitText: '提交',
    submitError: undefined
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

const validation = computed(() => validateAIFormSchema(props.schema))
const values = computed(() => props.modelValue)
const resolvedValues = computed(() =>
  (validation.value.schema?.fields ?? []).reduce<Record<string, unknown>>(
    (result, field) => {
      result[field.key] = Object.prototype.hasOwnProperty.call(values.value, field.key)
        ? values.value[field.key]
        : field.defaultValue
      return result
    },
    { ...values.value }
  )
)
const errors = reactive<Record<string, string>>({})
const fieldRevisions = reactive<Record<string, number>>({})
const fieldRefs = new Map<string, FieldRef>()

watch(
  validation,
  (result) => {
    if (!result.valid) emit('schema-error', result.errors)
  },
  { immediate: true }
)

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
    (Array.isArray(value) && value.length === 0)
  )
}
const fieldValue = (field: AIFormFieldV1) => {
  const value = resolvedValues.value[field.key]
  if (value !== undefined) return value
  return field.type === 'checkbox' || field.type === 'upload' ? [] : ''
}
const fieldKey = (field: AIFormFieldV1) => `${field.key}-${fieldRevisions[field.key] ?? 0}`
const setFieldRef = (key: string, instance: unknown) => {
  if (instance && typeof (instance as FieldRef).focus === 'function') fieldRefs.set(key, instance as FieldRef)
  else fieldRefs.delete(key)
}
const focusField = (key: string) => fieldRefs.get(key)?.focus()
const update = async (key: string, value: unknown) => {
  delete errors[key]
  emit('update:modelValue', { ...values.value, [key]: value })
  await nextTick()
  if (values.value[key] !== value) fieldRevisions[key] = (fieldRevisions[key] ?? 0) + 1
}
const submit = async () => {
  if (props.disabled || props.submitting) return
  Object.keys(errors).forEach((key) => delete errors[key])
  const validationErrors = visibleFields.value
    .filter((field) => field.required && !isDisabled(field) && isEmptyValue(resolvedValues.value[field.key]))
    .map((field) => ({ key: field.key, message: `${field.label}为必填项` }))
  validationErrors.forEach((error) => {
    errors[error.key] = error.message
  })
  if (validationErrors.length) {
    emit('validation-error', validationErrors)
    await nextTick()
    focusField(validationErrors[0].key)
    return
  }
  emit('submit', { ...resolvedValues.value })
}
</script>
