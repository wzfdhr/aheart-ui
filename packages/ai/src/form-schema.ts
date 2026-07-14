export const AI_FORM_FIELD_TYPES = [
  'input',
  'textarea',
  'number',
  'select',
  'checkbox',
  'radio',
  'switch',
  'date',
  'time',
  'upload',
  'tree-select'
] as const

export const AI_FORM_CONDITION_OPERATORS = ['equals', 'not-equals', 'includes', 'not-includes', 'is-empty', 'is-not-empty'] as const

export type AIFormFieldType = (typeof AI_FORM_FIELD_TYPES)[number]
export type AIFormConditionOperator = (typeof AI_FORM_CONDITION_OPERATORS)[number]

export interface AIFormCondition {
  field: string
  operator: AIFormConditionOperator
  value?: string | number | boolean | string[]
}

export interface AIFormOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface AIFormFieldV1 {
  key: string
  label: string
  type: AIFormFieldType
  defaultValue?: unknown
  placeholder?: string
  required?: boolean
  options?: AIFormOption[]
  visibleWhen?: AIFormCondition
  disabledWhen?: AIFormCondition
}

export interface AIFormSchemaV1 {
  version: '1'
  fields: AIFormFieldV1[]
}

export interface AIFormSchemaValidation {
  valid: boolean
  errors: string[]
  schema?: AIFormSchemaV1
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isOptionValue = (value: unknown): value is AIFormOption['value'] =>
  typeof value === 'string' || typeof value === 'number'
const isOptionValueArray = (value: unknown) => Array.isArray(value) && value.every(isOptionValue)
const isUploadFileDefault = (value: unknown) => isRecord(value) && typeof value.uid === 'string' && typeof value.name === 'string'

const hasCompatibleDefaultValue = (type: AIFormFieldType, value: unknown) => {
  if (value === undefined) return true
  if (type === 'switch') return typeof value === 'boolean'
  if (type === 'number') return typeof value === 'number'
  if (type === 'checkbox') return isOptionValueArray(value)
  if (type === 'upload') return Array.isArray(value) && value.every(isUploadFileDefault)
  if (type === 'tree-select') return isOptionValue(value) || isOptionValueArray(value)
  if (type === 'select' || type === 'radio') return isOptionValue(value)
  return typeof value === 'string'
}

const validateCondition = (value: unknown, path: string, errors: string[]): value is AIFormCondition => {
  if (!isRecord(value) || typeof value.field !== 'string' || !value.field.trim()) {
    errors.push(`${path} 必须包含字段名`)
    return false
  }

  if (typeof value.operator !== 'string' || !AI_FORM_CONDITION_OPERATORS.includes(value.operator as AIFormConditionOperator)) {
    errors.push(`${path} 包含不支持的条件操作符`)
    return false
  }

  if (value.value !== undefined && !isOptionValue(value.value) && typeof value.value !== 'boolean' && !Array.isArray(value.value)) {
    errors.push(`${path}.value 类型不安全`)
    return false
  }

  if (Array.isArray(value.value) && !value.value.every((item) => typeof item === 'string')) {
    errors.push(`${path}.value 数组只能包含字符串`)
    return false
  }

  return true
}

export const validateAIFormSchema = (schema: unknown): AIFormSchemaValidation => {
  const errors: string[] = []
  if (!isRecord(schema) || schema.version !== '1' || !Array.isArray(schema.fields)) {
    return { valid: false, errors: ['AIForm schema 必须是 version 为 1 的 fields 数组'] }
  }

  const keys = new Set<string>()
  schema.fields.forEach((field, index) => {
    const path = `fields[${index}]`
    if (!isRecord(field) || typeof field.key !== 'string' || !field.key.trim()) {
      errors.push(`${path}.key 必须是非空字符串`)
      return
    }
    if (keys.has(field.key)) errors.push(`${path}.key 不能重复`)
    keys.add(field.key)
    if (typeof field.label !== 'string') errors.push(`${path}.label 必须是字符串`)
    if (typeof field.type !== 'string' || !AI_FORM_FIELD_TYPES.includes(field.type as AIFormFieldType)) {
      errors.push(`${path}.type 不受支持`)
    }
    if (field.required !== undefined && typeof field.required !== 'boolean') errors.push(`${path}.required 必须是布尔值`)
    if (field.placeholder !== undefined && typeof field.placeholder !== 'string') errors.push(`${path}.placeholder 必须是字符串`)
    if (!hasCompatibleDefaultValue(field.type as AIFormFieldType, field.defaultValue)) errors.push(`${path}.defaultValue 与字段类型不兼容`)
    if (field.visibleWhen !== undefined) validateCondition(field.visibleWhen, `${path}.visibleWhen`, errors)
    if (field.disabledWhen !== undefined) validateCondition(field.disabledWhen, `${path}.disabledWhen`, errors)
    if (field.options !== undefined) {
      if (!Array.isArray(field.options)) {
        errors.push(`${path}.options 必须是数组`)
      } else {
        field.options.forEach((option, optionIndex) => {
          if (!isRecord(option) || typeof option.label !== 'string' || !isOptionValue(option.value) || (option.disabled !== undefined && typeof option.disabled !== 'boolean')) {
            errors.push(`${path}.options[${optionIndex}] 不合法`)
          }
        })
      }
    }
  })

  return errors.length ? { valid: false, errors } : { valid: true, errors: [], schema: schema as unknown as AIFormSchemaV1 }
}
