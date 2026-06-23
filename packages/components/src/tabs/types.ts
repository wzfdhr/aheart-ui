import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type TabsRenderable = VNodeChild

export interface TabItem {
  key: string
  label: TabsRenderable
  icon?: TabsRenderable
  children?: TabsRenderable
  disabled?: boolean
}

export type TabsType = 'line' | 'card'
export type TabsPlacement = 'top' | 'bottom' | 'start' | 'end'
export type TabsPosition = 'top' | 'bottom' | 'left' | 'right'
export type TabsIndicatorAlign = 'start' | 'center' | 'end'

export interface TabsExtraContentConfig {
  left?: TabsRenderable
  right?: TabsRenderable
}

export interface TabsIndicatorConfig {
  size?: number
  align?: TabsIndicatorAlign
}

export interface TabsAnimatedConfig {
  inkBar?: boolean
  tabPane?: boolean
}

export type TabsExtraContent = TabsRenderable | TabsExtraContentConfig
export type TabsAnimated = boolean | TabsAnimatedConfig
export type TabsSemanticPart =
  | 'root'
  | 'nav'
  | 'navList'
  | 'tab'
  | 'activeTab'
  | 'tabIcon'
  | 'tabLabel'
  | 'panel'
  | 'extra'
  | 'extraLeft'
  | 'extraRight'
export type TabsClassNames = Partial<Record<TabsSemanticPart, string>>
export type TabsStyles = Partial<Record<TabsSemanticPart, StyleValue>>

const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<TabsRenderable>

export const tabsProps = {
  items: Array as PropType<TabItem[]>,
  activeKey: String,
  defaultActiveKey: String,
  type: {
    type: String as PropType<TabsType>,
    default: 'line'
  },
  size: String as PropType<AheartSize>,
  centered: Boolean,
  tabPlacement: String as PropType<TabsPlacement>,
  tabPosition: String as PropType<TabsPosition>,
  tabBarExtraContent: renderableProp as PropType<TabsExtraContent>,
  tabBarGutter: Number,
  tabBarStyle: [String, Object, Array] as PropType<StyleValue>,
  indicator: Object as PropType<TabsIndicatorConfig>,
  animated: {
    type: [Boolean, Object] as PropType<TabsAnimated>,
    default: false
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<TabsClassNames>,
  styles: Object as PropType<TabsStyles>
} as const

export const tabsEmits = {
  'update:activeKey': (key: string) => typeof key === 'string',
  change: (key: string) => typeof key === 'string',
  tabClick: (key: string, event: MouseEvent) => typeof key === 'string' && event instanceof MouseEvent
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>
