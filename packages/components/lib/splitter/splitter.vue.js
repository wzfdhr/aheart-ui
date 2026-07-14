"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const usePointerDrag = require("../utils/use-pointer-drag.js");
const solver = require("./solver.js");
require("./style.css.js");
const splitterProps = {
  sizes: Array,
  defaultSizes: {
    type: Array,
    default: () => []
  },
  layout: {
    type: String,
    default: "horizontal"
  },
  lazy: Boolean,
  disabled: Boolean
};
const _sfc_main = vue.defineComponent({
  name: "ASplitter",
  props: splitterProps,
  emits: {
    "update:sizes": (sizes) => Array.isArray(sizes),
    resizeStart: (sizes) => Array.isArray(sizes),
    resize: (sizes) => Array.isArray(sizes),
    resizeEnd: (sizes) => Array.isArray(sizes)
  },
  setup(props, { emit, slots }) {
    const rootRef = vue.ref(null);
    const containerSize = vue.ref(0);
    const innerSizes = vue.ref([...props.defaultSizes]);
    const pendingSizes = vue.ref(null);
    const collapsedPanels = vue.ref(/* @__PURE__ */ new Set());
    const collapsedSizes = /* @__PURE__ */ new Map();
    const dragState = vue.ref(null);
    let resizeObserver;
    const panelNodes = vue.computed(() => {
      var _a;
      return (((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []).filter((node) => node.type !== vue.Comment && node.type !== vue.Text);
    });
    const panelConstraints = vue.computed(
      () => panelNodes.value.map((node) => {
        const panel = node.props ?? {};
        return { min: panel.min, max: panel.max, collapsible: panel.collapsible };
      })
    );
    const sourceSizes = vue.computed(() => {
      const configured = props.sizes ?? innerSizes.value;
      return panelNodes.value.map((_, index) => configured[index] ?? "auto");
    });
    const solverContainerSize = vue.computed(() => {
      if (containerSize.value > 0)
        return containerSize.value;
      return sourceSizes.value.reduce((total, size) => total + (typeof size === "number" ? size : 0), 0);
    });
    const resolvedSizes = vue.computed(
      () => pendingSizes.value ?? solver.resolveSplitterSizes({
        containerSize: solverContainerSize.value,
        sizes: sourceSizes.value,
        panels: panelConstraints.value
      })
    );
    const isHorizontal = vue.computed(() => props.layout === "horizontal");
    const updateContainerSize = () => {
      const root = rootRef.value;
      containerSize.value = root ? isHorizontal.value ? root.clientWidth : root.clientHeight : 0;
    };
    const emitSizes = (sizes) => {
      if (props.sizes === void 0) {
        innerSizes.value = sizes;
      }
      emit("update:sizes", sizes);
      emit("resize", sizes);
    };
    const applyResize = (handleIndex, delta, shouldEmit) => {
      var _a;
      const startSizes = ((_a = dragState.value) == null ? void 0 : _a.sizes) ?? resolvedSizes.value;
      const nextSizes = solver.resizeAdjacentPanels({
        sizes: startSizes,
        panels: panelConstraints.value,
        handleIndex,
        delta
      });
      pendingSizes.value = nextSizes;
      if (shouldEmit)
        emitSizes(nextSizes);
      return nextSizes;
    };
    const { isDragging, start: startPointerDrag } = usePointerDrag.usePointerDrag({
      cursor: () => isHorizontal.value ? "col-resize" : "row-resize",
      onMove: (event) => {
        const state = dragState.value;
        if (!state)
          return;
        const delta = isHorizontal.value ? event.clientX - state.startX : event.clientY - state.startY;
        applyResize(state.handleIndex, delta, !props.lazy);
      },
      onEnd: (reason) => {
        const nextSizes = pendingSizes.value;
        if (reason === "end" && nextSizes && props.lazy)
          emitSizes(nextSizes);
        if (reason === "end" && nextSizes)
          emit("resizeEnd", nextSizes);
        pendingSizes.value = null;
        dragState.value = null;
      }
    });
    const handlePointerDown = (event, handleIndex) => {
      if (props.disabled)
        return;
      dragState.value = {
        handleIndex,
        startX: event.clientX,
        startY: event.clientY,
        sizes: [...resolvedSizes.value]
      };
      startPointerDrag(event);
      if (!isDragging.value) {
        dragState.value = null;
        return;
      }
      emit("resizeStart", resolvedSizes.value);
    };
    const handleKeydown = (event, handleIndex) => {
      if (props.disabled)
        return;
      const increaseKey = isHorizontal.value ? "ArrowRight" : "ArrowDown";
      const decreaseKey = isHorizontal.value ? "ArrowLeft" : "ArrowUp";
      if (event.key !== increaseKey && event.key !== decreaseKey)
        return;
      event.preventDefault();
      const delta = (event.key === increaseKey ? 1 : -1) * (event.shiftKey ? 50 : 10);
      const nextSizes = applyResize(handleIndex, delta, true);
      pendingSizes.value = null;
      emit("resizeEnd", nextSizes);
    };
    const getCollapsiblePanelIndex = (handleIndex) => {
      var _a, _b;
      if ((_a = panelConstraints.value[handleIndex]) == null ? void 0 : _a.collapsible)
        return handleIndex;
      if ((_b = panelConstraints.value[handleIndex + 1]) == null ? void 0 : _b.collapsible)
        return handleIndex + 1;
      return void 0;
    };
    const togglePanelCollapse = (handleIndex) => {
      if (props.disabled)
        return;
      const panelIndex = getCollapsiblePanelIndex(handleIndex);
      if (panelIndex === void 0)
        return;
      const currentSizes = resolvedSizes.value;
      const isCollapsed = collapsedPanels.value.has(panelIndex);
      const targetSize = isCollapsed ? collapsedSizes.get(panelIndex) ?? currentSizes[panelIndex] : solver.resolveSplitterPanelBounds(panelConstraints.value[panelIndex], solverContainerSize.value).min;
      const delta = panelIndex === currentSizes.length - 1 ? currentSizes[panelIndex] - targetSize : targetSize - currentSizes[panelIndex];
      const nextSizes = solver.resizeAdjacentPanels({
        sizes: currentSizes,
        panels: panelConstraints.value,
        handleIndex: panelIndex === currentSizes.length - 1 ? panelIndex - 1 : panelIndex,
        delta
      });
      if (isCollapsed) {
        collapsedSizes.delete(panelIndex);
        const nextCollapsedPanels = new Set(collapsedPanels.value);
        nextCollapsedPanels.delete(panelIndex);
        collapsedPanels.value = nextCollapsedPanels;
      } else {
        collapsedSizes.set(panelIndex, currentSizes[panelIndex]);
        collapsedPanels.value = /* @__PURE__ */ new Set([...collapsedPanels.value, panelIndex]);
      }
      emitSizes(nextSizes);
    };
    const panelStyle = (index) => {
      const rawSize = sourceSizes.value[index];
      if (rawSize === "auto" && containerSize.value === 0) {
        return { flex: "1 1 0" };
      }
      return {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: `${resolvedSizes.value[index] ?? 0}px`
      };
    };
    const getHandleAriaBounds = (handleIndex) => {
      const leftSize = resolvedSizes.value[handleIndex] ?? 0;
      const rightSize = resolvedSizes.value[handleIndex + 1] ?? 0;
      const leftBounds = solver.resolveSplitterPanelBounds(panelConstraints.value[handleIndex], solverContainerSize.value);
      const rightBounds = solver.resolveSplitterPanelBounds(panelConstraints.value[handleIndex + 1], solverContainerSize.value);
      return {
        min: Math.max(leftBounds.min, leftSize + rightSize - rightBounds.max),
        max: Math.min(leftBounds.max, leftSize + rightSize - rightBounds.min)
      };
    };
    vue.onMounted(() => {
      updateContainerSize();
      if (typeof ResizeObserver !== "undefined" && rootRef.value) {
        resizeObserver = new ResizeObserver(updateContainerSize);
        resizeObserver.observe(rootRef.value);
      }
    });
    vue.onBeforeUnmount(() => resizeObserver == null ? void 0 : resizeObserver.disconnect());
    return () => {
      const children = [];
      panelNodes.value.forEach((panel, index) => {
        var _a;
        children.push(vue.cloneVNode(panel, { style: [(_a = panel.props) == null ? void 0 : _a.style, panelStyle(index)] }));
        if (index >= panelNodes.value.length - 1)
          return;
        const size = resolvedSizes.value[index] ?? 0;
        const bounds = getHandleAriaBounds(index);
        const collapsiblePanelIndex = getCollapsiblePanelIndex(index);
        const isPanelCollapsed = collapsiblePanelIndex !== void 0 && collapsedPanels.value.has(collapsiblePanelIndex);
        const handleChildren = [];
        if (collapsiblePanelIndex !== void 0) {
          handleChildren.push(
            vue.h("button", {
              class: "aheart-splitter__collapse",
              type: "button",
              disabled: props.disabled,
              "aria-label": isPanelCollapsed ? "Expand panel" : "Collapse panel",
              "aria-pressed": isPanelCollapsed,
              onPointerdown: (event) => event.stopPropagation(),
              onClick: () => togglePanelCollapse(index)
            })
          );
        }
        children.push(
          vue.h("div", {
            class: ["aheart-splitter__handle", `aheart-splitter__handle--${props.layout}`],
            role: "separator",
            tabindex: props.disabled ? -1 : 0,
            "aria-orientation": isHorizontal.value ? "vertical" : "horizontal",
            "aria-valuenow": Math.round(size),
            "aria-valuemin": Math.round(bounds.min),
            "aria-valuemax": Math.round(bounds.max),
            "aria-disabled": props.disabled || void 0,
            onPointerdown: (event) => handlePointerDown(event, index),
            onKeydown: (event) => handleKeydown(event, index)
          }, handleChildren)
        );
      });
      return vue.h(
        "div",
        {
          ref: rootRef,
          class: ["aheart-splitter", `aheart-splitter--${props.layout}`]
        },
        children
      );
    };
  }
});
exports.default = _sfc_main;
