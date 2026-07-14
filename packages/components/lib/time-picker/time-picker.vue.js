"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-time-picker" };
const _hoisted_2 = ["value", "placeholder", "disabled", "readonly"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-time-picker__panel",
  role: "listbox",
  "aria-label": "Choose time"
};
const _hoisted_4 = ["data-time", "disabled", "aria-selected", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ATimePicker" },
  __name: "time-picker",
  props: {
    modelValue: {},
    defaultValue: {},
    placeholder: { default: "Select time" },
    disabled: { type: Boolean },
    readOnly: { type: Boolean },
    minuteStep: { default: 15 },
    disabledTime: {}
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const internalValue = vue.ref(props.defaultValue);
    const open = vue.ref(false);
    const inputValue = vue.computed(() => props.modelValue ?? internalValue.value ?? "");
    const times = vue.computed(() => {
      const step = Math.max(1, Math.min(60, props.minuteStep));
      return Array.from(
        { length: 24 },
        (_, hour) => Array.from({ length: Math.ceil(60 / step) }, (_2, index) => {
          const minute = index * step;
          return minute < 60 ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` : void 0;
        }).filter((time) => time !== void 0)
      ).flat();
    });
    const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    const updateValue = (value) => {
      if (props.modelValue === void 0)
        internalValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const selectTime = (time) => {
      var _a;
      if (props.disabled || ((_a = props.disabledTime) == null ? void 0 : _a.call(props, time)))
        return;
      updateValue(time);
      open.value = false;
    };
    const handleInput = (event) => {
      var _a;
      const value = event.target.value;
      if (!value)
        return updateValue(void 0);
      if (isTime(value) && !((_a = props.disabledTime) == null ? void 0 : _a.call(props, value)))
        selectTime(value);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
        vue.createElementVNode("input", {
          class: "aheart-time-picker__input",
          value: inputValue.value,
          placeholder: __props.placeholder,
          disabled: __props.disabled,
          readonly: __props.readOnly,
          onFocus: _cache[0] || (_cache[0] = ($event) => open.value = true),
          onInput: handleInput,
          onKeydown: _cache[1] || (_cache[1] = vue.withKeys(($event) => open.value = false, ["esc"]))
        }, null, 40, _hoisted_2),
        open.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(times.value, (time) => {
            var _a;
            return vue.openBlock(), vue.createElementBlock("button", {
              key: time,
              type: "button",
              "data-time": time,
              disabled: Boolean((_a = __props.disabledTime) == null ? void 0 : _a.call(__props, time)),
              class: vue.normalizeClass({ "is-selected": time === inputValue.value }),
              role: "option",
              "aria-selected": time === inputValue.value,
              onClick: ($event) => selectTime(time)
            }, vue.toDisplayString(time), 11, _hoisted_4);
          }), 128))
        ])) : vue.createCommentVNode("", true)
      ]);
    };
  }
});
exports.default = _sfc_main;
