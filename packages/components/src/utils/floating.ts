import type { CSSProperties } from 'vue'

export const floatingPlacements = [
  'top',
  'left',
  'right',
  'bottom',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'leftTop',
  'leftBottom',
  'rightTop',
  'rightBottom'
] as const

export const floatingTriggers = ['hover', 'focus', 'click', 'contextMenu'] as const

export type FloatingPlacement = (typeof floatingPlacements)[number]
export type FloatingTrigger = (typeof floatingTriggers)[number]

export type FloatingTriggerProp = FloatingTrigger | FloatingTrigger[]

export const isFloatingPlacement = (value: string) => floatingPlacements.includes(value as FloatingPlacement)

export const isFloatingTrigger = (value: string) => floatingTriggers.includes(value as FloatingTrigger)

export const isFloatingTriggerProp = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'string' && isFloatingTrigger(item))
  }

  return typeof value === 'string' && isFloatingTrigger(value)
}

export const normalizeFloatingTriggers = (trigger: FloatingTriggerProp) =>
  Array.isArray(trigger) ? trigger : [trigger]

export const getFloatingPopupStyle = (color?: string, zIndex?: number): CSSProperties => ({
  ...(color ? { background: color } : {}),
  ...(zIndex !== undefined ? { zIndex } : {})
})
