import { computed, toValue, ref, watch } from "vue";
const useControllableState = (options) => {
  const controlledByPresence = Object.prototype.hasOwnProperty.call(options, "controlled");
  const isControlled = computed(() => options.isControlled === void 0 ? controlledByPresence : toValue(options.isControlled));
  const uncontrolled = ref(toValue(options.defaultValue));
  const state = computed(() => isControlled.value ? toValue(options.controlled) : uncontrolled.value);
  watch(
    [isControlled, () => toValue(options.controlled)],
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
export {
  useControllableState
};
