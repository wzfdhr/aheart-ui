<template>
  <form v-if="validation.valid && validation.schema" class="aheart-ai-form" @submit.prevent="submit">
    <div v-for="field in visibleFields" :key="field.key" class="aheart-ai-form__field">
      <label :for="field.key">{{ field.label }}</label>
      <ATextarea
        v-if="field.type === 'textarea'"
        :key="fieldKey(field)"
        :id="field.key"
        :model-value="fieldValue(field) as string"
        :placeholder="field.placeholder"
        :disabled="isDisabled(field)"
        @update:model-value="update(field.key, $event)"
      />
      <ATreeSelect
        v-else-if="field.type === 'tree-select'"
        :key="fieldKey(field)"
        :id="field.key"
        :model-value="fieldValue(field) as string | number | Array<string | number>"
        :tree-data="treeData(field)"
        :multiple="Array.isArray(fieldValue(field))"
        :disabled="isDisabled(field)"
        @update:model-value="update(field.key, $event)"
      />
      <AUpload
        v-else-if="field.type === 'upload'"
        :key="fieldKey(field)"
        :file-list="fieldValue(field) as UploadFile[]"
        :disabled="isDisabled(field)"
        @update:file-list="update(field.key, $event)"
      />
      <ARadioGroup v-else-if="field.type === 'radio'" :key="fieldKey(field)" :model-value="fieldValue(field) as string | number" :options="field.options" :disabled="isDisabled(field)" @update:model-value="update(field.key, $event)" />
      <ACheckboxGroup v-else-if="field.type === 'checkbox'" :key="fieldKey(field)" :model-value="fieldValue(field) as Array<string | number>" :options="field.options" :disabled="isDisabled(field)" @update:model-value="update(field.key, $event)" />
      <ASelect
        v-else-if="field.type === 'select'"
        :key="fieldKey(field)"
        :id="field.key"
        :model-value="fieldValue(field) as string | number"
        :disabled="isDisabled(field)"
        :options="field.options"
        @update:model-value="update(field.key, $event)"
      />
      <ASwitch
        v-else-if="field.type === 'switch'"
        :key="fieldKey(field)"
        :id="field.key"
        :model-value="Boolean(fieldValue(field))"
        :disabled="isDisabled(field)"
        @update:model-value="update(field.key, $event)"
      />
      <AInputNumber v-else-if="field.type === 'number'" :key="fieldKey(field)" :id="field.key" :model-value="fieldValue(field) as number | string" :placeholder="field.placeholder" :disabled="isDisabled(field)" @update:model-value="update(field.key, $event)" />
      <ADatePicker v-else-if="field.type === 'date'" :key="fieldKey(field)" :model-value="fieldValue(field) as string" :placeholder="field.placeholder" :disabled="isDisabled(field)" @update:model-value="update(field.key, $event)" />
      <ATimePicker v-else-if="field.type === 'time'" :key="fieldKey(field)" :model-value="fieldValue(field) as string" :placeholder="field.placeholder" :disabled="isDisabled(field)" @update:model-value="update(field.key, $event)" />
      <AInput
        v-else-if="field.type === 'input'"
        :key="fieldKey(field)"
        :id="field.key"
        :model-value="fieldValue(field) as string"
        :placeholder="field.placeholder"
        :disabled="isDisabled(field)"
        @update:model-value="update(field.key, $event)"
      />
      <p v-if="errors[field.key]" class="aheart-ai-form__field-error">{{ errors[field.key] }}</p>
    </div>
    <AButton html-type="submit" type="primary">提交</AButton>
  </form>
  <div v-else class="aheart-ai-form__error" role="alert">表单配置无效</div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, watch } from 'vue'
