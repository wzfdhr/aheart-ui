"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const sortableItem_vue_vue_type_script_setup_true_lang = require("./sortable-item.vue.js");
const sortableContext = require("./sortable-context.js");
const sortableRegistry = require("./sortable-registry.js");
const useDroppable = require("./use-droppable.js");
const sortableAutoScroll = require("./sortable-auto-scroll.js");
const _hoisted_1 = {
  class: "aheart-dnd-live-region",
  "aria-live": "polite"
};
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
    const listId = `aheart-sortable-${Math.random().toString(36).slice(2)}`;
    const disabled = vue.computed(() => props.disabled);
    const announcement = vue.ref("");
    const root = vue.ref();
    const updateItems = (items) => {
      const nextItems = items;
      emit("update:items", nextItems);
      emit("change", nextItems);
    };
    const unregister = sortableRegistry.registerSortableList(listId, {
      group: () => props.group,
      disabled: () => disabled.value,
      items: () => props.items,
      update: updateItems,
      announce: (message) => {
        announcement.value = message;
      }
    });
    vue.onBeforeUnmount(unregister);
    let unregisterAutoScroll = () => {
    };
    vue.onMounted(() => {
      unregisterAutoScroll = sortableAutoScroll.registerSortableAutoScroll(root.value);
    });
    vue.onBeforeUnmount(() => unregisterAutoScroll());
    const move = (source, targetIndex, keyboard = false) => {
      if (disabled.value) return false;
      const result = sortableRegistry.moveSortableItem(source, listId, targetIndex);
      if (result && keyboard) announcement.value = `已移动到第 ${result.targetIndex + 1} 项`;
      return result;
    };
    const moveAdjacent = (source, direction) => sortableRegistry.moveSortableItemToAdjacentList(source, direction);
    vue.provide(sortableContext.sortableContextKey, { listId, group: props.group, disabled, move, moveAdjacent });
    useDroppable.useDroppable(root, {
      data: () => ({ type: "aheart-sortable", listId, group: props.group, targetIndex: props.items.length }),
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
          "data-aheart-sortable-list-id": listId,
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
        ], 512),
        vue.createElementVNode("div", _hoisted_1, vue.toDisplayString(announcement.value), 1)
      ], 64);
    };
  }
});
exports.default = _sfc_main;
