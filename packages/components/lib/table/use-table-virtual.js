"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vue = require("vue");
const virtualRows = require("./virtual-rows.js");
function useTableVirtual(options, count, scrollElement) {
  const scrollTop = vue.ref(0);
  const measured = vue.ref(/* @__PURE__ */ new Map());
  const range = vue.computed(() => options.value.enabled ? virtualRows.getVirtualRange(count.value, scrollTop.value, options.value.height, options.value.estimateSize, options.value.overscan, measured.value) : { start: 0, end: count.value, top: 0, bottom: 0 });
  const onScroll = () => {
    var _a;
    scrollTop.value = ((_a = scrollElement.value) == null ? void 0 : _a.scrollTop) ?? 0;
  };
  const setMeasured = (index, height) => {
    if (height > 0) {
      const next = new Map(measured.value);
      next.set(index, height);
      measured.value = next;
    }
  };
  vue.onMounted(() => {
    var _a;
    return (_a = scrollElement.value) == null ? void 0 : _a.addEventListener("scroll", onScroll, { passive: true });
  });
  vue.onBeforeUnmount(() => {
    var _a;
    return (_a = scrollElement.value) == null ? void 0 : _a.removeEventListener("scroll", onScroll);
  });
  return { range, scrollTop, measured, setMeasured, onScroll };
}
exports.useTableVirtual = useTableVirtual;
