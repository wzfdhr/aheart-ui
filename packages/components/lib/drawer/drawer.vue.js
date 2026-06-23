"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../skeleton/index.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["disabled"];
const _hoisted_2 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADrawer"
  },
  __name: "drawer",
  props: types.drawerProps,
  emits: types.drawerEmits,
  setup(__props, { emit: __emit }) {
    const ADrawerRenderNode = vue.defineComponent({
      name: "ADrawerRenderNode",
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
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const hasRendered = vue.ref(props.open || props.forceRender);
    const normalizeSize = (size) => typeof size === "number" ? `${size}px` : size;
    const getDefaultContainer = () => typeof document === "undefined" ? false : document.body;
    const resolvedContainer = vue.computed(() => props.getContainer ?? getDefaultContainer());
    const teleportTarget = vue.computed(() => {
      const container = resolvedContainer.value;
      return typeof container === "function" ? container() : container;
    });
    const shouldTeleport = vue.computed(() => teleportTarget.value !== false);
    const teleportTo = vue.computed(() => teleportTarget.value === false ? "body" : teleportTarget.value);
    const isVertical = vue.computed(() => props.placement === "top" || props.placement === "bottom");
    const shouldDestroy = vue.computed(() => props.destroyOnHidden || props.destroyOnClose);
    const shouldRender = vue.computed(() => props.open || props.forceRender || hasRendered.value);
    const isClosableConfig = (value) => typeof value === "object" && value !== null;
    const closableConfig = vue.computed(() => isClosableConfig(props.closable) ? props.closable : void 0);
    const resolvedCloseIcon = vue.computed(() => {
      var _a;
      if (((_a = closableConfig.value) == null ? void 0 : _a.closeIcon) !== void 0) {
        return closableConfig.value.closeIcon;
      }
      if (props.closeIcon !== void 0) {
        return props.closeIcon;
      }
      return "×";
    });
    const showCloseButton = vue.computed(
      () => props.closable !== false && resolvedCloseIcon.value !== false && resolvedCloseIcon.value !== null
    );
    const isCloseButtonDisabled = vue.computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.disabled) === true;
    });
    const closePlacement = vue.computed(() => {
      var _a;
      return ((_a = closableConfig.value) == null ? void 0 : _a.placement) ?? "start";
    });
    const isCloseAtEnd = vue.computed(() => closePlacement.value === "end");
    const hasExtra = vue.computed(() => Boolean(slots.extra) || props.extra !== void 0);
    const hasHeader = vue.computed(() => Boolean(props.title || slots.title || hasExtra.value || showCloseButton.value));
    const resolvedSize = vue.computed(() => {
      if (props.size === "large") {
        return 736;
      }
      if (props.size === "default") {
        return 378;
      }
      return props.size;
    });
    const panelStyle = vue.computed(
      () => isVertical.value ? {
        ...props.style,
        ...semanticStyle("section"),
        height: normalizeSize(props.height ?? resolvedSize.value)
      } : {
        ...props.style,
        ...semanticStyle("section"),
        width: normalizeSize(props.width ?? resolvedSize.value)
      }
    );
    const rootStyle = vue.computed(() => ({
      ...props.rootStyle,
      ...semanticStyle("root"),
      zIndex: props.zIndex
    }));
    const maskStyle = vue.computed(() => semanticStyle("mask"));
    const hasFooter = vue.computed(() => props.footer || Boolean(slots.footer));
    const rootClass = vue.computed(() => ["aheart-drawer", props.rootClassName, semanticClass("root")]);
    const maskClass = vue.computed(() => ["aheart-drawer__mask", semanticClass("mask")]);
    const panelClass = vue.computed(() => [
      "aheart-drawer__panel",
      `aheart-drawer__panel--${props.placement}`,
      props.className,
      semanticClass("section")
    ]);
    const headerClass = vue.computed(() => ["aheart-drawer__header", semanticClass("header")]);
    const titleClass = vue.computed(() => ["aheart-drawer__title", semanticClass("title")]);
    const extraClass = vue.computed(() => ["aheart-drawer__extra", semanticClass("extra")]);
    const bodyClass = vue.computed(() => ["aheart-drawer__body", { "is-loading": props.loading }, semanticClass("body")]);
    const footerClass = vue.computed(() => ["aheart-drawer__footer", semanticClass("footer")]);
    const closeClass = vue.computed(() => [
      "aheart-drawer__close",
      { "is-end": isCloseAtEnd.value },
      semanticClass("close")
    ]);
    vue.watch(
      () => props.open,
      (open) => {
        if (open) {
          hasRendered.value = true;
        } else if (shouldDestroy.value && !props.forceRender) {
          hasRendered.value = false;
        }
        emit("afterOpenChange", open);
      }
    );
    vue.watch(
      () => props.forceRender,
      (forceRender) => {
        if (forceRender) {
          hasRendered.value = true;
        }
      }
    );
    const semanticClass = (part) => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a[part];
    };
    const semanticStyle = (part) => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a[part];
    };
    const close = () => {
      emit("update:open", false);
      emit("close");
    };
    const handleCloseButtonClick = () => {
      if (isCloseButtonDisabled.value) {
        return;
      }
      close();
    };
    const handleMaskClick = () => {
      if (props.maskClosable) {
        close();
      }
    };
    const handleKeydown = (event) => {
      if (props.keyboard && event.key === "Escape") {
        close();
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.Teleport, {
        to: teleportTo.value,
        disabled: !shouldTeleport.value
      }, [
        shouldRender.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(rootClass.value),
          style: vue.normalizeStyle(rootStyle.value),
          role: "presentation",
          tabindex: "-1",
          onKeydown: handleKeydown
        }, [
          _ctx.mask ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(maskClass.value),
            style: vue.normalizeStyle(maskStyle.value),
            onClick: handleMaskClick
          }, null, 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("section", {
            class: vue.normalizeClass(panelClass.value),
            style: vue.normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-modal": "true"
          }, [
            hasHeader.value ? (vue.openBlock(), vue.createElementBlock("header", {
              key: 0,
              class: vue.normalizeClass(headerClass.value),
              style: vue.normalizeStyle(semanticStyle("header"))
            }, [
              showCloseButton.value && !isCloseAtEnd.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: vue.normalizeClass(closeClass.value),
                style: vue.normalizeStyle(semanticStyle("close")),
                disabled: isCloseButtonDisabled.value,
                type: "button",
                "aria-label": "Close",
                onClick: handleCloseButtonClick
              }, [
                vue.createVNode(vue.unref(ADrawerRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
              ], 14, _hoisted_1)) : vue.createCommentVNode("", true),
              _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                class: vue.normalizeClass(titleClass.value),
                style: vue.normalizeStyle(semanticStyle("title"))
              }, [
                vue.renderSlot(_ctx.$slots, "title", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                ])
              ], 6)) : vue.createCommentVNode("", true),
              hasExtra.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 2,
                class: vue.normalizeClass(extraClass.value),
                style: vue.normalizeStyle(semanticStyle("extra"))
              }, [
                vue.renderSlot(_ctx.$slots, "extra", {}, () => [
                  vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
                ])
              ], 6)) : vue.createCommentVNode("", true),
              showCloseButton.value && isCloseAtEnd.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 3,
                class: vue.normalizeClass(closeClass.value),
                style: vue.normalizeStyle(semanticStyle("close")),
                disabled: isCloseButtonDisabled.value,
                type: "button",
                "aria-label": "Close",
                onClick: handleCloseButtonClick
              }, [
                vue.createVNode(vue.unref(ADrawerRenderNode), { node: resolvedCloseIcon.value }, null, 8, ["node"])
              ], 14, _hoisted_2)) : vue.createCommentVNode("", true)
            ], 6)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(bodyClass.value),
              style: vue.normalizeStyle(semanticStyle("body"))
            }, [
              _ctx.loading ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
                key: 0,
                active: "",
                paragraph: { rows: 4 }
              })) : vue.renderSlot(_ctx.$slots, "default", { key: 1 })
            ], 6),
            hasFooter.value ? (vue.openBlock(), vue.createElementBlock("footer", {
              key: 1,
              class: vue.normalizeClass(footerClass.value),
              style: vue.normalizeStyle(semanticStyle("footer"))
            }, [
              vue.renderSlot(_ctx.$slots, "footer")
            ], 6)) : vue.createCommentVNode("", true)
          ], 6)
        ], 38)), [
          [vue.vShow, _ctx.open]
        ]) : vue.createCommentVNode("", true)
      ], 8, ["to", "disabled"]);
    };
  }
});
exports.default = _sfc_main;
