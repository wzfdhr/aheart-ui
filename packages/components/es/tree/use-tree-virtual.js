import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useVirtualizer, defaultRangeExtractor } from "@tanstack/vue-virtual";
import { treeKeyToken } from "./tree-index.js";
function useTreeVirtual(root, config, nodes, focusedKey, disabled) {
  const fallback = ref(false);
  const mounted = ref(false);
  const alive = ref(true);
  const actualFocusedKey = ref();
  const focusRecoveryKey = ref();
  const focusMovedOutside = ref(false);
  const pendingKey = ref();
  const pendingVersion = ref(0);
  const rowEntries = /* @__PURE__ */ new Map();
  const queuedRows = /* @__PURE__ */ new Set();
  let rowFrame;
  let realm = null;
  let listenersAttached = false;
  let pauseViewport = () => void 0;
  let resumeViewport = () => void 0;
  const indexFor = (key) => key === void 0 ? -1 : nodes.value.findIndex((item) => item.key === key);
  const tokenFor = (key) => treeKeyToken(key);
  const pinnedIndexes = computed(() => [focusedKey.value, actualFocusedKey.value, pendingKey.value].map(indexFor).filter((index) => index >= 0));
  const rangeExtractorFor = (pins) => (range) => {
    const indexes = defaultRangeExtractor(range);
    for (const index of pins)
      if (!indexes.includes(index))
        indexes.push(index);
    return indexes.sort((a, b) => a - b);
  };
  const observeRect = (instance, callback) => {
    const element = instance.scrollElement;
    const view = element == null ? void 0 : element.ownerDocument.defaultView;
    if (!element || !view)
      return () => void 0;
    let frame;
    let timer;
    let generation = 0;
    let queued = false;
    let disposed = false;
    let paused = disabled.value;
    let observer;
    const read = () => {
      var _a;
      const measured = element.getBoundingClientRect();
      const height = element.clientHeight || measured.height || ((_a = config.value) == null ? void 0 : _a.height) || 320;
      const width = element.clientWidth || measured.width;
      return { width, height };
    };
    const submit = () => {
      if (queued || disposed || paused || disabled.value)
        return;
      queued = true;
      const currentGeneration = generation;
      const commit = () => {
        frame = void 0;
        timer = void 0;
        queued = false;
        if (alive.value && currentGeneration === generation)
          callback(read());
      };
      if (view.requestAnimationFrame && view.cancelAnimationFrame)
        frame = view.requestAnimationFrame.call(view, commit);
      else if (view.setTimeout && view.clearTimeout)
        timer = view.setTimeout.call(view, commit, 0);
      else
        commit();
    };
    const connect = () => {
      if (disposed || paused || disabled.value || observer)
        return;
      const ResizeObserverCtor = view.ResizeObserver;
      observer = ResizeObserverCtor ? new ResizeObserverCtor(submit) : void 0;
      observer == null ? void 0 : observer.observe(element);
      submit();
    };
    const pause = () => {
      var _a, _b;
      paused = true;
      generation += 1;
      observer == null ? void 0 : observer.disconnect();
      observer = void 0;
      if (frame !== void 0)
        (_a = view.cancelAnimationFrame) == null ? void 0 : _a.call(view, frame);
      if (timer !== void 0)
        (_b = view.clearTimeout) == null ? void 0 : _b.call(view, timer);
      frame = void 0;
      timer = void 0;
      queued = false;
    };
    const resume = () => {
      if (disposed)
        return;
      paused = false;
      connect();
    };
    pauseViewport = pause;
    resumeViewport = resume;
    connect();
    return () => {
      disposed = true;
      pause();
      if (pauseViewport === pause) {
        pauseViewport = () => void 0;
        resumeViewport = () => void 0;
      }
    };
  };
  const virtualizer = useVirtualizer(computed(() => {
    var _a, _b;
    const pins = [...pinnedIndexes.value];
    const keys = nodes.value.map((node) => tokenFor(node.key));
    return {
      count: config.value && !fallback.value ? nodes.value.length : 0,
      enabled: Boolean(config.value && !fallback.value),
      // Before mounted this intentionally returns null so SSR and hydration use
      // the deterministic initialRect without touching realm capabilities.
      getScrollElement: () => mounted.value && config.value && !fallback.value ? root.value ?? null : null,
      getItemKey: (index) => keys[index] ?? `missing-${index}`,
      estimateSize: () => {
        var _a2;
        return ((_a2 = config.value) == null ? void 0 : _a2.estimateSize) ?? 28;
      },
      initialRect: { width: 0, height: Math.max(1, ((_a = config.value) == null ? void 0 : _a.height) ?? 320) },
      overscan: ((_b = config.value) == null ? void 0 : _b.overscan) ?? 4,
      useCachedMeasurements: true,
      scrollToFn: (offset, options) => {
        const element = root.value;
        if (!element)
          return;
        const target = offset + ((options == null ? void 0 : options.adjustments) ?? 0);
        const behavior = (options == null ? void 0 : options.behavior) ?? "auto";
        if (element.scrollTop !== target)
          element.scrollTop = target;
        if (typeof element.scrollTo === "function")
          element.scrollTo({ top: target, behavior });
        element.dispatchEvent(new Event("scroll"));
      },
      observeElementRect: observeRect,
      rangeExtractor: rangeExtractorFor(pins)
    };
  }));
  const items = computed(() => config.value && !fallback.value ? virtualizer.value.getVirtualItems() : []);
  const rows = computed(() => items.value.map((item) => ({ entry: nodes.value[item.index], item })).filter((row) => row.entry));
  const totalSize = computed(() => config.value && !fallback.value ? virtualizer.value.getTotalSize() : 0);
  const cancelPending = (stopReconcile = true) => {
    pendingVersion.value += 1;
    pendingKey.value = void 0;
  };
  const isMountedKey = (key) => rows.value.some((row) => row.entry.key === key);
  const ensureKey = (key) => {
    const index = indexFor(key);
    if (index < 0 || !config.value || fallback.value)
      return 0;
    const version = ++pendingVersion.value;
    pendingKey.value = key;
    if (!isMountedKey(key)) {
      const offsetInfo = virtualizer.value.getOffsetForIndex(index, "auto");
      if (offsetInfo) {
        virtualizer.value.options.scrollToFn(offsetInfo[0], { behavior: "auto" }, virtualizer.value);
      }
    }
    return version;
  };
  const isPending = (key, version) => alive.value && pendingKey.value === key && pendingVersion.value === version;
  const commitFocus = (key) => {
    if (pendingKey.value === key)
      cancelPending(false);
    focusRecoveryKey.value = key;
    focusMovedOutside.value = false;
  };
  const keyFromRow = (row) => {
    var _a, _b;
    const token = (_a = row == null ? void 0 : row.closest("[data-tree-token]")) == null ? void 0 : _a.dataset.treeToken;
    return token === void 0 ? void 0 : (_b = nodes.value.find((item) => tokenFor(item.key) === token)) == null ? void 0 : _b.key;
  };
  const onFocusIn = (event) => {
    var _a;
    const target = event.target;
    const row = target == null ? void 0 : target.closest("[data-tree-token]");
    if (!row || !((_a = root.value) == null ? void 0 : _a.contains(row)))
      return;
    const key = keyFromRow(row);
    actualFocusedKey.value = key;
    focusRecoveryKey.value = key;
    focusMovedOutside.value = false;
    cancelPending(false);
  };
  const onFocusOut = (event) => {
    var _a;
    const next = event.relatedTarget;
    if (next && ((_a = root.value) == null ? void 0 : _a.contains(next)))
      return;
    const old = event.target;
    actualFocusedKey.value = void 0;
    if (next) {
      focusMovedOutside.value = true;
      focusRecoveryKey.value = void 0;
    } else if (old) {
      Promise.resolve().then(() => {
        var _a2;
        if (old.isConnected && ((_a2 = root.value) == null ? void 0 : _a2.contains(old))) {
          focusMovedOutside.value = true;
          focusRecoveryKey.value = void 0;
        }
      });
    }
    cancelPending();
  };
  const cancelUserNavigation = () => cancelPending();
  const disconnectRow = (token) => {
    var _a;
    const entry = rowEntries.get(token);
    (_a = entry == null ? void 0 : entry.observer) == null ? void 0 : _a.disconnect();
    rowEntries.delete(token);
    queuedRows.delete(token);
  };
  const queueRowMeasurement = (token) => {
    if (disabled.value)
      return;
    queuedRows.add(token);
    if (rowFrame !== void 0)
      return;
    const view = realm;
    if (!(view == null ? void 0 : view.requestAnimationFrame) || !view.cancelAnimationFrame)
      return;
    rowFrame = view.requestAnimationFrame.call(view, () => {
      rowFrame = void 0;
      for (const queuedToken of queuedRows) {
        queuedRows.delete(queuedToken);
        const entry = rowEntries.get(queuedToken);
        if (!entry || !entry.element.isConnected || !config.value || fallback.value)
          continue;
        const height = entry.element.getBoundingClientRect().height || entry.element.offsetHeight;
        if (height > 0)
          virtualizer.value.resizeItem(entry.index, height);
      }
    });
  };
  const measureRow = (element, index, stableToken) => {
    const token = stableToken ?? ((element == null ? void 0 : element.getAttribute("data-tree-token")) ?? void 0);
    if (!token)
      return;
    const previous = rowEntries.get(token);
    if (!element) {
      if (previous && previous.index === index)
        disconnectRow(token);
      return;
    }
    const view = element.ownerDocument.defaultView;
    const HTMLElementCtor = view == null ? void 0 : view.HTMLElement;
    if (element.nodeType !== 1 || HTMLElementCtor && !(element instanceof HTMLElementCtor) || !config.value || fallback.value || !mounted.value)
      return;
    if (disabled.value) {
      const height2 = element.getBoundingClientRect().height || element.offsetHeight;
      if (height2 > 0)
        virtualizer.value.resizeItem(index, height2);
      return;
    }
    if ((previous == null ? void 0 : previous.element) === element) {
      previous.index = index;
      return;
    }
    if (previous)
      disconnectRow(token);
    const row = element;
    const ResizeObserverCtor = view == null ? void 0 : view.ResizeObserver;
    const observer = ResizeObserverCtor ? new ResizeObserverCtor(() => queueRowMeasurement(token)) : void 0;
    observer == null ? void 0 : observer.observe(element);
    rowEntries.set(token, { element, index, observer });
    const height = row.getBoundingClientRect().height || row.offsetHeight;
    if (height > 0)
      virtualizer.value.resizeItem(index, height);
  };
  const cleanupRows = () => {
    var _a;
    for (const token of rowEntries.keys())
      disconnectRow(token);
    queuedRows.clear();
    if (rowFrame !== void 0)
      (_a = realm == null ? void 0 : realm.cancelAnimationFrame) == null ? void 0 : _a.call(realm, rowFrame);
    rowFrame = void 0;
  };
  const detachRealm = () => {
    const element = root.value;
    if (element) {
      element.removeEventListener("focusin", onFocusIn);
      element.removeEventListener("focusout", onFocusOut);
      for (const event of ["wheel", "touchstart", "pointerdown"])
        element.removeEventListener(event, cancelUserNavigation);
    }
    pauseViewport();
    cleanupRows();
    listenersAttached = false;
  };
  const attachRealm = (element) => {
    realm = element.ownerDocument.defaultView;
    const view = realm;
    const hasRequiredCapabilities = Boolean((view == null ? void 0 : view.ResizeObserver) && view.requestAnimationFrame && view.cancelAnimationFrame && view.setTimeout && view.clearTimeout);
    fallback.value = !hasRequiredCapabilities;
    if (fallback.value || disabled.value)
      return;
    element.addEventListener("focusin", onFocusIn);
    element.addEventListener("focusout", onFocusOut);
    for (const event of ["wheel", "touchstart", "pointerdown"])
      element.addEventListener(event, cancelUserNavigation, { passive: true });
    listenersAttached = true;
    resumeViewport();
  };
  onMounted(() => {
    mounted.value = true;
    const element = root.value;
    if (!element || !config.value)
      return;
    attachRealm(element);
    if (!fallback.value) {
      for (const row of Array.from(element.querySelectorAll("[data-tree-token]"))) {
        const key = keyFromRow(row);
        const index = indexFor(key);
        if (key !== void 0 && index >= 0)
          measureRow(row.parentElement, index, tokenFor(key));
      }
    }
  });
  watch(disabled, (next) => {
    if (!mounted.value || !root.value || !config.value || fallback.value)
      return;
    if (next) {
      cancelPending(false);
      pauseViewport();
      detachRealm();
      return;
    }
    attachRealm(root.value);
    for (const row of Array.from(root.value.querySelectorAll("[data-tree-token]"))) {
      const key = keyFromRow(row);
      const index = indexFor(key);
      if (key !== void 0 && index >= 0)
        measureRow(row.parentElement, index, tokenFor(key));
    }
  }, { flush: "post" });
  watch(config, (next, previous) => {
    const element = root.value;
    if (!mounted.value || !element)
      return;
    if (!next) {
      detachRealm();
      cancelPending(false);
      fallback.value = false;
      return;
    }
    if (!previous || !listenersAttached) {
      detachRealm();
      attachRealm(element);
    }
  }, { flush: "post" });
  watch(() => nodes.value.map((node) => tokenFor(node.key)), (keys) => {
    const valid = new Set(keys);
    for (const token of rowEntries.keys())
      if (!valid.has(token))
        disconnectRow(token);
  }, { flush: "post" });
  const nodeSignature = (entry) => [
    entry.node.title,
    entry.node.disabled ? "1" : "0",
    entry.node.isLeaf === void 0 ? "" : entry.node.isLeaf ? "1" : "0",
    entry.children.map(tokenFor).join(",")
  ].join("\0");
  let signatures = new Map(nodes.value.map((entry) => [tokenFor(entry.key), nodeSignature(entry)]));
  let removedTokens = /* @__PURE__ */ new Set();
  watch(nodes, (next) => {
    var _a, _b, _c;
    if (mounted.value && !fallback.value) {
      const nextSignatures = new Map(next.map((entry) => [tokenFor(entry.key), nodeSignature(entry)]));
      const indexes = new Map(next.map((entry, index) => [tokenFor(entry.key), index]));
      for (const [token, signature] of nextSignatures) {
        if (signatures.has(token) && signatures.get(token) !== signature || removedTokens.has(token)) {
          const index = indexes.get(token);
          if (index !== void 0) {
            const mountedRow = (_b = Array.from(((_a = root.value) == null ? void 0 : _a.querySelectorAll("[data-tree-token]")) ?? []).find((row) => row.dataset.treeToken === token)) == null ? void 0 : _b.parentElement;
            const measured = (mountedRow == null ? void 0 : mountedRow.getBoundingClientRect().height) || (mountedRow == null ? void 0 : mountedRow.offsetHeight);
            virtualizer.value.resizeItem(index, measured || ((_c = config.value) == null ? void 0 : _c.estimateSize) || 28);
          }
        }
      }
      removedTokens = new Set([...signatures.keys()].filter((token) => !nextSignatures.has(token)));
      signatures = nextSignatures;
    } else {
      signatures = new Map(next.map((entry) => [tokenFor(entry.key), nodeSignature(entry)]));
    }
  }, { flush: "post" });
  onBeforeUnmount(() => {
    alive.value = false;
    cancelPending(false);
    cleanupRows();
    detachRealm();
    realm = null;
  });
  return { rows, totalSize, items, fallback, ensureKey, isPending, isMountedKey, commitFocus, cancelPending, measureRow, focusRecoveryKey, virtualizer };
}
export {
  useTreeVirtual
};
