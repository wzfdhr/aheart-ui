import { inject, computed, unref, provide } from "vue";
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
    emptyText: "暂无数据"
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
    emptyText: "No Data"
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
  return inject(aheartConfigKey, computed(() => defaultAheartConfig));
};
const provideAheartConfig = (config) => {
  const parentConfig = useAheartConfig();
  const mergedConfig = computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const current = unref(config);
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
        }
      },
      theme: {
        ...parent.theme,
        ...current.theme
      }
    };
  });
  provide(aheartConfigKey, mergedConfig);
  return mergedConfig;
};
const resolveConfigValue = (localValue, providerValue, fallback) => {
  return localValue ?? providerValue ?? fallback;
};
export {
  aheartConfigKey,
  defaultAheartConfig,
  enUS,
  provideAheartConfig,
  resolveConfigValue,
  useAheartConfig,
  zhCN
};
