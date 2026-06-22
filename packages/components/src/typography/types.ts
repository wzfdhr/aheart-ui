import type { ExtractPropTypes, PropType } from 'vue'

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
export type TitleLevel = 1 | 2 | 3 | 4 | 5

export const typographyProps = {} as const

export const titleProps = {
  level: {
    type: Number as PropType<TitleLevel>,
    default: 1,
    validator: (value: number) => value >= 1 && value <= 5
  }
} as const

export const textProps = {
  type: String as PropType<TypographyType>,
  strong: Boolean,
  italic: Boolean,
  code: Boolean,
  keyboard: Boolean,
  delete: Boolean,
  underline: Boolean,
  disabled: Boolean
} as const

export const paragraphProps = {
  type: String as PropType<TypographyType>,
  strong: Boolean,
  italic: Boolean,
  ellipsis: Boolean,
  disabled: Boolean
} as const

export const linkProps = {
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
