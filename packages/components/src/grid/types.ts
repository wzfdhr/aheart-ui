import type { ExtractPropTypes, PropType } from 'vue'

export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type GridGutter = number | Partial<Record<GridBreakpoint, number>>
export type GridResponsiveGutter = Partial<Record<GridBreakpoint, number>>
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch'

export interface ColSpanConfig {
  span?: number
  offset?: number
  order?: number
  pull?: number
  push?: number
  flex?: string | number
}

export type ColResponsiveConfig = number | ColSpanConfig

export const rowProps = {
  gutter: {
    type: [Number, Array, Object] as PropType<number | [GridGutter, GridGutter] | GridResponsiveGutter>,
    default: 0
  },
  justify: String as PropType<RowJustify>,
  align: String as PropType<RowAlign>,
  wrap: {
    type: Boolean,
    default: true
  }
} as const

export const colProps = {
  span: Number,
  offset: Number,
  order: Number,
  pull: Number,
  push: Number,
  flex: [String, Number] as PropType<string | number>,
  xs: [Number, Object] as PropType<ColResponsiveConfig>,
  sm: [Number, Object] as PropType<ColResponsiveConfig>,
  md: [Number, Object] as PropType<ColResponsiveConfig>,
  lg: [Number, Object] as PropType<ColResponsiveConfig>,
  xl: [Number, Object] as PropType<ColResponsiveConfig>,
  xxl: [Number, Object] as PropType<ColResponsiveConfig>
} as const

export type RowProps = ExtractPropTypes<typeof rowProps>
export type ColProps = ExtractPropTypes<typeof colProps>
