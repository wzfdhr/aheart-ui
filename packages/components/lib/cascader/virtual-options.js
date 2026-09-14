"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const normalizeVirtualOptions = require("../utils/normalize-virtual-options.js");
const defaults = { height: 256, estimateSize: 32, overscan: 4 };
function normalizeCascaderVirtual(value, warn) {
  return normalizeVirtualOptions.normalizeVirtualOptions(value, defaults, "ACascader", warn, true);
}
exports.normalizeCascaderVirtual = normalizeCascaderVirtual;
