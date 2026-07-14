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

  it('accepts declared field groups and rejects dangling group references', () => {
    const valid = validateAIFormSchema({
      version: '1',
      title: '发布配置',
      groups: [
        { key: 'basic', title: '基础信息', description: '定义任务目标' },
        { key: 'delivery', title: '交付设置' }
      ],
      fields: [
        { key: 'title', label: '任务名称', type: 'input', group: 'basic' },
        { key: 'channel', label: '发布渠道', type: 'select', group: 'delivery', options: [{ label: '站内', value: 'internal' }] }
      ]
    })
    const invalid = validateAIFormSchema({
      version: '1',
      groups: [{ key: 'basic', title: '基础信息' }],
      fields: [{ key: 'title', label: '任务名称', type: 'input', group: 'missing' }]
    })

    expect(valid).toMatchObject({ valid: true, errors: [] })
    expect(invalid.valid).toBe(false)
    expect(invalid.errors.join('\n')).toContain('group')
  })

  it('rejects executable or presentation escape hatches outside the V1 whitelist', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [
        {
          key: 'title',
          label: '标题',
          type: 'input',
          onChange: 'window.alert(1)',
          style: 'position: fixed'
        }
      ]
    })

    expect(result.valid).toBe(false)
    expect(result.errors.join('\n')).toContain('不支持的属性')
  })

  it('rejects conditions that reference fields outside the schema', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [
        { key: 'details', label: '详情', type: 'textarea', visibleWhen: { field: 'missing', operator: 'equals', value: true } }
      ]
    })

    expect(result.valid).toBe(false)
    expect(result.errors.join('\n')).toContain('必须引用已声明的字段')
  })

  it('rejects required option fields without an enabled choice', () => {
    const result = validateAIFormSchema({
      version: '1',
      fields: [
        { key: 'channel', label: '渠道', type: 'select', required: true },
        { key: 'mode', label: '模式', type: 'radio', required: true, options: [{ label: '禁用项', value: 'disabled', disabled: true }] }
      ]
    })

    expect(result.valid).toBe(false)
    expect(result.errors.filter((error) => error.includes('至少一个可用选项'))).toHaveLength(2)
  })
})
