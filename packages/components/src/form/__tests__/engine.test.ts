import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Form, { FormItem } from '../index'
import { deleteNamePathValue, getNamePathValue, namePathKey, setNamePathValue } from '../name-path'
enableAutoUnmount(afterEach)

describe('Form engine D3', () => {
  it('reads and writes nested array paths without changing literal string keys', () => {
    const model = { 'user.email': 'literal', user: { email: 'nested' } }
    const wrapper = mount(Form, { props: { model }, slots: { default: () => h(FormItem, { name: ['user', 'email'] }) } })
    const form = wrapper.vm as any

    expect(form.getFieldValue(['user', 'email'])).toBe('nested')
    expect(form.getFieldValue('user.email')).toBe('literal')
    form.setFieldValue(['user', 'email'], 'next')
    expect(model.user.email).toBe('next')
    expect(model['user.email']).toBe('literal')
  })

  it('supports trigger policy and rule level trigger filtering', async () => {
    const validator = vi.fn(() => undefined)
    const model = reactive({ email: 'a' })
    const wrapper = mount(Form, {
      props: { model, validateTrigger: ['change', 'blur'] },
      slots: { default: () => h(FormItem, { name: 'email', rules: [{ validator, validateTrigger: 'blur' }, { required: true }] }, () => h('input', { onInput: (e: Event) => { model.email = (e.target as HTMLInputElement).value } })) }
    })
    await wrapper.get('input').setValue('b')
    await flushPromises()
    expect(validator).not.toHaveBeenCalled()
    await wrapper.get('input').trigger('blur')
    await flushPromises()
    expect(validator).toHaveBeenCalledTimes(1)
  })

  it('keeps server errors until the field value changes or errors are cleared', async () => {
    const model = { email: 'a@example.com' }
    const wrapper = mount(Form, { props: { model }, slots: { default: () => h(FormItem, { name: 'email' }) } })
    const form = wrapper.vm as any
    form.setFieldsErrors([{ name: 'email', errors: ['Already used'] }])
    expect(form.getFieldError('email')).toEqual(['Already used'])
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('finishFailed')).toBeTruthy()
    form.clearValidate(['email'])
    expect(form.getFieldError('email')).toEqual([])
  })

  it('ignores a late async result after a model mutation without starting validation', async () => {
    let release!: (result: boolean) => void
    const validator = vi.fn(() => new Promise<boolean>((resolve) => { release = resolve }))
    const model = { email: 'first@example.com' }
    const wrapper = mount(Form, {
      props: { model, rules: { email: [{ validator }] } },
      slots: { default: () => h(FormItem, { name: 'email' }) }
    })
    const form = wrapper.vm as any
    void form.validate()
    model.email = 'second@example.com'
    await wrapper.vm.$nextTick()
    release(false)
    await flushPromises()
    expect(form.getFieldError('email')).toEqual([])
  })

  it('rejects empty and unsafe paths', () => {
    expect(() => namePathKey([])).toThrow()
    expect(() => namePathKey(['__proto__'])).toThrow()
    expect(() => namePathKey([NaN])).toThrow()
  })

  it('keeps string and array keys collision free', () => {
    expect(namePathKey('a.b')).not.toBe(namePathKey(['a.b']))
    expect(namePathKey(['a|s:b'])).not.toBe(namePathKey(['a', 'b']))
  })

  it('reads only own properties', () => {
    const proto = { inherited: 'nope' }
    const model = Object.create(proto) as Record<string, unknown>
    expect(getNamePathValue(model, 'inherited')).toBeUndefined()
    expect(getNamePathValue(model, ['inherited'])).toBeUndefined()
  })

  it('does not prune an empty parent after nested delete', () => {
    const model = { address: { city: 'Paris' } }
    deleteNamePathValue(model, ['address', 'city'])
    expect(model).toEqual({ address: {} })
  })

  it('creates arrays for numeric path segments', () => {
    const model: Record<string, unknown> = {}
    setNamePathValue(model, ['rows', 0, 'name'], 'Ada')
    expect(model).toEqual({ rows: [{ name: 'Ada' }] })
  })

  it('clears an external server error explicitly', () => {
    const wrapper = mount(Form, { props: { model: { email: 'a' } }, slots: { default: () => h(FormItem, { name: 'email' }) } })
    const form = wrapper.vm as any
    form.setFieldsErrors([{ name: 'email', errors: ['server'] }])
    form.setFieldsErrors([{ name: 'email', errors: [] }])
    expect(form.getFieldError('email')).toEqual([])
  })

  it('preserves a value when a field unregisters by default', async () => {
    const Host = { data: () => ({ show: true, model: { email: 'a' } }), render(this: any) { return h(Form, { model: this.model }, () => this.show ? h(FormItem, { name: 'email' }) : null) } }
    const wrapper = mount(Host)
    ;(wrapper.vm as any).show = false
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).model.email).toBe('a')
  })

  it('removes a value when preserve is false', async () => {
    const Host = { data: () => ({ show: true, model: { email: 'a' } }), render(this: any) { return h(Form, { model: this.model }, () => this.show ? h(FormItem, { name: 'email', preserve: false }) : null) } }
    const wrapper = mount(Host)
    ;(wrapper.vm as any).show = false
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).model.email).toBeUndefined()
  })

  it('revalidates unregistered dependencies even with blur or disabled automatic triggers', async () => {
    const model = reactive({ source: { password: 'old' }, confirm: 'old' })
    const validator = vi.fn((_r, value, values) => value === values.source.password || 'mismatch')
    const wrapper = mount(Form, { props: { model, validateTrigger: 'blur' }, slots: {
      default: () => h(FormItem, { name: 'confirm', dependencies: [['source', 'password']], rules: [{ validator }], validateTrigger: false })
    } })
    model.source = { password: 'new' }
    await flushPromises()
    expect(validator).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.getFieldError('confirm')).toEqual(['mismatch'])
  })

  it('deduplicates two changed dependencies and does not loop through a dependency cycle', async () => {
    const model = reactive({ a: 0, b: 0, c: 0 })
    const validator = vi.fn()
    const wrapper = mount(Form, { props: { model }, slots: { default: () => [
      h(FormItem, { name: 'a', dependencies: ['c'] }),
      h(FormItem, { name: 'c', dependencies: ['a', 'b'], rules: [{ validator }] })
    ] } })
    model.a = 1
    model.b = 1
    await flushPromises()
    expect(validator).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.getFieldError('c')).toEqual([])
  })

  it('does not overwrite server errors or submit when an older validator finishes', async () => {
    let release!: (value: boolean) => void
    const wrapper = mount(Form, { props: { model: { email: 'a' }, rules: { email: [{ validator: () => new Promise<boolean>((resolve) => { release = resolve }) }] } } })
    await wrapper.get('form').trigger('submit')
    wrapper.vm.setFieldsErrors([{ name: 'email', errors: ['server error'] }])
    release(true)
    await flushPromises()
    expect(wrapper.vm.getFieldError('email')).toEqual(['server error'])
    expect(wrapper.emitted('finish')).toBeUndefined()
  })

  it('clears rules-only pending validation and marks its result out of date', async () => {
    let release!: (value: boolean) => void
    const wrapper = mount(Form, { props: { model: { email: 'a' }, rules: { email: [{ validator: () => new Promise<boolean>((resolve) => { release = resolve }) }] } } })
    const result = wrapper.vm.validate()
    wrapper.vm.clearValidate()
    release(false)
    expect((await result).outOfDate).toBe(true)
    expect(wrapper.vm.getFieldError('email')).toEqual([])
  })

  it('ignores rules-only async results after the entire form unmounts', async () => {
    let release!: (value: boolean) => void
    const wrapper = mount(Form, { props: { model: { email: 'a' }, rules: { email: [{ validator: () => new Promise<boolean>((resolve) => { release = resolve }) }] } } })
    const result = wrapper.vm.validate()
    wrapper.unmount()
    release(false)
    expect((await result).outOfDate).toBe(true)
    expect(wrapper.emitted('validate')).toBeUndefined()
  })

  it('retired rules-only fields stay excluded until they mount again', async () => {
    const model = reactive({ show: true })
    const wrapper = mount(Form, { props: { model: { field: '' }, rules: { field: [{ required: true }] } }, slots: { default: () => model.show ? h(FormItem, { name: 'field' }) : null } })
    model.show = false
    await nextTick()
    expect((await wrapper.vm.validate()).errorFields).toEqual([])
    model.show = true
    await nextTick()
    expect((await wrapper.vm.validate()).errorFields).toHaveLength(1)
  })

  it('keeps rejected control updates from invoking a change validator', async () => {
    const validator = vi.fn()
    const wrapper = mount(Form, { props: { model: { email: 'accepted' }, validateTrigger: 'change' }, slots: {
      default: () => h(FormItem, { name: 'email', rules: [{ validator }] }, () => h('input', { value: 'accepted' }))
    } })
    await wrapper.get('input').setValue('rejected')
    await flushPromises()
    expect(validator).not.toHaveBeenCalled()
  })

  it('unregisters the original path when a reactive name array is mutated in place', async () => {
    const path = reactive(['user', 'email'])
    const model = reactive({ user: { email: 'old', phone: 'new' } })
    const wrapper = mount(Form, { props: { model, validateTrigger: false }, slots: {
      default: () => h(FormItem, { name: path, preserve: false, validateTrigger: false, rules: [{ required: true }] })
    } })
    path[1] = 'phone'
    await nextTick()
    expect(model.user).toEqual({ phone: 'new' })
    expect(wrapper.vm.getFieldsError()).toEqual([{ name: ['user', 'phone'], errors: [] }])
    expect((await wrapper.vm.validate()).errorFields).toEqual([])
  })
})
