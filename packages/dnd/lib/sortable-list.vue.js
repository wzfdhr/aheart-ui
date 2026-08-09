"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const sortableItem_vue_vue_type_script_setup_true_lang = require("./sortable-item.vue.js");
const sortableContext = require("./sortable-context.js");
const sortableRegistry = require("./sortable-registry.js");
const useDroppable = require("./use-droppable.js");
const sortableAutoScroll = require("./sortable-auto-scroll.js");
const _hoisted_1 = ["data-aheart-sortable-list-id", "data-aheart-sortable-group", "data-aheart-sortable-disabled"];
const _hoisted_2 = {
  class: "aheart-dnd-live-region",
  "aria-live": "polite"
};
let sortableListIdCounter = 0;
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
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
    const listId = vue.ref();
    const disabled = vue.computed(() => props.disabled);
    const announcement = vue.ref("");
    const root = vue.ref();
    const updateItems = (items) => {
      const nextItems = items;
      emit("update:items", nextItems);
      emit("change", nextItems);
    };
    let unregister = () => {
    };
    vue.onMounted(() => {
      var _a, _b, _c;
      const ownerWindow = (_a = root.value) == null ? void 0 : _a.ownerDocument.defaultView;
      const randomUUID = (_b = ownerWindow == null ? void 0 : ownerWindow.crypto) == null ? void 0 : _b.randomUUID;
      const generatedId = randomUUID ? randomUUID.call(ownerWindow.crypto) : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${sortableListIdCounter++}`;
      listId.value = `aheart-sortable-${generatedId}`;
      unregister = sortableRegistry.registerSortableList(listId.value, {
        group: () => props.group,
        items: () => props.items,
        update: updateItems
      });
      (_c = root.value) == null ? void 0 : _c.addEventListener("aheart-sortable-announce", handleAnnouncement);
    });
    vue.onBeforeUnmount(() => {
      var _a;
      (_a = root.value) == null ? void 0 : _a.removeEventListener("aheart-sortable-announce", handleAnnouncement);
      unregister();
    });
    let unregisterAutoScroll = () => {
    };
    vue.onMounted(() => {
      unregisterAutoScroll = sortableAutoScroll.registerSortableAutoScroll(root.value);
    });
    vue.onBeforeUnmount(() => unregisterAutoScroll());
    const handleAnnouncement = (event) => {
      announcement.value = event.detail;
    };
    const move = (source, targetIndex) => {
      if (disabled.value) return false;
      const currentListId = listId.value;
      if (!currentListId) return false;
      sortableRegistry.moveSortableItem(source, currentListId, targetIndex);
    };
    vue.provide(sortableContext.sortableContextKey, {
      get listId() {
        return listId.value ?? "";
      },
      group: props.group,
      disabled,
      move
    });
    useDroppable.useDroppable(root, {
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
      return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
        vue.createElementVNode("ul", {
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
              key: String(item[__props.itemKey]),
              item,
              index
            }, {
              default: vue.withCtx((slotProps) => [
                vue.renderSlot(_ctx.$slots, "item", vue.mergeProps({ ref_for: true }, slotProps))
              ]),
              _: 3
            }, 8, ["item", "index"]);
          }), 128))
        ], 8, _hoisted_1),
        vue.createElementVNode("div", _hoisted_2, vue.toDisplayString(announcement.value), 1)
      ], 64);
    };
  }
});
exports.default = _sfc_main;
