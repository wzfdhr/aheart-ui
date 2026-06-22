"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["title", "aria-pressed", "disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACheckableTag"
  },
  __name: "checkable-tag",
  props: types.checkableTagProps,
  emits: types.checkableTagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
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
    const hasIcon = vue.computed(() => props.icon !== void 0 || Boolean(slots.icon));
    const tagClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      {
        "is-checked": props.checked,
        "is-disabled": props.disabled
      }
    ]);
    const tagStyle = vue.computed(() => [props.style, props.styles.root]);
    const handleClick = (event) => {
      if (props.disabled) {
        return;
      }
      const nextChecked = !props.checked;
      emit("update:checked", nextChecked);
      emit("change", nextChecked, event);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("button", {
        class: vue.normalizeClass(["aheart-tag aheart-checkable-tag", tagClass.value]),
        style: vue.normalizeStyle(tagStyle.value),
        type: "button",
        title: _ctx.title,
        "aria-pressed": _ctx.checked,
        disabled: _ctx.disabled,
        onClick: handleClick
      }, [
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
        ], 6)
      ], 14, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
