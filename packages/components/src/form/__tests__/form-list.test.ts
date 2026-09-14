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

describe('Form.List optimization', () => {
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
    form.setFieldsErrors([{ name: ['users', 1, 'email'], errors: ['server-error'] }])
    await Promise.resolve(form.validateFields([['users', 1, 'email']]))
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

  it('records initialValue in the Form reset snapshot, renews keys, and honors list preserve on unmount', async () => {
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
    const initialKey = slot.fields[0].key
    slot.add({ id: 'later' })
    await nextTick()
    const form = wrapper.findComponent(Form).vm as unknown as { resetFields: (names: Array<string | readonly string[]>) => void }
    form.resetFields(['users'])
    await nextTick()
    expect(model.users).toEqual([{ id: 'initial' }])
    expect(slot.fields[0].key).not.toBe(initialKey)
    show.value = false
    await nextTick()
    expect(Object.prototype.hasOwnProperty.call(model, 'users')).toBe(false)
  })

  it('keeps an existing empty model array authoritative over initialValue', async () => {
    const model = reactive<{ users: Array<{ id: string }> }>({ users: [] })
    let slot!: SlotState
    mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), {
      name: 'users',
      initialValue: [{ id: 'must-not-win' }]
    }, { default: (state: SlotState) => { slot = state; return null } }) } })
    await nextTick()
    expect(model.users).toEqual([])
    expect(slot.fields).toEqual([])
  })

  it('preserves the list value on unmount by default', async () => {
    const model = reactive({ users: [{ id: 'kept' }] })
    const show = ref(true)
    const Host = defineComponent({
      setup: () => () => h(Form, { model }, () => show.value
        ? h(requireFormList(), { name: 'users' }, { default: () => null })
        : null)
    })
    mount(Host)
    await nextTick()
    show.value = false
    await nextTick()
    expect(model.users).toEqual([{ id: 'kept' }])
  })

  it('keeps a duplicate live list inert while the first owner mutates', async () => {
    const model = reactive({ users: [{ id: 'a' }] })
    const slots: SlotState[] = []
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    mount(Form, { props: { model }, slots: { default: () => [0, 1].map(index => h(requireFormList(), {
      key: index,
      name: 'users'
    }, { default: (state: SlotState) => { slots[index] = state; return null } })) } })
    await nextTick()
    slots[1].add({ id: 'blocked' })
    expect(model.users).toEqual([{ id: 'a' }])
    slots[0].add({ id: 'accepted' })
    await nextTick()
    expect(model.users.map(item => item.id)).toEqual(['a', 'accepted'])
    expect(warn.mock.calls.some(args => args.join(' ').includes('duplicate live list path'))).toBe(true)
    warn.mockRestore()
  })

  it('renders safely without a Form parent and exposes inert operations', async () => {
    let slot!: SlotState
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    mount(requireFormList(), { props: { name: 'users' }, slots: { default: (state: SlotState) => { slot = state; return h('span', 'safe') } } })
    await nextTick()
    expect(slot.fields).toEqual([])
    expect(() => slot.add({ id: 'x' })).not.toThrow()
    expect(() => slot.remove(0)).not.toThrow()
    expect(() => slot.move(0, 1)).not.toThrow()
    expect(warn.mock.calls.some(args => args.join(' ').includes('inside AForm'))).toBe(true)
    warn.mockRestore()
  })

  it('reconciles retained object identity across an external reorder without changing field keys', async () => {
    const a = { id: 'a' }
    const b = { id: 'b' }
    const model = reactive({ users: [a, b] })
    let slot!: SlotState
    const wrapper = mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
      slot = state
      return state.fields.map(field => h(FormItem, { key: field.key, name: [field.name, 'id'] }))
    } }) } })
    await nextTick()
    const [aKey, bKey] = slot.fields.map(field => field.key)
    const form = wrapper.vm as unknown as { setFieldsErrors: (fields: Array<{ name: readonly (string | number)[]; errors: string[] }>) => void; getFieldError: (name: readonly (string | number)[]) => string[] }
    form.setFieldsErrors([{ name: ['users', 1, 'id'], errors: ['belongs-to-b'] }])
    model.users = [b, a]
    await flushPromises()
    expect(slot.fields.map(field => field.key)).toEqual([bKey, aKey])
    expect(form.getFieldError(['users', 0, 'id'])).toEqual(['belongs-to-b'])
    expect(form.getFieldError(['users', 1, 'id'])).toEqual([])
  })

  it('keeps positional identity for primitive edits and preserves clear external insertion boundaries', async () => {
    const model = reactive({ values: ['a', 'b', 'c'] })
    let slot!: SlotState
    const wrapper = mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), { name: 'values' }, { default: (state: SlotState) => {
      slot = state
      return state.fields.map(field => h(FormItem, { key: field.key, name: [field.name] }))
    } }) } })
    await nextTick()
    const [aKey, bKey, cKey] = slot.fields.map(field => field.key)
    const form = wrapper.vm as unknown as { setFieldsErrors: (fields: Array<{ name: readonly (string | number)[]; errors: string[] }>) => void; getFieldError: (name: readonly (string | number)[]) => string[] }
    form.setFieldsErrors([{ name: ['values', 0], errors: ['old-a'] }])
    model.values[0] = 'edited'
    await flushPromises()
    expect(slot.fields[0].key).toBe(aKey)
    expect(form.getFieldError(['values', 0])).toEqual([])

    model.values = ['edited', 'inserted', 'b', 'c']
    await flushPromises()
    expect(slot.fields.map(field => field.key)).toEqual([aKey, expect.any(String), bKey, cKey])
  })

  it('reconciles in-place external reverse and splice mutations without recycling retained object keys', async () => {
    const a = { id: 'a' }
    const b = { id: 'b' }
    const c = { id: 'c' }
    const inserted = { id: 'x' }
    const model = reactive({ users: [a, b, c] })
    let slot!: SlotState
    const wrapper = mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
      slot = state
      return state.fields.map(field => h(FormItem, { key: field.key, name: [field.name, 'id'] }))
    } }) } })
    await nextTick()
    const [aKey, bKey, cKey] = slot.fields.map(field => field.key)
    const form = wrapper.vm as unknown as { setFieldsErrors: (fields: Array<{ name: readonly (string | number)[]; errors: string[] }>) => void; getFieldError: (name: readonly (string | number)[]) => string[] }
    form.setFieldsErrors([{ name: ['users', 0, 'id'], errors: ['a-error'] }])
    model.users.reverse()
    await flushPromises()
    expect(slot.fields.map(field => field.key)).toEqual([cKey, bKey, aKey])
    expect(form.getFieldError(['users', 2, 'id'])).toEqual(['a-error'])
    model.users.splice(1, 0, inserted)
    await flushPromises()
    expect(slot.fields.map(field => field.key)).toEqual([cKey, expect.any(String), bKey, aKey])
    model.users.splice(2, 1)
    await flushPromises()
    expect(slot.fields.map(field => field.key)).toEqual([cKey, expect.any(String), aKey])
  })

  it('flushes a pending external reorder before immediate validation reads field paths', async () => {
    const invalid = { id: 'invalid', email: '' }
    const valid = { id: 'valid', email: 'ok@example.com' }
    const model = reactive({ users: [invalid, valid] })
    const requiredRules = [{ required: true, message: 'required' }]
    const wrapper = mount(Form, { props: { model }, slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => state.fields.map(field => h(FormItem, {
      key: field.key,
      name: [field.name, 'email'],
      rules: requiredRules
    })) }) } })
    await nextTick()
    model.users.reverse()
    const form = wrapper.vm as unknown as { validate: () => unknown }
    const result = await Promise.resolve(form.validate()) as { errorFields: Array<{ name: unknown; errors: string[] }> }
    expect(result.errorFields).toEqual([{ name: ['users', 1, 'email'], errors: ['required'] }])
  })

  it('moves nested list controllers, field keys and errors with an outer logical item', async () => {
    const model = reactive({ users: [
      { id: 'a', phones: [{ number: '111' }] },
      { id: 'b', phones: [{ number: '222' }] }
    ] })
    let outer!: SlotState
    const innerByOuterKey = new Map<string, SlotState>()
    const wrapper = mount(Form, {
      props: { model },
      slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
        outer = state
        return state.fields.map(user => h(requireFormList(), { key: user.key, name: [user.name, 'phones'] }, {
          default: (phones: SlotState) => {
            innerByOuterKey.set(user.key, phones)
            return phones.fields.map(phone => h(FormItem, { key: phone.key, name: [phone.name, 'number'] }))
          }
        }))
      } }) }
    })
    await nextTick()
    const [aOuterKey, bOuterKey] = outer.fields.map(field => field.key)
    const aPhoneKey = innerByOuterKey.get(aOuterKey)!.fields[0].key
    const bPhoneKey = innerByOuterKey.get(bOuterKey)!.fields[0].key
    const form = wrapper.vm as unknown as { setFieldsErrors: (fields: Array<{ name: readonly (string | number)[]; errors: string[] }>) => void; getFieldError: (name: readonly (string | number)[]) => string[] }
    form.setFieldsErrors([{ name: ['users', 1, 'phones', 0, 'number'], errors: ['b-phone-error'] }])

    outer.move(1, 0)
    await nextTick()
    expect(model.users.map(user => user.id)).toEqual(['b', 'a'])
    expect(outer.fields.map(field => field.key)).toEqual([bOuterKey, aOuterKey])
    expect(innerByOuterKey.get(aOuterKey)!.fields[0].key).toBe(aPhoneKey)
    expect(innerByOuterKey.get(bOuterKey)!.fields[0].key).toBe(bPhoneKey)
    expect(form.getFieldError(['users', 0, 'phones', 0, 'number'])).toEqual(['b-phone-error'])
    expect(form.getFieldError(['users', 1, 'phones', 0, 'number'])).toEqual([])
  })

  it('revalidates relative dependencies and exposes list-root rule errors', async () => {
    const model = reactive({ users: [{ source: 'a', confirm: 'b' }] })
    const confirmValidator = () => model.users[0].source === model.users[0].confirm || 'mismatch'
    let slot!: SlotState
    const wrapper = mount(Form, {
      props: { model, validateTrigger: 'change' },
      slots: { default: () => h(requireFormList(), { name: 'users', rules: [{ type: 'array', min: 2, message: 'need-two' }] }, { default: (state: SlotState) => {
        slot = state
        const field = state.fields[0]
        return [
          h(FormItem, { key: `${field.key}-source`, name: [field.name, 'source'] }, () => h('input', {
            'data-testid': 'source',
            value: model.users[field.name].source,
            onInput: (event: Event) => { model.users[field.name].source = (event.target as HTMLInputElement).value }
          })),
          h(FormItem, {
            key: `${field.key}-confirm`,
            name: [field.name, 'confirm'],
            dependencies: [[field.name, 'source']],
            rules: [{ validator: confirmValidator }]
          })
        ]
      } }) }
    })
    await nextTick()
    const form = wrapper.vm as unknown as { validate: () => unknown; getFieldError: (name: string | readonly (string | number)[]) => string[]; getFieldsError: () => unknown }
    await Promise.resolve(form.validate())
    expect(form.getFieldError('users')).toEqual(['need-two'])
    expect(form.getFieldError(['users', 0, 'confirm'])).toEqual(['mismatch'])
    await wrapper.get('[data-testid="source"]').setValue('b')
    await flushPromises()
    expect(form.getFieldError(['users', 0, 'confirm'])).toEqual([])
    slot.add({ source: 'x', confirm: 'x' })
    await flushPromises()
    expect(form.getFieldError('users')).toEqual([])
    expect(slot.errors).toEqual([])
  })

  it('does not steal focus when a consumer focuses another control during a list move', async () => {
    const model = reactive({ users: [{ id: 'a' }, { id: 'b' }] })
    let slot!: SlotState
    const wrapper = mount(Form, {
      attachTo: document.body,
      props: { model },
      slots: { default: () => [
        h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
          slot = state
          return state.fields.map(field => h('input', { key: field.key, 'data-key': field.key }))
        } }),
        h('button', { type: 'button', 'data-testid': 'outside' }, 'outside')
      ] }
    })
    await nextTick()
    const movingInput = wrapper.findAll('input')[1].element as HTMLInputElement
    movingInput.focus()
    slot.move(1, 0)
    const outside = wrapper.get('[data-testid="outside"]').element as HTMLButtonElement
    outside.focus()
    await nextTick()
    expect(document.activeElement).toBe(outside)
  })

  it('delivers a same-turn change to the moved owner at its new path', async () => {
    const model = reactive({ users: [{ email: 'a' }, { email: 'b' }] })
    const requiredRules = [{ required: true, message: 'email-required' }]
    let slot!: SlotState
    const wrapper = mount(Form, {
      props: { model, validateTrigger: 'change' },
      slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
        slot = state
        return state.fields.map(field => h(FormItem, { key: field.key, name: [field.name, 'email'], rules: requiredRules }, () => h('input', {
          'data-key': field.key,
          value: model.users[field.name].email,
          onInput: (event: Event) => { model.users[field.name].email = (event.target as HTMLInputElement).value }
        })))
      } }) }
    })
    await nextTick()
    const movingKey = slot.fields[1].key
    const input = wrapper.get(`input[data-key="${movingKey}"]`).element as HTMLInputElement
    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))
    slot.move(1, 0)
    await flushPromises()
    const form = wrapper.vm as unknown as { getFieldError: (name: readonly (string | number)[]) => string[] }
    expect(model.users[0].email).toBe('')
    expect(form.getFieldError(['users', 0, 'email'])).toEqual(['email-required'])
    expect(form.getFieldError(['users', 1, 'email'])).toEqual([])
  })

  it('drops a same-turn change from a removed owner instead of validating its replacement index', async () => {
    const model = reactive({ users: [{ email: 'a' }, { email: 'b' }] })
    const requiredRules = [{ required: true, message: 'email-required' }]
    let slot!: SlotState
    const wrapper = mount(Form, {
      props: { model, validateTrigger: 'change' },
      slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
        slot = state
        return state.fields.map(field => h(FormItem, { key: field.key, name: [field.name, 'email'], rules: requiredRules }, () => h('input', {
          'data-key': field.key,
          value: model.users[field.name].email,
          onInput: (event: Event) => { model.users[field.name].email = (event.target as HTMLInputElement).value }
        })))
      } }) }
    })
    await nextTick()
    const removedKey = slot.fields[0].key
    const input = wrapper.get(`input[data-key="${removedKey}"]`).element as HTMLInputElement
    input.value = ''
    input.dispatchEvent(new Event('input', { bubbles: true }))
    slot.remove(0)
    await flushPromises()
    const form = wrapper.vm as unknown as { getFieldError: (name: readonly (string | number)[]) => string[] }
    expect(model.users).toEqual([{ email: 'b' }])
    expect(form.getFieldError(['users', 0, 'email'])).toEqual([])
  })

  it('does not let same-index external reconciliation mask a later real rules change', async () => {
    const model = reactive({ users: [{ email: '' }] })
    const rules = ref([{ required: true, message: 'old-rule' }])
    let slot!: SlotState
    const wrapper = mount(Form, {
      props: { model },
      slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
        slot = state
        const field = state.fields[0]
        return h(FormItem, { key: field.key, name: [field.name, 'email'], rules: rules.value })
      } }) }
    })
    await nextTick()
    const form = wrapper.vm as unknown as { validate: () => unknown; getFieldError: (name: readonly (string | number)[]) => string[] }
    await Promise.resolve(form.validate())
    expect(form.getFieldError(['users', 0, 'email'])).toEqual(['old-rule'])
    const key = slot.fields[0].key
    model.users = [{ email: '' }]
    await nextTick()
    expect(slot.fields[0].key).toBe(key)
    expect(form.getFieldError(['users', 0, 'email'])).toEqual(['old-rule'])
    rules.value = [{ required: true, message: 'new-rule' }]
    await nextTick()
    expect(form.getFieldError(['users', 0, 'email'])).toEqual([])
  })

  it('restores moved focus through the form ownerDocument instead of the global realm', async () => {
    const frame = document.createElement('iframe')
    document.body.appendChild(frame)
    const frameDocument = frame.contentDocument!
    const model = reactive({ users: [{ id: 'a' }, { id: 'b' }] })
    let slot!: SlotState
    const wrapper = mount(Form, {
      attachTo: frameDocument.body,
      props: { model },
      slots: { default: () => h(requireFormList(), { name: 'users' }, { default: (state: SlotState) => {
        slot = state
        return state.fields.map(field => h('input', { key: field.key, 'data-key': field.key }))
      } }) }
    })
    await nextTick()
    const movingKey = slot.fields[1].key
    const input = wrapper.get(`input[data-key="${movingKey}"]`).element as HTMLInputElement
    input.focus()
    expect(frameDocument.activeElement).toBe(input)
    slot.move(1, 0)
    await nextTick()
    expect(frameDocument.activeElement).toBe(wrapper.get(`input[data-key="${movingKey}"]`).element)
    wrapper.unmount()
    frame.remove()
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

  it('invalidates a pending whole-form submission when list identity changes', async () => {
    const releases: Array<(value: boolean) => void> = []
    const validator = () => new Promise<boolean>(resolve => { releases.push(resolve) })
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
    await wrapper.find('form').trigger('submit')
    await nextTick()
    slot.move(1, 0)
    releases.forEach(resolve => resolve(true))
    await flushPromises()
    expect(wrapper.emitted('finish')).toBeUndefined()
    expect(wrapper.emitted('finishFailed')).toBeUndefined()
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
