import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type AlertRenderable = VNodeChild
export type AlertType = 'success' | 'info' | 'warning' | 'error'
export type AlertVariant = 'outlined' | 'filled'
export type AlertSemanticPart =
  | 'root'
  | 'icon'
  | 'content'
  | 'section'
  | 'title'
  | 'description'
  | 'action'
  | 'actions'
  | 'close'
export type AlertClassNames = Partial<Record<AlertSemanticPart, string>>
export type AlertStyles = Partial<Record<AlertSemanticPart, StyleValue>>

export interface AlertClosableConfig {
  closeIcon?: AlertRenderable
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  onClose?: (event: MouseEvent) => void
  afterClose?: () => void
}

const renderableProp = [String, Number, Object, Array, Function] as PropType<AlertRenderable>

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: undefined
  },
  title: renderableProp,
  message: renderableProp,
  description: renderableProp,
  showIcon: {
    type: Boolean,
    default: undefined
  },
  closable: {
    type: [Boolean, Object] as PropType<boolean | AlertClosableConfig>,
    default: false
  },
  banner: Boolean,
  variant: {
    type: String as PropType<AlertVariant>,
    default: 'outlined'
  },
  action: renderableProp,
  icon: renderableProp,
  closeIcon: renderableProp,
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
