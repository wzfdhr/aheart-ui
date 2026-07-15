"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const zhCN = {
  empty: {
    description: "暂无数据"
  },
  pagination: {
    ariaLabel: "分页",
    prevPage: "上一页",
    nextPage: "下一页",
    pageSizeLabel: "每页条数",
    pageSize: (pageSize) => `${pageSize} 条/页`,
    quickJumper: "跳至",
    goButton: "确定",
    total: (total) => `共 ${total} 条`
  },
  modal: {
    ariaLabel: "对话框",
    okText: "确定",
    cancelText: "取消",
    close: "关闭"
  },
  table: {
    emptyText: "暂无数据",
    loadingText: "加载中"
  },
  datePicker: {
    locale: "zh-CN",
    weekStartsOn: 1,
    weekdaysShort: ["一", "二", "三", "四", "五", "六", "日"],
    monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    selectDate: "请选择日期",
    selectTime: "请选择时间",
    startDate: "开始日期",
    endDate: "结束日期",
    selectWeek: "请选择周",
    selectMonth: "请选择月份",
    selectQuarter: "请选择季度",
    selectYear: "请选择年份",
    today: "今天",
    now: "此刻",
    ok: "确定",
    clear: "清除",
    previousMonth: "上个月",
    nextMonth: "下个月",
    previousYear: "上一年",
    nextYear: "下一年",
    selected: (value) => `已选择 ${value}`,
    rangeStartSelected: "已选择开始日期，请选择结束日期",
    rangeComplete: (start, end) => `已选择 ${start} 至 ${end}`
  },
  timePicker: {
    selectTime: "请选择时间",
    startTime: "开始时间",
    endTime: "结束时间",
    now: "此刻",
    ok: "确定",
    clear: "清除",
    selected: (value) => `已选择 ${value}`,
    rangeStartSelected: "已选择开始时间，请选择结束时间",
    rangeComplete: (start, end) => `已选择 ${start} 至 ${end}`
  }
};
const enUS = {
  empty: {
    description: "No Data"
  },
  pagination: {
    ariaLabel: "pagination",
    prevPage: "Previous Page",
    nextPage: "Next Page",
    pageSizeLabel: "Page Size",
    pageSize: (pageSize) => `${pageSize} / page`,
    quickJumper: "Go to",
    goButton: "Go",
    total: (total) => `Total ${total} items`
  },
  modal: {
    ariaLabel: "Dialog",
    okText: "OK",
    cancelText: "Cancel",
    close: "Close"
  },
  table: {
    emptyText: "No Data",
    loadingText: "Loading"
  },
  datePicker: {
    locale: "en-US",
    weekStartsOn: 0,
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    selectDate: "Select date",
    selectTime: "Select time",
    startDate: "Start date",
    endDate: "End date",
    selectWeek: "Select week",
    selectMonth: "Select month",
    selectQuarter: "Select quarter",
    selectYear: "Select year",
    today: "Today",
    now: "Now",
    ok: "OK",
    clear: "Clear",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousYear: "Previous year",
    nextYear: "Next year",
    selected: (value) => `Selected ${value}`,
    rangeStartSelected: "Start date selected, choose an end date",
    rangeComplete: (start, end) => `Selected ${start} to ${end}`
  },
  timePicker: {
    selectTime: "Select time",
    startTime: "Start time",
    endTime: "End time",
    now: "Now",
    ok: "OK",
    clear: "Clear",
    selected: (value) => `Selected ${value}`,
    rangeStartSelected: "Start time selected, choose an end time",
    rangeComplete: (start, end) => `Selected ${start} to ${end}`
  }
};
const defaultAheartConfig = {
  size: "middle",
  disabled: false,
  locale: zhCN,
  theme: {}
};
const aheartConfigKey = Symbol("aheart-config");
const useAheartConfig = () => {
  return vue.inject(aheartConfigKey, vue.computed(() => defaultAheartConfig));
};
const provideAheartConfig = (config) => {
  const parentConfig = useAheartConfig();
  const mergedConfig = vue.computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const current = vue.unref(config);
    const parent = parentConfig.value;
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
          ...(_a = parent.locale) == null ? void 0 : _a.empty,
          ...(_b = current.locale) == null ? void 0 : _b.empty
        },
        pagination: {
          ...zhCN.pagination,
          ...(_c = parent.locale) == null ? void 0 : _c.pagination,
          ...(_d = current.locale) == null ? void 0 : _d.pagination
        },
        modal: {
          ...zhCN.modal,
          ...(_e = parent.locale) == null ? void 0 : _e.modal,
          ...(_f = current.locale) == null ? void 0 : _f.modal
        },
        table: {
          ...zhCN.table,
          ...(_g = parent.locale) == null ? void 0 : _g.table,
          ...(_h = current.locale) == null ? void 0 : _h.table
        },
        datePicker: {
          ...zhCN.datePicker,
          ...(_i = parent.locale) == null ? void 0 : _i.datePicker,
          ...(_j = current.locale) == null ? void 0 : _j.datePicker
        },
        timePicker: {
          ...zhCN.timePicker,
          ...(_k = parent.locale) == null ? void 0 : _k.timePicker,
          ...(_l = current.locale) == null ? void 0 : _l.timePicker
        }
      },
      theme: {
        ...parent.theme,
        ...current.theme
      }
    };
  });
  vue.provide(aheartConfigKey, mergedConfig);
  return mergedConfig;
};
const resolveConfigValue = (localValue, providerValue, fallback) => {
  return localValue ?? providerValue ?? fallback;
};
exports.aheartConfigKey = aheartConfigKey;
exports.defaultAheartConfig = defaultAheartConfig;
exports.enUS = enUS;
exports.provideAheartConfig = provideAheartConfig;
exports.resolveConfigValue = resolveConfigValue;
exports.useAheartConfig = useAheartConfig;
exports.zhCN = zhCN;
