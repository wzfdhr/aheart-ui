"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["value", "placeholder", "rows", "disabled", "maxlength"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-textarea__count"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATextarea"
  },
  __name: "textarea",
  props: types.textareaProps,
  emits: types.textareaEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = vue.computed(() => props.modelValue ?? "");
    const textareaClass = vue.computed(() => [
      `aheart-textarea--${resolvedSize.value}`,
      {
        [`aheart-textarea--${props.status}`]: props.status,
        "is-autosize": props.autoSize,
        "is-disabled": isDisabled.value
      }
    ]);
    const countText = vue.computed(() => {
      const length = currentValue.value.length;
      return props.maxlength ? `${length} / ${props.maxlength}` : String(length);
    });
    const getEventValue = (event) => event.target.value;
    const handleInput = (event) => {
      const value = getEventValue(event);
      emit("update:modelValue", value);
      emit("input", value);
    };
    const handleChange = (event) => {
      emit("change", getEventValue(event));
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-textarea", textareaClass.value])
      }, [
        vue.createElementVNode("textarea", {
          class: "aheart-textarea__control",
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          rows: _ctx.rows,
          disabled: isDisabled.value,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange
        }, null, 40, _hoisted_1),
        _ctx.showCount ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, vue.toDisplayString(countText.value), 1)) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
