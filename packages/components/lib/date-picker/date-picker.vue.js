"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const dateUtils = require("./date-utils.js");
require("./style.css.js");
const _hoisted_1 = { class: "aheart-date-picker" };
const _hoisted_2 = ["value", "placeholder", "disabled", "readonly"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-date-picker__panel",
  role: "dialog",
  "aria-label": "Choose date"
};
const _hoisted_4 = { class: "aheart-date-picker__header" };
const _hoisted_5 = {
  class: "aheart-date-picker__weekdays",
  "aria-hidden": "true"
};
const _hoisted_6 = {
  class: "aheart-date-picker__grid",
  role: "grid"
};
const _hoisted_7 = ["data-date", "disabled", "onClick"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADatePicker" },
  __name: "date-picker",
  props: {
    modelValue: {},
    defaultValue: {},
    format: { default: "YYYY-MM-DD" },
    placeholder: { default: "Select date" },
    disabled: { type: Boolean },
    readOnly: { type: Boolean },
    disabledDate: {}
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const internalValue = vue.ref(props.defaultValue);
    const open = vue.ref(false);
    const selectedDate = vue.computed(() => dateUtils.parseDate(props.modelValue ?? internalValue.value ?? "", props.format));
    const currentDate = selectedDate.value ?? /* @__PURE__ */ new Date();
    const viewYear = vue.ref(currentDate.getFullYear());
    const viewMonth = vue.ref(currentDate.getMonth());
    const focusedDate = vue.ref(currentDate);
    const inputValue = vue.computed(() => props.modelValue ?? internalValue.value ?? "");
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const calendarDays = vue.computed(() => {
      const first = new Date(viewYear.value, viewMonth.value, 1);
      const start = new Date(viewYear.value, viewMonth.value, 1 - first.getDay());
      return Array.from({ length: 42 }, (_, index) => {
        var _a;
        const value = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
        return {
          value,
          key: dateUtils.formatDate(value, "YYYY-MM-DD"),
          isCurrentMonth: value.getMonth() === viewMonth.value,
          disabled: Boolean((_a = props.disabledDate) == null ? void 0 : _a.call(props, value))
        };
      });
    });
    const moveMonth = (offset) => {
      const next = new Date(viewYear.value, viewMonth.value + offset, 1);
      viewYear.value = next.getFullYear();
      viewMonth.value = next.getMonth();
    };
    const isSelected = (date) => dateUtils.sameDate(date, selectedDate.value);
    const updateValue = (value) => {
      if (props.modelValue === void 0)
        internalValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const selectDate = (date) => {
      var _a;
      if (props.disabled || ((_a = props.disabledDate) == null ? void 0 : _a.call(props, date)))
        return;
      updateValue(dateUtils.formatDate(date, props.format));
      viewYear.value = date.getFullYear();
      viewMonth.value = date.getMonth();
      open.value = false;
    };
    const moveFocus = (offset) => {
      const next = new Date(focusedDate.value.getFullYear(), focusedDate.value.getMonth(), focusedDate.value.getDate() + offset);
      focusedDate.value = next;
      viewYear.value = next.getFullYear();
      viewMonth.value = next.getMonth();
    };
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        open.value = false;
        return;
      }
      const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (event.key in offsets) {
        event.preventDefault();
        open.value = true;
        moveFocus(offsets[event.key]);
        return;
      }
      if (event.key === "Enter" && open.value) {
        event.preventDefault();
        selectDate(focusedDate.value);
      }
    };
    const handleInput = (event) => {
      var _a;
      const value = event.target.value;
      if (!value)
        return updateValue(void 0);
      const date = dateUtils.parseDate(value, props.format);
      if (date && !((_a = props.disabledDate) == null ? void 0 : _a.call(props, date)))
        selectDate(date);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
        vue.createElementVNode("input", {
          class: "aheart-date-picker__input",
          value: inputValue.value,
          placeholder: __props.placeholder,
          disabled: __props.disabled,
          readonly: __props.readOnly,
          onFocus: _cache[0] || (_cache[0] = ($event) => open.value = true),
          onInput: handleInput,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_2),
        open.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
          vue.createElementVNode("div", _hoisted_4, [
            vue.createElementVNode("button", {
              type: "button",
              "aria-label": "Previous month",
              onClick: _cache[1] || (_cache[1] = ($event) => moveMonth(-1))
            }, "‹"),
            vue.createElementVNode("span", null, vue.toDisplayString(viewYear.value) + "-" + vue.toDisplayString(String(viewMonth.value + 1).padStart(2, "0")), 1),
            vue.createElementVNode("button", {
              type: "button",
              "aria-label": "Next month",
              onClick: _cache[2] || (_cache[2] = ($event) => moveMonth(1))
            }, "›")
          ]),
          vue.createElementVNode("div", _hoisted_5, [
            (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(weekDays, (day) => {
              return vue.createElementVNode("span", { key: day }, vue.toDisplayString(day), 1);
            }), 64))
          ]),
          vue.createElementVNode("div", _hoisted_6, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(calendarDays.value, (date) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                key: date.key,
                type: "button",
                "data-date": date.key,
                disabled: date.disabled,
                class: vue.normalizeClass({ "is-outside": !date.isCurrentMonth, "is-selected": isSelected(date.value) }),
                role: "gridcell",
                onClick: ($event) => selectDate(date.value)
              }, vue.toDisplayString(date.value.getDate()), 11, _hoisted_7);
            }), 128))
          ])
        ])) : vue.createCommentVNode("", true)
      ]);
    };
  }
});
exports.default = _sfc_main;
