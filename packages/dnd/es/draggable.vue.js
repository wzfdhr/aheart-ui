import { defineComponent, ref, openBlock, createBlock, resolveDynamicComponent, normalizeClass, unref, withCtx, renderSlot } from "vue";
import { useDraggable } from "./use-draggable.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADraggable" },
  __name: "draggable",
  props: {
    data: {},
    disabled: { type: Boolean },
    tag: { default: "div" }
  },
  emits: ["dragStart", "drop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = ref();
    const { isDragging } = useDraggable(root, {
      data: () => props.data,
      disabled: () => props.disabled,
      onDragStart: () => emit("dragStart"),
      onDrop: () => emit("drop")
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["aheart-dnd-draggable", { "aheart-dnd-dragging": unref(isDragging) }]),
        "aria-disabled": __props.disabled || void 0
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "aria-disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
