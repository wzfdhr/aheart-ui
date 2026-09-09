import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch, provide, openBlock, createElementBlock, Fragment, renderList, createBlock, withCtx, renderSlot, mergeProps } from "vue";
import _sfc_main$1 from "./sortable-item.vue.js";
import { sortableContextKey } from "./sortable-context.js";
import { registerSortableList, invalidateSortableScope, closeSortableSessionsForList, invalidateSortableRevision, beginSortableSession, moveSortableItem } from "./sortable-registry.js";
import { useDroppable } from "./use-droppable.js";
import { registerSortableAutoScroll } from "./sortable-auto-scroll.js";
import { acquireDndLiveRegion, disposeDndLiveRegion, replayDnd, announceDnd, announceDndNow } from "./dnd-announcer.js";
const _hoisted_1 = ["data-aheart-sortable-list-id", "data-aheart-sortable-group", "data-aheart-sortable-disabled"];
let sortableListIdCounter = 0;
let sortableListDisplayOrder = 0;
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ASortableList" },
  __name: "sortable-list",
  props: {
    items: {},
    itemKey: {},
    group: {},
    disabled: { type: Boolean, default: false },
    revision: {},
    label: {},
    itemLabel: {},
    scopeKey: {}
  },
  emits: ["update:items", "change", "moveStart", "moveCommit", "moveReject"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const listId = ref();
    const displayOrder = ref(0);
    const disabled = computed(() => props.disabled);
    const root = ref();
    const getItemKey = (item) => {
      const value = item[props.itemKey];
      return value === void 0 || value === null || value === "" ? "" : String(value);
    };
    const fallbackRevision = ref(0);
    const revisionValue = computed(() => props.revision ?? fallbackRevision.value);
    const updateItems = (items, context) => {
      const nextItems = items;
      emit("update:items", nextItems);
      emit("change", nextItems, context);
    };
    let unregister = () => {
    };
    let releaseLiveRegion = () => {
    };
    let mountedActive = false;
    let ownerDetachObserver;
    const listLabel = computed(() => props.label ?? `列表 ${displayOrder.value || 1}`);
    onMounted(() => {
      var _a, _b, _c, _d;
      mountedActive = true;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      const ownerWindow = ownerDocument == null ? void 0 : ownerDocument.defaultView;
      const randomUUID = (_b = ownerWindow == null ? void 0 : ownerWindow.crypto) == null ? void 0 : _b.randomUUID;
      const generatedId = randomUUID ? randomUUID.call(ownerWindow.crypto) : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${sortableListIdCounter++}`;
      listId.value = `aheart-sortable-${generatedId}`;
      displayOrder.value = ++sortableListDisplayOrder;
      unregister = registerSortableList(listId.value, {
        group: () => props.group,
        items: () => props.items,
        update: updateItems,
        keyOf: (item) => getItemKey(item),
        revision: () => props.revision ?? fallbackRevision.value,
        scopeKey: () => props.scopeKey,
        ownerDocument: () => ownerDocument,
        disabled: () => props.disabled,
        label: () => listLabel.value,
        itemLabel: (item, index) => {
          var _a2;
          return ((_a2 = props.itemLabel) == null ? void 0 : _a2.call(props, item, index)) ?? getItemKey(item);
        },
        onMoveStart: (event) => emit("moveStart", event),
        onMoveCommit: (event) => emit("moveCommit", event),
        onMoveReject: (event) => emit("moveReject", event),
        onAnnounce: (message) => {
          if (mountedActive) replayDnd(ownerDocument, message);
        },
        onAnnounceNow: (message) => {
          if (mountedActive) announceDndNow(ownerDocument, message);
        }
      });
      if (ownerDocument) releaseLiveRegion = acquireDndLiveRegion(ownerDocument);
      const frameElement = ownerWindow == null ? void 0 : ownerWindow.frameElement;
      const ParentObserver = (_c = frameElement == null ? void 0 : frameElement.ownerDocument.defaultView) == null ? void 0 : _c.MutationObserver;
      if (frameElement && ParentObserver) {
        ownerDetachObserver = new ParentObserver(() => {
          if (!frameElement.isConnected) {
            unregister();
            releaseLiveRegion();
            if (ownerDocument) disposeDndLiveRegion(ownerDocument);
            unregisterAutoScroll();
            mountedActive = false;
            ownerDetachObserver == null ? void 0 : ownerDetachObserver.disconnect();
          }
        });
        ownerDetachObserver.observe(frameElement.ownerDocument, { childList: true, subtree: true });
      }
      (_d = root.value) == null ? void 0 : _d.addEventListener("aheart-sortable-announce", handleAnnouncement);
    });
    onBeforeUnmount(() => {
      var _a;
      ownerDetachObserver == null ? void 0 : ownerDetachObserver.disconnect();
      (_a = root.value) == null ? void 0 : _a.removeEventListener("aheart-sortable-announce", handleAnnouncement);
      unregister();
      mountedActive = false;
      releaseLiveRegion();
    });
    let unregisterAutoScroll = () => {
    };
    onMounted(() => {
      unregisterAutoScroll = registerSortableAutoScroll(root.value);
    });
    onBeforeUnmount(() => unregisterAutoScroll());
    const handleAnnouncement = (event) => {
      var _a;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      if (ownerDocument) replayDnd(ownerDocument, event.detail);
    };
    let lastFingerprint;
    watch(() => props.items.map((item) => [getItemKey(item), item]), (entries) => {
      const keys = entries.map(([key]) => key);
      const isDevelopment = false;
      if ((keys.some((key) => !key) || new Set(keys).size !== keys.length) && true && isDevelopment) ;
      const changed = !lastFingerprint || entries.length !== lastFingerprint.length || entries.some(([key, item], index) => key !== lastFingerprint[index][0] || item !== lastFingerprint[index][1]);
      if (changed) {
        fallbackRevision.value = Number(fallbackRevision.value) + 1;
        if (lastFingerprint && listId.value) invalidateSortableRevision(listId.value);
      }
      lastFingerprint = entries;
    }, { immediate: true, flush: "sync" });
    watch(() => props.scopeKey, (scope, previous) => {
      var _a;
      if (scope !== previous) {
        if (listId.value) invalidateSortableScope(listId.value);
        const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
        if (ownerDocument) announceDnd(ownerDocument, "页面已切换，拖动已取消");
      }
    });
    watch(() => props.group, () => {
      if (listId.value) closeSortableSessionsForList(listId.value);
    });
    const move = (inputSource, targetIndex, keyboard = false) => {
      if (disabled.value) return false;
      const currentListId = listId.value;
      if (!currentListId) return false;
      const source = inputSource.sessionId ? inputSource : beginSortableSession({ ...inputSource, input: keyboard ? "keyboard" : "pointer" });
      moveSortableItem(source, currentListId, targetIndex);
    };
    provide(sortableContextKey, {
      get listId() {
        return listId.value ?? "";
      },
      get group() {
        return props.group;
      },
      get scopeKey() {
        return props.scopeKey;
      },
      disabled,
      move
    });
    useDroppable(root, {
      data: () => {
        const currentListId = listId.value;
        return currentListId ? { type: "aheart-sortable", listId: currentListId, group: props.group, targetIndex: props.items.length, position: { kind: "end" } } : void 0;
      },
      accept: "aheart-sortable",
      disabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable") return;
        move(source, props.items.length);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ul", {
        ref_key: "root",
        ref: root,
        class: "aheart-dnd-sortable-list",
        "data-aheart-sortable-list-id": listId.value,
        "data-aheart-sortable-group": __props.group,
        "data-aheart-sortable-disabled": disabled.value ? "true" : void 0,
        role: "list"
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item, index) => {
          return openBlock(), createBlock(_sfc_main$1, {
            key: getItemKey(item),
            item,
            index,
            "item-key": getItemKey(item),
            revision: revisionValue.value
          }, {
            default: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, slotProps))
            ]),
            _: 3
          }, 8, ["item", "index", "item-key", "revision"]);
        }), 128))
      ], 8, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
