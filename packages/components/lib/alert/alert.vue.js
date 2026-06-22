"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["role"];
const _hoisted_2 = ["aria-label", "aria-labelledby", "aria-describedby"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AAlert"
  },
  __name: "alert",
  props: types.alertProps,
  emits: types.alertEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const closed = vue.ref(false);
    const ARenderNode = vue.defineComponent({
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
    const effectiveType = vue.computed(() => props.type ?? (props.banner ? "warning" : "info"));
    const effectiveTitle = vue.computed(() => props.title ?? props.message);
    const hasTitle = vue.computed(() => hasRenderable(effectiveTitle.value));
    const effectiveShowIcon = vue.computed(() => props.showIcon ?? props.banner);
    const iconText = vue.computed(() => props.icon ?? iconMap[effectiveType.value]);
    const hasDescription = vue.computed(() => Boolean(slots.default) || hasRenderable(props.description));
    const hasAction = vue.computed(() => Boolean(slots.action) || hasRenderable(props.action));
    const isClosable = vue.computed(() => props.closable !== false);
    const closableConfig = vue.computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const resolvedCloseIcon = vue.computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.closeIcon) ?? props.closeIcon ?? "×";
    });
    const closeAriaLabel = vue.computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.ariaLabel) ?? "Close";
    });
    const closeAriaLabelledby = vue.computed(() => {
      var _a;
      return (_a = closableConfig.value) == null ? void 0 : _a.ariaLabelledby;
    });
    const closeAriaDescribedby = vue.computed(() => {
      var _a;
      return (_a = closableConfig.value) == null ? void 0 : _a.ariaDescribedby;
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const contentStyle = vue.computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.content, (_b = props.styles) == null ? void 0 : _b.section];
    });
    const titleStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const descriptionStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const actionStyle = vue.computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.action, (_b = props.styles) == null ? void 0 : _b.actions];
    });
    const closeStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.close;
    });
    const alertClass = vue.computed(() => {
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
    const iconClass = vue.computed(() => {
      var _a;
      return ["aheart-alert__icon", (_a = props.classNames) == null ? void 0 : _a.icon];
    });
    const contentClass = vue.computed(() => {
      var _a, _b;
      return ["aheart-alert__content", (_a = props.classNames) == null ? void 0 : _a.content, (_b = props.classNames) == null ? void 0 : _b.section];
    });
    const titleClass = vue.computed(() => {
      var _a;
      return ["aheart-alert__message", (_a = props.classNames) == null ? void 0 : _a.title];
    });
    const descriptionClass = vue.computed(() => {
      var _a;
      return ["aheart-alert__description", (_a = props.classNames) == null ? void 0 : _a.description];
    });
    const actionClass = vue.computed(() => {
      var _a, _b;
      return ["aheart-alert__action", (_a = props.classNames) == null ? void 0 : _a.action, (_b = props.classNames) == null ? void 0 : _b.actions];
    });
    const closeClass = vue.computed(() => {
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
      return !closed.value ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(["aheart-alert", alertClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        role: _ctx.role
      }, [
        effectiveShowIcon.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(iconClass.value),
          style: vue.normalizeStyle(iconStyle.value),
          "aria-hidden": "true"
        }, [
          vue.renderSlot(_ctx.$slots, "icon", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: iconText.value }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(contentClass.value),
          style: vue.normalizeStyle(contentStyle.value)
        }, [
          hasTitle.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(titleClass.value),
            style: vue.normalizeStyle(titleStyle.value)
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: effectiveTitle.value }, null, 8, ["node"])
          ], 6)) : vue.createCommentVNode("", true),
          hasDescription.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(descriptionClass.value),
            style: vue.normalizeStyle(descriptionStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6),
        hasAction.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(actionClass.value),
          style: vue.normalizeStyle(actionStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "action", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: _ctx.action }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        isClosable.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: vue.normalizeClass(closeClass.value),
          style: vue.normalizeStyle(closeStyle.value),
          type: "button",
          "aria-label": closeAriaLabel.value,
          "aria-labelledby": closeAriaLabelledby.value,
          "aria-describedby": closeAriaDescribedby.value,
          onClick: handleClose
        }, [
          vue.renderSlot(_ctx.$slots, "closeIcon", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
          ])
        ], 14, _hoisted_2)) : vue.createCommentVNode("", true)
      ], 14, _hoisted_1)) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
