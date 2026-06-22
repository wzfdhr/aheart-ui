import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type SkeletonAvatarShape = 'circle' | 'square'
export type SkeletonButtonShape = 'default' | 'round' | 'circle'
export type SkeletonButtonSize = 'small' | 'default' | 'large'
export type SkeletonInputSize = 'small' | 'default' | 'large'
export type SkeletonSemanticPart =
  | 'root'
  | 'avatar'
  | 'content'
  | 'title'
  | 'paragraph'
  | 'paragraphRow'
  | 'button'
  | 'input'
  | 'image'
  | 'node'

export type SkeletonClassNames = Partial<Record<SkeletonSemanticPart, string>>
export type SkeletonStyles = Partial<Record<SkeletonSemanticPart, StyleValue>>

export interface SkeletonAvatarConfig {
  size?: number | string
  shape?: SkeletonAvatarShape
}

export interface SkeletonTitleConfig {
  width?: number | string
}

export interface SkeletonParagraphConfig {
  rows?: number
  width?: number | string | Array<number | string>
}

export interface SkeletonButtonConfig {
  active?: boolean
  block?: boolean
  shape?: SkeletonButtonShape
  size?: SkeletonButtonSize
  width?: number | string
}

export interface SkeletonInputConfig {
  active?: boolean
  block?: boolean
  size?: SkeletonInputSize
  width?: number | string
}

export interface SkeletonImageConfig {
  active?: boolean
  width?: number | string
  height?: number | string
}

export interface SkeletonNodeConfig {
  active?: boolean
  width?: number | string
  height?: number | string
  children?: VNodeChild
}

export const skeletonProps = {
  loading: {
    type: Boolean,
    default: true
  },
  active: Boolean,
  avatar: [Boolean, Object] as PropType<boolean | SkeletonAvatarConfig>,
  title: {
    type: [Boolean, Object] as PropType<boolean | SkeletonTitleConfig>,
    default: true
  },
  paragraph: {
    type: [Boolean, Object] as PropType<boolean | SkeletonParagraphConfig>,
    default: true
  },
  button: [Boolean, Object] as PropType<boolean | SkeletonButtonConfig>,
  input: [Boolean, Object] as PropType<boolean | SkeletonInputConfig>,
  image: [Boolean, Object] as PropType<boolean | SkeletonImageConfig>,
  node: [Boolean, Object] as PropType<boolean | SkeletonNodeConfig>,
  round: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<SkeletonClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<SkeletonStyles>,
    default: () => ({})
  }
} as const

export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>
