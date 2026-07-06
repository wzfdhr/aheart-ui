import { defineComponent, useAttrs, useSlots, ref, computed, onMounted, openBlock, createElementBlock, mergeProps, normalizeClass, normalizeStyle, renderSlot, createVNode, unref, createCommentVNode, createElementVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { inputNumberProps, inputNumberEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["id", "type", "inputmode", "value", "placeholder", "disabled", "readonly", "min", "max", "step"];
const _hoisted_2 = ["disabled"];
const _hoisted_3 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AInputNumber",
    inheritAttrs: false
  },
  __name: "input-number",
  props: inputNumberProps,
  emits: inputNumberEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const attrs = useAttrs();
    const slots = useSlots();
    const rootRef = ref();
    const inputRef = ref();
    const uncontrolledValue = ref(props.defaultValue);
    const pendingInputText = ref(void 0);
    const pendingInputValue = ref(void 0);
    const hasPendingInputValue = ref(false);
    const AInputNumberRenderNode = defineComponent({
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
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = computed(() => props.modelValue !== void 0 || props.value !== void 0);
    const mergedValue = computed(
      () => props.modelValue !== void 0 ? props.modelValue : props.value !== void 0 ? props.value : uncontrolledValue.value
    );
    const resolvedVariant = computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const isInteractiveDisabled = computed(() => isDisabled.value || props.readOnly);
    const controlsConfig = computed(
      () => typeof props.controls === "object" && props.controls !== null ? props.controls : void 0
    );
    const showControls = computed(() => props.controls !== false);
    const increaseIcon = computed(() => {
      var _a;
      return ((_a = controlsConfig.value) == null ? void 0 : _a.upIcon) ?? (props.mode === "spinner" ? "+" : "↑");
    });
    const decreaseIcon = computed(() => {
      var _a;
      return ((_a = controlsConfig.value) == null ? void 0 : _a.downIcon) ?? (props.mode === "spinner" ? "-" : "↓");
    });
    const resolvedStep = computed(() => {
      const value = Number(props.step);
      return Number.isFinite(value) ? value : 1;
    });
    const hasPrefix = computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix));
    const hasSuffix = computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix));
    const semanticInfo = computed(() => ({ props }));
    const resolvedClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const resolvedStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const shouldUseDecimalSeparator = computed(() => Boolean(props.decimalSeparator && props.decimalSeparator !== "."));
    const formatDecimalSeparator = (value) => shouldUseDecimalSeparator.value ? value.replace(".", props.decimalSeparator) : value;
    const parseDecimalSeparator = (value) => shouldUseDecimalSeparator.value ? value.split(props.decimalSeparator).join(".") : value;
    const plainDecimalPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
    const isPlainDecimalString = (value) => plainDecimalPattern.test(value.trim());
    const stripLeadingZeros = (value) => value.replace(/^0+(?=\d)/, "") || "0";
    const stripTrailingZeros = (value) => value.replace(/0+$/, "");
    const splitDecimal = (value) => {
      const trimmedValue = value.trim();
      const sign = trimmedValue.startsWith("-") ? -1 : 1;
      const unsignedValue = trimmedValue.replace(/^[+-]/, "");
      const [integer = "0", fraction = ""] = unsignedValue.split(".");
      return {
        sign,
        integer: stripLeadingZeros(integer || "0"),
        fraction
      };
    };
    const padRight = (value, length) => value + "0".repeat(Math.max(0, length - value.length));
    const compareDigits = (left, right) => {
      const normalizedLeft = stripLeadingZeros(left);
      const normalizedRight = stripLeadingZeros(right);
      if (normalizedLeft.length !== normalizedRight.length) {
        return normalizedLeft.length > normalizedRight.length ? 1 : -1;
      }
      return normalizedLeft === normalizedRight ? 0 : normalizedLeft > normalizedRight ? 1 : -1;
    };
    const addDigits = (left, right) => {
      let carry = 0;
      let result = "";
      let leftIndex = left.length - 1;
      let rightIndex = right.length - 1;
      while (leftIndex >= 0 || rightIndex >= 0 || carry > 0) {
        const sum = Number(left[leftIndex] ?? 0) + Number(right[rightIndex] ?? 0) + carry;
        result = String(sum % 10) + result;
        carry = Math.floor(sum / 10);
        leftIndex -= 1;
        rightIndex -= 1;
      }
      return stripLeadingZeros(result);
    };
    const subtractDigits = (left, right) => {
      let borrow = 0;
      let result = "";
      let leftIndex = left.length - 1;
      let rightIndex = right.length - 1;
      while (leftIndex >= 0) {
        let digit = Number(left[leftIndex]) - borrow - Number(right[rightIndex] ?? 0);
        borrow = 0;
        if (digit < 0) {
          digit += 10;
          borrow = 1;
        }
        result = String(digit) + result;
        leftIndex -= 1;
        rightIndex -= 1;
      }
      return stripLeadingZeros(result);
    };
    const toScaledDecimal = (value, scale) => {
      const decimal = splitDecimal(value);
      return {
        sign: decimal.sign,
        digits: stripLeadingZeros(`${decimal.integer}${padRight(decimal.fraction, scale)}`)
      };
    };
    const formatScaledDecimal = (sign, digits, scale) => {
      const normalizedDigits = stripLeadingZeros(digits);
      if (/^0+$/.test(normalizedDigits)) {
        return "0";
      }
      const paddedDigits = normalizedDigits.padStart(scale + 1, "0");
      const integer = scale > 0 ? paddedDigits.slice(0, -scale) : paddedDigits;
      const fraction = scale > 0 ? stripTrailingZeros(paddedDigits.slice(-scale)) : "";
      const signPrefix = sign < 0 ? "-" : "";
      return `${signPrefix}${stripLeadingZeros(integer)}${fraction ? `.${fraction}` : ""}`;
    };
    const addDecimalStrings = (left, right) => {
      if (!isPlainDecimalString(left) || !isPlainDecimalString(right)) {
        return String(Number(left) + Number(right));
      }
      const leftParts = splitDecimal(left);
      const rightParts = splitDecimal(right);
      const scale = Math.max(leftParts.fraction.length, rightParts.fraction.length);
      const scaledLeft = toScaledDecimal(left, scale);
      const scaledRight = toScaledDecimal(right, scale);
      if (scaledLeft.sign === scaledRight.sign) {
        return formatScaledDecimal(scaledLeft.sign, addDigits(scaledLeft.digits, scaledRight.digits), scale);
      }
      const comparison = compareDigits(scaledLeft.digits, scaledRight.digits);
      if (comparison === 0) {
        return "0";
      }
      return comparison > 0 ? formatScaledDecimal(scaledLeft.sign, subtractDigits(scaledLeft.digits, scaledRight.digits), scale) : formatScaledDecimal(scaledRight.sign, subtractDigits(scaledRight.digits, scaledLeft.digits), scale);
    };
    const negateDecimalString = (value) => {
      const trimmedValue = value.trim();
      if (Number(trimmedValue) === 0) {
        return "0";
      }
      return trimmedValue.startsWith("-") ? trimmedValue.slice(1) : `-${trimmedValue}`;
    };
    const compareDecimalStrings = (left, right) => {
      if (!isPlainDecimalString(left) || !isPlainDecimalString(right)) {
        const leftNumber = Number(left);
        const rightNumber = Number(right);
        return leftNumber === rightNumber ? 0 : leftNumber > rightNumber ? 1 : -1;
      }
      const leftParts = splitDecimal(left);
      const rightParts = splitDecimal(right);
      if (leftParts.sign !== rightParts.sign) {
        return leftParts.sign > rightParts.sign ? 1 : -1;
      }
      const scale = Math.max(leftParts.fraction.length, rightParts.fraction.length);
      const comparison = compareDigits(toScaledDecimal(left, scale).digits, toScaledDecimal(right, scale).digits);
      return leftParts.sign < 0 ? -comparison : comparison;
    };
    const isValidValueString = (value) => isPlainDecimalString(value) && Number.isFinite(Number(value));
    const displayValue = computed(() => {
      if (props.changeOnBlur && pendingInputText.value !== void 0) {
        if (props.formatter) {
          return props.formatter(hasPendingInputValue.value ? pendingInputValue.value : mergedValue.value, {
            userTyping: true,
            input: pendingInputText.value
          });
        }
        return pendingInputText.value;
      }
      const input = mergedValue.value === void 0 ? "" : String(mergedValue.value);
      if (props.formatter) {
        return props.formatter(mergedValue.value, {
          userTyping: false,
          input
        });
      }
      return formatDecimalSeparator(input);
    });
    const inputNumberClass = computed(() => [
      `aheart-input-number--${resolvedSize.value}`,
      `aheart-input-number--${resolvedVariant.value}`,
      `aheart-input-number--mode-${props.mode}`,
      props.className,
      props.rootClassName,
      resolvedClassNames.value.root,
      {
        [`aheart-input-number--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-readonly": props.readOnly
      }
    ]);
    const rootStyle = computed(() => [props.style, resolvedStyles.value.root]);
    const controlClass = computed(() => resolvedClassNames.value.input);
    const controlStyle = computed(() => resolvedStyles.value.input);
    const prefixClass = computed(() => ["aheart-input-number__prefix", resolvedClassNames.value.prefix]);
    const prefixStyle = computed(() => resolvedStyles.value.prefix);
    const suffixClass = computed(() => ["aheart-input-number__suffix", resolvedClassNames.value.suffix]);
    const suffixStyle = computed(() => resolvedStyles.value.suffix);
    const actionsClass = computed(() => ["aheart-input-number__controls", resolvedClassNames.value.actions]);
    const actionsStyle = computed(() => resolvedStyles.value.actions);
    const actionClass = computed(() => resolvedClassNames.value.action);
    const actionStyle = computed(() => resolvedStyles.value.action);
    const rootAttrs = computed(() => {
      const result = {};
      if (attrs.class !== void 0) {
        result.class = attrs.class;
      }
      if (attrs.style !== void 0) {
        result.style = attrs.style;
      }
      return result;
    });
    const inputType = computed(
      () => typeof attrs.type === "string" ? attrs.type : "text"
    );
    const inputMode = computed(() => {
      const value = attrs.inputmode ?? attrs.inputMode;
      return typeof value === "string" ? value : "decimal";
    });
    const inputAttrs = computed(
      () => Object.fromEntries(
        Object.entries(attrs).filter(([key]) => !["class", "style", "type", "inputmode", "inputMode"].includes(key))
      )
    );
    const applyPrecision = (value) => {
      if (props.precision === void 0) {
        return value;
      }
      return Number(value.toFixed(props.precision));
    };
    const clampNumberValue = (value) => {
      const preciseValue = applyPrecision(value);
      if (props.min !== void 0 && preciseValue < props.min) {
        return props.min;
      }
      if (props.max !== void 0 && preciseValue > props.max) {
        return props.max;
      }
      return preciseValue;
    };
    const clampStringValue = (value) => {
      if (props.min !== void 0 && compareDecimalStrings(value, String(props.min)) < 0) {
        return String(props.min);
      }
      if (props.max !== void 0 && compareDecimalStrings(value, String(props.max)) > 0) {
        return String(props.max);
      }
      return value;
    };
    const clampValue = (value) => props.stringMode ? clampStringValue(String(value)) : clampNumberValue(Number(value));
    const emitValue = (value) => {
      const nextValue = props.stringMode && value !== void 0 ? String(value) : value;
      if (!isControlled.value) {
        uncontrolledValue.value = nextValue;
      }
      emit("update:modelValue", nextValue);
      emit("change", nextValue);
    };
    const parseInputValue = (rawValue) => {
      if (rawValue === "") {
        return { valid: true, value: void 0 };
      }
      const parsedValue = props.parser ? props.parser(rawValue) : props.stringMode ? parseDecimalSeparator(rawValue) : Number(parseDecimalSeparator(rawValue));
      if (parsedValue === void 0) {
        return { valid: false };
      }
      if (props.stringMode) {
        const stringValue = String(parsedValue);
        if (isValidValueString(stringValue)) {
          return { valid: true, value: clampValue(stringValue) };
        }
        return { valid: false };
      }
      const numericValue = Number(parsedValue);
      if (!Number.isNaN(numericValue)) {
        return { valid: true, value: clampValue(numericValue) };
      }
      return { valid: false };
    };
    const resetPendingInput = () => {
      pendingInputText.value = void 0;
      pendingInputValue.value = void 0;
      hasPendingInputValue.value = false;
    };
    const commitPendingInput = () => {
      if (pendingInputText.value === void 0) {
        return;
      }
      if (hasPendingInputValue.value) {
        emitValue(pendingInputValue.value);
      }
      resetPendingInput();
    };
    const handleInput = (event) => {
      const rawValue = event.target.value;
      const parsedInput = parseInputValue(rawValue);
      if (props.changeOnBlur) {
        pendingInputText.value = rawValue;
        pendingInputValue.value = parsedInput.valid ? parsedInput.value : void 0;
        hasPendingInputValue.value = parsedInput.valid;
        emit("input", rawValue);
        return;
      }
      if (parsedInput.valid) {
        emitValue(parsedInput.value);
      }
      emit("input", rawValue);
    };
    const handleStep = (offset, type, emitter) => {
      if (isInteractiveDisabled.value) {
        return;
      }
      const baseValue = hasPendingInputValue.value ? pendingInputValue.value : mergedValue.value;
      const nextValue = props.stringMode ? clampValue(
        addDecimalStrings(
          String(baseValue ?? 0),
          type === "up" ? String(props.step) : negateDecimalString(String(props.step))
        )
      ) : clampValue(Number(baseValue ?? 0) + offset);
      resetPendingInput();
      emitValue(nextValue);
      emit("step", nextValue, { offset, type, emitter });
    };
    const handleKeydown = (event) => {
      if (event.key === "Enter") {
        commitPendingInput();
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
    const handleBlur = () => {
      commitPendingInput();
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
    onMounted(() => {
      if (props.autoFocus) {
        focus();
      }
    });
    __expose({
      focus,
      blur,
      nativeElement: rootRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", mergeProps({
        ref_key: "rootRef",
        ref: rootRef,
        class: ["aheart-input-number", inputNumberClass.value],
        style: rootStyle.value
      }, rootAttrs.value), [
        hasPrefix.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(prefixClass.value),
          style: normalizeStyle(prefixStyle.value)
        }, [
          renderSlot(_ctx.$slots, "prefix", {}, () => [
            createVNode(unref(AInputNumberRenderNode), { node: _ctx.prefix }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        createElementVNode("input", mergeProps(inputAttrs.value, {
          class: ["aheart-input-number__control", controlClass.value],
          ref_key: "inputRef",
          ref: inputRef,
          style: controlStyle.value,
          id: _ctx.id,
          type: inputType.value,
          inputmode: inputMode.value,
          value: displayValue.value,
          placeholder: _ctx.placeholder,
          disabled: isDisabled.value,
          readonly: _ctx.readOnly,
          min: _ctx.min,
          max: _ctx.max,
          step: _ctx.step,
          onInput: handleInput,
          onKeydown: handleKeydown,
          onBlur: handleBlur,
          onWheel: handleWheel
        }), null, 16, _hoisted_1),
        hasSuffix.value ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(suffixClass.value),
          style: normalizeStyle(suffixStyle.value)
        }, [
          renderSlot(_ctx.$slots, "suffix", {}, () => [
            createVNode(unref(AInputNumberRenderNode), { node: _ctx.suffix }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        showControls.value ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass(actionsClass.value),
          style: normalizeStyle(actionsStyle.value)
        }, [
          createElementVNode("button", {
            class: normalizeClass(["aheart-input-number__increase", actionClass.value]),
            style: normalizeStyle(actionStyle.value),
            type: "button",
            "aria-label": "Increase",
            disabled: isInteractiveDisabled.value,
            onClick: _cache[0] || (_cache[0] = ($event) => handleStep(resolvedStep.value, "up", "handler"))
          }, [
            renderSlot(_ctx.$slots, "increaseIcon", {}, () => [
              createVNode(unref(AInputNumberRenderNode), { node: increaseIcon.value }, null, 8, ["node"])
            ])
          ], 14, _hoisted_2),
          createElementVNode("button", {
            class: normalizeClass(["aheart-input-number__decrease", actionClass.value]),
            style: normalizeStyle(actionStyle.value),
            type: "button",
            "aria-label": "Decrease",
            disabled: isInteractiveDisabled.value,
            onClick: _cache[1] || (_cache[1] = ($event) => handleStep(-resolvedStep.value, "down", "handler"))
          }, [
            renderSlot(_ctx.$slots, "decreaseIcon", {}, () => [
              createVNode(unref(AInputNumberRenderNode), { node: decreaseIcon.value }, null, 8, ["node"])
            ])
          ], 14, _hoisted_3)
        ], 6)) : createCommentVNode("", true)
      ], 16);
    };
  }
});
export {
  _sfc_main as default
};
