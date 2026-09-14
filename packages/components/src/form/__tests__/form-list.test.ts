import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref, type Component } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Form, { FormItem } from '../index'
import * as formEntry from '../index'
import * as publicEntry from '../../index'

enableAutoUnmount(afterEach)

type Field = { key: string; fieldKey: string; name: number }
type SlotState = {
  fields: Field[]
  errors: string[]
  add: (value?: unknown, index?: number) => void
  remove: (index: number | readonly number[]) => void
  move: (from: number, to: number) => void
}

const localExports = formEntry as unknown as Record<string, unknown>
const publicExports = publicEntry as unknown as Record<string, unknown>
const FormList = localExports.FormList as Component | undefined

const requireFormList = () => {
  expect(FormList, 'FormList must be exported from the form entry').toBeTruthy()
  return FormList as Component
}

describe('Form.List optimization RED', () => {
  it('exports installable FormList and AFormList from local and public entries', () => {
    expect(localExports.FormList).toBeTruthy()
    expect(localExports.AFormList).toBe(localExports.FormList)
    expect(publicExports.FormList).toBe(localExports.FormList)
    expect(publicExports.AFormList).toBe(localExports.FormList)
    expect((localExports.FormList as { install?: unknown } | undefined)?.install).toBeTypeOf('function')
  })

  it('adds, inserts, removes unique indices and moves in one stable-key list', async () => {
    const model = reactive({ users: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] })
    let slot!: SlotState
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () => h(requireFormList(), { name: 'users' }, {
          default: (state: SlotState) => {
            slot = state
            return state.fields.map(field => h('span', { key: field.key, 'data-key': field.key }, String(model.users[field.name]?.id)))
          }
        })
      }
    })
    await nextTick()
    const initialKeys = slot.fields.map(field => field.key)
    expect(new Set(initialKeys).size).toBe(3)
    expect(slot.fields.every(field => field.key === field.fieldKey)).toBe(true)

    slot.add({ id: 'x' }, 1)
    await nextTick()
    expect(model.users.map(item => item.id)).toEqual(['a', 'x', 'b', 'c'])
    expect(slot.fields.map(field => field.key)).toEqual([initialKeys[0], expect.any(String), initialKeys[1], initialKeys[2]])

    slot.remove([3, 1, 1, 99])
    await nextTick()
    expect(model.users.map(item => item.id)).toEqual(['a', 'b'])
    expect(slot.fields.map(field => field.key)).toEqual([initialKeys[0], initialKeys[1]])

    slot.move(1, 0)
    await nextTick()
    expect(model.users.map(item => item.id)).toEqual(['b', 'a'])
    expect(slot.fields.map(field => field.key)).toEqual([initialKeys[1], initialKeys[0]])
    expect(wrapper.findAll('[data-key]').map(node => node.text())).toEqual(['b', 'a'])
  })

  it('keeps focused DOM and synchronous/server errors with the logical item on move', async () => {
    const model = reactive({ users: [{ email: 'a@example.com' }, { email: 'b@example.com' }] })
    let slot!: SlotState
    const wrapper = mount(Form, {
      attachTo: document.body,
      props: { model },
      slots: {
        default: () => h(requireFormList(), { name: 'users' }, {
          default: (state: SlotState) => {
            slot = state
            return state.fields.map(field => h(FormItem, {
              key: field.key,
              name: [field.name, 'email'],
              rules: [{ pattern: /^ok@/, message: 'rule-error' }]
            }, () => h('input', { 'data-key': field.key, value: model.users[field.name]?.email })))
          }
        })
      }
    })
    await nextTick()
    const form = wrapper.vm as unknown as {
      validateFields: (names: Array<readonly (string | number)[]>) => unknown
      setFieldsErrors: (fields: Array<{ name: readonly (string | number)[]; errors: string[] }>) => void
      getFieldError: (name: readonly (string | number)[]) => string[]
    }
    await Promise.resolve(form.validateFields([['users', 1, 'email']]))
    form.setFieldsErrors([{ name: ['users', 1, 'email'], errors: ['server-error'] }])
    const movingKey = slot.fields[1].key
    const focused = wrapper.get(`input[data-key="${movingKey}"]`)
    await focused.trigger('focus')
    ;(focused.element as HTMLInputElement).focus()
    expect(document.activeElement).toBe(focused.element)

    slot.move(1, 0)
    await nextTick()
    expect(slot.fields[0].key).toBe(movingKey)
    expect(document.activeElement).toBe(wrapper.get(`input[data-key="${movingKey}"]`).element)
    expect(form.getFieldError(['users', 0, 'email'])).toEqual(['rule-error', 'server-error'])
    expect(form.getFieldError(['users', 1, 'email'])).toEqual([])
  })

  it('resolves nested FormList and FormItem names relative to their owning list', async () => {
    const model = reactive({ users: [{ phones: [{ number: '' }] }] })
    let outer!: SlotState
    let inner!: SlotState
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () => h(requireFormList(), { name: 'users' }, {
          default: (state: SlotState) => {
            outer = state
            const user = state.fields[0]
            return h(requireFormList(), { key: user.key, name: [user.name, 'phones'] }, {
              default: (phoneState: SlotState) => {
                inner = phoneState
                const phone = phoneState.fields[0]
                return h(FormItem, { key: phone.key, name: [phone.name, 'number'], rules: [{ required: true, message: 'number-required' }] }, () => h('input'))
              }
            })
          }
        })
      }
    })
    await nextTick()
    expect(outer.fields).toHaveLength(1)
    expect(inner.fields).toHaveLength(1)
    const form = wrapper.vm as unknown as { validate: () => Promise<{ errorFields: Array<{ name: unknown }> }> | { errorFields: Array<{ name: unknown }> } }
    const result = await Promise.resolve(form.validate())
    expect(result.errorFields).toEqual([{ name: ['users', 0, 'phones', 0, 'number'], errors: ['number-required'] }])
  })

  it('records initialValue in the Form reset snapshot and honors list preserve on unmount', async () => {
    const model = reactive<Record<string, unknown>>({})
    const show = ref(true)
    let slot!: SlotState
    const Host = defineComponent({
      setup() {
        return () => h(Form, { ref: 'form', model }, {
          default: () => show.value ? h(requireFormList(), { name: 'users', initialValue: [{ id: 'initial' }], preserve: false }, {
            default: (state: SlotState) => { slot = state; return null }
          }) : null
        })
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(model.users).toEqual([{ id: 'initial' }])
    slot.add({ id: 'later' })
    await nextTick()
    const form = wrapper.findComponent(Form).vm as unknown as { resetFields: (names: Array<readonly string[]>) => void }
    form.resetFields([['users']])
    await nextTick()
    expect(model.users).toEqual([{ id: 'initial' }])
    show.value = false
    await nextTick()
    expect(Object.prototype.hasOwnProperty.call(model, 'users')).toBe(false)
  })

  it('reconciles retained object identity across an external reorder without changing field keys', async () => {
    const a = { id: 'a' }
    const b = { id: 'b' }
    const model = reactive({ users: [a, b] })
    let slot!: SlotState
    mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => { slot = state; return null } }) } })
    await nextTick()
    const [aKey, bKey] = slot.fields.map(field => field.key)
    model.users = [b, a]
    await nextTick()
    expect(slot.fields.map(field => field.key)).toEqual([bKey, aKey])
  })

  it('invalidates a pending descendant validation when its item moves', async () => {
    let release!: (value: string) => void
    const validator = vi.fn(() => new Promise<string>(resolve => { release = resolve }))
    const model = reactive({ users: [{ email: 'a' }, { email: 'b' }] })
    let slot!: SlotState
    const wrapper = mount(Form, {
      props: { model },
      slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
        slot = state
        return state.fields.map(field => h(FormItem, { key: field.key, name: [field.name, 'email'], rules: [{ validator }] }))
      } }) }
    })
    await nextTick()
    const form = wrapper.vm as unknown as { validateFields: (names: Array<readonly (string | number)[]>) => Promise<{ outOfDate?: true }>; getFieldError: (name: readonly (string | number)[]) => string[] }
    const pending = form.validateFields([['users', 1, 'email']])
    await nextTick()
    slot.move(1, 0)
    release('late-error')
    await flushPromises()
    await expect(pending).resolves.toMatchObject({ outOfDate: true })
    expect(form.getFieldError(['users', 0, 'email'])).toEqual([])
    expect(form.getFieldError(['users', 1, 'email'])).toEqual([])
  })

  it('treats a defined non-array model value and invalid indices as safe no-ops', async () => {
    const model = reactive<Record<string, unknown>>({ users: 'invalid' })
    let slot!: SlotState
    mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => { slot = state; return null } }) } })
    await nextTick()
    expect(() => slot.add({ id: 'x' })).not.toThrow()
    expect(() => slot.remove([Number.NaN, -1, 4])).not.toThrow()
    expect(() => slot.move(-1, 99)).not.toThrow()
    expect(model.users).toBe('invalid')
    expect(slot.fields).toEqual([])
  })
})
