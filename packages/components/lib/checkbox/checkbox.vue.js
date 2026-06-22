"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["title"];
const _hoisted_2 = { class: "aheart-checkbox__box" };
const _hoisted_3 = ["name", "value", "checked", "disabled", "aria-checked"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACheckbox"
  },
  __name: "checkbox",
  props: types.checkboxProps,
  emits: types.checkboxEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const internalChecked = vue.ref(props.defaultChecked ?? false);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const isControlled = vue.computed(() => props.checked !== void 0 || props.modelValue !== void 0);
    const mergedChecked = vue.computed(() => props.checked ?? props.modelValue ?? internalChecked.value);
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
      const checked = event.target.checked;
      if (!isControlled.value) {
        internalChecked.value = checked;
      }
      emit("update:modelValue", checked);
      emit("update:checked", checked);
      emit("change", checked, event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("label", {
        class: vue.normalizeClass(["aheart-checkbox", checkboxClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        title: _ctx.title
      }, [
        vue.createElementVNode("span", _hoisted_2, [
          vue.createElementVNode("input", {
            class: "aheart-checkbox__input",
            type: "checkbox",
            name: _ctx.name,
            value: _ctx.value,
            checked: mergedChecked.value,
            disabled: isDisabled.value,
            "aria-checked": _ctx.indeterminate ? "mixed" : mergedChecked.value ? "true" : "false",
            onChange: handleChange
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
