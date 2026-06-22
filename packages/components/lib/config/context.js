"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
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
  return vue.inject(aheartConfigKey, vue.computed(() => defaultAheartConfig));
};
const provideAheartConfig = (config) => {
  const parentConfig = useAheartConfig();
  const mergedConfig = vue.computed(() => {
    var _a, _b, _c;
    const current = vue.unref(config);
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
  vue.provide(aheartConfigKey, mergedConfig);
  return mergedConfig;
};
const resolveConfigValue = (localValue, providerValue, fallback) => {
  return localValue ?? providerValue ?? fallback;
};
exports.aheartConfigKey = aheartConfigKey;
exports.defaultAheartConfig = defaultAheartConfig;
exports.provideAheartConfig = provideAheartConfig;
exports.resolveConfigValue = resolveConfigValue;
exports.useAheartConfig = useAheartConfig;
