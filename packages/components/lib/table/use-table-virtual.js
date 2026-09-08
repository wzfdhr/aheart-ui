"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const vueVirtual = require("@tanstack/vue-virtual");
function useTableVirtual(options, count, scrollElement, getItemKey = (index) => String(index), itemKeys) {
  const pinnedIndexes = vue.ref([]);
  const measuredParts = /* @__PURE__ */ new Map();
  const measured = vue.ref(/* @__PURE__ */ new Map());
  const alive = vue.ref(true);
  const observeRect = (instance, callback) => {
    var _a;
    const view = (_a = instance.scrollElement) == null ? void 0 : _a.ownerDocument.defaultView;
    let frame;
    const stop = vueVirtual.observeElementRect(instance, (rect) => {
      const normalizedRect = { ...rect, height: Math.max(rect.height, options.value.height) };
      if (!(view == null ? void 0 : view.requestAnimationFrame))
        callback(normalizedRect);
      else {
        if (frame !== void 0)
          view.cancelAnimationFrame(frame);
        frame = view.requestAnimationFrame(() => {
          frame = void 0;
          if (alive.value)
            callback(normalizedRect);
        });
      }
    });
    return () => {
      stop == null ? void 0 : stop();
      if (frame !== void 0)
        view == null ? void 0 : view.cancelAnimationFrame(frame);
    };
  };
  const virtualizer = vueVirtual.useVirtualizer(vue.computed(() => {
    const pins = [...pinnedIndexes.value];
    return {
      count: options.value.enabled ? count.value : 0,
      enabled: options.value.enabled,
      getScrollElement: () => options.value.enabled ? scrollElement.value : null,
      estimateSize: () => options.value.estimateSize,
      initialRect: { width: 0, height: Math.max(1, options.value.height) },
      overscan: options.value.overscan,
      getItemKey: (index) => (itemKeys == null ? void 0 : itemKeys.value[index]) ?? getItemKey(index),
      // Make key changes observable to TanStack when pagination/data changes.
      itemKeys: itemKeys == null ? void 0 : itemKeys.value,
      observeElementRect: observeRect,
      rangeExtractor: (range2) => {
        const indexes = vueVirtual.defaultRangeExtractor(range2);
        pins.forEach((pin) => {
          if (pin >= 0 && pin < count.value && !indexes.includes(pin))
            indexes.push(pin);
        });
        return indexes.sort((a, b) => a - b);
      }
    };
  }));
  const onScroll = () => {
  };
  const range = vue.computed(() => {
    var _a, _b, _c, _d;
    if (!options.value.enabled)
      return { start: 0, end: count.value, top: 0, bottom: 0 };
    const items2 = virtualizer.value.getVirtualItems();
    const start = ((_a = items2[0]) == null ? void 0 : _a.index) ?? 0;
    const end = (((_b = items2[items2.length - 1]) == null ? void 0 : _b.index) ?? -1) + 1;
    return { start, end, top: ((_c = items2[0]) == null ? void 0 : _c.start) ?? 0, bottom: Math.max(0, virtualizer.value.getTotalSize() - (((_d = items2.at(-1)) == null ? void 0 : _d.end) ?? 0)) };
  });
  const items = vue.computed(() => options.value.enabled ? virtualizer.value.getVirtualItems() : []);
  const setPinnedIndexes = (indexes) => {
    pinnedIndexes.value = [...new Set(indexes.filter((index) => index >= 0))];
  };
  const setMeasured = (index, height, part = "base") => {
    if (!alive.value || !options.value.enabled || height <= 0)
      return;
    const key = getItemKey(index);
    const parts = new Map(measuredParts.get(key) ?? []);
    parts.set(part, height);
    measuredParts.set(key, parts);
    const next = new Map(measured.value);
    next.set(key, Array.from(parts.values()).reduce((sum, value) => sum + value, 0));
    measured.value = next;
    virtualizer.value.resizeItem(index, next.get(key));
  };
  const clearMeasured = (index, part) => {
    const key = getItemKey(index);
    const parts = measuredParts.get(key);
    if (!parts) {
      if (alive.value && options.value.enabled)
        virtualizer.value.resizeItem(index, options.value.estimateSize);
      return;
    }
    if (part)
      parts.delete(part);
    else
      parts.clear();
    const next = new Map(measured.value);
    if (parts.size === 0) {
      measuredParts.delete(key);
      next.delete(key);
    } else {
      measuredParts.set(key, parts);
      next.set(key, Array.from(parts.values()).reduce((sum, value) => sum + value, 0));
    }
    measured.value = next;
    virtualizer.value.resizeItem(index, parts.size === 0 ? options.value.estimateSize : next.get(key));
  };
  vue.watch([options, scrollElement], () => virtualizer.value.measure(), { flush: "sync" });
  if (itemKeys)
    vue.watch(itemKeys, () => {
      measuredParts.clear();
      measured.value = /* @__PURE__ */ new Map();
      virtualizer.value.measure();
    }, { flush: "sync" });
  vue.onBeforeUnmount(() => {
    alive.value = false;
    measuredParts.clear();
    virtualizer.value.setOptions({ ...virtualizer.value.options, enabled: false });
  });
  return { virtualizer, range, items, measured, setMeasured, clearMeasured, setPinnedIndexes, onScroll, pinnedIndexes };
}
exports.useTableVirtual = useTableVirtual;
