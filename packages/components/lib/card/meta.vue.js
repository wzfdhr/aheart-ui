"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACardMeta"
  },
  __name: "meta",
  props: types.cardMetaProps,
  setup(__props) {
    const props = __props;
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
      name: "ACardMetaRenderNode",
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
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false;
    const hasAvatar = vue.computed(() => hasRenderable(props.avatar) || Boolean(slots.avatar));
    const hasTitle = vue.computed(() => hasRenderable(props.title) || Boolean(slots.title));
    const hasDescription = vue.computed(() => hasRenderable(props.description) || Boolean(slots.description));
    const hasSection = vue.computed(() => hasTitle.value || hasDescription.value || Boolean(slots.default));
    const metaClass = vue.computed(() => {
      var _a;
      return [props.className, props.rootClassName, (_a = props.classNames) == null ? void 0 : _a.root];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-card-meta", metaClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        hasAvatar.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["aheart-card-meta__avatar", (_a = _ctx.classNames) == null ? void 0 : _a.avatar]),
          style: vue.normalizeStyle((_b = _ctx.styles) == null ? void 0 : _b.avatar)
        }, [
          vue.renderSlot(_ctx.$slots, "avatar", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: _ctx.avatar }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        hasSection.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(["aheart-card-meta__section", (_c = _ctx.classNames) == null ? void 0 : _c.section]),
          style: vue.normalizeStyle((_d = _ctx.styles) == null ? void 0 : _d.section)
        }, [
          hasTitle.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(["aheart-card-meta__title", (_e = _ctx.classNames) == null ? void 0 : _e.title]),
            style: vue.normalizeStyle((_f = _ctx.styles) == null ? void 0 : _f.title)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          hasDescription.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(["aheart-card-meta__description", (_g = _ctx.classNames) == null ? void 0 : _g.description]),
            style: vue.normalizeStyle((_h = _ctx.styles) == null ? void 0 : _h.description)
          }, [
            vue.renderSlot(_ctx.$slots, "description", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.description }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          !hasTitle.value && !hasDescription.value ? vue.renderSlot(_ctx.$slots, "default", { key: 2 }) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
