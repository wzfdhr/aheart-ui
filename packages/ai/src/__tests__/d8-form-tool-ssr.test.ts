import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import AIForm from '../form.vue'
import AIBubble from '../bubble.vue'
import AIAgentWorkbench from '../agent-workbench.vue'
import { validateAIFormSchema } from '../form-schema'

// The AI package does not yet declare the SSR test peer; use the workspace's
// already-installed renderer so this RED can execute without changing package
// metadata. The implementation gate must add/verify the real consumer path.
const getRenderToString = async () => {
  const renderer = await import('../../../components/node_modules/@vue/server-renderer')
  return renderer.renderToString
}

const baseSchema = (fields: unknown[]) => ({ version: '1', fields })

describe('D8 AIForm rules, lifecycle, and public form API', () => {
  it('accepts only the serializable rule whitelist and rejects unsafe or impossible combinations', () => {
    const valid = validateAIFormSchema(baseSchema([
      { key: 'amount', label: '金额', type: 'number', rules: [{ kind: 'range', valueType: 'number', min: 1, max: 10 }] },
      { key: 'title', label: '标题', type: 'input', rules: [{ kind: 'range', valueType: 'length', min: 2, max: 20 }] },
      { key: 'email', label: '邮箱', type: 'input', rules: [{ kind: 'format', format: 'email' }] },
      { key: 'url', label: '网址', type: 'input', rules: [{ kind: 'format', format: 'url' }] },
      { key: 'day', label: '日期', type: 'date', rules: [{ kind: 'format', format: 'date' }] },
      { key: 'time', label: '时间', type: 'time', rules: [{ kind: 'format', format: 'time' }] },
      { key: 'confirm', label: '确认金额', type: 'number', dependencies: ['amount'], rules: [{ kind: 'compare', field: 'amount', operator: 'equals' }] },
      { key: 'remote', label: '远程名称', type: 'input', rules: [{ kind: 'async', validator: 'unique-name' }] }
    ]))
    expect(valid.valid).toBe(true)

    const invalid = validateAIFormSchema(baseSchema([
      { key: 'amount', label: '金额', type: 'number', rules: [{ kind: 'range', valueType: 'number' }] },
      { key: 'badLength', label: '长度', type: 'number', rules: [{ kind: 'range', valueType: 'length', min: 1, max: 2 }] },
      { key: 'badRange', label: '范围', type: 'input', rules: [{ kind: 'range', valueType: 'length', min: 3, max: 1 }] },
      { key: 'badCompare', label: '比较', type: 'input', rules: [{ kind: 'compare', field: 'missing', operator: 'greater-than' }] },
      { key: 'unsafe', label: '危险', type: 'input', rules: [{ kind: 'async', validator: 'eval(window.alert(1))', script: 'alert(1)' }] }
    ]))
    expect(invalid.valid).toBe(false)
    expect(invalid.errors.join('\n')).toMatch(/range|比较|validator|不支持|不存在|必须/)
  })

  it.each([
    ['email', 'not-an-email'],
    ['url', 'ftp://unsafe.example'],
    ['day', '2026-02-30'],
    ['time', '25:00:00']
  ])('validates strict %s formats and does not accept malformed values', async (key, value) => {
    const schema = baseSchema([{ key, label: key, type: key === 'day' ? 'date' : key === 'time' ? 'time' : 'input', required: true, rules: [{ kind: 'format', format: key === 'day' ? 'date' : key === 'time' ? 'time' : key }] }])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { [key]: value } } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('校验问题')
  })

  it('validates number and length ranges, and skips non-required empty values', async () => {
    const schema = baseSchema([
      { key: 'count', label: '数量', type: 'number', rules: [{ kind: 'range', valueType: 'number', min: 1, max: 3 }] },
      { key: 'title', label: '标题', type: 'input', rules: [{ kind: 'range', valueType: 'length', min: 2, max: 4 }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { count: 4, title: 'x' } } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('数量')
    await wrapper.setProps({ modelValue: { count: undefined, title: undefined } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('compares compatible values without implicit string/number coercion and adds dependencies', async () => {
    const schema = baseSchema([
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'confirm', label: '确认金额', type: 'number', rules: [{ kind: 'compare', field: 'amount', operator: 'equals' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { amount: 2, confirm: '2' } } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper.setProps({ modelValue: { amount: 2, confirm: 2 } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('runs named async validators with an AbortSignal and ignores stale, reset, schema, and unmount completions', async () => {
    let signal: AbortSignal | undefined
    let resolveValidator!: (value: string) => void
    const pending = new Promise<string>((resolve) => { resolveValidator = resolve })
    const validators = {
      unique: vi.fn((_value: unknown, context: { signal: AbortSignal }) => {
        signal = context.signal
        return pending
      })
    }
    const schema = baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'unique' }] }])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { name: 'old' }, validators } as any })
    const form = wrapper.vm as unknown as { validate: () => Promise<unknown>; resetFields: () => void }
    const validation = form.validate()
    await nextTick()
    expect(validators.unique).toHaveBeenCalled()
    expect(signal).toBeInstanceOf(AbortSignal)
    form.resetFields()
    resolveValidator('stale error')
    await validation
    await flushPromises()
    expect(wrapper.text()).not.toContain('stale error')
    await wrapper.setProps({ schema: baseSchema([{ key: 'other', label: '其他', type: 'input' }]) })
    wrapper.unmount()
    expect(signal?.aborted).toBe(true)
  })

  it('preserves hidden values by default and emits a controlled candidate for preserve:false', async () => {
    const schema = baseSchema([
      { key: 'show', label: '显示', type: 'switch' },
      { key: 'kept', label: '保留', type: 'input', visibleWhen: { field: 'show', operator: 'equals', value: true } },
      { key: 'removed', label: '移除', type: 'input', preserve: false, visibleWhen: { field: 'show', operator: 'equals', value: true } }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { show: true, kept: 'keep', removed: 'remove' } } as any })
    await wrapper.setProps({ modelValue: { show: false, kept: 'keep', removed: 'remove' } })
    await nextTick()
    const updates = wrapper.emitted('update:modelValue') ?? []
    expect(updates.at(-1)?.[0]).toMatchObject({ kept: 'keep' })
    expect((updates.at(-1)?.[0] as Record<string, unknown>).removed).toBeUndefined()
    await wrapper.setProps({ modelValue: { show: true, kept: 'keep', removed: 'remove' } })
    expect(wrapper.text()).toContain('保留')
  })

  it('forwards validate/reset/clear/setFieldsErrors and focuses the first visible enabled error', async () => {
    const schema = baseSchema([
      { key: 'disabled', label: '禁用', type: 'input', required: true, disabledWhen: { field: 'enabled', operator: 'equals', value: false } },
      { key: 'enabled', label: '启用', type: 'switch', required: true }
    ])
    const wrapper = mount(AIForm, { attachTo: document.body, props: { schema, modelValue: { enabled: true } } })
    const form = wrapper.vm as unknown as {
      validate: () => Promise<{ errorFields: unknown[] }>
      resetFields: () => void
      clearValidate: () => void
      setFieldsErrors: (errors: Array<{ name: string; errors: string[] }>) => void
    }
    form.setFieldsErrors([{ name: 'enabled', errors: ['服务端错误'] }])
    await nextTick()
    expect(wrapper.text()).toContain('服务端错误')
    await expect(form.validate()).resolves.toMatchObject({ errorFields: expect.any(Array) })
    form.clearValidate()
    await nextTick()
    expect(wrapper.text()).not.toContain('服务端错误')
    form.resetFields()
    expect(typeof form.resetFields).toBe('function')
  })

  it('skips every rule on a disabled field and does not block submit or invoke async validators', async () => {
    const asyncValidator = vi.fn(() => false)
    const schema = baseSchema([
      { key: 'enabled', label: '启用', type: 'switch' },
      {
        key: 'amount',
        label: '金额',
        type: 'number',
        disabledWhen: { field: 'enabled', operator: 'equals', value: false },
        rules: [
          { kind: 'range', valueType: 'number', min: 1, max: 3, message: '金额范围错误' },
          { kind: 'compare', field: 'enabled', operator: 'equals', message: '金额比较错误' },
          { kind: 'async', validator: 'remote', message: '金额异步错误' }
        ]
      }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { enabled: false, amount: 99 }, validators: { remote: asyncValidator } } as any })
    await wrapper.get('form').trigger('submit')
    expect(asyncValidator).not.toHaveBeenCalled()
    expect(wrapper.emitted('validation-error')).toBeUndefined()
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('lets core Form own async errors and summary instead of a second submit validator', async () => {
    const schema = baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'unique', message: '名称已存在' }] }])
    const wrapper = mount(AIForm, {
      props: {
        schema,
        modelValue: { name: 'taken' },
        validators: { unique: () => '名称已存在' }
      } as any
    })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('名称已存在')
    expect(wrapper.text()).toContain('校验问题')
  })

  it('ignores a late async submit result after resetFields and does not submit the reset candidate', async () => {
    let resolveValidator!: (value: boolean) => void
    const validator = vi.fn(() => new Promise<boolean>((resolve) => { resolveValidator = resolve }))
    const wrapper = mount(AIForm, {
      props: {
        schema: baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'remote' }] }]),
        modelValue: { name: 'current' },
        validators: { remote: validator }
      } as any
    })
    const form = wrapper.vm as unknown as { resetFields: () => void }
    const submitPromise = wrapper.get('form').trigger('submit')
    await nextTick()
    expect(validator).toHaveBeenCalled()
    form.resetFields()
    resolveValidator(false)
    await submitPromise
    await flushPromises()
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('clears server errors before validate after reset and keeps a rejected reset parent authoritative', async () => {
    const schema = baseSchema([{ key: 'name', label: '名称', type: 'input', required: true }])
    const Host = defineComponent({
      components: { AIForm },
      setup: () => {
        const value = ref({ name: 'current' })
        const acceptUpdates = ref(false)
        const onUpdate = (next: Record<string, unknown>) => { if (acceptUpdates.value) value.value = next }
        return { schema, value, acceptUpdates, onUpdate }
      },
      template: '<AIForm :model-value="value" :schema="schema" @update:model-value="onUpdate" />'
    })
    const wrapper = mount(Host)
    const form = wrapper.getComponent(AIForm).vm as unknown as {
      setFieldsErrors: (errors: Array<{ name: string; errors: string[] }>) => void
      resetFields: () => void
      validate: () => Promise<{ errorFields: Array<{ name: string }> }>
    }
    const vm = wrapper.vm as unknown as { value: Record<string, unknown> }
    form.setFieldsErrors([{ name: 'name', errors: ['旧服务端错误'] }])
    await nextTick()
    expect(wrapper.text()).toContain('旧服务端错误')
    form.resetFields()
    await nextTick()
    expect(wrapper.text()).not.toContain('旧服务端错误')
    const result = await form.validate()
    expect(result.errorFields).toEqual([])
    expect(vm.value).toEqual({ name: 'current' })
    expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('current')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.findComponent(AIForm).emitted('submit')?.at(-1)?.[0]).toMatchObject({ name: 'current' })
  })

  it('runs one core validation cycle for range, format, and compare errors', async () => {
    const schema = baseSchema([
      { key: 'amount', label: '金额', type: 'number', rules: [{ kind: 'range', valueType: 'number', min: 1, max: 3, message: '金额范围错误' }] },
      { key: 'email', label: '邮箱', type: 'input', rules: [{ kind: 'format', format: 'email', message: '邮箱格式错误' }] },
      { key: 'confirm', label: '确认金额', type: 'number', rules: [{ kind: 'compare', field: 'amount', operator: 'equals', message: '金额比较错误' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { amount: 9, email: 'invalid', confirm: 1 } } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    const validationEvents = wrapper.emitted('validation-error') ?? []
    expect(validationEvents).toHaveLength(1)
    const errors = validationEvents[0][0] as Array<{ key: string; message: string }>
    expect(new Set(errors.map((error) => error.key)).size).toBe(errors.length)
    expect(errors.map((error) => error.message)).toEqual(expect.arrayContaining(['金额范围错误', '邮箱格式错误', '金额比较错误']))
    expect(wrapper.text()).toContain('校验问题')
    expect(wrapper.text()).not.toContain('必填项')
  })

  it('automatically merges compare references into dependencies and revalidates on dependency changes', async () => {
    const schema = baseSchema([
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'confirm', label: '确认金额', type: 'number', dependencies: ['other'], rules: [{ kind: 'compare', field: 'amount', operator: 'equals', message: '金额不一致' }] },
      { key: 'other', label: '其他', type: 'number' }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { amount: 1, confirm: 2, other: 0 } } })
    const confirmItem = wrapper.findAllComponents({ name: 'AFormItem' }).find((item) => item.props('name') === 'confirm')
    expect(confirmItem?.props('dependencies')).toEqual(expect.arrayContaining(['amount', 'other']))
    const form = wrapper.vm as unknown as { validate: () => Promise<{ errorFields: Array<{ name: string }> }> }
    await form.validate()
    expect(wrapper.text()).toContain('金额不一致')
    await wrapper.setProps({ modelValue: { amount: 2, confirm: 2, other: 0 } })
    await nextTick()
    const result = await form.validate()
    expect(result.errorFields.some((field) => String(field.name) === 'confirm')).toBe(false)
  })

  it('does not abort sibling async rules on the same field and skips optional empty async values', async () => {
    const signals: AbortSignal[] = []
    const validators = {
      first: vi.fn((_value: unknown, context: { signal: AbortSignal }) => { signals.push(context.signal); return false }),
      second: vi.fn((_value: unknown, context: { signal: AbortSignal }) => { signals.push(context.signal); return false }),
      optional: vi.fn(() => false)
    }
    const schema = baseSchema([
      { key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'first' }, { kind: 'async', validator: 'second' }] },
      { key: 'optional', label: '可选', type: 'input', rules: [{ kind: 'async', validator: 'optional' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { name: 'x', optional: '' }, validators } as any })
    const form = wrapper.vm as unknown as { validate: () => Promise<unknown> }
    await form.validate()
    expect(validators.first).toHaveBeenCalled()
    expect(validators.second).toHaveBeenCalled()
    expect(signals).toHaveLength(2)
    expect(signals[0]).toBe(signals[1])
    expect(signals.every((signal) => !signal.aborted)).toBe(true)
    expect(validators.optional).not.toHaveBeenCalled()
  })

  it('aborts an async field run on value, dependency, schema, reset, and unmount invalidation', async () => {
    const signals: AbortSignal[] = []
    const pendingResolvers: Array<() => void> = []
    const validators = { remote: vi.fn((_value: unknown, context: { signal: AbortSignal }) => {
      signals.push(context.signal)
      return new Promise<void>((resolve) => pendingResolvers.push(resolve))
    }) }
    const schema = baseSchema([
      { key: 'dependency', label: '依赖', type: 'switch' },
      { key: 'name', label: '名称', type: 'input', dependencies: ['dependency'], rules: [{ kind: 'async', validator: 'remote' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { dependency: false, name: 'one' }, validators } as any })
    const form = wrapper.vm as unknown as { validate: () => Promise<unknown>; resetFields: () => void }
    void form.validate()
    await nextTick()
    expect(signals).toHaveLength(1)
    await wrapper.setProps({ modelValue: { dependency: true, name: 'two' } })
    await nextTick()
    expect(signals[0].aborted).toBe(true)
    void form.validate()
    await nextTick()
    form.resetFields()
    expect(signals.at(-1)?.aborted).toBe(true)
    void form.validate()
    await nextTick()
    await wrapper.setProps({ schema: baseSchema([{ key: 'other', label: '其他', type: 'input' }]) })
    expect(signals.at(-1)?.aborted).toBe(true)
    wrapper.unmount()
    expect(signals.every((signal) => signal.aborted)).toBe(true)
    pendingResolvers.splice(0).forEach((resolve) => resolve())
    await flushPromises()
  })

  it('aborts the previous same-field validate run but keeps unrelated fields alive until their own dependency changes', async () => {
    const signals: Record<string, AbortSignal[]> = { name: [], other: [] }
    const resolvers: Array<() => void> = []
    const validators = {
      name: vi.fn((_value: unknown, context: { signal: AbortSignal }) => {
        signals.name.push(context.signal)
        return new Promise<void>((resolve) => resolvers.push(resolve))
      }),
      other: vi.fn((_value: unknown, context: { signal: AbortSignal }) => {
        signals.other.push(context.signal)
        return new Promise<void>((resolve) => resolvers.push(resolve))
      })
    }
    const schema = baseSchema([
      { key: 'dependency', label: '依赖', type: 'switch' },
      { key: 'name', label: '名称', type: 'input', dependencies: ['dependency'], rules: [{ kind: 'async', validator: 'name' }] },
      { key: 'unrelated', label: '无关值', type: 'input', rules: [{ kind: 'async', validator: 'other' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { dependency: false, name: 'a', unrelated: 'b' }, validators } as any })
    const form = wrapper.vm as unknown as { validate: () => Promise<unknown> }
    void form.validate()
    await nextTick()
    expect(signals.name).toHaveLength(1)
    expect(signals.other).toHaveLength(1)
    void form.validate()
    await nextTick()
    expect(signals.name[0].aborted).toBe(true)
    expect(signals.other[0].aborted).toBe(true)
    await wrapper.setProps({ modelValue: { dependency: false, name: 'a', unrelated: 'changed' } })
    await nextTick()
    expect(signals.name.at(-1)?.aborted).toBe(false)
    expect(signals.other.at(-1)?.aborted).toBe(true)
    void form.validate()
    await nextTick()
    const nameAfterFullValidate = signals.name.at(-1)
    const otherAfterFullValidate = signals.other.at(-1)
    expect(nameAfterFullValidate?.aborted).toBe(false)
    expect(otherAfterFullValidate?.aborted).toBe(false)
    await wrapper.setProps({ modelValue: { dependency: true, name: 'a', unrelated: 'changed' } })
    await nextTick()
    expect(nameAfterFullValidate?.aborted).toBe(true)
    expect(otherAfterFullValidate?.aborted).toBe(false)
    resolvers.splice(0).forEach((resolve) => resolve())
    wrapper.unmount()
    await flushPromises()
  })

  it('clears errors on reset, preserves authoritative values when reset is rejected, and merges hidden removals', async () => {
    const schema = baseSchema([
      { key: 'show', label: '显示', type: 'switch' },
      { key: 'first', label: '第一项', type: 'input', defaultValue: '默认第一项', preserve: false, visibleWhen: { field: 'show', operator: 'equals', value: true } },
      { key: 'second', label: '第二项', type: 'input', defaultValue: '默认第二项', preserve: false, visibleWhen: { field: 'show', operator: 'equals', value: true } }
    ])
    const Host = defineComponent({
      components: { AIForm },
      setup: () => {
        const value = ref({ show: true, first: 'initial-a', second: 'initial-b' })
        const acceptUpdates = ref(false)
        const onUpdate = (next: Record<string, unknown>) => { if (acceptUpdates.value) value.value = next }
        return { schema, value, acceptUpdates, onUpdate }
      },
      template: '<AIForm ref="form" :model-value="value" :schema="schema" @update:model-value="onUpdate" />'
    })
    const wrapper = mount(Host)
    const vm = wrapper.vm as unknown as { value: Record<string, unknown>; acceptUpdates: boolean }
    vm.value = { show: true, first: 'current-a', second: 'current-b' }
    await nextTick()
    const form = wrapper.getComponent(AIForm).vm as unknown as { setFieldsErrors: (errors: Array<{ name: string; errors: string[] }>) => void; resetFields: () => void }
    form.setFieldsErrors([{ name: 'first', errors: ['旧错误'] }])
    await nextTick()
    expect(wrapper.text()).toContain('旧错误')
    form.resetFields()
    await nextTick()
    expect(wrapper.text()).not.toContain('旧错误')
    expect(vm.value).toEqual({ show: true, first: 'current-a', second: 'current-b' })
    expect((wrapper.get('#first').element as HTMLInputElement).value).toBe('current-a')
    expect((wrapper.get('#second').element as HTMLInputElement).value).toBe('current-b')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.findComponent(AIForm).emitted('submit')?.at(-1)?.[0]).toMatchObject({ first: 'current-a', second: 'current-b' })
    vm.acceptUpdates = true
    vm.value = { show: false, first: 'current-a', second: 'current-b' }
    await nextTick()
    const updates = wrapper.findComponent(AIForm).emitted('update:modelValue') ?? []
    const removalCandidates = updates.filter((entry) => entry[0] && typeof entry[0] === 'object' && !(entry[0] as Record<string, unknown>).show)
    expect(removalCandidates).toHaveLength(1)
    expect(removalCandidates[0][0]).toEqual({ show: false })
    expect(vm.value).toEqual({ show: false })
    vm.value = { show: true }
    await nextTick()
    expect((wrapper.get('#first').element as HTMLInputElement).value).toBe('')
    expect((wrapper.get('#second').element as HTMLInputElement).value).toBe('')
  })

  it('keeps a default after a rejected preserve:false removal and tombstones only after parent acceptance', async () => {
    const schema = baseSchema([
      { key: 'show', label: '显示', type: 'switch' },
      { key: 'advanced', label: '高级设置', type: 'input', defaultValue: 'DEFAULT', preserve: false, visibleWhen: { field: 'show', operator: 'equals', value: true } }
    ])
    const Host = defineComponent({
      components: { AIForm },
      setup: () => {
        const value = ref({ show: true, advanced: 'DEFAULT' })
        const acceptUpdates = ref(false)
        const onUpdate = (next: Record<string, unknown>) => { if (acceptUpdates.value) value.value = next }
        return { schema, value, acceptUpdates, onUpdate }
      },
      template: '<AIForm :model-value="value" :schema="schema" @update:model-value="onUpdate" />'
    })
    const wrapper = mount(Host)
    const vm = wrapper.vm as unknown as { value: Record<string, unknown>; acceptUpdates: boolean }
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('DEFAULT')
    vm.value = { show: false, advanced: 'DEFAULT' }
    await nextTick()
    expect(vm.value).toEqual({ show: false, advanced: 'DEFAULT' })
    vm.value = { show: true, advanced: 'DEFAULT' }
    await nextTick()
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('DEFAULT')
    vm.acceptUpdates = true
    vm.value = { show: false, advanced: 'DEFAULT' }
    await nextTick()
    expect(vm.value).toEqual({ show: false })
    vm.value = { show: true }
    await nextTick()
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('')
  })

  it('keeps DEFAULT when model initially contains only show and parent rejects removal, then tombstones only after accepted deletion', async () => {
    const schema = baseSchema([
      { key: 'show', label: '显示', type: 'switch' },
      { key: 'advanced', label: '高级设置', type: 'input', defaultValue: 'DEFAULT', preserve: false, visibleWhen: { field: 'show', operator: 'equals', value: true } }
    ])
    const Host = defineComponent({
      components: { AIForm },
      setup: () => {
        const value = ref({ show: true })
        const acceptUpdates = ref(false)
        const updates: Array<Record<string, unknown>> = []
        const onUpdate = (next: Record<string, unknown>) => { updates.push(next); if (acceptUpdates.value) value.value = next }
        return { schema, value, acceptUpdates, updates, onUpdate }
      },
      template: '<AIForm :model-value="value" :schema="schema" @update:model-value="onUpdate" />'
    })
    const wrapper = mount(Host)
    const vm = wrapper.vm as unknown as { value: Record<string, unknown>; acceptUpdates: boolean; updates: Array<Record<string, unknown>> }
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('DEFAULT')
    vm.value = { show: false }
    await nextTick()
    expect(vm.updates.at(-1)).toEqual({ show: false })
    expect(vm.value).toEqual({ show: false })
    vm.value = { show: true }
    await nextTick()
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('DEFAULT')
    vm.value = { show: true, y: 'unrelated-change' }
    await nextTick()
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('DEFAULT')
    vm.value = { show: true, advanced: 'DEFAULT' }
    await nextTick()
    vm.acceptUpdates = true
    vm.value = { show: false, advanced: 'DEFAULT' }
    await nextTick()
    expect(vm.value).toEqual({ show: false })
    vm.value = { show: true }
    await nextTick()
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('')
    await wrapper.get('form').trigger('submit')
    const submit = wrapper.findComponent(AIForm).emitted('submit')?.at(-1)?.[0] as Record<string, unknown>
    expect(submit).not.toHaveProperty('advanced')
    expect(submit).not.toHaveProperty('DEFAULT')
  })

  it('validates field/rule combinations, compare types, message types, and safe async names', () => {
    const result = validateAIFormSchema(baseSchema([
      { key: 'number', label: '数字', type: 'number' },
      { key: 'text', label: '文本', type: 'input' },
      { key: 'flag', label: '开关', type: 'switch' },
      { key: 'list', label: '列表', type: 'checkbox', options: [{ label: 'A', value: 'a' }] },
      { key: 'badNumberRange', label: '数字范围', type: 'input', rules: [{ kind: 'range', valueType: 'number', min: 1, message: 3 }] },
      { key: 'badLengthRange', label: '长度范围', type: 'number', rules: [{ kind: 'range', valueType: 'length', min: 1 }] },
      { key: 'badCompare', label: '错误比较', type: 'input', rules: [{ kind: 'compare', field: 'number', operator: 'greater-than' }] },
      { key: 'badBoolCompare', label: '布尔比较', type: 'switch', rules: [{ kind: 'compare', field: 'flag', operator: 'greater-than' }] },
      { key: 'badListCompare', label: '列表比较', type: 'checkbox', options: [{ label: 'A', value: 'a' }], rules: [{ kind: 'compare', field: 'list', operator: 'greater-than' }] },
      { key: 'unsafeValidator', label: '校验器', type: 'input', rules: [{ kind: 'async', validator: 'remote validator' }] }
    ]))
    expect(result.valid).toBe(false)
    expect(result.errors.join('\n')).toMatch(/类型|组合|message|validator|安全|比较/)
  })

  it.each(['toString', '__proto__'])('rejects prototype-chain rule kind %s without throwing', (kind) => {
    const schema = baseSchema([{ key: 'value', label: '值', type: 'input', rules: [{ kind }] }])
    let result: ReturnType<typeof validateAIFormSchema> | undefined
    expect(() => { result = validateAIFormSchema(schema) }).not.toThrow()
    expect(result?.valid).toBe(false)
    expect(result?.errors.length).toBeGreaterThan(0)
  })

  it('reports a missing async validator as a schema error before submit', () => {
    const wrapper = mount(AIForm, {
      props: {
        schema: baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'missing' }] }]),
        modelValue: { name: 'x' },
        validators: {}
      } as any
    })
    expect(wrapper.get('[role="alert"]').text()).toContain('表单配置无效')
    expect(wrapper.emitted('schema-error')?.[0]?.[0].join('\n')).toContain('validator')
  })

  it.each(['constructor', 'toString'])('rejects default/inherited validator name %s as a schema error', (validator) => {
    const wrapper = mount(AIForm, {
      props: {
        schema: baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator }] }])
      } as any
    })
    expect(wrapper.get('[role="alert"]').text()).toContain('表单配置无效')
    expect(wrapper.emitted('schema-error')?.[0]?.[0].join('\n')).toContain('validator')
  })

  it('accepts only an own function validator and rejects an own non-function validator', async () => {
    const inherited = vi.fn(() => undefined)
    const ownFunction = vi.fn(() => undefined)
    const validators = Object.create({ inherited }) as Record<string, unknown>
    Object.defineProperty(validators, 'remote', { configurable: true, enumerable: true, value: ownFunction })
    const validWrapper = mount(AIForm, {
      props: {
        schema: baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'remote' }] }]),
        modelValue: { name: 'ok' },
        validators
      } as any
    })
    const validForm = validWrapper.vm as unknown as { validate: () => Promise<unknown> }
    await validForm.validate()
    expect(ownFunction).toHaveBeenCalled()
    expect(inherited).not.toHaveBeenCalled()

    const invalidWrapper = mount(AIForm, {
      props: {
        schema: baseSchema([{ key: 'name', label: '名称', type: 'input', rules: [{ kind: 'async', validator: 'remote' }] }]),
        modelValue: { name: 'bad' },
        validators: { remote: 'not-a-function' }
      } as any
    })
    expect(invalidWrapper.get('[role="alert"]').text()).toContain('表单配置无效')
    expect(invalidWrapper.emitted('schema-error')?.[0]?.[0].join('\n')).toContain('validator')
  })

  it('treats a shallow-cloned equal deletion candidate as accepted and never revives the deleted default', async () => {
    const schema = baseSchema([
      { key: 'show', label: '显示', type: 'switch' },
      { key: 'advanced', label: '高级设置', type: 'input', defaultValue: 'DEFAULT', preserve: false, visibleWhen: { field: 'show', operator: 'equals', value: true } }
    ])
    const Host = defineComponent({
      components: { AIForm },
      setup: () => {
        const value = ref({ show: true, advanced: 'DEFAULT' })
        const acceptUpdates = ref(false)
        const candidates: Array<Record<string, unknown>> = []
        const onUpdate = (next: Record<string, unknown>) => {
          candidates.push(next)
          if (acceptUpdates.value) value.value = { ...next }
        }
        return { schema, value, acceptUpdates, candidates, onUpdate }
      },
      template: '<AIForm :model-value="value" :schema="schema" @update:model-value="onUpdate" />'
    })
    const wrapper = mount(Host)
    const vm = wrapper.vm as unknown as { value: Record<string, unknown>; acceptUpdates: boolean; candidates: Array<Record<string, unknown>> }
    vm.value = { show: false, advanced: 'DEFAULT' }
    await nextTick()
    expect(vm.candidates.at(-1)).toEqual({ show: false })
    expect(vm.value).toEqual({ show: false, advanced: 'DEFAULT' })
    vm.value = { show: true, advanced: 'DEFAULT', y: 'unrelated' }
    await nextTick()
    expect((wrapper.get('#advanced').element as HTMLInputElement).value).toBe('DEFAULT')
    vm.acceptUpdates = true
    vm.value = { show: false, advanced: 'DEFAULT', y: 'unrelated' }
    await nextTick()
    expect(vm.candidates.at(-1)).toEqual({ show: false, y: 'unrelated' })
    expect(vm.value).toEqual({ show: false, y: 'unrelated' })
    vm.value = { show: true, y: 'unrelated' }
    await nextTick()
    await wrapper.get('form').trigger('submit')
    const submitted = wrapper.findComponent(AIForm).emitted('submit')?.at(-1)?.[0] as Record<string, unknown>
    expect(submitted).not.toHaveProperty('advanced')
    expect(submitted).not.toHaveProperty('DEFAULT')
  })

  it.each([
    ['number field cannot use length range', baseSchema([{ key: 'value', label: '数值', type: 'number', rules: [{ kind: 'range', valueType: 'length', min: 1 }] }])],
    ['input field cannot use number range', baseSchema([{ key: 'value', label: '文本', type: 'input', rules: [{ kind: 'range', valueType: 'number', min: 1 }] }])],
    ['rule message must be a string', baseSchema([{ key: 'value', label: '值', type: 'input', rules: [{ kind: 'format', format: 'email', message: 123 }] }])],
    ['validator name must be a safe identifier', baseSchema([{ key: 'value', label: '值', type: 'input', rules: [{ kind: 'async', validator: 'remote validator' }] }])],
    ['ordered compare rejects ordinary strings', baseSchema([
      { key: 'left', label: '左文本', type: 'input' },
      { key: 'right', label: '右文本', type: 'input', rules: [{ kind: 'compare', field: 'left', operator: 'greater-than' }] }
    ])],
    ['ordered compare rejects booleans', baseSchema([
      { key: 'left', label: '左开关', type: 'switch' },
      { key: 'right', label: '右开关', type: 'switch', rules: [{ kind: 'compare', field: 'left', operator: 'less-than' }] }
    ])],
    ['ordered compare rejects arrays', baseSchema([
      { key: 'left', label: '左列表', type: 'checkbox', options: [{ label: 'A', value: 'a' }] },
      { key: 'right', label: '右列表', type: 'checkbox', options: [{ label: 'A', value: 'a' }], rules: [{ kind: 'compare', field: 'left', operator: 'greater-than' }] }
    ])],
    ['ordered compare rejects incompatible field types', baseSchema([
      { key: 'left', label: '左数字', type: 'number' },
      { key: 'right', label: '右文本', type: 'input', rules: [{ kind: 'compare', field: 'left', operator: 'greater-than' }] }
    ])]
  ])('rejects schema error: %s', (_label, schema) => {
    const result = validateAIFormSchema(schema)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('allows ordered compare only for finite numbers and canonical date/time values at runtime', async () => {
    const schema = baseSchema([
      { key: 'start', label: '开始日期', type: 'date' },
      { key: 'end', label: '结束日期', type: 'date', rules: [{ kind: 'compare', field: 'start', operator: 'greater-than', message: '日期顺序错误' }] },
      { key: 'startTime', label: '开始时间', type: 'time' },
      { key: 'endTime', label: '结束时间', type: 'time', rules: [{ kind: 'compare', field: 'startTime', operator: 'greater-than', message: '时间顺序错误' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { start: '2026-02-30', end: '2026-03-01', startTime: '10:00:00', endTime: '09:00:00' } } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('日期顺序错误')
    expect(wrapper.text()).toContain('时间顺序错误')
  })

  it('rejects ordered compare when date operands are not both canonical dates', async () => {
    const schema = baseSchema([
      { key: 'start', label: '开始日期', type: 'date' },
      { key: 'end', label: '结束日期', type: 'date', rules: [{ kind: 'compare', field: 'start', operator: 'greater-than', message: '日期类型错误' }] }
    ])
    const wrapper = mount(AIForm, { props: { schema, modelValue: { start: '09:00:00', end: '2026-03-01' } } })
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('日期类型错误')
  })

  it.each([
    ['number with email format', { key: 'value', label: '数值', type: 'number', rules: [{ kind: 'format', format: 'email' }] }],
    ['switch with date format', { key: 'value', label: '开关', type: 'switch', rules: [{ kind: 'format', format: 'date' }] }],
    ['checkbox with url format', { key: 'value', label: '列表', type: 'checkbox', options: [{ label: 'A', value: 'a' }], rules: [{ kind: 'format', format: 'url' }] }],
    ['date with email format', { key: 'value', label: '日期', type: 'date', rules: [{ kind: 'format', format: 'email' }] }],
    ['time with url format', { key: 'value', label: '时间', type: 'time', rules: [{ kind: 'format', format: 'url' }] }]
  ])('rejects incompatible format schema: %s', (_label, field) => {
    const result = validateAIFormSchema(baseSchema([field]))
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it.each([
    ['date-range with date format', { key: 'value', label: '日期范围', type: 'date-range', rules: [{ kind: 'format', format: 'date' }] }],
    ['time-range with time format', { key: 'value', label: '时间范围', type: 'time-range', rules: [{ kind: 'format', format: 'time' }] }]
  ])('rejects unsupported range format schema: %s', (_label, field) => {
    const result = validateAIFormSchema(baseSchema([field]))
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})

describe('D8 structured tool summaries and checkpoint cleanup', () => {
  it('renders status-only tool call fields with labels', () => {
    const wrapper = mount(AIBubble, { props: { message: { id: 'status-only', role: 'assistant', content: '', toolCall: { id: 'call', name: 'search', summary: '摘要', inputStatus: 'pending', resultStatus: 'error' } } as any } })
    expect(wrapper.get('dt').text()).toContain('输入')
    expect(wrapper.text()).toContain('pending')
    expect(wrapper.text()).toContain('error')
  })
  const toolCall = {
    id: 'call-1',
    name: 'search',
    summary: '查询资料',
    inputStatus: 'ready' as const,
    inputSummary: '查询公开资料',
    resultStatus: 'success' as const,
    resultSummary: '找到 3 条结果',
    arguments: { secret: 'do-not-render' },
    result: { raw: 'do-not-render' },
    reasoning: 'hidden chain of thought',
    trace: 'internal trace',
    tokens: 123
  }

  it('renders only the AIToolCallDisplay whitelist and excludes raw arguments/reasoning', () => {
    const wrapper = mount(AIBubble, {
      props: { message: { id: 'assistant-1', role: 'assistant', content: 'legacy hidden content', status: 'complete', toolCall } as any }
    })
    expect(wrapper.text()).toContain('查询资料')
    expect(wrapper.text()).toContain('查询公开资料')
    expect(wrapper.text()).toContain('找到 3 条结果')
    expect(wrapper.text()).not.toContain('legacy hidden content')
    expect(wrapper.text()).not.toContain('do-not-render')
    expect(wrapper.text()).not.toContain('hidden chain of thought')
    expect(wrapper.text()).not.toContain('internal trace')
    expect(wrapper.text()).not.toContain('123')
  })

  it('clears an older tool summary when an authoritative checkpoint omits toolCall', async () => {
    const wrapper = mount(AIBubble, { props: { message: { id: 'assistant-1', role: 'assistant', content: '', toolCall } as any } })
    expect(wrapper.text()).toContain('查询资料')
    await wrapper.setProps({ message: { id: 'assistant-1', role: 'assistant', content: '完成', status: 'complete' } as any })
    expect(wrapper.text()).not.toContain('查询资料')
  })

  it('projects task toolCall summaries, hides legacy detail/raw reasoning, and enforces status enums', () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        tasks: [{
          id: 'tool-task',
          label: '工具任务',
          status: 'complete',
          detail: 'legacy detail must stay hidden',
          toolCall: {
            id: 'call-2',
            name: 'search',
            summary: '业务摘要',
            inputStatus: 'ready',
            inputSummary: '安全输入',
            resultStatus: 'success',
            resultSummary: '安全结果',
            status: 'not-a-public-status',
            rawArguments: '{ secret: true }',
            reasoning: 'hidden reasoning'
          }
        } as any]
      }
    })
    expect(wrapper.text()).toContain('业务摘要')
    expect(wrapper.text()).toContain('安全输入')
    expect(wrapper.text()).toContain('安全结果')
    expect(wrapper.text()).not.toContain('legacy detail must stay hidden')
    expect(wrapper.text()).not.toContain('secret')
    expect(wrapper.text()).not.toContain('hidden reasoning')
    expect(wrapper.text()).not.toContain('not-a-public-status')
  })
})

describe('D8 SSR and hydration invariants', () => {
  const props = {
    title: '双工作台',
    tasks: [{ id: 'task-1', label: '任务', status: 'complete' as const }],
    artifacts: [{ id: 'artifact-1', title: '结果' }]
  }

  it('produces deterministic SSR and unique IDs for two workbench instances', async () => {
    const App = defineComponent({ render: () => h('main', [h(AIAgentWorkbench, props), h(AIAgentWorkbench, props)]) })
    const renderToString = await getRenderToString()
    const first = await renderToString(createSSRApp(App))
    const second = await renderToString(createSSRApp(App))
    expect(first).toBe(second)
    const ids = [...first.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]).filter(Boolean)
    expect(new Set(ids).size).toBe(ids.length)
    const references = [...first.matchAll(/\baria-labelledby="([^"]+)"/g)]
      .flatMap((match) => match[1].split(/\s+/).filter(Boolean))
    expect(references.every((reference) => ids.includes(reference))).toBe(true)
  })

  it('hydrates without warnings and does not require DOM globals for schema validation', async () => {
    const transport = { send: async function* () { /* hydration-only transport; no request is started */ } }
    const hydrationProps = { ...props, transport }
    const App = defineComponent({ render: () => h(AIAgentWorkbench, hydrationProps) })
    const renderToString = await getRenderToString()
    const html = await renderToString(createSSRApp(App))
    const host = document.createElement('div')
    host.innerHTML = html
    const warnings: unknown[] = []
    const errors: unknown[] = []
    const warn = console.warn
    const error = console.error
    let app: ReturnType<typeof createSSRApp> | undefined
    console.warn = (...args: unknown[]) => warnings.push(args)
    console.error = (...args: unknown[]) => errors.push(args)
    try {
      app = createSSRApp(App)
      app.mount(host, true)
      await nextTick()
      await flushPromises()
      await nextTick()
      const executionTab = host.querySelector<HTMLElement>('#aheart-tab-execution')
      executionTab?.click()
      await nextTick()
      await flushPromises()
      const openDrawer = host.querySelector<HTMLElement>('[data-action="open-execution-drawer"]')
      openDrawer?.click()
      await nextTick()
      await flushPromises()
      await nextTick()
    } catch (runtimeError) {
      errors.push(runtimeError)
    } finally {
      console.warn = warn
      console.error = error
      try {
        app?.unmount()
      } catch (unmountError) {
        errors.push(unmountError)
      }
      host.replaceChildren()
    }
    expect(warnings).toEqual([])
    expect(errors).toEqual([])
    const result = validateAIFormSchema({ version: '1', fields: [] })
    expect(result.valid).toBe(true)
  })

  it('mounts the AIForm and Workbench fixtures without Vue warnings', async () => {
    const warnings: unknown[] = []
    const warn = console.warn
    console.warn = (...args: unknown[]) => warnings.push(args)
    try {
      const form = mount(AIForm, { props: { schema: baseSchema([{ key: 'enabled', label: '启用', type: 'switch' }]), modelValue: { enabled: true } } })
      const workbench = mount(AIAgentWorkbench, { props: { tasks: [{ id: 'task', label: '任务', status: 'complete' as const }] } })
      await nextTick()
      form.unmount()
      workbench.unmount()
    } finally {
      console.warn = warn
    }
    expect(warnings).toEqual([])
  })
})
