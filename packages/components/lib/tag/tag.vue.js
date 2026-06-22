"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATag"
  },
  __name: "tag",
  props: types.tagProps,
  emits: types.tagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
      name: "ATagRenderNode",
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
    const presetColors = ["default", "primary", "success", "processing", "warning", "danger", "error"];
    const isPresetColor = vue.computed(() => presetColors.includes(props.color));
    const resolvedVariant = vue.computed(() => props.variant ?? "filled");
    const isBorderless = vue.computed(() => props.bordered === false && props.variant === void 0);
    const tagComponent = vue.computed(() => props.href && !props.disabled ? "a" : "span");
    const linkHref = vue.computed(() => props.disabled ? void 0 : props.href);
    const linkTarget = vue.computed(() => props.disabled ? void 0 : props.target);
    const linkRel = vue.computed(() => props.disabled ? void 0 : props.rel);
    const hasIcon = vue.computed(() => props.icon !== void 0 || Boolean(slots.icon));
    const showClose = vue.computed(() => props.closable && props.closeIcon !== false && props.closeIcon !== null);
    const closeIconContent = vue.computed(() => props.closeIcon ?? "×");
    const tagClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      `aheart-tag--${resolvedVariant.value}`,
      {
        [`aheart-tag--${props.color}`]: isPresetColor.value,
        "is-custom-color": !isPresetColor.value,
        "is-borderless": isBorderless.value,
        "is-closable": showClose.value,
        "is-disabled": props.disabled,
        "is-link": Boolean(props.href && !props.disabled)
      }
    ]);
    const tagStyle = vue.computed(() => [
      !isPresetColor.value ? {
        "--aheart-tag-color": props.color
      } : void 0,
      props.style,
      props.styles.root
    ]);
    const handleClose = (event) => {
      if (props.disabled) {
        event.preventDefault();
        return;
      }
      emit("close", event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(tagComponent.value), {
        class: vue.normalizeClass(["aheart-tag", tagClass.value]),
        style: vue.normalizeStyle(tagStyle.value),
        href: linkHref.value,
        target: linkTarget.value,
        rel: linkRel.value,
        title: _ctx.title,
        "aria-disabled": _ctx.disabled ? "true" : void 0
      }, {
        default: vue.withCtx(() => [
          hasIcon.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-tag__icon", _ctx.classNames.icon]),
            style: vue.normalizeStyle(_ctx.styles.icon)
          }, [
            vue.renderSlot(_ctx.$slots, "icon", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.icon }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-tag__content", _ctx.classNames.content]),
            style: vue.normalizeStyle(_ctx.styles.content)
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 6),
          showClose.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: vue.normalizeClass(["aheart-tag__close", _ctx.classNames.close]),
            style: vue.normalizeStyle(_ctx.styles.close),
            type: "button",
            "aria-label": "Close",
            disabled: _ctx.disabled,
            onClick: handleClose
          }, [
            vue.renderSlot(_ctx.$slots, "closeIcon", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: closeIconContent.value }, null, 8, ["node"])
            ])
          ], 14, _hoisted_1)) : vue.createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style", "href", "target", "rel", "title", "aria-disabled"]);
    };
  }
});
exports.default = _sfc_main;
