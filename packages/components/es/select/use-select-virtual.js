import { computed, ref, watch, onBeforeUnmount, nextTick } from "vue";
import { useVirtualizer, defaultRangeExtractor, observeElementRect } from "@tanstack/vue-virtual";
import { normalizeSelectVirtual } from "./virtual-options.js";
function useSelectVirtual(input) {
  const config = computed(() => normalizeSelectVirtual(input.config(), void 0));
  const enabled = computed(() => Boolean(config.value && input.open.value && !input.disabled.value));
  const geometry = ref({ top: 4, bottom: 4, gap: 2 });
  let alive = true;
  let scrollVersion = 0;
  let activeScroll;
  const observeRect = (instance, callback) => {
    var _a;
    const view = (_a = instance.scrollElement) == null ? void 0 : _a.ownerDocument.defaultView;
    let frame;
    const stop = observeElementRect(instance, (rect) => {
      if (!(view == null ? void 0 : view.requestAnimationFrame)) {
        callback(rect);
        return;
      }
      if (frame !== void 0)
        view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(() => {
        frame = void 0;
        if (alive)
          callback(rect);
      });
    });
    return () => {
      stop == null ? void 0 : stop();
      if (frame !== void 0)
        view == null ? void 0 : view.cancelAnimationFrame(frame);
    };
  };
  const getItemKey = computed(() => {
    const options = input.options.value;
    return (index) => input.key(options[index]);
  });
  const virtualizer = useVirtualizer(computed(() => {
    var _a, _b;
    const active = input.activeIndex.value;
    return {
      count: enabled.value ? input.options.value.length : 0,
      enabled: enabled.value,
      getScrollElement: () => enabled.value ? input.popup.value : null,
      getItemKey: getItemKey.value,
      estimateSize: () => {
        var _a2;
        return ((_a2 = config.value) == null ? void 0 : _a2.estimateSize) ?? 32;
      },
      initialRect: { width: 0, height: Math.max(1, (((_a = config.value) == null ? void 0 : _a.height) ?? 288) - 2) },
      overscan: ((_b = config.value) == null ? void 0 : _b.overscan) ?? 3,
      gap: geometry.value.gap,
      scrollMargin: geometry.value.top,
      scrollPaddingStart: geometry.value.top,
      scrollPaddingEnd: geometry.value.bottom,
      useAnimationFrameWithResizeObserver: false,
      observeElementRect: observeRect,
      measureElement: (element, _entry, instance) => {
        var _a2, _b2;
        queueMeasurement(element);
        return ((_a2 = instance.getVirtualItems().find((item) => item.index === Number(element.dataset.index))) == null ? void 0 : _a2.size) ?? ((_b2 = config.value) == null ? void 0 : _b2.estimateSize) ?? 32;
      },
      rangeExtractor: (range) => {
        const indexes = defaultRangeExtractor(range);
        if (active >= 0 && active < input.options.value.length && !indexes.includes(active))
          indexes.push(active);
        return indexes.sort((a, b) => a - b);
      }
    };
  }));
  watch(input.popup, (popup) => {
    if (!popup)
      return;
    const view = popup.ownerDocument.defaultView;
    const style = view == null ? void 0 : view.getComputedStyle(popup);
    const list = popup.firstElementChild;
    const listStyle2 = list && (view == null ? void 0 : view.getComputedStyle(list));
    const gap = Number.parseFloat((listStyle2 == null ? void 0 : listStyle2.rowGap) ?? "");
    const next = {
      top: Number.parseFloat((style == null ? void 0 : style.paddingTop) ?? "") || 0,
      bottom: Number.parseFloat((style == null ? void 0 : style.paddingBottom) ?? "") || 0,
      gap: Number.isFinite(gap) ? gap : 2
    };
    if (Object.keys(next).some((key) => next[key] !== geometry.value[key]))
      geometry.value = next;
  }, { flush: "post" });
  const scrollToActive = async () => {
    var _a;
    const version = ++scrollVersion;
    await nextTick();
    if (!alive || version !== scrollVersion || !enabled.value || !((_a = input.popup.value) == null ? void 0 : _a.isConnected))
      return;
    const index = input.activeIndex.value;
    if (index >= 0) {
      activeScroll = { version, index };
      virtualizer.value.scrollToIndex(index, { align: "auto" });
    }
  };
  watch([input.activeKey, input.activeIndex, input.open, input.popup, config], () => {
    void scrollToActive();
  }, { flush: "post" });
  watch(input.popup, (popup, _previous, cleanup) => {
    if (!popup)
      return;
    const cancelRequestedScroll = () => {
      activeScroll = void 0;
      scrollVersion++;
    };
    const events = ["wheel", "touchstart", "pointerdown"];
    for (const event of events)
      popup.addEventListener(event, cancelRequestedScroll, { passive: true });
    cleanup(() => {
      for (const event of events)
        popup.removeEventListener(event, cancelRequestedScroll);
    });
  }, { flush: "post" });
  onBeforeUnmount(() => {
    alive = false;
    scrollVersion++;
  });
  let observerWindow = null;
  let measureFrame;
  let measureTimer;
  const observed = /* @__PURE__ */ new Set();
  const pending = /* @__PURE__ */ new Set();
  const resetMeasurements = () => {
    if (measureFrame !== void 0)
      observerWindow == null ? void 0 : observerWindow.cancelAnimationFrame(measureFrame);
    if (measureTimer !== void 0)
      observerWindow == null ? void 0 : observerWindow.clearTimeout(measureTimer);
    measureFrame = measureTimer = void 0;
    observed.clear();
    pending.clear();
    observerWindow = null;
    activeScroll = void 0;
  };
  const queueMeasurement = (element) => {
    observerWindow ?? (observerWindow = element.ownerDocument.defaultView);
    pending.add(element);
    if (measureFrame !== void 0 || measureTimer !== void 0)
      return;
    const flush = () => {
      var _a;
      measureFrame = measureTimer = void 0;
      if (!alive || !enabled.value) {
        pending.clear();
        return;
      }
      virtualizer.value.measureElement(null);
      for (const row of observed)
        if (!row.isConnected)
          observed.delete(row);
      for (const row of pending) {
        if (!row.isConnected || !((_a = input.popup.value) == null ? void 0 : _a.contains(row)))
          continue;
        const index = Number(row.dataset.index);
        if (Number.isInteger(index) && index >= 0 && index < input.options.value.length)
          virtualizer.value.resizeItem(index, row.offsetHeight);
      }
      pending.clear();
      void nextTick(() => {
        const target = activeScroll, popup = input.popup.value;
        if (!target || target.version !== scrollVersion || !alive || !enabled.value || !popup)
          return;
        virtualizer.value.scrollToIndex(target.index, { align: "auto" });
        const row = popup.querySelector(`[data-index="${target.index}"]`);
        if (row) {
          const r = row.getBoundingClientRect(), p = popup.getBoundingClientRect();
          if (r.top >= p.top && r.bottom <= p.bottom)
            activeScroll = void 0;
        }
      });
    };
    if (observerWindow == null ? void 0 : observerWindow.requestAnimationFrame)
      measureFrame = observerWindow.requestAnimationFrame(flush);
    else if (observerWindow)
      measureTimer = observerWindow.setTimeout(flush, 0);
  };
  watch([enabled, input.popup], resetMeasurements, { flush: "sync" });
  onBeforeUnmount(resetMeasurements);
  const rows = computed(() => config.value ? virtualizer.value.getVirtualItems().map((item) => ({ option: input.options.value[item.index], index: item.index, item })) : input.options.value.map((option, index) => ({ option, index, item: void 0 })));
  const listStyle = computed(() => config.value && input.options.value.length > 0 ? { height: `${virtualizer.value.getTotalSize()}px`, position: "relative", display: "block" } : void 0);
  const popupStyle = computed(() => config.value ? { maxHeight: `min(${config.value.height}px, calc(100dvh - 16px))`, overflowAnchor: "none" } : void 0);
  const rowStyle = (row) => row.item ? {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    transform: `translateY(${row.item.start - geometry.value.top}px)`
  } : void 0;
  const measure = (element) => {
    var _a;
    if (!alive || !enabled.value)
      return;
    if (!element) {
      for (const row2 of observed)
        if (!row2.isConnected || !((_a = input.popup.value) == null ? void 0 : _a.contains(row2))) {
          observed.delete(row2);
          pending.delete(row2);
        }
      virtualizer.value.measureElement(null);
      return;
    }
    const row = element;
    if (row.nodeType !== 1 || observed.has(row))
      return;
    observerWindow ?? (observerWindow = row.ownerDocument.defaultView);
    observed.add(row);
    virtualizer.value.measureElement(row);
  };
  return { config, rows, listStyle, popupStyle, rowStyle, measure };
}
export {
  useSelectVirtual
};
