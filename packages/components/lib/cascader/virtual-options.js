"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const defaults = { height: 256, estimateSize: 32, overscan: 4 };
const plain = (value) => {
  if (!value || typeof value !== "object")
    return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.prototype.toString.call(value) === "[object Object]" && Object.getPrototypeOf(proto) === null;
};
const normalizeCascaderVirtual = (value, warn) => {
  if (value === false || value === void 0)
    return null;
  if (value === true)
    return { ...defaults };
  if (!plain(value)) {
    warn == null ? void 0 : warn("[ACascader] invalid virtual options; virtualization is disabled.");
    return null;
  }
  const result = { ...defaults };
  const source = value;
  if (source.height !== void 0)
    typeof source.height === "number" && Number.isFinite(source.height) && source.height > 0 ? result.height = source.height : warn == null ? void 0 : warn("[ACascader] virtual.height must be positive; using default.");
  if (source.estimateSize !== void 0)
    typeof source.estimateSize === "number" && Number.isFinite(source.estimateSize) && source.estimateSize > 0 ? result.estimateSize = source.estimateSize : warn == null ? void 0 : warn("[ACascader] virtual.estimateSize must be positive; using default.");
  if (source.overscan !== void 0)
    typeof source.overscan === "number" && Number.isSafeInteger(source.overscan) && source.overscan >= 0 ? result.overscan = source.overscan : warn == null ? void 0 : warn("[ACascader] virtual.overscan must be non-negative safe integer; using default.");
  return result;
};
exports.normalizeCascaderVirtual = normalizeCascaderVirtual;
