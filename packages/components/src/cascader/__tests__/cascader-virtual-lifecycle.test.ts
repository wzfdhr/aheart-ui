import { flushPromises, mount } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'

type Option = { value: string; label: string; children?: Option[]; isLeaf?: boolean }
type OwnerObserver = { callback: ResizeObserverCallback; disconnect: ReturnType<typeof vi.fn>; observed: Element[] }

const wrappers: Array<ReturnType<typeof mount>> = []
const ownerObservers: OwnerObserver[] = []
const options = (count: number): Option[] => Array.from({ length: count }, (_, index) => ({ value: `item-${index}`, label: `Item ${index}` }))
const track = <T extends ReturnType<typeof mount>>(wrapper: T) => {
  const unmount = wrapper.unmount.bind(wrapper)
  let mounted = true
  wrapper.unmount = (() => { if (mounted) { mounted = false; unmount() } }) as T['unmount']
  wrappers.push(wrapper)
  return wrapper
}
const settle = async () => { await nextTick(); await flushPromises(); await nextTick() }
const mountCascader = (props: Record<string, unknown>, extra: Record<string, unknown> = {}) => track(mount(Cascader, {
  attachTo: document.body,
  ...extra,
  props: { getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!, ...props } as never
}))

beforeEach(() => {
  ownerObservers.length = 0
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  ownerObservers.length = 0
})

describe('Cascader virtual lifecycle, SSR and owner realm', () => {
  it('renders a deterministic bounded SSR window and hydrates without mismatch diagnostics', async () => {
    const props = { options: options(1000), defaultOpen: true, virtual: true }
    const first = await renderToString(createSSRApp({ render: () => h(Cascader, props) }))
    const second = await renderToString(createSSRApp({ render: () => h(Cascader, props) }))
    expect(first).toBe(second)
    expect((first.match(/aheart-cascader__option/g) ?? []).length).toBeLessThanOrEqual(24)

    const host = document.createElement('div')
    host.innerHTML = first
    document.body.appendChild(host)
    const warnings: unknown[] = []
    const errors: unknown[] = []
    const warn = vi.spyOn(console, 'warn').mockImplementation((...args) => warnings.push(args))
    const error = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args))
    const app = createSSRApp(Cascader, props)
    app.config.warnHandler = (message) => warnings.push(message)
    try {
      app.mount(host, true)
      await settle()
      expect(warnings.filter(value => String(value).includes('hydration'))).toHaveLength(0)
      expect(errors.filter(value => String(value).includes('hydration'))).toHaveLength(0)
      expect(host.querySelectorAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    } finally {
      app.unmount()
      warn.mockRestore()
      error.mockRestore()
      host.remove()
    }
  })

  it('uses the mounted iframe owner realm for observation and disconnects it before frame removal', async () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    class IframeResizeObserver {
      readonly disconnect = vi.fn()
      constructor(readonly callback: ResizeObserverCallback) { ownerObservers.push({ callback, disconnect: this.disconnect, observed: [] }) }
      observe(element: Element) { ownerObservers.at(-1)?.observed.push(element) }
      unobserve() {}
    }
    const previousResizeObserver = Object.getOwnPropertyDescriptor(ownerWindow, 'ResizeObserver')
    const previousRaf = Object.getOwnPropertyDescriptor(ownerWindow, 'requestAnimationFrame')
    const previousCancel = Object.getOwnPropertyDescriptor(ownerWindow, 'cancelAnimationFrame')
    Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, value: IframeResizeObserver })
    Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => ownerWindow.setTimeout(() => callback(ownerWindow.performance.now()), 0) })
    Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, value: (id: number) => ownerWindow.clearTimeout(id) })
    let wrapper: ReturnType<typeof mount> | undefined
    try {
      wrapper = track(mount(Cascader, { attachTo: ownerDocument.body, props: { options: options(1000), defaultOpen: true, virtual: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never }))
      await settle()
      expect(ownerObservers.some(observer => observer.observed.length > 0)).toBe(true)
      wrapper.unmount()
      expect(ownerObservers.length).toBeGreaterThan(0)
      expect(ownerObservers.every(observer => observer.disconnect.mock.calls.length > 0)).toBe(true)
    } finally {
      if (wrapper) wrapper.unmount()
      if (previousResizeObserver) Object.defineProperty(ownerWindow, 'ResizeObserver', previousResizeObserver)
      else Reflect.deleteProperty(ownerWindow, 'ResizeObserver')
      if (previousRaf) Object.defineProperty(ownerWindow, 'requestAnimationFrame', previousRaf)
      else Reflect.deleteProperty(ownerWindow, 'requestAnimationFrame')
      if (previousCancel) Object.defineProperty(ownerWindow, 'cancelAnimationFrame', previousCancel)
      else Reflect.deleteProperty(ownerWindow, 'cancelAnimationFrame')
      iframe.remove()
    }
  })

  it('keeps virtual windows bounded after options replacement and does not retain stale rows', async () => {
    const wrapper = mountCascader({ options: options(1000), defaultOpen: true, virtual: true })
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    await wrapper.setProps({ options: options(1000).map((item, index) => ({ ...item, value: `replacement-${index}`, label: `Replacement ${index}` })) } as never)
    await settle()
    expect(wrapper.find('[data-cascader-value="item-0"]').exists()).toBe(false)
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
  })

  it('cancels pending virtual lazy work on close, disable, replacement and unmount without stale children', async () => {
    let resolveChildren!: (children: Option[]) => void
    let signal!: AbortSignal
    const loadData = (_option: Option, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<Option[]>(resolve => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({
      options: [{ value: 'lazy', label: 'Lazy', isLeaf: false }, ...options(1000)],
      defaultOpen: true,
      virtual: true,
      loadData
    })
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').length).toBeLessThanOrEqual(24)
    await wrapper.get('[data-cascader-value="lazy"]').trigger('click')
    await wrapper.setProps({ open: false } as never)
    expect(signal?.aborted).toBe(true)
    resolveChildren([{ value: 'stale', label: 'Stale' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="stale"]').exists()).toBe(false)
    await wrapper.setProps({ open: true, disabled: false } as never)
    await wrapper.get('[data-cascader-value="lazy"]').trigger('click')
    const beforeDisable = signal
    await wrapper.setProps({ disabled: true } as never)
    expect(beforeDisable?.aborted).toBe(true)
    wrapper.unmount()
  })

  it('keeps one stable roving option after blur and restores trigger focus on close', async () => {
    const wrapper = mountCascader({ options: options(1000), defaultOpen: true, virtual: true })
    await settle()
    const first = wrapper.find('.aheart-cascader__option')
    first.element.focus()
    expect(first.attributes('tabindex')).toBe('0')
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()
    await settle()
    expect(wrapper.findAll('.aheart-cascader__option').filter(option => option.attributes('tabindex') === '0')).toHaveLength(1)
    await wrapper.get('.aheart-cascader__trigger').trigger('keydown', { key: 'Escape' })
    await settle()
    expect(document.activeElement).toBe(wrapper.get('.aheart-cascader__trigger').element)
    outside.remove()
  })
})
