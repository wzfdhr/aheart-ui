"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-radio__box" };
const _hoisted_2 = ["name", "value", "checked", "disabled"];
const _hoisted_3 = { class: "aheart-radio__label" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ARadio"
  },
  __name: "radio",
  props: types.radioProps,
  emits: types.radioEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const radioClass = vue.computed(() => ({
      "is-checked": props.modelValue,
      "is-disabled": isDisabled.value
    }));
    const handleChange = () => {
      emit("update:modelValue", true);
      emit("change", true);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("label", {
        class: vue.normalizeClass(["aheart-radio", radioClass.value])
      }, [
        vue.createElementVNode("span", _hoisted_1, [
          vue.createElementVNode("input", {
            class: "aheart-radio__input",
            type: "radio",
            name: _ctx.name,
            value: _ctx.value,
            checked: _ctx.modelValue,
            disabled: isDisabled.value,
            onChange: handleChange
          }, null, 40, _hoisted_2),
          _cache[0] || (_cache[0] = vue.createElementVNode("span", {
            class: "aheart-radio__inner",
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
