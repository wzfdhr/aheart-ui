import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'

export type MenuMode = 'vertical' | 'horizontal' | 'inline'
export type MenuTheme = 'light' | 'dark'
export type MenuItemType = 'item' | 'group' | 'divider'

export interface MenuItem {
  key: string
  label?: string
  icon?: VNodeChild
  disabled?: boolean
  danger?: boolean
  type?: MenuItemType
  children?: MenuItem[]
}

export interface MenuClickInfo {
  key: string
  keyPath: string[]
  item: MenuItem
}

export interface MenuSelectInfo extends MenuClickInfo {
  selectedKeys: string[]
}

export const menuProps = {
  items: Array as PropType<MenuItem[]>,
  mode: {
    type: String as PropType<MenuMode>,
    default: 'vertical'
  },
  theme: {
    type: String as PropType<MenuTheme>,
    default: 'light'
  },
  selectedKeys: Array as PropType<string[]>,
  defaultSelectedKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  openKeys: Array as PropType<string[]>,
  defaultOpenKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  multiple: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  inlineCollapsed: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  }
} as const

export const menuEmits = {
  click: (_info: MenuClickInfo) => true,
  select: (_info: MenuSelectInfo) => true,
  deselect: (_info: MenuSelectInfo) => true,
  openChange: (keys: string[]) => Array.isArray(keys),
  'update:selectedKeys': (keys: string[]) => Array.isArray(keys),
  'update:openKeys': (keys: string[]) => Array.isArray(keys)
}

export type MenuProps = ExtractPropTypes<typeof menuProps>
