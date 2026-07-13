import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createVNode, unref, createCommentVNode, createElementVNode } from "vue";
import { inputProps, inputEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _hoisted_2 = ["id", "type", "value", "placeholder", "disabled", "readonly", "maxlength"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AInput"
  },
  __name: "input",
  props: inputProps,
  emits: inputEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const config = useAheartConfig();
    const AInputRenderNode = defineComponent({
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
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = computed(() => formatExceededValue(props.modelValue ?? ""));
    const resolvedVariant = computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAddonBefore = computed(() => Boolean(slots.addonBefore) || hasRenderable(props.addonBefore));
    const hasAddonAfter = computed(() => Boolean(slots.addonAfter) || hasRenderable(props.addonAfter));
    const hasAddon = computed(() => hasAddonBefore.value || hasAddonAfter.value);
    const hasPrefix = computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix));
    const hasSuffix = computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix));
    const allowClearConfig = computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const allowClearDisabled = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.disabled) ?? false;
    });
    const showClear = computed(
      () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && Boolean(currentValue.value)
    );
    const clearIconContent = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const groupClass = computed(() => {
      var _a;
      return [
        "aheart-input-group",
        `aheart-input-group--${resolvedSize.value}`,
        (_a = props.classNames) == null ? void 0 : _a.group
      ];
    });
    const groupStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.group;
    });
    const inputClass = computed(() => {
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const addonBeforeClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.addonBefore;
    });
    const addonBeforeStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.addonBefore;
    });
    const addonAfterClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.addonAfter;
    });
    const addonAfterStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.addonAfter;
    });
    const controlClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.input;
    });
    const controlStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.input;
    });
    const prefixClass = computed(() => {
      var _a;
      return ["aheart-input__prefix", (_a = props.classNames) == null ? void 0 : _a.prefix];
    });
    const prefixStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.prefix;
    });
    const suffixClass = computed(() => {
      var _a;
      return ["aheart-input__suffix", (_a = props.classNames) == null ? void 0 : _a.suffix];
    });
    const suffixStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.suffix;
    });
    const clearClass = computed(() => {
      var _a;
      return ["aheart-input__clear", (_a = props.classNames) == null ? void 0 : _a.clear];
    });
    const clearStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.clear;
    });
    const countClass = computed(() => {
      var _a;
      return ["aheart-input__count", (_a = props.classNames) == null ? void 0 : _a.count];
    });
    const countStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.count;
    });
    const countLength = computed(() => measureCount(currentValue.value));
    const countMaxLength = computed(() => {
      var _a;
      return ((_a = props.count) == null ? void 0 : _a.max) ?? props.maxlength;
    });
    const countInfo = computed(() => ({
      count: countLength.value,
      maxLength: countMaxLength.value,
      value: currentValue.value
    }));
    const showCountFormatter = computed(
      () => typeof props.showCount === "object" && props.showCount !== null ? props.showCount.formatter : void 0
    );
    const showCountDisplay = computed(() => {
      var _a, _b, _c;
      if (((_a = props.count) == null ? void 0 : _a.show) === false) {
        return false;
      }
      return Boolean(props.showCount) || ((_b = props.count) == null ? void 0 : _b.show) === true || typeof ((_c = props.count) == null ? void 0 : _c.show) === "function";
    });
    const countText = computed(() => {
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
      return hasAddon.value ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass(groupClass.value),
        style: normalizeStyle(groupStyle.value)
      }, [
        hasAddonBefore.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-input__addon aheart-input__addon--before", addonBeforeClass.value]),
          style: normalizeStyle(addonBeforeStyle.value)
        }, [
          renderSlot(_ctx.$slots, "addonBefore", {}, () => [
            createVNode(unref(AInputRenderNode), { node: _ctx.addonBefore }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        createElementVNode("span", {
          class: normalizeClass(["aheart-input", inputClass.value]),
          style: normalizeStyle(rootStyle.value)
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(prefixClass.value),
            style: normalizeStyle(prefixStyle.value)
          }, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createVNode(unref(AInputRenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("input", {
            class: normalizeClass(["aheart-input__control", controlClass.value]),
            style: normalizeStyle(controlStyle.value),
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
          showClear.value ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: normalizeClass(clearClass.value),
            style: normalizeStyle(clearStyle.value),
            type: "button",
            "aria-label": "Clear",
            onClick: handleClear
          }, [
            renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              createVNode(unref(AInputRenderNode), { node: clearIconContent.value }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          hasSuffix.value ? (openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(suffixClass.value),
            style: normalizeStyle(suffixStyle.value)
          }, [
            renderSlot(_ctx.$slots, "suffix", {}, () => [
              createVNode(unref(AInputRenderNode), { node: _ctx.suffix }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          showCountDisplay.value ? (openBlock(), createElementBlock("span", {
            key: 3,
            class: normalizeClass(countClass.value),
            style: normalizeStyle(countStyle.value)
          }, [
            createVNode(unref(AInputRenderNode), { node: countText.value }, null, 8, ["node"])
          ], 6)) : createCommentVNode("", true)
        ], 6),
        hasAddonAfter.value ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(["aheart-input__addon aheart-input__addon--after", addonAfterClass.value]),
          style: normalizeStyle(addonAfterStyle.value)
        }, [
          renderSlot(_ctx.$slots, "addonAfter", {}, () => [
            createVNode(unref(AInputRenderNode), { node: _ctx.addonAfter }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true)
      ], 6)) : (openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass(["aheart-input", inputClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        hasPrefix.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(prefixClass.value),
          style: normalizeStyle(prefixStyle.value)
        }, [
          renderSlot(_ctx.$slots, "prefix", {}, () => [
            createVNode(unref(AInputRenderNode), { node: _ctx.prefix }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        createElementVNode("input", {
          class: normalizeClass(["aheart-input__control", controlClass.value]),
          style: normalizeStyle(controlStyle.value),
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
        showClear.value ? (openBlock(), createElementBlock("button", {
          key: 1,
          class: normalizeClass(clearClass.value),
          style: normalizeStyle(clearStyle.value),
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, [
          renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            createVNode(unref(AInputRenderNode), { node: clearIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        hasSuffix.value ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass(suffixClass.value),
          style: normalizeStyle(suffixStyle.value)
        }, [
          renderSlot(_ctx.$slots, "suffix", {}, () => [
            createVNode(unref(AInputRenderNode), { node: _ctx.suffix }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        showCountDisplay.value ? (openBlock(), createElementBlock("span", {
          key: 3,
          class: normalizeClass(countClass.value),
          style: normalizeStyle(countStyle.value)
        }, [
          createVNode(unref(AInputRenderNode), { node: countText.value }, null, 8, ["node"])
        ], 6)) : createCommentVNode("", true)
      ], 6));
    };
  }
});
export {
  _sfc_main as default
};
