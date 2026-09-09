"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const sortableItem_vue_vue_type_script_setup_true_lang = require("./sortable-item.vue.js");
const sortableContext = require("./sortable-context.js");
const sortableRegistry = require("./sortable-registry.js");
const useDroppable = require("./use-droppable.js");
const sortableAutoScroll = require("./sortable-auto-scroll.js");
const dndAnnouncer = require("./dnd-announcer.js");
const _hoisted_1 = ["data-aheart-sortable-list-id", "data-aheart-sortable-group", "data-aheart-sortable-disabled"];
let sortableListIdCounter = 0;
let sortableListDisplayOrder = 0;
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
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
    const listId = vue.ref();
    const displayOrder = vue.ref(0);
    const disabled = vue.computed(() => props.disabled);
    const root = vue.ref();
    const getItemKey = (item) => {
      const value = item[props.itemKey];
      return value === void 0 || value === null || value === "" ? "" : String(value);
    };
    const fallbackRevision = vue.ref(0);
    const revisionValue = vue.computed(() => props.revision ?? fallbackRevision.value);
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
    const listLabel = vue.computed(() => props.label ?? `列表 ${displayOrder.value || 1}`);
    vue.onMounted(() => {
      var _a, _b, _c, _d;
      mountedActive = true;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      const ownerWindow = ownerDocument == null ? void 0 : ownerDocument.defaultView;
      const randomUUID = (_b = ownerWindow == null ? void 0 : ownerWindow.crypto) == null ? void 0 : _b.randomUUID;
      const generatedId = randomUUID ? randomUUID.call(ownerWindow.crypto) : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${sortableListIdCounter++}`;
      listId.value = `aheart-sortable-${generatedId}`;
      displayOrder.value = ++sortableListDisplayOrder;
      unregister = sortableRegistry.registerSortableList(listId.value, {
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
          if (mountedActive) dndAnnouncer.replayDnd(ownerDocument, message);
        },
        onAnnounceNow: (message) => {
          if (mountedActive) dndAnnouncer.announceDndNow(ownerDocument, message);
        }
      });
      if (ownerDocument) releaseLiveRegion = dndAnnouncer.acquireDndLiveRegion(ownerDocument);
      const frameElement = ownerWindow == null ? void 0 : ownerWindow.frameElement;
      const ParentObserver = (_c = frameElement == null ? void 0 : frameElement.ownerDocument.defaultView) == null ? void 0 : _c.MutationObserver;
      if (frameElement && ParentObserver) {
        ownerDetachObserver = new ParentObserver(() => {
          if (!frameElement.isConnected) {
            unregister();
            releaseLiveRegion();
            if (ownerDocument) dndAnnouncer.disposeDndLiveRegion(ownerDocument);
            unregisterAutoScroll();
            mountedActive = false;
            ownerDetachObserver == null ? void 0 : ownerDetachObserver.disconnect();
          }
        });
        ownerDetachObserver.observe(frameElement.ownerDocument, { childList: true, subtree: true });
      }
      (_d = root.value) == null ? void 0 : _d.addEventListener("aheart-sortable-announce", handleAnnouncement);
    });
    vue.onBeforeUnmount(() => {
      var _a;
      ownerDetachObserver == null ? void 0 : ownerDetachObserver.disconnect();
      (_a = root.value) == null ? void 0 : _a.removeEventListener("aheart-sortable-announce", handleAnnouncement);
      unregister();
      mountedActive = false;
      releaseLiveRegion();
    });
    let unregisterAutoScroll = () => {
    };
    vue.onMounted(() => {
      unregisterAutoScroll = sortableAutoScroll.registerSortableAutoScroll(root.value);
    });
    vue.onBeforeUnmount(() => unregisterAutoScroll());
    const handleAnnouncement = (event) => {
      var _a;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      if (ownerDocument) dndAnnouncer.replayDnd(ownerDocument, event.detail);
    };
    let lastFingerprint;
    vue.watch(() => props.items.map((item) => [getItemKey(item), item]), (entries) => {
      const keys = entries.map(([key]) => key);
      const isDevelopment = false;
      if ((keys.some((key) => !key) || new Set(keys).size !== keys.length) && true && isDevelopment) ;
      const changed = !lastFingerprint || entries.length !== lastFingerprint.length || entries.some(([key, item], index) => key !== lastFingerprint[index][0] || item !== lastFingerprint[index][1]);
      if (changed) {
        fallbackRevision.value = Number(fallbackRevision.value) + 1;
        if (lastFingerprint && listId.value) sortableRegistry.invalidateSortableRevision(listId.value);
      }
      lastFingerprint = entries;
    }, { immediate: true, flush: "sync" });
    vue.watch(() => props.scopeKey, (scope, previous) => {
      var _a;
      if (scope !== previous) {
        if (listId.value) sortableRegistry.invalidateSortableScope(listId.value);
        const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
        if (ownerDocument) dndAnnouncer.announceDnd(ownerDocument, "页面已切换，拖动已取消");
      }
    });
    vue.watch(() => props.group, () => {
      if (listId.value) sortableRegistry.closeSortableSessionsForList(listId.value);
    });
    const move = (inputSource, targetIndex, keyboard = false) => {
      if (disabled.value) return false;
      const currentListId = listId.value;
      if (!currentListId) return false;
      const source = inputSource.sessionId ? inputSource : sortableRegistry.beginSortableSession({ ...inputSource, input: keyboard ? "keyboard" : "pointer" });
      sortableRegistry.moveSortableItem(source, currentListId, targetIndex);
    };
    vue.provide(sortableContext.sortableContextKey, {
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
    useDroppable.useDroppable(root, {
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
      return vue.openBlock(), vue.createElementBlock("ul", {
        ref_key: "root",
        ref: root,
        class: "aheart-dnd-sortable-list",
        "data-aheart-sortable-list-id": listId.value,
        "data-aheart-sortable-group": __props.group,
        "data-aheart-sortable-disabled": disabled.value ? "true" : void 0,
        role: "list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.items, (item, index) => {
          return vue.openBlock(), vue.createBlock(sortableItem_vue_vue_type_script_setup_true_lang.default, {
            key: getItemKey(item),
            item,
            index,
            "item-key": getItemKey(item),
            revision: revisionValue.value
          }, {
            default: vue.withCtx((slotProps) => [
              vue.renderSlot(_ctx.$slots, "item", vue.mergeProps({ ref_for: true }, slotProps))
            ]),
            _: 3
          }, 8, ["item", "index", "item-key", "revision"]);
        }), 128))
      ], 8, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
