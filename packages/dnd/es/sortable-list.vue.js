import { defineComponent, ref, computed, onMounted, onBeforeUnmount, provide, openBlock, createElementBlock, Fragment, renderList, createBlock, withCtx, renderSlot, mergeProps } from "vue";
import _sfc_main$1 from "./sortable-item.vue.js";
import { sortableContextKey } from "./sortable-context.js";
import { registerSortableList, moveSortableItem } from "./sortable-registry.js";
import { useDroppable } from "./use-droppable.js";
import { registerSortableAutoScroll } from "./sortable-auto-scroll.js";
const _hoisted_1 = ["data-aheart-sortable-list-id", "data-aheart-sortable-group", "data-aheart-sortable-disabled"];
let sortableListIdCounter = 0;
const liveRegions = /* @__PURE__ */ new WeakMap();
const acquireLiveRegion = (ownerDocument) => {
  let state = liveRegions.get(ownerDocument);
  if (!state) {
    const element = ownerDocument.createElement("div");
    element.className = "aheart-dnd-live-region";
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    (ownerDocument.body ?? ownerDocument.documentElement).append(element);
    state = { element, count: 0, token: 0 };
    liveRegions.set(ownerDocument, state);
  }
  state.count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    if (state.count > 0) return;
    state.token += 1;
    state.element.remove();
    liveRegions.delete(ownerDocument);
  };
};
const announceLiveRegion = (ownerDocument, announcement) => {
  const state = liveRegions.get(ownerDocument);
  if (!state) return;
  state.token += 1;
  state.element.textContent = "";
  const token = state.token;
  Promise.resolve().then(() => {
    if (liveRegions.get(ownerDocument) !== state || state.token !== token) return;
    state.element.textContent = announcement;
  });
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ASortableList" },
  __name: "sortable-list",
  props: {
    items: {},
    itemKey: {},
    group: {},
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:items", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const listId = ref();
    const disabled = computed(() => props.disabled);
    const root = ref();
    const updateItems = (items) => {
      const nextItems = items;
      emit("update:items", nextItems);
      emit("change", nextItems);
    };
    let unregister = () => {
    };
    let releaseLiveRegion = () => {
    };
    onMounted(() => {
      var _a, _b, _c;
      const ownerDocument = (_a = root.value) == null ? void 0 : _a.ownerDocument;
      const ownerWindow = ownerDocument == null ? void 0 : ownerDocument.defaultView;
      const randomUUID = (_b = ownerWindow == null ? void 0 : ownerWindow.crypto) == null ? void 0 : _b.randomUUID;
      const generatedId = randomUUID ? randomUUID.call(ownerWindow.crypto) : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${sortableListIdCounter++}`;
      listId.value = `aheart-sortable-${generatedId}`;
      unregister = registerSortableList(listId.value, {
        group: () => props.group,
        items: () => props.items,
        update: updateItems
      });
      if (ownerDocument) releaseLiveRegion = acquireLiveRegion(ownerDocument);
      (_c = root.value) == null ? void 0 : _c.addEventListener("aheart-sortable-announce", handleAnnouncement);
    });
    onBeforeUnmount(() => {
      var _a;
      (_a = root.value) == null ? void 0 : _a.removeEventListener("aheart-sortable-announce", handleAnnouncement);
      releaseLiveRegion();
      unregister();
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
      if (ownerDocument) announceLiveRegion(ownerDocument, event.detail);
    };
    const move = (source, targetIndex) => {
      if (disabled.value) return false;
      const currentListId = listId.value;
      if (!currentListId) return false;
      moveSortableItem(source, currentListId, targetIndex);
    };
    provide(sortableContextKey, {
      get listId() {
        return listId.value ?? "";
      },
      group: props.group,
      disabled,
      move
    });
    useDroppable(root, {
      data: () => {
        const currentListId = listId.value;
        return currentListId ? { type: "aheart-sortable", listId: currentListId, group: props.group, targetIndex: props.items.length } : void 0;
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
            key: String(item[__props.itemKey]),
            item,
            index
          }, {
            default: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, slotProps))
            ]),
            _: 3
          }, 8, ["item", "index"]);
        }), 128))
      ], 8, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
