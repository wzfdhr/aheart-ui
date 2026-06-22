import type { ExtractPropTypes, PropType } from 'vue'

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'

export const badgeProps = {
  count: [Number, String] as PropType<number | string>,
  dot: Boolean,
  status: String as PropType<BadgeStatus>,
  text: String,
  overflowCount: {
    type: Number,
    default: 99
  }
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>
