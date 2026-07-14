import { describe, expect, it } from 'vitest'
import { validateAIFormSchema } from '../form-schema'

describe('AIForm schema validation', () => {
  it('accepts the V1 field and condition whitelist', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [
        { key: 'name', label: '名称', type: 'input', required: true },
        { key: 'showDetails', label: '显示详情', type: 'switch' },
        { key: 'detail', label: '详情', type: 'textarea', visibleWhen: { field: 'showDetails', operator: 'equals', value: true } }
      ]
    })

    expect(result).toMatchObject({ valid: true, errors: [] })
  })

  it('rejects unsafe field shapes and unapproved conditions without throwing', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [
        { key: 'unsafe', label: '<script>alert(1)</script>', type: 'script', onChange: 'alert(1)' },
        { key: 'visible', label: '可见性', type: 'input', visibleWhen: { field: 'unsafe', operator: 'eval', value: 'window.alert(1)' } }
      ]
    })

    expect(result.valid).toBe(false)
    expect(result.errors).not.toHaveLength(0)
  })

  it('rejects defaults that are incompatible with their field components', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [
        { key: 'tags', label: '标签', type: 'checkbox', defaultValue: { invalid: true }, options: [{ label: 'A', value: 'a' }] },
        { key: 'enabled', label: '启用', type: 'switch', defaultValue: 'true' }
      ]
    })

    expect(result.valid).toBe(false)
    expect(result.errors.join('\n')).toContain('defaultValue')
  })

  it('rejects numeric defaults for text input fields', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [{ key: 'title', label: '标题', type: 'input', defaultValue: 1 }]
    })

    expect(result.valid).toBe(false)
  })
})
