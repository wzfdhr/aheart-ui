"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const activeDragData = vue.shallowRef();
const activeByDocument = /* @__PURE__ */ new WeakMap();
const globalDocument = () => typeof globalThis !== "undefined" && "document" in globalThis ? globalThis.document : void 0;
const isDragActive = vue.computed(() => activeDragData.value !== void 0);
const currentDragData = vue.computed(() => activeDragData.value);
const isDragActiveFor = (ownerDocument) => ownerDocument ? activeByDocument.has(ownerDocument) : activeDragData.value !== void 0;
const startDrag = (data, ownerDocument) => {
  if (ownerDocument) {
    activeByDocument.set(ownerDocument, data);
    if (ownerDocument === globalDocument()) activeDragData.value = data;
    return;
  }
  const document = globalDocument();
  if (document) activeByDocument.set(document, data);
  activeDragData.value = data;
};
const endDrag = (ownerDocument) => {
  if (ownerDocument) {
    activeByDocument.delete(ownerDocument);
    if (ownerDocument === globalDocument()) activeDragData.value = void 0;
    return;
  }
  const document = globalDocument();
  if (document) activeByDocument.delete(document);
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
exports.isDragActiveFor = isDragActiveFor;
exports.startDrag = startDrag;
