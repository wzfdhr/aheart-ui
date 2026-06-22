import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot, toDisplayString, createCommentVNode, Fragment, createElementVNode } from "vue";
import { badgeProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-badge__dot"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-badge__count"
};
const _hoisted_3 = {
  key: 0,
  class: "aheart-badge__status-text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ABadge"
  },
  __name: "badge",
  props: badgeProps,
  setup(__props) {
    const props = __props;
    const displayCount = computed(() => {
      if (typeof props.count === "number" && props.count > props.overflowCount) {
        return `${props.overflowCount}+`;
      }
      return props.count;
    });
    const badgeClass = computed(() => ({
      "aheart-badge--status": props.status,
      "aheart-badge--standalone": props.count === void 0 && !props.dot
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-badge", badgeClass.value])
      }, [
        renderSlot(_ctx.$slots, "default"),
        _ctx.dot ? (openBlock(), createElementBlock("sup", _hoisted_1)) : _ctx.count !== void 0 ? (openBlock(), createElementBlock("sup", _hoisted_2, toDisplayString(displayCount.value), 1)) : createCommentVNode("", true),
        _ctx.status ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          createElementVNode("span", {
            class: normalizeClass(["aheart-badge__status-dot", `aheart-badge__status-dot--${_ctx.status}`])
          }, null, 2),
          _ctx.text ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.text), 1)) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
