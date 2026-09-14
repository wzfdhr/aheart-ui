import { normalizeVirtualOptions } from "../utils/normalize-virtual-options.js";
const defaults = { height: 256, estimateSize: 28, overscan: 4 };
function normalizeTreeSelectVirtual(value, warn) {
  return normalizeVirtualOptions(value, defaults, "ATreeSelect", warn);
}
export {
  normalizeTreeSelectVirtual
};
