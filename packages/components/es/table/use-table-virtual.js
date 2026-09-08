import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useVirtualizer, defaultRangeExtractor, observeElementRect } from "@tanstack/vue-virtual";
function useTableVirtual(options, count, scrollElement, getItemKey = (index) => String(index)) {
  const pinnedIndex = ref();
  const measuredParts = /* @__PURE__ */ new Map();
  const measured = ref(/* @__PURE__ */ new Map());
  const alive = ref(true);
  const observeRect = (instance, callback) => {
    var _a;
    const view = (_a = instance.scrollElement) == null ? void 0 : _a.ownerDocument.defaultView;
    let frame;
    const stop = observeElementRect(instance, (rect) => {
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
  const virtualizer = useVirtualizer(computed(() => ({
    count: options.value.enabled ? count.value : 0,
    enabled: options.value.enabled,
    getScrollElement: () => options.value.enabled ? scrollElement.value : null,
    estimateSize: () => options.value.estimateSize,
    initialRect: { width: 0, height: Math.max(1, options.value.height) },
    overscan: options.value.overscan,
    getItemKey,
    observeElementRect: observeRect,
    rangeExtractor: (range2) => {
      const indexes = defaultRangeExtractor(range2);
      if (pinnedIndex.value !== void 0 && pinnedIndex.value >= 0 && pinnedIndex.value < count.value && !indexes.includes(pinnedIndex.value))
        indexes.push(pinnedIndex.value);
      return indexes.sort((a, b) => a - b);
    }
  })));
  const onScroll = () => {
    var _a;
    const offset = ((_a = scrollElement.value) == null ? void 0 : _a.scrollTop) ?? 0;
    virtualizer.value.scrollToOffset(offset);
    virtualizer.value.measure();
  };
  const range = computed(() => {
    var _a, _b, _c, _d;
    if (!options.value.enabled)
      return { start: 0, end: count.value, top: 0, bottom: 0 };
    const items = virtualizer.value.getVirtualItems();
    const start = ((_a = items[0]) == null ? void 0 : _a.index) ?? 0;
    const end = (((_b = items[items.length - 1]) == null ? void 0 : _b.index) ?? -1) + 1;
    return { start, end, top: ((_c = items[0]) == null ? void 0 : _c.start) ?? 0, bottom: Math.max(0, virtualizer.value.getTotalSize() - (((_d = items.at(-1)) == null ? void 0 : _d.end) ?? 0)) };
  });
  const setPinnedIndex = (index) => {
    pinnedIndex.value = index;
    virtualizer.value.measure();
  };
  const setMeasured = (index, height, part = "base") => {
    if (!alive.value || !options.value.enabled || height <= 0)
      return;
    const parts = new Map(measuredParts.get(index) ?? []);
    parts.set(part, height);
    measuredParts.set(index, parts);
    const next = new Map(measured.value);
    next.set(index, Array.from(parts.values()).reduce((sum, value) => sum + value, 0));
    measured.value = next;
    virtualizer.value.resizeItem(index, next.get(index));
  };
  const clearMeasured = (index, part) => {
    const parts = measuredParts.get(index);
    if (!parts)
      return;
    if (part)
      parts.delete(part);
    else
      parts.clear();
    const next = new Map(measured.value);
    if (parts.size === 0) {
      measuredParts.delete(index);
      next.delete(index);
    } else {
      measuredParts.set(index, parts);
      next.set(index, Array.from(parts.values()).reduce((sum, value) => sum + value, 0));
    }
    measured.value = next;
    virtualizer.value.measure();
  };
  watch([options, scrollElement], () => virtualizer.value.measure(), { flush: "sync" });
  onBeforeUnmount(() => {
    alive.value = false;
    measuredParts.clear();
    virtualizer.value.setOptions({ ...virtualizer.value.options, enabled: false });
  });
  return { virtualizer, range, measured, setMeasured, clearMeasured, setPinnedIndex, onScroll, pinnedIndex };
}
export {
  useTableVirtual
};
