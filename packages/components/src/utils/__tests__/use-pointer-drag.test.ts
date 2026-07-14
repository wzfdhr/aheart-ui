import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePointerDrag } from '../use-pointer-drag'

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
  it('coalesces pointer moves in an animation frame and shields embedded iframes', async () => {
    vi.useFakeTimers()
    const { wrapper, onMove } = createDriver()

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 10, clientY: 20 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 30, clientY: 20 }))
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 40, clientY: 20 }))

    expect(document.querySelector('[data-aheart-drag-shield]')).not.toBeNull()
    expect(document.body.style.cursor).toBe('col-resize')
    expect(onMove).not.toHaveBeenCalled()

    vi.advanceTimersByTime(20)
    await nextTick()

    expect(onMove).toHaveBeenCalledTimes(1)
    expect((onMove.mock.calls[0][0] as PointerEvent).clientX).toBe(40)
  })

  it('cleans up listeners, shield, and document styles on cancellation and unmount', async () => {
    const { wrapper, onEnd } = createDriver()

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 1 })
    document.dispatchEvent(new Event('pointercancel'))

    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
    expect(onEnd).toHaveBeenCalledWith('cancel')

    await wrapper.find('.drag-handle').trigger('pointerdown', { button: 0, pointerId: 2 })
    wrapper.unmount()

    expect(document.querySelector('[data-aheart-drag-shield]')).toBeNull()
    expect(onEnd).toHaveBeenCalledWith('unmount')
  })
})
