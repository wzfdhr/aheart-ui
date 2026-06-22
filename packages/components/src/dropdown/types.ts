import type { ExtractPropTypes, PropType } from 'vue'
import type { MenuItem, MenuClickInfo } from '../menu'

export type DropdownTrigger = 'click' | 'hover'
export type DropdownPlacement = 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight'

export interface DropdownMenuConfig {
  items?: MenuItem[]
  selectable?: boolean
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
}

export type DropdownClickInfo = MenuClickInfo

export const dropdownProps = {
  menu: Object as PropType<DropdownMenuConfig>,
  trigger: {
    type: Array as PropType<DropdownTrigger[]>,
    default: () => ['click']
  },
  placement: {
    type: String as PropType<DropdownPlacement>,
    default: 'bottomLeft'
  },
  open: {
    type: Boolean,
    default: undefined
  },
  defaultOpen: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  arrow: Boolean
} as const

export const dropdownEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean',
  click: (_info: DropdownClickInfo) => true
}

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>
