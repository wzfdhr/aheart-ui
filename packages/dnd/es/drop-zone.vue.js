import { defineComponent, ref, openBlock, createBlock, resolveDynamicComponent, withCtx, renderSlot } from "vue";
import { useDroppable } from "./use-droppable.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADropZone" },
  __name: "drop-zone",
  props: {
    data: {},
    accept: {},
    disabled: { type: Boolean },
    tag: { default: "div" }
  },
  emits: ["drop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = ref();
    useDroppable(root, {
      data: () => props.data,
      accept: () => props.accept,
      disabled: () => props.disabled,
      onDrop: (data) => emit("drop", data)
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: "aheart-dnd-drop-zone",
        "aria-disabled": __props.disabled || void 0
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["aria-disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
