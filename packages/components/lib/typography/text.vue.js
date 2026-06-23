"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const copyable = require("./copyable.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["title", "aria-label", "tabindex", "disabled"];
const _hoisted_2 = ["title", "aria-label", "tabindex", "disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AText"
  },
  __name: "text",
  props: types.textProps,
  setup(__props) {
    const props = __props;
    const contentRef = vue.ref(null);
    const tagName = vue.computed(() => {
      if (props.code)
        return "code";
      if (props.keyboard)
        return "kbd";
      if (props.delete)
        return "del";
      if (props.underline)
        return "u";
      if (props.mark)
        return "mark";
      if (props.italic)
        return "em";
      if (props.strong)
        return "strong";
      return "span";
    });
    const semanticInfo = vue.computed(() => ({ props }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const actionPlacement = vue.computed(() => {
      var _a;
      return ((_a = props.actions) == null ? void 0 : _a.placement) ?? "end";
    });
    const { isCopyable, copyIcon, copyTitle, copyTabIndex, handleCopy } = copyable.useTypographyCopyable(
      vue.toRef(props, "copyable"),
      contentRef,
      vue.computed(() => props.disabled)
    );
    const textClass = vue.computed(() => [
      {
        [`aheart-typography-text--${props.type}`]: props.type,
        "is-strong": props.strong,
        "is-italic": props.italic,
        "is-mark": props.mark,
        "is-disabled": props.disabled
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const textStyle = vue.computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(tagName.value), {
        class: vue.normalizeClass(["aheart-typography-text", textClass.value]),
        style: vue.normalizeStyle(textStyle.value)
      }, {
        default: vue.withCtx(() => [
          vue.unref(isCopyable) && actionPlacement.value === "start" ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "aheart-typography__copy",
            type: "button",
            title: vue.unref(copyTitle),
            "aria-label": vue.unref(copyTitle) || "Copy",
            tabindex: vue.unref(copyTabIndex),
            disabled: _ctx.disabled,
            onClick: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => vue.unref(handleCopy) && vue.unref(handleCopy)(...args))
          }, [
            vue.createVNode(vue.unref(copyable.TypographyRenderNode), { node: vue.unref(copyIcon) }, null, 8, ["node"])
          ], 8, _hoisted_1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            ref_key: "contentRef",
            ref: contentRef,
            class: "aheart-typography__content"
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 512),
          vue.unref(isCopyable) && actionPlacement.value === "end" ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: "aheart-typography__copy",
            type: "button",
            title: vue.unref(copyTitle),
            "aria-label": vue.unref(copyTitle) || "Copy",
            tabindex: vue.unref(copyTabIndex),
            disabled: _ctx.disabled,
            onClick: _cache[1] || (_cache[1] = //@ts-ignore
            (...args) => vue.unref(handleCopy) && vue.unref(handleCopy)(...args))
          }, [
            vue.createVNode(vue.unref(copyable.TypographyRenderNode), { node: vue.unref(copyIcon) }, null, 8, ["node"])
          ], 8, _hoisted_2)) : vue.createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style"]);
    };
  }
});
exports.default = _sfc_main;
