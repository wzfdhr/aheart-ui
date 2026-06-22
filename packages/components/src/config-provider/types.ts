import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartLocale, AheartSize, AheartTheme } from '../config'

export const configProviderProps = {
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  locale: Object as PropType<AheartLocale>,
  theme: Object as PropType<AheartTheme>
} as const

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
