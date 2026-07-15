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
  datePicker?: {
    locale?: 'zh-CN' | 'en-US'
    weekStartsOn?: number
    weekdaysShort?: string[]
    monthsShort?: string[]
    selectDate?: string
    selectTime?: string
    startDate?: string
    endDate?: string
    selectWeek?: string
    selectMonth?: string
    selectQuarter?: string
    selectYear?: string
    today?: string
    now?: string
    ok?: string
    clear?: string
    previousMonth?: string
    nextMonth?: string
    previousYear?: string
    nextYear?: string
    selected?: (value: string) => string
    rangeStartSelected?: string
    rangeComplete?: (start: string, end: string) => string
  }
  timePicker?: {
    selectTime?: string
    startTime?: string
    endTime?: string
    now?: string
    ok?: string
    clear?: string
    selected?: (value: string) => string
    rangeStartSelected?: string
    rangeComplete?: (start: string, end: string) => string
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
  },
  datePicker: {
    locale: 'zh-CN', weekStartsOn: 1, weekdaysShort: ['一', '二', '三', '四', '五', '六', '日'],
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    selectDate: '请选择日期', selectTime: '请选择时间', startDate: '开始日期', endDate: '结束日期',
    selectWeek: '请选择周', selectMonth: '请选择月份', selectQuarter: '请选择季度', selectYear: '请选择年份',
    today: '今天', now: '此刻', ok: '确定', clear: '清除', previousMonth: '上个月', nextMonth: '下个月',
    previousYear: '上一年', nextYear: '下一年', selected: (value) => `已选择 ${value}`,
    rangeStartSelected: '已选择开始日期，请选择结束日期', rangeComplete: (start, end) => `已选择 ${start} 至 ${end}`
  },
  timePicker: {
    selectTime: '请选择时间', startTime: '开始时间', endTime: '结束时间', now: '此刻', ok: '确定', clear: '清除',
    selected: (value) => `已选择 ${value}`, rangeStartSelected: '已选择开始时间，请选择结束时间',
    rangeComplete: (start, end) => `已选择 ${start} 至 ${end}`
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
  },
  datePicker: {
    locale: 'en-US', weekStartsOn: 0, weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    selectDate: 'Select date', selectTime: 'Select time', startDate: 'Start date', endDate: 'End date',
    selectWeek: 'Select week', selectMonth: 'Select month', selectQuarter: 'Select quarter', selectYear: 'Select year',
    today: 'Today', now: 'Now', ok: 'OK', clear: 'Clear', previousMonth: 'Previous month', nextMonth: 'Next month',
    previousYear: 'Previous year', nextYear: 'Next year', selected: (value) => `Selected ${value}`,
    rangeStartSelected: 'Start date selected, choose an end date', rangeComplete: (start, end) => `Selected ${start} to ${end}`
  },
  timePicker: {
    selectTime: 'Select time', startTime: 'Start time', endTime: 'End time', now: 'Now', ok: 'OK', clear: 'Clear',
    selected: (value) => `Selected ${value}`, rangeStartSelected: 'Start time selected, choose an end time',
    rangeComplete: (start, end) => `Selected ${start} to ${end}`
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
        },
        datePicker: {
          ...zhCN.datePicker,
          ...parent.locale?.datePicker,
          ...current.locale?.datePicker
        },
        timePicker: {
          ...zhCN.timePicker,
          ...parent.locale?.timePicker,
          ...current.locale?.timePicker
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
