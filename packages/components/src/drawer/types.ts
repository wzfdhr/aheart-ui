import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

export const drawerPlacements = ['top', 'right', 'bottom', 'left'] as const
export const drawerSizePresets = ['default', 'large'] as const
export const drawerSemanticParts = ['root', 'mask', 'section', 'header', 'title', 'extra', 'body', 'footer', 'close'] as const

export type DrawerPlacement = (typeof drawerPlacements)[number]
export type DrawerSizePreset = (typeof drawerSizePresets)[number]
export type DrawerSize = DrawerSizePreset | number | string
export type DrawerSemanticPart = (typeof drawerSemanticParts)[number]
export type DrawerClassNames = Partial<Record<DrawerSemanticPart, string>>
export type DrawerStyles = Partial<Record<DrawerSemanticPart, CSSProperties>>

export const drawerProps = {
  open: Boolean,
  title: String,
  extra: [String, Number] as PropType<string | number>,
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'right',
    validator: (value: string) => drawerPlacements.includes(value as DrawerPlacement)
  },
  size: {
    type: [String, Number] as PropType<DrawerSize>,
    default: 'default'
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: undefined
  },
  height: {
    type: [Number, String] as PropType<number | string>,
    default: undefined
  },
  zIndex: {
    type: Number,
    default: 1000
  },
  closable: {
    type: Boolean,
    default: true
  },
  mask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  loading: Boolean,
  footer: Boolean,
  className: String,
  rootClassName: String,
  style: Object as PropType<CSSProperties>,
  rootStyle: Object as PropType<CSSProperties>,
  classNames: Object as PropType<DrawerClassNames>,
  styles: Object as PropType<DrawerStyles>,
  forceRender: Boolean,
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean
} as const

export const drawerEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  close: () => true,
  afterOpenChange: (open: boolean) => typeof open === 'boolean'
}

export type DrawerProps = ExtractPropTypes<typeof drawerProps>
