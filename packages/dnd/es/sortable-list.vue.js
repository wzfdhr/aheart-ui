import { defineComponent, computed, ref, onBeforeUnmount, onMounted, provide, openBlock, createElementBlock, Fragment, createElementVNode, renderList, createBlock, withCtx, renderSlot, mergeProps, toDisplayString } from "vue";
import _sfc_main$1 from "./sortable-item.vue.js";
import { sortableContextKey } from "./sortable-context.js";
import { registerSortableList, moveSortableItem, moveSortableItemToAdjacentList } from "./sortable-registry.js";
import { useDroppable } from "./use-droppable.js";
import { registerSortableAutoScroll } from "./sortable-auto-scroll.js";
const _hoisted_1 = {
  class: "aheart-dnd-live-region",
  "aria-live": "polite"
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
    const listId = `aheart-sortable-${Math.random().toString(36).slice(2)}`;
    const disabled = computed(() => props.disabled);
    const announcement = ref("");
    const root = ref();
    const updateItems = (items) => {
      const nextItems = items;
      emit("update:items", nextItems);
      emit("change", nextItems);
    };
    const unregister = registerSortableList(listId, {
      group: () => props.group,
      disabled: () => disabled.value,
      items: () => props.items,
      update: updateItems,
      announce: (message) => {
        announcement.value = message;
      }
    });
    onBeforeUnmount(unregister);
    let unregisterAutoScroll = () => {
    };
    onMounted(() => {
      unregisterAutoScroll = registerSortableAutoScroll(root.value);
    });
    onBeforeUnmount(() => unregisterAutoScroll());
    const move = (source, targetIndex, keyboard = false) => {
      if (disabled.value) return false;
      const result = moveSortableItem(source, listId, targetIndex);
      if (result && keyboard) announcement.value = `已移动到第 ${result.targetIndex + 1} 项`;
      return result;
    };
    const moveAdjacent = (source, direction) => moveSortableItemToAdjacentList(source, direction);
    provide(sortableContextKey, { listId, group: props.group, disabled, move, moveAdjacent });
    useDroppable(root, {
      data: () => ({ type: "aheart-sortable", listId, group: props.group, targetIndex: props.items.length }),
      accept: "aheart-sortable",
      disabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable") return;
        move(source, props.items.length);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("ul", {
          ref_key: "root",
          ref: root,
          class: "aheart-dnd-sortable-list",
          "data-aheart-sortable-list-id": listId,
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
        ], 512),
        createElementVNode("div", _hoisted_1, toDisplayString(announcement.value), 1)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
