import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type SpaceSize = AheartSize | number | [number, number]
export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceOrientation = SpaceDirection
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'
export type SpaceSeparator = VNodeChild
export type SpaceSemanticPart = 'root' | 'item' | 'separator'
export type SpaceSemanticClassNames = Partial<Record<SpaceSemanticPart, string>>
export type SpaceSemanticStyles = Partial<Record<SpaceSemanticPart, StyleValue>>
export interface SpaceSemanticInfo {
  props: {
    size?: SpaceSize
    direction?: SpaceDirection
    orientation?: SpaceOrientation
    vertical?: boolean
    align?: SpaceAlign
    wrap?: boolean
    separator?: SpaceSeparator
    split?: SpaceSeparator
  }
}
export type SpaceClassNames = SpaceSemanticClassNames | ((info: SpaceSemanticInfo) => SpaceSemanticClassNames)
export type SpaceStyles = SpaceSemanticStyles | ((info: SpaceSemanticInfo) => SpaceSemanticStyles)

export const spaceProps = {
  size: [String, Number, Array] as PropType<SpaceSize>,
  direction: {
    type: String as PropType<SpaceDirection>,
    default: 'horizontal'
  },
  orientation: String as PropType<SpaceOrientation>,
  vertical: Boolean,
  align: String as PropType<SpaceAlign>,
  wrap: Boolean,
  separator: [String, Number, Object, Array, Function] as PropType<SpaceSeparator>,
  split: [String, Number, Object, Array, Function] as PropType<SpaceSeparator>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: [Object, Function] as PropType<SpaceClassNames>,
  styles: [Object, Function] as PropType<SpaceStyles>
} as const

export type SpaceProps = ExtractPropTypes<typeof spaceProps>
