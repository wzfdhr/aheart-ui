import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export const spinProps = {
  spinning: {
    type: Boolean,
    default: true
  },
  size: {
    type: String as PropType<AheartSize>,
    default: 'middle'
  },
  tip: String
} as const

export type SpinProps = ExtractPropTypes<typeof spinProps>
