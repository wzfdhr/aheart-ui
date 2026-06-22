import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type AlertType = 'success' | 'info' | 'warning' | 'error'
export type AlertVariant = 'outlined' | 'filled'
export type AlertSemanticPart = 'root' | 'icon' | 'content' | 'title' | 'description' | 'action' | 'close'
export type AlertClassNames = Partial<Record<AlertSemanticPart, string>>
export type AlertStyles = Partial<Record<AlertSemanticPart, StyleValue>>

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: undefined
  },
  title: String,
  message: String,
  description: String,
  showIcon: {
    type: Boolean,
    default: undefined
  },
  closable: Boolean,
  banner: Boolean,
  variant: {
    type: String as PropType<AlertVariant>,
    default: 'outlined'
  },
  action: String,
  icon: String,
  closeIcon: String,
  role: {
    type: String,
    default: 'alert'
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<AlertClassNames>,
  styles: Object as PropType<AlertStyles>
} as const

export const alertEmits = {
  close: (event: MouseEvent) => event instanceof MouseEvent,
  afterClose: () => true
}

export type AlertProps = ExtractPropTypes<typeof alertProps>
