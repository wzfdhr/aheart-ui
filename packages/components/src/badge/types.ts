import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type BadgeRenderable = VNodeChild
export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'
export type BadgeSize = 'default' | 'medium' | 'small'
export type BadgeOffset = [number, number]
export type BadgeSemanticPart = 'root' | 'indicator'
export type BadgeClassNames = Partial<Record<BadgeSemanticPart, string>>
export type BadgeStyles = Partial<Record<BadgeSemanticPart, StyleValue>>
export type BadgeRibbonPlacement = 'start' | 'end'
export type BadgeRibbonSemanticPart = 'root' | 'indicator' | 'content'
export type BadgeRibbonClassNames = Partial<Record<BadgeRibbonSemanticPart, string>>
export type BadgeRibbonStyles = Partial<Record<BadgeRibbonSemanticPart, StyleValue>>

const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<BadgeRenderable>

export const badgeProps = {
  count: renderableProp,
  dot: Boolean,
  status: String as PropType<BadgeStatus>,
  text: renderableProp,
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
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<BadgeClassNames>,
  styles: Object as PropType<BadgeStyles>
} as const

export const badgeRibbonProps = {
  text: renderableProp,
  color: String,
  placement: {
    type: String as PropType<BadgeRibbonPlacement>,
    default: 'end'
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<BadgeRibbonClassNames>,
  styles: Object as PropType<BadgeRibbonStyles>
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>
export type BadgeRibbonProps = ExtractPropTypes<typeof badgeRibbonProps>
