"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const pad = (value) => String(value).padStart(2, "0");
const formatDate = (date, format) => format.replace("YYYY", String(date.getFullYear())).replace("MM", pad(date.getMonth() + 1)).replace("DD", pad(date.getDate()));
const parseDate = (value, format) => {
  if (format !== "YYYY-MM-DD")
    return void 0;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match)
    return void 0;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : void 0;
};
const sameDate = (first, second) => first === second || Boolean(first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate());
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.sameDate = sameDate;
