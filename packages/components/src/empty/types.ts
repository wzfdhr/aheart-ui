import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type EmptyImage = string | false
export type EmptyDescription = string | false
export type EmptySemanticPart = 'root' | 'image' | 'description' | 'footer'
export type EmptyClassNames = Partial<Record<EmptySemanticPart, string>>
export type EmptyStyles = Partial<Record<EmptySemanticPart, StyleValue>>

export const emptyProps = {
  description: {
    type: [String, Boolean] as PropType<EmptyDescription>,
    default: undefined
  },
  image: {
    type: [String, Boolean] as PropType<EmptyImage>,
    default: undefined
  },
  imageStyle: [String, Object, Array] as PropType<StyleValue>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<EmptyClassNames>,
  styles: Object as PropType<EmptyStyles>
} as const

export type EmptyProps = ExtractPropTypes<typeof emptyProps>
