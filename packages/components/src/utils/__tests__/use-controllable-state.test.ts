import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useControllableState } from '../use-controllable-state'

describe('useControllableState', () => {
  it('uses the default only to initialize uncontrolled state', async () => {
    const defaultValue = ref('first')
    const Fixture = defineComponent({
      setup() {
        const state = useControllableState({ defaultValue })
        return () => h('button', { onClick: () => state.setState('next') }, state.state.value)
      }
    })
    const wrapper = mount(Fixture)

    expect(wrapper.text()).toBe('first')
    defaultValue.value = 'changed default'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('first')
    await wrapper.trigger('click')
    expect(wrapper.text()).toBe('next')
  })

  it('reads controlled values and does not drift when the owner rejects an update', async () => {
    const controlled = ref('owner')
    const onChange = vi.fn()
    let exposed: ReturnType<typeof useControllableState<string>>
    const Fixture = defineComponent({
      setup() {
        exposed = useControllableState({ controlled, defaultValue: 'fallback', onChange })
        return () => h('span', exposed.state.value)
      }
    })
    const wrapper = mount(Fixture)

    expect(wrapper.text()).toBe('owner')
    exposed!.setState('requested')
    await wrapper.vm.$nextTick()
    expect(onChange).toHaveBeenCalledWith('requested')
    expect(wrapper.text()).toBe('owner')
    controlled.value = 'accepted'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('accepted')
  })

  it('treats an explicitly undefined controlled ref as controlled', () => {
    const controlled = ref<string | undefined>(undefined)
    const onChange = vi.fn()
    let exposed: ReturnType<typeof useControllableState<string | undefined>>
    const Fixture = defineComponent({
      setup() {
        exposed = useControllableState({ controlled, defaultValue: 'ignored', onChange })
        return () => h('span', exposed.state.value ?? 'empty')
      }
    })
    const wrapper = mount(Fixture)

    expect(exposed!.isControlled.value).toBe(true)
    expect(wrapper.text()).toBe('empty')
    exposed!.setState('requested')
    expect(onChange).toHaveBeenCalledWith('requested')
    expect(wrapper.text()).toBe('empty')
  })

  it('deduplicates updates with Object.is', () => {
    const state = useControllableState({ defaultValue: NaN, onChange: vi.fn() })
    expect(state.setState(NaN)).toBe(false)
    expect(state.state.value).toBeNaN()
    expect(state.setState(-0)).toBe(true)
    expect(state.setState(0)).toBe(true)
    expect(state.setState(0, { force: true })).toBe(true)
  })

  it('supports an owner taking and releasing control after mount', async () => {
    const controlled = ref<string | undefined>(undefined)
    const isControlled = ref(false)
    let exposed: ReturnType<typeof useControllableState<string>>
    const Fixture = defineComponent({
      setup() {
        exposed = useControllableState({ controlled, isControlled, defaultValue: 'local' })
        return () => h('span', exposed.state.value)
      }
    })
    const wrapper = mount(Fixture)

    exposed!.setState('local update')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('local update')

    controlled.value = 'owner'
    isControlled.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('owner')
    exposed!.setState('rejected')
    expect(wrapper.text()).toBe('owner')

    isControlled.value = false
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('owner')
  })
})
