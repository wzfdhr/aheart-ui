import { defineComponent, useSlots, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, normalizeStyle, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { popoverProps, popoverEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-floating__arrow aheart-popover__arrow",
  "aria-hidden": "true"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-popover__title"
};
const _hoisted_3 = {
  key: 2,
  class: "aheart-popover__content"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "APopover"
  },
  __name: "popover",
  props: popoverProps,
  emits: popoverEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const innerOpen = ref(props.defaultOpen);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const hasTitle = computed(() => Boolean(props.title || slots.title));
    const hasContent = computed(() => Boolean(props.content || slots.content));
    const visible = computed(() => (hasTitle.value || hasContent.value) && mergedOpen.value);
    const popupStyle = computed(() => getFloatingPopupStyle(props.color, props.zIndex));
    watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    const requestOpen = (open) => {
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpen(true);
      }
    };
    const handleMouseLeave = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpen(false);
      }
    };
    const handleFocusIn = () => {
      if (normalizedTriggers.value.has("focus")) {
        requestOpen(true);
      }
    };
    const handleFocusOut = () => {
      if (normalizedTriggers.value.has("focus")) {
        requestOpen(false);
      }
    };
    const handleClick = () => {
      if (normalizedTriggers.value.has("click")) {
        requestOpen(!mergedOpen.value);
      }
    };
    const handleContextmenu = (event) => {
      if (normalizedTriggers.value.has("contextMenu")) {
        event.preventDefault();
        requestOpen(true);
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-popover", { "is-open": visible.value }]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: "aheart-popover__trigger",
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 32),
        visible.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-popover__popup", `aheart-floating--${_ctx.placement}`]),
          style: normalizeStyle(popupStyle.value),
          role: "dialog"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_1)) : createCommentVNode("", true),
          hasTitle.value ? (openBlock(), createElementBlock("span", _hoisted_2, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ])) : createCommentVNode("", true),
          hasContent.value ? (openBlock(), createElementBlock("span", _hoisted_3, [
            renderSlot(_ctx.$slots, "content", {}, () => [
              createTextVNode(toDisplayString(_ctx.content), 1)
            ])
          ])) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true)
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};
