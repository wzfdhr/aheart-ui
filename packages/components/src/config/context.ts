import { computed, inject, provide, type ComputedRef, type InjectionKey, type Ref, unref } from 'vue'

export type AheartSize = 'large' | 'middle' | 'small'
export type AheartVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'

export interface AheartLocale {
  empty?: {
    description?: string
  }
  pagination?: {
    ariaLabel?: string
    prevPage?: string
    nextPage?: string
    pageSizeLabel?: string
    pageSize?: (pageSize: number) => string
    quickJumper?: string
    goButton?: string
    total?: (total: number, range: [number, number]) => string
  }
  modal?: {
    ariaLabel?: string
    okText?: string
    cancelText?: string
    close?: string
  }
  table?: {
    emptyText?: string
    loadingText?: string
  }
}

export const zhCN: AheartLocale = {
  empty: {
    description: '暂无数据'
  },
  pagination: {
    ariaLabel: '分页',
    prevPage: '上一页',
    nextPage: '下一页',
    pageSizeLabel: '每页条数',
    pageSize: (pageSize) => `${pageSize} 条/页`,
    quickJumper: '跳至',
    goButton: '确定',
    total: (total) => `共 ${total} 条`
  },
  modal: {
    ariaLabel: '对话框',
    okText: '确定',
    cancelText: '取消',
    close: '关闭'
  },
  table: {
    emptyText: '暂无数据',
    loadingText: '加载中'
  }
}

export const enUS: AheartLocale = {
  empty: {
    description: 'No Data'
  },
  pagination: {
    ariaLabel: 'pagination',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    pageSizeLabel: 'Page Size',
    pageSize: (pageSize) => `${pageSize} / page`,
    quickJumper: 'Go to',
    goButton: 'Go',
    total: (total) => `Total ${total} items`
  },
  modal: {
    ariaLabel: 'Dialog',
    okText: 'OK',
    cancelText: 'Cancel',
    close: 'Close'
  },
  table: {
    emptyText: 'No Data',
    loadingText: 'Loading'
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
  variant?: AheartVariant
  locale?: AheartLocale
  theme?: AheartTheme
}

export const defaultAheartConfig: Required<Pick<AheartConfig, 'size' | 'disabled'>> &
  Pick<AheartConfig, 'locale' | 'theme'> = {
  size: 'middle',
  disabled: false,
  locale: zhCN,
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
        ...zhCN,
        ...parent.locale,
        ...current.locale,
        empty: {
          ...zhCN.empty,
          ...parent.locale?.empty,
          ...current.locale?.empty
        },
        pagination: {
          ...zhCN.pagination,
          ...parent.locale?.pagination,
          ...current.locale?.pagination
        },
        modal: {
          ...zhCN.modal,
          ...parent.locale?.modal,
          ...current.locale?.modal
        },
        table: {
          ...zhCN.table,
          ...parent.locale?.table,
          ...current.locale?.table
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
