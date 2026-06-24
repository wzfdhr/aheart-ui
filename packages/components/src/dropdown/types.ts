import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import {
  buttonSizes,
  buttonTypes,
  nativeButtonTypes,
  type ButtonIcon,
  type ButtonLoading,
  type ButtonSize,
  type ButtonType,
  type NativeButtonType
} from '../button/types'
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
export type DropdownGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
export type DropdownOpenChangeSource = 'trigger' | 'menu'
export type DropdownButtonRender = (buttons: VNodeChild[]) => VNodeChild[]

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
  getPopupContainer: Function as PropType<DropdownGetPopupContainer>,
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

export const dropdownButtonProps = {
  menu: dropdownProps.menu,
  trigger: dropdownProps.trigger,
  placement: {
    type: String as PropType<DropdownPlacement>,
    default: 'bottomRight'
  },
  getPopupContainer: dropdownProps.getPopupContainer,
  open: dropdownProps.open,
  defaultOpen: dropdownProps.defaultOpen,
  disabled: dropdownProps.disabled,
  arrow: dropdownProps.arrow,
  destroyOnHidden: dropdownProps.destroyOnHidden,
  destroyPopupOnHide: dropdownProps.destroyPopupOnHide,
  overlayClassName: dropdownProps.overlayClassName,
  overlayStyle: dropdownProps.overlayStyle,
  classNames: dropdownProps.classNames,
  styles: dropdownProps.styles,
  popupRender: dropdownProps.popupRender,
  dropdownRender: dropdownProps.dropdownRender,
  type: {
    type: String as PropType<ButtonType>,
    default: 'default',
    validator: (value: string) => buttonTypes.includes(value as ButtonType)
  },
  size: {
    type: String as PropType<ButtonSize>,
    validator: (value: string) => buttonSizes.includes(value as ButtonSize)
  },
  nativeType: {
    type: String as PropType<NativeButtonType>,
    default: 'button',
    validator: (value: string) => nativeButtonTypes.includes(value as NativeButtonType)
  },
  htmlType: {
    type: String as PropType<NativeButtonType>,
    validator: (value: string) => nativeButtonTypes.includes(value as NativeButtonType)
  },
  danger: Boolean,
  loading: {
    type: [Boolean, Object] as PropType<ButtonLoading>,
    default: false
  },
  icon: {
    type: null as unknown as PropType<ButtonIcon>,
    default: undefined
  },
  href: String,
  target: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  buttonsRender: Function as PropType<DropdownButtonRender>
} as const

export const dropdownButtonEmits = {
  'update:open': dropdownEmits['update:open'],
  openChange: dropdownEmits.openChange,
  click: (event: MouseEvent) => event instanceof MouseEvent,
  menuClick: (_info: DropdownClickInfo) => true
}

export type DropdownButtonProps = ExtractPropTypes<typeof dropdownButtonProps>
