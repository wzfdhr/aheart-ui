"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const activeDragData = vue.shallowRef();
const isDragActive = vue.computed(() => activeDragData.value !== void 0);
const currentDragData = vue.computed(() => activeDragData.value);
const startDrag = (data) => {
  activeDragData.value = data;
};
const endDrag = () => {
  activeDragData.value = void 0;
};
const cancelNativeDrag = (ownerWindow) => {
  if (!ownerWindow) return;
  const event = ownerWindow.document.createEvent("MouseEvent");
  event.initEvent("dragend", true, true);
  ownerWindow.dispatchEvent(event);
};
exports.cancelNativeDrag = cancelNativeDrag;
exports.currentDragData = currentDragData;
exports.endDrag = endDrag;
exports.isDragActive = isDragActive;
exports.startDrag = startDrag;
