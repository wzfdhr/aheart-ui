import { createSSRApp, h, nextTick, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
import Form from '../index'
import * as formEntry from '../index'

const FormList = (formEntry as unknown as Record<string, unknown>).FormList as Component | undefined

const root = (model: { users: Array<{ id: string }> }) => ({
  render: () => h(Form, { model }, {
    default: () => h(FormList as Component, { name: 'users' }, {
      default: ({ fields }: { fields: Array<{ key: string; name: number }> }) => fields.map(field => h('span', { key: field.key, 'data-field-key': field.key }, `${field.name}:${model.users[field.name].id}`))
    })
  })
})

const render = () => {
  expect(FormList, 'FormList must exist before SSR can be validated').toBeTruthy()
  const model = { users: [{ id: 'a' }, { id: 'b' }] }
  return renderToString(createSSRApp(root(model)))
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

  it('hydrates the deterministic first tree without mismatch diagnostics', async () => {
    expect(FormList).toBeTruthy()
    const serverModel = { users: [{ id: 'a' }, { id: 'b' }] }
    const html = await renderToString(createSSRApp(root(serverModel)))
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    const diagnostics: string[] = []
    const warn = vi.spyOn(console, 'warn').mockImplementation((...args) => diagnostics.push(args.join(' ')))
    const error = vi.spyOn(console, 'error').mockImplementation((...args) => diagnostics.push(args.join(' ')))
    const clientModel = { users: [{ id: 'a' }, { id: 'b' }] }
    const app = createSSRApp(root(clientModel))
    app.mount(container)
    await nextTick()
    expect(container.querySelectorAll('[data-field-key]')).toHaveLength(2)
    expect(container.textContent).toContain('0:a')
    expect(container.textContent).toContain('1:b')
    expect(diagnostics.filter(message => /hydration|mismatch/i.test(message))).toEqual([])
    app.unmount()
    warn.mockRestore()
    error.mockRestore()
    container.remove()
  })
})
