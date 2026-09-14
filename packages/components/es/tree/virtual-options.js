import { normalizeVirtualOptions } from "../utils/normalize-virtual-options.js";
const defaults = { height: 320, estimateSize: 28, overscan: 4 };
function normalizeTreeVirtual(value, warn) {
  return normalizeVirtualOptions(value, defaults);
}
export {
  normalizeTreeVirtual
};
