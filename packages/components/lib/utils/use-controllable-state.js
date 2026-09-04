"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const useControllableState = (options) => {
  const controlledByPresence = Object.prototype.hasOwnProperty.call(options, "controlled");
  const isControlled = vue.computed(() => options.isControlled === void 0 ? controlledByPresence : vue.toValue(options.isControlled));
  const uncontrolled = vue.ref(vue.toValue(options.defaultValue));
  const state = vue.computed(() => isControlled.value ? vue.toValue(options.controlled) : uncontrolled.value);
  vue.watch(
    [isControlled, () => vue.toValue(options.controlled)],
    ([controlled, value]) => {
      if (controlled)
        uncontrolled.value = value;
    },
    { flush: "sync", immediate: true }
  );
  const setState = (next, setOptions = {}) => {
    var _a;
    const value = typeof next === "function" ? next(state.value) : next;
    if (!setOptions.force && Object.is(value, state.value)) {
      return false;
    }
    if (!isControlled.value) {
      uncontrolled.value = value;
    }
    (_a = options.onChange) == null ? void 0 : _a.call(options, value);
    return true;
  };
  return { state, isControlled, setState };
};
exports.useControllableState = useControllableState;
