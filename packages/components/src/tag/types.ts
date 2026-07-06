import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type TagColor = 'default' | 'primary' | 'success' | 'processing' | 'warning' | 'danger' | 'error' | string
export type TagVariant = 'filled' | 'solid' | 'outlined'
export type TagValue = string | number
export type TagRenderable = VNodeChild
export type TagIcon = TagRenderable
export type TagSemanticPart = 'root' | 'icon' | 'content' | 'close'
export type TagGroupSemanticPart = 'root' | 'item' | 'activeItem'
export type TagClassNames = Partial<Record<TagSemanticPart, string>>
export type TagStyles = Partial<Record<TagSemanticPart, StyleValue>>
export type TagGroupClassNames = Partial<Record<TagGroupSemanticPart, string>>
export type TagGroupStyles = Partial<Record<TagGroupSemanticPart, StyleValue>>
export type TagGroupValue = TagValue | TagValue[] | null
export type TagRawOption = TagValue | TagOption

export interface TagOption {
  label: TagRenderable
  value: TagValue
  disabled?: boolean
  icon?: TagIcon
  className?: string
  style?: StyleValue
  title?: string
}

export const tagProps = {
  color: {
    type: String as PropType<TagColor>,
    default: 'default'
  },
  variant: {
    type: String as PropType<TagVariant>,
    default: undefined
  },
  bordered: {
    type: Boolean,
    default: undefined
  },
  closable: Boolean,
  closeIcon: {
    type: [String, Number, Boolean, Object, Array, Function] as PropType<TagIcon | boolean | null>,
    default: undefined
  },
  icon: [String, Number, Object, Array, Function] as PropType<TagIcon>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  href: String,
  target: String,
  rel: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<TagClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<TagStyles>,
    default: () => ({})
  }
} as const

export const tagEmits = {
  close: (event: MouseEvent) => event instanceof MouseEvent
}

export const checkableTagProps = {
  checked: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  icon: [String, Number, Object, Array, Function] as PropType<TagIcon>,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<TagClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<TagStyles>,
    default: () => ({})
  }
} as const

export const checkableTagEmits = {
  'update:checked': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean, event: MouseEvent) => typeof checked === 'boolean' && event instanceof MouseEvent
}

export const tagGroupProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<TagGroupValue>,
    default: undefined
  },
  value: {
    type: [String, Number, Array] as PropType<TagGroupValue>,
    default: undefined
  },
  defaultValue: {
    type: [String, Number, Array] as PropType<TagGroupValue>,
    default: undefined
  },
  options: {
    type: Array as PropType<TagRawOption[]>,
    default: () => []
  },
  multiple: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<TagGroupClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<TagGroupStyles>,
    default: () => ({})
  }
} as const

const isTagValue = (value: unknown) => typeof value === 'string' || typeof value === 'number'
const isTagGroupValue = (value: unknown) => value === null || isTagValue(value) || (Array.isArray(value) && value.every(isTagValue))

export const tagGroupEmits = {
  'update:modelValue': isTagGroupValue,
  'update:value': isTagGroupValue,
  change: isTagGroupValue
}

export type TagProps = ExtractPropTypes<typeof tagProps>
export type CheckableTagProps = ExtractPropTypes<typeof checkableTagProps>
export type TagGroupProps = ExtractPropTypes<typeof tagGroupProps>
