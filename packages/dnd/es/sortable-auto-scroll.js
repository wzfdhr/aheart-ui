import { autoScrollWindowForElements, autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/dist/cjs/entry-point/element.js";
const registrations = /* @__PURE__ */ new WeakMap();
let windowRegistration;
const scrollableOverflow = /* @__PURE__ */ new Set(["auto", "scroll"]);
function findScrollableAncestor(element) {
  let ancestor = element.parentElement;
  while (ancestor) {
    const style = window.getComputedStyle(ancestor);
    if (scrollableOverflow.has(style.overflowX) || scrollableOverflow.has(style.overflowY)) return ancestor;
    ancestor = ancestor.parentElement;
  }
  return void 0;
}
function registerSortableAutoScroll(element) {
  const ancestor = element && findScrollableAncestor(element);
  if (!ancestor) {
    if (windowRegistration) {
      windowRegistration.count += 1;
    } else {
      windowRegistration = { count: 1, cleanup: autoScrollWindowForElements() };
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
    registrations.set(ancestor, { count: 1, cleanup: autoScrollForElements({ element: ancestor }) });
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
export {
  registerSortableAutoScroll
};
