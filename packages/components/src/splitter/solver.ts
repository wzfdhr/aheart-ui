import type { ResizeAdjacentPanelsOptions, ResolveSplitterSizesOptions, SplitterPanelConstraint, SplitterSize } from './types'

const resolveValue = (value: number | `${number}%` | undefined, containerSize: number, fallback: number) => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value.endsWith('%')) {
    return (Number(value.slice(0, -1)) / 100) * containerSize
  }

  return fallback
}

const getBounds = (panel: SplitterPanelConstraint | undefined, containerSize?: number) => ({
  min: Math.max(0, resolveValue(panel?.min, containerSize ?? 0, 0)),
  max: Math.max(0, resolveValue(panel?.max, containerSize ?? 0, Number.POSITIVE_INFINITY))
})

const redistribute = (sizes: number[], panels: SplitterPanelConstraint[], containerSize: number) => {
  const nextSizes = [...sizes]

  for (let pass = 0; pass < nextSizes.length * 2; pass += 1) {
    let changed = false

    for (let index = 0; index < nextSizes.length; index += 1) {
      const bounds = getBounds(panels[index], containerSize)

      if (nextSizes[index] < bounds.min) {
        let remaining = bounds.min - nextSizes[index]
        nextSizes[index] = bounds.min

        for (let donor = 0; donor < nextSizes.length && remaining > 0; donor += 1) {
          if (donor === index) continue
          const donorBounds = getBounds(panels[donor], containerSize)
          const transferable = Math.max(0, nextSizes[donor] - donorBounds.min)
          const transfer = Math.min(transferable, remaining)
          nextSizes[donor] -= transfer
          remaining -= transfer
        }

        changed = true
      }

      if (nextSizes[index] > bounds.max) {
        let remaining = nextSizes[index] - bounds.max
        nextSizes[index] = bounds.max

        for (let receiver = 0; receiver < nextSizes.length && remaining > 0; receiver += 1) {
          if (receiver === index) continue
          const receiverBounds = getBounds(panels[receiver], containerSize)
          const capacity = Math.max(0, receiverBounds.max - nextSizes[receiver])
          const transfer = Math.min(capacity, remaining)
          nextSizes[receiver] += transfer
          remaining -= transfer
        }

        changed = true
      }
    }

    if (!changed) break
  }

  return nextSizes.map((size) => Math.max(0, size))
}

export const resolveSplitterSizes = ({ containerSize, sizes, panels }: ResolveSplitterSizesOptions) => {
  const normalizedContainerSize = Math.max(0, containerSize)
  const autoCount = sizes.filter((size) => size === 'auto').length
  const fixedSize = sizes.reduce<number>(
    (total, size) => total + (size === 'auto' ? 0 : resolveValue(size, normalizedContainerSize, 0)),
    0
  )
  const autoSize = autoCount === 0 ? 0 : Math.max(0, normalizedContainerSize - fixedSize) / autoCount
  const resolved = sizes.map((size) => (size === 'auto' ? autoSize : resolveValue(size, normalizedContainerSize, 0)))

  return redistribute(resolved, panels, normalizedContainerSize)
}

export const resizeAdjacentPanels = ({ sizes, panels, handleIndex, delta }: ResizeAdjacentPanelsOptions) => {
  const rightIndex = handleIndex + 1

  if (handleIndex < 0 || rightIndex >= sizes.length || !Number.isFinite(delta)) {
    return [...sizes]
  }

  const leftBounds = getBounds(panels[handleIndex])
  const rightBounds = getBounds(panels[rightIndex])
  const lowerDelta = Math.max(leftBounds.min - sizes[handleIndex], sizes[rightIndex] - rightBounds.max)
  const upperDelta = Math.min(leftBounds.max - sizes[handleIndex], sizes[rightIndex] - rightBounds.min)
  const appliedDelta = Math.min(Math.max(delta, lowerDelta), upperDelta)
  const nextSizes = [...sizes]

  nextSizes[handleIndex] += appliedDelta
  nextSizes[rightIndex] -= appliedDelta
  return nextSizes
}
