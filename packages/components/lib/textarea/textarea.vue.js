"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const usePropPresence = require("../utils/use-prop-presence.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["id", "value", "placeholder", "rows", "disabled", "readonly", "maxlength", "aria-invalid"];
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
    const textareaRef = vue.ref();
    const ATextareaRenderNode = vue.defineComponent({
      name: "ATextareaRenderNode",
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
    const draftValue = vue.ref(formatExceededValue(props.modelValue ?? ""));
    const isControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const currentValue = vue.computed(() => formatExceededValue(isControlled.value ? props.modelValue ?? "" : draftValue.value));
    const resolvedVariant = vue.computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const hasAutoSize = vue.computed(() => Boolean(props.autoSize));
    const allowClearConfig = vue.computed(
      () => typeof props.allowClear === "object" && props.allowClear !== null ? props.allowClear : void 0
    );
    const allowClearDisabled = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.disabled) ?? false;
    });
    const showClear = vue.computed(
      () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && !props.readOnly && Boolean(currentValue.value)
    );
    const clearIconContent = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const textareaClass = vue.computed(() => {
      var _a;
      return [
        `aheart-textarea--${resolvedSize.value}`,
        `aheart-textarea--${resolvedVariant.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          [`aheart-textarea--${props.status}`]: props.status,
          "is-autosize": hasAutoSize.value,
          "is-disabled": isDisabled.value,
          "is-readonly": props.readOnly,
          "has-clear": showClear.value,
          "has-count": showCountDisplay.value,
          "is-count-exceeded": countExceeded.value
        }
      ];
    });
    const autoSizeStyle = vue.computed(() => {
      if (!props.autoSize || typeof props.autoSize === "boolean") {
        return void 0;
      }
      return {
        ...props.autoSize.minRows ? { "--aheart-textarea-min-rows": props.autoSize.minRows } : {},
        ...props.autoSize.maxRows ? { "--aheart-textarea-max-rows": props.autoSize.maxRows } : {}
      };
    });
    const textareaStyle = vue.computed(() => {
      var _a;
      return [autoSizeStyle.value, props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const controlClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.textarea;
    });
    const controlStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.textarea;
    });
    const clearClass = vue.computed(() => {
      var _a;
      return ["aheart-textarea__clear", (_a = props.classNames) == null ? void 0 : _a.clear];
    });
    const clearStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.clear;
    });
    const countClass = vue.computed(() => {
      var _a;
      return ["aheart-textarea__count", (_a = props.classNames) == null ? void 0 : _a.count];
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
    const countExceeded = vue.computed(
      () => countMaxLength.value !== void 0 && countLength.value > countMaxLength.value
    );
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
    const resizeTextarea = () => {
      const textarea = textareaRef.value;
      if (!textarea || !props.autoSize || typeof window === "undefined") {
        return;
      }
      textarea.style.height = "auto";
      const style = window.getComputedStyle(textarea);
      const fontSize = Number.parseFloat(style.fontSize) || 14;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.5715;
      const verticalPadding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
      const config2 = typeof props.autoSize === "object" ? props.autoSize : void 0;
      const minHeight = (config2 == null ? void 0 : config2.minRows) ? config2.minRows * lineHeight + verticalPadding : 0;
      const maxHeight = (config2 == null ? void 0 : config2.maxRows) ? config2.maxRows * lineHeight + verticalPadding : Number.POSITIVE_INFINITY;
      const contentHeight = Math.max(textarea.scrollHeight, minHeight);
      const height = Math.min(contentHeight, maxHeight);
      textarea.style.height = `${Math.round(height * 100) / 100}px`;
      textarea.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
    };
    const scheduleResize = () => {
      void vue.nextTick(resizeTextarea);
    };
    const handleInput = (event) => {
      const value = getEventValue(event);
      if (!isControlled.value)
        draftValue.value = value;
      emit("update:modelValue", value);
      emit("input", value);
      if (isControlled.value)
        event.target.value = currentValue.value;
      scheduleResize();
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
      if (isDisabled.value || props.readOnly || allowClearDisabled.value)
        return;
      if (!isControlled.value)
        draftValue.value = "";
      emit("update:modelValue", "");
      emit("input", "");
      emit("clear");
      scheduleResize();
    };
    vue.watch(
      () => props.modelValue,
      (value) => {
        draftValue.value = formatExceededValue(value ?? "");
        scheduleResize();
      }
    );
    vue.watch(() => props.autoSize, scheduleResize, { deep: true });
    vue.onMounted(resizeTextarea);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-textarea", textareaClass.value]),
        style: vue.normalizeStyle(textareaStyle.value)
      }, [
        vue.createElementVNode("textarea", {
          ref_key: "textareaRef",
          ref: textareaRef,
          class: vue.normalizeClass(["aheart-textarea__control", controlClass.value]),
          style: vue.normalizeStyle(controlStyle.value),
          id: _ctx.id,
          value: currentValue.value,
          placeholder: _ctx.placeholder,
          rows: _ctx.rows,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          maxlength: _ctx.maxlength,
          "aria-invalid": props.status === "error" || countExceeded.value ? "true" : void 0,
          onInput: handleInput,
          onChange: handleChange,
          onKeydown: handleKeydown
        }, null, 46, _hoisted_1),
        showClear.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: vue.normalizeClass(clearClass.value),
          style: vue.normalizeStyle(clearStyle.value),
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, [
          vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            vue.createVNode(vue.unref(ATextareaRenderNode), { node: clearIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        showCountDisplay.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 1,
          class: vue.normalizeClass(countClass.value),
          style: vue.normalizeStyle(countStyle.value)
        }, [
          vue.createVNode(vue.unref(ATextareaRenderNode), { node: countText.value }, null, 8, ["node"])
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
