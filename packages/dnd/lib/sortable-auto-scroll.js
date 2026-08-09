"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const element = require("@atlaskit/pragmatic-drag-and-drop-auto-scroll/element");
const registrations = /* @__PURE__ */ new WeakMap();
let windowRegistration;
const scrollableOverflow = /* @__PURE__ */ new Set(["auto", "scroll"]);
function findScrollableAncestor(element2) {
  let ancestor = element2.parentElement;
  while (ancestor) {
    const style = window.getComputedStyle(ancestor);
    if (scrollableOverflow.has(style.overflowX) || scrollableOverflow.has(style.overflowY)) return ancestor;
    ancestor = ancestor.parentElement;
  }
  return void 0;
}
function registerSortableAutoScroll(element$1) {
  const ancestor = element$1 && findScrollableAncestor(element$1);
  if (!ancestor) {
    if (windowRegistration) {
      windowRegistration.count += 1;
    } else {
      windowRegistration = { count: 1, cleanup: element.autoScrollWindowForElements() };
    }
    let released2 = false;
    return () => {
      if (released2) return;
      released2 = true;
      if (!windowRegistration) return;
      windowRegistration.count -= 1;
      if (windowRegistration.count === 0) {
        windowRegistration.cleanup();
        windowRegistration = void 0;
      }
    };
  }
  const existing = registrations.get(ancestor);
  if (existing) {
    existing.count += 1;
  } else {
    registrations.set(ancestor, { count: 1, cleanup: element.autoScrollForElements({ element: ancestor }) });
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const registration = registrations.get(ancestor);
    if (!registration) return;
    registration.count -= 1;
    if (registration.count === 0) {
      registration.cleanup();
      registrations.delete(ancestor);
    }
  };
}
exports.registerSortableAutoScroll = registerSortableAutoScroll;
