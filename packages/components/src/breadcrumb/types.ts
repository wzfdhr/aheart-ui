import type { ExtractPropTypes, PropType } from 'vue'

export interface BreadcrumbItem {
  title: string
  href?: string
  disabled?: boolean
}

export const breadcrumbProps = {
  items: Array as PropType<BreadcrumbItem[]>,
  separator: {
    type: String,
    default: '/'
  }
} as const

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
