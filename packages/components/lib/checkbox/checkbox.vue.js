"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const usePropPresence = require("../utils/use-prop-presence.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["title"];
const _hoisted_2 = { class: "aheart-checkbox__box" };
const _hoisted_3 = ["name", "value", "checked", "indeterminate", "disabled", "aria-checked"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACheckbox"
  },
  __name: "checkbox",
  props: types.checkboxProps,
  emits: types.checkboxEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const rootRef = vue.ref();
    const inputRef = vue.ref();
    const internalChecked = vue.ref(props.defaultChecked ?? false);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const hasChecked = usePropPresence.usePropPresence("checked");
    const hasModelValue = usePropPresence.usePropPresence("modelValue", "model-value");
    const isControlled = vue.computed(() => hasChecked.value || hasModelValue.value);
    const mergedChecked = vue.computed(() => hasChecked.value ? Boolean(props.checked) : hasModelValue.value ? Boolean(props.modelValue) : internalChecked.value);
    const checkboxClass = vue.computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-checked": mergedChecked.value,
          "is-indeterminate": props.indeterminate,
          "is-disabled": isDisabled.value
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconClass = vue.computed(() => {
      var _a;
      return ["aheart-checkbox__inner", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const iconStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const labelClass = vue.computed(() => {
      var _a;
      return ["aheart-checkbox__label", (_a = props.classNames) == null ? void 0 : _a.label];
    });
    const labelStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.label;
    });
    const handleChange = (event) => {
      const target = event.target;
      const checked = target.checked;
      if (!isControlled.value) {
        internalChecked.value = checked;
      } else {
        target.checked = mergedChecked.value;
      }
      emit("update:modelValue", checked);
      emit("update:checked", checked);
      emit("change", checked, event);
    };
    const handleFocus = (event) => {
      emit("focus", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    const focus = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    vue.onMounted(() => {
      if (props.autoFocus) {
        vue.nextTick(focus);
      }
    });
    vue.watchEffect(() => {
      if (inputRef.value)
        inputRef.value.indeterminate = props.indeterminate;
    });
    __expose({
      focus,
      blur,
      nativeElement: rootRef
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("label", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-checkbox", checkboxClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        title: _ctx.title
      }, [
        vue.createElementVNode("span", _hoisted_2, [
          vue.createElementVNode("input", {
            ref_key: "inputRef",
            ref: inputRef,
            class: "aheart-checkbox__input",
            type: "checkbox",
            name: _ctx.name,
            value: _ctx.value,
            checked: mergedChecked.value,
            indeterminate: _ctx.indeterminate,
            disabled: isDisabled.value,
            "aria-checked": _ctx.indeterminate ? "mixed" : mergedChecked.value ? "true" : "false",
            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur
          }, null, 40, _hoisted_3),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(iconClass.value),
            style: vue.normalizeStyle(iconStyle.value),
            "aria-hidden": "true"
          }, null, 6)
        ]),
        vue.createElementVNode("span", {
          class: vue.normalizeClass(labelClass.value),
          style: vue.normalizeStyle(labelStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
          ])
        ], 6)
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
