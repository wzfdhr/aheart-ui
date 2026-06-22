"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
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
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ABadge"
  },
  __name: "badge",
  props: types.badgeProps,
  setup(__props) {
    const props = __props;
    const displayCount = vue.computed(() => {
      if (typeof props.count === "number" && props.count > props.overflowCount) {
        return `${props.overflowCount}+`;
      }
      return props.count;
    });
    const badgeClass = vue.computed(() => ({
      "aheart-badge--status": props.status,
      "aheart-badge--standalone": props.count === void 0 && !props.dot
    }));
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-badge", badgeClass.value])
      }, [
        vue.renderSlot(_ctx.$slots, "default"),
        _ctx.dot ? (vue.openBlock(), vue.createElementBlock("sup", _hoisted_1)) : _ctx.count !== void 0 ? (vue.openBlock(), vue.createElementBlock("sup", _hoisted_2, vue.toDisplayString(displayCount.value), 1)) : vue.createCommentVNode("", true),
        _ctx.status ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-badge__status-dot", `aheart-badge__status-dot--${_ctx.status}`])
          }, null, 2),
          _ctx.text ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(_ctx.text), 1)) : vue.createCommentVNode("", true)
        ], 64)) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
