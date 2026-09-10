"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const DEFAULTS = { height: 256, estimateSize: 28, overscan: 4 };
const positive = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;
const plain = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.prototype.toString.call(value) === "[object Object]" && Object.getPrototypeOf(prototype) === null;
};
function normalizeTreeSelectVirtual(value, warn) {
  if (value === false || value === void 0)
    return null;
  if (value === true)
    return { ...DEFAULTS };
  if (!plain(value)) {
    warn == null ? void 0 : warn("[ATreeSelect] invalid virtual options; virtualization is disabled.");
    return null;
  }
  const source = value;
  const result = { ...DEFAULTS };
  if (source.height !== void 0) {
    if (positive(source.height))
      result.height = source.height;
    else
      warn == null ? void 0 : warn("[ATreeSelect] virtual.height must be a positive number; using the default.");
  }
  if (source.estimateSize !== void 0) {
    if (positive(source.estimateSize))
      result.estimateSize = source.estimateSize;
    else
      warn == null ? void 0 : warn("[ATreeSelect] virtual.estimateSize must be a positive number; using the default.");
  }
  if (source.overscan !== void 0) {
    if (typeof source.overscan === "number" && Number.isSafeInteger(source.overscan) && source.overscan >= 0)
      result.overscan = source.overscan;
    else
      warn == null ? void 0 : warn("[ATreeSelect] virtual.overscan must be a non-negative safe integer; using the default.");
  }
  return result;
}
exports.normalizeTreeSelectVirtual = normalizeTreeSelectVirtual;
