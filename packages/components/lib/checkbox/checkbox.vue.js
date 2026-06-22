"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-checkbox__box" };
const _hoisted_2 = ["checked", "disabled", "aria-checked"];
const _hoisted_3 = { class: "aheart-checkbox__label" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACheckbox"
  },
  __name: "checkbox",
  props: types.checkboxProps,
  emits: types.checkboxEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const checkboxClass = vue.computed(() => ({
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
      return vue.openBlock(), vue.createElementBlock("label", {
        class: vue.normalizeClass(["aheart-checkbox", checkboxClass.value])
      }, [
        vue.createElementVNode("span", _hoisted_1, [
          vue.createElementVNode("input", {
            class: "aheart-checkbox__input",
            type: "checkbox",
            checked: _ctx.modelValue,
            disabled: isDisabled.value,
            "aria-checked": _ctx.indeterminate ? "mixed" : _ctx.modelValue ? "true" : "false",
            onChange: handleChange
          }, null, 40, _hoisted_2),
          _cache[0] || (_cache[0] = vue.createElementVNode("span", {
            class: "aheart-checkbox__inner",
            "aria-hidden": "true"
          }, null, -1))
        ]),
        vue.createElementVNode("span", _hoisted_3, [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
          ])
        ])
      ], 2);
    };
  }
});
exports.default = _sfc_main;