import { Button as AButton, CheckboxGroup as ACheckboxGroup, DatePicker as ADatePicker, Input as AInput, InputNumber as AInputNumber, RadioGroup as ARadioGroup, Select as ASelect, Switch as ASwitch, Textarea as ATextarea, TimePicker as ATimePicker, TreeSelect as ATreeSelect, Upload as AUpload, type TreeNodeData, type UploadFile } from 'aheart-ui'
import { type AIFormCondition, type AIFormFieldV1, validateAIFormSchema } from './form-schema'

defineOptions({ name: 'AAIForm' })
const props = withDefaults(defineProps<{ modelValue?: Record<string, unknown>; schema: unknown }>(), { modelValue: () => ({}) })
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>]; submit: [value: Record<string, unknown>]; 'schema-error': [errors: string[]]; 'validation-error': [errors: Array<{ key: string; message: string }>] }>()
const validation = computed(() => validateAIFormSchema(props.schema))
const values = computed(() => props.modelValue)
const resolvedValues = computed(() => (validation.value.schema?.fields ?? []).reduce<Record<string, unknown>>((result, field) => {
  result[field.key] = Object.prototype.hasOwnProperty.call(values.value, field.key) ? values.value[field.key] : field.defaultValue
  return result
}, { ...values.value }))
const errors = reactive<Record<string, string>>({})
const fieldRevisions = reactive<Record<string, number>>({})

watch(validation, (result) => {
  if (!result.valid) emit('schema-error', result.errors)
}, { immediate: true })

const matches = (condition?: AIFormCondition) => {
  if (!condition) return true
  const value = resolvedValues.value[condition.field]
  if (condition.operator === 'equals') return value === condition.value
  if (condition.operator === 'not-equals') return value !== condition.value
  if (condition.operator === 'includes') return Array.isArray(value) ? value.includes(condition.value) : String(value ?? '').includes(String(condition.value ?? ''))
  if (condition.operator === 'not-includes') return Array.isArray(value) ? !value.includes(condition.value) : !String(value ?? '').includes(String(condition.value ?? ''))
  if (condition.operator === 'is-empty') return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
  return !(value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))
}
const visibleFields = computed(() => validation.value.schema?.fields.filter((field) => matches(field.visibleWhen)) ?? [])
const isDisabled = (field: AIFormFieldV1) => Boolean(field.disabledWhen && matches(field.disabledWhen))

watch([resolvedValues, visibleFields], () => {
  const fields = validation.value.schema?.fields ?? []
  Object.keys(errors).forEach((key) => {
    const field = fields.find((candidate) => candidate.key === key)
    if (!field || !matches(field.visibleWhen) || isDisabled(field)) delete errors[key]
  })
})

const fieldValue = (field: AIFormFieldV1) => {
  const value = resolvedValues.value[field.key]
  if (value !== undefined) return value
  return field.type === 'checkbox' || field.type === 'upload' ? [] : ''
}
const fieldKey = (field: AIFormFieldV1) => `${field.key}-${fieldRevisions[field.key] ?? 0}`
const update = async (key: string, value: unknown) => {
  delete errors[key]
  emit('update:modelValue', { ...values.value, [key]: value })
  await nextTick()
  if (values.value[key] !== value) fieldRevisions[key] = (fieldRevisions[key] ?? 0) + 1
}
const isEmptyValue = (value: unknown) => value === undefined || value === null || value === '' || value === false || (Array.isArray(value) && value.length === 0)
const treeData = (field: AIFormFieldV1): TreeNodeData[] => (field.options ?? []).map((option) => ({ key: option.value, title: option.label, disabled: option.disabled }))
const submit = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  const validationErrors = visibleFields.value
    .filter((field) => field.required && !isDisabled(field) && isEmptyValue(resolvedValues.value[field.key]))
    .map((field) => ({ key: field.key, message: `${field.label}为必填项` }))
  validationErrors.forEach((error) => {
    errors[error.key] = error.message
  })
  if (validationErrors.length) {
    emit('validation-error', validationErrors)
    return
  }
  emit('submit', { ...resolvedValues.value })
}
</script>
