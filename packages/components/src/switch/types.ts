import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export type SwitchSemanticPart = 'root' | 'content' | 'indicator'
export type SwitchClassNames = Partial<Record<SwitchSemanticPart, string>>
export type SwitchStyles = Partial<Record<SwitchSemanticPart, StyleValue>>

export const switchProps = {
  modelValue: {
    type: Boolean,
    default: undefined
  },
  checked: {
    type: Boolean,
    default: undefined
  },
  value: {
    type: Boolean,
    default: undefined
  },
  defaultChecked: {
    type: Boolean,
    default: undefined
  },
  defaultValue: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  loading: Boolean,
  size: String as PropType<AheartSize>,
  checkedChildren: String,
  unCheckedChildren: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<SwitchClassNames>,
  styles: Object as PropType<SwitchStyles>
} as const

export const switchEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  'update:checked': (checked: boolean) => typeof checked === 'boolean',
  'update:value': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean, event: MouseEvent) => typeof checked === 'boolean' && event instanceof MouseEvent,
  click: (checked: boolean, event: MouseEvent) => typeof checked === 'boolean' && event instanceof MouseEvent
}

export type SwitchProps = ExtractPropTypes<typeof switchProps>
