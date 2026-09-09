"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const getPickerAvailableBlockSize = (trigger, viewportHeight, placement, padding = 12) => {
  const primary = placement.startsWith("top") ? trigger.top - padding : viewportHeight - trigger.bottom - padding;
  return Math.max(0, Math.floor(primary));
};
const getPickerStableAvailableBlockSize = (trigger, viewportHeight, padding = 12) => Math.max(
  0,
  Math.floor(Math.max(trigger.top - padding, viewportHeight - trigger.bottom - padding))
);
exports.getPickerAvailableBlockSize = getPickerAvailableBlockSize;
exports.getPickerStableAvailableBlockSize = getPickerStableAvailableBlockSize;
