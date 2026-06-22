import type { ExtractPropTypes, PropType } from 'vue'

export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | string

export const tagProps = {
  color: {
    type: String as PropType<TagColor>,
    default: 'default'
  },
  closable: Boolean
} as const

export const tagEmits = {
  close: (event: MouseEvent) => event instanceof MouseEvent
}

export type TagProps = ExtractPropTypes<typeof tagProps>
