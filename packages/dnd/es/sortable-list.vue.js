import { defineComponent, computed, ref, onBeforeUnmount, provide, openBlock, createElementBlock, Fragment, createElementVNode, renderList, createBlock, withCtx, renderSlot, mergeProps, toDisplayString } from "vue";
import _sfc_main$1 from "./sortable-item.vue.js";
import { sortableContextKey } from "./sortable-context.js";
import { registerSortableList, moveSortableItem } from "./sortable-registry.js";
import { useDroppable } from "./use-droppable.js";
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
    const unregister = registerSortableList(listId, { group: () => props.group, items: () => props.items, update: updateItems });
    onBeforeUnmount(unregister);
    const move = (source, targetIndex, keyboard = false) => {
      if (!disabled.value && moveSortableItem(source, listId, targetIndex) && keyboard) {
        announcement.value = `已移动到第 ${targetIndex + 1} 项`;
      }
    };
    provide(sortableContextKey, { listId, group: props.group, disabled, move });
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
