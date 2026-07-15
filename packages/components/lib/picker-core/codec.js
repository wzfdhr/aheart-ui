"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const dayjs = require("./dayjs.js");
const modeFormats = {
  date: "YYYY-MM-DD",
  week: "GGGG-[W]WW",
  month: "YYYY-MM",
  quarter: "YYYY-[Q]Q",
  year: "YYYY"
};
const defaultValueFormat = (mode, showTime = false) => {
  if (mode === "date" && showTime)
    return "YYYY-MM-DD HH:mm:ss";
  return modeFormats[mode];
};
const defaultTimeValueFormat = () => "HH:mm:ss";
const normalizeFormats = (format) => {
  const formats = Array.isArray(format) ? format : [format];
  return formats.filter((item, index) => Boolean(item) && formats.indexOf(item) === index);
};
const parsePickerValue = (value, format) => {
  if (!value)
    return void 0;
  for (const candidate of normalizeFormats(format)) {
    const parsed = dayjs.createPickerDate(value, candidate, true);
    if (parsed.isValid())
      return parsed;
  }
  return void 0;
};
const formatPickerValue = (value, format) => {
  if (!(value == null ? void 0 : value.isValid()))
    return void 0;
  return value.format(format);
};
const comparePickerValues = (left, right, format) => {
  const leftValue = parsePickerValue(left, format);
  const rightValue = parsePickerValue(right, format);
  if (!leftValue || !rightValue)
    return left.localeCompare(right);
  return leftValue.valueOf() - rightValue.valueOf();
};
const shiftPickerValue = (value, amount, unit) => {
  if (!(value == null ? void 0 : value.isValid()))
    return void 0;
  if (unit === "quarter")
    return value.add(amount, "quarter");
  if (unit === "week")
    return value.add(amount * 7, "day");
  return value.add(amount, unit);
};
const clampPickerValue = (value, minValue, maxValue) => {
  if ((minValue == null ? void 0 : minValue.isValid()) && value.isBefore(minValue))
    return minValue;
  if ((maxValue == null ? void 0 : maxValue.isValid()) && value.isAfter(maxValue))
    return maxValue;
  return value;
};
exports.clampPickerValue = clampPickerValue;
exports.comparePickerValues = comparePickerValues;
exports.defaultTimeValueFormat = defaultTimeValueFormat;
exports.defaultValueFormat = defaultValueFormat;
exports.formatPickerValue = formatPickerValue;
exports.normalizeFormats = normalizeFormats;
exports.parsePickerValue = parsePickerValue;
exports.shiftPickerValue = shiftPickerValue;
