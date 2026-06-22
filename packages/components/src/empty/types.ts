import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export const EMPTY_PRESENTED_IMAGE_DEFAULT = '__AHEART_EMPTY_PRESENTED_IMAGE_DEFAULT__' as const
export const EMPTY_PRESENTED_IMAGE_SIMPLE = '__AHEART_EMPTY_PRESENTED_IMAGE_SIMPLE__' as const

export type EmptyRenderable = VNodeChild
export type EmptyPresetImage = typeof EMPTY_PRESENTED_IMAGE_DEFAULT | typeof EMPTY_PRESENTED_IMAGE_SIMPLE
export type EmptyImage = EmptyRenderable | EmptyPresetImage | false
export type EmptyDescription = EmptyRenderable | false
export type EmptySemanticPart = 'root' | 'image' | 'description' | 'footer'
export type EmptyClassNames = Partial<Record<EmptySemanticPart, string>>
export type EmptyStyles = Partial<Record<EmptySemanticPart, StyleValue>>

const renderableProp = [String, Number, Boolean, Object, Array, Function] as PropType<EmptyRenderable | false>

export const emptyProps = {
  description: {
    type: renderableProp as PropType<EmptyDescription>,
    default: undefined
  },
  image: {
    type: renderableProp as PropType<EmptyImage>,
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
