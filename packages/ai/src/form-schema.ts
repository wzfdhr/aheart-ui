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

export interface AIFormGroupV1 {
  key: string
  title: string
  description?: string
}

export interface AIFormFieldV1 {
  key: string
  label: string
  type: AIFormFieldType
  defaultValue?: unknown
  placeholder?: string
  description?: string
  group?: string
  required?: boolean
  options?: AIFormOption[]
  visibleWhen?: AIFormCondition
  disabledWhen?: AIFormCondition
}

export interface AIFormSchemaV1 {
  version: '1'
  title?: string
  description?: string
  groups?: AIFormGroupV1[]
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
const ROOT_KEYS = new Set(['version', 'title', 'description', 'groups', 'fields'])
const GROUP_KEYS = new Set(['key', 'title', 'description'])
const FIELD_KEYS = new Set([
  'key',
  'label',
  'type',
  'defaultValue',
  'placeholder',
  'description',
  'group',
  'required',
  'options',
  'visibleWhen',
  'disabledWhen'
])
const OPTION_KEYS = new Set(['label', 'value', 'disabled'])
const CONDITION_KEYS = new Set(['field', 'operator', 'value'])
const OPTION_FIELD_TYPES = new Set<AIFormFieldType>(['select', 'checkbox', 'radio', 'tree-select'])

const rejectUnknownKeys = (value: Record<string, unknown>, allowed: Set<string>, path: string, errors: string[]) => {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key))
  if (unknown.length) errors.push(`${path} 包含不支持的属性：${unknown.join('、')}`)
}

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

  rejectUnknownKeys(value, CONDITION_KEYS, path, errors)

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

  rejectUnknownKeys(schema, ROOT_KEYS, 'schema', errors)
  if (schema.title !== undefined && typeof schema.title !== 'string') errors.push('schema.title 必须是字符串')
  if (schema.description !== undefined && typeof schema.description !== 'string') errors.push('schema.description 必须是字符串')

  const groupKeys = new Set<string>()
  if (schema.groups !== undefined) {
    if (!Array.isArray(schema.groups)) {
      errors.push('schema.groups 必须是数组')
    } else {
      schema.groups.forEach((group, index) => {
        const path = `groups[${index}]`
        if (!isRecord(group)) {
          errors.push(`${path} 必须是对象`)
          return
        }
        rejectUnknownKeys(group, GROUP_KEYS, path, errors)
        if (typeof group.key !== 'string' || !group.key.trim()) {
          errors.push(`${path}.key 必须是非空字符串`)
        } else if (groupKeys.has(group.key)) {
          errors.push(`${path}.key 不能重复`)
        } else {
          groupKeys.add(group.key)
        }
        if (typeof group.title !== 'string' || !group.title.trim()) errors.push(`${path}.title 必须是非空字符串`)
        if (group.description !== undefined && typeof group.description !== 'string') errors.push(`${path}.description 必须是字符串`)
      })
    }
  }

  const keys = new Set<string>()
  schema.fields.forEach((field, index) => {
    const path = `fields[${index}]`
    if (!isRecord(field) || typeof field.key !== 'string' || !field.key.trim()) {
      errors.push(`${path}.key 必须是非空字符串`)
      return
    }
    rejectUnknownKeys(field, FIELD_KEYS, path, errors)
    if (keys.has(field.key)) errors.push(`${path}.key 不能重复`)
    keys.add(field.key)
    if (typeof field.label !== 'string') errors.push(`${path}.label 必须是字符串`)
    if (typeof field.type !== 'string' || !AI_FORM_FIELD_TYPES.includes(field.type as AIFormFieldType)) {
      errors.push(`${path}.type 不受支持`)
    }
    if (field.required !== undefined && typeof field.required !== 'boolean') errors.push(`${path}.required 必须是布尔值`)
    if (field.placeholder !== undefined && typeof field.placeholder !== 'string') errors.push(`${path}.placeholder 必须是字符串`)
    if (field.description !== undefined && typeof field.description !== 'string') errors.push(`${path}.description 必须是字符串`)
    if (field.group !== undefined && (typeof field.group !== 'string' || !groupKeys.has(field.group))) {
      errors.push(`${path}.group 必须引用已声明的分组`)
    }
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
          } else {
            rejectUnknownKeys(option, OPTION_KEYS, `${path}.options[${optionIndex}]`, errors)
          }
        })
      }
    }
    if (
      field.required === true &&
      OPTION_FIELD_TYPES.has(field.type as AIFormFieldType) &&
      (!Array.isArray(field.options) || !field.options.some((option) => isRecord(option) && option.disabled !== true))
    ) {
      errors.push(`${path}.options 必须为必填字段提供至少一个可用选项`)
    }
  })

  schema.fields.forEach((field, index) => {
    if (!isRecord(field)) return
    for (const conditionName of ['visibleWhen', 'disabledWhen'] as const) {
      const condition = field[conditionName]
      if (isRecord(condition) && typeof condition.field === 'string' && !keys.has(condition.field)) {
        errors.push(`fields[${index}].${conditionName}.field 必须引用已声明的字段`)
      }
    }
  })

  return errors.length ? { valid: false, errors } : { valid: true, errors: [], schema: schema as unknown as AIFormSchemaV1 }
}
