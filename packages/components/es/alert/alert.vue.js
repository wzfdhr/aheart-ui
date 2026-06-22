import { defineComponent, useSlots, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode } from "vue";
import { alertProps, alertEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["role"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AAlert"
  },
  __name: "alert",
  props: alertProps,
  emits: alertEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const closed = ref(false);
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×"
    };
    const effectiveType = computed(() => props.type ?? (props.banner ? "warning" : "info"));
    const effectiveTitle = computed(() => props.title ?? props.message);
    const effectiveShowIcon = computed(() => props.showIcon ?? props.banner);
    const iconText = computed(() => props.icon ?? iconMap[effectiveType.value]);
    const hasAction = computed(() => Boolean(props.action || slots.action));
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const contentStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
    });
    const titleStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const descriptionStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const actionStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.action;
    });
    const closeStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.close;
    });
    const alertClass = computed(() => {
      var _a;
      return [
        `aheart-alert--${effectiveType.value}`,
        `aheart-alert--variant-${props.variant}`,
        {
          "aheart-alert--banner": props.banner,
          "aheart-alert--with-description": Boolean(props.description || slots.default),
          "aheart-alert--closable": props.closable
        },
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root
      ];
    });
    const iconClass = computed(() => {
      var _a;
      return ["aheart-alert__icon", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const contentClass = computed(() => {
      var _a;
      return ["aheart-alert__content", (_a = props.classNames) == null ? void 0 : _a.content];
    });
    const titleClass = computed(() => {
      var _a;
      return ["aheart-alert__message", (_a = props.classNames) == null ? void 0 : _a.title];
    });
    const descriptionClass = computed(() => {
      var _a;
      return ["aheart-alert__description", (_a = props.classNames) == null ? void 0 : _a.description];
    });
    const actionClass = computed(() => {
      var _a;
      return ["aheart-alert__action", (_a = props.classNames) == null ? void 0 : _a.action];
    });
    const closeClass = computed(() => {
      var _a;
      return ["aheart-alert__close", (_a = props.classNames) == null ? void 0 : _a.close];
    });
    const handleClose = (event) => {
      emit("close", event);
      closed.value = true;
      emit("afterClose");
    };
    return (_ctx, _cache) => {
      return !closed.value ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["aheart-alert", alertClass.value]),
        style: normalizeStyle(rootStyle.value),
        role: _ctx.role
      }, [
        effectiveShowIcon.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(iconClass.value),
          style: normalizeStyle(iconStyle.value),
          "aria-hidden": "true"
        }, [
          renderSlot(_ctx.$slots, "icon", {}, () => [
            createTextVNode(toDisplayString(iconText.value), 1)
          ])
        ], 6)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(contentClass.value),
          style: normalizeStyle(contentStyle.value)
        }, [
          effectiveTitle.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(titleClass.value),
            style: normalizeStyle(titleStyle.value)
          }, toDisplayString(effectiveTitle.value), 7)) : createCommentVNode("", true),
          _ctx.description || _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(descriptionClass.value),
            style: normalizeStyle(descriptionStyle.value)
          }, [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createTextVNode(toDisplayString(_ctx.description), 1)
            ])
          ], 6)) : createCommentVNode("", true)
        ], 6),
        hasAction.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(actionClass.value),
          style: normalizeStyle(actionStyle.value)
        }, [
          renderSlot(_ctx.$slots, "action", {}, () => [
            createTextVNode(toDisplayString(_ctx.action), 1)
          ])
        ], 6)) : createCommentVNode("", true),
        _ctx.closable ? (openBlock(), createElementBlock("button", {
          key: 2,
          class: normalizeClass(closeClass.value),
          style: normalizeStyle(closeStyle.value),
          type: "button",
          "aria-label": "Close",
          onClick: handleClose
        }, [
          renderSlot(_ctx.$slots, "closeIcon", {}, () => [
            createTextVNode(toDisplayString(_ctx.closeIcon || "×"), 1)
          ])
        ], 6)) : createCommentVNode("", true)
      ], 14, _hoisted_1)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
