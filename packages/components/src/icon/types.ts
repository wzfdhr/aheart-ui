import type { ExtractPropTypes, PropType } from 'vue'

export const iconProps = {
  name: String,
  size: [Number, String] as PropType<number | string>,
  color: String,
  spin: Boolean
} as const

export type IconProps = ExtractPropTypes<typeof iconProps>
