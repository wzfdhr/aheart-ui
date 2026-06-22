"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-card__cover"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-card__header"
};
const _hoisted_3 = { class: "aheart-card__title" };
const _hoisted_4 = {
  key: 0,
  class: "aheart-card__extra"
};
const _hoisted_5 = { class: "aheart-card__body" };
const _hoisted_6 = {
  key: 0,
  class: "aheart-card__loading",
  "aria-busy": "true",
  "aria-live": "polite"
};
const _hoisted_7 = {
  key: 2,
  class: "aheart-card__actions"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACard"
  },
  __name: "card",
  props: types.cardProps,
  setup(__props) {
    const props = __props;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const hasHeader = vue.computed(() => Boolean(props.title || slots.title || props.extra || slots.extra));
    const hasExtra = vue.computed(() => Boolean(props.extra || slots.extra));
    const cardClass = vue.computed(() => [
      `aheart-card--${resolvedSize.value}`,
      {
        "is-borderless": !props.bordered,
        "is-hoverable": props.hoverable,
        "is-loading": props.loading
      }
    ]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-card", cardClass.value]),
        role: "region"
      }, [
        _ctx.$slots.cover ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "cover")
        ])) : vue.createCommentVNode("", true),
        hasHeader.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
          vue.createElementVNode("div", _hoisted_3, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ])
          ]),
          hasExtra.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
            ])
          ])) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_5, [
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [..._cache[0] || (_cache[0] = [
            vue.createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            vue.createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            vue.createElementVNode("span", { class: "aheart-card__loading-line is-short" }, null, -1)
          ])])) : vue.renderSlot(_ctx.$slots, "default", { key: 1 })
        ]),
        _ctx.$slots.actions ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
          vue.renderSlot(_ctx.$slots, "actions")
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
