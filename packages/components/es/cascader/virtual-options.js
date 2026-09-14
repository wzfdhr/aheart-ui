import { normalizeVirtualOptions } from "../utils/normalize-virtual-options.js";
const defaults = { height: 256, estimateSize: 32, overscan: 4 };
function normalizeCascaderVirtual(value, warn) {
  return normalizeVirtualOptions(value, defaults, "ACascader", warn, true);
}
export {
  normalizeCascaderVirtual
};
