"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const normalizeVirtualOptions = require("../utils/normalize-virtual-options.js");
const defaults = { height: 256, estimateSize: 28, overscan: 4 };
function normalizeTreeSelectVirtual(value, warn) {
  return normalizeVirtualOptions.normalizeVirtualOptions(value, defaults, "ATreeSelect", warn);
}
exports.normalizeTreeSelectVirtual = normalizeTreeSelectVirtual;
