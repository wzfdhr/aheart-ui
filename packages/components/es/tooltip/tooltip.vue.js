import { defineComponent, useSlots, ref, computed, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, withDirectives, createCommentVNode, createVNode, unref, vShow } from "vue";
import { normalizeFloatingTriggers, getFloatingPopupStyle } from "../utils/floating.js";
import "../utils/floating.css.js";
import { tooltipProps, tooltipEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATooltip"
  },
  __name: "tooltip",
  props: tooltipProps,
  emits: tooltipEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
      name: "ATooltipRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => typeof renderProps.node === "function" ? renderProps.node() : renderProps.node;
      }
    });
    const hasTitleContent = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const innerOpen = ref(props.defaultOpen);
    const hasRenderedPopup = ref(Boolean(props.defaultOpen || props.open));
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)));
    const hasTitle = computed(() => Boolean(slots.title) || hasTitleContent(props.title));
    const visible = computed(() => hasTitle.value && mergedOpen.value);
    const shouldRenderPopup = computed(() => hasTitle.value && (visible.value || !props.destroyOnHidden && hasRenderedPopup.value));
    const tooltipClass = computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-open": visible.value
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const triggerClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.trigger;
    });
    const triggerStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.trigger;
    });
    const popupClass = computed(() => {
      var _a;
      return [`aheart-floating--${props.placement}`, props.overlayClassName, (_a = props.classNames) == null ? void 0 : _a.popup];
    });
    const popupStyle = computed(() => {
      var _a;
      return [getFloatingPopupStyle(props.color, props.zIndex), props.overlayStyle, (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const containerClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.container;
    });
    const containerStyle = computed(() => {
      var _a;
      return [props.overlayInnerStyle, (_a = props.styles) == null ? void 0 : _a.container];
    });
    const contentClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.content;
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const showArrow = computed(() => props.arrow !== false);
    const arrowPointsAtCenter = computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = computed(() => {
      var _a;
      return [
        (_a = props.classNames) == null ? void 0 : _a.arrow,
        {
          "aheart-tooltip__arrow--point-at-center": arrowPointsAtCenter.value
        }
      ];
    });
    const arrowStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
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
    watch(
      visible,
      (open) => {
        if (open) {
          hasRenderedPopup.value = true;
        }
      },
      { immediate: true }
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
        class: normalizeClass(["aheart-tooltip", tooltipClass.value]),
        style: normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: normalizeClass(["aheart-tooltip__trigger", triggerClass.value]),
          style: normalizeStyle(triggerStyle.value),
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut,
          onClick: handleClick,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 38),
        shouldRenderPopup.value ? withDirectives((openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-tooltip__popup", popupClass.value]),
          style: normalizeStyle(popupStyle.value),
          role: "tooltip"
        }, [
          showArrow.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-floating__arrow aheart-tooltip__arrow", arrowClass.value]),
            style: normalizeStyle(arrowStyle.value),
            "aria-hidden": "true"
          }, null, 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-tooltip__container", containerClass.value]),
            style: normalizeStyle(containerStyle.value)
          }, [
            createElementVNode("span", {
              class: normalizeClass(["aheart-tooltip__content", contentClass.value]),
              style: normalizeStyle(contentStyle.value)
            }, [
              renderSlot(_ctx.$slots, "title", {}, () => [
                createVNode(unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
              ])
            ], 6)
          ], 6)
        ], 6)), [
          [vShow, visible.value]
        ]) : createCommentVNode("", true)
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};
