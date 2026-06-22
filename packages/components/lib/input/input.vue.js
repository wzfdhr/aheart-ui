"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_2 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
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
    const AInputRenderNode = vue.defineComponent({
      name: "AInputRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const hasRenderable = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== void 0 && value !== null && value !== false && value !== true && value !== "";
    };
    const measureCount = (value) => {
      var _a, _b;
      return ((_b = (_a = props.count) == null ? void 0 : _a.strategy) == null ? void 0 : _b.call(_a, value)) ?? value.length;
    };
    const formatExceededValue = (value) => {
      var _a, _b;
      const max = (_a = props.count) == null ? void 0 : _a.max;
      if (max === void 0 || !((_b = props.count) == null ? void 0 : _b.exceedFormatter) || measureCount(value) <= max) {
        return value;
      }
      return props.count.exceedFormatter(value, { max });
    };
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = vue.computed(() => formatExceededValue(props.modelValue ?? ""));
    const resolvedVariant = vue.computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAddonBefore = vue.computed(() => Boolean(slots.addonBefore) || hasRenderable(props.addonBefore));
    const hasAddonAfter = vue.computed(() => Boolean(slots.addonAfter) || hasRenderable(props.addonAfter));
    const hasAddon = vue.computed(() => hasAddonBefore.value || hasAddonAfter.value);
    const hasPrefix = vue.computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix));
    const hasSuffix = vue.computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix));
    const allowClearConfig = vue.computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const allowClearDisabled = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.disabled) ?? false;
    });
    const showClear = vue.computed(
      () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && Boolean(currentValue.value)
    );
    const clearIconContent = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const groupClass = vue.computed(() => {
      var _a;
      return [
        "aheart-input-group",
        `aheart-input-group--${resolvedSize.value}`,
        (_a = props.classNames) == null ? void 0 : _a.group
      ];
    });
    const groupStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.group;
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
    const addonBeforeClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.addonBefore;
    });
    const addonBeforeStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.addonBefore;
    });
    const addonAfterClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.addonAfter;
    });
    const addonAfterStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.addonAfter;
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
    const countLength = vue.computed(() => measureCount(currentValue.value));
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
    const getEventValue = (event) => {
      const target = event.target;
      const value = formatExceededValue(target.value);
      if (target.value !== value) {
        target.value = value;
      }
      return value;
    };
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
        class: vue.normalizeClass(groupClass.value),
        style: vue.normalizeStyle(groupStyle.value)
      }, [
        hasAddonBefore.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(["aheart-input__addon aheart-input__addon--before", addonBeforeClass.value]),
          style: vue.normalizeStyle(addonBeforeStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "addonBefore", {}, () => [
            vue.createVNode(vue.unref(AInputRenderNode), { node: _ctx.addonBefore }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
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
              vue.createVNode(vue.unref(AInputRenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("input", {
            class: vue.normalizeClass(["aheart-input__control", controlClass.value]),
            style: vue.normalizeStyle(controlStyle.value),
            id: _ctx.id,
            type: _ctx.type,
            value: currentValue.value,
            placeholder: _ctx.placeholder,
            disabled: isDisabled.value,
            readonly: _ctx.readOnly,
            maxlength: _ctx.maxlength,
            onInput: handleInput,
            onChange: handleChange,
            onKeydown: handleKeydown
          }, null, 46, _hoisted_1),
          showClear.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: vue.normalizeClass(clearClass.value),
            style: vue.normalizeStyle(clearStyle.value),
            type: "button",
            "aria-label": "Clear",
            onClick: handleClear
          }, [
            vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              vue.createVNode(vue.unref(AInputRenderNode), { node: clearIconContent.value }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(suffixClass.value),
            style: vue.normalizeStyle(suffixStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
              vue.createVNode(vue.unref(AInputRenderNode), { node: _ctx.suffix }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          showCountDisplay.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 3,
            class: vue.normalizeClass(countClass.value),
            style: vue.normalizeStyle(countStyle.value)
          }, [
            vue.createVNode(vue.unref(AInputRenderNode), { node: countText.value }, null, 8, ["node"])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6),
        hasAddonAfter.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 1,
          class: vue.normalizeClass(["aheart-input__addon aheart-input__addon--after", addonAfterClass.value]),
          style: vue.normalizeStyle(addonAfterStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "addonAfter", {}, () => [
            vue.createVNode(vue.unref(AInputRenderNode), { node: _ctx.addonAfter }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true)
      ], 6)) : (vue.openBlock(), vue.createElementBlock("span", {
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
            vue.createVNode(vue.unref(AInputRenderNode), { node: _ctx.prefix }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          class: vue.normalizeClass(["aheart-input__control", controlClass.value]),
          style: vue.normalizeStyle(controlStyle.value),
          id: _ctx.id,
          type: _ctx.type,
          value: currentValue.value,
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
            vue.createVNode(vue.unref(AInputRenderNode), { node: clearIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 2,
          class: vue.normalizeClass(suffixClass.value),
          style: vue.normalizeStyle(suffixStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
            vue.createVNode(vue.unref(AInputRenderNode), { node: _ctx.suffix }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        showCountDisplay.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 3,
          class: vue.normalizeClass(countClass.value),
          style: vue.normalizeStyle(countStyle.value)
        }, [
          vue.createVNode(vue.unref(AInputRenderNode), { node: countText.value }, null, 8, ["node"])
        ], 6)) : vue.createCommentVNode("", true)
      ], 6));
    };
  }
});
exports.default = _sfc_main;
