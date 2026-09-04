"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
function useCollection() {
  const items = vue.shallowRef([]);
  let nextKey = 0;
  const makeKey = () => `collection-item-${++nextKey}`;
  const getItem = (key) => items.value.find((item) => item.key === key);
  const getItems = () => items.value.slice();
  const getVisibleItems = () => items.value.filter((item) => item.visible);
  const getEnabledItems = () => items.value.filter((item) => item.visible && !item.disabled);
  const unregister = (key) => {
    const index = items.value.findIndex((item) => item.key === key);
    if (index >= 0)
      items.value = items.value.filter((item) => item.key !== key);
  };
  const register = (input) => {
    const key = input.key || makeKey();
    const existing = getItem(key);
    if (existing) {
      items.value = items.value.map((item) => item.key === key ? { ...item, element: input.element, disabled: !!input.disabled, visible: input.visible !== false } : item);
    } else {
      items.value = [...items.value, { key, element: input.element, disabled: !!input.disabled, visible: input.visible !== false }];
    }
    return { key, unregister: () => unregister(key) };
  };
  const update = (key, patch) => {
    const item = getItem(key);
    if (item)
      items.value = items.value.map((entry) => entry.key === key ? { ...entry, ...patch } : entry);
  };
  return {
    items,
    register,
    unregister,
    update,
    getItem,
    getItems,
    getVisibleItems,
    getEnabledItems,
    isVisible: (key) => {
      var _a;
      return ((_a = getItem(key)) == null ? void 0 : _a.visible) === true;
    },
    isDisabled: (key) => {
      var _a;
      return ((_a = getItem(key)) == null ? void 0 : _a.disabled) === true;
    }
  };
}
exports.useCollection = useCollection;
