"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const datePicker_vue_vue_type_script_setup_true_lang = require("./date-picker.vue.js");
const dateRangePicker_vue_vue_type_script_setup_true_lang = require("./date-range-picker.vue.js");
const install = require("../utils/install.js");
const DateRangePicker = install.withInstall(
  dateRangePicker_vue_vue_type_script_setup_true_lang.default,
  "ADateRangePicker"
);
const InstalledDatePicker = install.withInstall(datePicker_vue_vue_type_script_setup_true_lang.default, "ADatePicker");
InstalledDatePicker.RangePicker = DateRangePicker;
const DatePicker = InstalledDatePicker;
exports.DateRangePicker = DateRangePicker;
exports.default = DatePicker;
