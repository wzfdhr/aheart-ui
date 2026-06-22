import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type DividerType = 'horizontal' | 'vertical'
export type DividerOrientation = 'left' | 'center' | 'right'
export type DividerTitlePlacement = DividerOrientation | 'start' | 'end'
export type DividerVariant = 'solid' | 'dashed' | 'dotted'
export type DividerSize = 'small' | 'middle' | 'large'
export type DividerSemanticPart = 'root' | 'line' | 'text'
export type DividerClassNames = Partial<Record<DividerSemanticPart, string>>
export type DividerStyles = Partial<Record<DividerSemanticPart, StyleValue>>

export const dividerProps = {
  type: {
    type: String as PropType<DividerType>,
    default: 'horizontal'
  },
  vertical: Boolean,
  orientation: {
    type: String as PropType<DividerOrientation>,
    default: 'center'
  },
  titlePlacement: String as PropType<DividerTitlePlacement>,
  orientationMargin: [Number, String] as PropType<number | string>,
  variant: {
    type: String as PropType<DividerVariant>,
    default: 'solid'
  },
  size: {
    type: String as PropType<DividerSize>,
    default: 'middle'
  },
  dashed: Boolean,
  plain: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<DividerClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<DividerStyles>,
    default: () => ({})
  }
} as const

export type DividerProps = ExtractPropTypes<typeof dividerProps>
