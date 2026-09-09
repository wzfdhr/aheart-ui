export interface PickerViewportRect {
  top: number
  bottom: number
}

export const getPickerAvailableBlockSize = (
  trigger: PickerViewportRect,
  viewportHeight: number,
  placement: string,
  padding = 12
) => {
  const primary = placement.startsWith('top')
    ? trigger.top - padding
    : viewportHeight - trigger.bottom - padding
  return Math.max(0, Math.floor(primary))
}

export const getPickerStableAvailableBlockSize = (
  trigger: PickerViewportRect,
  viewportHeight: number,
  padding = 12
) => Math.max(
  0,
  Math.floor(Math.max(trigger.top - padding, viewportHeight - trigger.bottom - padding))
)
