import { effectScope, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift
} from '@floating-ui/dom'
import {
  fromFloatingUIPlacement,
  getFloatingArrowStaticSide,
  toFloatingUIPlacement,
  useFloatingPosition
} from '../use-floating-position'

vi.mock('@floating-ui/dom', () => ({
  arrow: vi.fn(() => ({ name: 'arrow' })),
  autoUpdate: vi.fn(),
  computePosition: vi.fn(),
  flip: vi.fn(() => ({ name: 'flip' })),
  offset: vi.fn(() => ({ name: 'offset' })),
  shift: vi.fn(() => ({ name: 'shift' }))
}))

const computePositionMock = vi.mocked(computePosition)
const autoUpdateMock = vi.mocked(autoUpdate)

const flushPosition = async () => {
  await nextTick()
  await Promise.resolve()
  await Promise.resolve()
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('floating placement mapping', () => {
  it.each([
    ['top', 'top'],
    ['topLeft', 'top-start'],
    ['topRight', 'top-end'],
    ['bottom', 'bottom'],
    ['bottomLeft', 'bottom-start'],
    ['bottomRight', 'bottom-end'],
    ['left', 'left'],
    ['leftTop', 'left-start'],
    ['leftBottom', 'left-end'],
    ['right', 'right'],
    ['rightTop', 'right-start'],
    ['rightBottom', 'right-end']
  ] as const)('maps %s to %s and back', (aheartPlacement, floatingPlacement) => {
    expect(toFloatingUIPlacement(aheartPlacement)).toBe(floatingPlacement)
    expect(fromFloatingUIPlacement(floatingPlacement)).toBe(aheartPlacement)
  })

  it('derives the static arrow side from the resolved placement', () => {
    expect(getFloatingArrowStaticSide('topLeft')).toBe('bottom')
    expect(getFloatingArrowStaticSide('rightBottom')).toBe('left')
  })
})

describe('useFloatingPosition', () => {
  it('publishes flipped coordinates and arrow geometry', async () => {
    const reference = ref(document.createElement('button'))
    const floating = ref(document.createElement('div'))
    const arrowElement = ref(document.createElement('span'))
    const cleanup = vi.fn()

    computePositionMock.mockResolvedValue({
      x: 24,
      y: 48,
      placement: 'bottom-end',
      strategy: 'fixed',
      middlewareData: { arrow: { x: 16, y: 2 } }
    })
    autoUpdateMock.mockImplementation((_reference, _floating, update) => {
      void update()
      return cleanup
    })

    const scope = effectScope()
    const result = scope.run(() =>
      useFloatingPosition({
        reference,
        floating,
        arrow: arrowElement,
        placement: ref('topLeft'),
        strategy: 'fixed',
        open: ref(true)
      })
    )!

    await flushPosition()

    expect(result.placement.value).toBe('bottomRight')
    expect(result.popupStyle.value).toMatchObject({ position: 'fixed', left: '24px', top: '48px' })
    expect(result.arrowStaticSide.value).toBe('top')
    expect(result.arrowStyle.value).toMatchObject({ left: '16px', top: '-4px' })
    expect(offset).toHaveBeenCalledWith(8)
    expect(flip).toHaveBeenCalled()
    expect(shift).toHaveBeenCalled()

    scope.stop()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('supports manual update and disables overflow middleware when requested', async () => {
    const reference = ref(document.createElement('button'))
    const floating = ref(document.createElement('div'))

    computePositionMock.mockResolvedValue({
      x: 5,
      y: 9,
      placement: 'left',
      strategy: 'absolute',
      middlewareData: {}
    })
    autoUpdateMock.mockImplementation(() => vi.fn())

    const scope = effectScope()
    const result = scope.run(() =>
      useFloatingPosition({
        reference,
        floating,
        placement: ref('left'),
        open: ref(true),
        autoAdjustOverflow: ref(false),
        shift: ref(false)
      })
    )!

    await result.update()

    expect(result.popupStyle.value).toMatchObject({ position: 'absolute', left: '5px', top: '9px' })
    expect(flip).not.toHaveBeenCalled()
    expect(shift).not.toHaveBeenCalled()
    scope.stop()
  })

  it('applies align offsets to the computed viewport coordinates', async () => {
    const reference = ref(document.createElement('button'))
    const floating = ref(document.createElement('div'))

    computePositionMock.mockResolvedValue({
      x: 18,
      y: 16,
      placement: 'bottom-start',
      strategy: 'absolute',
      middlewareData: {}
    })
    autoUpdateMock.mockImplementation(() => vi.fn())

    const scope = effectScope()
    const result = scope.run(() =>
      useFloatingPosition({
        reference,
        floating,
        alignOffset: ref([8, -4] as const)
      })
    )!

    await result.update()

    const middleware = computePositionMock.mock.calls.at(-1)?.[2]?.middleware ?? []
    const alignOffsetMiddleware = middleware.find((item) => item.name === 'aheartAlignOffset')
    const aligned = await alignOffsetMiddleware?.fn({ x: 10, y: 20 } as never)

    expect(aligned).toMatchObject({ x: 18, y: 16 })
    scope.stop()
  })

  it('keeps identical positioning results referentially stable', async () => {
    const reference = ref(document.createElement('button'))
    const floating = ref(document.createElement('div'))
    computePositionMock.mockResolvedValue({
      x: 12,
      y: 24,
      placement: 'bottom-start',
      strategy: 'absolute',
      middlewareData: {}
    })
    autoUpdateMock.mockImplementation(() => vi.fn())

    const scope = effectScope()
    const result = scope.run(() => useFloatingPosition({ reference, floating }))!
    await result.update()
    const firstStyle = result.popupStyle.value
    await result.update()

    expect(result.popupStyle.value).toBe(firstStyle)
    scope.stop()
  })

  it('is inert while hidden or before refs are mounted', async () => {
    const open = ref(false)
    const reference = ref<HTMLElement | null>(null)
    const floating = ref<HTMLElement | null>(null)
    const scope = effectScope()
    const result = scope.run(() => useFloatingPosition({ reference, floating, open }))!

    await expect(result.update()).resolves.toBeUndefined()
    await flushPosition()
    expect(computePositionMock).not.toHaveBeenCalled()
    expect(autoUpdateMock).not.toHaveBeenCalled()

    scope.stop()
  })

  it('cleans up automatic updates when visibility changes', async () => {
    const open = ref(true)
    const reference = ref(document.createElement('button'))
    const floating = ref(document.createElement('div'))
    const cleanup = vi.fn()

    computePositionMock.mockResolvedValue({
      x: 0,
      y: 0,
      placement: 'bottom-start',
      strategy: 'absolute',
      middlewareData: {}
    })
    autoUpdateMock.mockImplementation(() => cleanup)

    const scope = effectScope()
    scope.run(() => useFloatingPosition({ reference, floating, open }))
    await nextTick()

    open.value = false
    await nextTick()

    expect(cleanup).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('recomputes arrow geometry when a reactive arrow size changes', async () => {
    const reference = ref(document.createElement('button'))
    const floating = ref(document.createElement('div'))
    const arrowElement = ref(document.createElement('span'))
    const arrowSize = ref(8)

    computePositionMock.mockResolvedValue({
      x: 0,
      y: 0,
      placement: 'bottom-start',
      strategy: 'absolute',
      middlewareData: { arrow: { x: 6 } }
    })
    autoUpdateMock.mockImplementation((_reference, _floating, update) => {
      void update()
      return vi.fn()
    })

    const scope = effectScope()
    const result = scope.run(() =>
      useFloatingPosition({ reference, floating, arrow: arrowElement, arrowSize })
    )!
    await flushPosition()
    expect(result.arrowStyle.value.top).toBe('-4px')

    arrowSize.value = 12
    await flushPosition()
    expect(result.arrowStyle.value.top).toBe('-6px')
    scope.stop()
  })
})
