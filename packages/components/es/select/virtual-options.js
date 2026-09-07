const DEFAULTS = { height: 288, estimateSize: 32, overscan: 3 };
const isPlainObject = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
};
const warnInvalid = (warn, field, value) => {
  warn == null ? void 0 : warn(`Invalid select virtual ${field} value; using the default.`);
};
const normalizeSelectVirtual = (value, warn) => {
  if (value === false || value === void 0)
    return null;
  if (value === true)
    return { ...DEFAULTS };
  if (!isPlainObject(value)) {
    warn == null ? void 0 : warn("Invalid select virtual options; virtualization is disabled.");
    return null;
  }
  const result = { ...DEFAULTS };
  if (value.height !== void 0) {
    if (typeof value.height === "number" && Number.isFinite(value.height) && value.height > 0)
      result.height = value.height;
    else
      warnInvalid(warn, "height", value.height);
  }
  if (value.estimateSize !== void 0) {
    if (typeof value.estimateSize === "number" && Number.isFinite(value.estimateSize) && value.estimateSize > 0)
      result.estimateSize = value.estimateSize;
    else
      warnInvalid(warn, "estimateSize", value.estimateSize);
  }
  if (value.overscan !== void 0) {
    if (typeof value.overscan === "number" && Number.isSafeInteger(value.overscan) && value.overscan >= 0)
      result.overscan = value.overscan;
    else
      warnInvalid(warn, "overscan", value.overscan);
  }
  return result;
};
export {
  normalizeSelectVirtual
};
