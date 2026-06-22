import { defineComponent, useSlots, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createVNode, unref, createCommentVNode, createElementVNode } from "vue";
import { alertProps, alertEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["role"];
const _hoisted_2 = ["aria-label", "aria-labelledby", "aria-describedby"];
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
    const ARenderNode = defineComponent({
      name: "AAlertRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×"
    };
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const isClosableConfig = (value) => {
      return typeof value === "object" && value !== null;
    };
    const effectiveType = computed(() => props.type ?? (props.banner ? "warning" : "info"));
    const effectiveTitle = computed(() => props.title ?? props.message);
    const hasTitle = computed(() => hasRenderable(effectiveTitle.value));
    const effectiveShowIcon = computed(() => props.showIcon ?? props.banner);
    const iconText = computed(() => props.icon ?? iconMap[effectiveType.value]);
    const hasDescription = computed(() => Boolean(slots.default) || hasRenderable(props.description));
    const hasAction = computed(() => Boolean(slots.action) || hasRenderable(props.action));
    const isClosable = computed(() => props.closable !== false);
    const closableConfig = computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const resolvedCloseIcon = computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.closeIcon) ?? props.closeIcon ?? "×";
    });
    const closeAriaLabel = computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.ariaLabel) ?? "Close";
    });
    const closeAriaLabelledby = computed(() => {
      var _a;
      return (_a = closableConfig.value) == null ? void 0 : _a.ariaLabelledby;
    });
    const closeAriaDescribedby = computed(() => {
      var _a;
      return (_a = closableConfig.value) == null ? void 0 : _a.ariaDescribedby;
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const contentStyle = computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.content, (_b = props.styles) == null ? void 0 : _b.section];
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
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.action, (_b = props.styles) == null ? void 0 : _b.actions];
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
          "aheart-alert--with-description": hasDescription.value,
          "aheart-alert--closable": isClosable.value
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
      var _a, _b;
      return ["aheart-alert__content", (_a = props.classNames) == null ? void 0 : _a.content, (_b = props.classNames) == null ? void 0 : _b.section];
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
      var _a, _b;
      return ["aheart-alert__action", (_a = props.classNames) == null ? void 0 : _a.action, (_b = props.classNames) == null ? void 0 : _b.actions];
    });
    const closeClass = computed(() => {
      var _a;
      return ["aheart-alert__close", (_a = props.classNames) == null ? void 0 : _a.close];
    });
    const handleClose = (event) => {
      var _a, _b, _c, _d;
      emit("close", event);
      (_b = (_a = closableConfig.value) == null ? void 0 : _a.onClose) == null ? void 0 : _b.call(_a, event);
      closed.value = true;
      emit("afterClose");
      (_d = (_c = closableConfig.value) == null ? void 0 : _c.afterClose) == null ? void 0 : _d.call(_c);
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
            createVNode(unref(ARenderNode), { node: iconText.value }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(contentClass.value),
          style: normalizeStyle(contentStyle.value)
        }, [
          hasTitle.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(titleClass.value),
            style: normalizeStyle(titleStyle.value)
          }, [
            createVNode(unref(ARenderNode), { node: effectiveTitle.value }, null, 8, ["node"])
          ], 6)) : createCommentVNode("", true),
          hasDescription.value ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(descriptionClass.value),
            style: normalizeStyle(descriptionStyle.value)
          }, [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true)
        ], 6),
        hasAction.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(actionClass.value),
          style: normalizeStyle(actionStyle.value)
        }, [
          renderSlot(_ctx.$slots, "action", {}, () => [
            createVNode(unref(ARenderNode), { node: _ctx.action }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        isClosable.value ? (openBlock(), createElementBlock("button", {
          key: 2,
          class: normalizeClass(closeClass.value),
          style: normalizeStyle(closeStyle.value),
          type: "button",
          "aria-label": closeAriaLabel.value,
          "aria-labelledby": closeAriaLabelledby.value,
          "aria-describedby": closeAriaDescribedby.value,
          onClick: handleClose
        }, [
          renderSlot(_ctx.$slots, "closeIcon", {}, () => [
            createVNode(unref(ARenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
          ])
        ], 14, _hoisted_2)) : createCommentVNode("", true)
      ], 14, _hoisted_1)) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
