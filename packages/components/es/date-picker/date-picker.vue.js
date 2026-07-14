import { defineComponent, ref, computed, openBlock, createElementBlock, createElementVNode, toDisplayString, Fragment, renderList, normalizeClass, createCommentVNode } from "vue";
import { parseDate, formatDate, sameDate } from "./date-utils.js";
import "./style.css.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const internalValue = ref(props.defaultValue);
    const open = ref(false);
    const selectedDate = computed(() => parseDate(props.modelValue ?? internalValue.value ?? "", props.format));
    const currentDate = selectedDate.value ?? /* @__PURE__ */ new Date();
    const viewYear = ref(currentDate.getFullYear());
    const viewMonth = ref(currentDate.getMonth());
    const focusedDate = ref(currentDate);
    const inputValue = computed(() => props.modelValue ?? internalValue.value ?? "");
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const calendarDays = computed(() => {
      const first = new Date(viewYear.value, viewMonth.value, 1);
      const start = new Date(viewYear.value, viewMonth.value, 1 - first.getDay());
      return Array.from({ length: 42 }, (_, index) => {
        var _a;
        const value = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
        return {
          value,
          key: formatDate(value, "YYYY-MM-DD"),
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
    const isSelected = (date) => sameDate(date, selectedDate.value);
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
      updateValue(formatDate(date, props.format));
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
      const date = parseDate(value, props.format);
      if (date && !((_a = props.disabledDate) == null ? void 0 : _a.call(props, date)))
        selectDate(date);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", _hoisted_1, [
        createElementVNode("input", {
          class: "aheart-date-picker__input",
          value: inputValue.value,
          placeholder: __props.placeholder,
          disabled: __props.disabled,
          readonly: __props.readOnly,
          onFocus: _cache[0] || (_cache[0] = ($event) => open.value = true),
          onInput: handleInput,
          onKeydown: handleKeydown
        }, null, 40, _hoisted_2),
        open.value ? (openBlock(), createElementBlock("div", _hoisted_3, [
          createElementVNode("div", _hoisted_4, [
            createElementVNode("button", {
              type: "button",
              "aria-label": "Previous month",
              onClick: _cache[1] || (_cache[1] = ($event) => moveMonth(-1))
            }, "‹"),
            createElementVNode("span", null, toDisplayString(viewYear.value) + "-" + toDisplayString(String(viewMonth.value + 1).padStart(2, "0")), 1),
            createElementVNode("button", {
              type: "button",
              "aria-label": "Next month",
              onClick: _cache[2] || (_cache[2] = ($event) => moveMonth(1))
            }, "›")
          ]),
          createElementVNode("div", _hoisted_5, [
            (openBlock(), createElementBlock(Fragment, null, renderList(weekDays, (day) => {
              return createElementVNode("span", { key: day }, toDisplayString(day), 1);
            }), 64))
          ]),
          createElementVNode("div", _hoisted_6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(calendarDays.value, (date) => {
              return openBlock(), createElementBlock("button", {
                key: date.key,
                type: "button",
                "data-date": date.key,
                disabled: date.disabled,
                class: normalizeClass({ "is-outside": !date.isCurrentMonth, "is-selected": isSelected(date.value) }),
                role: "gridcell",
                onClick: ($event) => selectDate(date.value)
              }, toDisplayString(date.value.getDate()), 11, _hoisted_7);
            }), 128))
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
