import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import AIForm from '../form.vue'

describe('AIForm', () => {
  it('emits controlled updates and applies field visibility conditions', async () => {
    const schema = { version: '1', fields: [{ key: 'advanced', label: '高级模式', type: 'switch' }, { key: 'detail', label: '详情', type: 'textarea', visibleWhen: { field: 'advanced', operator: 'equals', value: true } }] }
    const wrapper = mount(AIForm, { props: { schema, modelValue: { advanced: false } } })
    expect(wrapper.text()).not.toContain('详情')
    await wrapper.get('[role="switch"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual({ advanced: true })
    await wrapper.setProps({ modelValue: { advanced: true } })
    expect(wrapper.text()).toContain('详情')
  })

  it('degrades invalid schemas without rendering fields', () => {
    const wrapper = mount(AIForm, { props: { schema: { version: '1', fields: [{ key: 'bad', label: '危险', type: 'script' }] } } })
    expect(wrapper.get('[role="alert"]').text()).toContain('表单配置无效')
    expect(wrapper.emitted('schema-error')?.[0]?.[0]).not.toHaveLength(0)
  })

  it('blocks submit and reports required fields that are empty', async () => {
    const wrapper = mount(AIForm, { props: { schema: { version: '1', fields: [{ key: 'title', label: '标题', type: 'input', required: true }] }, modelValue: {} } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('标题为必填项')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.emitted('validation-error')?.[0]?.[0]).toEqual([{ key: 'title', message: '标题为必填项' }])
  })

  it('disables fields only when disabledWhen matches and validates empty arrays', async () => {
    const schema = { version: '1', fields: [{ key: 'locked', label: '锁定', type: 'switch' }, { key: 'tags', label: '标签', type: 'checkbox', required: true, options: [{ label: 'A', value: 'a' }], disabledWhen: { field: 'locked', operator: 'equals', value: true } }] }
    const wrapper = mount(AIForm, { props: { schema, modelValue: { locked: false, tags: [] } } })
    expect(wrapper.get('.aheart-checkbox input').attributes('disabled')).toBeUndefined()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('标签为必填项')
    await wrapper.setProps({ modelValue: { locked: true, tags: [] } })
    expect(wrapper.get('.aheart-checkbox input').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).not.toContain('标签为必填项')
  })

  it('uses AInput and keeps ordinary input fields controlled', async () => {
    const schema = { version: '1', fields: [{ key: 'title', label: '标题', type: 'input' }] }
    const wrapper = mount(AIForm, { props: { schema, modelValue: { title: '初始值' } } })

    const input = wrapper.get('.aheart-input__control')
    expect((input.element as HTMLInputElement).value).toBe('初始值')
    await input.setValue('本地改动')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual({ title: '本地改动' })
    expect((wrapper.get('.aheart-input__control').element as HTMLInputElement).value).toBe('初始值')
  })

  it('keeps accepted controlled updates without resetting the field', async () => {
    const schema = { version: '1', fields: [{ key: 'title', label: '标题', type: 'input' }] }
    const Host = defineComponent({
      components: { AIForm },
      setup: () => ({ schema, value: ref({ title: '初始值' }) }),
      template: '<AIForm v-model="value" :schema="schema" />'
    })
    const wrapper = mount(Host)

    await wrapper.get('.aheart-input__control').setValue('已接受的值')
    expect((wrapper.get('.aheart-input__control').element as HTMLInputElement).value).toBe('已接受的值')
  })

  it('uses defaults consistently for rendering, conditions, validation and submit', async () => {
    const schema = {
      version: '1',
      fields: [
        { key: 'advanced', label: '高级模式', type: 'switch', defaultValue: true },
        { key: 'title', label: '标题', type: 'input', required: true, defaultValue: '默认标题' },
        { key: 'detail', label: '详情', type: 'textarea', defaultValue: '默认详情', visibleWhen: { field: 'advanced', operator: 'equals', value: true } }
      ]
    }
    const wrapper = mount(AIForm, { props: { schema, modelValue: {} } })

    expect(wrapper.text()).toContain('详情')
    expect((wrapper.get('.aheart-input__control').element as HTMLInputElement).value).toBe('默认标题')
    expect(wrapper.find('.aheart-button').exists()).toBe(true)
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('validation-error')).toBeUndefined()
    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({ advanced: true, title: '默认标题', detail: '默认详情' })
  })

  it('does not restore a default when the controlled model explicitly clears a field', () => {
    const schema = { version: '1', fields: [{ key: 'title', label: '标题', type: 'input', defaultValue: '默认标题' }] }
    const wrapper = mount(AIForm, { props: { schema, modelValue: { title: undefined } } })

    expect((wrapper.get('.aheart-input__control').element as HTMLInputElement).value).toBe('')
  })

  it('maps selectable, temporal, upload and tree fields to existing components', () => {
    const schema = {
      version: '1',
      fields: [
        { key: 'count', label: '数量', type: 'number' },
        { key: 'kind', label: '类别', type: 'select', options: [{ label: '标准', value: 'normal' }] },
        { key: 'level', label: '级别', type: 'radio', options: [{ label: '高', value: 'high' }] },
        { key: 'tags', label: '标签', type: 'checkbox', options: [{ label: '甲', value: 'a' }] },
        { key: 'date', label: '日期', type: 'date' },
        { key: 'dateRange', label: '日期范围', type: 'date-range' },
        { key: 'time', label: '时间', type: 'time' },
        { key: 'timeRange', label: '时间范围', type: 'time-range' },
        { key: 'files', label: '附件', type: 'upload' },
        { key: 'node', label: '节点', type: 'tree-select', defaultValue: ['root'], options: [{ label: '根节点', value: 'root' }] }
      ]
    }
    const wrapper = mount(AIForm, { props: { schema, modelValue: { tags: [], files: [] } } })

    expect(wrapper.find('.aheart-input-number__control').exists()).toBe(true)
    expect(wrapper.find('.aheart-select [role="combobox"]').exists()).toBe(true)
    expect(wrapper.find('.aheart-radio input').exists()).toBe(true)
    expect(wrapper.find('.aheart-checkbox input').exists()).toBe(true)
    expect(wrapper.find('.aheart-date-picker__input').exists()).toBe(true)
    expect(wrapper.find('.aheart-date-range-picker').exists()).toBe(true)
    expect(wrapper.find('.aheart-time-picker__input').exists()).toBe(true)
    expect(wrapper.find('.aheart-time-range-picker').exists()).toBe(true)
    expect(wrapper.find('.aheart-upload input[type="file"]').exists()).toBe(true)
    expect(wrapper.find('.aheart-tree-select__trigger').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ATreeSelect' }).props('multiple')).toBe(true)

    for (const key of ['kind', 'date', 'time', 'node']) {
      const label = wrapper.get(`label[for="${key}"]`)
      expect(label.attributes('id')).toBe(`${key}-label`)
      expect(wrapper.get(`#${key}`).attributes('aria-labelledby')).toBe(`${key}-label`)
    }
    expect(wrapper.findAll('#dateRange-start, #dateRange-end')).toHaveLength(2)
    expect(wrapper.findAll('#timeRange-start, #timeRange-end')).toHaveLength(2)
  })

  it.each([
    [undefined, undefined],
    ['09:00:00', undefined],
    [undefined, '18:00:00']
  ])('treats an incomplete required range as missing: %j', async (start, end) => {
    const wrapper = mount(AIForm, {
      props: {
        schema: { version: '1', fields: [{ key: 'window', label: '执行窗口', type: 'time-range', required: true }] },
        modelValue: { window: [start, end] }
      }
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('执行窗口为必填项')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('connects range labels and validation feedback to both inputs', async () => {
    const wrapper = mount(AIForm, {
      attachTo: document.body,
      props: {
        schema: { version: '1', fields: [{ key: 'window', label: '执行窗口', type: 'time-range', required: true }] },
        modelValue: { window: [undefined, undefined] }
      }
    })

    expect(wrapper.get('label').attributes('for')).toBe('window-start')
    await wrapper.get('form').trigger('submit')

    const inputs = wrapper.findAll('#window-start, #window-end')
    expect(inputs).toHaveLength(2)
    expect(inputs.every((input) => input.attributes('aria-invalid') === 'true')).toBe(true)
    expect(inputs.every((input) => input.attributes('aria-describedby') === 'window-error')).toBe(true)
    expect(document.activeElement).toBe(inputs[0].element)
    wrapper.unmount()
  })

  it.each([
    ['date', 'day'],
    ['time', 'time']
  ])('connects validation feedback to a required %s picker', async (type, key) => {
    const wrapper = mount(AIForm, {
      props: {
        schema: { version: '1', fields: [{ key, label: '执行时间', type, required: true }] }
      }
    })

    await wrapper.get('form').trigger('submit')

    const input = wrapper.get(`#${key}`)
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(`${key}-error`)
  })

  it('renders product context and fields in declared semantic groups', () => {
    const wrapper = mount(AIForm, {
      props: {
        schema: {
          version: '1',
          title: '创建研究任务',
          description: '配置目标、范围和交付方式。',
          groups: [
            { key: 'basic', title: '任务目标', description: '先定义要解决的问题。' },
            { key: 'delivery', title: '交付设置' }
          ],
          fields: [
            { key: 'title', label: '任务名称', type: 'input', group: 'basic', description: '使用便于团队识别的名称。' },
            { key: 'format', label: '交付格式', type: 'select', group: 'delivery', options: [{ label: '报告', value: 'report' }] }
          ]
        }
      }
    })

    expect(wrapper.get('.aheart-ai-form__header').text()).toContain('创建研究任务')
    expect(wrapper.findAll('fieldset')).toHaveLength(2)
    expect(wrapper.findAll('legend').map((legend) => legend.text())).toEqual(['任务目标先定义要解决的问题。', '交付设置'])
    expect(wrapper.get('[data-field-key="title"] .aheart-ai-form__field-description').text()).toBe('使用便于团队识别的名称。')
  })

  it('shows an error summary, focuses the first invalid field, and links feedback', async () => {
    const wrapper = mount(AIForm, {
      attachTo: document.body,
      props: {
        schema: {
          version: '1',
          fields: [
            { key: 'title', label: '任务名称', type: 'input', required: true },
            { key: 'owner', label: '负责人', type: 'input', required: true }
          ]
        }
      }
    })

    await wrapper.get('form').trigger('submit')

    const summary = wrapper.get('.aheart-ai-form__error-summary')
    expect(summary.attributes('role')).toBe('alert')
    expect(summary.text()).toContain('请完成 2 个必填项')
    expect(wrapper.get('[data-field-key="title"]').classes()).toContain('is-error')
    expect(wrapper.get('[data-field-key="title"] .aheart-ai-form__field-error').attributes('id')).toBe('title-error')
    expect(document.activeElement).toBe(wrapper.get('#title').element)
    wrapper.unmount()
  })

  it('locks the form while submitting and exposes a safe business error', async () => {
    const wrapper = mount(AIForm, {
      props: {
        schema: { version: '1', fields: [{ key: 'title', label: '任务名称', type: 'input' }] },
        modelValue: { title: '发布计划' },
        submitting: true,
        submitText: '创建任务',
        submitError: '任务创建失败，请重试'
      }
    })

    expect(wrapper.get('form').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.aheart-input__control').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button[type="submit"]').text()).toContain('创建任务')
    expect(wrapper.get('.aheart-ai-form__submit-error').text()).toBe('任务创建失败，请重试')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
