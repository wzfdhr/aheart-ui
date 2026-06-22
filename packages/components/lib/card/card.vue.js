"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-card__loading",
  "aria-busy": "true",
  "aria-live": "polite"
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
    const isBorderless = vue.computed(() => {
      if (props.variant) {
        return props.variant === "borderless";
      }
      return !props.bordered;
    });
    const showActions = vue.computed(() => {
      var _a;
      return Boolean(slots.actions) || Boolean((_a = props.actions) == null ? void 0 : _a.length);
    });
    const cardClass = vue.computed(() => {
      var _a;
      return [
        `aheart-card--${resolvedSize.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-borderless": isBorderless.value,
          "aheart-card--inner": props.type === "inner",
          "is-hoverable": props.hoverable,
          "is-loading": props.loading
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const coverClass = vue.computed(() => {
      var _a;
      return ["aheart-card__cover", (_a = props.classNames) == null ? void 0 : _a.cover];
    });
    const coverStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.cover;
    });
    const headerClass = vue.computed(() => {
      var _a;
      return ["aheart-card__header", (_a = props.classNames) == null ? void 0 : _a.header];
    });
    const headerStyle = vue.computed(() => {
      var _a;
      return [props.headStyle, (_a = props.styles) == null ? void 0 : _a.header];
    });
    const titleClass = vue.computed(() => {
      var _a;
      return ["aheart-card__title", (_a = props.classNames) == null ? void 0 : _a.title];
    });
    const titleStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const extraClass = vue.computed(() => {
      var _a;
      return ["aheart-card__extra", (_a = props.classNames) == null ? void 0 : _a.extra];
    });
    const extraStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.extra;
    });
    const bodyClass = vue.computed(() => {
      var _a;
      return ["aheart-card__body", (_a = props.classNames) == null ? void 0 : _a.body];
    });
    const bodyStyleValue = vue.computed(() => {
      var _a;
      return [props.bodyStyle, (_a = props.styles) == null ? void 0 : _a.body];
    });
    const actionsClass = vue.computed(() => {
      var _a;
      return ["aheart-card__actions", (_a = props.classNames) == null ? void 0 : _a.actions];
    });
    const actionsStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-card", cardClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        role: "region"
      }, [
        _ctx.$slots.cover ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(coverClass.value),
          style: vue.normalizeStyle(coverStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "cover")
        ], 6)) : vue.createCommentVNode("", true),
        hasHeader.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(headerClass.value),
          style: vue.normalizeStyle(headerStyle.value)
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(titleClass.value),
            style: vue.normalizeStyle(titleStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ])
          ], 6),
          hasExtra.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(extraClass.value),
            style: vue.normalizeStyle(extraStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(bodyClass.value),
          style: vue.normalizeStyle(bodyStyleValue.value)
        }, [
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [..._cache[0] || (_cache[0] = [
            vue.createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            vue.createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            vue.createElementVNode("span", { class: "aheart-card__loading-line is-short" }, null, -1)
          ])])) : vue.renderSlot(_ctx.$slots, "default", { key: 1 })
        ], 6),
        showActions.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(actionsClass.value),
          style: vue.normalizeStyle(actionsStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "actions", {}, () => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.actions, (action, index) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: index,
                class: "aheart-card__action"
              }, vue.toDisplayString(action), 1);
            }), 128))
          ])
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
