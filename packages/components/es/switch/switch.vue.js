import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { switchProps, switchEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-checked", "aria-busy", "disabled"];
const _hoisted_2 = { class: "aheart-switch__label" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASwitch"
  },
  __name: "switch",
  props: switchProps,
  emits: switchEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const switchClass = computed(() => [
      `aheart-switch--${resolvedSize.value}`,
      {
        "is-checked": props.modelValue,
        "is-loading": props.loading
      }
    ]);
    const handleClick = () => {
      if (isDisabled.value || props.loading) {
        return;
      }
      const checked = !props.modelValue;
      emit("update:modelValue", checked);
      emit("change", checked);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["aheart-switch", switchClass.value]),
        type: "button",
        role: "switch",
        "aria-checked": _ctx.modelValue ? "true" : "false",
        "aria-busy": _ctx.loading ? "true" : void 0,
        disabled: isDisabled.value || _ctx.loading,
        onClick: handleClick
      }, [
        _cache[0] || (_cache[0] = createElementVNode("span", {
          class: "aheart-switch__handle",
          "aria-hidden": "true"
        }, null, -1)),
        createElementVNode("span", _hoisted_2, toDisplayString(_ctx.modelValue ? _ctx.checkedChildren : _ctx.unCheckedChildren), 1)
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
