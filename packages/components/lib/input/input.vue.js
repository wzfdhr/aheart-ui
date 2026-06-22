"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-input__addon aheart-input__addon--before"
};
const _hoisted_2 = {
  key: 0,
  class: "aheart-input__prefix"
};
const _hoisted_3 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_4 = {
  key: 2,
  class: "aheart-input__suffix"
};
const _hoisted_5 = {
  key: 3,
  class: "aheart-input__count"
};
const _hoisted_6 = {
  key: 1,
  class: "aheart-input__addon aheart-input__addon--after"
};
const _hoisted_7 = {
  key: 0,
  class: "aheart-input__prefix"
};
const _hoisted_8 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_9 = {
  key: 2,
  class: "aheart-input__suffix"
};
const _hoisted_10 = {
  key: 3,
  class: "aheart-input__count"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AInput"
  },
  __name: "input",
  props: types.inputProps,
  emits: types.inputEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = vue.computed(() => props.modelValue ?? "");
    const resolvedVariant = vue.computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAddon = vue.computed(() => Boolean(props.addonBefore || props.addonAfter));
    const hasPrefix = vue.computed(() => Boolean(props.prefix || slots.prefix));
    const hasSuffix = vue.computed(() => Boolean(props.suffix || slots.suffix));
    const inputClass = vue.computed(() => [
      `aheart-input--${resolvedSize.value}`,
      `aheart-input--${resolvedVariant.value}`,
      {
        [`aheart-input--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-readonly": props.readOnly
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
      return hasAddon.value ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 0,
        class: vue.normalizeClass(["aheart-input-group", `aheart-input-group--${resolvedSize.value}`])
      }, [
        _ctx.addonBefore ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, vue.toDisplayString(_ctx.addonBefore), 1)) : vue.createCommentVNode("", true),
        vue.createElementVNode("span", {
          class: vue.normalizeClass(["aheart-input", inputClass.value])
        }, [
          hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.prefix), 1)
            ])
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("input", {
            class: "aheart-input__control",
            id: _ctx.id,
            type: _ctx.type,
            value: _ctx.modelValue ?? "",
            placeholder: _ctx.placeholder,
            disabled: isDisabled.value,
            readonly: _ctx.readOnly,
            maxlength: _ctx.maxlength,
            onInput: handleInput,
            onChange: handleChange,
            onKeydown: handleKeydown
          }, null, 40, _hoisted_3),
          _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: "aheart-input__clear",
            type: "button",
            "aria-label": "Clear",
            onClick: handleClear
          }, " × ")) : vue.createCommentVNode("", true),
          hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, [
            vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.suffix), 1)
            ])
          ])) : vue.createCommentVNode("", true),
          _ctx.showCount ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, vue.toDisplayString(countText.value), 1)) : vue.createCommentVNode("", true)
        ], 2),
        _ctx.addonAfter ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, vue.toDisplayString(_ctx.addonAfter), 1)) : vue.createCommentVNode("", true)
      ], 2)) : (vue.openBlock(), vue.createElementBlock("span", {
        key: 1,
        class: vue.normalizeClass(["aheart-input", inputClass.value])
      }, [
        hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.prefix), 1)
          ])
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          class: "aheart-input__control",
          id: _ctx.id,
          type: _ctx.type,
          value: _ctx.modelValue ?? "",
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          maxlength: _ctx.maxlength,
          onInput: handleInput,
          onChange: handleChange,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_8),
        _ctx.allowClear && !isDisabled.value && _ctx.modelValue ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "aheart-input__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : vue.createCommentVNode("", true),
        hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9, [
          vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.suffix), 1)
          ])
        ])) : vue.createCommentVNode("", true),
        _ctx.showCount ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_10, vue.toDisplayString(countText.value), 1)) : vue.createCommentVNode("", true)
      ], 2));
    };
  }
});
exports.default = _sfc_main;
