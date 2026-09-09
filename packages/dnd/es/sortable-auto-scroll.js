import { autoScrollForElements, autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/dist/cjs/entry-point/element.js";
import { isDragActiveFor } from "./drag-state.js";
const registrations = /* @__PURE__ */ new WeakMap();
const windowRegistrations = /* @__PURE__ */ new WeakMap();
const ownerRegistrations = /* @__PURE__ */ new WeakMap();
const scrollableOverflow = /* @__PURE__ */ new Set(["auto", "scroll"]);
function findScrollableAncestors(element) {
  const ownerWindow = element.ownerDocument.defaultView;
  const ancestors = [];
  let ancestor = element.parentElement;
  while (ancestor) {
    const style = ownerWindow == null ? void 0 : ownerWindow.getComputedStyle(ancestor);
    if (style && (scrollableOverflow.has(style.overflowX) || scrollableOverflow.has(style.overflowY))) ancestors.push(ancestor);
    ancestor = ancestor.parentElement;
  }
  return ancestors;
}
function retainElementRegistration(ancestor) {
  const existing = registrations.get(ancestor);
  if (existing) existing.count += 1;
  else registrations.set(ancestor, { count: 1, cleanup: autoScrollForElements({ element: ancestor }) });
  return () => {
    const registration = registrations.get(ancestor);
    if (!registration) return;
    registration.count -= 1;
    if (registration.count === 0) {
      registration.cleanup();
      registrations.delete(ancestor);
    }
  };
}
function retainMainWindow(ownerDocument) {
  const existing = windowRegistrations.get(ownerDocument);
  if (existing) existing.count += 1;
  else windowRegistrations.set(ownerDocument, { count: 1, cleanup: autoScrollWindowForElements() });
  return () => {
    const registration = windowRegistrations.get(ownerDocument);
    if (!registration) return;
    registration.count -= 1;
    if (registration.count === 0) {
      registration.cleanup();
      windowRegistrations.delete(ownerDocument);
    }
  };
}
function retainOwnerWindow(element) {
  const ownerDocument = element.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  if (!ownerWindow) return () => void 0;
  const ancestors = findScrollableAncestors(element);
  const existing = ownerRegistrations.get(ownerDocument);
  if (existing) {
    existing.count += 1;
    ancestors.forEach((ancestor) => existing.ancestors.set(ancestor, (existing.ancestors.get(ancestor) ?? 0) + 1));
    return () => {
      const active = ownerRegistrations.get(ownerDocument);
      if (!active) return;
      active.count -= 1;
      ancestors.forEach((ancestor) => {
        const count = active.ancestors.get(ancestor) ?? 0;
        if (count <= 1) active.ancestors.delete(ancestor);
        else active.ancestors.set(ancestor, count - 1);
      });
      if (active.count === 0) {
        active.cleanup();
        ownerRegistrations.delete(ownerDocument);
      }
    };
  }
  let raf = 0;
  let pointerX = 0;
  let pointerY = 0;
  const stopFrame = () => {
    if (!raf) return;
    if (ownerWindow.cancelAnimationFrame) ownerWindow.cancelAnimationFrame(raf);
    else ownerWindow.clearTimeout(raf);
    raf = 0;
  };
  const scroll = () => {
    var _a, _b;
    raf = 0;
    if (!isDragActiveFor(ownerDocument)) return;
    const edge = 36;
    let consumed = false;
    let edgeRequested = false;
    for (const ancestor of registration.ancestors.keys()) {
      const rect = ancestor.getBoundingClientRect();
      let x = pointerX < rect.left + edge ? -16 : pointerX > rect.right - edge ? 16 : 0;
      let y = pointerY < rect.top + edge ? -16 : pointerY > rect.bottom - edge ? 16 : 0;
      if (x || y) edgeRequested = true;
      if (x > 0 && ancestor.scrollLeft >= ancestor.scrollWidth - ancestor.clientWidth) x = 0;
      if (x < 0 && ancestor.scrollLeft <= 0) x = 0;
      if (y > 0 && ancestor.scrollTop >= ancestor.scrollHeight - ancestor.clientHeight) y = 0;
      if (y < 0 && ancestor.scrollTop <= 0) y = 0;
      if (x || y) {
        ancestor.scrollLeft += x;
        ancestor.scrollTop += y;
        consumed = true;
        break;
      }
    }
    if (!consumed) {
      const root = ownerDocument.scrollingElement;
      let x = pointerX < edge ? -16 : pointerX > (ownerWindow.innerWidth || 0) - edge ? 16 : 0;
      let y = pointerY < edge ? -16 : pointerY > (ownerWindow.innerHeight || 0) - edge ? 16 : 0;
      if (x || y) edgeRequested = true;
      if (root) {
        if (x > 0 && root.scrollLeft >= root.scrollWidth - root.clientWidth) x = 0;
        if (x < 0 && root.scrollLeft <= 0) x = 0;
        if (y > 0 && root.scrollTop >= root.scrollHeight - root.clientHeight) y = 0;
        if (y < 0 && root.scrollTop <= 0) y = 0;
      }
      if (x || y) {
        (_a = ownerWindow.scrollBy) == null ? void 0 : _a.call(ownerWindow, x, y);
        consumed = true;
      }
    }
    if (isDragActiveFor(ownerDocument) && consumed && edgeRequested && !raf) raf = ((_b = ownerWindow.requestAnimationFrame) == null ? void 0 : _b.call(ownerWindow, scroll)) ?? ownerWindow.setTimeout(scroll, 16);
  };
  const schedule = (event) => {
    var _a;
    const point = event;
    pointerX = point.clientX ?? pointerX;
    pointerY = point.clientY ?? pointerY;
    if (!isDragActiveFor(ownerDocument) || raf) return;
    raf = ((_a = ownerWindow.requestAnimationFrame) == null ? void 0 : _a.call(ownerWindow, scroll)) ?? ownerWindow.setTimeout(scroll, 16);
  };
  const stop = () => stopFrame();
  const cleanup = () => {
    ownerDocument.removeEventListener("dragover", schedule);
    ownerDocument.removeEventListener("pointermove", schedule);
    ownerWindow.removeEventListener("dragend", stop);
    ownerWindow.removeEventListener("pointerup", stop);
    ownerWindow.removeEventListener("blur", stop);
    ownerWindow.removeEventListener("pagehide", stop);
    if (raf) {
      if (ownerWindow.cancelAnimationFrame) ownerWindow.cancelAnimationFrame(raf);
      else ownerWindow.clearTimeout(raf);
    }
    raf = 0;
  };
  ownerDocument.addEventListener("dragover", schedule, { passive: true });
  ownerDocument.addEventListener("pointermove", schedule, { passive: true });
  ownerWindow.addEventListener("dragend", stop);
  ownerWindow.addEventListener("pointerup", stop);
  ownerWindow.addEventListener("blur", stop);
  ownerWindow.addEventListener("pagehide", stop);
  const registration = { count: 1, cleanup, ancestors: new Map(ancestors.map((ancestor) => [ancestor, 1])) };
  ownerRegistrations.set(ownerDocument, registration);
  return () => {
    const active = ownerRegistrations.get(ownerDocument);
    if (!active) return;
    active.count -= 1;
    ancestors.forEach((ancestor) => {
      const count = active.ancestors.get(ancestor) ?? 0;
      if (count <= 1) active.ancestors.delete(ancestor);
      else active.ancestors.set(ancestor, count - 1);
    });
    if (active.count === 0) {
      active.cleanup();
      ownerRegistrations.delete(ownerDocument);
    }
  };
}
function registerSortableAutoScroll(element) {
  var _a;
  if (!element) return () => void 0;
  const ownerDocument = element.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;
  const globalWindow = typeof globalThis !== "undefined" && "window" in globalThis ? globalThis.window : void 0;
  const releases = ownerWindow && ownerWindow === globalWindow ? findScrollableAncestors(element).map(retainElementRegistration) : [];
  releases.push(ownerWindow && ownerWindow === globalWindow ? retainMainWindow(ownerDocument) : retainOwnerWindow(element));
  let released = false;
  const frameElement = ownerWindow == null ? void 0 : ownerWindow.frameElement;
  let observer;
  if (frameElement && ((_a = frameElement.ownerDocument.defaultView) == null ? void 0 : _a.MutationObserver)) {
    const Observer = frameElement.ownerDocument.defaultView.MutationObserver;
    observer = new Observer(() => {
      if (!frameElement.isConnected) release();
    });
    observer.observe(frameElement.ownerDocument, { childList: true, subtree: true });
  }
  function release() {
    if (released) return;
    released = true;
    observer == null ? void 0 : observer.disconnect();
    releases.reverse().forEach((cleanup) => cleanup());
  }
  return release;
}
export {
  registerSortableAutoScroll
};
