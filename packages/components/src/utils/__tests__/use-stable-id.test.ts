import { mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useStableId } from '../use-stable-id'

describe('useStableId', () => {
  it('uses an explicit id and reacts if the explicit source changes', async () => {
    const explicitId = ref('provided-id')
    const Fixture = defineComponent({
      setup() {
        const id = useStableId(explicitId)
        return () => h('span', { id: id.value }, id.value)
      }
    })
    const wrapper = mount(Fixture)
    expect(wrapper.attributes('id')).toBe('provided-id')
    explicitId.value = 'updated-id'
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('id')).toBe('updated-id')
  })

  it('generates a stable prefixed id for one component instance', () => {
    const Fixture = defineComponent({
      setup() {
        const first = useStableId(undefined, 'field')
        const second = useStableId(undefined, 'field')
        return () => h('span', { 'data-first': first.value, 'data-second': second.value })
      }
    })
    const wrapper = mount(Fixture)
    const first = wrapper.attributes('data-first')
    const second = wrapper.attributes('data-second')
    expect(first).toMatch(/^field-/)
    expect(second).toMatch(/^field-/)
    expect(first).not.toBe(second)
    expect(wrapper.attributes('data-first')).toBe(first)
  })

  it('keeps generated ids prefixed across instances', () => {
    const Fixture = defineComponent({
      setup() {
        const id = useStableId(undefined, 'control')
        return () => h('span', { id: id.value })
      }
    })
    const first = mount(Fixture)
    const second = mount(Fixture)
    expect(first.attributes('id')).toMatch(/^control-/)
    expect(second.attributes('id')).toMatch(/^control-/)
    expect(second.attributes('id')).toMatch(/^control-/)
  })

  it('generates the same safe id sequence for equivalent SSR app trees', async () => {
    const Fixture = defineComponent({
      setup() {
        const id = useStableId(undefined, 'field')
        return () => h('label', { for: id.value }, id.value)
      }
    })

    const first = await renderToString(createSSRApp(Fixture))
    const second = await renderToString(createSSRApp(Fixture))
    expect(second).toBe(first)
    expect(first).not.toContain(':')
  })
})
