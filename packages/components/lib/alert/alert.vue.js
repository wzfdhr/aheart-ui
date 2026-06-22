"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["role"];
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
    const iconMap = {
      success: "✓",
      info: "i",
      warning: "!",
      error: "×"
    };
    const effectiveType = vue.computed(() => props.type ?? (props.banner ? "warning" : "info"));
    const effectiveTitle = vue.computed(() => props.title ?? props.message);
    const effectiveShowIcon = vue.computed(() => props.showIcon ?? props.banner);
    const iconText = vue.computed(() => props.icon ?? iconMap[effectiveType.value]);
    const hasAction = vue.computed(() => Boolean(props.action || slots.action));
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const iconStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.icon;
    });
    const contentStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.content;
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
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.action;
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
          "aheart-alert--with-description": Boolean(props.description || slots.default),
          "aheart-alert--closable": props.closable
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
      var _a;
      return ["aheart-alert__content", (_a = props.classNames) == null ? void 0 : _a.content];
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
      var _a;
      return ["aheart-alert__action", (_a = props.classNames) == null ? void 0 : _a.action];
    });
    const closeClass = vue.computed(() => {
      var _a;
      return ["aheart-alert__close", (_a = props.classNames) == null ? void 0 : _a.close];
    });
    const handleClose = (event) => {
      emit("close", event);
      closed.value = true;
      emit("afterClose");
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
            vue.createTextVNode(vue.toDisplayString(iconText.value), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(contentClass.value),
          style: vue.normalizeStyle(contentStyle.value)
        }, [
          effectiveTitle.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(titleClass.value),
            style: vue.normalizeStyle(titleStyle.value)
          }, vue.toDisplayString(effectiveTitle.value), 7)) : vue.createCommentVNode("", true),
          _ctx.description || _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(descriptionClass.value),
            style: vue.normalizeStyle(descriptionStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6),
        hasAction.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(actionClass.value),
          style: vue.normalizeStyle(actionStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "action", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.action), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        _ctx.closable ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: vue.normalizeClass(closeClass.value),
          style: vue.normalizeStyle(closeStyle.value),
          type: "button",
          "aria-label": "Close",
          onClick: handleClose
        }, [
          vue.renderSlot(_ctx.$slots, "closeIcon", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.closeIcon || "×"), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true)
      ], 14, _hoisted_1)) : vue.createCommentVNode("", true);
    };
  }
});
exports.default = _sfc_main;
