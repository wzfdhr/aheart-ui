import type { ExtractPropTypes, PropType } from 'vue'

export type DividerType = 'horizontal' | 'vertical'
export type DividerOrientation = 'left' | 'center' | 'right'

export const dividerProps = {
  type: {
    type: String as PropType<DividerType>,
    default: 'horizontal'
  },
  orientation: {
    type: String as PropType<DividerOrientation>,
    default: 'center'
  },
  dashed: Boolean,
  plain: Boolean
} as const

export type DividerProps = ExtractPropTypes<typeof dividerProps>
