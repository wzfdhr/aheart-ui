import type { ExtractPropTypes, PropType } from 'vue'

export const drawerPlacements = ['top', 'right', 'bottom', 'left'] as const

export type DrawerPlacement = (typeof drawerPlacements)[number]

export const drawerProps = {
  open: Boolean,
  title: String,
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'right',
    validator: (value: string) => drawerPlacements.includes(value as DrawerPlacement)
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 378
  },
  height: {
    type: [Number, String] as PropType<number | string>,
    default: 378
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
  footer: Boolean,
  destroyOnClose: Boolean
} as const

export const drawerEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  close: () => true
}

export type DrawerProps = ExtractPropTypes<typeof drawerProps>
