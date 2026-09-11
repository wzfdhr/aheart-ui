"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const vueVirtual = require("@tanstack/vue-virtual");
const _hoisted_1 = ["data-virtual-scroll-owner"];
const _hoisted_2 = ["data-virtual-index", "data-index", "data-virtual-key"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  __name: "cascader-virtual-list",
  props: {
    items: { type: Array, required: true },
    config: { type: Object, required: true },
    className: { type: String, required: true },
    rowKey: { type: Function, required: true },
    activeIndex: { type: Number, default: 0 },
    pinnedIndexes: { type: Array, default: () => [] },
    disabledIndex: { type: Function, required: true },
    enabled: { type: Boolean, default: true }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const scrollRef = vue.ref(null);
    const viewportHeight = vue.ref(0);
    const viewportMeasured = vue.ref(false);
    const fallback = vue.ref(false);
    let alive = true;
    let ownerWindow = null;
    const observationCleanups = /* @__PURE__ */ new Set();
    let measurementRaf;
    const pendingKey = vue.ref();
    let focusRetry = 0;
    let focusTimer;
    let focusGeneration = 0;
    const pendingRows = /* @__PURE__ */ new Map();
    const rowReportedSizes = /* @__PURE__ */ new Map();
    const rowObservers = /* @__PURE__ */ new Map();
    const measurementVersion = vue.ref(0);
    let measurementTimer;
    const virtualMode = vue.computed(() => !fallback.value);
    const active = vue.computed(() => virtualMode.value && props.enabled);
    const canUseVirtualRuntime = () => {
      var _a;
      const view = (_a = scrollRef.value) == null ? void 0 : _a.ownerDocument.defaultView;
      const runtime = view;
      return Boolean((runtime == null ? void 0 : runtime.ResizeObserver) && typeof Reflect.get(runtime, "requestAnimationFrame") === "function" && typeof Reflect.get(runtime, "cancelAnimationFrame") === "function");
    };
    const cancelSchedule = () => {
      var _a, _b;
      if (measurementRaf !== void 0)
        (_a = ownerWindow == null ? void 0 : ownerWindow.cancelAnimationFrame) == null ? void 0 : _a.call(ownerWindow, measurementRaf);
      if (measurementTimer !== void 0)
        (_b = ownerWindow == null ? void 0 : ownerWindow.clearTimeout) == null ? void 0 : _b.call(ownerWindow, measurementTimer);
      measurementRaf = void 0;
      measurementTimer = void 0;
    };
    const scheduleRowMeasurement = () => {
      if (!alive || !active.value)
        return;
      if (measurementRaf !== void 0 || measurementTimer !== void 0)
        return;
      const flush = () => {
        var _a;
        measurementRaf = void 0;
        const userAgent = ((_a = ownerWindow == null ? void 0 : ownerWindow.navigator) == null ? void 0 : _a.userAgent) ?? "";
        if (/AppleWebKit/i.test(userAgent) && /Safari/i.test(userAgent) && !/Chrome|CriOS|Chromium/i.test(userAgent) && ownerWindow) {
          const timer = ownerWindow.setTimeout(() => {
            measurementTimer = void 0;
            commit();
          }, 0);
          measurementTimer = timer;
          return;
        }
        commit();
      };
      const commit = () => {
        var _a;
        if (!alive || !active.value) {
          pendingRows.clear();
          return;
        }
        for (const [row, size] of rowReportedSizes) {
          if (!row.isConnected || !((_a = scrollRef.value) == null ? void 0 : _a.contains(row)))
            continue;
          const key = row.dataset.virtualKey;
          if (!key)
            continue;
          const index = props.items.findIndex((option, itemIndex) => props.rowKey(itemIndex, option) === key);
          const item = virtualizer.value.getVirtualItems().find((current) => current.index === index);
          if (index >= 0 && item && Math.abs(item.size - size) > 0.01) {
            virtualizer.value.resizeItem(index, size);
            measurementVersion.value++;
          }
        }
        pendingRows.clear();
      };
      if (ownerWindow == null ? void 0 : ownerWindow.requestAnimationFrame) {
        measurementRaf = ownerWindow.requestAnimationFrame(flush);
      } else if (ownerWindow) {
        const timer = ownerWindow.setTimeout(() => {
          measurementTimer = void 0;
          flush();
        }, 0);
        measurementTimer = timer;
      } else
        flush();
    };
    const observeRect = (instance, callback) => {
      const element = instance.scrollElement;
      const view = element == null ? void 0 : element.ownerDocument.defaultView;
      if (!element || !view)
        return () => void 0;
      ownerWindow = view;
      let rectFrame;
      let lastWidth = -1;
      let lastHeight = -1;
      const read = () => {
        const height = Math.min(element.clientHeight || props.config.height, props.config.height);
        const width = element.clientWidth || 180;
        if (width === lastWidth && height === lastHeight)
          return;
        lastWidth = width;
        lastHeight = height;
        viewportHeight.value = height;
        viewportMeasured.value = true;
        callback({ width, height });
      };
      const schedule = () => {
        if (rectFrame !== void 0)
          return;
        const flush = () => {
          rectFrame = void 0;
          if (alive)
            read();
        };
        if (view.requestAnimationFrame)
          rectFrame = view.requestAnimationFrame(flush);
        else
          rectFrame = view.setTimeout(flush, 0);
      };
      view.addEventListener("resize", schedule);
      element.ownerDocument.addEventListener("scroll", schedule, true);
      read();
      const localObserver = view.ResizeObserver ? new view.ResizeObserver(schedule) : void 0;
      localObserver == null ? void 0 : localObserver.observe(element);
      const cleanup = () => {
        var _a, _b;
        localObserver == null ? void 0 : localObserver.disconnect();
        observationCleanups.delete(cleanup);
        view.removeEventListener("resize", schedule);
        element.ownerDocument.removeEventListener("scroll", schedule, true);
        if (rectFrame !== void 0) {
          (_a = view.cancelAnimationFrame) == null ? void 0 : _a.call(view, rectFrame);
          (_b = view.clearTimeout) == null ? void 0 : _b.call(view, rectFrame);
          rectFrame = void 0;
        }
      };
      observationCleanups.add(cleanup);
      return cleanup;
    };
    const getItemKey = vue.computed(() => (index) => props.rowKey(index, props.items[index]));
    const virtualizer = vueVirtual.useVirtualizer(vue.computed(() => {
      const capturedPendingKey = pendingKey.value;
      return {
        count: virtualMode.value ? props.items.length : 0,
        enabled: active.value,
        getScrollElement: () => active.value ? scrollRef.value : null,
        getItemKey: getItemKey.value,
        estimateSize: () => props.config.estimateSize,
        initialRect: { width: 180, height: Math.max(1, viewportMeasured.value ? viewportHeight.value : props.config.height) },
        overscan: props.config.overscan,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        useAnimationFrameWithResizeObserver: false,
        observeElementRect: observeRect,
        measureElement: (element, _entry, instance) => {
          var _a;
          const measured = element.getBoundingClientRect().height || element.offsetHeight;
          return measured > 0 ? measured : ((_a = instance.getVirtualItems().find((item) => item.index === Number(element.dataset.virtualIndex))) == null ? void 0 : _a.size) ?? props.config.estimateSize;
        },
        rangeExtractor: (range) => {
          const indexes = vueVirtual.defaultRangeExtractor(range);
          const currentPendingKey = capturedPendingKey;
          const pendingIndex = currentPendingKey === void 0 ? -1 : props.items.findIndex((option, index) => props.rowKey(index, option) === currentPendingKey);
          for (const index of [props.activeIndex, pendingIndex, ...props.pinnedIndexes]) {
            if (index >= 0 && index < props.items.length && !indexes.includes(index))
              indexes.push(index);
          }
          return indexes.sort((left, right) => left - right);
        }
      };
    }));
    const cachedRows = vue.ref([]);
    const rows = vue.computed(() => {
      if (!virtualMode.value)
        return [];
      const virtualRows = virtualizer.value.getVirtualItems();
      const measurements = virtualizer.value.getMeasurements();
      const currentKeys = new Set(props.items.map((option, index) => props.rowKey(index, option)));
      const pinned = [props.activeIndex, ...props.pinnedIndexes];
      if (pendingKey.value !== void 0) {
        const pendingIndex = props.items.findIndex((option, index) => props.rowKey(index, option) === pendingKey.value);
        if (pendingIndex >= 0)
          pinned.push(pendingIndex);
      }
      const nextRows = [...virtualRows, ...pinned.map((index) => measurements[index]).filter((item) => Boolean(item))].filter((item) => item.index >= 0 && item.index < props.items.length).filter((item, index, all) => all.findIndex((candidate) => candidate.index === item.index) === index).map((item) => ({ index: item.index, item, key: getItemKey.value(item.index) })).filter((row) => currentKeys.has(row.key));
      if (nextRows.length)
        cachedRows.value = nextRows;
      if (nextRows.length || active.value)
        return nextRows;
      const fallbackCount = Math.min(24, props.items.length);
      return Array.from({ length: fallbackCount }, (_, index) => ({
        index,
        key: props.rowKey(index, props.items[index]),
        item: { index, key: props.rowKey(index, props.items[index]), start: index * props.config.estimateSize, end: (index + 1) * props.config.estimateSize, size: props.config.estimateSize, lane: 0 }
      }));
    });
    const contentStyle = vue.computed(() => {
      measurementVersion.value;
      return virtualMode.value ? {
        position: "relative",
        blockSize: `${Math.max(props.config.height, virtualizer.value.getTotalSize())}px`,
        minBlockSize: "100%"
      } : {};
    });
    const listStyle = vue.computed(() => virtualMode.value ? { maxBlockSize: `${props.config.height}px`, blockSize: `${viewportMeasured.value ? Math.min(viewportHeight.value, props.config.height) : props.config.height}px`, overflowY: "auto", overflowX: "hidden", position: "relative", minBlockSize: "0" } : { maxBlockSize: `${props.config.height}px`, overflowY: "auto", overflowX: "hidden", minBlockSize: "0" });
    const rowStyle = (item) => item ? {
      position: "absolute",
      insetInline: "0",
      top: "0",
      transform: `translateY(${item.start}px)`
    } : void 0;
    const tabIndex = (index) => props.disabledIndex(index, props.items[index]) ? -1 : index === props.activeIndex ? 0 : -1;
    const focusIndex = (index) => {
      if (!props.items.length)
        return;
      const clamped = Math.max(0, Math.min(props.items.length - 1, index));
      const requestedKey = props.rowKey(clamped, props.items[clamped]);
      pendingKey.value = requestedKey;
      const generation = ++focusGeneration;
      focusRetry = 0;
      if (focusTimer !== void 0)
        ownerWindow == null ? void 0 : ownerWindow.clearTimeout(focusTimer);
      if (active.value) {
        if (scrollRef.value) {
          scrollRef.value.scrollTop = clamped * props.config.estimateSize;
          const view = scrollRef.value.ownerDocument.defaultView;
          if (view)
            scrollRef.value.dispatchEvent(new view.Event("scroll"));
        }
        virtualizer.value.scrollToIndex(clamped, { align: "auto" });
      }
      const commit = () => {
        var _a, _b, _c;
        if (generation !== focusGeneration || pendingKey.value !== requestedKey || !alive)
          return;
        const currentIndex = props.items.findIndex((option, index2) => props.rowKey(index2, option) === requestedKey);
        if (currentIndex < 0) {
          pendingKey.value = void 0;
          return;
        }
        const target = (_a = scrollRef.value) == null ? void 0 : _a.querySelector(`[data-virtual-index="${currentIndex}"] .aheart-cascader__option`);
        if (target && !props.disabledIndex(currentIndex, props.items[currentIndex])) {
          target.focus();
          return;
        }
        if (!active.value) {
          const fallbackTarget = (_b = scrollRef.value) == null ? void 0 : _b.querySelectorAll(".aheart-cascader__option")[currentIndex];
          if (fallbackTarget) {
            fallbackTarget.focus();
            return;
          }
        }
        if (focusRetry++ < 4 && alive) {
          const view = (_c = scrollRef.value) == null ? void 0 : _c.ownerDocument.defaultView;
          if (view == null ? void 0 : view.requestAnimationFrame)
            focusTimer = view.requestAnimationFrame(() => {
              focusTimer = void 0;
              void vue.nextTick(commit);
            });
          else if (view)
            focusTimer = view.setTimeout(() => {
              focusTimer = void 0;
              void vue.nextTick(commit);
            }, 0);
        } else if (pendingKey.value === requestedKey)
          pendingKey.value = void 0;
      };
      void vue.nextTick(commit);
    };
    const firstEnabled = () => props.items.findIndex((option, index) => !props.disabledIndex(index, option));
    const lastEnabled = () => {
      for (let index = props.items.length - 1; index >= 0; index--)
        if (!props.disabledIndex(index, props.items[index]))
          return index;
      return -1;
    };
    const focusFirst = () => focusIndex(firstEnabled());
    const focusLast = () => focusIndex(lastEnabled());
    const cancelFocus = () => {
      var _a, _b;
      focusGeneration++;
      pendingKey.value = void 0;
      focusRetry = 0;
      if (focusTimer !== void 0)
        (_a = ownerWindow == null ? void 0 : ownerWindow.cancelAnimationFrame) == null ? void 0 : _a.call(ownerWindow, focusTimer);
      if (focusTimer !== void 0)
        (_b = ownerWindow == null ? void 0 : ownerWindow.clearTimeout) == null ? void 0 : _b.call(ownerWindow, focusTimer);
      focusTimer = void 0;
    };
    const suspend = () => {
      cancelFocus();
      cancelSchedule();
      for (const cleanup of [...observationCleanups])
        cleanup();
      pendingRows.clear();
      for (const entry of rowObservers.values())
        entry.observer.disconnect();
      rowObservers.clear();
      rowReportedSizes.clear();
    };
    vue.onMounted(() => {
      var _a;
      fallback.value = !canUseVirtualRuntime();
      const view = (_a = scrollRef.value) == null ? void 0 : _a.ownerDocument.defaultView;
      ownerWindow = view ?? null;
      if (active.value)
        void vue.nextTick(bindMountedRows);
    });
    vue.watch([() => props.items, () => props.config], () => {
      pruneRowObservers();
      cachedRows.value = cachedRows.value.filter((row) => props.items.some((option, index) => props.rowKey(index, option) === row.key));
    }, { flush: "post" });
    vue.watch(active, (value) => {
      if (!value)
        suspend();
      else {
        void vue.nextTick(bindMountedRows);
      }
    }, { flush: "post" });
    vue.onBeforeUnmount(() => {
      alive = false;
      cancelSchedule();
      suspend();
    });
    __expose({ focusIndex, focusFirst, focusLast, cancelFocus, suspend });
    const setRowRef = (element, index, key) => {
      var _a;
      if (!element || typeof element !== "object" || "$el" in element || key === void 0) {
        (_a = rowObservers.get(key)) == null ? void 0 : _a.observer.disconnect();
        for (const row2 of rowReportedSizes.keys())
          if (row2.dataset.virtualKey === key)
            rowReportedSizes.delete(row2);
        rowObservers.delete(key);
        return;
      }
      if (!active.value)
        return;
      const row = element;
      if (row.nodeType !== 1)
        return;
      const view = row.ownerDocument.defaultView;
      if (!(view == null ? void 0 : view.ResizeObserver))
        return;
      ownerWindow ?? (ownerWindow = view);
      const existing = rowObservers.get(key);
      if ((existing == null ? void 0 : existing.element) === row)
        return;
      existing == null ? void 0 : existing.observer.disconnect();
      const observer = new view.ResizeObserver((entries) => {
        var _a2, _b;
        const entry = entries.find((current) => current.target === row);
        const borderBox = entry == null ? void 0 : entry.borderBoxSize;
        const boxSize = Array.isArray(borderBox) ? (_a2 = borderBox[0]) == null ? void 0 : _a2.blockSize : borderBox == null ? void 0 : borderBox.blockSize;
        const reported = Number.isFinite(boxSize) && boxSize > 0 ? boxSize : ((_b = entry == null ? void 0 : entry.contentRect) == null ? void 0 : _b.height) && entry.contentRect.height > 0 ? entry.contentRect.height : Math.max(row.offsetHeight || 0, row.getBoundingClientRect().height || 0, props.config.estimateSize);
        rowReportedSizes.set(row, reported);
        pendingRows.set(row, reported);
        scheduleRowMeasurement();
      });
      observer.observe(row);
      rowObservers.set(key, { element: row, observer });
      const initialSize = Math.max(row.offsetHeight || 0, row.getBoundingClientRect().height || 0, props.config.estimateSize);
      rowReportedSizes.set(row, initialSize);
      pendingRows.set(row, initialSize);
      scheduleRowMeasurement();
    };
    const pruneRowObservers = () => {
      const keys = new Set(props.items.map((option, index) => props.rowKey(index, option)));
      for (const [key, entry] of rowObservers)
        if (!keys.has(key) || !entry.element.isConnected) {
          entry.observer.disconnect();
          rowObservers.delete(key);
          rowReportedSizes.delete(entry.element);
        }
    };
    const bindMountedRows = () => {
      const owner = scrollRef.value;
      if (!owner || !active.value)
        return;
      owner.querySelectorAll("[data-virtual-index]").forEach((row) => {
        const index = Number(row.dataset.virtualIndex);
        const key = row.dataset.virtualKey;
        if (Number.isInteger(index) && key)
          setRowRef(row, index, key);
      });
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "scrollRef",
        ref: scrollRef,
        class: vue.normalizeClass(__props.className),
        style: vue.normalizeStyle(listStyle.value),
        "data-virtual-scroll-owner": active.value ? "true" : void 0
      }, [
        virtualMode.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "aheart-cascader__virtual-content",
          style: vue.normalizeStyle(contentStyle.value)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(rows.value, (row) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: row.key,
              class: "aheart-cascader__virtual-row",
              "data-virtual-index": row.index,
              "data-index": row.index,
              "data-virtual-key": row.key,
              style: vue.normalizeStyle(rowStyle(row.item)),
              ref_for: true,
              ref: (element) => setRowRef(element, row.index, row.key)
            }, [
              vue.renderSlot(_ctx.$slots, "row", {
                index: row.index,
                option: __props.items[row.index],
                tabindex: tabIndex(row.index)
              })
            ], 12, _hoisted_2);
          }), 128))
        ], 4)) : !virtualMode.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(__props.items, (option, index) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: __props.rowKey(index, option),
            class: "aheart-cascader__virtual-row"
          }, [
            vue.renderSlot(_ctx.$slots, "row", {
              index,
              option,
              tabindex: tabIndex(index)
            })
          ]);
        }), 128)) : vue.createCommentVNode("", true)
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
