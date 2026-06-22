import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type DescriptionsLayout = 'horizontal' | 'vertical'

export interface DescriptionItem {
  label: string
  content: string
  span?: number
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
  size: String as PropType<AheartSize>
} as const

export type DescriptionsProps = ExtractPropTypes<typeof descriptionsProps>
