"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const dragState = require("./drag-state.js");
const sortableContext = require("./sortable-context.js");
const useDraggable = require("./use-draggable.js");
const useDroppable = require("./use-droppable.js");
const _hoisted_1 = ["data-sortable-index", "tabindex", "aria-disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ASortableItem" },
  __name: "sortable-item",
  props: {
    item: {},
    index: {}
  },
  setup(__props) {
    const props = __props;
    const context = vue.inject(sortableContext.sortableContextKey);
    if (!context) throw new Error("ASortableItem must be used inside ASortableList.");
    const sortableContext$1 = context;
    const root = vue.ref();
    const itemDisabled = vue.computed(() => sortableContext$1.disabled.value || typeof props.item === "object" && props.item !== null && "disabled" in props.item && props.item.disabled === true);
    const data = vue.computed(() => ({
      type: "aheart-sortable",
      listId: sortableContext$1.listId,
      group: sortableContext$1.group,
      index: props.index
    }));
    const isTouchDragging = vue.ref(false);
    let touchSession;
    const removeTouchListeners = (session) => {
      session.document.removeEventListener("pointermove", handleTouchPointerMove);
      session.document.removeEventListener("pointerup", handleTouchPointerUp);
      session.document.removeEventListener("pointercancel", handleTouchPointerCancel);
    };
    const clearTouchSession = (clearDragState = true) => {
      if (!touchSession) return;
      const session = touchSession;
      touchSession = void 0;
      removeTouchListeners(session);
      if (session.started) {
        isTouchDragging.value = false;
        if (clearDragState) dragState.endDrag();
      }
    };
    function handleTouchPointerMove(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      if (itemDisabled.value) {
        clearTouchSession();
        return;
      }
      if (!touchSession.started) {
        const distanceX = event.clientX - touchSession.startX;
        const distanceY = event.clientY - touchSession.startY;
        if (Math.hypot(distanceX, distanceY) < 6) return;
        touchSession.started = true;
        isTouchDragging.value = true;
        dragState.startDrag(touchSession.data);
      }
      event.preventDefault();
    }
    function handleTouchPointerUp(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      const session = touchSession;
      const sourceElement = root.value;
      if (session.started) {
        event.preventDefault();
        const target = session.document.elementFromPoint(event.clientX, event.clientY);
        const targetItem = target == null ? void 0 : target.closest(".aheart-dnd-sortable-item");
        const sourceList = sourceElement == null ? void 0 : sourceElement.closest(".aheart-dnd-sortable-list");
        if (targetItem && targetItem.getAttribute("aria-disabled") !== "true" && sourceList && targetItem.closest(".aheart-dnd-sortable-list") === sourceList) {
          const targetIndex = Number(targetItem.dataset.sortableIndex);
          if (Number.isInteger(targetIndex)) sortableContext$1.move(session.data, targetIndex);
        }
      }
      clearTouchSession();
      if (session.started) {
        void vue.nextTick(() => {
          if ((sourceElement == null ? void 0 : sourceElement.isConnected) && !itemDisabled.value) sourceElement.focus({ preventScroll: true });
        });
      }
    }
    function handleTouchPointerCancel(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      clearTouchSession();
    }
    const handlePointerDown = (event) => {
      var _a;
      if (touchSession || itemDisabled.value) return;
      if (event.pointerType !== "touch" || !event.isPrimary || event.button !== 0) return;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      if (!ownerDocument) return;
      touchSession = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        data: { ...data.value },
        document: ownerDocument,
        started: false
      };
      ownerDocument.addEventListener("pointermove", handleTouchPointerMove, { passive: false });
      ownerDocument.addEventListener("pointerup", handleTouchPointerUp);
      ownerDocument.addEventListener("pointercancel", handleTouchPointerCancel);
    };
    const handleNativeDragStart = () => {
      clearTouchSession(false);
    };
    vue.onBeforeUnmount(() => clearTouchSession());
    const { isDragging } = useDraggable.useDraggable(root, { data, disabled: itemDisabled });
    useDroppable.useDroppable(root, {
      data,
      accept: "aheart-sortable",
      disabled: itemDisabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable" || source.group !== sortableContext$1.group) return;
        sortableContext$1.move(source, props.index);
      }
    });
    const handleKeydown = (event) => {
      if (itemDisabled.value) return;
      if (!event.altKey || event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      context.move(data.value, props.index + (event.key === "ArrowUp" ? -1 : 1), true);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("li", {
        ref_key: "root",
        ref: root,
        class: vue.normalizeClass(["aheart-dnd-sortable-item", { "aheart-dnd-dragging": vue.unref(isDragging) || isTouchDragging.value }]),
        "data-sortable-index": __props.index,
        tabindex: itemDisabled.value ? -1 : 0,
        "aria-disabled": itemDisabled.value ? "true" : void 0,
        onPointerdown: handlePointerDown,
        onDragstartCapture: handleNativeDragStart,
        onKeydown: handleKeydown
      }, [
        vue.renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          index: __props.index
        })
      ], 42, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
