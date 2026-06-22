import { computed, inject, provide, type ComputedRef, type InjectionKey, type Ref, unref } from 'vue'

export type AheartSize = 'large' | 'middle' | 'small'

export interface AheartLocale {
  empty?: {
    description?: string
  }
}

export interface AheartTheme {
  primaryColor?: string
  primaryHoverColor?: string
  successColor?: string
  warningColor?: string
  dangerColor?: string
  infoColor?: string
  textColor?: string
  textSecondaryColor?: string
  borderColor?: string
  fillColor?: string
  backgroundColor?: string
  borderRadius?: string
  fontSize?: string
}

export interface AheartConfig {
  size?: AheartSize
  disabled?: boolean
  locale?: AheartLocale
  theme?: AheartTheme
}

export const defaultAheartConfig: Required<Pick<AheartConfig, 'size' | 'disabled'>> &
  Pick<AheartConfig, 'locale' | 'theme'> = {
  size: 'middle',
  disabled: false,
  locale: {
    empty: {
      description: 'No Data'
    }
  },
  theme: {}
}

export const aheartConfigKey: InjectionKey<ComputedRef<AheartConfig>> = Symbol('aheart-config')

export const useAheartConfig = () => {
  return inject(aheartConfigKey, computed(() => defaultAheartConfig))
}

export const provideAheartConfig = (config: Ref<AheartConfig>) => {
  const parentConfig = useAheartConfig()
  const mergedConfig = computed<AheartConfig>(() => {
    const current = unref(config)
    const parent = parentConfig.value

    return {
      ...defaultAheartConfig,
      ...parent,
      ...current,
      locale: {
        ...defaultAheartConfig.locale,
        ...parent.locale,
        ...current.locale,
        empty: {
          ...defaultAheartConfig.locale?.empty,
          ...parent.locale?.empty,
          ...current.locale?.empty
        }
      },
      theme: {
        ...parent.theme,
        ...current.theme
      }
    }
  })

  provide(aheartConfigKey, mergedConfig)
  return mergedConfig
}

export const resolveConfigValue = <T>(localValue: T | undefined, providerValue: T | undefined, fallback: T) => {
  return localValue ?? providerValue ?? fallback
}
