import { effectScope, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { autoUpdate, computePosition } from '@floating-ui/dom'
import { useFloatingPosition } from '../use-floating-position'

vi.mock('@floating-ui/dom', () => ({
  autoUpdate: vi.fn(),
  computePosition: vi.fn(),
  flip: vi.fn(() => ({ name: 'flip' })),
  offset: vi.fn(() => ({ name: 'offset' })),
  shift: vi.fn(() => ({ name: 'shift' })),
  arrow: vi.fn(() => ({ name: 'arrow' }))
}))

const computePositionMock = vi.mocked(computePosition)
const autoUpdateMock = vi.mocked(autoUpdate)
let originalWindowWidth = 0

describe('useFloatingPosition owner-document realm', () => {
  afterEach(() => {
    vi.clearAllMocks()
    if (originalWindowWidth) Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWindowWidth })
    document.body.innerHTML = ''
  })

  it('uses the trigger owner viewport for iframe collision placement', async () => {
    const frame = document.createElement('iframe')
    document.body.appendChild(frame)
    const ownerDocument = frame.contentDocument
    expect(ownerDocument).not.toBeNull()
    if (!ownerDocument) return

    const reference = ownerDocument.createElement('button')
    const floating = ownerDocument.createElement('div')
    ownerDocument.body.append(reference, floating)
    Object.defineProperty(reference, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 20, bottom: 40, left: 250, right: 280, width: 30, height: 20 })
    })
    Object.defineProperty(floating, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100 })
    })
    const ownerWindow = ownerDocument.defaultView
    expect(ownerWindow).not.toBeNull()
    if (!ownerWindow) return
    Object.defineProperty(ownerWindow, 'innerWidth', { configurable: true, value: 300 })
    originalWindowWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })

    computePositionMock.mockResolvedValue({
      x: 0,
      y: 0,
      placement: 'bottom-start',
      strategy: 'fixed',
      middlewareData: {}
    })
    autoUpdateMock.mockImplementation((_reference, _floating, update) => {
      void update()
      return vi.fn()
    })

    const scope = effectScope()
    const result = scope.run(() => useFloatingPosition({
      reference: ref(reference),
      floating: ref(floating),
      placement: ref('bottomLeft'),
      strategy: 'fixed',
      open: ref(true)
    }))!
    await nextTick()
    await result.update()

    expect(computePositionMock).toHaveBeenCalled()
    expect(computePositionMock.mock.calls.at(-1)?.[2]).toMatchObject({ placement: 'bottom-end' })
    scope.stop()
  })
})
