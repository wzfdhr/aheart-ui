"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AForm"
  },
  __name: "form",
  props: types.formProps,
  emits: types.formEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    context.provideAheartConfig(
      vue.computed(() => ({
        size: props.size,
        disabled: props.disabled
      }))
    );
    const formClass = vue.computed(() => [
      `aheart-form--${props.layout}`,
      `aheart-form--label-${props.labelAlign}`
    ]);
    const handleSubmit = (event) => {
      emit("submit", event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("form", {
        class: vue.normalizeClass(["aheart-form", formClass.value]),
        onSubmit: vue.withModifiers(handleSubmit, ["prevent"])
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
exports.default = _sfc_main;
