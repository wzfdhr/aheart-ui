"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const normalizeVirtualOptions = require("../utils/normalize-virtual-options.js");
const defaults = { height: 320, estimateSize: 28, overscan: 4 };
function normalizeTreeVirtual(value, warn) {
  return normalizeVirtualOptions.normalizeVirtualOptions(value, defaults);
}
exports.normalizeTreeVirtual = normalizeTreeVirtual;
