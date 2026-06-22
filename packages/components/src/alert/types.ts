import type { ExtractPropTypes, PropType } from 'vue'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: 'info'
  },
  message: String,
  description: String,
  showIcon: Boolean,
  closable: Boolean
} as const

export const alertEmits = {
  close: (event: MouseEvent) => event instanceof MouseEvent
}

export type AlertProps = ExtractPropTypes<typeof alertProps>
