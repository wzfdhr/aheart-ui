import { defineComponent, ref, computed, toRef, openBlock, createElementBlock, normalizeClass, normalizeStyle, unref, createVNode, createCommentVNode, createElementVNode, renderSlot } from "vue";
import { useTypographyCopyable, TypographyRenderNode } from "./copyable.js";
import { paragraphProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["title", "aria-label", "tabindex", "disabled"];
const _hoisted_2 = ["title", "aria-label", "tabindex", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AParagraph"
  },
  __name: "paragraph",
  props: paragraphProps,
  setup(__props) {
    const props = __props;
    const contentRef = ref(null);
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
    const isEllipsis = computed(() => Boolean(props.ellipsis));
    const ellipsisRows = computed(() => {
      var _a;
      if (typeof props.ellipsis === "object" && ((_a = props.ellipsis) == null ? void 0 : _a.rows) && props.ellipsis.rows > 0) {
        return props.ellipsis.rows;
      }
      return 1;
    });
    const isMultilineEllipsis = computed(() => isEllipsis.value && ellipsisRows.value > 1);
    const paragraphClass = computed(() => [
      {
        [`aheart-typography-paragraph--${props.type}`]: props.type,
        "is-strong": props.strong,
        "is-italic": props.italic,
        "is-ellipsis": isEllipsis.value,
        "is-ellipsis-multiline": isMultilineEllipsis.value,
        "is-mark": props.mark,
        "is-disabled": props.disabled
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const paragraphStyle = computed(() => [
      isEllipsis.value ? { "--aheart-typography-ellipsis-rows": ellipsisRows.value } : void 0,
      props.style,
      semanticStyles.value.root
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("p", {
        class: normalizeClass(["aheart-typography-paragraph", paragraphClass.value]),
        style: normalizeStyle(paragraphStyle.value)
      }, [
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
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
