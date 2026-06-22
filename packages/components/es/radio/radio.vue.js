import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { radioProps, radioEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = { class: "aheart-radio__box" };
const _hoisted_2 = ["name", "checked", "disabled"];
const _hoisted_3 = { class: "aheart-radio__label" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ARadio"
  },
  __name: "radio",
  props: radioProps,
  emits: radioEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const radioClass = computed(() => ({
      "is-checked": props.modelValue,
      "is-disabled": isDisabled.value
    }));
    const handleChange = () => {
      emit("update:modelValue", true);
      emit("change", true);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", {
        class: normalizeClass(["aheart-radio", radioClass.value])
      }, [
        createElementVNode("span", _hoisted_1, [
          createElementVNode("input", {
            class: "aheart-radio__input",
            type: "radio",
            name: _ctx.name,
            checked: _ctx.modelValue,
            disabled: isDisabled.value,
            onChange: handleChange
          }, null, 40, _hoisted_2),
          _cache[0] || (_cache[0] = createElementVNode("span", {
            class: "aheart-radio__inner",
            "aria-hidden": "true"
          }, null, -1))
        ]),
        createElementVNode("span", _hoisted_3, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(_ctx.label), 1)
          ])
        ])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
