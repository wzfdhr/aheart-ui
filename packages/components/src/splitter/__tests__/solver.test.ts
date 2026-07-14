import { describe, expect, it } from 'vitest'
import { resizeAdjacentPanels, resolveSplitterSizes } from '../solver'

describe('Splitter size solver', () => {
  it('resolves pixel, percentage, and auto sizes against the container', () => {
    expect(
      resolveSplitterSizes({
        containerSize: 1000,
        sizes: [200, '25%', 'auto'],
        panels: [{}, {}, {}]
      })
    ).toEqual([200, 250, 550])
  })

  it('redistributes space when a panel minimum constrains the initial allocation', () => {
    expect(
      resolveSplitterSizes({
        containerSize: 400,
        sizes: [200, 'auto'],
        panels: [{}, { min: 300 }]
      })
    ).toEqual([100, 300])
  })

  it('clamps a drag to adjacent panel minimum and maximum limits', () => {
    expect(
      resizeAdjacentPanels({
        sizes: [200, 300, 500],
        panels: [{ max: 230 }, { min: 250 }, {}],
        handleIndex: 0,
        delta: 80
      })
    ).toEqual([230, 270, 500])
  })

  it('keeps every panel stable when a requested drag has no legal adjacent movement', () => {
    expect(
      resizeAdjacentPanels({
        sizes: [200, 300],
        panels: [{ min: 200 }, { min: 300 }],
        handleIndex: 0,
        delta: 40
      })
    ).toEqual([200, 300])
  })
})
