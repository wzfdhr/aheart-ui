import { inject, computed, unref, provide } from "vue";
const defaultAheartConfig = {
  size: "middle",
  disabled: false,
  locale: {
    empty: {
      description: "No Data"
    }
  },
  theme: {}
};
const aheartConfigKey = Symbol("aheart-config");
const useAheartConfig = () => {
  return inject(aheartConfigKey, computed(() => defaultAheartConfig));
};
const provideAheartConfig = (config) => {
  const parentConfig = useAheartConfig();
  const mergedConfig = computed(() => {
    var _a, _b, _c;
    const current = unref(config);
    const parent = parentConfig.value;
    return {
      ...defaultAheartConfig,
      ...parent,
      ...current,
      locale: {
        ...defaultAheartConfig.locale,
        ...parent.locale,
        ...current.locale,
        empty: {
          ...(_a = defaultAheartConfig.locale) == null ? void 0 : _a.empty,
          ...(_b = parent.locale) == null ? void 0 : _b.empty,
          ...(_c = current.locale) == null ? void 0 : _c.empty
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
  provideAheartConfig,
  resolveConfigValue,
  useAheartConfig
};
