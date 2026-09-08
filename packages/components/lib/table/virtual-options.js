"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const positive = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;
const parsedHeight = (value) => {
  if (positive(value))
    return value;
  if (typeof value === "string") {
    const match = /^\s*(\d+(?:\.\d+)?)px\s*$/i.exec(value);
    if (match)
      return Number(match[1]);
    if (/^\s*\d+(?:\.\d+)?\s*$/.test(value))
      return Number(value);
  }
  return void 0;
};
function normalizeTableVirtual(value, scroll, size, warn = (message) => console.warn(message)) {
  const enabled = value === true || value !== false && value !== void 0;
  const config = value && typeof value === "object" ? value : {};
  if (!enabled)
    return { enabled: false, height: 0, estimateSize: 0, overscan: 0 };
  const fromVirtual = config.height;
  const fromScroll = parsedHeight(scroll == null ? void 0 : scroll.y);
  if (fromVirtual !== void 0 && !positive(fromVirtual))
    warn("[ATable] virtual.height must be a positive number.");
  if (fromVirtual !== void 0 && fromScroll !== void 0)
    warn("[ATable] virtual.height takes precedence over scroll.y.");
  const height = positive(fromVirtual) ? fromVirtual : fromScroll ?? 320;
  const defaults = { small: 40, middle: 48, large: 56 };
  if (config.estimateSize !== void 0 && !positive(config.estimateSize))
    warn("[ATable] virtual.estimateSize must be a positive number.");
  if (config.overscan !== void 0 && (!Number.isFinite(config.overscan) || config.overscan < 0))
    warn("[ATable] virtual.overscan must be a non-negative number.");
  return {
    enabled: true,
    height,
    estimateSize: positive(config.estimateSize) ? config.estimateSize : defaults[size] ?? 48,
    overscan: Number.isFinite(config.overscan) && (config.overscan ?? 0) >= 0 ? Math.floor(config.overscan) : 4
  };
}
exports.normalizeTableVirtual = normalizeTableVirtual;
