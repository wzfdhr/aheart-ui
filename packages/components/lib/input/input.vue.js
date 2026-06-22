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
const _hoisted_2 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_3 = {
  key: 1,
  class: "aheart-input__addon aheart-input__addon--after"
};
const _hoisted_4 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
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
    const allowClearConfig = vue.computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const showClear = vue.computed(() => Boolean(props.allowClear) && !isDisabled.value && Boolean(currentValue.value));
    const clearIconContent = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const inputClass = vue.computed(() => {
      var _a;
      return [
        `aheart-input--${resolvedSize.value}`,
        `aheart-input--${resolvedVariant.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          [`aheart-input--${props.status}`]: props.status,
          "is-disabled": isDisabled.value,
          "is-readonly": props.readOnly
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const controlClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.input;
    });
    const controlStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.input;
    });
    const prefixClass = vue.computed(() => {
      var _a;
      return ["aheart-input__prefix", (_a = props.classNames) == null ? void 0 : _a.prefix];
    });
    const prefixStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.prefix;
    });
    const suffixClass = vue.computed(() => {
      var _a;
      return ["aheart-input__suffix", (_a = props.classNames) == null ? void 0 : _a.suffix];
    });
    const suffixStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.suffix;
    });
    const clearClass = vue.computed(() => {
      var _a;
      return ["aheart-input__clear", (_a = props.classNames) == null ? void 0 : _a.clear];
    });
    const clearStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.clear;
    });
    const countClass = vue.computed(() => {
      var _a;
      return ["aheart-input__count", (_a = props.classNames) == null ? void 0 : _a.count];
    });
    const countStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.count;
    });
    const countLength = vue.computed(() => {
      var _a, _b;
      return ((_b = (_a = props.count) == null ? void 0 : _a.strategy) == null ? void 0 : _b.call(_a, currentValue.value)) ?? currentValue.value.length;
    });
    const countMaxLength = vue.computed(() => {
      var _a;
      return ((_a = props.count) == null ? void 0 : _a.max) ?? props.maxlength;
    });
    const countInfo = vue.computed(() => ({
      count: countLength.value,
      maxLength: countMaxLength.value,
      value: currentValue.value
    }));
    const showCountFormatter = vue.computed(
      () => typeof props.showCount === "object" && props.showCount !== null ? props.showCount.formatter : void 0
    );
    const showCountDisplay = vue.computed(() => {
      var _a, _b, _c;
      if (((_a = props.count) == null ? void 0 : _a.show) === false) {
        return false;
      }
      return Boolean(props.showCount) || ((_b = props.count) == null ? void 0 : _b.show) === true || typeof ((_c = props.count) == null ? void 0 : _c.show) === "function";
    });
    const countText = vue.computed(() => {
      var _a;
      if (typeof ((_a = props.count) == null ? void 0 : _a.show) === "function") {
        return props.count.show(countInfo.value);
      }
      if (showCountFormatter.value) {
        return showCountFormatter.value(countInfo.value);
      }
      return countMaxLength.value ? `${countLength.value} / ${countMaxLength.value}` : String(countLength.value);
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
          class: vue.normalizeClass(["aheart-input", inputClass.value]),
          style: vue.normalizeStyle(rootStyle.value)
        }, [
          hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(prefixClass.value),
            style: vue.normalizeStyle(prefixStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.prefix), 1)
            ])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("input", {
            class: vue.normalizeClass(["aheart-input__control", controlClass.value]),
            style: vue.normalizeStyle(controlStyle.value),
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
          }, null, 46, _hoisted_2),
          showClear.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: vue.normalizeClass(clearClass.value),
            style: vue.normalizeStyle(clearStyle.value),
            type: "button",
            "aria-label": "Clear",
            onClick: handleClear
          }, [
            vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              vue.createTextVNode(vue.toDisplayString(clearIconContent.value), 1)
            ])
          ], 6)) : vue.createCommentVNode("", true),
          hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(suffixClass.value),
            style: vue.normalizeStyle(suffixStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.suffix), 1)
            ])
          ], 6)) : vue.createCommentVNode("", true),
          showCountDisplay.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 3,
            class: vue.normalizeClass(countClass.value),
            style: vue.normalizeStyle(countStyle.value)
          }, vue.toDisplayString(countText.value), 7)) : vue.createCommentVNode("", true)
        ], 6),
        _ctx.addonAfter ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(_ctx.addonAfter), 1)) : vue.createCommentVNode("", true)
      ], 2)) : (vue.openBlock(), vue.createElementBlock("span", {
        key: 1,
        class: vue.normalizeClass(["aheart-input", inputClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(prefixClass.value),
          style: vue.normalizeStyle(prefixStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.prefix), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          class: vue.normalizeClass(["aheart-input__control", controlClass.value]),
          style: vue.normalizeStyle(controlStyle.value),
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
        }, null, 46, _hoisted_4),
        showClear.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: vue.normalizeClass(clearClass.value),
          style: vue.normalizeStyle(clearStyle.value),
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, [
          vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            vue.createTextVNode(vue.toDisplayString(clearIconContent.value), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 2,
          class: vue.normalizeClass(suffixClass.value),
          style: vue.normalizeStyle(suffixStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.suffix), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        showCountDisplay.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 3,
          class: vue.normalizeClass(countClass.value),
          style: vue.normalizeStyle(countStyle.value)
        }, vue.toDisplayString(countText.value), 7)) : vue.createCommentVNode("", true)
      ], 6));
    };
  }
});
exports.default = _sfc_main;
