"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["id", "value", "placeholder", "disabled", "readonly", "min", "max", "step"];
const _hoisted_2 = ["disabled"];
const _hoisted_3 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AInputNumber"
  },
  __name: "input-number",
  props: types.inputNumberProps,
  emits: types.inputNumberEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const slots = vue.useSlots();
    const rootRef = vue.ref();
    const inputRef = vue.ref();
    const uncontrolledValue = vue.ref(props.defaultValue);
    const AInputNumberRenderNode = vue.defineComponent({
      name: "AInputNumberRenderNode",
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
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = vue.computed(() => props.modelValue !== void 0 || props.value !== void 0);
    const mergedValue = vue.computed(
      () => props.modelValue !== void 0 ? props.modelValue : props.value !== void 0 ? props.value : uncontrolledValue.value
    );
    const resolvedVariant = vue.computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const isInteractiveDisabled = vue.computed(() => isDisabled.value || props.readOnly);
    const controlsConfig = vue.computed(
      () => typeof props.controls === "object" && props.controls !== null ? props.controls : void 0
    );
    const showControls = vue.computed(() => props.controls !== false);
    const increaseIcon = vue.computed(() => {
      var _a;
      return ((_a = controlsConfig.value) == null ? void 0 : _a.upIcon) ?? "+";
    });
    const decreaseIcon = vue.computed(() => {
      var _a;
      return ((_a = controlsConfig.value) == null ? void 0 : _a.downIcon) ?? "−";
    });
    const resolvedStep = vue.computed(() => {
      const value = Number(props.step);
      return Number.isFinite(value) ? value : 1;
    });
    const hasPrefix = vue.computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix));
    const hasSuffix = vue.computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix));
    const shouldUseDecimalSeparator = vue.computed(() => Boolean(props.decimalSeparator && props.decimalSeparator !== "."));
    const formatDecimalSeparator = (value) => shouldUseDecimalSeparator.value ? value.replace(".", props.decimalSeparator) : value;
    const parseDecimalSeparator = (value) => shouldUseDecimalSeparator.value ? value.split(props.decimalSeparator).join(".") : value;
    const displayValue = vue.computed(() => {
      const input = mergedValue.value === void 0 ? "" : String(mergedValue.value);
      if (props.formatter) {
        return props.formatter(mergedValue.value, {
          userTyping: false,
          input
        });
      }
      return formatDecimalSeparator(input);
    });
    const inputNumberClass = vue.computed(() => {
      var _a;
      return [
        `aheart-input-number--${resolvedSize.value}`,
        `aheart-input-number--${resolvedVariant.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          [`aheart-input-number--${props.status}`]: props.status,
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
      return ["aheart-input-number__prefix", (_a = props.classNames) == null ? void 0 : _a.prefix];
    });
    const prefixStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.prefix;
    });
    const suffixClass = vue.computed(() => {
      var _a;
      return ["aheart-input-number__suffix", (_a = props.classNames) == null ? void 0 : _a.suffix];
    });
    const suffixStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.suffix;
    });
    const actionsClass = vue.computed(() => {
      var _a;
      return ["aheart-input-number__controls", (_a = props.classNames) == null ? void 0 : _a.actions];
    });
    const actionsStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    const actionClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.action;
    });
    const actionStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.action;
    });
    const applyPrecision = (value) => {
      if (props.precision === void 0) {
        return value;
      }
      return Number(value.toFixed(props.precision));
    };
    const clampValue = (value) => {
      const preciseValue = applyPrecision(value);
      if (props.min !== void 0 && preciseValue < props.min) {
        return props.min;
      }
      if (props.max !== void 0 && preciseValue > props.max) {
        return props.max;
      }
      return preciseValue;
    };
    const emitValue = (value) => {
      if (!isControlled.value) {
        uncontrolledValue.value = value;
      }
      emit("update:modelValue", value);
      emit("change", value);
    };
    const handleInput = (event) => {
      const rawValue = event.target.value;
      if (rawValue === "") {
        emitValue(void 0);
        return;
      }
      const parsedValue = props.parser ? props.parser(rawValue) : Number(parseDecimalSeparator(rawValue));
      if (parsedValue !== void 0 && !Number.isNaN(parsedValue)) {
        emitValue(clampValue(parsedValue));
      }
    };
    const handleStep = (offset, type, emitter) => {
      if (isInteractiveDisabled.value) {
        return;
      }
      const nextValue = clampValue((mergedValue.value ?? 0) + offset);
      emitValue(nextValue);
      emit("step", nextValue, { offset, type, emitter });
    };
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        emit("pressEnter", event);
        return;
      }
      if (!props.keyboard) {
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handleStep(resolvedStep.value, "up", "keydown");
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleStep(-resolvedStep.value, "down", "keydown");
      }
    };
    const handleWheel = (event) => {
      if (!props.changeOnWheel || event.deltaY === 0) {
        return;
      }
      event.preventDefault();
      handleStep(
        event.deltaY < 0 ? resolvedStep.value : -resolvedStep.value,
        event.deltaY < 0 ? "up" : "down",
        "wheel"
      );
    };
    const setCursor = (cursor) => {
      if (!inputRef.value || !cursor) {
        return;
      }
      const length = inputRef.value.value.length;
      if (cursor === "start") {
        inputRef.value.setSelectionRange(0, 0);
        return;
      }
      if (cursor === "end") {
        inputRef.value.setSelectionRange(length, length);
        return;
      }
      inputRef.value.setSelectionRange(0, length);
    };
    const focus = (options) => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.focus({ preventScroll: options == null ? void 0 : options.preventScroll });
      setCursor(options == null ? void 0 : options.cursor);
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    __expose({
      focus,
      blur,
      nativeElement: rootRef
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-input-number", inputNumberClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(prefixClass.value),
          style: vue.normalizeStyle(prefixStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
            vue.createVNode(vue.unref(AInputNumberRenderNode), { node: _ctx.prefix }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          class: vue.normalizeClass(["aheart-input-number__control", controlClass.value]),
          ref_key: "inputRef",
          ref: inputRef,
          style: vue.normalizeStyle(controlStyle.value),
          id: _ctx.id,
          type: "text",
          inputmode: "decimal",
          value: displayValue.value,
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          min: _ctx.min,
          max: _ctx.max,
          step: _ctx.step,
          onInput: handleInput,
          onKeydown: handleKeydown,
          onWheel: handleWheel
        }, null, 46, _hoisted_1),
        hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 1,
          class: vue.normalizeClass(suffixClass.value),
          style: vue.normalizeStyle(suffixStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
            vue.createVNode(vue.unref(AInputNumberRenderNode), { node: _ctx.suffix }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        showControls.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 2,
          class: vue.normalizeClass(actionsClass.value),
          style: vue.normalizeStyle(actionsStyle.value)
        }, [
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["aheart-input-number__increase", actionClass.value]),
            style: vue.normalizeStyle(actionStyle.value),
            type: "button",
            "aria-label": "Increase",
            disabled: isInteractiveDisabled.value,
            onClick: _cache[0] || (_cache[0] = ($event) => handleStep(resolvedStep.value, "up", "handler"))
          }, [
            vue.renderSlot(_ctx.$slots, "increaseIcon", {}, () => [
              vue.createVNode(vue.unref(AInputNumberRenderNode), { node: increaseIcon.value }, null, 8, ["node"])
            ])
          ], 14, _hoisted_2),
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["aheart-input-number__decrease", actionClass.value]),
            style: vue.normalizeStyle(actionStyle.value),
            type: "button",
            "aria-label": "Decrease",
            disabled: isInteractiveDisabled.value,
            onClick: _cache[1] || (_cache[1] = ($event) => handleStep(-resolvedStep.value, "down", "handler"))
          }, [
            vue.renderSlot(_ctx.$slots, "decreaseIcon", {}, () => [
              vue.createVNode(vue.unref(AInputNumberRenderNode), { node: decreaseIcon.value }, null, 8, ["node"])
            ])
          ], 14, _hoisted_3)
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
