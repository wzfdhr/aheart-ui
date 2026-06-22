import { defineComponent, useSlots, ref, computed, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, normalizeStyle, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { tooltipProps, tooltipEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-floating__arrow aheart-tooltip__arrow",
  "aria-hidden": "true"
};
const _hoisted_2 = { class: "aheart-tooltip__content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATooltip"
  },
  __name: "tooltip",
  props: tooltipProps,
  emits: tooltipEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const innerOpen = ref(props.defaultOpen);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const hasTitle = computed(() => Boolean(props.title || slots.title));
    const visible = computed(() => hasTitle.value && mergedOpen.value);
    const popupStyle = computed(() => getFloatingPopupStyle(props.color, props.zIndex));
    let enterTimer;
    let leaveTimer;
    watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    const clearTimers = () => {
      if (enterTimer) {
        clearTimeout(enterTimer);
        enterTimer = void 0;
      }
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = void 0;
      }
    };
    const requestOpen = (open) => {
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const requestOpenWithDelay = (open, delay) => {
      clearTimers();
      if (delay > 0) {
        const timer = setTimeout(() => requestOpen(open), delay * 1e3);
        if (open) {
          enterTimer = timer;
        } else {
          leaveTimer = timer;
        }
        return;
      }
      requestOpen(open);
    };
    const handleMouseEnter = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpenWithDelay(true, props.mouseEnterDelay);
      }
    };
    const handleMouseLeave = () => {
      if (normalizedTriggers.value.has("hover")) {
        requestOpenWithDelay(false, props.mouseLeaveDelay);
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
    onBeforeUnmount(clearTimers);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-tooltip", { "is-open": visible.value }]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: "aheart-tooltip__trigger",
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
          class: normalizeClass(["aheart-tooltip__popup", `aheart-floating--${_ctx.placement}`]),
          style: normalizeStyle(popupStyle.value),
          role: "tooltip"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_1)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_2, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ])
        ], 6)) : createCommentVNode("", true)
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};
