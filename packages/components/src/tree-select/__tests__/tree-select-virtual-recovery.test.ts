import { flushPromises, mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TreeSelect from '../tree-select.vue'
import { normalizeTreeSelectVirtual } from '../virtual-options'
import { usePopupViewportBudget } from '../../utils/use-popup-viewport-budget'

const cleanup: Array<() => void> = []
const flush = async () => { await nextTick(); await flushPromises(); await nextTick() }
const data = (count: number) => Array.from({ length: count }, (_, key) => ({ key, title: `Node ${key}` }))

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class RecoveryResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal('visualViewport', undefined)
})

afterEach(() => {
  cleanup.splice(0).forEach(dispose => dispose())
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

const select = (props: Record<string, unknown>) => {
  const wrapper = mount(TreeSelect, {
    attachTo: document.body,
    props: { getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!, ...props } as never
  })
  cleanup.push(() => wrapper.unmount())
  return wrapper
}

const budgetHarness = () => {
  const trigger = document.createElement('button')
  const popup = document.createElement('div')
  document.body.append(trigger, popup)
  popup.style.cssText = 'border:0px;padding:0px'
  let bottom = 300
  trigger.getBoundingClientRect = () => ({ top: bottom - 30, bottom, left: 0, right: 100, width: 100, height: 30, x: 0, y: bottom - 30, toJSON() {} })
  let value!: ReturnType<typeof usePopupViewportBudget>
  const wrapper = mount(defineComponent({
    setup() {
      value = usePopupViewportBudget({ trigger: ref(trigger), popup: ref(popup), placement: ref('bottomLeft'), open: computed(() => true), maximum: computed(() => 256) })
      return () => h('div')
    }
  }), { attachTo: document.body })
  cleanup.push(() => wrapper.unmount())
  return { value, setBottom: (next: number) => { bottom = next } }
}

describe('TreeSelect virtual independent recovery', () => {
  it('updates popup budget on same-placement owner-window resize without visualViewport', async () => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    vi.stubGlobal('innerHeight', 400)
    const budget = budgetHarness()
    await flush()
    expect(budget.value.value.treeHeight).toBe(92)
    vi.stubGlobal('innerHeight', 350)
    window.dispatchEvent(new Event('resize'))
    await flush()
    console.log('window resize budget', budget.value.value)
    expect(budget.value.value.treeHeight).toBe(42)
  })

  it('follows ancestor scroll without ResizeObserver or RAF', async () => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('innerHeight', 400)
    const budget = budgetHarness()
    await flush()
    budget.setBottom(350)
    document.body.dispatchEvent(new Event('scroll'))
    await flush()
    expect(budget.value.value.treeHeight).toBe(42)
  })

  it('cleans up safely when owner RAF exists but cancelAnimationFrame is absent', async () => {
    vi.stubGlobal('cancelAnimationFrame', undefined)
    budgetHarness()
    await flush()
    const dispose = cleanup.pop()!
    expect(dispose).not.toThrow()
  })

  it('does not turn a zero internal budget into the public 320 default', async () => {
    const warnings: unknown[] = []
    const normalized = normalizeTreeSelectVirtual({ height: 0 }, message => warnings.push(message))
    expect(normalized?.height).toBe(256)
    expect(warnings).toHaveLength(1)

    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('innerHeight', 300)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.push(callback); return frames.length })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => { frames[id - 1] = () => {} })
    const wrapper = select({
      treeData: data(100),
      virtual: true,
      autoAdjustOverflow: false,
      defaultOpen: false
    })
    const trigger = wrapper.get('[role="combobox"]').element as HTMLElement
    trigger.getBoundingClientRect = () => ({ top: 270, bottom: 300, left: 0, right: 100, width: 100, height: 30, x: 0, y: 270, toJSON() {} })
    await wrapper.get('[role="combobox"]').trigger('click')
    await flush()
    for (const callback of frames.splice(0)) callback(0)
    await flush()
    const treeStyle = wrapper.get('.aheart-tree').attributes('style') ?? ''
    console.log('zero internal budget Tree inline style', treeStyle)
    expect(treeStyle).toContain('max-block-size: 0px')
    expect(treeStyle).not.toContain('max-block-size: 320px')
  })

  it('does not steal later external focus after a rejected controlled opening is accepted', async () => {
    const wrapper = select({ treeData: [{ key: 'a', title: 'A' }], virtual: true, open: false })
    const trigger = wrapper.get('[role="combobox"]')
    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const outside = document.createElement('button')
    outside.textContent = 'outside'
    document.body.append(outside)
    cleanup.push(() => outside.remove())
    outside.focus()
    await flush()
    await wrapper.setProps({ open: true } as never)
    await flush()
    console.log('focus after externally opening following rejected request', document.activeElement?.outerHTML)
    expect(document.activeElement).toBe(outside)
  })

  it('ArrowUp from an empty search enters the last visible collapsed root', async () => {
    const wrapper = select({ treeData: [{ key: 'root', title: 'Root', children: [{ key: 'leaf', title: 'Leaf' }] }], virtual: true, defaultOpen: true, showSearch: true })
    await flush()
    const search = wrapper.get('input')
    ;(search.element as HTMLElement).focus()
    await search.trigger('keydown', { key: 'ArrowUp' })
    await flush()
    console.log('empty query ArrowUp focus', document.activeElement?.outerHTML)
    expect(document.activeElement?.getAttribute('role')).toBe('treeitem')
  })

  it('keeps Home as native text editing in default nonvirtual search', async () => {
    const wrapper = select({ treeData: [{ key: 'root', title: 'Root' }], defaultOpen: true, showSearch: true })
    await flush()
    const search = wrapper.get('input')
    ;(search.element as HTMLElement).focus()
    expect(document.activeElement).toBe(search.element)
    const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true })
    search.element.dispatchEvent(event)
    console.log('nonvirtual Home defaultPrevented', event.defaultPrevented)
    expect(event.defaultPrevented).toBe(false)
  })

  it('transfers actual focus to the tree on initial virtual keyboard opening', async () => {
    const wrapper = select({ treeData: [{ key: 'a', title: 'A' }], virtual: true })
    await flush()
    const trigger = wrapper.get('[role="combobox"]')
    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    console.log('initial keyboard focus', document.activeElement?.outerHTML)
    expect(document.activeElement?.getAttribute('role')).toBe('treeitem')
  })

  it('cancels virtual opening focus when focus moves outside before mount', async () => {
    const wrapper = select({ treeData: [{ key: 'a', title: 'A' }], virtual: true })
    await flush()
    const outside = document.createElement('button')
    document.body.append(outside)
    cleanup.push(() => outside.remove())
    const trigger = wrapper.get('[role="combobox"]')
    ;(trigger.element as HTMLElement).focus()
    trigger.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    outside.focus()
    await flush()
    console.log('premount external focus', document.activeElement?.outerHTML)
    expect(document.activeElement).toBe(outside)
  })

  it('cancels in-flight search focus when controlled close is accepted', async () => {
    const isOpen = ref(true)
    const host = mount(defineComponent({
      setup: () => () => h(TreeSelect, { treeData: data(200), virtual: true, open: isOpen.value, showSearch: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never)
    }), { attachTo: document.body })
    cleanup.push(() => host.unmount())
    await flush()
    const search = host.get('input')
    ;(search.element as HTMLElement).focus()
    search.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }))
    isOpen.value = false
    await flush()
    console.log('controlled closed focus', document.activeElement?.tagName, document.activeElement?.getAttribute('role'), host.get('[role="combobox"]').attributes('aria-expanded'))
    expect(document.activeElement?.getAttribute('role')).not.toBe('treeitem')
  })
})
