import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { checkboxProps, checkboxEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = { class: "aheart-checkbox__box" };
const _hoisted_2 = ["checked", "disabled", "aria-checked"];
const _hoisted_3 = { class: "aheart-checkbox__label" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACheckbox"
  },
  __name: "checkbox",
  props: checkboxProps,
  emits: checkboxEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const checkboxClass = computed(() => ({
      "is-checked": props.modelValue,
      "is-indeterminate": props.indeterminate,
      "is-disabled": isDisabled.value
    }));
    const handleChange = (event) => {
      const checked = event.target.checked;
      emit("update:modelValue", checked);
      emit("change", checked);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", {
        class: normalizeClass(["aheart-checkbox", checkboxClass.value])
      }, [
        createElementVNode("span", _hoisted_1, [
          createElementVNode("input", {
            class: "aheart-checkbox__input",
            type: "checkbox",
            checked: _ctx.modelValue,
            disabled: isDisabled.value,
            "aria-checked": _ctx.indeterminate ? "mixed" : _ctx.modelValue ? "true" : "false",
            onChange: handleChange
          }, null, 40, _hoisted_2),
          _cache[0] || (_cache[0] = createElementVNode("span", {
            class: "aheart-checkbox__inner",
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
