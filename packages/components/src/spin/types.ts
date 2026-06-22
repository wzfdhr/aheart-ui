import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type SpinPercent = number | 'auto'
export type SpinRenderable = VNodeChild
export type SpinIndicator = VNodeChild | (() => VNodeChild)
export type SpinSemanticPart = 'root' | 'section' | 'indicator' | 'dot' | 'description' | 'tip' | 'percent' | 'container'
export type SpinClassNames = Partial<Record<SpinSemanticPart, string>>
export type SpinStyles = Partial<Record<SpinSemanticPart, StyleValue>>

const renderableProp = {
  type: [String, Number, Boolean, Object, Array, Function] as PropType<SpinRenderable>,
  default: undefined
}

export const spinProps = {
  spinning: {
    type: Boolean,
    default: true
  },
  size: {
    type: String as PropType<AheartSize>,
    default: 'middle'
  },
  description: renderableProp,
  tip: renderableProp,
  delay: Number,
  indicator: [String, Number, Object, Array, Function] as PropType<SpinIndicator>,
  percent: [Number, String] as PropType<SpinPercent>,
  fullscreen: Boolean,
  wrapperClassName: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<SpinClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<SpinStyles>,
    default: () => ({})
  }
} as const

export type SpinProps = ExtractPropTypes<typeof spinProps>
