import type { ExtractPropTypes, PropType } from 'vue'

export const buttonTypes = ['default', 'primary', 'dashed', 'link', 'text', 'success', 'warning', 'danger'] as const
export const buttonSizes = ['large', 'normal', 'middle', 'small', 'mini'] as const
export const nativeButtonTypes = ['button', 'submit', 'reset'] as const
export const buttonShapes = ['default', 'circle', 'round'] as const

export type ButtonType = (typeof buttonTypes)[number]
export type ButtonSize = (typeof buttonSizes)[number]
export type NativeButtonType = (typeof nativeButtonTypes)[number]
export type ButtonShape = (typeof buttonShapes)[number]

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
  loading: Boolean,
  block: Boolean,
  round: Boolean,
  danger: Boolean,
  ghost: Boolean,
  shape: {
    type: String as PropType<ButtonShape>,
    default: 'default',
    validator: (value: string) => buttonShapes.includes(value as ButtonShape)
  },
  href: String,
  target: String
} as const

export const buttonEmits = {
  click: (event: MouseEvent) => event instanceof MouseEvent
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
