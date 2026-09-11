import { flushPromises, mount, enableAutoUnmount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Cascader from '../cascader.vue'

enableAutoUnmount(afterEach)

const cleanups: Array<() => void> = []
const options = [{ value: 'root', label: 'Root', children: [{ value: 'child', label: 'Child' }] }]
const settle = async () => { await nextTick(); await flushPromises(); await nextTick() }
const rect = (left: number, width: number) => ({ x: left, y: 0, left, right: left + width, top: 0, bottom: 64, width, height: 64, toJSON() {} }) as DOMRect

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.unstubAllGlobals()
})

async function setupRevealRace() {
  vi.stubGlobal('ResizeObserver', class { observe() {}; disconnect() {}; unobserve() {} })
  vi.stubGlobal('requestAnimationFrame', () => 1)
  vi.stubGlobal('cancelAnimationFrame', () => {})
  const wrapper = mount(Cascader, {
    attachTo: document.body,
    props: { options, virtual: true, open: true, showSearch: true, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! }
  })
  cleanups.push(() => wrapper.unmount())
  await settle()

  const setupState = (wrapper.vm as unknown as { $: { setupState: { floatingPosition: { update: () => Promise<void> } } } }).$.setupState
  let finish!: () => void
  const update = vi.spyOn(setupState.floatingPosition, 'update').mockImplementation(() => new Promise<void>(resolve => { finish = resolve }))
  cleanups.push(() => update.mockRestore())

  const root = wrapper.get('[data-cascader-value="root"]').element as HTMLElement
  root.click()
  await nextTick()
  await nextTick()
  expect(update).toHaveBeenCalledTimes(1)

  const columns = wrapper.get('.aheart-cascader__columns').element as HTMLElement
  let scroll = 180
  const writes: number[] = []
  Object.defineProperty(columns, 'clientWidth', { configurable: true, get: () => 180 })
  Object.defineProperty(columns, 'scrollWidth', { configurable: true, get: () => 360 })
  Object.defineProperty(columns, 'scrollLeft', { configurable: true, get: () => scroll, set: (value: number) => { scroll = value; writes.push(value) } })
  columns.getBoundingClientRect = () => rect(0, 180)
  Array.from(columns.children).forEach((column, index) => { (column as HTMLElement).getBoundingClientRect = () => rect(index * 180 - scroll, 180) })
  root.getBoundingClientRect = () => rect(-scroll, 180)
  return { wrapper, root, columns, writes, finish: () => finish(), scroll: () => scroll }
}

describe('Cascader stale reveal ownership', () => {
  it('does not let an older pending reposition hide the parent after ArrowLeft restores focus', async () => {
    const race = await setupRevealRace()
    race.columns.style.scrollBehavior = 'smooth'
    const child = race.wrapper.get('[data-cascader-value="child"]').element as HTMLElement
    child.focus()
    child.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    await settle()
    expect(document.activeElement).toBe(race.root)
    expect(race.scroll()).toBe(0)
    expect(race.columns.style.scrollBehavior).toBe('smooth')
    const rootBeforeRelease = race.root.getBoundingClientRect()
    const columnBeforeRelease = race.columns.children[0].getBoundingClientRect()
    expect(rootBeforeRelease.left).toBeGreaterThanOrEqual(columnBeforeRelease.left)
    expect(rootBeforeRelease.right).toBeLessThanOrEqual(columnBeforeRelease.right)

    race.finish()
    await settle()
    console.log('late reveal after Left', { focused: document.activeElement?.getAttribute('data-cascader-value'), scroll: race.scroll(), writes: race.writes, behavior: race.columns.style.scrollBehavior })
    expect(race.scroll()).toBe(0)
    const rootAfterRelease = race.root.getBoundingClientRect()
    const columnAfterRelease = race.columns.children[0].getBoundingClientRect()
    expect(rootAfterRelease.left).toBeGreaterThanOrEqual(columnAfterRelease.left)
    expect(rootAfterRelease.right).toBeLessThanOrEqual(columnAfterRelease.right)
  })

  it.each(['close', 'options', 'search'])('cancels an older pending reveal on %s', async action => {
    const race = await setupRevealRace()
    if (action === 'close') await race.wrapper.setProps({ open: false })
    else if (action === 'options') await race.wrapper.setProps({ options: [{ value: 'replacement', label: 'Replacement' }] })
    else await race.wrapper.get('input').setValue('no-match')
    const before = race.writes.length
    race.finish()
    await settle()
    console.log('pending reveal cancellation', { action, writes: race.writes.slice(before) })
    expect(race.writes.length).toBe(before)
  })
})
