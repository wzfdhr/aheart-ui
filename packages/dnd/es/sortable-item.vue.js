import { defineComponent, inject, ref, computed, onBeforeUnmount, watchEffect, openBlock, createElementBlock, normalizeClass, renderSlot, nextTick } from "vue";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/element/adapter.js";
import { endDrag, startDrag } from "./drag-state.js";
import { sortableContextKey } from "./sortable-context.js";
import { useDroppable } from "./use-droppable.js";
const _hoisted_1 = ["data-sortable-index", "tabindex", "aria-disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ASortableItem" },
  __name: "sortable-item",
  props: {
    item: {},
    index: {}
  },
  setup(__props) {
    const props = __props;
    const context = inject(sortableContextKey);
    if (!context) throw new Error("ASortableItem must be used inside ASortableList.");
    const sortableContext = context;
    const root = ref();
    const itemDisabled = computed(() => sortableContext.disabled.value || typeof props.item === "object" && props.item !== null && "disabled" in props.item && props.item.disabled === true);
    const data = computed(() => ({
      type: "aheart-sortable",
      listId: sortableContext.listId,
      group: sortableContext.group,
      index: props.index
    }));
    const isTouchDragging = ref(false);
    const dragHandle = ref();
    let touchSession;
    const removeTouchListeners = (session) => {
      session.document.removeEventListener("pointermove", handleTouchPointerMove);
      session.document.removeEventListener("pointerup", handleTouchPointerUp);
      session.document.removeEventListener("pointercancel", handleTouchPointerCancel);
      session.document.removeEventListener("visibilitychange", handleTouchVisibilityChange);
      session.window.removeEventListener("blur", handleTouchInterruption);
      session.window.removeEventListener("pagehide", handleTouchInterruption);
    };
    const clearTouchSession = (clearDragState = true) => {
      if (!touchSession) return;
      const session = touchSession;
      touchSession = void 0;
      removeTouchListeners(session);
      if (session.started) {
        isTouchDragging.value = false;
        if (clearDragState) endDrag();
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
        startDrag(touchSession.data);
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
          if (Number.isInteger(targetIndex)) sortableContext.move(session.data, targetIndex);
        }
      }
      clearTouchSession();
      if (session.started) {
        void nextTick(() => {
          if ((sourceElement == null ? void 0 : sourceElement.isConnected) && !itemDisabled.value) sourceElement.focus({ preventScroll: true });
        });
      }
    }
    function handleTouchPointerCancel(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      clearTouchSession();
    }
    function handleTouchInterruption() {
      clearTouchSession();
    }
    function handleTouchVisibilityChange() {
      if ((touchSession == null ? void 0 : touchSession.document.visibilityState) === "hidden") clearTouchSession();
    }
    const handlePointerDown = (event) => {
      var _a;
      if (touchSession || itemDisabled.value) return;
      if (event.pointerType !== "touch" || !event.isPrimary || event.button !== 0) return;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      const ownerWindow = ownerDocument == null ? void 0 : ownerDocument.defaultView;
      if (!ownerDocument || !ownerWindow) return;
      touchSession = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        data: { ...data.value },
        document: ownerDocument,
        window: ownerWindow,
        started: false
      };
      ownerDocument.addEventListener("pointermove", handleTouchPointerMove, { passive: false });
      ownerDocument.addEventListener("pointerup", handleTouchPointerUp);
      ownerDocument.addEventListener("pointercancel", handleTouchPointerCancel);
      ownerDocument.addEventListener("visibilitychange", handleTouchVisibilityChange);
      ownerWindow.addEventListener("blur", handleTouchInterruption);
      ownerWindow.addEventListener("pagehide", handleTouchInterruption);
    };
    const handleNativeDragStart = () => {
      clearTouchSession(false);
    };
    onBeforeUnmount(() => clearTouchSession());
    const setDragHandle = (element) => {
      const candidate = element instanceof Element ? element : element == null ? void 0 : element.$el;
      dragHandle.value = candidate instanceof Element ? candidate : void 0;
    };
    const handleProps = {
      class: "aheart-dnd-sortable-handle",
      "data-aheart-dnd-handle": "",
      ref: setDragHandle,
      onPointerdown: handlePointerDown
    };
    const isDragging = ref(false);
    watchEffect((onCleanup) => {
      const target = root.value;
      const handle = dragHandle.value;
      if (!target) return;
      const cleanup = draggable({
        element: target,
        dragHandle: handle,
        getInitialData: () => data.value,
        canDrag: () => !itemDisabled.value,
        onDragStart: () => {
          isDragging.value = true;
          startDrag(data.value);
        },
        onDrop: () => {
          isDragging.value = false;
          endDrag();
        }
      });
      onCleanup(() => {
        cleanup();
        if (isDragging.value) {
          isDragging.value = false;
          endDrag();
        }
      });
    });
    useDroppable(root, {
      data,
      accept: "aheart-sortable",
      disabled: itemDisabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable" || source.group !== sortableContext.group) return;
        sortableContext.move(source, props.index);
      }
    });
    const handleKeydown = (event) => {
      if (itemDisabled.value) return;
      if (!event.altKey || event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      context.move(data.value, props.index + (event.key === "ArrowUp" ? -1 : 1), true);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("li", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["aheart-dnd-sortable-item", { "aheart-dnd-dragging": isDragging.value || isTouchDragging.value }]),
        "data-sortable-index": __props.index,
        tabindex: itemDisabled.value ? -1 : 0,
        "aria-disabled": itemDisabled.value ? "true" : void 0,
        onDragstartCapture: handleNativeDragStart,
        onKeydown: handleKeydown
      }, [
        renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          index: __props.index,
          handleProps
        })
      ], 42, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
