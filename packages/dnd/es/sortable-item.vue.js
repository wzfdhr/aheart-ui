import { defineComponent, inject, ref, computed, openBlock, createElementBlock, normalizeClass, unref, renderSlot } from "vue";
import { sortableContextKey } from "./sortable-context.js";
import { useDraggable } from "./use-draggable.js";
import { useDroppable } from "./use-droppable.js";
const _hoisted_1 = ["data-sortable-index"];
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
    const root = ref();
    const data = computed(() => ({
      type: "aheart-sortable",
      listId: context.listId,
      group: context.group,
      index: props.index
    }));
    const { isDragging } = useDraggable(root, { data, disabled: context.disabled });
    useDroppable(root, {
      data,
      accept: "aheart-sortable",
      disabled: context.disabled,
      onDrop: (source) => {
        if (source.type !== "aheart-sortable" || source.group !== context.group) return;
        context.move(source, props.index);
      }
    });
    const handleKeydown = (event) => {
      if (!event.altKey || event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      context.move(data.value, props.index + (event.key === "ArrowUp" ? -1 : 1), true);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("li", {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["aheart-dnd-sortable-item", { "aheart-dnd-dragging": unref(isDragging) }]),
        "data-sortable-index": __props.index,
        tabindex: "0",
        onKeydown: handleKeydown
      }, [
        renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          index: __props.index
        })
      ], 42, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
