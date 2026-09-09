export interface PickerOptionGeometry {
  value: number | string
  top: number
  height: number
}

export const nearestPickerOption = <T extends PickerOptionGeometry>(options: T[], scrollTop: number, viewportHeight: number) => {
  if (!options.length) return undefined
  const center = scrollTop + viewportHeight / 2
  return options.reduce((nearest, option) => {
    const distance = Math.abs(option.top + option.height / 2 - center)
    const nearestDistance = Math.abs(nearest.top + nearest.height / 2 - center)
    return distance < nearestDistance ? option : nearest
  }).value
}

export const measurePickerOptions = (column: HTMLElement) => Array.from(column.querySelectorAll<HTMLElement>('[role="option"]')).map((element) => {
  const rect = element.getBoundingClientRect()
  const columnRect = column.getBoundingClientRect()
  return {
    value: element.dataset.hour ?? element.dataset.minute ?? element.dataset.second ?? element.dataset.period ?? '',
    top: rect.top - columnRect.top + column.scrollTop,
    height: rect.height
  }
}).filter((option) => option.height > 0)

export const estimatePickerOptionHeight = (column: HTMLElement) => {
  const first = column.querySelector<HTMLElement>('[role="option"]')
  const height = first ? Number.parseFloat(column.ownerDocument.defaultView?.getComputedStyle(first).height ?? '') : 0
  return height > 0 ? height : 28
}
