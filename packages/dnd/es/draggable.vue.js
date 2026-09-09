import { defineComponent, ref, watch, watchEffect, openBlock, createBlock, resolveDynamicComponent, normalizeClass, unref, withCtx, renderSlot } from "vue";
import { useDraggable } from "./use-draggable.js";
import { cancelKeyboardScope, registerKeyboardSource } from "./keyboard-service.js";
import { announceDnd } from "./dnd-announcer.js";
import { endDrag, startDrag } from "./drag-state.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADraggable" },
  __name: "draggable",
  props: {
    data: {},
    disabled: { type: Boolean },
    keyboard: { type: Boolean, default: true },
    label: {},
    scopeKey: {},
    tag: { default: "div" }
  },
  emits: ["dragStart", "drop", "keyboardGrab", "keyboardCancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = ref();
    watch(() => props.scopeKey, (scope) => {
      if (root.value) cancelKeyboardScope(root.value.ownerDocument, scope);
    });
    const { isDragging } = useDraggable(root, {
      data: () => props.data,
      disabled: () => props.disabled,
      onDragStart: () => emit("dragStart"),
      onDrop: () => emit("drop")
    });
    watchEffect((onCleanup) => {
      const element = root.value;
      if (!element || !props.keyboard) return;
      const label = () => props.label ?? "可拖动项目";
      const cleanup = registerKeyboardSource({
        element,
        getData: () => ({ ...props.data }),
        getLabel: label,
        getScope: () => props.scopeKey,
        isDisabled: () => Boolean(props.disabled),
        onGrab: (event) => {
          startDrag(event.data, element.ownerDocument);
          emit("dragStart");
          emit("keyboardGrab", event);
        },
        onCancel: (event) => {
          endDrag(element.ownerDocument);
          emit("keyboardCancel", event);
          announceDnd(element.ownerDocument, `拖动已取消：${event.reason}`);
        }
      });
      onCleanup(cleanup);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: normalizeClass(["aheart-dnd-draggable", { "aheart-dnd-dragging": unref(isDragging) }]),
        "aria-disabled": __props.disabled || void 0,
        "aria-label": __props.label,
        role: "button",
        "aria-keyshortcuts": __props.keyboard ? "Space Enter Escape" : void 0,
        tabindex: __props.keyboard && !__props.disabled ? 0 : -1
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "aria-disabled", "aria-label", "aria-keyshortcuts", "tabindex"]);
    };
  }
});
export {
  _sfc_main as default
};
