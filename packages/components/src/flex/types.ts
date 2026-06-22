import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type FlexGap = AheartSize | number

export const flexProps = {
  vertical: Boolean,
  wrap: [Boolean, String] as PropType<boolean | string>,
  justify: String as PropType<FlexJustify>,
  align: String as PropType<FlexAlign>,
  gap: [String, Number] as PropType<FlexGap>
} as const

export type FlexProps = ExtractPropTypes<typeof flexProps>
