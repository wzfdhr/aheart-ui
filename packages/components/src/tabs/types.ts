import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export interface TabItem {
  key: string
  label: string
  children?: string
  disabled?: boolean
}

export type TabsType = 'line' | 'card'

export const tabsProps = {
  items: Array as PropType<TabItem[]>,
  activeKey: String,
  defaultActiveKey: String,
  type: {
    type: String as PropType<TabsType>,
    default: 'line'
  },
  size: String as PropType<AheartSize>,
  centered: Boolean
} as const

export const tabsEmits = {
  'update:activeKey': (key: string) => typeof key === 'string',
  change: (key: string) => typeof key === 'string'
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>
