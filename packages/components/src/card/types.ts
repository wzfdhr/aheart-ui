import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export const cardVariants = ['outlined', 'borderless'] as const
export const cardTypes = ['inner'] as const

export type CardVariant = (typeof cardVariants)[number]
export type CardType = (typeof cardTypes)[number]
export type CardAction = string | number
export type CardSemanticPart = 'root' | 'header' | 'title' | 'extra' | 'cover' | 'body' | 'actions'
export type CardClassNames = Partial<Record<CardSemanticPart, string>>
export type CardStyles = Partial<Record<CardSemanticPart, StyleValue>>

export const cardProps = {
  title: String,
  extra: String,
  bordered: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String as PropType<CardVariant>,
    validator: (value: string) => cardVariants.includes(value as CardVariant)
  },
  type: {
    type: String as PropType<CardType>,
    validator: (value: string) => cardTypes.includes(value as CardType)
  },
  hoverable: Boolean,
  loading: Boolean,
  size: String as PropType<AheartSize>,
  actions: Array as PropType<CardAction[]>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  headStyle: [String, Object, Array] as PropType<StyleValue>,
  bodyStyle: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<CardClassNames>,
  styles: Object as PropType<CardStyles>
} as const

export type CardProps = ExtractPropTypes<typeof cardProps>
