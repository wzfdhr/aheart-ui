const positive = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;
function normalizeVirtualOptions(value, defaults, name, warn, compact = false) {
  if (value === false || value === void 0)
    return null;
  if (value === true)
    return { ...defaults };
  const prototype = value && typeof value === "object" ? Object.getPrototypeOf(value) : void 0;
  if (prototype === void 0 || !(prototype === null || Object.prototype.toString.call(value) === "[object Object]" && Object.getPrototypeOf(prototype) === null)) {
    return null;
  }
  const source = value;
  const result = { ...defaults };
  for (const key of ["height", "estimateSize", "overscan"]) {
    if (source[key] === void 0)
      continue;
    const integer = key === "overscan";
    const valid = integer ? typeof source[key] === "number" && Number.isSafeInteger(source[key]) && source[key] >= 0 : compact ? typeof source[key] === "number" && Number.isFinite(source[key]) && source[key] > 0 : positive(source[key]);
    if (valid)
      result[key] = source[key];
  }
  return result;
}
export {
  normalizeVirtualOptions
};
