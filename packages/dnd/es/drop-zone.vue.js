import { defineComponent, ref, watch, watchEffect, openBlock, createBlock, resolveDynamicComponent, withCtx, renderSlot } from "vue";
import { useDroppable } from "./use-droppable.js";
import { cancelKeyboardScope, registerKeyboardZone } from "./keyboard-service.js";
import { endDrag } from "./drag-state.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADropZone" },
  __name: "drop-zone",
  props: {
    data: {},
    accept: {},
    disabled: { type: Boolean },
    keyboard: { type: Boolean, default: true },
    label: {},
    scopeKey: {},
    tag: { default: "div" }
  },
  emits: ["drop", "keyboardDrop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const root = ref();
    watch(() => props.scopeKey, (scope) => {
      if (root.value) cancelKeyboardScope(root.value.ownerDocument, scope);
    });
    useDroppable(root, {
      data: () => props.data,
      accept: () => props.accept,
      disabled: () => props.disabled,
      onDrop: (data) => emit("drop", data)
    });
    watchEffect((onCleanup) => {
      const element = root.value;
      if (!element || !props.keyboard) return;
      const cleanup = registerKeyboardZone({
        element,
        getData: () => ({ ...props.data }),
        getLabel: () => props.label ?? "放置区域",
        getScope: () => props.scopeKey,
        isDisabled: () => Boolean(props.disabled),
        accepts: (data) => {
          const accepted = Array.isArray(props.accept) ? props.accept : props.accept ? [props.accept] : [];
          return accepted.length === 0 || accepted.includes(String(data.type ?? ""));
        },
        onGrab: () => void 0,
        onDrop: (data, event) => {
          endDrag(element.ownerDocument);
          emit("drop", data);
          emit("keyboardDrop", event);
        }
      });
      onCleanup(cleanup);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(__props.tag), {
        ref_key: "root",
        ref: root,
        class: "aheart-dnd-drop-zone",
        "aria-disabled": __props.disabled || void 0,
        "aria-label": __props.label,
        role: "region",
        "aria-keyshortcuts": __props.keyboard ? "Space Enter" : void 0,
        tabindex: __props.keyboard ? __props.disabled ? -1 : 0 : -1
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["aria-disabled", "aria-label", "aria-keyshortcuts", "tabindex"]);
    };
  }
});
export {
  _sfc_main as default
};
