import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export const buttonTypes = ['default', 'primary', 'dashed', 'link', 'text', 'success', 'warning', 'danger'] as const
export const buttonSizes = ['large', 'normal', 'middle', 'small', 'mini'] as const
export const nativeButtonTypes = ['button', 'submit', 'reset'] as const
export const buttonShapes = ['default', 'circle', 'round'] as const
export const buttonIconPlacements = ['start', 'end'] as const
export const buttonColors = [
  'default',
  'primary',
  'danger',
  'success',
  'warning',
  'info',
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold'
] as const
export const buttonVariants = ['outlined', 'dashed', 'solid', 'filled', 'text', 'link'] as const

export type ButtonType = (typeof buttonTypes)[number]
export type ButtonSize = (typeof buttonSizes)[number]
export type NativeButtonType = (typeof nativeButtonTypes)[number]
export type ButtonShape = (typeof buttonShapes)[number]
export type ButtonIconPlacement = (typeof buttonIconPlacements)[number]
export type ButtonColor = (typeof buttonColors)[number]
export type ButtonVariant = (typeof buttonVariants)[number]
export type ButtonLoading = boolean | { delay?: number; icon?: VNodeChild }
export type ButtonSemanticPart = 'root' | 'icon' | 'content'
export type ButtonClassNames = Partial<Record<ButtonSemanticPart, string>>
export type ButtonStyles = Partial<Record<ButtonSemanticPart, StyleValue>>

export const buttonProps = {
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
  disabled: {
    type: Boolean,
    default: undefined
  },
  loading: {
    type: [Boolean, Object] as PropType<ButtonLoading>,
    default: false
  },
  block: Boolean,
  round: Boolean,
  danger: Boolean,
  ghost: Boolean,
  shape: {
    type: String as PropType<ButtonShape>,
    default: 'default',
    validator: (value: string) => buttonShapes.includes(value as ButtonShape)
  },
  icon: String,
  iconPlacement: {
    type: String as PropType<ButtonIconPlacement>,
    validator: (value: string) => buttonIconPlacements.includes(value as ButtonIconPlacement)
  },
  iconPosition: {
    type: String as PropType<ButtonIconPlacement>,
    validator: (value: string) => buttonIconPlacements.includes(value as ButtonIconPlacement)
  },
  color: {
    type: String as PropType<ButtonColor>,
    validator: (value: string) => buttonColors.includes(value as ButtonColor)
  },
  variant: {
    type: String as PropType<ButtonVariant>,
    validator: (value: string) => buttonVariants.includes(value as ButtonVariant)
  },
  href: String,
  target: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<ButtonClassNames>,
  styles: Object as PropType<ButtonStyles>
} as const

export const buttonEmits = {
  click: (event: MouseEvent) => event instanceof MouseEvent
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
