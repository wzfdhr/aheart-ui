"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["id", "value", "placeholder", "rows", "disabled", "readonly", "maxlength"];
const _hoisted_2 = {
  key: 1,
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
    const resolvedVariant = vue.computed(() => props.variant ?? (props.bordered === false ? "borderless" : "outlined"));
    const hasAutoSize = vue.computed(() => Boolean(props.autoSize));
    const textareaClass = vue.computed(() => [
      `aheart-textarea--${resolvedSize.value}`,
      `aheart-textarea--${resolvedVariant.value}`,
      {
        [`aheart-textarea--${props.status}`]: props.status,
        "is-autosize": hasAutoSize.value,
        "is-disabled": isDisabled.value,
        "is-readonly": props.readOnly
      }
    ]);
    const textareaStyle = vue.computed(() => {
      if (!props.autoSize || typeof props.autoSize === "boolean") {
        return void 0;
      }
      return {
        ...props.autoSize.minRows ? { "--aheart-textarea-min-rows": props.autoSize.minRows } : {},
        ...props.autoSize.maxRows ? { "--aheart-textarea-max-rows": props.autoSize.maxRows } : {}
      };
    });
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
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        emit("pressEnter", event);
      }
    };
    const handleClear = () => {
      emit("update:modelValue", "");
      emit("input", "");
      emit("clear");
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-textarea", textareaClass.value]),
        style: vue.normalizeStyle(textareaStyle.value)
      }, [
        vue.createElementVNode("textarea", {
          class: "aheart-textarea__control",
          id: _ctx.id,
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          rows: _ctx.rows,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_1),
        _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "aheart-textarea__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : vue.createCommentVNode("", true),
        _ctx.showCount ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, vue.toDisplayString(countText.value), 1)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
