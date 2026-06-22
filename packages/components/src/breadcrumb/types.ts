import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type BreadcrumbParams = Record<string, string | number>
export type BreadcrumbSemanticPart = 'root' | 'list' | 'item' | 'link' | 'text' | 'separator'
export type BreadcrumbClassNames = Partial<Record<BreadcrumbSemanticPart, string>>
export type BreadcrumbStyles = Partial<Record<BreadcrumbSemanticPart, StyleValue>>

export interface BreadcrumbItem {
  key?: string | number
  title: VNodeChild
  href?: string
  path?: string
  className?: string
  style?: StyleValue
  disabled?: boolean
  onClick?: (event: MouseEvent, item: BreadcrumbItem, index: number) => void
}

export type BreadcrumbItemRender = (
  item: BreadcrumbItem,
  params: BreadcrumbParams,
  items: BreadcrumbItem[],
  paths: string[],
  index: number
) => VNodeChild

export const breadcrumbProps = {
  items: Array as PropType<BreadcrumbItem[]>,
  params: {
    type: Object as PropType<BreadcrumbParams>,
    default: () => ({})
  },
  separator: {
    type: [String, Number, Boolean, Object, Array] as PropType<VNodeChild>,
    default: '/'
  },
  itemRender: Function as PropType<BreadcrumbItemRender>,
  className: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<BreadcrumbClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<BreadcrumbStyles>,
    default: () => ({})
  }
} as const

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
