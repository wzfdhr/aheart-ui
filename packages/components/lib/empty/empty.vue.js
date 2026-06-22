"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["src"];
const _hoisted_2 = {
  key: 1,
  class: "aheart-empty__default-image",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AEmpty"
  },
  __name: "empty",
  props: types.emptyProps,
  setup(__props) {
    const props = __props;
    const config = context.useAheartConfig();
    const slots = vue.useSlots();
    const imageUrl = vue.computed(() => typeof props.image === "string" && props.image ? props.image : void 0);
    const showImage = vue.computed(() => Boolean(slots.image) || props.image !== false);
    const resolvedDescription = vue.computed(() => {
      var _a, _b;
      if (props.description === false) {
        return "";
      }
      if (typeof props.description === "string") {
        return props.description;
      }
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.empty) == null ? void 0 : _b.description) || "No Data";
    });
    const showDescription = vue.computed(() => Boolean(slots.description) || props.description !== false);
    const emptyClass = vue.computed(() => {
      var _a;
      return [props.className, props.rootClassName, (_a = props.classNames) == null ? void 0 : _a.root];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const imageClass = vue.computed(() => {
      var _a;
      return ["aheart-empty__image", (_a = props.classNames) == null ? void 0 : _a.image];
    });
    const imageStyleValue = vue.computed(() => {
      var _a;
      return [props.imageStyle, (_a = props.styles) == null ? void 0 : _a.image];
    });
    const descriptionClass = vue.computed(() => {
      var _a;
      return ["aheart-empty__description", (_a = props.classNames) == null ? void 0 : _a.description];
    });
    const descriptionStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.description;
    });
    const footerClass = vue.computed(() => {
      var _a;
      return ["aheart-empty__footer", (_a = props.classNames) == null ? void 0 : _a.footer];
    });
    const footerStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.footer;
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-empty", emptyClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        showImage.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(imageClass.value),
          style: vue.normalizeStyle(imageStyleValue.value)
        }, [
          vue.renderSlot(_ctx.$slots, "image", {}, () => [
            imageUrl.value ? (vue.openBlock(), vue.createElementBlock("img", {
              key: 0,
              class: "aheart-empty__image-element",
              src: imageUrl.value,
              alt: ""
            }, null, 8, _hoisted_1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, "∅"))
          ])
        ], 6)) : vue.createCommentVNode("", true),
        showDescription.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(descriptionClass.value),
          style: vue.normalizeStyle(descriptionStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "description", {}, () => [
            vue.createTextVNode(vue.toDisplayString(resolvedDescription.value), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(footerClass.value),
          style: vue.normalizeStyle(footerStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
