"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const floatingPlacements = [
  "top",
  "left",
  "right",
  "bottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
  "leftTop",
  "leftBottom",
  "rightTop",
  "rightBottom"
];
const floatingTriggers = ["hover", "focus", "click", "contextMenu"];
const isFloatingPlacement = (value) => floatingPlacements.includes(value);
const isFloatingTrigger = (value) => floatingTriggers.includes(value);
const isFloatingTriggerProp = (value) => {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === "string" && isFloatingTrigger(item));
  }
  return typeof value === "string" && isFloatingTrigger(value);
};
const normalizeFloatingTriggers = (trigger) => Array.isArray(trigger) ? trigger : [trigger];
const getFloatingPopupStyle = (color, zIndex) => ({
  ...color ? { background: color } : {},
  ...zIndex !== void 0 ? { zIndex } : {}
});
exports.floatingPlacements = floatingPlacements;
exports.floatingTriggers = floatingTriggers;
exports.getFloatingPopupStyle = getFloatingPopupStyle;
exports.isFloatingPlacement = isFloatingPlacement;
exports.isFloatingTrigger = isFloatingTrigger;
exports.isFloatingTriggerProp = isFloatingTriggerProp;
exports.normalizeFloatingTriggers = normalizeFloatingTriggers;
