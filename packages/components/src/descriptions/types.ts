import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export type DescriptionsLayout = 'horizontal' | 'vertical'
export type DescriptionItemSpan = number | 'filled'
export type DescriptionsSemanticPart =
  | 'root'
  | 'header'
  | 'title'
  | 'extra'
  | 'table'
  | 'row'
  | 'item'
  | 'label'
  | 'content'
export type DescriptionsClassNames = Partial<Record<DescriptionsSemanticPart, string>>
export type DescriptionsStyles = Partial<Record<DescriptionsSemanticPart, StyleValue>>

export interface DescriptionItem {
  key?: string | number
  label: string
  content?: string | number
  children?: string | number
  span?: DescriptionItemSpan
  className?: string
  style?: StyleValue
  labelStyle?: StyleValue
  contentStyle?: StyleValue
}

export const descriptionsProps = {
  title: String,
  extra: String,
  items: Array as PropType<DescriptionItem[]>,
  bordered: Boolean,
  column: {
    type: Number,
    default: 3
  },
  layout: {
    type: String as PropType<DescriptionsLayout>,
    default: 'horizontal'
  },
  size: String as PropType<AheartSize>,
  colon: {
    type: Boolean,
    default: true
  },
  labelStyle: [String, Object, Array] as PropType<StyleValue>,
  contentStyle: [String, Object, Array] as PropType<StyleValue>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<DescriptionsClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<DescriptionsStyles>,
    default: () => ({})
  }
} as const

export type DescriptionsProps = ExtractPropTypes<typeof descriptionsProps>
