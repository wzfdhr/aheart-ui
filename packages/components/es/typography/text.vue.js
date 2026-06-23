import { defineComponent, ref, computed, toRef, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, unref, createElementBlock, createVNode, createCommentVNode, createElementVNode, renderSlot } from "vue";
import { useTypographyCopyable, TypographyRenderNode } from "./copyable.js";
import { textProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["title", "aria-label", "tabindex", "disabled"];
const _hoisted_2 = ["title", "aria-label", "tabindex", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AText"
  },
  __name: "text",
  props: textProps,
  setup(__props) {
    const props = __props;
    const contentRef = ref(null);
    const tagName = computed(() => {
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
    const semanticInfo = computed(() => ({ props }));
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const actionPlacement = computed(() => {
      var _a;
      return ((_a = props.actions) == null ? void 0 : _a.placement) ?? "end";
    });
    const { isCopyable, copyIcon, copyTitle, copyTabIndex, handleCopy } = useTypographyCopyable(
      toRef(props, "copyable"),
      contentRef,
      computed(() => props.disabled)
    );
    const textClass = computed(() => [
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
    const textStyle = computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(tagName.value), {
        class: normalizeClass(["aheart-typography-text", textClass.value]),
        style: normalizeStyle(textStyle.value)
      }, {
        default: withCtx(() => [
          unref(isCopyable) && actionPlacement.value === "start" ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "aheart-typography__copy",
            type: "button",
            title: unref(copyTitle),
            "aria-label": unref(copyTitle) || "Copy",
            tabindex: unref(copyTabIndex),
            disabled: _ctx.disabled,
            onClick: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => unref(handleCopy) && unref(handleCopy)(...args))
          }, [
            createVNode(unref(TypographyRenderNode), { node: unref(copyIcon) }, null, 8, ["node"])
          ], 8, _hoisted_1)) : createCommentVNode("", true),
          createElementVNode("span", {
            ref_key: "contentRef",
            ref: contentRef,
            class: "aheart-typography__content"
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 512),
          unref(isCopyable) && actionPlacement.value === "end" ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "aheart-typography__copy",
            type: "button",
            title: unref(copyTitle),
            "aria-label": unref(copyTitle) || "Copy",
            tabindex: unref(copyTabIndex),
            disabled: _ctx.disabled,
            onClick: _cache[1] || (_cache[1] = //@ts-ignore
            (...args) => unref(handleCopy) && unref(handleCopy)(...args))
          }, [
            createVNode(unref(TypographyRenderNode), { node: unref(copyIcon) }, null, 8, ["node"])
          ], 8, _hoisted_2)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};
