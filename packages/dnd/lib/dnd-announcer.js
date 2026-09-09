"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const liveRegions = /* @__PURE__ */ new WeakMap();
function disposeDndLiveRegion(ownerDocument) {
  const state = liveRegions.get(ownerDocument);
  if (!state) return;
  state.token += 1;
  state.element.remove();
  liveRegions.delete(ownerDocument);
}
function acquireDndLiveRegion(ownerDocument) {
  let state = liveRegions.get(ownerDocument);
  if (state && !state.element.isConnected) {
    liveRegions.delete(ownerDocument);
    state = void 0;
  }
  if (!state) {
    const element = ownerDocument.createElement("div");
    element.className = "aheart-dnd-live-region";
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    (ownerDocument.body ?? ownerDocument.documentElement).append(element);
    state = { element, count: 0, token: 0 };
    liveRegions.set(ownerDocument, state);
  }
  state.count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    const hasConnectedOwner = Boolean(ownerDocument.querySelector(".aheart-dnd-sortable-list, .aheart-dnd-draggable, .aheart-dnd-drop-zone"));
    if (state.count > 0 && hasConnectedOwner) return;
    state.count = 0;
    disposeDndLiveRegion(ownerDocument);
  };
}
function announceDnd(ownerDocument, message) {
  if (!ownerDocument) return;
  let state = liveRegions.get(ownerDocument);
  if (state && !state.element.isConnected) {
    liveRegions.delete(ownerDocument);
    state = void 0;
  }
  if (!state) {
    const element = ownerDocument.createElement("div");
    element.className = "aheart-dnd-live-region";
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    (ownerDocument.body ?? ownerDocument.documentElement).append(element);
    state = { element, count: 0, token: 0 };
    liveRegions.set(ownerDocument, state);
  }
  state.token += 1;
  state.element.textContent = message;
}
function replayDnd(ownerDocument, message) {
  if (!ownerDocument) return;
  const state = liveRegions.get(ownerDocument);
  if (!state || !state.element.isConnected) {
    announceDnd(ownerDocument, message);
    return;
  }
  state.token += 1;
  state.element.textContent = "";
  const token = state.token;
  Promise.resolve().then(() => {
    if (liveRegions.get(ownerDocument) !== state || state.token !== token) return;
    state.element.textContent = message;
  });
}
function announceDndNow(ownerDocument, message) {
  if (!ownerDocument) return;
  let state = liveRegions.get(ownerDocument);
  if (state && !state.element.isConnected) {
    liveRegions.delete(ownerDocument);
    state = void 0;
  }
  if (!state) {
    const element = ownerDocument.createElement("div");
    element.className = "aheart-dnd-live-region";
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    (ownerDocument.body ?? ownerDocument.documentElement).append(element);
    state = { element, count: 0, token: 0 };
    liveRegions.set(ownerDocument, state);
  }
  state.token += 1;
  state.element.textContent = message;
}
exports.acquireDndLiveRegion = acquireDndLiveRegion;
exports.announceDnd = announceDnd;
exports.announceDndNow = announceDndNow;
exports.disposeDndLiveRegion = disposeDndLiveRegion;
exports.replayDnd = replayDnd;
