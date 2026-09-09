"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const codec = require("../picker-core/codec.js");
const dayjs = require("../picker-core/dayjs.js");
const formatDate = (date, format) => codec.formatPickerValue(
  dayjs.createPickerDate(date.toISOString()),
  format
) ?? "";
const parseDate = (value, format) => {
  if (format !== "YYYY-MM-DD")
    return void 0;
  const parsed = codec.parsePickerValue(value, format);
  if (!parsed || parsed.format(format) !== value)
    return void 0;
  return new Date(parsed.year(), parsed.month(), parsed.date());
};
const sameDate = (first, second) => first === second || Boolean(first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate());
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.sameDate = sameDate;
