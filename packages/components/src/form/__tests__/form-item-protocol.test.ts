import { enableAutoUnmount, mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FormItem from '../form-item.vue'

enableAutoUnmount(afterEach)

describe('FormItem control relationships', () => {
  it('connects a native control to its label, help and current error without losing user descriptions', async () => {
    const onInput = vi.fn()
    const wrapper = mount(FormItem, {
      props: { label: 'Email', help: 'Work email', extra: 'Private' },
      slots: { default: () => h('input', { id: 'email-control', 'aria-describedby': 'user-help', onInput }) }
    })
    await nextTick()
    const input = wrapper.get('input')
    expect(wrapper.get('label').attributes('for')).toBe('email-control')
    expect(input.attributes('aria-labelledby')).toBe(wrapper.get('label').attributes('id'))
    expect(input.attributes('aria-describedby')?.split(' ')).toEqual([
      'user-help', wrapper.get('.aheart-form-item__help').attributes('id'), wrapper.get('.aheart-form-item__extra').attributes('id')
    ])
    await input.trigger('input')
    expect(onInput).toHaveBeenCalledTimes(1)
    const helpId = wrapper.get('.aheart-form-item__help').attributes('id')
    await wrapper.setProps({ validateStatus: 'error', help: 'Already registered' })
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).not.toContain(helpId)
    expect(wrapper.get('[role="alert"]').text()).toBe('Already registered')
    await wrapper.setProps({ validateStatus: undefined, help: undefined, extra: undefined })
    expect(input.attributes('aria-describedby')).toBe('user-help')
    expect(input.attributes('aria-invalid')).toBeUndefined()
  })

  it('does not reference help or labels that noStyle omits', () => {
    const wrapper = mount(FormItem, {
      props: { noStyle: true, label: 'Label', help: 'Help', validateStatus: 'error' },
      slots: { default: () => h('input') }
    })
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.get('input').attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('generates distinct relationships for two fields in the same SSR app', async () => {
    const App = { render: () => h('div', [
      h(FormItem, { label: 'First', help: 'Help' }, () => h('input')),
      h(FormItem, { label: 'Second', help: 'Help' }, () => h('input'))
    ]) }
    const first = await renderToString(createSSRApp(App))
    const second = await renderToString(createSSRApp(App))
    expect(first).toBe(second)
    const ids = [...first.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    expect(new Set(ids).size).toBe(ids.length)
    for (const match of first.matchAll(/aria-describedby="([^"]+)"/g)) expect(ids).toContain(match[1])
  })

  it('links explicit native ids in the server-rendered label', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(FormItem, { label: 'Email' }, () => h('input', { id: 'server-email' })) }))
    expect(html).toContain('for="server-email"')
  })
})
