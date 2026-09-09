import { describe, expect, it } from 'vitest'
import { measurePickerOptions, nearestPickerOption } from '../time-column-geometry'
import { getPickerAvailableBlockSize, getPickerStableAvailableBlockSize } from '../viewport'

describe('time column geometry', () => {
  it('uses actual option geometry instead of a fixed row height', () => {
    const options = [
      { value: 0, top: 0, height: 36 },
      { value: 1, top: 36, height: 44 },
      { value: 2, top: 80, height: 52 }
    ]
    expect(nearestPickerOption(options, 40, 40)).toBe(1)
    expect(nearestPickerOption(options, 110, 40)).toBe(2)
  })

  it('normalizes option rectangles to the scroll column coordinate system', () => {
    const column = {
      scrollTop: 20,
      getBoundingClientRect: () => ({ top: 100 }),
      querySelectorAll: () => [{
        dataset: { minute: '15' },
        offsetTop: 0,
        getBoundingClientRect: () => ({ top: 132, height: 40 })
      }]
    } as unknown as HTMLElement
    expect(measurePickerOptions(column)[0]).toMatchObject({ value: '15', top: 52, height: 40 })
  })

  it('calculates the available block size from the active placement', () => {
    const trigger = { top: 381, bottom: 413 }
    const viewportHeight = 720
    const bottomSize = getPickerAvailableBlockSize(trigger, viewportHeight, 'bottomLeft')
    const topSize = getPickerAvailableBlockSize(trigger, viewportHeight, 'topLeft')
    expect(bottomSize).toBe(295)
    expect(topSize).toBe(369)
    expect(trigger.bottom + 4 + bottomSize).toBeLessThanOrEqual(viewportHeight - 8)
    expect(trigger.top - 4 - topSize).toBeGreaterThanOrEqual(8)
  })

  it('uses a stable maximum when auto placement may flip', () => {
    const trigger = { top: 350, bottom: 382 }
    const first = getPickerStableAvailableBlockSize(trigger, 720)
    const second = getPickerStableAvailableBlockSize(trigger, 720)
    expect(first).toBe(338)
    expect(second).toBe(first)
  })
})
