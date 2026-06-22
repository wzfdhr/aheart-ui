import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type DescriptionRenderable = VNodeChild
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
  label: DescriptionRenderable
  content?: DescriptionRenderable
  children?: DescriptionRenderable
  span?: DescriptionItemSpan
  className?: string
  style?: StyleValue
  labelStyle?: StyleValue
  contentStyle?: StyleValue
}

const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<DescriptionRenderable>

export const descriptionsProps = {
  title: renderableProp,
  extra: renderableProp,
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
