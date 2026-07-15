"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const pad = (value) => String(value).padStart(2, "0");
const normalizeMeridiem = (value, labels) => {
  if (!labels)
    return value;
  const normalized = value.trim();
  const lowerValue = normalized.toLocaleLowerCase();
  for (const [period, label] of [["AM", labels.am], ["PM", labels.pm]]) {
    const lowerLabel = label.trim().toLocaleLowerCase();
    if (lowerLabel && lowerValue.endsWith(lowerLabel)) {
      return `${normalized.slice(0, normalized.length - label.trim().length).trim()} ${period}`;
    }
  }
  return normalized;
};
const parseTimeValue = (value, labels) => {
  var _a;
  if (!value)
    return void 0;
  const match = normalizeMeridiem(value, labels).match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?(?:\s*(AM|PM))?$/i);
  if (!match)
    return void 0;
  let hour = Number(match[1]);
  const period = (_a = match[4]) == null ? void 0 : _a.toUpperCase();
  if (period) {
    if (hour < 1 || hour > 12)
      return void 0;
    hour = hour % 12 + (period === "PM" ? 12 : 0);
  }
  if (hour > 23)
    return void 0;
  return { hour, minute: Number(match[2]), second: Number(match[3] ?? 0) };
};
const formatTimeValue = (parts, format, labels) => {
  const hour12 = parts.hour % 12 || 12;
  const period = parts.hour >= 12 ? (labels == null ? void 0 : labels.pm) ?? "PM" : (labels == null ? void 0 : labels.am) ?? "AM";
  return format.replace("HH", pad(parts.hour)).replace("hh", pad(hour12)).replace("mm", pad(parts.minute)).replace("ss", pad(parts.second)).replace("A", period);
};
const createTimeOptions = (limit, step, start = 0) => {
  const normalizedStep = Math.max(1, Math.min(limit, Math.floor(step) || 1));
  const values = [];
  for (let value = start; value < limit + start; value += normalizedStep)
    values.push(value);
  return values;
};
const timePartsToSeconds = (parts) => parts.hour * 3600 + parts.minute * 60 + parts.second;
exports.createTimeOptions = createTimeOptions;
exports.formatTimeValue = formatTimeValue;
exports.parseTimeValue = parseTimeValue;
exports.timePartsToSeconds = timePartsToSeconds;
