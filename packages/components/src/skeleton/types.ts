import type { ExtractPropTypes, PropType } from 'vue'

export type SkeletonAvatarShape = 'circle' | 'square'

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
  round: Boolean
} as const

export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>
