import { createSSRApp, h, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import Form from '../index'
import * as formEntry from '../index'

const FormList = (formEntry as unknown as Record<string, unknown>).FormList as Component | undefined

const render = () => {
  expect(FormList, 'FormList must exist before SSR can be validated').toBeTruthy()
  const model = { users: [{ id: 'a' }, { id: 'b' }] }
  return renderToString(createSSRApp({
    render: () => h(Form, { model }, {
      default: () => h(FormList as Component, { name: 'users' }, {
        default: ({ fields }: { fields: Array<{ key: string; name: number }> }) => fields.map(field => h('span', { key: field.key, 'data-field-key': field.key }, `${field.name}:${model.users[field.name].id}`))
      })
    })
  }))
}

describe('Form.List SSR RED', () => {
  it('renders deterministic initial keys and item order', async () => {
    const first = await render()
    const second = await render()
    expect(first).toBe(second)
    expect(first).toContain('0:a')
    expect(first).toContain('1:b')
    expect(first).toContain('data-field-key')
  })
})
