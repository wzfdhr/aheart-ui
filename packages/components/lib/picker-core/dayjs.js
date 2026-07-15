"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const dayjs = require("dayjs");
require("dayjs/locale/en.js");
require("dayjs/locale/zh-cn.js");
const advancedFormat = require("dayjs/plugin/advancedFormat.js");
const customParseFormat = require("dayjs/plugin/customParseFormat.js");
const isoWeek = require("dayjs/plugin/isoWeek.js");
const quarterOfYear = require("dayjs/plugin/quarterOfYear.js");
let configured = false;
const ensurePickerDayjs = () => {
  if (configured)
    return;
  dayjs.extend(advancedFormat);
  dayjs.extend(customParseFormat);
  dayjs.extend(isoWeek);
  dayjs.extend(quarterOfYear);
  configured = true;
};
const createPickerDate = (value, format, strict) => {
  ensurePickerDayjs();
  return format ? dayjs(value, format, strict) : dayjs(value);
};
exports.createPickerDate = createPickerDate;
