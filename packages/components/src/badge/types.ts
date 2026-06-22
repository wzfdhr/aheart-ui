import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'
export type BadgeSize = 'default' | 'medium' | 'small'
export type BadgeOffset = [number, number]
export type BadgeSemanticPart = 'root' | 'indicator'
export type BadgeClassNames = Partial<Record<BadgeSemanticPart, string>>
export type BadgeStyles = Partial<Record<BadgeSemanticPart, StyleValue>>

export const badgeProps = {
  count: [Number, String] as PropType<number | string>,
  dot: Boolean,
  status: String as PropType<BadgeStatus>,
  text: String,
  overflowCount: {
    type: Number,
    default: 99
  },
  showZero: Boolean,
  size: {
    type: String as PropType<BadgeSize>,
    default: 'medium'
  },
  offset: Array as unknown as PropType<BadgeOffset>,
  color: String,
  title: String,
  classNames: Object as PropType<BadgeClassNames>,
  styles: Object as PropType<BadgeStyles>
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>
