import type { ExtractPropTypes, PropType } from 'vue'

export const buttonTypes = ['default', 'primary', 'success', 'warning', 'danger'] as const
export const buttonSizes = ['large', 'normal', 'middle', 'small', 'mini'] as const
export const nativeButtonTypes = ['button', 'submit', 'reset'] as const

export type ButtonType = (typeof buttonTypes)[number]
export type ButtonSize = (typeof buttonSizes)[number]
export type NativeButtonType = (typeof nativeButtonTypes)[number]

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
  disabled: {
    type: Boolean,
    default: undefined
  },
  loading: Boolean,
  block: Boolean,
  round: Boolean
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
