"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const sortableContext = require("./sortable-context.js");
const useDraggable = require("./use-draggable.js");
const useDroppable = require("./use-droppable.js");
const _hoisted_1 = ["data-sortable-index"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ASortableItem" },
  __name: "sortable-item",
  props: {
    item: {},
    index: {}
  },
  setup(__props) {
    const props = __props;
    const context = vue.inject(sortableContext.sortableContextKey);
    if (!context) throw new Error("ASortableItem must be used inside ASortableList.");
    const root = vue.ref();
    const data = vue.computed(() => ({
      type: "aheart-sortable",
      listId: context.listId,
      group: context.group,
      index: props.index
    }));
    const { isDragging } = useDraggable.useDraggable(root, { data, disabled: context.disabled });
    useDroppable.useDroppable(root, {
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
      return vue.openBlock(), vue.createElementBlock("li", {
        ref_key: "root",
        ref: root,
        class: vue.normalizeClass(["aheart-dnd-sortable-item", { "aheart-dnd-dragging": vue.unref(isDragging) }]),
        "data-sortable-index": __props.index,
        tabindex: "0",
        onKeydown: handleKeydown
      }, [
        vue.renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          index: __props.index
        })
      ], 42, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
