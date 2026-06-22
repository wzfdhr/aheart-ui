import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { MenuItem, MenuClickInfo } from '../menu'

export type DropdownTrigger = 'click' | 'hover' | 'contextMenu'
export type DropdownPlacement = 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight'

export interface DropdownArrowConfig {
  pointAtCenter?: boolean
}

export type DropdownArrow = boolean | DropdownArrowConfig
export type DropdownSemanticPart = 'root' | 'trigger' | 'popup' | 'menu' | 'arrow'
export type DropdownClassNames = Partial<Record<DropdownSemanticPart, string>>
export type DropdownStyles = Partial<Record<DropdownSemanticPart, StyleValue>>
export type DropdownRender = (menus: VNodeChild) => VNodeChild
export type DropdownOpenChangeSource = 'trigger' | 'menu'

export interface DropdownOpenChangeInfo {
  source: DropdownOpenChangeSource
}

export interface DropdownMenuConfig {
  items?: MenuItem[]
  selectable?: boolean
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  closeOnClick?: boolean
}

export type DropdownClickInfo = MenuClickInfo

export const dropdownProps = {
  menu: Object as PropType<DropdownMenuConfig>,
  trigger: {
    type: Array as PropType<DropdownTrigger[]>,
    default: () => ['hover']
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
  arrow: {
    type: [Boolean, Object] as PropType<DropdownArrow>,
    default: false
  },
  destroyOnHidden: Boolean,
  destroyPopupOnHide: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  overlayClassName: String,
  overlayStyle: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<DropdownClassNames>,
  styles: Object as PropType<DropdownStyles>,
  popupRender: Function as PropType<DropdownRender>,
  dropdownRender: Function as PropType<DropdownRender>
} as const

export const dropdownEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean, info?: DropdownOpenChangeInfo) =>
    typeof open === 'boolean' && (!info || info.source === 'trigger' || info.source === 'menu'),
  click: (_info: DropdownClickInfo) => true
}

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>
