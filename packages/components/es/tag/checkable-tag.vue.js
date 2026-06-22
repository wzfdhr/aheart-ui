import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createVNode, unref, createCommentVNode, createElementVNode } from "vue";
import { checkableTagProps, checkableTagEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["title", "aria-pressed", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACheckableTag"
  },
  __name: "checkable-tag",
  props: checkableTagProps,
  emits: checkableTagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const ARenderNode = defineComponent({
      name: "ACheckableTagRenderNode",
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
    const hasIcon = computed(() => props.icon !== void 0 || Boolean(slots.icon));
    const tagClass = computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "is-checked": props.checked,
        "is-disabled": props.disabled
      }
    ]);
    const tagStyle = computed(() => [props.style, props.styles.root]);
    const handleClick = (event) => {
      if (props.disabled) {
        return;
      }
      const nextChecked = !props.checked;
      emit("update:checked", nextChecked);
      emit("change", nextChecked, event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["aheart-tag aheart-checkable-tag", tagClass.value]),
        style: normalizeStyle(tagStyle.value),
        type: "button",
        title: _ctx.title,
        "aria-pressed": _ctx.checked,
        disabled: _ctx.disabled,
        onClick: handleClick
      }, [
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
        ], 6)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
