import { defineComponent, useSlots, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, createElementBlock, renderSlot, createVNode, unref, createCommentVNode, createElementVNode } from "vue";
import { tagProps, tagEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATag"
  },
  __name: "tag",
  props: tagProps,
  emits: tagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const ARenderNode = defineComponent({
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
    const isPresetColor = computed(() => presetColors.includes(props.color));
    const resolvedVariant = computed(() => props.variant ?? "filled");
    const isBorderless = computed(() => props.bordered === false && props.variant === void 0);
    const tagComponent = computed(() => props.href && !props.disabled ? "a" : "span");
    const linkHref = computed(() => props.disabled ? void 0 : props.href);
    const linkTarget = computed(() => props.disabled ? void 0 : props.target);
    const linkRel = computed(() => props.disabled ? void 0 : props.rel);
    const hasIcon = computed(() => props.icon !== void 0 || Boolean(slots.icon));
    const showClose = computed(() => props.closable && props.closeIcon !== false && props.closeIcon !== null);
    const closeIconContent = computed(() => props.closeIcon ?? "×");
    const tagClass = computed(() => [
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
    const tagStyle = computed(() => [
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
      return openBlock(), createBlock(resolveDynamicComponent(tagComponent.value), {
        class: normalizeClass(["aheart-tag", tagClass.value]),
        style: normalizeStyle(tagStyle.value),
        href: linkHref.value,
        target: linkTarget.value,
        rel: linkRel.value,
        title: _ctx.title,
        "aria-disabled": _ctx.disabled ? "true" : void 0
      }, {
        default: withCtx(() => [
          hasIcon.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-tag__icon", _ctx.classNames.icon]),
            style: normalizeStyle(_ctx.styles.icon)
          }, [
            renderSlot(_ctx.$slots, "icon", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.icon }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-tag__content", _ctx.classNames.content]),
            style: normalizeStyle(_ctx.styles.content)
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 6),
          showClose.value ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: normalizeClass(["aheart-tag__close", _ctx.classNames.close]),
            style: normalizeStyle(_ctx.styles.close),
            type: "button",
            "aria-label": "Close",
            disabled: _ctx.disabled,
            onClick: handleClose
          }, [
            renderSlot(_ctx.$slots, "closeIcon", {}, () => [
              createVNode(unref(ARenderNode), { node: closeIconContent.value }, null, 8, ["node"])
            ])
          ], 14, _hoisted_1)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class", "style", "href", "target", "rel", "title", "aria-disabled"]);
    };
  }
});
export {
  _sfc_main as default
};
