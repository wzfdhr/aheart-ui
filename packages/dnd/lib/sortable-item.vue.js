"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const adapter = require("@atlaskit/pragmatic-drag-and-drop/element/adapter");
const dragState = require("./drag-state.js");
const sortableContext = require("./sortable-context.js");
const sortableRegistry = require("./sortable-registry.js");
const useDroppable = require("./use-droppable.js");
const _hoisted_1 = ["data-sortable-index", "tabindex", "aria-disabled"];
let activeTouchOwner;
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ASortableItem" },
  __name: "sortable-item",
  props: {
    item: {},
    index: {},
    itemKey: {},
    revision: {}
  },
  setup(__props) {
    const props = __props;
    const context = vue.inject(sortableContext.sortableContextKey);
    if (!context) throw new Error("ASortableItem must be used inside ASortableList.");
    const sortableContext$1 = context;
    vue.watch(() => sortableContext$1.group, () => {
      sortableRegistry.closeSortableSession(activeSession == null ? void 0 : activeSession.sessionId);
      activeSession = void 0;
    });
    const root = vue.ref();
    const itemDisabled = vue.computed(() => sortableContext$1.disabled.value || typeof props.item === "object" && props.item !== null && "disabled" in props.item && props.item.disabled === true);
    const data = vue.computed(() => ({
      type: "aheart-sortable",
      listId: sortableContext$1.listId,
      group: sortableContext$1.group,
      index: props.index,
      itemKey: props.itemKey,
      revision: props.revision,
      scopeKey: sortableContext$1.scopeKey
    }));
    let activeSession;
    const isTouchDragging = vue.ref(false);
    const dragHandle = vue.ref();
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
      if (activeTouchOwner === releaseTouchOwnership) activeTouchOwner = void 0;
      removeTouchListeners(session);
      if (session.started) {
        isTouchDragging.value = false;
        if (clearDragState) dragState.endDrag(session.document);
      }
      sortableRegistry.closeSortableSession(session.data.sessionId);
    };
    function releaseTouchOwnership() {
      clearTouchSession();
    }
    const completeMove = (ownerDocument, sourceElement, targetListId, targetIndex, focusHandle, _announcement) => {
      void vue.nextTick(() => {
        var _a;
        const destinationList = Array.from(ownerDocument.querySelectorAll(".aheart-dnd-sortable-list")).find((element) => element.dataset.aheartSortableListId === targetListId);
        const destinationItem = destinationList == null ? void 0 : destinationList.querySelector(`[data-sortable-index="${targetIndex}"]`);
        const moved = sourceElement.isConnected ? destinationItem === sourceElement : Boolean(destinationItem);
        if (!moved || !destinationList || !destinationItem) return;
        const destinationHandle = focusHandle ? destinationItem == null ? void 0 : destinationItem.querySelector("[data-aheart-dnd-handle]") : void 0;
        (_a = destinationHandle ?? destinationItem) == null ? void 0 : _a.focus({ preventScroll: true });
      });
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
        dragState.startDrag(touchSession.data, touchSession.document);
      }
      event.preventDefault();
    }
    function handleTouchPointerUp(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      const session = touchSession;
      if (session.started) {
        event.preventDefault();
        const target = session.document.elementFromPoint(event.clientX, event.clientY);
        const targetItem = target == null ? void 0 : target.closest(".aheart-dnd-sortable-item");
        const targetList = target == null ? void 0 : target.closest(".aheart-dnd-sortable-list");
        const targetListId = targetList == null ? void 0 : targetList.dataset.aheartSortableListId;
        if (targetListId && targetList.dataset.aheartSortableDisabled !== "true" && (!targetItem || targetItem.getAttribute("aria-disabled") !== "true")) {
          const targetIndex = targetItem ? Number(targetItem.dataset.sortableIndex) : targetList.querySelectorAll(".aheart-dnd-sortable-item").length;
          if (Number.isInteger(targetIndex)) {
            const sourceElement = root.value;
            const moved = sortableRegistry.moveSortableItem(session.data, targetListId, targetIndex);
            if (moved && sourceElement) {
              completeMove(
                session.document,
                sourceElement,
                targetListId,
                targetIndex,
                session.data.listId !== targetListId,
                session.data.listId === targetListId ? `已移动到第 ${targetIndex + 1} 项` : `已跨列表移动到第 ${targetIndex + 1} 项`
              );
            }
          }
        }
      }
      clearTouchSession();
    }
    function handleTouchPointerCancel(event) {
      if (!touchSession || event.pointerId !== touchSession.pointerId) return;
      clearTouchSession();
    }
    function handleTouchInterruption() {
      sortableRegistry.closeSortableSession(touchSession == null ? void 0 : touchSession.data.sessionId);
      clearTouchSession();
    }
    function handleTouchVisibilityChange() {
      if ((touchSession == null ? void 0 : touchSession.document.visibilityState) === "hidden") {
        sortableRegistry.closeSortableSession(touchSession.data.sessionId);
        clearTouchSession();
      }
    }
    const handlePointerDown = (event) => {
      var _a;
      if (touchSession || activeTouchOwner || itemDisabled.value) return;
      if (event.pointerType !== "touch" || !event.isPrimary || event.button !== 0) return;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      const ownerWindow = ownerDocument == null ? void 0 : ownerDocument.defaultView;
      if (!ownerDocument || !ownerWindow) return;
      touchSession = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        data: sortableRegistry.beginSortableSession({ ...data.value, input: "touch" }),
        document: ownerDocument,
        window: ownerWindow,
        started: false
      };
      activeTouchOwner = releaseTouchOwnership;
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
    const handleNativeDragEnd = () => {
      var _a;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      sortableRegistry.closeSortableSession(activeSession == null ? void 0 : activeSession.sessionId);
      activeSession = void 0;
      isDragging.value = false;
      if (ownerDocument) dragState.endDrag(ownerDocument);
    };
    vue.onBeforeUnmount(() => clearTouchSession());
    const setDragHandle = (element) => {
      var _a, _b;
      const candidate = element && "$el" in element ? element.$el : element;
      const ElementConstructor = (_b = (_a = candidate == null ? void 0 : candidate.ownerDocument) == null ? void 0 : _a.defaultView) == null ? void 0 : _b.Element;
      dragHandle.value = ElementConstructor && candidate instanceof ElementConstructor ? candidate : void 0;
    };
    const handleProps = {
      class: "aheart-dnd-sortable-handle",
      "data-aheart-dnd-handle": "",
      ref: setDragHandle,
      onPointerdown: handlePointerDown
    };
    const isDragging = vue.ref(false);
    vue.watchEffect((onCleanup) => {
      const target = root.value;
      const handle = dragHandle.value;
      if (!target) return;
      const cleanup = adapter.draggable({
        element: target,
        dragHandle: handle,
        getInitialData: () => {
          activeSession ?? (activeSession = sortableRegistry.beginSortableSession({ ...data.value, input: "pointer" }));
          return activeSession;
        },
        canDrag: () => !itemDisabled.value,
        onDragStart: () => {
          isDragging.value = true;
          activeSession ?? (activeSession = sortableRegistry.beginSortableSession({ ...data.value, input: "pointer" }));
          dragState.startDrag(activeSession, target.ownerDocument);
        },
        onDrop: () => {
          isDragging.value = false;
          sortableRegistry.closeSortableSession(activeSession == null ? void 0 : activeSession.sessionId);
          activeSession = void 0;
          dragState.endDrag(target.ownerDocument);
        }
      });
      onCleanup(() => {
        const sessionId = activeSession == null ? void 0 : activeSession.sessionId;
        cleanup();
        if (isDragging.value) {
          dragState.cancelNativeDrag(target.ownerDocument.defaultView ?? void 0);
          isDragging.value = false;
          sortableRegistry.closeSortableSession(activeSession == null ? void 0 : activeSession.sessionId);
          activeSession = void 0;
          dragState.endDrag(target.ownerDocument);
        }
        sortableRegistry.closeSortableSession(sessionId);
        activeSession = void 0;
      });
    });
    useDroppable.useDroppable(root, {
      data: () => ({ ...data.value, position: { kind: "item", itemKey: props.itemKey ?? String(props.index) } }),
      accept: "aheart-sortable",
      disabled: itemDisabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable") return;
        sortableContext$1.move({ ...source, position: { kind: "item", itemKey: props.itemKey ?? String(props.index) } }, props.index);
      }
    });
    const handleKeydown = (event) => {
      var _a;
      if (itemDisabled.value) return;
      if (!event.altKey || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const target = event.target && typeof event.target === "object" && "closest" in event.target ? event.target : void 0;
      const ownerDocument = (target == null ? void 0 : target.ownerDocument) ?? ((_a = root.value) == null ? void 0 : _a.ownerDocument);
      const sourceElement = root.value;
      if (!ownerDocument || !sourceElement) return;
      const focusHandle = Boolean(target == null ? void 0 : target.closest("[data-aheart-dnd-handle]"));
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const targetIndex = props.index + (event.key === "ArrowUp" ? -1 : 1);
        const session = sortableRegistry.beginSortableSession({ ...data.value, input: "keyboard", keyboard: true });
        context.move({ ...session }, targetIndex, true);
        completeMove(ownerDocument, sourceElement, sortableContext$1.listId, targetIndex, focusHandle);
        return;
      }
      const lists = Array.from(ownerDocument.querySelectorAll(".aheart-dnd-sortable-list"));
      const sourceListIndex = lists.findIndex((list) => list.dataset.aheartSortableListId === sortableContext$1.listId);
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const registeredTarget = sortableRegistry.findAdjacentSortableList(sortableContext$1.listId, direction);
      if (registeredTarget) {
        const session = sortableRegistry.beginSortableSession({ ...data.value, input: "keyboard", keyboard: true });
        if (sortableRegistry.moveSortableItem(session, registeredTarget.listId, registeredTarget.length)) {
          completeMove(ownerDocument, sourceElement, registeredTarget.listId, registeredTarget.length, focusHandle, `已跨列表移动到第 ${registeredTarget.length + 1} 项`);
        }
        return;
      }
      for (let index = sourceListIndex + direction; index >= 0 && index < lists.length; index += direction) {
        const targetList = lists[index];
        const targetListId = targetList.dataset.aheartSortableListId;
        if (!targetListId || targetList.dataset.aheartSortableDisabled === "true" || !sortableContext$1.group || targetList.dataset.aheartSortableGroup !== sortableContext$1.group) continue;
        const targetIndex = targetList.querySelectorAll(".aheart-dnd-sortable-item").length;
        const session = sortableRegistry.beginSortableSession({ ...data.value, input: "keyboard", keyboard: true });
        if (sortableRegistry.moveSortableItem(session, targetListId, targetIndex)) {
          completeMove(ownerDocument, sourceElement, targetListId, targetIndex, focusHandle);
        }
        return;
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("li", {
        ref_key: "root",
        ref: root,
        class: vue.normalizeClass(["aheart-dnd-sortable-item", { "aheart-dnd-dragging": isDragging.value || isTouchDragging.value }]),
        "data-sortable-index": __props.index,
        tabindex: itemDisabled.value ? -1 : 0,
        "aria-disabled": itemDisabled.value ? "true" : void 0,
        onDragstartCapture: handleNativeDragStart,
        onDragendCapture: handleNativeDragEnd,
        onKeydown: handleKeydown
      }, [
        vue.renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          index: __props.index,
          handleProps
        })
      ], 42, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
