import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
export type TitleLevel = 1 | 2 | 3 | 4 | 5
export type TypographySemanticPart = 'root'
export type TypographySemanticClassNames = Partial<Record<TypographySemanticPart, string>>
export type TypographySemanticStyles = Partial<Record<TypographySemanticPart, StyleValue>>

export interface TypographySemanticInfo {
  props: Record<string, unknown>
}

export type TypographyClassNames =
  | TypographySemanticClassNames
  | ((info: TypographySemanticInfo) => TypographySemanticClassNames)
export type TypographyStyles = TypographySemanticStyles | ((info: TypographySemanticInfo) => TypographySemanticStyles)

export interface TypographyEllipsisConfig {
  rows?: number
}

export type TypographyEllipsis = boolean | TypographyEllipsisConfig
export type TypographyCopyableIcon = VNodeChild | [VNodeChild, VNodeChild]
export type TypographyCopyableTooltip = false | [VNodeChild, VNodeChild]

export interface TypographyCopyableConfig {
  text?: string | (() => string | Promise<string>)
  icon?: TypographyCopyableIcon
  tooltips?: TypographyCopyableTooltip
  format?: 'text/plain' | 'text/html'
  tabIndex?: number
  onCopy?: (event: MouseEvent) => void
}

export type TypographyCopyable = boolean | TypographyCopyableConfig
export type TypographyActionPlacement = 'start' | 'end'

export interface TypographyActionsConfig {
  placement?: TypographyActionPlacement
}

const copyableProp = [Boolean, Object] as PropType<TypographyCopyable>
const actionsProp = Object as PropType<TypographyActionsConfig>

const rootHookProps = {
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: [Object, Function] as PropType<TypographyClassNames>,
  styles: [Object, Function] as PropType<TypographyStyles>
} as const

export const typographyProps = {
  ...rootHookProps
} as const

export const titleProps = {
  ...rootHookProps,
  level: {
    type: Number as PropType<TitleLevel>,
    default: 1,
    validator: (value: number) => value >= 1 && value <= 5
  },
  type: String as PropType<TypographyType>,
  disabled: Boolean,
  mark: Boolean,
  copyable: copyableProp,
  actions: actionsProp
} as const

export const textProps = {
  ...rootHookProps,
  type: String as PropType<TypographyType>,
  strong: Boolean,
  italic: Boolean,
  code: Boolean,
  keyboard: Boolean,
  delete: Boolean,
  underline: Boolean,
  mark: Boolean,
  disabled: Boolean,
  copyable: copyableProp,
  actions: actionsProp
} as const

export const paragraphProps = {
  ...rootHookProps,
  type: String as PropType<TypographyType>,
  strong: Boolean,
  italic: Boolean,
  ellipsis: [Boolean, Object] as PropType<TypographyEllipsis>,
  mark: Boolean,
  disabled: Boolean,
  copyable: copyableProp,
  actions: actionsProp
} as const

export const linkProps = {
  ...rootHookProps,
  href: String,
  target: String,
  disabled: Boolean,
  underline: Boolean
} as const

export type TypographyProps = ExtractPropTypes<typeof typographyProps>
export type TitleProps = ExtractPropTypes<typeof titleProps>
export type TextProps = ExtractPropTypes<typeof textProps>
export type ParagraphProps = ExtractPropTypes<typeof paragraphProps>
export type LinkProps = ExtractPropTypes<typeof linkProps>
