import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export const cardProps = {
  title: String,
  extra: String,
  bordered: {
    type: Boolean,
    default: true
  },
  hoverable: Boolean,
  loading: Boolean,
  size: String as PropType<AheartSize>
} as const

export type CardProps = ExtractPropTypes<typeof cardProps>
