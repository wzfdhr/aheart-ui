import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePointerDrag } from '../use-pointer-drag'

const createPointerEvent = (type: string, pointerId: number, init: MouseEventInit = {}) =>
  Object.assign(new MouseEvent(type, { bubbles: true, cancelable: true, ...init }), { pointerId }) as PointerEvent

const createDriver = (onMove = vi.fn(), onEnd = vi.fn()) => {
  const TestDriver = defineComponent({
    setup() {
      const { isDragging, start } = usePointerDrag({ onMove, onEnd, cursor: 'col-resize' })

      return () => h('button', { class: 'drag-handle', 'data-dragging': String(isDragging.value), onPointerdown: start })
    }
  })

  return {
    onMove,
    onEnd,
    wrapper: mount(TestDriver, { attachTo: document.body })
  }
}

afterEach(() => {
  document.querySelector('[data-aheart-drag-shield]')?.remove()
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  vi.useRealTimers()
})

describe('usePointerDrag', () => {
  it('coalesces moves but flushes the final position before pointerup and shields embedded iframes', async () => {
    vi.useFakeTimers()
    const { wrapper, onMove } = createDriver()
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 10, clientY: 20 })
    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 10, clientY: 20 })
    document.dispatchEvent(createPointerEvent('pointermove', 1, { clientX: 30, clientY: 20 }))
    document.dispatchEvent(createPointerEvent('pointermove', 1, { clientX: 40, clientY: 20 }))

    const shield = document.querySelector('[data-aheart-drag-shield]') as HTMLElement
    expect(shield).not.toBeNull()
    expect(document.querySelectorAll('[data-aheart-drag-shield]')).toHaveLength(1)
    expect(shield.style.pointerEvents).toBe('all')
    expect(iframe.getAttribute('style')).toBeNull()
    expect(document.body.style.cursor).toBe('col-resize')
    expect(onMove).not.toHaveBeenCalled()

    document.dispatchEvent(createPointerEvent('pointerup', 1, { clientX: 40, clientY: 20 }))
    await nextTick()

    expect(onMove).toHaveBeenCalledTimes(1)
    expect((onMove.mock.calls[0][0] as PointerEvent).clientX).toBe(40)
    expect(iframe.getAttribute('style')).toBeNull()
    iframe.remove()
  })

  it('only finishes for the active pointer and cleans up on cancellation and unmount', async () => {
    const { wrapper, onEnd } = createDriver()

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1 })
    document.dispatchEvent(createPointerEvent('pointerup', 2))

    expect(document.querySelector('[data-aheart-drag-shield]')).not.toBeNull()
    expect(onEnd).not.toHaveBeenCalled()

    document.dispatchEvent(createPointerEvent('pointercancel', 1))

    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
    expect(onEnd).toHaveBeenCalledWith('cancel')

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 2 })
    wrapper.unmount()

    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    expect(onEnd).toHaveBeenCalledWith('unmount')
  })

  it('does not replay a move already delivered by an animation frame on pointerup', async () => {
    vi.useFakeTimers()
    const { wrapper, onMove } = createDriver()

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1 })
    document.dispatchEvent(createPointerEvent('pointermove', 1, { clientX: 40 }))
    vi.advanceTimersByTime(20)
    document.dispatchEvent(createPointerEvent('pointerup', 1, { clientX: 40 }))

    expect(onMove).toHaveBeenCalledTimes(1)
  })

  it('cleans up the active drag when the window loses focus', async () => {
    const { wrapper, onEnd } = createDriver()

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1 })
    window.dispatchEvent(new Event('blur'))

    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    expect(onEnd).toHaveBeenCalledWith('blur')
  })
})
