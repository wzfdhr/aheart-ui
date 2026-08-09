import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
const registrations = /* @__PURE__ */ new WeakMap();
const scrollableOverflow = /* @__PURE__ */ new Set(["auto", "scroll"]);
function hasScrollableAxis(element, overflow, clientSize, scrollSize) {
  return scrollableOverflow.has(overflow) && scrollSize > clientSize;
}
function findScrollableAncestor(element) {
  let ancestor = element.parentElement;
  while (ancestor) {
    const style = window.getComputedStyle(ancestor);
    const scrollsVertically = hasScrollableAxis(ancestor, style.overflowY, ancestor.clientHeight, ancestor.scrollHeight);
    const scrollsHorizontally = hasScrollableAxis(ancestor, style.overflowX, ancestor.clientWidth, ancestor.scrollWidth);
    if (scrollsVertically || scrollsHorizontally) return ancestor;
    ancestor = ancestor.parentElement;
  }
  return void 0;
}
function registerSortableAutoScroll(element) {
  const ancestor = element && findScrollableAncestor(element);
  if (!ancestor) return () => {
  };
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
