import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type SpaceSize = AheartSize | number | [number, number]
export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'

export const spaceProps = {
  size: [String, Number, Array] as PropType<SpaceSize>,
  direction: {
    type: String as PropType<SpaceDirection>,
    default: 'horizontal'
  },
  align: String as PropType<SpaceAlign>,
  wrap: Boolean
} as const

export type SpaceProps = ExtractPropTypes<typeof spaceProps>
