import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export type FlexJustify =
  | 'normal'
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | string
export type FlexAlign = 'normal' | 'start' | 'end' | 'center' | 'baseline' | 'stretch' | 'flex-start' | 'flex-end' | string
export type FlexGap = AheartSize | 'medium' | number | string
export type FlexWrap = boolean | 'nowrap' | 'wrap' | 'wrap-reverse' | 'reverse' | string
export type FlexOrientation = 'horizontal' | 'vertical'

export const flexProps = {
  vertical: Boolean,
  orientation: String as PropType<FlexOrientation>,
  wrap: [Boolean, String] as PropType<FlexWrap>,
  justify: String as PropType<FlexJustify>,
  align: String as PropType<FlexAlign>,
  gap: [String, Number] as PropType<FlexGap>,
  flex: [String, Number] as PropType<string | number>,
  component: {
    type: [String, Object, Function] as PropType<string | object | Function>,
    default: 'div'
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>
} as const

export type FlexProps = ExtractPropTypes<typeof flexProps>
