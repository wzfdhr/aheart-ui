"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
function usePopupViewportBudget(options) {
  const budget = vue.ref();
  let frame;
  let ownerWindow = null;
  const resizeObservers = /* @__PURE__ */ new Set();
  let visualViewport;
  const cancelFrame = () => {
    var _a;
    if (frame !== void 0)
      (_a = ownerWindow == null ? void 0 : ownerWindow.cancelAnimationFrame) == null ? void 0 : _a.call(ownerWindow, frame);
    frame = void 0;
  };
  const read = () => {
    var _a, _b;
    const trigger = options.trigger.value;
    const popup = options.popup.value;
    const view = trigger == null ? void 0 : trigger.ownerDocument.defaultView;
    if (!trigger || !popup || !view || !options.open.value)
      return;
    ownerWindow = view;
    const rect = trigger.getBoundingClientRect();
    const visualViewport2 = view.visualViewport;
    const viewportTop = (visualViewport2 == null ? void 0 : visualViewport2.offsetTop) ?? 0;
    const viewportHeight = (visualViewport2 == null ? void 0 : visualViewport2.height) || view.innerHeight || trigger.ownerDocument.documentElement.clientHeight;
    const placement = options.placement.value;
    const side = placement.startsWith("top") ? "top" : placement.startsWith("bottom") ? "bottom" : "all";
    const available = side === "top" ? rect.top - viewportTop - 8 : side === "bottom" ? viewportTop + viewportHeight - rect.bottom - 8 : viewportHeight - 16;
    const styles = view.getComputedStyle(popup);
    const chrome = Number.parseFloat(styles.borderTopWidth || "0") + Number.parseFloat(styles.borderBottomWidth || "0") + Number.parseFloat(styles.paddingTop || "0") + Number.parseFloat(styles.paddingBottom || "0");
    const search = (_a = options.search) == null ? void 0 : _a.value;
    const searchHeight = search ? search.getBoundingClientRect().height + Number.parseFloat(view.getComputedStyle(search).marginBottom || "0") : 0;
    const treeHeight = Math.max(0, Math.min(options.maximum.value, available - chrome - searchHeight));
    const next = { treeHeight, popupHeight: treeHeight + chrome + searchHeight };
    if (((_b = budget.value) == null ? void 0 : _b.treeHeight) !== next.treeHeight || budget.value.popupHeight !== next.popupHeight)
      budget.value = next;
  };
  const schedule = () => {
    var _a;
    if (frame !== void 0)
      return;
    const view = (_a = options.trigger.value) == null ? void 0 : _a.ownerDocument.defaultView;
    if (!view)
      return;
    ownerWindow = view;
    if (view.requestAnimationFrame)
      frame = view.requestAnimationFrame(() => {
        frame = void 0;
        read();
      });
    else
      read();
  };
  const cleanup = () => {
    var _a;
    cancelFrame();
    for (const observer of resizeObservers)
      observer.disconnect();
    resizeObservers.clear();
    visualViewport == null ? void 0 : visualViewport.removeEventListener("resize", schedule);
    visualViewport == null ? void 0 : visualViewport.removeEventListener("scroll", schedule);
    ownerWindow == null ? void 0 : ownerWindow.removeEventListener("resize", schedule);
    (_a = options.trigger.value) == null ? void 0 : _a.ownerDocument.removeEventListener("scroll", schedule, true);
    visualViewport = void 0;
  };
  vue.watch([options.trigger, options.popup, options.placement, options.open, options.maximum, options.search ?? vue.ref(null)], () => {
    var _a;
    cleanup();
    const trigger = options.trigger.value;
    const popup = options.popup.value;
    if (!trigger || !popup || !options.open.value) {
      budget.value = void 0;
      return;
    }
    const view = trigger.ownerDocument.defaultView;
    if (!view)
      return;
    ownerWindow = view;
    const resizeObserver = view.ResizeObserver ? new view.ResizeObserver(schedule) : void 0;
    if (resizeObserver) {
      resizeObservers.add(resizeObserver);
      resizeObserver.observe(trigger);
      resizeObserver.observe(popup);
      if ((_a = options.search) == null ? void 0 : _a.value)
        resizeObserver.observe(options.search.value);
    }
    visualViewport = view.visualViewport;
    visualViewport == null ? void 0 : visualViewport.addEventListener("resize", schedule);
    visualViewport == null ? void 0 : visualViewport.addEventListener("scroll", schedule);
    view.addEventListener("resize", schedule);
    trigger.ownerDocument.addEventListener("scroll", schedule, true);
    schedule();
  }, { flush: "post", immediate: true });
  vue.onBeforeUnmount(cleanup);
  return vue.computed(() => budget.value ?? { treeHeight: options.maximum.value, popupHeight: options.maximum.value });
}
exports.usePopupViewportBudget = usePopupViewportBudget;
