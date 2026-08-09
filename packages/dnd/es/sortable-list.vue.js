import { defineComponent, useId, computed, ref, onMounted, onBeforeUnmount, provide, openBlock, createElementBlock, Fragment, createElementVNode, renderList, createBlock, withCtx, renderSlot, mergeProps, toDisplayString } from "vue";
import _sfc_main$1 from "./sortable-item.vue.js";
import { sortableContextKey } from "./sortable-context.js";
import { registerSortableList, moveSortableItem } from "./sortable-registry.js";
import { useDroppable } from "./use-droppable.js";
import { registerSortableAutoScroll } from "./sortable-auto-scroll.js";
const _hoisted_1 = ["data-aheart-sortable-group", "data-aheart-sortable-disabled"];
const _hoisted_2 = {
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
    const listId = `aheart-sortable-${useId()}`;
    const disabled = computed(() => props.disabled);
    const announcement = ref("");
    const root = ref();
    const updateItems = (items) => {
      const nextItems = items;
      emit("update:items", nextItems);
      emit("change", nextItems);
    };
    let unregister = () => {
    };
    onMounted(() => {
      var _a;
      unregister = registerSortableList(listId, {
        group: () => props.group,
        items: () => props.items,
        update: updateItems
      });
      (_a = root.value) == null ? void 0 : _a.addEventListener("aheart-sortable-announce", handleAnnouncement);
    });
    onBeforeUnmount(() => {
      var _a;
      (_a = root.value) == null ? void 0 : _a.removeEventListener("aheart-sortable-announce", handleAnnouncement);
      unregister();
    });
    let unregisterAutoScroll = () => {
    };
    onMounted(() => {
      unregisterAutoScroll = registerSortableAutoScroll(root.value);
    });
    onBeforeUnmount(() => unregisterAutoScroll());
    const handleAnnouncement = (event) => {
      announcement.value = event.detail;
    };
    const move = (source, targetIndex) => {
      if (disabled.value) return false;
      moveSortableItem(source, listId, targetIndex);
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
          "data-aheart-sortable-list-id": listId,
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
        ], 8, _hoisted_1),
        createElementVNode("div", _hoisted_2, toDisplayString(announcement.value), 1)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
